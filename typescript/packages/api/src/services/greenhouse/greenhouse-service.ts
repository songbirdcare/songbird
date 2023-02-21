import axios, { AxiosInstance } from "axios";
import ExcelJS from "exceljs";
import { promises } from "fs";
import { setTimeout } from "timers/promises";
import { z } from "zod";

import type { ObjectWriter } from "../object-writer";
import { SUPPLEMENTAL_IDS } from "./supplemental-ids";

const ERROR_TIMEOUT = 5_000;
const RATE_LIMIT_PERIOD = 10_000 + 2_000;
const ACTIVITY_FEED_CHUNK_SIZE = 50;
const CANIDATE_PAGE_SIZE = 500;
const CANIDATE_MAX_ATTEMPTS = 10;
const CIRCUIT_BREAKER_MAX = 1000;
const RBT_DEPARTMENT_ID = 4023806003;
// we are technically tracking from the beginning of 2022
// but we give it a 6 month grace period so we don't miss anything
const CREATED_AFTER_DATE = new Date("2021-06-01").toISOString();

const COLUMNS: (keyof StageData)[] = [
  "applied",
  "applicationReview",
  "rejected",
  "recruiterScreen",
  "unresponsive",
  "createdOffer",
  "accepted",
  "unrejected",
];

const COLUMNS_FOR_SHEET: Partial<ExcelJS.Column>[] = [
  { header: "Id", key: "id", width: 25 },
  ...COLUMNS.map((col) => ({
    header: col,
    key: col,
    width: 25,
  })),
];

export class GreenhouseServiceImpl implements GreenhouseService {
  #client: AxiosInstance;
  constructor(private readonly objectWriter: ObjectWriter, apiKey: string) {
    this.#client = axios.create({
      baseURL: "https://harvest.greenhouse.io/v1/",
      timeout: 30_000,
      headers: { Authorization: `Basic ${apiKey}` },
    });
  }

  async writeReport(): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    const filePathFor = (name: string) => `greenhouse/${today}/${name}`;

    console.log("Fetching jobs");

    const jobs = await this.getJobs();

    await this.objectWriter.writeFromMemory({
      contents: JSON.stringify(jobs),
      destination: filePathFor("jobs.json"),
    });

    const jobIds = jobs.map((job) => job.id);

    console.log(`Fetching candidate ids for ${jobIds.length} jobs`);
    const ids = Array.from(await this.getCanditateIds(jobIds));

    await this.objectWriter.writeFromMemory({
      contents: JSON.stringify(ids),
      destination: filePathFor("candidate-ids.json"),
    });

    const allIds = (() => {
      const set = new Set(ids);

      for (const id of SUPPLEMENTAL_IDS) {
        set.add(id);
      }

      return Array.from(set);
    })();

    console.log(
      `Fetching stage data for ${ids.length} candidates ${allIds.length} total`
    );

    const feedData = await this.getStageData(allIds);

    await this.objectWriter.writeFromMemory({
      contents: JSON.stringify(feedData),
      destination: filePathFor("feed-data.json"),
    });

    console.log("Preparing output");
    await this.export({
      path: "./greenhouse-report.xlsx",
      stageData: feedData.stageData,
    });

    await this.objectWriter.writeFromDisk({
      src: "./greenhouse-report.xlsx",
      destination: filePathFor("report.xlsx"),
    });

    await promises.rm("./greenhouse-report.xlsx");
  }

  async getCanditateIds(jobIds: number[]): Promise<Set<string>> {
    const acc: Set<string> = new Set();

    for (const jobId of jobIds) {
      await this.#getCandidatesForJob(acc, jobId);
      console.log(`Acc size: ${acc.size}`);
    }
    return acc;
  }

  async #getCandidatesForJob(acc: Set<string>, jobId: number): Promise<void> {
    for (let page = 1; page < CIRCUIT_BREAKER_MAX; page++) {
      const ids = await this.#getCanditatePage(jobId, page);

      for (const id of ids) {
        acc.add(id);
      }

      if (ids.length === 0) {
        return;
      }
    }

    throw new Error("Too many iterations getting ids");
  }

  async #getCanditatePage(jobId: number, page: number): Promise<string[]> {
    for (let attempt = 0; attempt < CANIDATE_MAX_ATTEMPTS; attempt++) {
      console.log(
        `Fetching candidtate: jobId:${jobId} page:${page} attempt:${attempt}`
      );
      try {
        const resp = await this.#client.get(
          `/candidates?page=${page}&per_page=${CANIDATE_PAGE_SIZE}&job_id=${jobId}&created_after=${CREATED_AFTER_DATE}`
        );

        return ZCanditateListResponse.array()
          .parse(resp.data)
          .map((v) => `${v.id}`);
      } catch (e) {
        console.log("Get candidate page error");
        await setTimeout(ERROR_TIMEOUT);
      }
    }
    throw new Error(
      `could not fetch data after ${CANIDATE_MAX_ATTEMPTS} attempts`
    );
  }

  async export({ stageData, path }: ExportArguments): Promise<void> {
    if (!path.endsWith(".xlsx")) {
      throw new Error("path must end with xlsx");
    }

    if (Object.keys(stageData).length === 0) {
      throw new Error("No data to export");
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Harvest Stage Data");

    sheet.columns = COLUMNS_FOR_SHEET;

    for (const [id, data] of Object.entries(stageData)) {
      const row = sheet.addRow({
        id,
        ...data,
      });

      for (const col of COLUMNS) {
        if (data[col]) {
          row.getCell(col).numFmt = "mm/dd/yyyy";
        }
      }
    }
    await workbook.xlsx.writeFile(path);
  }

  async getStageData(ids: string[]): Promise<Report> {
    const feeds = await this.#getActivityFeeds(ids);
    const stageData = Object.fromEntries(
      Object.entries(feeds).map(([k, v]) => [k, this.#parseStageData(v)])
    );

    return {
      feeds,
      stageData,
    };
  }

  #parseStageData = (items: ActivityItem[]): StageData => {
    const stageData: StageData = {
      applied: null,
      applicationReview: null,
      rejected: null,
      unrejected: null,
      recruiterScreen: null,
      unresponsive: null,
      accepted: null,
      createdOffer: null,
    };

    for (const { body, subject, createdAt } of items) {
      if (!body) {
        continue;
      }

      // add case for application review
      if (body.includes("applied online to the")) {
        stageData.applied = createdAt;
      } else if (body.includes("moved into recruiter screen")) {
        stageData.recruiterScreen = createdAt;
      } else if (body.includes("moved into application review")) {
        stageData.applicationReview = createdAt;
      } else if (body.includes("was moved into offer")) {
        stageData.createdOffer = createdAt;
      } else if (body.includes("was moved into unresponsive")) {
        stageData.unresponsive = createdAt;
      } else if (
        body.includes("marked an offer") &&
        body.includes("accepted")
      ) {
        stageData.accepted = createdAt;
      } else if (body.includes("unrejected from")) {
        stageData.unrejected = createdAt;
      } else if (body.includes("rejected from")) {
        stageData.rejected = createdAt;
      }

      if (!subject) {
        continue;
      }

      if (subject.includes("unrejected from")) {
        stageData.unrejected = createdAt;
      } else if (subject.includes("rejected from")) {
        stageData.rejected = createdAt;
      }
    }

    return stageData;
  };

  async #getActivityFeeds(
    ids: string[]
  ): Promise<Record<string, ActivityItem[]>> {
    const acc: Record<string, ActivityItem[]> = {};
    for (let i = 0; i < ids.length; i += ACTIVITY_FEED_CHUNK_SIZE) {
      console.log(
        `Fetching ${i} to ${i + ACTIVITY_FEED_CHUNK_SIZE} of ${ids.length}`
      );
      const chunk = ids.slice(i, i + ACTIVITY_FEED_CHUNK_SIZE);
      if (chunk.length === 0) {
        continue;
      }

      const activityFeeds = await Promise.all(chunk.map(this.#getActivityFeed));

      for (const [idx, activityFeed] of activityFeeds.entries()) {
        const id = chunk[idx];
        if (!id) {
          console.error({
            chunk,
            activityFeeds,
            message: "Invalid id",
          });
          continue;
        }
        acc[id] = activityFeed;
      }

      if (i + ACTIVITY_FEED_CHUNK_SIZE < ids.length) {
        console.log(`Sleeping for ${RATE_LIMIT_PERIOD}ms`);
        await setTimeout(RATE_LIMIT_PERIOD);
      }
    }

    return acc;
  }

  #getActivityFeed = async (id: string): Promise<ActivityItem[]> => {
    for (let attempt = 0; attempt <= CANIDATE_MAX_ATTEMPTS; attempt++) {
      try {
        console.log(`Get get actvity feed id ${id} attempt: ${attempt}`);
        const resp = await this.#client.get(`/candidates/${id}/activity_feed`);
        return ZRawActivity.transform((val) => ({
          createdAt: new Date(val.created_at),
          subject: val.subject?.toLowerCase() ?? undefined,
          body: val.body?.toLowerCase() ?? undefined,
        }))
          .array()
          .parse(resp.data.activities)
          .reverse();
      } catch (e: any) {
        if (e.message === "Request failed with status code 404") {
          return [];
        }

        console.log("Get activity feed error");
        await setTimeout(ERROR_TIMEOUT);
      }
    }
    throw new Error("could not fetch activity feed");
  };

  getJobs = async () => {
    const acc: JobResponse[] = [];
    for (let page = 1; page <= CIRCUIT_BREAKER_MAX; page++) {
      const resp = await this.#client.get(
        `/jobs?page=${page}&per_page=${CANIDATE_PAGE_SIZE}&department_id=${RBT_DEPARTMENT_ID}`
      );

      console.log(`Fetched ${page} pages of jobs`);

      const jobs = ZJobResponse.array().parse(resp.data);

      if (jobs.length === 0) {
        return acc;
      }

      acc.push(...jobs);

      if (page % 10 === 0) {
        await setTimeout(RATE_LIMIT_PERIOD);
      }
    }

    throw new Error("could not fetch all jobs");
  };
}

interface GreenhouseService {
  writeReport(): Promise<void>;
  getCanditateIds(jobIds: number[]): Promise<Set<string>>;
  getStageData(ids: string[]): Promise<Report>;
  export(args: ExportArguments): Promise<void>;
  getJobs(): Promise<JobResponse[]>;
}
interface ExportArguments {
  path: string;
  stageData: Record<string, StageData>;
}

interface ActivityItem {
  createdAt: Date;
  subject: string | undefined;
  body: string;
}

const ZRawActivity = z.object({
  id: z.number(),
  created_at: z.string(),
  subject: z.string().nullable(),
  body: z.string(),
});

const ZCanditateListResponse = z.object({
  id: z.number(),
});

interface StageData {
  applied: Date | null;
  applicationReview: Date | null;
  rejected: Date | null;
  recruiterScreen: Date | null;
  unresponsive: Date | null;
  createdOffer: Date | null;
  accepted: Date | null;
  unrejected: Date | null;
}

interface Report {
  feeds: Record<string, ActivityItem[]>;
  stageData: Record<string, StageData>;
}

const ZJobResponse = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["open", "closed", "draft"]),
});

type JobResponse = z.infer<typeof ZJobResponse>;

import axios, { AxiosInstance } from "axios";
import ExcelJS from "exceljs";
import { promises } from "fs";
import { setTimeout } from "timers/promises";
import { z } from "zod";

const TIMEOUT = 5_000;
const CHUNK_SIZE = 10;
const CANIDATE_PAGE_SIZE = 500;
const CANIDATE_MAX_ATTEMPTS = 10;
const CIRCUIT_BREAKER_MAX = 1000;

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
  constructor(key: string) {
    this.#client = axios.create({
      baseURL: "https://harvest.greenhouse.io/v1/",
      timeout: 30_000,
      headers: { Authorization: `Basic ${key}` },
    });
  }

  async writeReport(): Promise<void> {
    const ids = Array.from(await this.getCanditateIds());
    const feedData = await this.getStageData(ids);

    await this.export({
      path: "./greenhouse-report.xlsx",
      stageData: feedData.stageData,
    });

    await promises.writeFile(
      "./output-data.json",
      JSON.stringify({ ids, feedData })
    );
  }

  async getCanditateIds(): Promise<Set<string>> {
    const acc: Set<string> = new Set();
    for (let page = 1; page < CIRCUIT_BREAKER_MAX; page++) {
      const ids = await this.#getCanditatePage(page);

      for (const id of ids) {
        acc.add(id);
      }

      if (ids.length === 0) {
        return acc;
      }
    }
    throw new Error("Too many iterations getting ids");
  }

  async #getCanditatePage(page: number): Promise<string[]> {
    for (let attempt = 0; attempt < CANIDATE_MAX_ATTEMPTS; attempt++) {
      try {
        const resp = await this.#client.get(
          `/candidates?page=${page}&per_page=${CANIDATE_PAGE_SIZE}`
        );

        return ZCanditateListResponse.array()
          .parse(resp.data)
          .map((v) => `${v.id}`);
      } catch (e) {
        console.log("Get candidate page error");
        await setTimeout(TIMEOUT);
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

    console.log("Start fetching activity feed data");
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      console.log(`Fetching ${i} to ${i + CHUNK_SIZE}`);
      const chunk = ids.slice(i, i + CHUNK_SIZE);
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

      if (i + CHUNK_SIZE < ids.length) {
        console.log(`Sleeping for ${TIMEOUT}ms`);
        await setTimeout(TIMEOUT);
      }
    }

    return acc;
  }

  #getActivityFeed = async (id: string): Promise<ActivityItem[]> => {
    for (let attempt = 0; attempt <= CANIDATE_MAX_ATTEMPTS; attempt++) {
      try {
        if (attempt != 0) {
          console.log(`Get get actvity feed attempt: ${attempt}`);
        }
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
        await setTimeout(TIMEOUT);
      }
    }
    throw new Error("could not fetch activity feed");
  };
}

interface GreenhouseService {
  writeReport(): Promise<void>;
  getCanditateIds(): Promise<Set<string>>;
  getStageData(ids: string[]): Promise<Report>;
  export(args: ExportArguments): Promise<void>;
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

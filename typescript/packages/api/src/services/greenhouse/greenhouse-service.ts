import axios, { AxiosInstance } from "axios";
import { setTimeout } from "timers/promises";
import { z } from "zod";

const TIMEOUT = 5;
const CHUNK_SIZE = 10;

export class GreenhouseServiceImpl implements GreenhouseService {
  #client: AxiosInstance;
  constructor(key: string) {
    this.#client = axios.create({
      baseURL: "https://harvest.greenhouse.io/v1/",
      timeout: 10_0000,
      headers: { Authorization: `Basic ${key}` },
    });
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
    try {
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
      throw e;
    }
  };
}

interface GreenhouseService {
  getStageData(ids: string[]): Promise<Report>;
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

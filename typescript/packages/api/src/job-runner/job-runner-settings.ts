import { z } from "zod";

export const ZJobType = z.enum(["greenhouse"]);

const ZJobRunnerSettings = z.object({
  greenhouse: z.string(),
  jobType: ZJobType,
});

export const JOB_RUNNER_SETTINGS = ZJobRunnerSettings.parse({
  greenhouse: process.env["GREENHOUSE_API_KEY"],
  jobType: "greenhouse",
});

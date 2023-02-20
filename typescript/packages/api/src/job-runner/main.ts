import * as dotenv from "dotenv";
dotenv.config({
  path: ".env.job-runner",
});

import { assertNever } from "@songbird/precedent-iso";

import { GreenhouseServiceImpl } from "../services/greenhouse/greenhouse-service";
import { JOB_RUNNER_SETTINGS } from "./job-runner-settings";

async function main() {
  const startTime = performance.now();

  console.log(`Starting ${JOB_RUNNER_SETTINGS.jobType} job`);

  switch (JOB_RUNNER_SETTINGS.jobType) {
    case "greenhouse":
      await new GreenhouseServiceImpl(
        JOB_RUNNER_SETTINGS.greenhouse
      ).writeReport();
      break;
    default:
      assertNever(JOB_RUNNER_SETTINGS.jobType);
  }

  const endTime = performance.now();
  console.log(`Job took  ${endTime - startTime} milliseconds`);
}

main().then(() => console.log("job done!"));

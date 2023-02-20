import * as dotenv from "dotenv";
dotenv.config({
  path: ".env.job-runner",
});

import { assertNever } from "@songbird/precedent-iso";

import { GreenhouseServiceImpl } from "../services/greenhouse/greenhouse-service";
import { JOB_RUNNER_SETTINGS } from "./job-runner-settings";

async function main() {
  switch (JOB_RUNNER_SETTINGS.jobType) {
    case "greenhouse":
      {
        console.log("Preparing greenhouse report");

        const impl = new GreenhouseServiceImpl(JOB_RUNNER_SETTINGS.greenhouse);

        await impl.writeReport();
      }
      break;
    default:
      assertNever(JOB_RUNNER_SETTINGS.jobType);
  }
}

main().then(() => console.log("job done!"));

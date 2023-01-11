import type { Stage } from "@songbird/precedent-iso";
import { randomUUID } from "crypto";

import { SETTINGS } from "../../settings";

export const CURRENT_VERSION = 1 as const;
export const INITIAL_SLUG = "onboarding";

export function createInitialStages(): Stage[] {
  return [
    {
      id: randomUUID(),
      type: "create_account",
      blockingTasks: [
        {
          id: randomUUID(),
          status: "pending",
          type: "schedule",
        },
      ],
    },
    {
      id: randomUUID(),
      type: "check_insurance_coverage",
      blockingTasks: [
        {
          id: randomUUID(),
          status: "pending",
          type: "form",
          config: SETTINGS.formsort.config.checkInsuranceCoverage,
        },
      ],
    },
    {
      id: randomUUID(),
      type: "submit_records",
      blockingTasks: [
        {
          id: randomUUID(),
          status: "pending",
          type: "form",
          config: SETTINGS.formsort.config.submitRecords,
        },
      ],
    },
    {
      id: randomUUID(),
      type: "commitment_to_care",
      blockingTasks: [
        {
          id: randomUUID(),
          status: "pending",
          type: "signature",
        },
      ],
    },
  ];
}

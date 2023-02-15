import type { OnboardingStage, WorkflowSlug } from "@songbird/precedent-iso";
import { randomUUID } from "crypto";

export const CURRENT_VERSION = 1 as const;
export const INITIAL_SLUG: WorkflowSlug = "onboarding";

export function createInitialStages(): OnboardingStage[] {
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
          slug: "check_insurance_coverage",
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
          slug: "submit_records",
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

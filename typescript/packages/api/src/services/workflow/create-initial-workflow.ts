import {
  assertNever,
  OnboardingStage,
  WorkflowSlug,
} from "@songbird/precedent-iso";
import { randomUUID } from "crypto";

export const CURRENT_VERSION = 1 as const;
export const INITIAL_SLUG: WorkflowSlug = "onboarding";

export class CreateInitialWorkflow {
  static forSlug(workflowSlug: WorkflowSlug): OnboardingStage[] {
    switch (workflowSlug) {
      case "onboarding":
        return CreateInitialWorkflow.forOnboarding();
      case "care_plan":
      case "care_team":
        throw new Error("not implemented");
      default:
        assertNever(workflowSlug);
    }
  }

  static forOnboarding(): OnboardingStage[] {
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
}

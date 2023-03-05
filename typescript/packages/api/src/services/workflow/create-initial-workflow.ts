import {
  assertNever,
  CarePlanStage,
  CareTeamStage,
  OnboardingStage,
  Stage,
  WorkflowSlug,
} from "@songbird/precedent-iso";
import { randomUUID } from "crypto";

export const CURRENT_VERSION = 1 as const;
export const INITIAL_SLUG: WorkflowSlug = "onboarding";

export class CreateInitialWorkflow {
  static forSlug(workflowSlug: WorkflowSlug): Stage[] {
    switch (workflowSlug) {
      case "onboarding":
        return CreateInitialWorkflow.forOnboarding();
      case "care_plan":
        return CreateInitialWorkflow.forCarePlan();
      case "care_team":
        return CreateInitialWorkflow.forCareTeam();
      default:
        assertNever(workflowSlug);
    }
  }

  static forCareTeam(): CareTeamStage[] {
    return [
      {
        id: randomUUID(),
        type: "insurance_approval",
        blockingTasks: [
          {
            id: randomUUID(),
            status: "pending",
            type: "dummy",
          },
        ],
      },
      {
        id: randomUUID(),
        type: "therapist_matching",
        blockingTasks: [
          {
            id: randomUUID(),
            status: "pending",
            type: "dummy",
          },
        ],
      },
      {
        id: randomUUID(),
        type: "ongoing_care",
        blockingTasks: [
          {
            id: randomUUID(),
            status: "pending",
            type: "dummy",
          },
        ],
      },
    ];
  }

  static forCarePlan(): CarePlanStage[] {
    return [
      {
        id: randomUUID(),
        type: "complete_assessment",
        blockingTasks: [
          {
            id: randomUUID(),
            status: "pending",
            type: "dummy",
          },
        ],
      },
      {
        id: randomUUID(),
        type: "review_care_plan",
        blockingTasks: [
          {
            id: randomUUID(),
            status: "pending",
            type: "dummy",
          },
        ],
      },
    ];
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

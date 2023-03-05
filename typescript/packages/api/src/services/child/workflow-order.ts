import { assertNever, WorkflowSlug } from "@songbird/precedent-iso";

export function workflowOrder(
  workflowSlug: WorkflowSlug
): WorkflowSlug | undefined {
  switch (workflowSlug) {
    case "onboarding":
      return "care_plan";
    case "care_plan":
      return "care_team";
    case "care_team":
      return undefined;
    default:
      assertNever(workflowSlug);
  }
}

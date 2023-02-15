import { assertNever, WorkflowSlug } from "@songbird/precedent-iso";

export class StatusMessageCopy {
  static forV1(isCompleted: boolean, firstName: string | undefined) {
    if (isCompleted) {
      return {
        header: "We’re on our way to supporting your family!",
        byline:
          "Our team will be in touch about your assessment, therapist match, and starting ongoing care.",
      };
    } else {
      const name = firstName ? `${firstName}, we're ` : "We're ";
      return {
        header: `${name} looking forward to supporting your family.`,
        byline: "Here’s what’s needed to start care.",
      };
    }
  }

  static forV2(workflowSlug: WorkflowSlug) {
    switch (workflowSlug) {
      case "onboarding":
        return {
          header: "Enroll in care with Songbird",
          byline: "Here’s what’s needed to start care.",
        };
      case "care_plan":
        return {
          header: "Build your family’s Songbird care plan",
          byline: "Here’s what’s needed to start care.",
        };
      case "care_team":
        return {
          header: "Meet your Songbird Care Team",
          byline: "Here’s what’s needed to start care.",
        };
      default:
        assertNever(workflowSlug);
    }
  }
}

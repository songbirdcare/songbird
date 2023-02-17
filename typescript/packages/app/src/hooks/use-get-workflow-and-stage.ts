import {
  assertNever,
  WorkflowSlug,
  ZCarePlanStageType,
  ZCareTeamStageType,
  ZOnboardingStageType,
  ZWorkflowSlug,
} from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import React from "react";

export const useGetWorkflowSlugAndStageType = (
  childWorkflowSlug: WorkflowSlug | undefined
) => {
  const router = useRouter();

  const workflow = router.query.workflow;
  const stage = router.query.stage;

  const fromQueryParams = React.useMemo(() => {
    const workflowSlug = ZWorkflowSlug.safeParse(workflow);

    if (!workflowSlug.success) {
      return undefined;
    }
    const stageType = getStageType(workflowSlug.data, stage);

    return {
      workflowSlug: workflowSlug.data,
      stageType: stageType.success ? stageType.data : undefined,
    };
  }, [workflow, stage]);

  if (fromQueryParams) {
    return fromQueryParams;
  }

  return childWorkflowSlug
    ? {
        workflowSlug: childWorkflowSlug,
        stageType: undefined,
      }
    : undefined;
};

function getStageType(workflowSlug: WorkflowSlug, stageType: unknown) {
  switch (workflowSlug) {
    case "onboarding":
      return ZOnboardingStageType.safeParse(stageType);
    case "care_plan":
      return ZCarePlanStageType.safeParse(stageType);
    case "care_team":
      return ZCareTeamStageType.safeParse(stageType);
    default:
      assertNever(workflowSlug);
  }
}

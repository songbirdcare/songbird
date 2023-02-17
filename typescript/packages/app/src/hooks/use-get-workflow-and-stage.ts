import {
  assertNever,
  Stage,
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

  const [data, setData] = React.useState<
    | {
        workflowSlug: WorkflowSlug;
        stageType: Stage["type"] | undefined;
      }
    | undefined
  >(() => {
    const workflowSlug = ZWorkflowSlug.safeParse(router.query.workflow);

    if (!workflowSlug.success) {
      return undefined;
    }
    const stageType = getStageType(workflowSlug.data, router.query.stage);

    return {
      workflowSlug: workflowSlug.data,
      stageType: stageType.success ? stageType.data : undefined,
    };
  });

  React.useEffect(() => {
    if (data || !childWorkflowSlug) {
      return;
    }

    setData({
      workflowSlug: childWorkflowSlug,
      stageType: undefined,
    });
  }, [data, childWorkflowSlug]);

  return data;
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

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import { assertNever, Stage } from "@songbird/precedent-iso";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchChild } from "../src/hooks/use-fetch-child";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { useGetWorkflowSlugAndStageType } from "../src/hooks/use-get-workflow-and-stage";
import { useRedirectIfNotEligible } from "../src/hooks/use-redirect-if-not-eligible";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { useTrackOnce } from "../src/hooks/use-track-once";
import { RenderWorkflow } from "../src/workflow/render-workflow";

const CompleteStage: React.FC = () => {
  useRedirectIfNotVerified();

  useRedirectIfNotEligible();
  const { data: user } = useFetchUser();
  const { data: child } = useFetchChild();
  const processData = useGetWorkflowSlugAndStageType(child?.workflowSlug);

  const stageType = processData?.stageType;
  const { data: workflow } = useFetchWorkflow(processData?.workflowSlug);

  useTrackOnce("page_accessed", { page: "complete-stage" });

  const finalStageType = React.useMemo((): Stage["type"] | undefined => {
    if (stageType) {
      return stageType;
    }
    if (!workflow) {
      return undefined;
    }

    const stage = workflow.stages[workflow.currentStageIndex];
    if (stage === undefined) {
      throw new Error("undefined");
    }
    return stage["type"];
  }, [workflow, stageType]);

  const userId = user?.id;
  return (
    <>
      {shouldRenderAppBar(stageType) && <AppBar />}

      <BodyContainer>
        {(!workflow || !userId) && (
          <Box width="100%" height="100%">
            <LinearProgress />
          </Box>
        )}
        {workflow && userId && finalStageType && (
          <RenderWorkflow
            userId={userId}
            workflow={workflow}
            stageType={stageType}
          />
        )}
      </BodyContainer>
    </>
  );
};

function shouldRenderAppBar(stageType: Stage["type"] | undefined): boolean {
  switch (stageType) {
    case undefined:
    case "create_account":
    case "commitment_to_care":
      return true;
    case "check_insurance_coverage":
    case "submit_records":
    case "insurance_approval":
    case "therapist_matching":
    case "complete_assessment":
    case "review_care_plan":
    case "ongoing_care":
      return false;
    default:
      assertNever(stageType);
  }
}

export default withPageAuthRequired(CompleteStage);

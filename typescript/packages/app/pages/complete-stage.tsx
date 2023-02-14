import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import { assertNever, Stage } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";
import { z } from "zod";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { useRedirectIfNotEligible } from "../src/hooks/use-redirect-if-not-eligible";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { useTrackOnce } from "../src/hooks/use-track-once";
import { RenderWorkflow } from "../src/workflow/render-workflow";

const CompleteStage: React.FC = () => {
  useRedirectIfNotVerified();
  const { data: workflow } = useFetchWorkflow();
  const { data: user } = useFetchUser();

  useRedirectIfNotEligible();
  const stageTypeFromUrl = useGetStageType();

  const [stageType, setStageType] = React.useState<Stage["type"] | undefined>(
    stageTypeFromUrl
  );

  useTrackOnce("page_accessed", { page: "complete-stage" });
  React.useEffect(() => {
    if (stageType || !workflow) {
      return;
    }

    const stage = workflow.stages[workflow.currentStageIndex];
    if (stage === undefined) {
      throw new Error("undefined");
    }

    setStageType(stage["type"]);
  }, [stageType, workflow]);

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
        {workflow && userId && stageType && (
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

const ZStageType = z.union([
  z.literal("create_account"),
  z.literal("check_insurance_coverage"),
  z.literal("submit_records"),
  z.literal("commitment_to_care"),
]);

function useGetStageType(): Stage["type"] | undefined {
  const router = useRouter();

  try {
    return ZStageType.parse(router.query.stage);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return undefined;
    }
    throw e;
  }
}

function shouldRenderAppBar(stageType: Stage["type"] | undefined): boolean {
  switch (stageType) {
    case undefined:
      return true;
    case "create_account":
    case "commitment_to_care":
      return true;
    case "check_insurance_coverage":
    case "submit_records":
      return false;
    default:
      assertNever(stageType);
  }
}

export default withPageAuthRequired(CompleteStage);

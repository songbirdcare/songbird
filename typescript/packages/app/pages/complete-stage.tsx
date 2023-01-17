import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import type { Stage } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";
import { z } from "zod";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { RenderWorkflow } from "../src/workflow/render-workflow";

const CompleteStage: React.FC = () => {
  useRedirectIfNotVerified();
  const { data: workflow } = useFetchWorkflow();
  const { data: user } = useFetchUser();
  const stageType = useGetStageType();

  const userId = user?.id;
  return (
    <>
      <AppBar />

      <BodyContainer>
        {(!workflow || !userId) && (
          <Box width="100%" height="100%">
            <LinearProgress />
          </Box>
        )}
        {workflow && userId && (
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
  } catch (_) {
    return undefined;
  }
}

export default withPageAuthRequired(CompleteStage);

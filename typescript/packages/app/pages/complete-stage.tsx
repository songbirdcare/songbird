import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import LinearProgress from "@mui/material/LinearProgress";
import { Stage } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { RenderWorkflow } from "../src/render-workflow";

const CompleteStage: React.FC = () => {
  useRedirectIfNotVerified();
  const { data: workflow } = useFetchWorkflow();
  const { data: user } = useFetchUser();
  const stageType = useGetStageType();

  const router = useRouter();
  console.log(router.query);
  const userId = user?.id;
  return (
    <>
      <AppBar />

      <BodyContainer>
        {(!workflow || !userId) && <LinearProgress />}
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

function useGetStageType(): Stage["type"] | undefined {
  const router = useRouter();
  switch (router.query.stage) {
    case "create_account":
      return "create_account";
    case "check_insurance_coverage":
      return "check_insurance_coverage";
    case "submit_records":
      return "submit_records";
    case "commitment_to_care":
      return "commitment_to_care";
    default:
      return undefined;
  }
}

export default withPageAuthRequired(CompleteStage);

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import LinearProgress from "@mui/material/LinearProgress";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { RenderWorkflow } from "../src/render-workflow";

const CompleteStage: React.FC = () => {
  useRedirectIfNotVerified();
  const { data: workflow } = useFetchWorkflow();
  return (
    <>
      <AppBar />

      <BodyContainer>
        {!workflow && <LinearProgress />}
        {workflow && <RenderWorkflow workflow={workflow} />}
      </BodyContainer>
    </>
  );
};

export default withPageAuthRequired(CompleteStage);

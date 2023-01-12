import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { LinearProgress } from "@mui/material";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { OnboardingFlow } from "../src/onboarding/onboarding-flow";

const Home: React.FC = () => {
  const { data: workflow } = useFetchWorkflow();
  useRedirectIfNotVerified();
  return (
    <>
      <AppBar />

      <BodyContainer>
        {!workflow && <LinearProgress />}
        {workflow && (
          <OnboardingFlow
            isCompleted={workflow.status === "completed"}
            currentStageIndex={workflow.currentStageIndex}
            stages={workflow.stages}
          />
        )}
      </BodyContainer>
    </>
  );
};

export default withPageAuthRequired(Home);

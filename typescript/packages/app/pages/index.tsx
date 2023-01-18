import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { OnboardingFlow } from "../src/onboarding/onboarding-flow";

const Home: React.FC = () => {
  const { data: user } = useFetchUser();
  const { data: workflow } = useFetchWorkflow();
  useRedirectIfNotVerified();
  return (
    <>
      <AppBar />

      <BodyContainer>
        {!workflow && !user && (
          <Box width="100%" height="100%">
            <LinearProgress />
          </Box>
        )}
        {workflow && user && (
          <OnboardingFlow
            firstName={user.givenName?.trim()}
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

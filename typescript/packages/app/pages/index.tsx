import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { useRedirectIfNotEligible } from "../src/hooks/use-redirect-if-not-eligible";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { useTrackOnce } from "../src/hooks/use-track-once";
import { OnboardingFlow } from "../src/onboarding/onboarding-flow";

const Home: React.FC = () => {
  const { data: user, isLoading: userIsLoading } = useFetchUser();
  const { data: workflow, isLoading: workflowIsLoading } = useFetchWorkflow();
  const { isLoading: childIsLoading } = useRedirectIfNotEligible();

  useRedirectIfNotVerified();

  useTrackOnce("page_accessed", { page: "home" });
  const isLoading = userIsLoading || workflowIsLoading || childIsLoading;
  return (
    <>
      <AppBar />

      <BodyContainer>
        {isLoading && (
          <Box width="100%" height="100%">
            <LinearProgress />
          </Box>
        )}
        {!isLoading && workflow && user && (
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

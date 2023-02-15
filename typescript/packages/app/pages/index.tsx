import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import type { OnboardingStage } from "@songbird/precedent-iso";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { useSBFlags } from "../src/hooks/use-flags";
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
  const flags = useSBFlags();
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
            // TODO get rid of this cast
            stages={workflow.stages as OnboardingStage[]}
            extendedOnboarding={flags.flags.extendedOnboarding}
          />
        )}
      </BodyContainer>
    </>
  );
};

export default withPageAuthRequired(Home);

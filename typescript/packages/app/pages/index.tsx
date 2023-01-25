import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { useImpersonate } from "../src/hooks/use-impersonate";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { useImpersonateContext } from "../src/impersonate/impersonate-context";
import { OnboardingFlow } from "../src/onboarding/onboarding-flow";

const Home: React.FC = () => {
  const { data: user } = useFetchUser();
  const { data: workflow } = useFetchWorkflow();
  useRedirectIfNotVerified();
  const impersonateContext = useImpersonateContext();

  return (
    <>
      {impersonateContext.id && (
        <ImpersonateBanner id={impersonateContext.id} />
      )}
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

const ImpersonateBanner: React.FC<{ id: string }> = () => {
  return <Box>fuck</Box>;
};

export default withPageAuthRequired(Home);

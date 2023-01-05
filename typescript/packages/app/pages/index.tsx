import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import type { UserModel, WorkflowModel } from "@songbird/precedent-iso";
import Head from "next/head";
import * as React from "react";
import useSWR from "swr";

import { AppBar } from "../src/app-bar";
import { OnboardingFlow } from "../src/onboarding/onboarding-flow";
import { VerifyEmail } from "../src/verify-email";

const Home: React.FC = () => {
  const { data: user, isLoading: userIsLoading } = useSWR<UserModel>(
    "/api/proxy/users/me",
    async (url) => {
      const response = await fetch(url);
      return response.json();
    }
  );

  const { data: workflow, isLoading: workflowIsLoading } =
    useSWR<WorkflowModel>("/api/proxy/workflows/start", async (url) => {
      const response = await fetch(url);
      return response.json();
    });

  console.log({ workflow, workflowIsLoading });

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Head>
        <title>Songbird Therapy</title>
        <meta name="description" content="Innovative care" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Box>
        <AppBar displayName={user?.name ?? undefined} />
      </Box>
      {userIsLoading && <LinearProgress />}
      {!userIsLoading && user && !user.emailVerified && <VerifyEmail />}
      {!userIsLoading && user && user.emailVerified && workflow && (
        <OnboardingFlow
          currentStageIndex={workflow.currentStageIndex}
          stages={workflow.stages}
        />
      )}
    </Box>
  );
};

export default withPageAuthRequired(Home);

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Head from "next/head";
import * as React from "react";
import useSWR from "swr";

import { AppBar } from "../src/app-bar";
import { OnboardingFlow } from "../src/onboarding/onboarding-flow";
import { VerifyEmail } from "../src/verify-email";
import { STEPS } from "../src/onboarding/steps";
import { UserModel } from "@songbird/precedent-iso";

const Home: React.FC = () => {
  const { data: user, isLoading } = useSWR<UserModel>(
    "/api/proxy/users/me",
    async (url) => {
      const response = await fetch(url);
      return response.json();
    }
  );
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
      {isLoading && <LinearProgress />}
      {!isLoading && user && !user.emailVerified && <VerifyEmail />}
      {!isLoading && user && user.emailVerified && (
        <OnboardingFlow steps={STEPS} />
      )}
    </Box>
  );
};

export default withPageAuthRequired(Home);

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Box from "@mui/material/Box";
import Head from "next/head";
import * as React from "react";

import { AppBar } from "../src/app-bar";
import { OnboardingFlow } from "../src/onboarding/onboarding-flow";
import type { Step } from "../src/onboarding/step/step";

const STEPS: Step[] = [
  {
    title: "Check insurance coverage",
    byline:
      "If you’d like to know your insurance coverage sooner, just submit additional info here.",
    status: "in-progress",
    asset: {
      path: "/onboarding/hands.svg",
      width: 64,
      height: 60,
      alt: "Insurance coverage",
    },
  },
  {
    title: "Submit records",
    byline:
      "With a few medical records, we’ll be able to begin the process of insurance covering care.",
    status: "disabled",

    asset: {
      path: "/onboarding/flower-pot.svg",
      width: 33,
      height: 42,
      alt: "Submit records",
    },
  },
  {
    title: "Meet your care team",
    byline: "We’ll find time for you to meet your family’s care team",
    status: "disabled",
    asset: {
      path: "/onboarding/heart.svg",
      width: 39,
      height: 31,
      alt: "Care team",
    },
  },
];

export default withPageAuthRequired(function Home() {
  const { user } = useUser();

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
      <OnboardingFlow steps={STEPS} />
    </Box>
  );
});

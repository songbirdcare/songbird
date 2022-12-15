import Head from "next/head";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import * as React from "react";

import Box from "@mui/material/Box";

import { useUser } from "@auth0/nextjs-auth0/client";
import { AppBar } from "../src/app-bar";
import type { Step } from "../src/onboarding/step/step";
import { DisplaySteps } from "../src/onboarding/step/display-steps";

const STEPS: Step[] = [
  {
    title: "Check insurance coverage",
    byline: "Check if your insurance covers the cost of your treatment",
    status: "in-progress",
  },
  {
    title: "Submit records",
    byline:
      "With a few medical records, we'll be able to being the process of insurance covering care",
    status: "disabled",
  },
  {
    title: "Meet your care team",
    byline:
      "We'll find time to meet with you and your care team to discuss your treatment plan",
    status: "disabled",
  },
];

export default withPageAuthRequired(function Home() {
  const { user } = useUser();

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Head>
        <title>Songbird Therapy</title>
        <meta name="description" content="Innovative care" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <AppBar displayName={user?.name ?? undefined} />
      </Box>
      <Box my={2} height="100%">
        <DisplaySteps steps={STEPS} />
      </Box>
    </Box>
  );
});

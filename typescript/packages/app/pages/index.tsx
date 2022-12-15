import Head from "next/head";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import * as React from "react";

import Box from "@mui/material/Box";

import { useUser } from "@auth0/nextjs-auth0/client";
import { AppBar } from "../src/app-bar";

export default withPageAuthRequired(function Home() {
  const { user } = useUser();

  return (
    <div>
      <Head>
        <title>Songbird Therapy</title>
        <meta name="description" content="Innovative care" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <AppBar displayName={user?.name ?? undefined} />
      </Box>
    </div>
  );
});

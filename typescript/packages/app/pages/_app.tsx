import "../styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import LogRocket from "logrocket";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { IntercomProvider } from "react-use-intercom";

import { SETTINGS } from "../src/settings";

// only initialize when in the browser
if (typeof window !== "undefined" && SETTINGS.logRocketId) {
  LogRocket.init(SETTINGS.logRocketId);
}

import { THEME } from "../src/style/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Songbird Therapy | Parent Dashboard</title>
        <meta name="description" content="Innovative care" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <ThemeProvider theme={THEME}>
        <UserProvider>
          <IntercomProvider appId={SETTINGS.intercomId}>
            <Box display="flex" flexDirection="column" height="100%">
              <Component {...pageProps} />
            </Box>
          </IntercomProvider>
        </UserProvider>
      </ThemeProvider>
    </>
  );
}

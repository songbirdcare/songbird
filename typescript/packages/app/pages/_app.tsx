import "../styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import LogRocket from "logrocket";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

import { SETTINGS } from "../src/settings";

// only initialize when in the browser
if (typeof window !== "undefined" && SETTINGS.logRocketId) {
  LogRocket.init(SETTINGS.logRocketId);
  // plugins should also only be initialized when in the browser
}

import { THEME } from "../src/style/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Songbird Therapy</title>
        <meta name="description" content="Innovative care" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <ThemeProvider theme={THEME}>
        <UserProvider>
          <Box display="flex" flexDirection="column" height="100%">
            <Component {...pageProps} />
          </Box>
        </UserProvider>
      </ThemeProvider>
    </>
  );
}

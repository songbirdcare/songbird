import "../styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import amplitude from "amplitude-js";
import LogRocket from "logrocket";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { IntercomProvider } from "react-use-intercom";

import { ErrorBoundary } from "../src/error-boundary";
import { ImpersonateProvider } from "../src/impersonate/impersonate-context";
import { SETTINGS } from "../src/settings";
import { THEME } from "../src/style/theme";

// only initialize when in the browser
if (typeof window !== "undefined" && SETTINGS.logRocketId) {
  LogRocket.init(SETTINGS.logRocketId);
  LogRocket.getSessionURL((sessionURL) => {
    amplitude.getInstance().logEvent("LogRocket", { sessionURL: sessionURL });
  });
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Songbird Therapy | Parent Dashboard</title>
        <meta name="description" content="Innovative care" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <ThemeProvider theme={THEME}>
        <ImpersonateProvider>
          <UserProvider>
            <IntercomProvider appId={SETTINGS.intercomId}>
              <Box
                display="flex"
                flexDirection="column"
                height="100%"
                position="relative"
              >
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Box>
            </IntercomProvider>
          </UserProvider>
        </ImpersonateProvider>
      </ThemeProvider>
    </>
  );
}

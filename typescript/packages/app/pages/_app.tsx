import "../styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import flagsmith from "flagsmith/isomorphic";
import { FlagsmithProvider } from "flagsmith/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { IntercomProvider } from "react-use-intercom";

import { ErrorBoundary } from "../src/error-boundary";
import { useInitThirdParty } from "../src/hooks/use-init-third-party";
import { ImpersonateBanner } from "../src/impersonate/impersonate-banner";
import { ImpersonateProvider } from "../src/impersonate/impersonate-context";
import { SETTINGS } from "../src/settings";
import { THEME } from "../src/style/theme";

const OPTIONS = {
  environmentID: SETTINGS.flagSmith,
};

export default function App({ Component, pageProps }: AppProps) {
  useInitThirdParty();
  return (
    <>
      <Head>
        <title>Songbird Therapy | Parent Dashboard</title>
        <meta name="description" content="Innovative care" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <FlagsmithProvider options={OPTIONS} flagsmith={flagsmith}>
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
                    <ImpersonateBanner />
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </Box>
              </IntercomProvider>
            </UserProvider>
          </ImpersonateProvider>
        </ThemeProvider>
      </FlagsmithProvider>
    </>
  );
}

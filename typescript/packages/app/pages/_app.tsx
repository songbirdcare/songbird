import "../styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import { AppBar } from "../src/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { THEME } from "../src/style/theme";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { data: user } = useFetchUser();
  const isEmailVerified = user?.emailVerified;

  React.useEffect(() => {
    // need exact match for this to work
    if (isEmailVerified === false) {
      router.push("/verify-email");
    }
  }, [router, isEmailVerified]);

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
            <AppBar displayName={user?.name ?? user?.email} />

            <BodyContainer>
              <Component {...pageProps} />
            </BodyContainer>
          </Box>
        </UserProvider>
      </ThemeProvider>
    </>
  );
}

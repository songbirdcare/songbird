import "../styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";

import { THEME } from "../src/style/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={THEME}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>
  );
}

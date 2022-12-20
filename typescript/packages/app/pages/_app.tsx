import "../styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";

const SONG_BIRD_GREEN = "#005450" as const;

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    typography: {
      fontFamily: `"Circular-Loom", sans-serif`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
    palette: {
      primary: {
        main: SONG_BIRD_GREEN,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>
  );
}

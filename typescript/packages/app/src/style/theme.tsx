import { createTheme } from "@mui/material/styles";
import { Castoro, IBM_Plex_Sans } from "@next/font/google";

import { SONG_BIRD_GREEN } from "./colors";

const castoro = Castoro({
  subsets: ["latin"],
  weight: "400",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  preload: true,
});

const HEADER_FONT = castoro.style.fontFamily;

export const NON_HEADER_FONT = ibmPlex.style.fontFamily;

export const THEME = createTheme({
  typography: {
    h1: { fontFamily: HEADER_FONT },
    h2: { fontFamily: HEADER_FONT },
    h3: { fontFamily: HEADER_FONT },
    h4: { fontFamily: HEADER_FONT },
    h5: { fontFamily: HEADER_FONT },
    h6: { fontFamily: HEADER_FONT },
    subtitle1: { fontFamily: NON_HEADER_FONT },
    body1: { fontFamily: NON_HEADER_FONT },
    body2: { fontFamily: NON_HEADER_FONT },
    button: { fontFamily: NON_HEADER_FONT },
    caption: { fontFamily: NON_HEADER_FONT },
    overline: { fontFamily: NON_HEADER_FONT },
  },
  palette: {
    primary: {
      main: SONG_BIRD_GREEN,
    },
  },
});

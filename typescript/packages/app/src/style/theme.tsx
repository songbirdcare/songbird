import { createTheme } from "@mui/material/styles";

import { SONG_BIRD_GREEN } from "./colors";

export const THEME = createTheme({
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

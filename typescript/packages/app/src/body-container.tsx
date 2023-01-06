import Box from "@mui/material/Box";

import flower from "../public/background-flower.svg";
import { SONG_BIRD_BIEGE } from "./style/colors";

const BACKGROUND_STYLE = {
  backgroundImage: `url(${flower.src})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center right 20px",
};

export const BodyContainer: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      bgcolor={SONG_BIRD_BIEGE}
      height="100%"
      sx={BACKGROUND_STYLE}
      overflow="auto"
    >
      {children}
    </Box>
  );
};

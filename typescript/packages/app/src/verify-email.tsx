import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { SONG_BIRD_BIEGE } from "./style/colors";

export const VerifyEmail: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      bgcolor={SONG_BIRD_BIEGE}
      height="100%"
    >
      <Box
        display="flex"
        height="100%"
        alignItems="center"
        justifyContent="center"
        width="725px"
      >
        <Typography variant="h5" align="center">
          Please verify your email
        </Typography>
      </Box>
    </Box>
  );
};

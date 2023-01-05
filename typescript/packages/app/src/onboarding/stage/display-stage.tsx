import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import type { StageDisplayInformation } from "./stage-display-information";

export const DisplayStage: React.FC<{
  stageDisplayInformation: StageDisplayInformation;
  index: number;
  isEnabled: boolean;
}> = ({
  stageDisplayInformation: { title, byline, asset },
  index,
  isEnabled,
}) => {
  return (
    <Paper sx={{ width: "100%" }} variant="outlined">
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        padding={3}
      >
        <Box display="flex" gap={3} alignItems="center">
          <Box
            width="60px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src={asset.path}
              width={asset.width}
              height={asset.height}
              alt={asset.alt}
            />
          </Box>
          <Box display="flex" flexDirection="column" width="370px">
            <Typography variant="h6" component="h6" gutterBottom>
              {index + 1}. {title}
            </Typography>
            <Typography>{byline}</Typography>
          </Box>
        </Box>
        <Button variant="contained" disabled={!isEnabled}>
          Start
        </Button>
      </Box>
    </Paper>
  );
};

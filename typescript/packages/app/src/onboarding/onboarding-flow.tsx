import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import type { Stage } from "@songbird/precedent-iso";

import { DisplayStages } from "./stage/display-stages";

export const OnboardingFlow: React.FC<{
  currentStageIndex: number;
  stages: Stage[];
}> = ({ currentStageIndex, stages }) => (
  <Box
    display="flex"
    paddingTop={5}
    height="100%"
    flexDirection="column"
    alignItems="center"
    width="725px"
  >
    <Box display="flex" flexDirection="column" width="100%">
      <Box display="flex" width="100%" flexDirection="column" gap={1}>
        <Typography variant="h5" align="left">
          We&apos;re looking forward to supporting your family.
        </Typography>
        <Typography align="left">
          Here’s what’s needed to start care.{" "}
        </Typography>
      </Box>
    </Box>
    <Box
      display="flex"
      width="100%"
      marginTop={7}
      flexDirection="column"
      gap={1 / 2}
    >
      <LinearProgress
        variant="buffer"
        value={(currentStageIndex + 1 / stages.length) * 100}
        valueBuffer={100}
      />
      <Typography variant="caption">
        {currentStageIndex + 1} of {stages.length} complete
      </Typography>
    </Box>

    <DisplayStages currentStageIndex={currentStageIndex} stages={stages} />
  </Box>
);

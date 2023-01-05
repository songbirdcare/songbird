import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import type { Stage } from "@songbird/precedent-iso";

import { SONG_BIRD_BIEGE } from "../style/colors";
import { DisplayStages } from "./stage/display-stages";
import type { StageDisplayInformation } from "./stage/stage-display-information";

export const OnboardingFlow: React.FC<{
  currentStageIndex: number;
  stages: Stage[];
}> = ({ currentStageIndex, stages }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      bgcolor={SONG_BIRD_BIEGE}
      height="100%"
    >
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
          marginBottom={5}
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

        <DisplayStages stages={stages} />
      </Box>
    </Box>
  );
};

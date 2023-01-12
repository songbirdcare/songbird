import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { SONG_BIRD_GREEN } from "../../style/colors";
import { STAGE_DISPLAY_INFO_LOOKUP } from "../stage-display-information-lookup";
import type { StageWithIndex } from "./stage-display-information";

export const DisplayCompletedStages: React.FC<{
  stagesWithIndexes: StageWithIndex[];
}> = ({ stagesWithIndexes }) => {
  return (
    <Box display="flex" flexDirection="column" marginBottom={5}>
      <Box marginBottom={1}>
        <Typography variant="subtitle2">Completed</Typography>
      </Box>
      <Box display="flex" flexDirection="column">
        {stagesWithIndexes.map(({ stage, index }) => {
          const stageDisplayInformation = STAGE_DISPLAY_INFO_LOOKUP[stage.type];
          return (
            <DisplayCompletedStage
              key={stage.type}
              index={index}
              title={stageDisplayInformation.title}
            />
          );
        })}
      </Box>
    </Box>
  );
};

const DisplayCompletedStage: React.FC<{
  index: number;
  title: string;
}> = ({ title, index }) => {
  return (
    <Box display="flex">
      <Typography variant="subtitle2"></Typography>
      <Box display="flex" gap={3} paddingLeft={1 / 2} alignItems="center">
        <Box width="350px">
          <Typography variant="h6">
            {index + 1}. {title}
          </Typography>
        </Box>
        <Box display="flex" gap={1 / 2} alignItems="center">
          <CheckIcon fontSize="small" />
          <Typography
            color={SONG_BIRD_GREEN}
            textTransform="uppercase"
            variant="body1"
          >
            Completed
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

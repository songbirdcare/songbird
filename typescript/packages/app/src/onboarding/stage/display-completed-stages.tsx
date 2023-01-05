import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Stage } from "@songbird/precedent-iso";

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
      <Box display="flex">
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
        <Typography variant="h6">
          {index + 1}. {title}
        </Typography>
        <Typography color={SONG_BIRD_GREEN} textTransform="uppercase">
          ✅ Completed
        </Typography>
      </Box>
    </Box>
  );
};

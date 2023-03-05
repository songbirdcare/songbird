import CheckIcon from "@mui/icons-material/Check";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { SONG_BIRD_GREEN, SONG_BIRD_GREY } from "../../style/colors";
import { STAGE_DISPLAY_INFO_LOOKUP } from "../stage-display-information-lookup";
import type { StageWithIndex } from "./stage-display-information";

export const DisplayCompletedStages: React.FC<{
  stagesWithIndexes: StageWithIndex[];
}> = ({ stagesWithIndexes }) => {
  return (
    <Box display="flex" flexDirection="column" marginBottom={5} width="100%">
      <Box marginBottom={1}>
        <Typography variant="body1">Completed</Typography>
      </Box>
      <Box display="grid" gridTemplateColumns="auto 1fr auto" gap={1}>
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
  const isSmallScreen = useMediaQuery("(max-width:670px)");
  return (
    <>
      <Typography variant="h6" color={SONG_BIRD_GREY}>
        {index + 1}.
      </Typography>
      <Typography variant="h6" color={SONG_BIRD_GREY}>
        {title}
      </Typography>
      <Box display="flex" gap={1 / 2} alignItems="center" paddingBottom={1}>
        <CheckIcon fontSize="medium" color="primary" />
        {!isSmallScreen && (
          <Typography
            color={SONG_BIRD_GREEN}
            textTransform="uppercase"
            variant="body1"
          >
            Completed
          </Typography>
        )}
      </Box>
    </>
  );
};

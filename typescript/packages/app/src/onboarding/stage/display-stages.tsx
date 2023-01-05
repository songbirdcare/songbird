import Box from "@mui/material/Box";
import type { Stage } from "@songbird/precedent-iso";

import { STAGE_DISPLAY_INFO_LOOKUP } from "../stage-display-information-lookup";
import { DisplayStage } from "./display-stage";

export const DisplayStages: React.FC<{ stages: Stage[] }> = ({ stages }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      justifyContent="center"
      width="725px"
    >
      {stages.map((stage, index) => {
        const stageDisplayInformation = STAGE_DISPLAY_INFO_LOOKUP[stage.type];
        return (
          <DisplayStage
            stageDisplayInformation={stageDisplayInformation}
            index={index}
            key={index}
          />
        );
      })}
    </Box>
  );
};

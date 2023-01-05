import Box from "@mui/material/Box";
import type { Stage } from "@songbird/precedent-iso";

import { STAGE_DISPLAY_INFO_LOOKUP } from "../stage-display-information-lookup";
import { DisplayCompletedStages } from "./display-completed-stages";
import { DisplayStage } from "./display-stage";
import type { StageWithIndex } from "./stage-display-information";

export const DisplayStages: React.FC<{
  currentStageIndex: number;
  stages: Stage[];
}> = ({ stages, currentStageIndex }) => {
  const { completed, nonCompleted } = processStages(currentStageIndex, stages);
  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
        justifyContent="center"
        width="725px"
        paddingY={5}
      >
        {nonCompleted.map(({ stage, index }) => {
          const stageDisplayInformation = STAGE_DISPLAY_INFO_LOOKUP[stage.type];
          return (
            <DisplayStage
              stageDisplayInformation={stageDisplayInformation}
              index={index}
              key={stage.type}
            />
          );
        })}
      </Box>
      {completed.length > 0 && (
        <DisplayCompletedStages stagesWithIndexes={completed} />
      )}
    </Box>
  );
};

function processStages(
  currentStageIndex: number,
  stages: Stage[]
): ProcessedStages {
  const nonCompleted: StageWithIndex[] = [];
  const completed: StageWithIndex[] = [];

  for (const [index, stage] of stages.entries()) {
    const item: StageWithIndex = {
      index,
      stage,
    };

    if (index < currentStageIndex) {
      completed.push(item);
    } else {
      nonCompleted.push(item);
    }
  }

  return {
    completed,
    nonCompleted,
  };
}

interface ProcessedStages {
  nonCompleted: StageWithIndex[];
  completed: StageWithIndex[];
}

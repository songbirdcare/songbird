import Box from "@mui/material/Box";
import type { OnboardingStage,WorkflowSlug } from "@songbird/precedent-iso";

import { STAGE_DISPLAY_INFO_LOOKUP } from "../stage-display-information-lookup";
import { DisplayCompletedStages } from "./display-completed-stages";
import { DisplayStage } from "./display-stage";
import type { StageWithIndex } from "./stage-display-information";

export const DisplayStages: React.FC<{
  workflowSlug: WorkflowSlug;
  currentStageIndex: number;
  stages: OnboardingStage[];
  isCompleted: boolean;
}> = ({ stages, currentStageIndex, isCompleted, workflowSlug }) => {
  const { completed, nonCompleted } = processStages(
    isCompleted,
    currentStageIndex,
    stages
  );
  return (
    <Box width="100%">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
        justifyContent="center"
        paddingY={5}
        width="100%"
      >
        {nonCompleted.map(({ stage, index }) => {
          const stageDisplayInformation = STAGE_DISPLAY_INFO_LOOKUP[stage.type];
          return (
            <DisplayStage
              stage={stage}
              stageDisplayInformation={stageDisplayInformation}
              isCurrentStage={index === currentStageIndex}
              index={index}
              key={stage.type}
              currentStageIndex={currentStageIndex}
              workflowSlug={workflowSlug}
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
  isCompleted: boolean,
  currentStageIndex: number,
  stages: OnboardingStage[]
): ProcessedStages {
  const nonCompleted: StageWithIndex[] = [];
  const completed: StageWithIndex[] = [];

  for (const [index, stage] of stages.entries()) {
    const item: StageWithIndex = {
      index,
      stage,
    };

    if (isCompleted || index < currentStageIndex) {
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

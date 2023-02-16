import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import type { OnboardingStage } from "@songbird/precedent-iso";
import type { WorkflowSlug } from "@songbird/precedent-iso";
import React from "react";

import { DisplayStages } from "./stage/display-stages";
import { StatusMessage } from "./status-message/status-message";
import { StatusMessageCopy } from "./status-message-copy";
import { WorkflowSelector } from "./workflow-selector";

interface RenderWorkflowProps {
  firstName: string | undefined;
  isCompleted: boolean;
  currentStageIndex: number;
  stages: OnboardingStage[];
  extendedOnboarding: boolean;
  workflowSlug: WorkflowSlug;
}

export const RenderWorkflow: React.FC<RenderWorkflowProps> = ({
  extendedOnboarding,
  ...rest
}) => {
  console.log({ slug: rest.workflowSlug });
  const [selectedWorkflowSlug, setSelectedWorkflowSlug] =
    React.useState<WorkflowSlug>(rest.workflowSlug);

  return extendedOnboarding ? (
    <RenderWorkflowV2
      {...rest}
      selectedWorkflowSlug={selectedWorkflowSlug}
      setSelectedWorkflowSlug={setSelectedWorkflowSlug}
    />
  ) : (
    <RenderWorkflowV1 {...rest} />
  );
};

export const RenderWorkflowV1: React.FC<
  Omit<RenderWorkflowProps, "extendedOnboarding" | "workflowSlug">
> = ({ isCompleted, currentStageIndex, stages, firstName }) => {
  const copy = StatusMessageCopy.forV1(isCompleted, firstName);
  return (
    <Box
      display="flex"
      paddingTop={5}
      height="100%"
      flexDirection="column"
      alignItems="center"
      marginX={2}
    >
      <Box display="flex" flexDirection="column" width="100%" gap={1}>
        <StatusMessage header={copy.header} byline={copy.byline} />
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
          value={isCompleted ? 100 : (currentStageIndex / stages.length) * 100}
          valueBuffer={100}
        />
        <Typography variant="caption">
          {isCompleted ? stages.length : currentStageIndex} of {stages.length}{" "}
          complete
        </Typography>
      </Box>

      <DisplayStages
        isCompleted={isCompleted}
        currentStageIndex={currentStageIndex}
        stages={stages}
      />
    </Box>
  );
};

export const RenderWorkflowV2: React.FC<
  Omit<RenderWorkflowProps, "extendedOnboarding" | "firstName"> & {
    selectedWorkflowSlug: WorkflowSlug;
    setSelectedWorkflowSlug: (slug: WorkflowSlug) => void;
  }
> = ({
  isCompleted,
  currentStageIndex,
  stages,
  selectedWorkflowSlug,
  setSelectedWorkflowSlug,
}) => {
  const copy = StatusMessageCopy.forV2(selectedWorkflowSlug);
  return (
    <Box
      display="flex"
      paddingTop={5}
      height="100%"
      flexDirection="column"
      alignItems="center"
      marginX={2}
    >
      <Box display="flex" flexDirection="column" width="100%" gap={1}>
        <StatusMessage header={copy.header} byline={copy.byline} />
      </Box>
      <Box width="100%" marginTop={7}>
        <WorkflowSelector
          selectedWorkflowSlug={selectedWorkflowSlug}
          setSelectedWorkflowSlug={setSelectedWorkflowSlug}
        />
      </Box>

      <DisplayStages
        isCompleted={isCompleted}
        currentStageIndex={currentStageIndex}
        stages={stages}
      />
      <Box
        display="flex"
        width="100%"
        marginTop={7}
        flexDirection="column"
        gap={1 / 2}
      >
        <LinearProgress
          variant="buffer"
          value={isCompleted ? 100 : (currentStageIndex / stages.length) * 100}
          valueBuffer={100}
        />
        <Typography variant="caption">
          {isCompleted ? stages.length : currentStageIndex} of {stages.length}{" "}
          complete
        </Typography>
      </Box>
    </Box>
  );
};

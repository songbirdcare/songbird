import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import type { StagesWithSlug } from "@songbird/precedent-iso";
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
  stagesWithSlug: StagesWithSlug;
  extendedOnboarding: boolean;
  workflowSlug: WorkflowSlug;
}

export const DisplayWorkflowStages: React.FC<RenderWorkflowProps> = ({
  extendedOnboarding,
  ...rest
}) => {
  const [selectedWorkflowSlug, setSelectedWorkflowSlug] =
    React.useState<WorkflowSlug>(rest.stagesWithSlug.slug);

  return extendedOnboarding ? (
    <DisplayWorkflowStagesV2
      {...rest}
      selectedWorkflowSlug={selectedWorkflowSlug}
      setSelectedWorkflowSlug={setSelectedWorkflowSlug}
    />
  ) : (
    <DisplayWorkflowStagesV1 {...rest} />
  );
};

export const DisplayWorkflowStagesV1: React.FC<
  Omit<RenderWorkflowProps, "extendedOnboarding" | "workflowSlug">
> = ({ isCompleted, currentStageIndex, stagesWithSlug, firstName }) => {
  const copy = StatusMessageCopy.forV1(isCompleted, firstName);
  if (stagesWithSlug.slug !== "onboarding") {
    throw new Error("not supported");
  }

  const stages = stagesWithSlug.stages;

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
        workflowSlug={stagesWithSlug.slug}
        isCompleted={isCompleted}
        currentStageIndex={currentStageIndex}
        stages={stages}
      />
    </Box>
  );
};

export const DisplayWorkflowStagesV2: React.FC<
  Omit<RenderWorkflowProps, "extendedOnboarding" | "firstName"> & {
    selectedWorkflowSlug: WorkflowSlug;
    setSelectedWorkflowSlug: (slug: WorkflowSlug) => void;
  }
> = ({
  isCompleted,
  currentStageIndex,
  stagesWithSlug,
  selectedWorkflowSlug,
  setSelectedWorkflowSlug,
  workflowSlug,
}) => {
  const copy = StatusMessageCopy.forV2(selectedWorkflowSlug);
  if (stagesWithSlug.slug !== "onboarding") {
    throw new Error("not implemented");
  }
  const stages = stagesWithSlug.stages;
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
        workflowSlug={workflowSlug}
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

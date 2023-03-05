import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import type { Stage } from "@songbird/precedent-iso";
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
  stages: Stage[];
  extendedOnboarding: boolean;
  workflowSlug: WorkflowSlug;
  setWorkflowSlug: (workflowSlug: WorkflowSlug) => void;
  isWorkflowEnabled: boolean;
}

export const DisplayWorkflowStages: React.FC<RenderWorkflowProps> = ({
  extendedOnboarding,
  workflowSlug,
  setWorkflowSlug,
  isWorkflowEnabled,
  ...rest
}) => {
  return extendedOnboarding ? (
    <DisplayWorkflowStagesV2
      {...rest}
      workflowSlug={workflowSlug}
      setWorkflowSlug={setWorkflowSlug}
      isWorkflowEnabled={isWorkflowEnabled}
    />
  ) : (
    <DisplayWorkflowStagesV1 {...rest} />
  );
};

export const DisplayWorkflowStagesV1: React.FC<
  Omit<
    RenderWorkflowProps,
    | "extendedOnboarding"
    | "workflowSlug"
    | "setWorkflowSlug"
    | "isWorkflowEnabled"
  >
> = ({ isCompleted, currentStageIndex, stages, firstName }) => {
  const copy = StatusMessageCopy.forV1(isCompleted, firstName);

  const isSmallScreen = useMediaQuery("(max-width:670px)");

  return (
    <Box
      display="flex"
      paddingTop={5}
      height="100%"
      flexDirection="column"
      alignItems="center"
      marginX={2}
      width={isSmallScreen ? "100%" : "725px"}
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
        workflowSlug={"onboarding"}
        isCompleted={isCompleted}
        currentStageIndex={currentStageIndex}
        stages={stages}
        isWorkflowEnabled={true}
      />
    </Box>
  );
};

export const DisplayWorkflowStagesV2: React.FC<
  Omit<RenderWorkflowProps, "extendedOnboarding" | "firstName">
> = ({
  isCompleted,
  currentStageIndex,
  workflowSlug,
  setWorkflowSlug,
  isWorkflowEnabled,
  stages,
}) => {
  const copy = StatusMessageCopy.forV2(workflowSlug);
  const isSmallScreen = useMediaQuery("(max-width:670px)");

  return (
    <Box
      display="flex"
      paddingTop={5}
      height="100%"
      flexDirection="column"
      alignItems="center"
      marginX={2}
      width={isSmallScreen ? "100%" : "725px"}
    >
      <Box display="flex" flexDirection="column" width="100%" gap={1}>
        <StatusMessage header={copy.header} byline={copy.byline} />
      </Box>
      <Box width="100%" marginTop={7}>
        <WorkflowSelector
          selectedWorkflowSlug={workflowSlug}
          setSelectedWorkflowSlug={setWorkflowSlug}
        />
      </Box>

      <DisplayStages
        isCompleted={isCompleted}
        currentStageIndex={currentStageIndex}
        stages={stages}
        workflowSlug={workflowSlug}
        isWorkflowEnabled={isWorkflowEnabled}
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

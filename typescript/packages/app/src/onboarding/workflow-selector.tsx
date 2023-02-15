import React from "react";
import { SONG_BIRD_GREY } from "../style/colors";
import {
  Box,
  Typography,
  Divider,
  selectClasses,
  Button,
  useMediaQuery,
} from "@mui/material";
import { WorkflowSlug } from "@songbird/precedent-iso";
import { set } from "zod";

export const WorkflowSelector: React.FC<{
  selectedWorkflowSlug: WorkflowSlug;
  setSelectedWorkflowSlug: (slug: WorkflowSlug) => void;
}> = ({ selectedWorkflowSlug, setSelectedWorkflowSlug }) => {
  const isSmallScreen = useMediaQuery("(max-width:670px)");
  return (
    <Box
      display="flex"
      width="100%"
      alignItems="center"
      gap={isSmallScreen ? 0 : 2}
      justifyContent="space-between"
      flexDirection={isSmallScreen ? "column" : "row"}
    >
      <DisplayTypography
        selectedWorkflowSlug={selectedWorkflowSlug}
        setSelectedWorkflowSlug={setSelectedWorkflowSlug}
        workflowSlug="onboarding"
        copy="1) Enroll in care"
      />
      {!isSmallScreen && (
        <Divider variant="fullWidth" sx={{ width: "100%", flexShrink: "1" }} />
      )}

      <DisplayTypography
        selectedWorkflowSlug={selectedWorkflowSlug}
        setSelectedWorkflowSlug={setSelectedWorkflowSlug}
        workflowSlug="care_plan"
        copy="2) Build care plan"
      />
      {!isSmallScreen && (
        <Divider variant="fullWidth" sx={{ width: "100%", flexShrink: "1" }} />
      )}
      <DisplayTypography
        selectedWorkflowSlug={selectedWorkflowSlug}
        setSelectedWorkflowSlug={setSelectedWorkflowSlug}
        workflowSlug="care_team"
        copy="3) Meet your care team"
      />
    </Box>
  );
};

const DisplayTypography: React.FC<{
  workflowSlug: WorkflowSlug;
  selectedWorkflowSlug: WorkflowSlug;
  setSelectedWorkflowSlug: (slug: WorkflowSlug) => void;
  copy: string;
}> = ({
  workflowSlug,
  selectedWorkflowSlug,
  setSelectedWorkflowSlug,
  copy,
}) => {
  const isSelected = workflowSlug === selectedWorkflowSlug;

  const Body = () => (
    <Typography
      variant="h6"
      noWrap
      color={isSelected ? undefined : SONG_BIRD_GREY}
      fontSize={isSelected ? 21 : 16}
    >
      {copy}
    </Typography>
  );
  return (
    <Box>
      {isSelected ? (
        <Body />
      ) : (
        <Button
          sx={{ textTransform: "inherit" }}
          onClick={() => setSelectedWorkflowSlug(workflowSlug)}
        >
          <Body />
        </Button>
      )}
    </Box>
  );
};

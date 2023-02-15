import { Box, Typography } from "@mui/material";
import React from "react";

type Workflow = "onboarding" | "enroll" | "care_team";
export const WorkflowTracker: React.FC<{ selected: Workflow }> = () => {
  return (
    <Box>
      <Typography>Enroll in care</Typography>
    </Box>
  );
};

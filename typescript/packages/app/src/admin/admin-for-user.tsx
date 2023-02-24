import { Tab, Tabs, Box, Typography, TabPanel } from "@mui/material";
import type {
  Child,
  Provider,
  Schedule,
  UserModel,
} from "@songbird/precedent-iso";
import React from "react";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid2 version 2

import { DisplayBCBA } from "./display-bcba";
import { DisplaySchedule } from "./schedule";
import { ViewProfileData } from "./view-profile-data";

export const AdminForUser: React.FC<{
  providers: Provider[];
  child: Child;
  user: UserModel;
  schedule: Schedule;
}> = ({ providers, child, user, schedule }) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <Box
      paddingX={2}
      paddingY={3}
      width="750px"
      height="100%"
      flexDirection={"column"}
      gap={4}
    >
      <Box marginBottom={2}>
        <Typography color="primary" variant="h4">
          Profile
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }} marginBottom={3}>
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            aria-label="Option selection"
          >
            <Tab label="View Profile" />
            <Tab label="Edit Schedule" />
            <Tab label="Edit Assessor BCBA" />
          </Tabs>
        </Box>
        {tabIndex === 0 && (
          <ViewProfileData
            providers={providers}
            child={child}
            user={user}
            schedule={schedule}
          />
        )}
        {tabIndex === 1 && (
          <DisplaySchedule childId={child.id} schedule={schedule} />
        )}
        {tabIndex === 2 && (
          <DisplayBCBA
            childId={child.id}
            initialAssessorId={child.assessorId}
            providers={providers}
          />
        )}
      </Box>
    </Box>
  );
};

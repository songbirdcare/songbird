import { Box, Tab, Tabs, Typography } from "@mui/material";
import type {
  Child,
  Provider,
  Schedule,
  UserModel,
} from "@songbird/precedent-iso";
import React from "react";

import { DisplayBCBA } from "./display-bcba";
import { DisplaySchedule } from "./schedule";
import { SendEmail } from "./send-emails";
import { ViewProfileData } from "./view-profile-data";

export const AdminForUser: React.FC<{
  providers: Provider[];
  child: Child;
  user: UserModel;
  schedule: Schedule;
  mutate: () => void;
}> = ({ providers, child, user, schedule, mutate }) => {
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
            <Tab label="Send emails" />
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
          <DisplaySchedule
            childId={child.id}
            schedule={schedule}
            mutate={mutate}
          />
        )}
        {tabIndex === 2 && (
          <DisplayBCBA
            childId={child.id}
            initialAssessorId={child.assessorId}
            providers={providers}
            mutate={mutate}
          />
        )}
        {tabIndex === 3 && <SendEmail />}
      </Box>
    </Box>
  );
};

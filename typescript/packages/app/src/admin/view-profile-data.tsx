import { Tab, Tabs, Box, Typography, Paper } from "@mui/material";

import type {
  Child,
  Provider,
  Schedule,
  UserModel,
} from "@songbird/precedent-iso";

import Grid2 from "@mui/material/Unstable_Grid2";

export const ViewProfileData: React.FC<{
  providers: Provider[];
  child: Child;
  user: UserModel;
  schedule: Schedule;
}> = ({ providers, child, user, schedule }) => {
  const provider = providers.find((p) => p.id === child.assessorId);
  return (
    <Paper>
      <Box padding={2}>
        <Grid2 container spacing={2}>
          <Grid2 xs={6}>
            <Typography>Email</Typography>
          </Grid2>
          <Grid2 xs={6}>
            <Typography>{user.email}</Typography>
          </Grid2>
          <Grid2 xs={6}>
            <Typography>Parent name</Typography>
          </Grid2>
          <Grid2 xs={6}>
            <Typography>
              {user.givenName} {user.familyName}
            </Typography>
          </Grid2>
          <Grid2 xs={6}>
            <Typography>Phone</Typography>
          </Grid2>
          <Grid2 xs={6}>
            <Typography>{user.phone}</Typography>
          </Grid2>
          <Grid2 xs={6}>
            <Typography>Assessor BCBA</Typography>
          </Grid2>
          <Grid2 xs={6}>
            <Typography>
              {provider?.firstName} {provider?.lastName}
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
    </Paper>
  );
};

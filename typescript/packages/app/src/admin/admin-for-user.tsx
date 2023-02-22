import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import type { Child, Provider, UserModel } from "@songbird/precedent-iso";
import React from "react";
import { Schedule } from "./schedule";

export const AdminForUser: React.FC<{
  providers: Provider[];
  child: Child;
  user: UserModel;
}> = ({ providers, child, user }) => {
  const [accessorId, setAccessorId] = React.useState<string | undefined>(
    child.assessorId
  );
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
        <Typography>{user.email}</Typography>
      </Box>
      <Schedule rows={[]} />
      <FormControl fullWidth>
        <InputLabel id="accessor-bcba">Accessor BCBA</InputLabel>
        <Select
          labelId="accessor-bcba"
          id="accessor-bcba"
          value={accessorId ?? ""}
          label="Accessor BCBA"
          onChange={(e) => {
            setAccessorId(e.target.value === "" ? undefined : e.target.value);
          }}
        >
          <MenuItem value={""}>No BCBA Selected</MenuItem>
          {providers.map((provider) => (
            <MenuItem key={provider.id} value={provider.id}>
              {provider.firstName} {provider.lastName}
            </MenuItem>
          ))}
        </Select>

        <Button>Save</Button>
      </FormControl>
    </Box>
  );
};

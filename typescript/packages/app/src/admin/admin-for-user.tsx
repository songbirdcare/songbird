import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { Child, Provider, UserModel } from "@songbird/precedent-iso";
import React from "react";

export const AdminForUser: React.FC<{
  providers: Provider[];
  child: Child;
  user: UserModel;
}> = ({ providers, child, user }) => {
  const [accessorId, setAccessorId] = React.useState<string | undefined>(
    child.assessorId
  );
  return (
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
        <MenuItem value={""}>No BCBA Accessor</MenuItem>
        {providers.map((provider) => (
          <MenuItem key={provider.id} value={provider.id}>
            {provider.firstName} {provider.lastName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

import { FormControl,InputLabel, MenuItem, Select } from "@mui/material";
import type { Child, Provider,UserModel } from "@songbird/precedent-iso";
import type React from "react";

export const AdminForUser: React.FC<{
  providers: Provider[];
  child: Child;
  user: UserModel;
  //}> = ({ providers, child, user }) => {
}> = (_) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={10}
        label="Age"
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

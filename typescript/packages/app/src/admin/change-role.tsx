import { Box, Button, MenuItem, Select } from "@mui/material";
import type { UserRole } from "@songbird/precedent-iso";
import React from "react";

import { useChangeRole } from "../hooks/use-change-role";

export const ChangeRole: React.FC<{
  id: string;
  role: UserRole;
}> = (params) => {
  const [role, setRole] = React.useState<UserRole>(params.role);
  const { trigger, isMutating } = useChangeRole();
  return (
    <Box>
      <Select
        value={role}
        label="Role"
        onChange={(e) => {
          setRole(e.target.value as UserRole);
        }}
        disabled={isMutating}
      >
        <MenuItem value={"admin"}>Admin</MenuItem>
        <MenuItem value={"user"}>User</MenuItem>
      </Select>

      <Button
        disabled={isMutating}
        onClick={() => {
          trigger({ userId: params.id, role });
        }}
      >
        Save Change
      </Button>
    </Box>
  );
};

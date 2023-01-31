import { Box, Button, Dialog, Typography } from "@mui/material";
import React from "react";
import { useDeleteUser } from "../hooks/use-delete-user";

export const DeleteUser: React.FC<{
  id: string;
  email: string;
}> = (params) => {
  const [open, setOpen] = React.useState(false);
  const { trigger, data, isLoading } = useDeleteUser();

  return (
    <Box>
      <Button color="warning" onClick={() => setOpen(true)}>
        Delete User
      </Button>

      {open && (
        <Dialog onClose={() => setOpen(false)} open={true}>
          <Box display="flex" flexDirection="column" padding={3}>
            <Typography>
              Are you sure you want to delete {params.email}
            </Typography>

            <Box display="flex" justifyContent="center">
              <Button color="warning" disabled={isLoading}>
                Yes
              </Button>
              <Button disabled={isLoading} {() => setOpen(false)}>No</Button>
            </Box>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

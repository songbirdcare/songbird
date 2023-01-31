import { Box, Button, Dialog, TextField,Typography } from "@mui/material";
import React from "react";

import { useDeleteUser } from "../hooks/use-delete-user";

export const DeleteUser: React.FC<{
  id: string;
  email: string;
}> = (params) => {
  const [open, setOpen] = React.useState(false);

  const { trigger, data, isMutating } = useDeleteUser();

  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    if (!data) {
      return;
    }

    setOpen(false);
  }, [data, setOpen]);

  return (
    <Box>
      <Button color="warning" onClick={() => setOpen(true)}>
        Delete User
      </Button>

      {open && (
        <Dialog onClose={() => setOpen(false)} open={true}>
          <Box display="flex" flexDirection="column" padding={3} gap={2}>
            <Typography>
              Are you sure you want to delete {params.email}?
            </Typography>

            <Typography>Type DELETE to confirm</Typography>
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                color="warning"
                variant="contained"
                disabled={isMutating || input !== "DELETE"}
                onClick={() => {
                  trigger({ id: params.id });
                }}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                disabled={isMutating}
                onClick={() => setOpen(false)}
              >
                No
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

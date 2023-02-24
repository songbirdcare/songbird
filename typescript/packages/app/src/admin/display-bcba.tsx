import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Snackbar,
  TextField,
} from "@mui/material";
import type { Provider } from "@songbird/precedent-iso";
import React from "react";

import { useUpdateChild } from "../hooks/use-update-child";

export const DisplayBCBA: React.FC<{
  childId: string;
  initialAssessorId: string | undefined;
  providers: Provider[];
  mutate: () => void;
}> = ({ childId, initialAssessorId, providers, mutate }) => {
  const [assessorId, setAssessorId] = React.useState<string | undefined>(
    initialAssessorId
  );

  const { trigger, isMutating } = useUpdateChild();

  const [open, setOpen] = React.useState(false);
  const showSuccess = () => setOpen(true);

  const onClose = () => setOpen(false);
  const provider = providers.find((p) => p.id === assessorId);

  return (
    <>
      <Autocomplete
        value={provider ?? null}
        onChange={(_, newValue) => {
          if (newValue) {
            setAssessorId(newValue.id);
          }
        }}
        getOptionLabel={(provider) =>
          provider ? `${provider.firstName} ${provider.lastName}` : ""
        }
        options={providers.sort(
          (a, b) => -b.firstName.localeCompare(a.firstName)
        )}
        sx={{ width: 300 }}
        renderInput={({ size, ...rest }) => (
          //@ts-ignore
          <TextField
            variant="outlined"
            label="Select BCBA"
            size={size}
            {...rest}
          />
        )}
      />
      <Box marginTop={3}>
        <Button
          variant="contained"
          disabled={isMutating}
          onClick={async () => {
            await trigger({ assessorId, childId });
            mutate();
            showSuccess();
          }}
        >
          Save BCBA Selection
        </Button>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        sx={{ width: "100%" }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={onClose} severity="success" sx={{ width: "500px" }}>
          BCBA Saved
        </Alert>
      </Snackbar>
    </>
  );
};

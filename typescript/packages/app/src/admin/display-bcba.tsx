import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import type { Provider } from "@songbird/precedent-iso";
import React from "react";

import { useUpdateChild } from "../hooks/use-update-child";

export const DisplayBCBA: React.FC<{
  childId: string;
  initialAssessorId: string | undefined;
  providers: Provider[];
}> = ({ childId, initialAssessorId, providers }) => {
  const [assessorId, setAssessorId] = React.useState<string | undefined>(
    initialAssessorId
  );

  const { trigger, isMutating } = useUpdateChild();

  const [open, setOpen] = React.useState(false);
  const onClose = () => setOpen(false);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="accessor-bcba">Accessor BCBA</InputLabel>
        <Select
          labelId="accessor-bcba"
          id="accessor-bcba"
          value={assessorId ?? ""}
          label="Accessor BCBA"
          onChange={(e) => {
            setAssessorId(e.target.value === "" ? undefined : e.target.value);
          }}
        >
          <MenuItem value={""}>No BCBA Selected</MenuItem>
          {providers.map((provider) => (
            <MenuItem key={provider.id} value={provider.id}>
              {provider.firstName} {provider.lastName}
            </MenuItem>
          ))}
        </Select>

        <Button
          disabled={isMutating}
          onClick={async () => {
            await trigger({ assessorId, childId });
            setOpen(true);
          }}
        >
          Save BCBA Selection
        </Button>
      </FormControl>
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

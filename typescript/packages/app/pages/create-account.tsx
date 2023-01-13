import { Box, LoadingButton, Grid, TextField } from "@mui/material";
import Image from "next/image";
import * as React from "react";
import useSWRMutation from "swr/mutation";
import type { CreateUserResponse } from "@songbird/precedent-iso";
import debounce from "lodash/debounce";

const CreateAccount: React.FC = () => {
  const { data, trigger, isMutating } = useSWRMutation<CreateUserResponse>(
    "/api/proxy/public-users/create",
    async (url: string) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      return res.json();
    }
  );
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const debouncedTrigger = React.useRef(debounce(trigger, 250)).current;

  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
    >
      <Image src="/songbird-logo.svg" alt="me" width="128" height="64" />
      <form>
        <Grid
          container
          alignItems="center"
          direction="column"
          component={Box}
          gap={2}
        >
          <Grid item>
            <TextField
              id="email-input"
              name="Email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              id="password-input"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid>
            <LoadingButton
              loading={true}
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default CreateAccount;

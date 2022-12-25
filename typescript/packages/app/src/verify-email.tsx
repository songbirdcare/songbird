import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { EmailVerification } from "@songbird/precedent-iso";
import React from "react";
import useSWR from "swr";

import { SONG_BIRD_BIEGE } from "./style/colors";

export const VerifyEmail: React.FC = () => {
  const [url, setUrl] = React.useState<string | null>(null);

  const makeRequest = () => setUrl("/api/proxy/users/send-email-verification");

  const { data, isLoading } = useSWR<{ data: EmailVerification }>(
    url,
    async (url) => {
      const response = await fetch(url, {
        method: "POST",
      });
      return response.json();
    }
  );
  return (
    <Box
      display="flex"
      justifyContent="center"
      bgcolor={SONG_BIRD_BIEGE}
      height="100%"
    >
      <Box
        display="flex"
        height="100%"
        alignItems="center"
        justifyContent="center"
        width="725px"
        flexDirection="column"
      >
        <Typography variant="h5" align="center">
          Please verify your email
        </Typography>

        <Button
          onClick={makeRequest}
          disabled={isLoading || data !== undefined}
          variant="contained"
        >
          Click here to resend verification email
        </Button>

        {data?.data === "sent" && (
          <Typography align="center">Email sent</Typography>
        )}
      </Box>
    </Box>
  );
};

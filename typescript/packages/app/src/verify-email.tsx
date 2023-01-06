import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { EmailVerification } from "@songbird/precedent-iso";
import React from "react";
import useSWR from "swr";

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
        Send verification email
      </Button>

      {data?.data === "sent" && (
        <Typography align="center" variant="subtitle1">
          Email sent
        </Typography>
      )}
    </Box>
  );
};

import EmailIcon from "@mui/icons-material/Email";
import { Button, Paper, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { EmailVerification } from "@songbird/precedent-iso";
import React from "react";
import useSWR from "swr";

import styles from "./verify-email.module.css";

export const VerifyEmail: React.FC<{ email: string }> = ({ email }) => {
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

  const isSmallScreen = useMediaQuery("(max-width:670px)");

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="100%"
    >
      <Box width="100%">
        <Paper sx={{ height: "100%" }}>
          <Box
            display="flex"
            width="100%"
            height="100%"
            className={styles.content as string}
            padding={2}
          >
            <Box
              display="flex"
              fontSize="64px"
              alignItems="center"
              className={styles.icon as string}
              padding={isSmallScreen ? 0 : 2}
            >
              <EmailIcon fontSize="inherit" color="primary" />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              className={styles["not-icon"] as string}
            >
              <Typography variant="h6" className={styles["header"] as string}>
                Verify your email
              </Typography>
              <Typography className={styles["content-text"] as string}>
                A verification email has been sent to {email}
              </Typography>

              <Box
                display="flex"
                marginTop={2}
                className={styles["send-button"] as string}
              >
                <Button
                  onClick={makeRequest}
                  disabled={isLoading || data !== undefined}
                  variant="contained"
                >
                  {data?.data !== "sent"
                    ? "Resend verification email"
                    : "Email sent"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

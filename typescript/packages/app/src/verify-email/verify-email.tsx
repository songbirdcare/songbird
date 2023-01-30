import { LoadingButton } from "@mui/lab";
import { Button, Paper, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { EmailVerification } from "@songbird/precedent-iso";
import Image from "next/image";
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
      paddingX={2}
    >
      <Paper
        width="100%"
        component={Box}
        display="flex"
        className={styles.content as string}
        padding={2}
      >
        <Box
          display="flex"
          fontSize="64px"
          alignItems="center"
          className={styles.icon as string}
          paddingRight={isSmallScreen ? 0 : 2}
        >
          <Image
            src="/onboarding/hands.svg"
            width={64}
            height={60}
            alt="Verify your email"
          />
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
            <LoadingButton
              size="small"
              onClick={makeRequest}
              loading={isLoading}
              disabled={data !== undefined}
              variant="contained"
              sx={{
                minWidth: "116px",
              }}
            >
              {data?.data !== "sent" ? "Resend email" : "Email sent"}
            </LoadingButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

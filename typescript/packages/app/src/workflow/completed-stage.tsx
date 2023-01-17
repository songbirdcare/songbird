import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

import styles from "./completed-stage.module.css";

const REDIRECT_WAIT_TIME = 5_000;
export const CompletedStage = () => {
  const router = useRouter();
  React.useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, REDIRECT_WAIT_TIME);
  }, [router]);

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
        padding={2}
        className={styles.content as string}
      >
        <Box
          display="flex"
          fontSize="64px"
          alignItems="center"
          className={styles.icon as string}
        >
          <Image
            src="/onboarding/hands.svg"
            width={64}
            height={60}
            alt="Task completed"
          />
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Typography variant="h6" className={styles["text"] as string}>
            Task Completed
          </Typography>
          <Typography className={styles["text"] as string}>
            You will be redirected back to the dashboard
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

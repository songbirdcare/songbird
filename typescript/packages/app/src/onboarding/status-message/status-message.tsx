import React from "react";
import { Box, Typography } from "@mui/material";

import styles from "./status-message.module.css";

export const StatusMessage: React.FC<{
  header: string;
  byline: string;
}> = ({ header, byline }) => {
  return (
    <>
      <Typography
        variant="h5"
        color="primary"
        className={styles["text"] as string}
        fontSize="1.75rem"
      >
        {header}
      </Typography>
      <Typography className={styles["text"] as string}>{byline}</Typography>
    </>
  );
};

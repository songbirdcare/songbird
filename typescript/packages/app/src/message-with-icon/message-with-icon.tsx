import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

import styles from "./message-with-icon.module.css";

interface MessageWithIconProps {
  icon: string;
  title: string;
  width: number;
  height: number;
  message?: string;
  alt: string;
}
export const MessageWithIcon: React.FC<MessageWithIconProps> = ({
  icon,
  title,
  alt,
  message,
  width,
  height,
}) => {
  return (
    <Paper
      width="100%"
      component={Box}
      display="flex"
      padding={2}
      gap={2}
      className={styles["container"] as string}
    >
      <Box
        display="flex"
        fontSize="64px"
        alignItems="center"
        justifyContent="center"
      >
        <Image src={icon} width={width} height={height} alt={alt} />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Typography
          variant="h5"
          color="primary"
          className={styles.text as string}
        >
          {title}
        </Typography>
        {message && (
          <Typography variant="body1" className={styles.text as string}>
            {message}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

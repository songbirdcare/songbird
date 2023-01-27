import { Box,Paper, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

import styles from "./message-with-icon.module.css";

interface MessageWithIconProps {
  icon: string;
  message: string;
  alt: string;
}
export const MessageWithIcon: React.FC<MessageWithIconProps> = ({
  icon,
  message,
  alt,
}) => {
  return (
    <Paper
      width="100%"
      component={Box}
      display="flex"
      padding={2}
      gap={1}
      className={styles["container"] as string}
    >
      <Box
        display="flex"
        fontSize="64px"
        alignItems="center"
        justifyContent="center"
      >
        <Image src={icon} width={64} height={60} alt={alt} />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Typography variant="h6">{message}</Typography>
      </Box>
    </Paper>
  );
};

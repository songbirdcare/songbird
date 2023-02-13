import Box from "@mui/material/Box";
import type { DisqualificationReason } from "@songbird/precedent-iso";
import React from "react";

export const Disqualify: React.FC<{ reason: DisqualificationReason }> = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="100%"
      paddingX={2}
    ></Box>
  );
};

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Alert, Box, Button,LinearProgress } from "@mui/material";
import * as React from "react";

import { useImpersonateContext } from "./impersonate-context";
import { ImpersonateService } from "./impersonate-service";

export const ImpersonateBanner: React.FC = () => {
  const { id } = useImpersonateContext();
  if (!id) {
    return null;
  }
  return (
    <Box position="absolute" top="2px" zIndex={10000} left="16px">
      <Alert severity="warning">
        Impersonation mode enabled
        <Button
          color="secondary"
          onClick={() => {
            ImpersonateService.clear();
            location.reload();
          }}
        >
          STOP
        </Button>
      </Alert>
    </Box>
  );
};

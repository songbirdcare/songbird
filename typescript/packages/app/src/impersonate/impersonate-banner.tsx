import { Alert, Box, Button } from "@mui/material";
import * as React from "react";

import { useImpersonateContext } from "./impersonate-context";
import { ImpersonateService } from "./impersonate-service";

export const ImpersonateBanner: React.FC = () => {
  const { id, user } = useImpersonateContext();

  // without the state / useEffect pattern I get nextjs hydration errors
  const [slug, setSlug] = React.useState<string | undefined>(undefined);
  React.useEffect(() => setSlug(user?.email ?? id), [id, user?.email]);
  if (!slug) {
    return null;
  }

  return (
    <Box position="absolute" top="2px" zIndex={10000} left="16px">
      <Alert severity="warning">
        Impersonating {slug}
        <Button
          color="secondary"
          onClick={() => {
            ImpersonateService.clear();
            location.replace("/admin");
          }}
        >
          Stop
        </Button>
      </Alert>
    </Box>
  );
};

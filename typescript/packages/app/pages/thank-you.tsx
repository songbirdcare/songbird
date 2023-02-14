import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import type { Child, DisqualificationReason } from "@songbird/precedent-iso";
import { assertNever } from "@songbird/precedent-iso";
import { track } from "logrocket";
import { useRouter } from "next/router";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { Disqualify } from "../src/disqualify/disqualify";
import { useFetchChild } from "../src/hooks/use-fetch-child";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { useTrackOnce } from "../src/hooks/use-track-once";
import { TRACKER } from "../src/track";

const ThankYou: React.FC = () => {
  useRedirectIfNotVerified();

  const { data, isLoading } = useFetchChild();

  const reason = getReason(data);
  const router = useRouter();

  useTrackOnce("page_accessed", { page: "thank-you" });

  React.useEffect(() => {
    if (data && !reason) {
      TRACKER.track("not_eligible_redirect");

      router.push("/");
    }
  }, [router, reason, data]);

  return (
    <>
      <AppBar />

      <BodyContainer>
        {isLoading && !reason && (
          <Box display="flex" width="100%" height="100%">
            <LinearProgress
              color="primary"
              sx={{
                height: "4px",
                width: "100%",
              }}
            />
          </Box>
        )}
        {reason && <Disqualify reason={reason} />}
      </BodyContainer>
    </>
  );
};

function getReason(
  child: Child | undefined
): DisqualificationReason | undefined {
  if (!child) {
    return undefined;
  }

  switch (child.qualified.type) {
    case "qualified":
    case "unknown":
      return undefined;
    case "disqualified":
      return child.qualified.reason;
    default:
      assertNever(child.qualified);
  }
}

export default withPageAuthRequired(ThankYou);

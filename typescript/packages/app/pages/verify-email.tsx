import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useTrackOnce } from "../src/hooks/use-track-once";
import { VerifyEmail } from "../src/verify-email/verify-email";

const VerifyEmailPage: React.FC = () => {
  const { data: user, isLoading: userIsLoading } = useFetchUser();

  const router = useRouter();
  const isEmailVerified = user?.emailVerified;
  React.useEffect(() => {
    if (isEmailVerified) {
      router.push("/");
    }
  }, [router, isEmailVerified]);

  useTrackOnce("verify-email page accessed");

  return (
    <>
      <AppBar />

      <BodyContainer>
        {userIsLoading || !user ? (
          <Box display="flex" width="100%" height="100%">
            <LinearProgress sx={{ width: "100%" }} />
          </Box>
        ) : (
          <VerifyEmail email={user.email} />
        )}
      </BodyContainer>
    </>
  );
};

export default withPageAuthRequired(VerifyEmailPage);

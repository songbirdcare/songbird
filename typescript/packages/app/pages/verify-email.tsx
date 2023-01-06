import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import * as React from "react";

import { useFetchUser } from "../src/hooks/use-fetch-user";
import { VerifyEmail } from "../src/verify-email";

const Home: React.FC = () => {
  const { data: user, isLoading: userIsLoading } = useFetchUser();

  const router = useRouter();
  const isEmailVerified = user?.emailVerified;
  React.useEffect(() => {
    if (isEmailVerified) {
      router.push("/");
    }
  }, [router, isEmailVerified]);

  return <>{userIsLoading ? <LinearProgress /> : <VerifyEmail />}</>;
};

export default withPageAuthRequired(Home);

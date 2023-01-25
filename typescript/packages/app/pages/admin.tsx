import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";
import { AdminMain } from "../src/admin/admin-main";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchUser } from "../src/hooks/use-fetch-user";

AdminMain;
const Admin: React.FC = () => {
  const { data: user, isLoading: userIsLoading } = useFetchUser();

  const router = useRouter();

  const role = user?.role;
  React.useEffect(() => {
    if (role !== "admin") {
      //router.push("/");
    }
  }, [router, role]);

  return (
    <>
      <AppBar />

      <BodyContainer>
        {userIsLoading || !user ? (
          <Box display="flex" width="100%" height="100%">
            <LinearProgress sx={{ width: "100%" }} />
          </Box>
        ) : (
          <AdminMain />
        )}
      </BodyContainer>
    </>
  );
};

export default withPageAuthRequired(Admin);

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";

import { AdminMain } from "../src/admin/admin-main";
import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useChangeRole } from "../src/hooks/use-change-role";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useFetchUsers } from "../src/hooks/use-fetch-users";

const Admin: React.FC = () => {
  const { data: user, isLoading: userIsLoading } = useFetchUser();

  const { data: users } = useFetchUsers();

  const router = useRouter();

  const role = user?.role;
  React.useEffect(() => {
    if (role && role !== "admin") {
      router.push("/");
    }
  }, [router, role]);

  return (
    <>
      <AppBar />

      <BodyContainer>
        {userIsLoading || !user || !users ? (
          <Box display="flex" width="100%" height="100%">
            <LinearProgress sx={{ width: "100%" }} />
          </Box>
        ) : (
          <AdminMain selfId={user.id} users={users} />
        )}
      </BodyContainer>
    </>
  );
};

export default withPageAuthRequired(Admin);

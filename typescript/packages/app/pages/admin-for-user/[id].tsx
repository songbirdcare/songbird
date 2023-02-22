import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";

import { AdminForUser } from "../../src/admin/admin-for-user";
import { AppBar } from "../../src/app-bar/app-bar";
import { BodyContainer } from "../../src/body-container";
import { useFetchMe } from "../../src/hooks/use-fetch-user";
import { useFetchUsers } from "../../src/hooks/use-fetch-users";

const AdminForUserPage: React.FC = () => {
  const { data: user, isLoading: userIsLoading } = useFetchMe();
  const { data: users } = useFetchUsers();
  const router = useRouter();

  const role = user?.role;
  React.useEffect(() => {
    if (role && role !== "admin") {
      router.push("/");
    }
  }, [router, role]);

  const { id } = router.query;
  if (typeof id !== "string") {
    throw new Error("invalid id");
  }
  console.log(id);

  return (
    <>
      <AppBar />

      <BodyContainer>
        {userIsLoading || !user || !users ? (
          <Box display="flex" width="100%" height="100%">
            <LinearProgress sx={{ width: "100%" }} />
          </Box>
        ) : (
          <AdminForUser id={id} />
        )}
      </BodyContainer>
    </>
  );
};

export default withPageAuthRequired(AdminForUserPage);

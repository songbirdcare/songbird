import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";

import { AdminForUser } from "../../src/admin/admin-for-user";
import { AppBar } from "../../src/app-bar/app-bar";
import { BodyContainer } from "../../src/body-container";
import { useFetchAdminUserData } from "../../src/hooks/use-fetch-admin-user-data";
import { useFetchProviders } from "../../src/hooks/use-fetch-providers";
import { useFetchMe } from "../../src/hooks/use-fetch-user";

const AdminForUserPage: React.FC = () => {
  const { data: user } = useFetchMe();
  const router = useRouter();

  const role = user?.role;
  React.useEffect(() => {
    if (role && role !== "admin") {
      router.push("/");
    }
  }, [router, role]);

  const { id } = router.query;
  if (Array.isArray(id)) {
    throw new Error(`invalid id: ${id}`);
  }

  const { data: providers } = useFetchProviders();
  const { data: userData } = useFetchAdminUserData(id);
  console.log({ userData, providers });

  return (
    <>
      <AppBar />

      <BodyContainer>
        {!providers || !userData || typeof id !== "string" ? (
          <Box display="flex" width="100%" height="100%">
            <LinearProgress sx={{ width: "100%" }} />
          </Box>
        ) : (
          <AdminForUser
            providers={providers}
            child={userData.child}
            user={userData.user}
          />
        )}
      </BodyContainer>
    </>
  );
};

export default withPageAuthRequired(AdminForUserPage);

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import * as React from "react";

import { Dashboard } from "../src/dashboard/dashboard";
import { useFetchMe } from "../src/hooks/use-fetch-user";
import { SETTINGS } from "../src/settings";

const Home: React.FC = () => {
  const { data: user } = useFetchMe();
  const router = useRouter();

  const role = user?.role;
  React.useEffect(() => {
    if (role === "admin" && !SETTINGS.testAdminNoRedirect) {
      router.push("/admin");
    }
  }, [router, role]);

  return <Dashboard />;
};

export default withPageAuthRequired(Home);

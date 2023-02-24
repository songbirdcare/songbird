import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import * as React from "react";

import { Dashboard } from "../src/dashboard/dashboard";

const ParentDashboard: React.FC = () => {
  return <Dashboard />;
};

export default withPageAuthRequired(ParentDashboard);

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Dashboard } from "../src/dashboard/dashboard";

import * as React from "react";

const ParentDashboard: React.FC = () => {
  return <Dashboard />;
};

export default withPageAuthRequired(ParentDashboard);

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import LinearProgress from "@mui/material/LinearProgress";
import * as React from "react";

import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { RenderWorkflow } from "../src/render-workflow";

const CompleteStage: React.FC = () => {
  const { data: workflow } = useFetchWorkflow();
  return (
    <>
      {!workflow && <LinearProgress />}
      {workflow && <RenderWorkflow workflow={workflow} />}
    </>
  );
};

export default withPageAuthRequired(CompleteStage);

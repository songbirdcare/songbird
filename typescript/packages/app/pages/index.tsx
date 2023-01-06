import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import LinearProgress from "@mui/material/LinearProgress";
import * as React from "react";

import { useFetchWorkflow } from "../src/hooks/use-fetch-workflow";
import { OnboardingFlow } from "../src/onboarding/onboarding-flow";
const Home: React.FC = () => {
  const { data: workflow } = useFetchWorkflow();
  return (
    <>
      {!workflow && <LinearProgress />}
      {workflow && (
        <OnboardingFlow
          currentStageIndex={workflow.currentStageIndex}
          stages={workflow.stages}
        />
      )}
    </>
  );
};

export default withPageAuthRequired(Home);

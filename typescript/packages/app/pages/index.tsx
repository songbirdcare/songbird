import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box, LinearProgress } from "@mui/material";
import type { WorkflowSlug } from "@songbird/precedent-iso";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchChild } from "../src/hooks/use-fetch-child";
import { useFetchUser } from "../src/hooks/use-fetch-user";
import { useFetchWorkflows } from "../src/hooks/use-fetch-workflows";
import { useSBFlags } from "../src/hooks/use-flags";
import { useRedirectIfNotEligible } from "../src/hooks/use-redirect-if-not-eligible";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { useTrackOnce } from "../src/hooks/use-track-once";
import { DisplayWorkflowStages } from "../src/onboarding/onboarding-flow";
import { SETTINGS } from "../src/settings";

const Home: React.FC = () => {
  const { data: user, isLoading: userIsLoading } = useFetchUser();
  const { data: workflows, isLoading: workflowsIsLoading } =
    useFetchWorkflows();
  const { data: child, mutate } = useFetchChild();
  const { isLoading: childIsLoading } = useRedirectIfNotEligible();

  useRedirectIfNotVerified();

  useTrackOnce("page_accessed", { page: "home" });
  const isLoading = userIsLoading || workflowsIsLoading || childIsLoading;
  const flags = useSBFlags();
  const extendedOnboarding = flags.flags.extendedOnboarding;

  const [workflowSlug, setWorkflowSlug] = React.useState<
    WorkflowSlug | undefined
  >(undefined);

  const workflow = (() => {
    if (!child || !workflows) {
      return undefined;
    }

    if (!extendedOnboarding) {
      return workflows["onboarding"];
    }
    return workflows[workflowSlug ?? child.workflowSlug];
  })();

  React.useEffect(() => {
    if (!child || !workflow || workflowSlug || !extendedOnboarding) {
      return;
    }
    if (child.workflowSlug !== workflow.slug) {
      console.log("Refetch child in case of a race");
      mutate();
    }
  }, [child, workflow, workflowSlug, mutate, extendedOnboarding]);

  return (
    <>
      <AppBar />

      <BodyContainer>
        {isLoading && (
          <Box width="100%" height="100%">
            <LinearProgress />
          </Box>
        )}
        {!isLoading && workflow && user && child && (
          <DisplayWorkflowStages
            firstName={user.givenName?.trim()}
            isCompleted={workflow.status === "completed"}
            currentStageIndex={workflow.currentStageIndex}
            extendedOnboarding={extendedOnboarding}
            workflowSlug={workflow.slug}
            stages={workflow.stages}
            setWorkflowSlug={setWorkflowSlug}
            isWorkflowEnabled={
              SETTINGS.testAnyWorkflowStage ||
              workflowSlug === undefined ||
              workflowSlug === child.workflowSlug
            }
          />
        )}
      </BodyContainer>
    </>
  );
};

export default withPageAuthRequired(Home);

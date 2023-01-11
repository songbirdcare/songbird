import EmbedFlow from "@formsort/react-embed";
import { LinearProgress } from "@mui/material";
import { Box, Typography } from "@mui/material";
import type { FormTask, WorkflowModel } from "@songbird/precedent-iso";
import type { Stage } from "@songbird/precedent-iso";
import { assertNever } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";
import useSWRMutation from "swr/mutation";

import { useFetchWorkflow } from "./hooks/use-fetch-workflow";

export const RenderWorkflow: React.FC<{
  userId: string;
  workflow: WorkflowModel;
}> = ({ userId, workflow }) => {
  const { currentStageIndex, stages } = workflow;

  const currentStage = stages[currentStageIndex];
  if (currentStage === undefined) {
    throw new Error("illegal state");
  }

  return (
    <RenderStage
      userId={userId}
      stage={currentStage}
      currentStageIndex={currentStageIndex}
    />
  );
};

export const RenderStage: React.FC<{
  userId: string;
  stage: Stage;
  currentStageIndex: number;
}> = ({ stage, currentStageIndex, userId }) => {
  switch (stage.type) {
    case "create_account":
      throw Error("not implemented");
    case "submit_records":
    case "check_insurance_coverage": {
      const [task] = stage.blockingTasks;

      if (task === undefined) {
        throw new Error("illegal state");
      }

      return (
        <RenderForm
          task={task}
          userId={userId}
          currentStageIndex={currentStageIndex}
        />
      );
    }
    case "commitment_to_care":
      return (
        <Box display="flex" marginTop={3}>
          <Typography> Please sign the agreement</Typography>
        </Box>
      );

    default:
      assertNever(stage);
  }
};

const RenderForm: React.FC<{
  task: FormTask;
  userId: string;
  currentStageIndex: number;
}> = ({ task, userId, currentStageIndex }) => {
  const router = useRouter();
  const { mutate } = useFetchWorkflow();

  const [hasSubmittedForm, setHasSubmittedForm] = React.useState(false);

  const { trigger, isMutating, data } = useSWRMutation(
    "/api/proxy/workflows/submit-form",
    async (url) => {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stageIndex: currentStageIndex,
        }),
      });
      return res.json();
    }
  );

  React.useEffect(() => {
    if (hasSubmittedForm) {
      trigger();
    }
  }, [trigger, hasSubmittedForm]);

  React.useEffect(() => {
    if (data) {
      mutate();
      router.push("/");
    }
  }, [router, data, mutate]);

  if (isMutating) {
    return <LinearProgress />;
  }
  return (
    <EmbedFlow
      clientLabel={task.config.client}
      flowLabel={task.config.flowLabel}
      variantLabel={task.config.variantLabel}
      responderUuid={userId}
      embedConfig={{
        style: {
          width: "100%",
          height: "100%",
        },
      }}
      onFlowFinalized={() => setHasSubmittedForm(true)}
    />
  );
};

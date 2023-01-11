import EmbedFlow from "@formsort/react-embed";
import { LinearProgress } from "@mui/material";
import { Box, Typography, Button } from "@mui/material";
import type {
  FormTask,
  ScheduleTask,
  WorkflowModel,
} from "@songbird/precedent-iso";
import type { Stage } from "@songbird/precedent-iso";
import { assertNever } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";
import useSWRMutation from "swr/mutation";

import { useFetchWorkflow } from "./hooks/use-fetch-workflow";
import { SETTINGS } from "./settings";

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
      workflowId={workflow.id}
      stage={currentStage}
    />
  );
};

export const RenderStage: React.FC<{
  userId: string;
  stage: Stage;
  workflowId: string;
}> = ({ stage, userId, workflowId }) => {
  switch (stage.type) {
    case "create_account": {
      const [task] = stage.blockingTasks;

      if (task === undefined) {
        throw new Error("illegal state");
      }
      return (
        <RenderSchedule
          stageId={stage.id}
          taskId={task.id}
          workflowId={workflowId}
        />
      );
    }

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
          stageId={stage.id}
          workflowId={workflowId}
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
  workflowId: string;
  task: FormTask;
  stageId: string;
  userId: string;
}> = ({ workflowId, task, userId, stageId }) => {
  const router = useRouter();
  const { mutate } = useFetchWorkflow();

  const [hasSubmittedForm, setHasSubmittedForm] = React.useState(false);

  const { trigger, isMutating, data } = useSWRMutation(
    `/api/proxy/workflows/action/${workflowId}`,
    async (url) => {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "form",
          taskId: task.id,
          stageId,
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

const RenderSchedule: React.FC<{
  workflowId: string;
  taskId: string;
  stageId: string;
}> = ({ workflowId, taskId, stageId }) => {
  const router = useRouter();
  const { mutate } = useFetchWorkflow();

  const { trigger, isMutating, data } = useSWRMutation(
    `/api/proxy/workflows/action/${workflowId}`,
    async (url) => {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "schedule",
          taskId,
          stageId,
        }),
      });
      return res.json();
    }
  );

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
    <Box>
      {SETTINGS.enableDebuggingAction && (
        <Button onClick={trigger} disabled={isMutating}>
          Skip to next step
        </Button>
      )}
    </Box>
  );
};

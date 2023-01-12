import { Box, Button,Typography } from "@mui/material";
import type {
  FormTask,
  ScheduleTask,
  WorkflowModel,
} from "@songbird/precedent-iso";
import type { Stage } from "@songbird/precedent-iso";
import { assertNever } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import useSWRMutation from "swr/mutation";

import { useFetchWorkflow } from "./hooks/use-fetch-workflow";
import { RenderForm } from "./render-form";
import { RenderSchedule } from "./render-schedule";
import { SETTINGS } from "./settings";

export const RenderWorkflow: React.FC<{
  userId: string;
  workflow: WorkflowModel;
  stageType: Stage["type"] | undefined;
}> = ({ userId, workflow, stageType }) => {
  const { currentStageIndex, stages } = workflow;

  const stage = (() => {
    if (!stageType) {
      const currentStage = stages[currentStageIndex];
      if (currentStage === undefined) {
        throw new Error("illegal state");
      }
      return currentStage;
    }

    const stage = stages.find((s) => s.type === stageType);
    if (stage === undefined) {
      throw new Error("illegal state");
    }
    return stage;
  })();

  return <RenderStage userId={userId} workflowId={workflow.id} stage={stage} />;
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
    case "commitment_to_care": {
      const [task] = stage.blockingTasks;

      if (task === undefined) {
        throw new Error("illegal state");
      }
      return (
        <RenderSignature
          workflowId={workflowId}
          stageId={stage.id}
          taskId={task.id}
        />
      );
    }
    default:
      assertNever(stage);
  }
};

const RenderSignature: React.FC<{
  workflowId: string;
  taskId: string;
  stageId: string;
}> = ({ workflowId, taskId, stageId }) => {
  const router = useRouter();
  const { mutate } = useFetchWorkflow();

  React.useEffect(() => {
    if (!SETTINGS.enableDebuggingAction) {
      router.push("/");
    }
  }, [router]);

  const { data, trigger, isMutating } = useSWRMutation(
    `/api/proxy/workflows/action/${workflowId}`,
    async (url) => {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "signature",
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

  return (
    <Box paddingY={3}>
      <Button disabled={isMutating} onClick={trigger}>
        Advance to the next step
      </Button>
    </Box>
  );
};

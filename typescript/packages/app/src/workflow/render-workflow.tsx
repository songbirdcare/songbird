import { Box } from "@mui/material";
import type { Stage, WorkflowModel } from "@songbird/precedent-iso";
import { assertNever } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";
import useSWRMutation from "swr/mutation";

import { AdvanceToNextStep } from "../advance-to-next-step";
import { useFetchChild } from "../hooks/use-fetch-child";
import { useFetchWorkflow } from "../hooks/use-fetch-workflow";
import { useImpersonateContext } from "../impersonate/impersonate-context";
import { CompletedStage } from "./completed-stage";
import { RenderDummy } from "./render-dummy";
import { RenderForm } from "./render-form";
import { RenderSchedule } from "./render-schedule";

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
  const [task] = stage.blockingTasks;

  const { mutate: mutateChild } = useFetchChild();
  const { mutate: mutateWorkflow } = useFetchWorkflow(undefined);

  const mutate = React.useCallback(() => {
    mutateChild();
    mutateWorkflow();
  }, [mutateChild, mutateWorkflow]);

  if (task === undefined) {
    throw new Error("illegal state");
  }

  const isCompleted = React.useRef(task.status === "complete").current;

  if (isCompleted) {
    return <CompletedStage />;
  }

  switch (task.type) {
    case "form":
      return (
        <RenderForm
          task={task}
          userId={userId}
          stageId={stage.id}
          workflowId={workflowId}
          mutate={mutate}
        />
      );
    case "signature":
      return (
        <RenderSignature
          workflowId={workflowId}
          stageId={stage.id}
          taskId={task.id}
          mutate={mutate}
        />
      );

    case "schedule":
      return (
        <RenderSchedule
          stageId={stage.id}
          taskId={task.id}
          workflowId={workflowId}
          mutate={mutate}
        />
      );
    case "dummy":
      return (
        <RenderDummy
          stageId={stage.id}
          taskId={task.id}
          workflowId={workflowId}
          mutate={mutate}
        />
      );
    default:
      assertNever(task);
  }
};

const RenderSignature: React.FC<{
  workflowId: string;
  taskId: string;
  stageId: string;
  mutate: () => void;
}> = ({ workflowId, taskId, stageId, mutate }) => {
  const router = useRouter();

  const { enableAdminDebugging } = useImpersonateContext();

  React.useEffect(() => {
    if (!enableAdminDebugging) {
      router.push("/");
    }
  }, [router, enableAdminDebugging]);

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
      <AdvanceToNextStep disabled={isMutating} onClick={trigger} />
    </Box>
  );
};

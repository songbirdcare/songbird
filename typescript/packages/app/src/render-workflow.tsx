import EmbedFlow from "@formsort/react-embed";
import { LinearProgress } from "@mui/material";
import type { WorkflowModel } from "@songbird/precedent-iso";
import type { Stage } from "@songbird/precedent-iso";
import { assertNever } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";
import useSWRMutation from "swr/mutation";

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
  const router = useRouter();

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
      router.push("/");
    }
  }, [router, data]);

  if (isMutating) {
    return <LinearProgress />;
  }

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
    }
    case "commitment_to_care":
      return <div>Commitment To Care</div>;

    default:
      assertNever(stage);
  }
};

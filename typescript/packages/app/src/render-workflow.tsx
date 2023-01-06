import EmbedFlow from "@formsort/react-embed";
import type { WorkflowModel } from "@songbird/precedent-iso";
import type { Stage } from "@songbird/precedent-iso";
import { assertNever } from "@songbird/precedent-iso";
import * as React from "react";
import { useRouter } from "next/router";
import type { userAgent } from "next/server";

export const RenderWorkflow: React.FC<{ workflow: WorkflowModel }> = ({
  workflow,
}) => {
  const { currentStageIndex, stages } = workflow;

  const currentStage = stages[currentStageIndex];
  if (currentStage === undefined) {
    throw new Error("illegal state");
  }

  return <RenderStage stage={currentStage} />;
};

export const RenderStage: React.FC<{ stage: Stage }> = ({ stage }) => {
  const router = useRouter();
  switch (stage.type) {
    case "create_account":
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
          embedConfig={{
            style: {
              width: "100%",
              height: "100%",
            },
          }}
          onFlowFinalized={() => {
            router.push("/");
          }}
        />
      );
    }
    case "submit_records":
    case "commitment_to_care":
      throw new Error("not implemented");

    default:
      assertNever(stage);
  }
};

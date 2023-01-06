import type { WorkflowModel } from "@songbird/precedent-iso";
import type { Stage } from "@songbird/precedent-iso";
import { assertNever } from "@songbird/precedent-iso";
import EmbedFlow from "@formsort/react-embed";

import * as React from "react";

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
  switch (stage.type) {
    case "create_account":
    case "check_insurance_coverage":
      return (
        <EmbedFlow
          clientLabel="KBSuFeF9MN"
          flowLabel="nasr-sandbox"
          variantLabel="main"
          embedConfig={{
            style: {
              width: "100%",
              height: "100%",
            },
          }}
        />
      );
    case "submit_records":
    case "commitment_to_care":
      throw new Error("not implemented");

    default:
      assertNever(stage);
  }
};

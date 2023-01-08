import EmbedFlow, { IReactEmbedEventMap } from "@formsort/react-embed";
import { LinearProgress } from "@mui/material";
import type { WorkflowModel } from "@songbird/precedent-iso";
import type { Stage } from "@songbird/precedent-iso";
import { assertNever } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";
import useSWRMutation from "swr/mutation";

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

type FormResponseData = Parameters<
  NonNullable<IReactEmbedEventMap["onFlowFinalized"]>
>[0];
export const RenderStage: React.FC<{ stage: Stage }> = ({ stage }) => {
  const router = useRouter();

  const [formData, setFormData] = React.useState<FormResponseData | undefined>(
    undefined
  );

  const { trigger, isMutating } = useSWRMutation(
    "/api/proxy/workflows/submit-form",
    async (url) => {
      const res = await fetch(url, {
        method: "POST",
      });
      return res.json();
    }
  );

  React.useEffect(() => {
    if (formData === undefined) {
      trigger();
    }
  }, [trigger, formData]);

  React.useEffect(() => {
    if (formData !== undefined) {
      router.push("/");
    }
  }, [router, formData]);

  if (isMutating) {
    return <LinearProgress />;
  }

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
          onFlowFinalized={(payload) => {
            setFormData(payload);
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

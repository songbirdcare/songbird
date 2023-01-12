import EmbedFlow from "@formsort/react-embed";
import type { FormTask } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";
import useSWRMutation from "swr/mutation";

import { useFetchWorkflow } from "../hooks/use-fetch-workflow";

export const RenderForm: React.FC<{
  workflowId: string;
  task: FormTask;
  stageId: string;
  userId: string;
}> = ({ workflowId, task, userId, stageId }) => {
  const router = useRouter();
  const { mutate } = useFetchWorkflow();

  const [hasSubmittedForm, setHasSubmittedForm] = React.useState(false);

  const { trigger, data } = useSWRMutation(
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

import EmbedFlow from "@formsort/react-embed";
import { Box, Button, LinearProgress, Snackbar } from "@mui/material";
import type { FormTask } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";
import useSWRMutation from "swr/mutation";
import amplitude from "amplitude-js";

import { useFetchFormConfig } from "../hooks/use-fetch-form-config";
import { useFetchWorkflow } from "../hooks/use-fetch-workflow";
import { useImpersonateContext } from "../impersonate/impersonate-context";
import { SETTINGS } from "../settings";

const REDIRECT_WAIT_TIME = 5_000;

export const RenderForm: React.FC<{
  workflowId: string;
  task: FormTask;
  stageId: string;
  userId: string;
}> = ({ workflowId, task, userId, stageId }) => {
  const router = useRouter();
  const { mutate } = useFetchWorkflow();
  const { data: formData, isLoading } = useFetchFormConfig(task.slug);

  const [hasSubmittedForm, setHasSubmittedForm] = React.useState(false);

  const { trigger, data, isMutating } = useSWRMutation(
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
  const { enableAdminDebugging } = useImpersonateContext();

  React.useEffect(() => {
    if (data) {
      mutate();
      setTimeout(() => router.push("/"), REDIRECT_WAIT_TIME);
    }
  }, [router, data, mutate]);

  if (isLoading || !formData) {
    return (
      <Box width="100%" height="100%">
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection={"column"} width="100%">
      <EmbedFlow
        clientLabel={formData.client}
        flowLabel={formData.flowLabel}
        variantLabel={formData.variantLabel}
        responderUuid={userId}
        embedConfig={{
          style: {
            width: "100%",
            height: "100%",
          },
        }}
        onFlowFinalized={() => setHasSubmittedForm(true)}
        queryParams={getQueryParams()}
      />
      {enableAdminDebugging && !data && (
        <Box display="flex" width="100%" paddingY={3} justifyContent="center">
          <Button disabled={isMutating} onClick={trigger}>
            Advance to the next step
          </Button>
        </Box>
      )}
      {data && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={true}
          message="Your form has been submitted! Redirecting to the dashboard"
        />
      )}
    </Box>
  );
};

function getQueryParams() {
  const params: Array<[string, string]> = [["is_app_embedded", "true"]];

  amplitude.getInstance().options.deviceId;
  if (SETTINGS.amplitudeKey) {
    const { deviceId } = amplitude.getInstance().options;
    if (deviceId) {
      params.push(["amp_device_id", deviceId]);
    }
  }

  return params;
}

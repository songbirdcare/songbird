import { LinearProgress } from "@mui/material";
import { Alert, Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import useSWRMutation from "swr/mutation";

import { useFetchUser } from "../hooks/use-fetch-user";
import { useFetchWorkflow } from "../hooks/use-fetch-workflow";
import { SETTINGS } from "../settings";

export const RenderSchedule: React.FC<{
  workflowId: string;
  taskId: string;
  stageId: string;
}> = ({ workflowId, taskId, stageId }) => {
  const router = useRouter();
  const { mutate } = useFetchWorkflow();
  const { data: user, isLoading: userIsLoading } = useFetchUser();

  const { data, trigger, isMutating } = useSWRMutation(
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

  useCalendlyEventListener({
    onEventScheduled: trigger,
  });
  if (userIsLoading || !user) {
    return <LinearProgress />;
  }

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      gap={2}
      justifyContent="center"
      width="100%"
    >
      {data && (
        <Box paddingTop={2}>
          <Alert severity="success">
            <Box display="flex" flexDirection="column">
              <Button
                onClick={() => {
                  mutate();
                  router.push("/");
                }}
              >
                Return to dashboard
              </Button>
            </Box>
          </Alert>
        </Box>
      )}
      {SETTINGS.enableDebuggingAction && !data && (
        <Box display="flex" paddingY={3} justifyContent="center">
          <Button disabled={isMutating} onClick={trigger}>
            Advance to the next step
          </Button>
        </Box>
      )}
      <InlineWidget
        url={SETTINGS.schedulingUrl}
        prefill={{ email: user.email }}
        styles={{
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
};

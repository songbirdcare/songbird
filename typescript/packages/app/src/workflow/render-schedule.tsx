import { LinearProgress } from "@mui/material";
import { Box, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import useSWRMutation from "swr/mutation";

import { AdvanceToNextStep } from "../advance-to-next-step";
import { useFetchUser } from "../hooks/use-fetch-user";
import { useFetchWorkflow } from "../hooks/use-fetch-workflow";
import { SETTINGS } from "../settings";

const REDIRECT_WAIT_TIME = 5_000;

export const RenderSchedule: React.FC<{
  workflowId: string;
  taskId: string;
  stageId: string;
}> = ({ workflowId, taskId, stageId }) => {
  const router = useRouter();
  const { data: user, isLoading: userIsLoading } = useFetchUser();
  const [eventScheduled, setEventScheduled] = React.useState(false);
  const { mutate } = useFetchWorkflow();

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
    },

    {
      onSuccess: () => {
        mutate();
      },
    }
  );

  React.useEffect(() => {
    if (!eventScheduled) {
      return;
    }
    trigger();
    setTimeout(() => router.push("/"), REDIRECT_WAIT_TIME);
  }, [router, eventScheduled, trigger]);

  useCalendlyEventListener({
    onEventScheduled: () => {
      setEventScheduled(true);
    },
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
      <InlineWidget
        url={SETTINGS.schedulingUrl}
        prefill={{ email: user.email }}
        styles={{
          width: "100%",
          height: "100%",
        }}
      />

      {eventScheduled && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={true}
          message="Redirecting to dashboard"
        />
      )}

      {SETTINGS.enableDebuggingAction && !data && !eventScheduled && (
        <Box display="flex" paddingBottom={2} justifyContent="center">
          <AdvanceToNextStep
            disabled={isMutating}
            onClick={() => {
              setEventScheduled(true);
            }}
          />
        </Box>
      )}
    </Box>
  );
};

import { LinearProgress } from "@mui/material";
import { Box, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import useSWRMutation from "swr/mutation";

import { AdvanceToNextStep } from "../advance-to-next-step";
import { useFetchMe } from "../hooks/use-fetch-user";
import { useImpersonateContext } from "../impersonate/impersonate-context";
import { SETTINGS } from "../settings";

const REDIRECT_WAIT_TIME = 5_000;

export const RenderSchedule: React.FC<{
  workflowId: string;
  taskId: string;
  stageId: string;
  mutate: () => void;
}> = ({ workflowId, taskId, stageId, mutate }) => {
  const router = useRouter();
  const { data: user, isLoading: userIsLoading } = useFetchMe();

  const { enableAdminDebugging } = useImpersonateContext();

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

  React.useEffect(() => {
    if (!data) {
      return;
    }
    mutate();
    setTimeout(() => router.push("/"), REDIRECT_WAIT_TIME);
  }, [data, router, trigger, mutate]);

  useCalendlyEventListener({
    onEventScheduled: trigger,
  });

  if (userIsLoading || !user) {
    return <LinearProgress />;
  }

  const phoneForCalendly = getPhoneForCalendly(user.phone);

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
        prefill={{
          email: user.email,
          firstName: user.givenName ?? "",
          lastName: user.familyName ?? "",
          name:
            user.givenName && user.familyName
              ? `${user.givenName} ${user.familyName}`
              : "",
          location: phoneForCalendly,
        }}
        styles={{
          width: "100%",
          height: "100%",
        }}
      />

      {data && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={true}
          message="Your consultation has been scheduled! Redirecting to the dashboard"
        />
      )}

      {enableAdminDebugging && !data && (
        <Box display="flex" paddingBottom={2} justifyContent="center">
          <AdvanceToNextStep disabled={isMutating} onClick={trigger} />
        </Box>
      )}
    </Box>
  );
};

function getPhoneForCalendly(phone: string | undefined) {
  if (!phone) {
    return "+1";
  } else if (!phone.startsWith("+1")) {
    return `+1-${phone}`;
  } else {
    return phone;
  }
}

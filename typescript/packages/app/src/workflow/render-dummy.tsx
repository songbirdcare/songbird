import { LinearProgress } from "@mui/material";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";
import useSWRMutation from "swr/mutation";

import { AdvanceToNextStep } from "../advance-to-next-step";
import { useFetchMe } from "../hooks/use-fetch-user";

export const RenderDummy: React.FC<{
  workflowId: string;
  taskId: string;
  stageId: string;
  mutate: () => void;
}> = ({ workflowId, taskId, stageId, mutate }) => {
  const { data: user, isLoading: userIsLoading } = useFetchMe();

  const router = useRouter();

  const { data, trigger, isMutating } = useSWRMutation(
    `/api/proxy/workflows/action/${workflowId}`,
    async (url) => {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "dummy",
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
      <Box display="flex" paddingBottom={2} justifyContent="center">
        <AdvanceToNextStep onClick={trigger} disabled={isMutating} />
      </Box>
    </Box>
  );
};

import type { WorkflowModel, WorkflowSlug } from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchWorkflow = (workflowSlug: WorkflowSlug | undefined) => {
  const {
    data: allWorkflows,
    isLoading,
    mutate,
  } = useSWR<Record<WorkflowSlug, WorkflowModel>>(
    "/api/proxy/workflows/get-all",
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data.data;
    }
  );

  return {
    data:
      allWorkflows === undefined || workflowSlug === undefined
        ? undefined
        : allWorkflows[workflowSlug],

    isLoading,
    mutate,
  };
};

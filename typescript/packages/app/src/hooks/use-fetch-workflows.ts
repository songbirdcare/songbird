import type { WorkflowModel,WorkflowSlug } from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchWorkflows = () => {
  const { data, isLoading, mutate } = useSWR<
    Record<WorkflowSlug, WorkflowModel>
  >("/api/proxy/workflows/get-all", async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log({ hafsa: data.data });
    return data.data;
  });

  return { data, isLoading, mutate };
};

import type { WorkflowModel } from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchWorkflow = () => {
  const { data, isLoading } = useSWR<WorkflowModel>(
    "/api/proxy/workflows/start",
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data.data;
    }
  );

  return { data, isLoading };
};

import type { WorkflowModel, WorkflowSlug } from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchWorkflowV2 = (slug: WorkflowSlug | undefined) => {
  const { data, isLoading, mutate } = useSWR<WorkflowModel>(
    ["/api/proxy/workflows/for-slug", slug],
    async ([url, slug]: [string, string | undefined]) => {
      const response = await fetch(slug ? `${url}/${slug}` : url);
      const data = await response.json();
      return data.data;
    }
  );

  return { data, isLoading, mutate };
};

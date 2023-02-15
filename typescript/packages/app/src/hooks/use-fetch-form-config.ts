import type { FormSortConfig } from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchFormConfig = (slug: string) => {
  const swr = useSWR<FormSortConfig>(
    `/api/proxy/form-submission/form-config/${slug}`,
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data.data;
    }
  );
  return swr;
};

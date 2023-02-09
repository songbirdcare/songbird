import type { Child } from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchChild = () => {
  const { data, isLoading } = useSWR<Child>("/api/proxy/child", async (url) => {
    const response = await fetch(url);
    return response.json();
  });

  return { data, isLoading };
};

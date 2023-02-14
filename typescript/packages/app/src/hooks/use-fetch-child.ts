import type { Child } from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchChild = () => {
  const { data, isLoading } = useSWR<Child>("/api/proxy/child", async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return json.child;
  });

  return { data, isLoading };
};

import type { UserModel } from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchUsers = () => {
  const { data, isLoading, mutate } = useSWR<UserModel[]>(
    "/api/proxy/admin/list-users",
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data.data;
    }
  );

  return { data, isLoading, mutate };
};

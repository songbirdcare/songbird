import type { Child,Provider, UserModel } from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchAdminUserData = (userId: string) => {
  const { data, isLoading, mutate } = useSWR<{
    user: UserModel;
    child: Child;
    provider: Provider;
  }>(`/api/proxy/admin/user-data/${userId}`, async (url) => {
    const response = await fetch(url);
    return response.json();
  });

  return { data, isLoading, mutate };
};

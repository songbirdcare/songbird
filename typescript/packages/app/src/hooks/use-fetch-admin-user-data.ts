import type { Child, Provider, UserModel } from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchAdminUserData = (userId: string | undefined) => {
  const { data, isLoading, mutate } = useSWR<{
    user: UserModel;
    child: Child;
    provider: Provider;
  }>(userId && `/api/proxy/admin/user-data/${userId}`, async (url) => {
    const response = await fetch(url);
    return response.json();
  });

  return { data, isLoading, mutate };
};

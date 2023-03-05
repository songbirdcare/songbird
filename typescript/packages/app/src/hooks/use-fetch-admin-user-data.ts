import type {
  Child,
  Provider,
  Schedule,
  UserModel,
} from "@songbird/precedent-iso";
import useSWR from "swr";

export const useFetchAdminUserData = (userId: string | undefined) => {
  const { data, isLoading, mutate } = useSWR<{
    user: UserModel;
    child: Child;
    provider: Provider;
    schedule: Schedule;
  }>(userId && `/api/proxy/admin/user-data/${userId}`, async (url) => {
    const response = await fetch(url);
    return response.json();
  });

  return { data, isLoading, mutate };
};

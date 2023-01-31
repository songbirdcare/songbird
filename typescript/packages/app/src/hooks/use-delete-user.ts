import type { UserModel } from "@songbird/precedent-iso";
import useSWRMutation from "swr/mutation";

import { useFetchUsers } from "./use-fetch-users";

interface DeleteUserRequest {
  id: string;
}

export const useDeleteUser = () => {
  const { mutate } = useFetchUsers();
  const data = useSWRMutation<
    UserModel,
    unknown,
    "/api/proxy/admin/user",
    DeleteUserRequest
  >("/api/proxy/admin/user", async (url: string, args) => {
    const id = args.arg.id;
    const res = await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    mutate();
    return data;
  });

  return data;
};

import type { UpdateArguments, UserModel } from "@songbird/precedent-iso";
import useSWRMutation from "swr/mutation";

export const useUpdateChild = () => {
  const data = useSWRMutation<
    UserModel,
    unknown,
    "/api/proxy/admin/change-role",
    UpdateArguments
  >("/api/proxy/admin/change-role", async (url: string, args) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args.arg),
    });
    const data = await res.json();
    return data.data;
  });

  return data;
};

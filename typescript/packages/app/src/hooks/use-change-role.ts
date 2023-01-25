import type { ChangeRoleRequest, UserModel } from "@songbird/precedent-iso";
import useSWRMutation from "swr/mutation";

export const useChangeRole = () => {
  const data = useSWRMutation<
    UserModel,
    unknown,
    "/api/proxy/admin/change-role",
    ChangeRoleRequest
  >("/api/proxy/admin/change-role", async (url: string, args) => {
    console.log(args);
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: args.arg.role,
        userId: args.arg.userId,
        fuck: "you",
      }),
    });
    const data = await res.json();
    return data.data;
  });

  return data;
};

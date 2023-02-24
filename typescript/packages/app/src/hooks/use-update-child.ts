import type { UpdateArguments, UserModel } from "@songbird/precedent-iso";
import useSWRMutation from "swr/mutation";

export const useUpdateChild = () => {
  const data = useSWRMutation<
    UserModel,
    unknown,
    "/api/proxy/admin/child",
    UpdateArguments & { childId: string }
  >("/api/proxy/admin/child", async (url: string, args) => {
    const res = await fetch(`${url}/${args.arg.childId}`, {
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

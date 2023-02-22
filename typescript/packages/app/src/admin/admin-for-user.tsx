import type React from "react";
import { useFetchAdminUserData } from "../hooks/use-fetch-admin-user-data";
import { useFetchProviders } from "../hooks/use-fetch-providers";

export const AdminForUser: React.FC<{ id: string }> = () => {
  const baz = useFetchProviders();
  const bar = useFetchAdminUserData(id);
  console.log(baz, bar);

  return null;
};

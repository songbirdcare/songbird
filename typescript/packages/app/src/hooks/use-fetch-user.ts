import type { UserModel } from "@songbird/precedent-iso";
import * as React from "react";
import useSWR from "swr";

export const useFetchUser = () => {
  const { data, isLoading } = useSWR<UserModel>(
    "/api/proxy/users/me",
    async (url) => {
      const response = await fetch(url);
      return response.json();
    }
  );

  return { data, isLoading };
};

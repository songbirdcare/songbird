import type { UserModel } from "@songbird/precedent-iso";
import LogRocket from "logrocket";
import React from "react";
import useSWR from "swr";

export const useFetchUser = () => {
  const { data, isLoading } = useSWR<UserModel>(
    "/api/proxy/users/me",
    async (url) => {
      const response = await fetch(url);
      return response.json();
    }
  );

  React.useEffect(() => {
    if (data) {
      LogRocket.identify(data.id, {
        email: data.email,
      });
    }
  }, [data]);

  return { data, isLoading };
};

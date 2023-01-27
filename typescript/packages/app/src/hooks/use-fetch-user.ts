import type { UserModel } from "@songbird/precedent-iso";
import LogRocket from "logrocket";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

export const useFetchUser = () => {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<UserModel>(
    "/api/proxy/users/me",
    async (url) => {
      const response = await fetch(url);
      return response.json();
    }
  );

  React.useEffect(() => {
    // if we cannot fetch their user just log them out
    if (error) {
      router.push("/api/auth/logout");
    }
  }, [router, error]);

  React.useEffect(() => {
    if (data) {
      LogRocket.identify(data.id, {
        email: data.email,
      });
    }
  }, [data]);

  return { data, isLoading };
};

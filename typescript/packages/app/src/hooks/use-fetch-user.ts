import type { UserModel } from "@songbird/precedent-iso";
import LogRocket from "logrocket";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import { SETTINGS } from "../settings";

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
    if (!data || !SETTINGS.logRocketId) {
      return;
    }

    LogRocket.identify(data.id, {
      email: data.email,
    });

    if (typeof window === "undefined") {
      return;
    }

    const intercom = window.Intercom;

    if (typeof intercom === "undefined") {
      return;
    }

    intercom("update", {
      logrocketURL: `https://app.logrocket.com/${SETTINGS.logRocketId}/sessions?u=${data.id}`,
    });
  }, [data]);

  return { data, isLoading };
};

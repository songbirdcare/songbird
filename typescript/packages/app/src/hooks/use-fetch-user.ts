import type { UserModel } from "@songbird/precedent-iso";
import LogRocket from "logrocket";
import React from "react";
import useSWR from "swr";

import { SETTINGS } from "../settings";

export const useFetchUser = () => {
  const { data, isLoading } = useSWR<UserModel>(
    "/api/proxy/users/me",
    async (url) => {
      const response = await fetch(url);
      return response.json();
    }
  );

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

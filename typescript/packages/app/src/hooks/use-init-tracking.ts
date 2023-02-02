import type { UserModel } from "@songbird/precedent-iso";
import LogRocket from "logrocket";
import React from "react";
import useSWR from "swr";

import { initForRum } from "../monitoring/datadog-rum";
import { SETTINGS } from "../settings";
import { TRACKER } from "../track";

export const useInitTracking = () => {
  const { data } = useSWR<UserModel>("/api/proxy/users/me", async (url) => {
    const response = await fetch(url);
    return response.json();
  });

  const id = data?.email;
  const email = data?.email;
  const role = data?.role;

  // datadog rum

  React.useEffect(() => {
    if (role === undefined || role === "admin") {
      return;
    }
    initForRum();
  }, [role]);

  //amplitude
  React.useEffect(() => {
    if (role && email && id) {
      TRACKER.identify({
        id,
        isInternal: role === "admin" || email.endsWith("@songbirdcare.com"),
      });
    }
  }, [role, email, id]);

  // log rocket
  React.useEffect(() => {
    if (role === "admin" || !email || !id || !SETTINGS.logRocketId) {
      return;
    }

    LogRocket.init(SETTINGS.logRocketId);

    LogRocket.identify(id, {
      email,
    });

    if (typeof window.Intercom === "undefined") {
      return;
    }

    window.Intercom("update", {
      logrocketURL: `https://app.logrocket.com/${SETTINGS.logRocketId}/sessions?u=${id}`,
    });
  }, [role, email, id]);
};

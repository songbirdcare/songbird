import { isInternalUser, UserModel } from "@songbird/precedent-iso";
import React from "react";
import useSWR from "swr";

import { initForRum } from "../monitoring/datadog-rum";
import { initForLogRocket } from "../monitoring/logrocket";
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
    if (!id || !role || !email) {
      return;
    }

    const isInternal = isInternalUser({ role, email });

    // amplitude
    TRACKER.identify({
      id,
      isInternal,
    });

    if (isInternalUser({ role, email })) {
      return;
    }

    initForRum({ id, email });
    initForLogRocket({ id, email });
  }, [id, email, role]);
};

import { useRouter } from "next/router";
import React from "react";

import { TRACKER } from "../track";
import { useFetchChild } from "./use-fetch-child";

export const useRedirectIfNotEligible = () => {
  const router = useRouter();

  const { data, isLoading } = useFetchChild();

  const disqualified = data?.qualified?.type === "disqualified";

  React.useEffect(() => {
    // TODO wait for 2 days of data to come in
    // then start redirecting to thank-you page
    if (disqualified) {
      TRACKER.track("redirect_to_disqualified");
      console.warn("redirect_to_disqualified");
    }
  }, [router, disqualified]);

  return { isLoading };
};

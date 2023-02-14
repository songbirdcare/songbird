import { useRouter } from "next/router";
import React from "react";

import { useFetchChild } from "./use-fetch-child";

export const useRedirectIfNotEligible = () => {
  const router = useRouter();

  const { data, isLoading } = useFetchChild();

  const disqualified = data?.qualified?.type === "disqualified";

  React.useEffect(() => {
    if (disqualified) {
      router.push("/thank-you");
    }
  }, [router, disqualified]);

  return { isLoading };
};

import { useRouter } from "next/router";
import React from "react";

import { useFetchMe } from "./use-fetch-user";

export const useRedirectIfNotVerified = () => {
  const router = useRouter();

  const { data: user } = useFetchMe();
  const isEmailVerified = user?.emailVerified;

  React.useEffect(() => {
    // need exact match for this to work
    if (isEmailVerified === false) {
      router.push("/verify-email");
    }
  }, [router, isEmailVerified]);
};

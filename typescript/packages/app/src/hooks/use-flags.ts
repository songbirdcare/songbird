import { useFlags as useFlagSmith } from "flagsmith/react";
import { useFetchUser } from "./use-fetch-user";

export const useSBFlags = () => {
  const { data } = useFetchUser();
  const flagsmith = useFlagSmith(["extended-onboarding"]);

  console.log({ flagsmith });
};

import { useFlagsmith } from "flagsmith/react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useFetchUser } from "./use-fetch-user";

export const useSBFlags = (): Flags => {
  const { data } = useFetchUser();

  const id = data?.id;
  const role = data?.role;
  const flagsmith = useFlagsmith();

  const [flags, setFlags] = useState<Flags>(() => {
    return {
      hasLoaded: false,
      flags: ZFlags.parse(flagsmith.getAllFlags()),
    };
  });

  useEffect(() => {
    async function fetchFlags() {
      if (!id || !role) {
        return;
      }
      await flagsmith.identify(id, { role });
      setFlags({
        hasLoaded: true,
        flags: ZFlags.parse(flagsmith.getAllFlags()),
      });
    }
    fetchFlags();
  }, [flagsmith, id, role]);

  return flags;
};

interface Flags {
  hasLoaded: boolean;
  flags: FlagBody;
}

interface FlagBody {
  extendedOnboarding: boolean;
}

const ZFlags = z
  .object({
    "extended-onboarding": z
      .object({
        value: z.enum(["TRUE", "FALSE"]),
      })
      .optional(),
  })
  .transform((obj) => ({
    extendedOnboarding: obj["extended-onboarding"]?.value === "TRUE",
  }));

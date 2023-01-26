import React from "react";

import { ImpersonateService } from "./impersonate-service";
import { SETTINGS } from "../settings";

import useSWR from "swr";
import type { UserModel } from "@songbird/precedent-iso";

interface Context {
  id: string | undefined;
  setId: (email: string) => void;
  user: UserModel | undefined;
  impersonatingUser: UserModel | undefined;
  enableAdminDebugging: boolean;
}
export const ImpersonateContext = React.createContext<Context>({
  id: undefined,
  setId: () => {
    //
  },
  user: undefined,
  impersonatingUser: undefined,
  enableAdminDebugging: false,
});

export const useImpersonateContext = () => React.useContext(ImpersonateContext);

export const ImpersonateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [id, setId] = React.useState<string | undefined>(
    ImpersonateService.get()
  );

  const { user, impersonatingUser } = useFetchUser(id);

  const enableAdminDebugging =
    SETTINGS.enableDebuggingAction || id !== undefined;

  const value = React.useMemo(
    () => ({ id, setId, user, impersonatingUser, enableAdminDebugging }),
    [id, setId, user, impersonatingUser, enableAdminDebugging]
  );

  return (
    <ImpersonateContext.Provider value={value}>
      {children}
    </ImpersonateContext.Provider>
  );
};

const useFetchUser = (id: string | undefined) => {
  const { data } = useSWR<UserInfo>(
    id ? "/api/proxy/admin/impersonate" : null,
    async (url) => {
      const response = await fetch(url);
      return response.json();
    }
  );

  return {
    user: data?.user,
    impersonatingUser: data?.impersonatingUser ?? undefined,
  };
};

interface UserInfo {
  user: UserModel | undefined;
  impersonatingUser: UserModel | undefined;
}

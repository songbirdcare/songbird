import React from "react";
import { ImpersonateService } from "./impersonate-service";

interface Context {
  id: string | undefined;
  setId: (email: string) => void;
}
export const ImpersonateContext = React.createContext<Context>({
  id: undefined,
  setId: () => {
    //
  },
});

export const useImpersonateContext = () => React.useContext(ImpersonateContext);

export const ImpersonateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [id, setId] = React.useState<string | undefined>(
    ImpersonateService.get()
  );

  const value = React.useMemo(() => ({ id, setId }), [id, setId]);

  return (
    <ImpersonateContext.Provider value={value}>
      {children}
    </ImpersonateContext.Provider>
  );
};

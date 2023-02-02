import LogRocket from "logrocket";

import { SETTINGS } from "../settings";

export function initForLogRocket({ id, email }: Args) {
  if (!SETTINGS.logRocketId) {
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
}

interface Args {
  id: string;
  email: string;
}

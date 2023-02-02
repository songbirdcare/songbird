import {
  Identify,
  identify,
  init,
  setUserId,
  track,
} from "@amplitude/analytics-browser";
import type { UserRole } from "@songbird/precedent-iso";

import { SETTINGS } from "./settings";

export class Tracker {
  #isInternal: boolean;

  constructor(private readonly key: string | undefined) {
    this.#isInternal = false;
    if (key) {
      init(key);
    }
  }

  track(event: string, data?: Record<string, unknown>) {
    if (!this.key) {
      console.log(`Track| Amplitude not initialized: ${event}`, data);
      return;
    }

    if (this.#isInternal) {
      console.log(`Track| Internal user detected: ${event}`, data);
      return;
    }

    track(event, data);
  }

  identify({ id, email, role }: IdentifyArgs) {
    if (!this.key) {
      return;
    }
    setUserId(id);
    // do not track internal users
    if (role === "admin" || email.endsWith("@songbirdcare.com")) {
      this.#isInternal = true;
    }
  }
}

export const TRACKER = new Tracker(SETTINGS.amplitudeKey);

interface IdentifyArgs {
  id: string;
  email: string;
  role: UserRole;
}

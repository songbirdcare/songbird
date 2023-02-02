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
  constructor(private readonly key: string | undefined) {
    if (key) {
      init(key);
    }
  }

  track(event: string, data?: Record<string, unknown>) {
    if (!this.key) {
      console.log(`Amplitude not initialized: ${event}`, data);
      return;
    }

    track(event, data);
  }

  identify({ id, email, role }: IdentifyArgs) {
    if (!this.key) {
      return;
    }
    setUserId(id);
    const identifyObj = new Identify();
    identifyObj.set("role", role);
    identifyObj.set("isSongbird", email.endsWith("@songbirdcare.com"));

    identify(identifyObj);
  }
}

export const TRACKER = new Tracker(SETTINGS.amplitudeKey);

interface IdentifyArgs {
  id: string;
  email: string;
  role: UserRole;
}

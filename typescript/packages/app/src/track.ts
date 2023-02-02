import amplitude from "@amplitude/analytics-browser";
import type { UserRole } from "@songbird/precedent-iso";

import { SETTINGS } from "./settings";

export class Tracker {
  constructor(private readonly key: string | undefined) {
    if (key) {
      amplitude.init(key);
    }
  }

  track(event: string, data?: Record<string, unknown>) {
    if (!this.key) {
      console.log(`Amplitude not initialized: ${event}`, data);
      return;
    }

    amplitude.track(event, data);
  }

  identify({ id, email, role }: IdentifyArgs) {
    if (!this.key) {
      return;
    }
    amplitude.setUserId(id);
    const identifyObj = new amplitude.Identify();
    identifyObj.set("role", role);
    identifyObj.set("isSongbird", email.endsWith("@songbirdcare.com"));

    amplitude.identify(identifyObj);
  }
}

export const TRACKER = new Tracker(SETTINGS.amplitudeKey);

interface IdentifyArgs {
  id: string;
  email: string;
  role: UserRole;
}

import type { UserRole } from "@songbird/precedent-iso";
import amplitude, { AmplitudeClient, Identify } from "amplitude-js";

import { SETTINGS } from "./settings";

export class Tracker {
  #client: AmplitudeClient | undefined;
  constructor(key: string | undefined) {
    if (!key) {
      this.#client = undefined;
      return;
    }
    this.#client = amplitude.getInstance();
    this.#client.init(key);
  }

  track(event: string, data?: Record<string, unknown>) {
    if (!this.#client) {
      console.log(`Amplitude not initialized: ${event}`, data);

      return;
    }

    this.#client.logEvent(event, data);
  }

  identify({ id, email, role }: IdentifyArgs) {
    if (!this.#client) {
      return;
    }
    this.#client.setUserId(id);
    const identifyObj = new Identify();
    identifyObj.set("role", role);
    identifyObj.set("isSongbird", email.endsWith("@songbirdcare.com"));

    this.#client.identify(identifyObj);
  }
}

export const TRACKER = new Tracker(SETTINGS.amplitudeKey);

interface IdentifyArgs {
  id: string;
  email: string;
  role: UserRole;
}

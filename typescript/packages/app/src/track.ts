import amplitude, { AmplitudeClient } from "amplitude-js";

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

  setUserId(id: string) {
    if (!this.#client) {
      return;
    }
    this.#client.setUserId(id);
  }
}

export const TRACKER = new Tracker(SETTINGS.amplitudeKey);

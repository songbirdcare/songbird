import { init, setUserId, track } from "@amplitude/analytics-browser";

import { SETTINGS } from "./settings";

export class Tracker {
  #disableTracking: boolean;

  constructor(private readonly key: string | undefined) {
    this.#disableTracking = false;
    if (key) {
      init(key);
    }
  }

  track(event: string, data?: Record<string, unknown>) {
    if (!this.key) {
      console.log(`Track| Amplitude not initialized: ${event}`, data);
      return;
    }

    if (this.#disableTracking) {
      console.log(`Track| Internal user detected: ${event}`, data);
      return;
    }

    track(event, data);
  }

  identify({ id, isInternal }: IdentifyArgs) {
    if (!this.key) {
      return;
    }
    setUserId(id);
    this.#disableTracking = isInternal;
  }
}

export const TRACKER = new Tracker(SETTINGS.amplitudeKey);

interface IdentifyArgs {
  id: string;
  isInternal: boolean;
}

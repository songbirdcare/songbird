import { init, track, Identify, identify } from "@amplitude/analytics-node";
import { SETTINGS } from "./settings";

import { LOGGER } from "./logger";

class Analytics {
  constructor(private readonly apiKey: string | undefined) {
    if (!apiKey) {
      LOGGER.warn("Amplitude API key not present");
      return;
    }

    init(apiKey);
  }

  track(event: string, properties: Record<string, unknown>) {
    if (!this.apiKey) {
      LOGGER.info(`Analytics: ${event}`, properties);
      return;
    }

    track(event, properties);
  }

  identify(id: string, email: string) {
    if (!this.apiKey) {
      return;
    }

    const identifyObj = new Identify();

    identify(identifyObj, {
      user_id: id,
      extra: {
        email: email,
      },
    });
  }
}

export const ANALYTICS = new Analytics(SETTINGS.amplitudeKey);

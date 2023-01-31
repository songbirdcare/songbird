import { init, track } from "@amplitude/analytics-node";
import { assertNever } from "@songbird/precedent-iso";

import { LOGGER } from "./logger";
import { SETTINGS } from "./settings";

export class AmplitudeAnalyticsService implements AnalyticsService {
  constructor(
    private readonly apiKey: string | undefined,
    private readonly mode: AnalyticsMode
  ) {
    if (!apiKey) {
      LOGGER.debug("Amplitude API key not present");
      return;
    }

    init(apiKey);
  }

  track = (event: string, properties?: Record<string, unknown>) => {
    if (!this.apiKey) {
      debugger;
      if (SETTINGS.forceAmplitudeLogs) {
        LOGGER.info(`Analytics: ${event}`, properties);
      } else {
        LOGGER.debug(`Analytics: ${event}`, properties);
      }
      return;
    }

    switch (this.mode.type) {
      case "device":
        track(event, properties, {
          device_id: this.mode.id,
        });
        break;
      case "user":
        track(event, properties, {
          user_id: this.mode.id,
        });
        break;
      default:
        assertNever(this.mode);
    }
  };
}

export type AnalyticsMode =
  | { type: "device"; id: string }
  | { type: "user"; id: string };

export interface AnalyticsService {
  track: (event: string, properties?: Record<string, unknown>) => void;
}

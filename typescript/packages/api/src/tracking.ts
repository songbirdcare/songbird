import { init, track } from "@amplitude/analytics-node";
import { assertNever } from "@songbird/precedent-iso";

import { LOGGER } from "./logger";
import { SETTINGS } from "./settings";

export class AmplitudeAnalyticsService implements AnalyticsService {
  #disableTracking: boolean;

  constructor(
    private readonly apiKey: string | undefined,
    private readonly mode: AnalyticsMode
  ) {
    this.#disableTracking = false;

    if (!apiKey) {
      LOGGER.debug("Amplitude API key not present");
      return;
    }

    init(apiKey);

    switch (this.mode.type) {
      case "user":
        this.#disableTracking = this.mode.isInternal;
        break;
      case "device":
        break;
      default:
        assertNever(this.mode);
    }
  }

  track = (event: string, properties?: Record<string, unknown>) => {
    if (!this.apiKey) {
      if (SETTINGS.forceAmplitudeLogs) {
        LOGGER.info(`Analytics: ${event}`, properties);
      } else {
        LOGGER.debug(`Analytics: ${event}`, properties);
      }
      return;
    }

    if (this.#disableTracking) {
      LOGGER.debug(`Track | Tracking disabled ${event}`, properties);
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
  | { type: "user"; id: string; isInternal: boolean };

export interface AnalyticsService {
  track: (event: string, properties?: Record<string, unknown>) => void;
}

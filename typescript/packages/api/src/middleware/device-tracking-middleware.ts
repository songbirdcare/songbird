import type { NextFunction, Response } from "express";
import type { Request } from "express-jwt";

import { SETTINGS } from "../settings";
import { AmplitudeAnalyticsService } from "../tracking";

export class DeviceTrackingMiddleware {
  static async setMiddleware(
    req: Request,
    _: Response,
    next: NextFunction
  ): Promise<void> {
    const id = req.get("User-Agent") || req.ip || "unknown";
    const analytics = new AmplitudeAnalyticsService(SETTINGS.amplitudeKey, {
      type: "device",
      id,
    });
    req.trackDevice = analytics.track;
    next();
  }
}

import type { UserModel } from "@songbird/precedent-iso";

import type { AnalyticsService } from "../tracking";

declare global {
  namespace Express {
    export interface Request {
      user: UserModel;
      impersonatingUser?: UserModel;
      trackDevice: AnalyticsService["track"];
      trackUser?: AnalyticsService["track"];
      rawBody: Buffer;
    }
  }
}

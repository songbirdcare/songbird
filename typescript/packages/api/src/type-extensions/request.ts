import type { UserModel } from "@songbird/precedent-iso";

import type { AnalyticsService } from "../analytics";

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

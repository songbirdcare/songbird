import type { UserModel } from "@songbird/precedent-iso";

import type { TrackingService } from "../tracking";

declare global {
  namespace Express {
    export interface Request {
      user: UserModel;
      impersonatingUser?: UserModel;
      trackDevice: TrackingService["track"];
      trackUser?: TrackingService["track"];
      rawBody: Buffer;
    }
  }
}

import type { UserModel } from "@songbird/precedent-iso";

declare global {
  namespace Express {
    export interface Request {
      user: UserModel;
      rawBody: Buffer;
    }
  }
}

import type { UserInformation } from "../middleware/user-information";

declare global {
  namespace Express {
    export interface Request {
      user?: UserInformation;
      rawBody: Buffer;
    }
  }
}

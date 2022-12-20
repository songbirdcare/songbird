import { z } from "zod";

export const UserInformation = z.object({
  sub: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  name: z.optional(z.string()),
  familyName: z.optional(z.string()),
  givenName: z.optional(z.string()),
});

export type UserInformation = z.infer<typeof UserInformation>;

declare global {
  namespace Express {
    export interface Request {
      user?: UserInformation;
    }
  }
}

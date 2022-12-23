import { z } from "zod";

export type UserModel = z.infer<typeof UserModel>;
export const UserModel = z.object({
  id: z.string(),
  sub: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  name: z.optional(z.string()),
  familyName: z.optional(z.string()),
  givenName: z.optional(z.string()),
});

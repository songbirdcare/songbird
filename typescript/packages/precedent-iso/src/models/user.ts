import { z } from "zod";

export type UserModel = z.infer<typeof ZUserModel>;

export const ZUserRole = z.enum(["user", "admin"]);
export type UserRole = z.infer<typeof ZUserRole>;

export const ZUserModel = z.object({
  id: z.string(),
  sub: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  name: z.optional(z.string()),
  familyName: z.optional(z.string()),
  givenName: z.optional(z.string()),
  phone: z.optional(z.string()),
  role: ZUserRole,
});

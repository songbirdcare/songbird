import { z } from "zod";

import type { PasswordValidationError } from "../services/password-validation-service";

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

export type CreateUserResponse =
  | { type: "ok" }
  | { type: "exists_in_auth0" | "exists_in_sql" | "invalid_email" }
  | { type: "password"; error: PasswordValidationError };

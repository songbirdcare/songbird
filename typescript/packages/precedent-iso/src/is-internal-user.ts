import type { UserRole } from "./models/user";

export function isInternalUser({
  email,
  role,
}: {
  email: string;
  role: UserRole;
}) {
  return role === "admin" || email.endsWith("@songbirdcare.com");
}

import { z } from "zod";

import { ZUserRole } from "./user";

export const ZChangeRoleRequest = z.object({
  userId: z.string(),
  role: ZUserRole,
});

export type ChangeRoleRequest = z.infer<typeof ZChangeRoleRequest>;

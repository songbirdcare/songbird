import { z } from "zod";

export const ZEmailWithPassword = z.object({
  email: z.string(),
  password: z.string(),
});

export type EmailWithPassword = z.infer<typeof ZEmailWithPassword>;

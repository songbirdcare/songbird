import { z } from "zod";

export const ZSettings = z.object({
  enableDebuggingAction: z.boolean(),
});

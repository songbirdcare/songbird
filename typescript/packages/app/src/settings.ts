import { z } from "zod";

export const ZSettings = z.object({
  enableDebuggingAction: z.boolean(),
});

const enableDebuggingAction =
  process.env["NEXT_PUBLIC_ENABLE_DEBUGGING_ACTION"] === "ENABLE_DEBUGGING";

export const SETTINGS = ZSettings.parse({
  enableDebuggingAction,
});

console.log(SETTINGS);

import { z } from "zod";

export const ZSettings = z.object({
  enableDebuggingAction: z.boolean(),
  schedulingUrl: z.string().min(1),
});

const enableDebuggingAction =
  process.env["NEXT_PUBLIC_ENABLE_DEBUGGING_ACTION"] === "ENABLE_DEBUGGING";

export const SETTINGS = ZSettings.parse({
  enableDebuggingAction,
  schedulingUrl:
    process.env["NEXT_PUBLIC_SCHEDULING_URL"] ??
    "https://calendly.com/welcome-to-songbird/songbird-call",
});

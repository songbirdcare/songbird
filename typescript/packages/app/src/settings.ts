import { ZFormSortConfig } from "@songbird/precedent-iso";
import { z } from "zod";

export const ZSettings = z.object({
  logRocketId: z.string().optional(),
  enableDebuggingAction: z.boolean(),
  schedulingUrl: z.string().min(1),
  intercomId: z.string().min(1),
  feedback: ZFormSortConfig,
});

const enableDebuggingAction =
  process.env["NEXT_PUBLIC_ENABLE_DEBUGGING_ACTION"] === "ENABLE_DEBUGGING";

export const SETTINGS = ZSettings.parse({
  logRocketId: process.env["NEXT_PUBLIC_LOG_ROCKET_ID"],
  enableDebuggingAction,
  schedulingUrl:
    process.env["NEXT_PUBLIC_SCHEDULING_URL"] ??
    "https://calendly.com/welcome-to-songbird/songbird-call",
  intercomId: process.env["NEXT_PUBLIC_INTERCOM_ID"],
  feedback: {
    client: process.env["NEXT_PUBLIC_FEEDBACK_CLIENT"],

    flowLabel: process.env["NEXT_PUBLIC_FEEDBACK_FLOW_LABEL"],

    variantLabel: process.env["NEXT_PUBLIC_FEEDBACK_VARIANT_LABEL"],
  },
});

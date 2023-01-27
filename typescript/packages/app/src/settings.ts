import { ZFormSortConfig } from "@songbird/precedent-iso";
import { z } from "zod";

const ZDatadogRum = z.object({
  applicationId: z.string(),
  clientToken: z.string(),
  site: z.string(),
  service: z.string(),
  env: z.string(),
});
export const ZSettings = z.object({
  logRocketId: z.string().optional(),
  enableDebuggingAction: z.boolean(),
  schedulingUrl: z.string().min(1),
  intercomId: z.string().min(1),
  feedback: ZFormSortConfig,
  amplitudeKey: z.string().optional(),
  datadog: ZDatadogRum.optional(),
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
  amplitudeKey: process.env["NEXT_PUBLIC_AMPLITUDE_KEY"],
  datadog: dataDogRum(),
});

function dataDogRum() {
  try {
    return ZDatadogRum.parse({
      applicationId: process.env["NEXT_PUBLIC_DD_APPLICATION_ID"],
      clientToken: process.env["NEXT_PUBLIC_DD_CLIENT_TOKEN"],
      site: process.env["NEXT_PUBLIC_DD_SITE"],
      service: process.env["NEXT_PUBLIC_DD_SERVICE"],
      env: process.env["NEXT_PUBLIC_DD_ENV"],
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return undefined;
    }
    throw e;
  }
}

import { ZFormSortConfig } from "@songbird/precedent-iso";
import { z } from "zod";

const ZSettings = z.object({
  host: z.string(),
  port: z.number(),
  auth: z.object({
    issuerBaseUrl: z.string(),
    jwksUri: z.string(),
    audience: z.string(),
    issuer: z.array(z.string()),
    machineClientId: z.string(),
    machineSecret: z.string(),
    machineAudience: z.string(),
    domain: z.string(),
  }),
  sql: z.object({
    uri: z.string(),
  }),
  formsort: z.object({
    signingKey: z.string(),
    // will drop all submissions with
    // other variants
    signupWhiteList: z.string().optional(),
    config: z.object({
      checkInsuranceCoverage: ZFormSortConfig,
      submitRecords: ZFormSortConfig,
    }),
  }),
  dd: z.object({
    apiKey: z.string().optional(),
    env: z.string(),
  }),
  amplitudeKey: z.string().optional(),
  forceAmplitudeLogs: z.boolean().optional(),
});

const domain = process.env["AUTH0_DOMAIN"];
const issuer: string[] = [`https://${domain}/`];
const issuerBaseUrl = `https://${domain}`;
const signupWhiteList = process.env["SIGNUP_WHITE_LIST_ITEM"];

export const SETTINGS = ZSettings.parse({
  host: process.env["HOST"] ?? "0.0.0.0",
  port: Number(process.env["PORT"] ?? "8080"),
  auth: {
    issuerBaseUrl,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
    audience: process.env["AUTH0_AUDIENCE"],
    machineAudience:
      process.env["AUTH0_MACHINE_AUDIENCE"] ?? `${issuerBaseUrl}/api/v2/`,

    issuer,
    machineClientId: process.env["AUTH0_MACHINE_CLIENT_ID"],
    machineSecret: process.env["AUTH0_MACHINE_SECRET"],
    domain,
  },
  sql: {
    uri: process.env["SQL_URI"],
  },
  formsort: {
    signupWhiteList,
    signingKey: process.env["FORM_SORT_SIGNING_KEY"],
    config: {
      checkInsuranceCoverage: {
        client: process.env["FORM_INSURANCE_CLIENT"],
        flowLabel: process.env["FORM_INSURANCE_FLOW_LABEL"],
        variantLabel: process.env["FORM_INSURANCE_VARIANT_LABEL"],
      },
      submitRecords: {
        client: process.env["FORM_RECORDS_CLIENT"],
        flowLabel: process.env["FORM_RECORDS_FLOW_LABEL"],
        variantLabel: process.env["FORM_RECORDS_VARIANT_LABEL"],
      },
    },
  },
  dd: {
    env: process.env["DD_ENV"],
    apiKey: process.env["DD_API_KEY"],
  },
  amplitudeKey: process.env["AMPLITUDE_KEY"],
  forceAmplitudeLogs: process.env["FORCE_AMPLITUDE_LOGS"] === "true",
});

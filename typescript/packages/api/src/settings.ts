import { z } from "zod";

const Settings = z.object({
  host: z.string(),
  port: z.number(),
  auth: z.object({
    issuerBaseUrl: z.string(),
    jwksUri: z.string(),
    audience: z.string(),
    issuer: z.string(),
    machineClientId: z.string(),
    machineSecret: z.string(),
    domain: z.string(),
  }),
  sql: z.object({
    uri: z.string(),
  }),
  formsort: z.object({
    signingKey: z.string(),
  }),
});

type Settings = z.infer<typeof Settings>;

export const SETTINGS = Settings.parse({
  host: process.env["HOST"] ?? "0.0.0.0",
  port: Number(process.env["PORT"] ?? "8080"),
  auth: {
    issuerBaseUrl: process.env["AUTH0_ISSUER_BASE_URL"],
    jwksUri: process.env["AUTH0_JKWS_URI"],
    audience: process.env["AUTH0_AUDIENCE"],
    issuer: process.env["AUTH0_ISSUER"],
    machineClientId: process.env["AUTH0_MACHINE_CLIENT_ID"],
    machineSecret: process.env["AUTH0_MACHINE_SECRET"],
    domain: process.env["AUTH0_DOMAIN"],
  },
  sql: {
    uri: process.env["SQL_URI"],
  },
  formsort: {
    signingKey: process.env["FORM_SORT_SIGNING_KEY"],
  },
});

import { z } from "zod";

const Settings = z.object({
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
  }),
});

type Settings = z.infer<typeof Settings>;

const domain = process.env["AUTH0_DOMAIN"];
const issuer: string[] = [`https://${domain}/`];
const issuerBaseUrl = `https://${domain}`;

export const SETTINGS = Settings.parse({
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
    signingKey: process.env["FORM_SORT_SIGNING_KEY"],
  },
});

import { z } from "zod";

const LogFormat = z.union([z.literal("json"), z.literal("pretty")]);
export type LogFormat = z.infer<typeof LogFormat>;

const Settings = z.object({
  host: z.string(),
  port: z.number(),

  logFormat: LogFormat,
  auth: z.object({
    jwksUri: z.string(),
    audience: z.string(),
    issuer: z.string(),
  }),
});

type Settings = z.infer<typeof Settings>;

export const SETTINGS = Settings.parse({
  host: process.env["HOST"] ?? "0.0.0.0",
  port: Number(process.env["PORT"] ?? "8080"),
  logFormat: process.env["LOG_FORMAT"] ?? "json",
  auth: {
    jwksUri: process.env["AUTH0_JKWS_URI"],
    audience: process.env["AUTH0_AUDIENCE"],
    issuer: process.env["AUTH0_ISSUER"],
  },
});

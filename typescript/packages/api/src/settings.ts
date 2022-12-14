import { z } from "zod";

const LogFormat = z.union([z.literal("json"), z.literal("pretty")]);
export type LogFormat = z.infer<typeof LogFormat>;

const Settings = z.object({
  host: z.string(),
  port: z.number(),
  redis: z.object({
    host: z.string(),
    port: z.number(),
  }),
  logFormat: LogFormat,
});

type Settings = z.infer<typeof Settings>;

export const SETTINGS = Settings.parse({
  host: process.env["HOST"],
  port: Number(process.env["PORT"]),
  redis: {
    host: process.env["REDISHOST"],
    port: Number(process.env["REDISPORT"]),
  },
  logFormat: process.env["LOG_FORMAT"] ?? "json",
});

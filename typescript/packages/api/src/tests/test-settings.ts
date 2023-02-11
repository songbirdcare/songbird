import { z } from "zod";

const ZSettings = z.object({
  sqlUri: z.string(),
  greenhouseApiKey: z.string().optional(),
});

export const TEST_SETTINGS = ZSettings.parse({
  sqlUri: process.env["SQL_URI"],
  greenhouseApiKey: process.env["GREENHOUSE_API_KEY"],
});

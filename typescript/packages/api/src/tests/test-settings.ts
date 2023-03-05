import { z } from "zod";

const ZSettings = z.object({
  sqlUri: z.string(),
  greenhouseApiKey: z.string().optional(),
  enableGreenhouseTest: z.boolean(),
  bucket: z.string(),
});

export const TEST_SETTINGS = ZSettings.parse({
  sqlUri: process.env["SQL_URI"],
  greenhouseApiKey: process.env["GREENHOUSE_API_KEY"],
  enableGreenhouseTest: process.env["ENABLE_GREENHOUSE_TEST"] === "true",
  bucket: process.env["BUCKET"],
});

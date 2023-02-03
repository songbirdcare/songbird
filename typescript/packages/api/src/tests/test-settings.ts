import { z } from "zod";

const ZSettings = z.object({
  sqlUri: z.string(),
});

export const TEST_SETTINGS = ZSettings.parse({
  sqlUri: process.env["SQL_URI"],
});

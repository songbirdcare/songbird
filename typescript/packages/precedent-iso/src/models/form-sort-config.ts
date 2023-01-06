import { z } from "zod";

export type FormSortConfig = z.infer<typeof ZFormSortConfig>;

export const ZFormSortConfig = z.object({
  client: z.string(),
  flowLabel: z.string(),
  variantLabel: z.string(),
});

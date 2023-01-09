import { z } from "zod";

export const ZSubmitFormRequest = z.object({
  stageIndex: z.number().nonnegative(),
});

export type SubmitFormRequest = z.infer<typeof ZSubmitFormRequest>;

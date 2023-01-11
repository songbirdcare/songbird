import { z } from "zod";

export const ZFormAction = z.object({
  type: z.literal("form"),
  stageId: z.string(),
  taskId: z.string(),
});

export const ZAction = z.discriminatedUnion("type", [ZFormAction]);

export type FormAction = z.infer<typeof ZFormAction>;
export type Action = z.infer<typeof ZAction>;

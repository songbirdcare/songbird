import { z } from "zod";

export const ZFormAction = z.object({
  type: z.literal("form"),
  stageId: z.string(),
  taskId: z.string(),
});

export const ZScheduleAction = z.object({
  type: z.literal("schedule"),
  stageId: z.string(),
  taskId: z.string(),
});

export const ZSignatureAction = z.object({
  type: z.literal("signature"),
  stageId: z.string(),
  taskId: z.string(),
});

export const ZDummyAction = z.object({
  type: z.literal("dummy"),
  stageId: z.string(),
  taskId: z.string(),
});

export const ZAction = z.discriminatedUnion("type", [
  ZFormAction,
  ZSignatureAction,
  ZScheduleAction,
  ZDummyAction,
]);

export type FormAction = z.infer<typeof ZFormAction>;
export type Action = z.infer<typeof ZAction>;

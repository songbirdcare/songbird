import { z } from "zod";

export const ZTaskStatus = z.enum(["pending", "complete"]);
export type TaskStatus = z.infer<typeof ZTaskStatus>;

export const ZScheduleTask = z.object({
  id: z.string(),
  status: ZTaskStatus,
  type: z.literal("schedule"),
});

export type ScheduleTask = z.infer<typeof ZScheduleTask>;

export const ZFormTask = z.object({
  id: z.string(),
  status: ZTaskStatus,
  type: z.literal("form"),
  slug: z.string(),
});

export type FormTask = z.infer<typeof ZFormTask>;

export const ZSignatureTask = z.object({
  id: z.string(),
  status: ZTaskStatus,
  type: z.literal("signature"),
});

export type SignatureTask = z.infer<typeof ZSignatureTask>;

export const ZDummyTask = z.object({
  id: z.string(),
  status: ZTaskStatus,
  type: z.literal("dummy"),
});

export type DummyTask = z.infer<typeof ZDummyTask>;

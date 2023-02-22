import { z } from "zod";

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export const ZWeekday = z.enum(WEEKDAYS);

export type Weekday = z.infer<typeof ZWeekday>;

export const PERIODS = ["AM", "PM"] as const;

export const ZPeriod = z.enum(PERIODS);

export type Period = z.infer<typeof ZPeriod>;

export const ZBlock = z.object({
  start: z.object({
    hour: z.number().int().min(1).max(12),
    period: ZPeriod,
  }),
  end: z.object({
    hour: z.number().int().min(1).max(12),
    period: ZPeriod,
  }),
});

export type Block = z.infer<typeof ZBlock>;

export const ZForDay = z.object({
  weekday: ZWeekday,
  blocks: ZBlock.array(),
  isAvailable: z.boolean().array(),
});

export type ForDay = z.infer<typeof ZForDay>;

export const ZSchedule = z.object({
  schedule: ZForDay.array(),
});

export type Schedule = z.infer<typeof ZSchedule>;

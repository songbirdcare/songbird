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

export const ZSlot = z.object({
  hour: z.number().int().min(1).max(12),
  period: ZPeriod,
});

export type Slot = z.infer<typeof ZSlot>;

export const ZBlock = z.object({
  start: ZSlot,
  end: ZSlot,
});

export type Block = z.infer<typeof ZBlock>;

export const ZForDay = z.object({
  day: ZWeekday,
  blockAvailability: z.boolean().array(),
});

export type ForDay = z.infer<typeof ZForDay>;

export const ZSchedule = z.object({
  blocks: ZBlock.array(),
  days: ZForDay.array(),
});

export type Schedule = z.infer<typeof ZSchedule>;

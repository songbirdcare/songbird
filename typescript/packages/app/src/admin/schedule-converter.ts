import { Block, Schedule, WEEKDAYS } from "@songbird/precedent-iso";

export type Row = {
  block: Block;
  availibility: boolean[];
};

export class SchedulerConverter {
  static fromRows = (rows: Row[]): Schedule => ({
    days: WEEKDAYS.map((day, dayIndex) => ({
      day,
      blockAvailability: rows.map((row) => {
        const value = row.availibility[dayIndex];
        if (value === undefined) {
          throw new Error("illegal state");
        }
        return value;
      }),
    })),
    blocks: rows.map((row) => row.block),
  });

  static toRows = (schedule: Schedule): Row[] =>
    schedule.blocks.map(
      (block, idx): Row => ({
        block,
        availibility: schedule.days.map((day) => {
          const value = day.blockAvailability[idx];
          if (value === undefined) {
            throw new Error("illegal state");
          }
          return value;
        }),
      })
    );
}

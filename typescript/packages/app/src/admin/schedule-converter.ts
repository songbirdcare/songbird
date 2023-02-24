import { Block, Schedule,WEEKDAYS } from "@songbird/precedent-iso";

export type Row = {
  block: Block;
  availibility: boolean[];
};

export class SchedulerConverter {
  static fromRows = (rows: Row[]): Schedule => {
    const blocks = rows.map((row) => row.block);
    const days = WEEKDAYS.map((day, dayIndex) => {
      return {
        day,
        blockAvailability: rows.map((row) => {
          const value = row.availibility[dayIndex];
          if (value === undefined) {
            throw new Error("illegal state");
          }
          return value;
        }),
      };
    });
    return {
      days,
      blocks,
    };
  };
  static toRows = (schedule: Schedule): Row[] => {
    const acc: Row[] = [];
    for (const [idx, block] of schedule.blocks.entries()) {
      acc.push({
        block,
        availibility: schedule.days.map((day) => {
          const value = day.blockAvailability[idx];
          if (value === undefined) {
            throw new Error("illegal state");
          }
          return value;
        }),
      });
    }
    return acc;
  };
}

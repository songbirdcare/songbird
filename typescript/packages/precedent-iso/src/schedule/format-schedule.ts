import { isNotNull } from "../is-not-null";
import type { Block, Schedule, Slot } from "../models/schedule";

export class FormatSchedule {
  static format(schedule: Schedule): string {
    const withOpenBlocks = FormatSchedule.daysWithOpenBlocks(schedule);
    return withOpenBlocks.map(FormatSchedule.formatDayWithOpenBlock).join("\n");
  }

  static formatDayWithOpenBlock({ day, blocks }: DayWithOpenBlocks): string {
    return `${day}: ${blocks.map(FormatSchedule.formatBlock).join(", ")}`;
  }

  static daysWithOpenBlocks(schedule: Schedule): DayWithOpenBlocks[] {
    return schedule.days
      .map(
        (day): DayWithOpenBlocks => ({
          day: day.day,
          blocks: day.blockAvailability
            .map((availability, index): Block | undefined =>
              availability ? schedule.blocks[index] : undefined
            )
            .filter((val): val is Block => isNotNull(val)),
        })
      )
      .filter((val) => val.blocks.length > 0);
  }

  static formatBlock({ start, end }: Block): string {
    return `${FormatSchedule.formatSlot(start)} - ${FormatSchedule.formatSlot(
      end
    )}`;
  }
  static formatSlot({ hour, period }: Slot): string {
    return `${hour} ${period}`;
  }
}

export interface DayWithOpenBlocks {
  day: string;
  blocks: Block[];
}

import { Block, Schedule, WEEKDAYS } from "./models/schedule";

export class CreateEmpty {
  static blocks(): Block[] {
    return [
      {
        start: {
          hour: 8,
          period: "AM",
        },
        end: {
          hour: 12,
          period: "PM",
        },
      },
      {
        start: {
          hour: 9,
          period: "AM",
        },
        end: {
          hour: 1,
          period: "PM",
        },
      },
      {
        start: {
          hour: 1,
          period: "PM",
        },
        end: {
          hour: 5,
          period: "PM",
        },
      },
      {
        start: {
          hour: 2,
          period: "PM",
        },
        end: {
          hour: 6,
          period: "PM",
        },
      },
    ];
  }

  static schedule(): Schedule {
    const blocks = CreateEmpty.blocks();

    return {
      blocks,
      days: WEEKDAYS.map((day) => ({
        day,
        blockAvailability: new Array(blocks.length).fill(false),
      })),
    };
  }
}

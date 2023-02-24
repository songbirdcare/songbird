import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Block, Schedule, Slot } from "@songbird/precedent-iso";
import React from "react";

import { SchedulerConverter } from "./schedule-converter";

type Row = {
  block: Block;
  availibility: boolean[];
};

export const DisplaySchedule: React.FC<{ schedule: Schedule }> = ({
  schedule,
}) => {
  const [rows, setRows] = React.useState<Row[]>(() =>
    SchedulerConverter.toRows(schedule)
  );

  const setCell = (blockIndex: number, dayIndex: number) => {
    const copy: Row[] = JSON.parse(JSON.stringify(rows));
    if (copy[blockIndex] === undefined) {
      throw new Error("illegal state");
    }
    const valueAt = copy[blockIndex]!.availibility[dayIndex];
    if (valueAt === undefined) {
      throw new Error("illegal state");
    }
    copy[blockIndex]!.availibility[dayIndex] = !valueAt;

    setRows(copy);
  };

  return <RenderSchedule rows={rows} setCell={setCell} />;
};

const RenderSchedule: React.FC<{
  rows: Row[];
  setCell: (blockIndex: number, dayIndex: number) => void;
}> = ({ rows, setCell }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Monday</TableCell>
            <TableCell>Tuesday</TableCell>
            <TableCell>Wednesday</TableCell>
            <TableCell>Thursday</TableCell>
            <TableCell>Friday</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, blockIndex) => {
            return (
              <TableRow
                key={blockIndex}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{formatBlock(row.block)}</TableCell>
                {row.availibility.map((isAvailable, dayIndex) => {
                  return (
                    <TableCell key={dayIndex}>
                      <Checkbox
                        onChange={() => setCell(blockIndex, dayIndex)}
                        checked={isAvailable}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function formatBlock({ start, end }: Block): string {
  return `${formatSlot(start)} - ${formatSlot(end)}`;
}
function formatSlot({ hour, period }: Slot): string {
  return `${hour} ${period}`;
}

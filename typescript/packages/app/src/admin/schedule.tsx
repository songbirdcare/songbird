import {
  Alert,
  Box,
  Button,
  Checkbox,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Block, Schedule, Slot } from "@songbird/precedent-iso";
import React from "react";

import { useUpdateChild } from "../hooks/use-update-child";
import { SchedulerConverter } from "./schedule-converter";

type Row = {
  block: Block;
  availibility: boolean[];
};

export const DisplaySchedule: React.FC<{
  childId: string;
  schedule: Schedule;
  mutate: () => void;
}> = ({ childId, schedule, mutate }) => {
  const [rows, setRows] = React.useState<Row[]>(() =>
    SchedulerConverter.toRows(schedule)
  );

  React.useEffect(() => {
    setRows(SchedulerConverter.toRows(schedule));
  }, [schedule]);

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

  return (
    <RenderSchedule
      childId={childId}
      rows={rows}
      setCell={setCell}
      mutate={mutate}
    />
  );
};

const RenderSchedule: React.FC<{
  rows: Row[];
  childId: string;
  setCell: (blockIndex: number, dayIndex: number) => void;
  mutate: () => void;
}> = ({ rows, childId, setCell, mutate }) => {
  const { trigger, isMutating } = useUpdateChild();

  const [open, setOpen] = React.useState(false);
  const showSuccess = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <Box display="flex" gap={3} flexDirection="column">
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

      <Button
        disabled={isMutating}
        onClick={async () => {
          await trigger({
            schedule: SchedulerConverter.fromRows(rows),
            childId,
          });
          mutate();
          showSuccess();
        }}
      >
        Save Schedule
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        sx={{ width: "100%" }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={onClose} severity="success" sx={{ width: "500px" }}>
          Schedule Saved
        </Alert>
      </Snackbar>
    </Box>
  );
};

function formatBlock({ start, end }: Block): string {
  return `${formatSlot(start)} - ${formatSlot(end)}`;
}
function formatSlot({ hour, period }: Slot): string {
  return `${hour} ${period}`;
}

import type { Step } from "./step";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

export const DisplayStep: React.FC<{ step: Step; index: number }> = (props) => {
  return (
    <Paper>
      <Box
        display="flex"
        flexDirection="row"
        width="500px"
        alignItems="center"
        justifyContent="space-between"
        padding={3}
      >
        <Box display="flex" flexDirection="column" maxWidth="300px">
          <Typography variant="h6" component="h6" gutterBottom>
            {props.index + 1}. {props.step.title}
          </Typography>
          <Typography>{props.step.byline}</Typography>
        </Box>
        <Button variant="contained" disabled={props.index !== 0}>
          Start
        </Button>
      </Box>
    </Paper>
  );
};

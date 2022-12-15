import type { Step } from "./step";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";

export const DisplayStep: React.FC<{ step: Step; index: number }> = (props) => {
  return (
    <Box display="flex" flexDirection="column" width="400px">
      <Typography variant="h6" component="h6" gutterBottom>
        {props.index + 1}.{props.step.title}
      </Typography>
      <Typography>{props.step.byline}</Typography>
      <Button>Click me</Button>
    </Box>
  );
};

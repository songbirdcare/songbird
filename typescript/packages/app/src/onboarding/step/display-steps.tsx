import type { Step } from "./step";

import Box from "@mui/material/Box";

import { DisplayStep } from "./display-step";

export const DisplaySteps: React.FC<{ steps: Step[] }> = ({ steps }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {steps.map((step, index) => (
        <DisplayStep step={step} index={index} key={index} />
      ))}
    </Box>
  );
};

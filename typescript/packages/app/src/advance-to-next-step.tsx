import { Button } from "@mui/material";

export const AdvanceToNextStep: React.FC<{
  onClick: () => Promise<void>;
  disabled: boolean;
}> = ({ onClick, disabled }) => {
  return (
    <Button disabled={disabled} onClick={onClick} variant="outlined">
      Advance to the next step
    </Button>
  );
};

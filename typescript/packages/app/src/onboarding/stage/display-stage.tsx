import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { assertNever, Stage } from "@songbird/precedent-iso";
import Image from "next/image";

import { SETTINGS } from "../../settings";
import type { StageDisplayInformation } from "./stage-display-information";

export const DisplayStage: React.FC<{
  stage: Stage;
  stageDisplayInformation: StageDisplayInformation;
  index: number;
  isCurrentStage: boolean;
  currentStageIndex: number;
}> = ({
  stageDisplayInformation: { title, byline, asset },
  index,
  isCurrentStage,
  stage,
}) => {
  const copy = copyForStage({
    isCurrentStage,
    byline,
    stage,
  });
  return (
    <Paper sx={{ width: "100%" }} variant="outlined">
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        padding={3}
      >
        <Box display="flex" gap={3} alignItems="center">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Image
              src={asset.path}
              width={asset.width}
              height={asset.height}
              alt={asset.alt}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" component="h6" gutterBottom>
              {index + 1}. {title}
            </Typography>
            <Typography>{copy}</Typography>
          </Box>
        </Box>

        <StageButton stage={stage} isCurrentStage={isCurrentStage} />
      </Box>
    </Paper>
  );
};

interface CopyForStageArgs {
  stage: Stage;
  isCurrentStage: boolean;
  byline: string;
}

function copyForStage({ stage, isCurrentStage, byline }: CopyForStageArgs) {
  switch (stage.type) {
    case "create_account":
    case "check_insurance_coverage":
    case "submit_records":
      return byline;

    case "commitment_to_care": {
      return isCurrentStage
        ? "A signature agreement will be sent out. Please look for it in your email and sign it"
        : byline;
    }
    default:
      assertNever(stage);
  }
}

const StageButton: React.FC<{ stage: Stage; isCurrentStage: boolean }> = ({
  stage,
  isCurrentStage,
}) => {
  switch (stage.type) {
    case "create_account":
    case "check_insurance_coverage":
    case "submit_records":
      return (
        <Button
          href={`/complete-stage?stage=${stage.type}`}
          variant="contained"
          disabled={!isCurrentStage}
        >
          Start
        </Button>
      );

    case "commitment_to_care": {
      return (
        <Button
          href={`/complete-stage?stage=${stage.type}`}
          variant="contained"
          disabled={!isCurrentStage || !SETTINGS.enableDebuggingAction}
        >
          {isCurrentStage ? "Pending" : "Start"}
        </Button>
      );
    }
    default:
      assertNever(stage);
  }
};

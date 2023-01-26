import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { assertNever, Stage } from "@songbird/precedent-iso";
import Image from "next/image";

import { useImpersonateContext } from "../../impersonate/impersonate-context";
import { SONG_BIRD_BIEGE2 } from "../../style/colors";
import { TRACKER } from "../../track";
import styles from "./display-stage.module.css";
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

  const isSmallScreen = useMediaQuery("(max-width:670px)");
  return (
    <Paper
      sx={{
        width: "100%",
        padding: 2,
        gap: isSmallScreen ? 1 : 2,
        flexDirection: "column",
        minHeight: "132px",
        backgroundColor: isCurrentStage ? undefined : SONG_BIRD_BIEGE2,
      }}
      variant="outlined"
      className={styles["paper"] as string}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={styles["icon-container"] as string}
      >
        <Image
          src={asset.path}
          width={asset.width}
          height={asset.height}
          alt={asset.alt}
          className={isCurrentStage ? undefined : (styles["image"] as string)}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        className={styles["text-container"] as string}
      >
        <Typography
          variant="h6"
          component="h6"
          gutterBottom
          className={styles.header as string}
        >
          {index + 1}. {title}
        </Typography>
        <Typography className={styles.text as string}>{copy}</Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        className={styles["button-container"] as string}
        height="100%"
        alignItems="center"
      >
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
  const onClick = () =>
    TRACKER.track("Clicked stage button", { type: stage.type });

  const { enableAdminDebugging } = useImpersonateContext();

  switch (stage.type) {
    case "create_account":
    case "check_insurance_coverage":
    case "submit_records":
      return (
        <Button
          href={`/complete-stage?stage=${stage.type}`}
          variant="contained"
          onClick={onClick}
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
          onClick={onClick}
          disabled={!isCurrentStage || !enableAdminDebugging}
        >
          {isCurrentStage ? "Pending" : "Start"}
        </Button>
      );
    }
    default:
      assertNever(stage);
  }
};

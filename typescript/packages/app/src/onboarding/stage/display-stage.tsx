import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { assertNever, Stage, WorkflowSlug } from "@songbird/precedent-iso";
import Image from "next/image";

import { useImpersonateContext } from "../../impersonate/impersonate-context";
import { SONG_BIRD_BIEGE2 } from "../../style/colors";
import { TRACKER } from "../../track";
import styles from "./display-stage.module.css";
import type { StageDisplayInformation } from "./stage-display-information";

export const DisplayStage: React.FC<{
  stageType: Stage["type"];
  stageDisplayInformation: StageDisplayInformation;
  index: number;
  isStageEnabled: boolean;
  workflowSlug: WorkflowSlug;
}> = ({
  stageDisplayInformation: { title, byline, asset },
  index,
  isStageEnabled,
  stageType,
  workflowSlug,
}) => {
  const copy = copyForStage({
    isStageEnabled,
    byline,
    stageType,
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
        backgroundColor: isStageEnabled ? undefined : SONG_BIRD_BIEGE2,
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
          className={isStageEnabled ? undefined : (styles["image"] as string)}
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
        <StageButton
          stageType={stageType}
          isStageEnabled={isStageEnabled}
          workflowSlug={workflowSlug}
        />
      </Box>
    </Paper>
  );
};

interface CopyForStageArgs {
  stageType: Stage["type"];
  isStageEnabled: boolean;
  byline: string;
}

function copyForStage({ stageType, isStageEnabled, byline }: CopyForStageArgs) {
  switch (stageType) {
    case "create_account":
    case "check_insurance_coverage":
    case "submit_records":
    case "therapist_matching":
    case "review_care_plan":
    case "insurance_approval":
    case "ongoing_care":
    case "complete_assessment":
      return byline;

    case "commitment_to_care": {
      return isStageEnabled
        ? "A signature agreement will be sent out. Please look for it in your email and sign it"
        : byline;
    }
    default:
      assertNever(stageType);
  }
}

const StageButton: React.FC<{
  stageType: Stage["type"];
  isStageEnabled: boolean;
  workflowSlug: WorkflowSlug;
}> = ({ stageType, isStageEnabled, workflowSlug }) => {
  const onClick = () =>
    TRACKER.track("clicked_stage_button", { type: stageType });

  const url = (() => {
    const params = new URLSearchParams();
    params.set("workflow", workflowSlug);
    params.set("stage", stageType);
    return `/complete-stage?${params}`;
  })();

  const { enableAdminDebugging } = useImpersonateContext();

  switch (stageType) {
    case "create_account":
    case "check_insurance_coverage":
    case "submit_records":
    case "therapist_matching":
    case "review_care_plan":
    case "insurance_approval":
    case "ongoing_care":
    case "complete_assessment":
      return (
        <Button
          href={url}
          variant="contained"
          onClick={onClick}
          disabled={!isStageEnabled}
        >
          Start
        </Button>
      );

    case "commitment_to_care": {
      return (
        <Button
          href={url}
          variant="contained"
          onClick={onClick}
          disabled={!isStageEnabled || !enableAdminDebugging}
        >
          {isStageEnabled ? "Pending" : "Start"}
        </Button>
      );
    }
    default:
      assertNever(stageType);
  }
};

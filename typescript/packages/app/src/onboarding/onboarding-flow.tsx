import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import type { Stage } from "@songbird/precedent-iso";

import { DisplayStages } from "./stage/display-stages";

import styles from "./onboarding.module.css";

export const OnboardingFlow: React.FC<{
  isCompleted: boolean;
  currentStageIndex: number;
  stages: Stage[];
}> = ({ isCompleted, currentStageIndex, stages }) => {
  return (
    <Box
      display="flex"
      paddingTop={5}
      height="100%"
      flexDirection="column"
      alignItems="center"
    >
      <Box display="flex" flexDirection="column" width="100%">
        <Box display="flex" width="100%" flexDirection="column" gap={1}>
          <StatusMessage isCompleted={isCompleted} />
        </Box>
      </Box>
      <Box
        display="flex"
        width="100%"
        marginTop={7}
        flexDirection="column"
        gap={1 / 2}
      >
        <LinearProgress
          variant="buffer"
          value={isCompleted ? 100 : (currentStageIndex / stages.length) * 100}
          valueBuffer={100}
        />
        <Typography variant="caption">
          {isCompleted ? stages.length : currentStageIndex} of {stages.length}{" "}
          complete
        </Typography>
      </Box>

      <DisplayStages
        isCompleted={isCompleted}
        currentStageIndex={currentStageIndex}
        stages={stages}
      />
    </Box>
  );
};

const StatusMessage: React.FC<{ isCompleted: boolean }> = ({ isCompleted }) => {
  return isCompleted ? (
    <>
      <Typography
        variant="h5"
        color="primary"
        className={styles["header"] as string}
      >
        We’re on our way to supporting your family!
      </Typography>
      <Typography className={styles["text"] as string}>
        Our team will be in touch about your assessment, therapist match, and
        starting ongoing care.
      </Typography>
    </>
  ) : (
    <>
      <Typography
        variant="h5"
        color="primary"
        className={styles["header"] as string}
      >
        We&apos;re looking forward to supporting your family.
      </Typography>
      <Typography className={styles["text"] as string}>
        Here’s what’s needed to start care.{" "}
      </Typography>
    </>
  );
};

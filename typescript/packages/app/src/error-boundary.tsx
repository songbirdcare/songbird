import { Box } from "@mui/material";
import { Component, ErrorInfo, ReactNode } from "react";

import { BodyContainer } from "../src/body-container";
import { MessageWithIcon } from "../src/message-with-icon/message-with-icon";
import { TRACKER } from "./track";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    TRACKER.track("app_exception", { error: error.message });
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <BodyContainer>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            height="100%"
            paddingX={2}
          >
            <MessageWithIcon
              icon={"/onboarding/flag.svg"}
              alt="Error has occurred"
              message="Sorry! An unexpected error has occurred"
            />
          </Box>
        </BodyContainer>
      );
    }

    return this.props.children;
  }
}

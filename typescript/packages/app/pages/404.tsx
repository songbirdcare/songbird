import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Box } from "@mui/material";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useTrackOnce } from "../src/hooks/use-track-once";
import { MessageWithIcon } from "../src/message-with-icon/message-with-icon";

const NotFound: React.FC = () => {
  useTrackOnce("page_accessed", { page: "404" });

  return (
    <>
      <AppBar />

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
            alt="Page not found"
            title="Page not found"
            width={64}
            height={60}
          />
        </Box>
      </BodyContainer>
    </>
  );
};

export default withPageAuthRequired(NotFound);

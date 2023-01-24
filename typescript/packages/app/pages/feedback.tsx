import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import EmbedFlow from "@formsort/react-embed";
import { LinearProgress, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";

import { useFetchUser } from "../src/hooks/use-fetch-user";
import { SETTINGS } from "../src/settings";

const REDIRECT_WAIT_TIME = 5_000;

const Feedback: React.FC = () => {
  const { data: user } = useFetchUser();
  const [hasSubmittedForm, setHasSubmittedForm] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    if (hasSubmittedForm) {
      setTimeout(() => router.push("/"), REDIRECT_WAIT_TIME);
    }
  }, [router, hasSubmittedForm]);

  if (!user) {
    return <LinearProgress />;
  }
  console.log(SETTINGS.feedback);

  return (
    <>
      <EmbedFlow
        clientLabel={SETTINGS.feedback.client}
        flowLabel={SETTINGS.feedback.flowLabel}
        variantLabel={SETTINGS.feedback.variantLabel}
        responderUuid={user.id}
        embedConfig={{
          style: {
            width: "100%",
            height: "100%",
          },
        }}
        onFlowFinalized={() => setHasSubmittedForm(true)}
      />
      {hasSubmittedForm && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={true}
          message="Your feedback has been recorded! Redirecting to the dashboard"
        />
      )}
    </>
  );
};

export default withPageAuthRequired(Feedback);

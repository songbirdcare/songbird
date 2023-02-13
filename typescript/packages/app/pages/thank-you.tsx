import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import * as React from "react";

import { AppBar } from "../src/app-bar/app-bar";
import { BodyContainer } from "../src/body-container";
import { useFetchChild } from "../src/hooks/use-fetch-child";
import { useRedirectIfNotVerified } from "../src/hooks/use-redirect-if-not-verified";
import { useTrackOnce } from "../src/hooks/use-track-once";

const ThankYou: React.FC = () => {
  useRedirectIfNotVerified();

  const { data } = useFetchChild();

  console.log(data);

  useTrackOnce("page_accessed", { page: "thank-you" });

  return (
    <>
      <AppBar />

      <BodyContainer></BodyContainer>
    </>
  );
};

export default withPageAuthRequired(ThankYou);

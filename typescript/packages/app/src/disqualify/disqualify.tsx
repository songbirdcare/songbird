import Box from "@mui/material/Box";
import type { DisqualificationReason } from "@songbird/precedent-iso";
import { assertNever } from "@songbird/precedent-iso";
import React from "react";

import { MessageWithIcon } from "../message-with-icon/message-with-icon";

export const Disqualify: React.FC<{ reason: DisqualificationReason }> = ({
  reason,
}) => {
  const { title, message } = fromReason(reason);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="100%"
      paddingX={2}
      maxWidth="800px"
    >
      <MessageWithIcon
        icon={"/onboarding/heart.svg"}
        alt="Page not found"
        title={title}
        message={message}
        width={39}
        height={31}
      />
    </Box>
  );
};

interface TitleWithMessage {
  title: string;
  message: string;
}

function fromReason(reason: DisqualificationReason): TitleWithMessage {
  switch (reason) {
    case "location":
      return {
        title: "Unfortunately, we're not yet in your area yet",
        message:
          "We'll let you know as we expand our services, but we encourage you to continue seeking other providers. We'd be happy to help with referrals — just email us at hello@songbirdcare.com",
      };
    case "age":
      return {
        title: "Unfortunately, we currently only work with children under 7",
        message:
          "We'll keep you updated as we expand our services, but we encourage you to continue seeking other providers. We'd be happy to help with referrals —email us at family@songbirdcare.com",
      };
    case "insurance":
      return {
        title: "Unfortunately, your insurance doesn't yet cover Songbird",
        message:
          "We'll let you know as that changes, but we encourage you to continue seeking other providers. We'd be happy to help with referrals — just email us at family@songbircare.com",
      };
    case "other":
      return {
        title: "Unfortunately, we cannot cover your child yet",
        message:
          "We'll let you know as that changes, but we encourage you to continue seeking other providers. We'd be happy to help with referrals — just email us at family@songbircare.com",
      };
    default:
      assertNever(reason);
  }
}

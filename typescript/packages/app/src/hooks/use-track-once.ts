import React from "react";

import { TRACKER } from "../track";

export const useTrackOnce = <
  EventT extends string,
  PropertiesT extends Record<string, unknown>
>(
  messages: EventT,
  properties?: PropertiesT
) => {
  React.useEffect(() => {
    TRACKER.track(messages, properties);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

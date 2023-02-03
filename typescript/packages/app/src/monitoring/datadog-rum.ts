import { datadogRum } from "@datadog/browser-rum";

import { SETTINGS } from "../settings";

export function initForRum({ id, email }: Args) {
  if (!SETTINGS.datadog) {
    return;
  }
  datadogRum.init({
    applicationId: SETTINGS.datadog.applicationId,
    clientToken: SETTINGS.datadog.clientToken,
    site: SETTINGS.datadog.site,
    service: SETTINGS.datadog.service,
    env: SETTINGS.datadog.env,

    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask-user-input",
  });

  datadogRum.startSessionReplayRecording();

  datadogRum.setUser({
    id,
    email,
  });
}
interface Args {
  id: string;
  email: string;
}

import { assertNever } from "@songbird/precedent-iso";
import type { LogFormat } from "./settings";

export function fastifyLogSettings(logFormat: LogFormat) {
  // empty case switch on LogFormat to ensure exhaustiveness
  switch (logFormat) {
    case "json":
      return true;
    case "pretty":
      return {
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        },
      };
    default:
      return assertNever(logFormat);
  }
}

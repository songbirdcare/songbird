import { createClient } from "redis";
import { SETTINGS } from "../settings";

export const CLIENT = createClient({
  url: `redis://${SETTINGS.redis.host}:${SETTINGS.redis.port}`,
});

CLIENT.on("connect", () => {
  console.info("Connection to redis established");
});

CLIENT.on("error", (_) => {
  //throw new Error(`Redis:::createClient: Connection to redis failed ${err} --`);
});

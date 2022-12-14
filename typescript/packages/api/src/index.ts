import * as dotenv from "dotenv";
dotenv.config();
import { SETTINGS } from "./settings";
import Fastify from "fastify";
import { CLIENT } from "./redis/redis";
import { fastifyLogSettings } from "./logger";

const fastify = Fastify({
  logger: fastifyLogSettings(SETTINGS.logFormat),
});
console.log("Booting application");

async function start() {
  await CLIENT.connect();

  // TODO enable CORS later
  fastify.addHook("onRequest", (_, reply, done) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Headers", "*");
    reply.header("Access-Control-Allow-Methods", "*");
    done();
  });

  fastify.get("/", async function (_, reply) {
    await CLIENT.incr("count");
    const count = Number((await CLIENT.get("count")) ?? 0);
    reply.send({ count });
  });

  fastify.listen(
    { port: SETTINGS.port, host: SETTINGS.host },
    function (err, _) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    }
  );
}

start();

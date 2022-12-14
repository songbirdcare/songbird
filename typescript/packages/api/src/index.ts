import { SETTINGS } from "./settings";
import { QUOTES } from "./quotes";
import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

// TODO enable CORS later
fastify.addHook("onRequest", (_, reply, done) => {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Headers", "*");
  reply.header("Access-Control-Allow-Methods", "*");
  done();
});

fastify.get("/", function (_, reply) {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  reply.send({ quote });
});

// Run the server!
fastify.listen({ port: SETTINGS.port, host: SETTINGS.host }, function (err, _) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

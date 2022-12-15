import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { SETTINGS } from "./settings";

import { CLIENT } from "./redis/redis";

console.log("Booting application");

async function start() {
  const app = express();
  const router = express.Router();
  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.get("/", async (_: express.Request, res: express.Response) => {
    await CLIENT.incr("count");
    const count = Number((await CLIENT.get("count")) ?? 0);
    res.json({ count });
  });

  app.use("/api/v1", router);

  await CLIENT.connect();

  app.listen(SETTINGS.port, SETTINGS.host);
}

start();

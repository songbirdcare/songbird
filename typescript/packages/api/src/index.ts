import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { SETTINGS } from "./settings";

console.log("Booting application");

async function start() {
  const app = express();
  const router = express.Router();
  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.get("/", async (_: express.Request, res: express.Response) => {
    res.json({ count: 0 });
  });

  app.use("/api/v1", router);

  app.listen(SETTINGS.port, SETTINGS.host);
}

start();

import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { SETTINGS } from "./settings";

import { expressjwt } from "express-jwt";

import { expressJwtSecret } from "jwks-rsa";

console.log("Booting application");

const jwtCheck = expressjwt({
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: SETTINGS.auth.jwksUri,
  }) as any,
  audience: SETTINGS.auth.audience,
  issuer: SETTINGS.auth.issuer,
  algorithms: ["RS256"],
});

async function start() {
  const app = express();
  const router = express.Router();

  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.use(jwtCheck);

  app.get("/", async (_: express.Request, res: express.Response) => {
    res.json({ message: "🎊 You are authenticated 🎊" });
  });

  app.use("/api/v1", router);

  app.listen(SETTINGS.port, SETTINGS.host);
}

start();

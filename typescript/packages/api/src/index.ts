import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { SETTINGS } from "./settings";

import { expressjwt } from "express-jwt";

import { expressJwtSecret } from "jwks-rsa";
import { sql } from "slonik";
import { POOL } from "./sql";

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

  const pool = await POOL;

  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.get("/public", async (_: express.Request, res: express.Response) => {
    res.json({ message: "🎊 Success! 🎊" });
  });

  app.get("/sql-check", async (_: express.Request, res: express.Response) => {
    const selectResponse = await pool.query(sql.unsafe`SELECT 1 as one`);
    const data = selectResponse.rows[0].one;
    res.json({ message: data });
  });

  app.use(jwtCheck);

  app.get("/protected", async (_: express.Request, res: express.Response) => {
    res.json({ message: "🎊 Success! 🎊" });
  });

  app.use("/api/v1", router);

  app.listen(SETTINGS.port, SETTINGS.host);
}

start();

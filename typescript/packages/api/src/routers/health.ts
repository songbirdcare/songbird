import express from "express";
import { DatabasePool, sql } from "slonik";

export class HealthRouter {
  constructor(private readonly pool: DatabasePool) {}

  init() {
    const router = express.Router();

    router.get("/", async (_: express.Request, res: express.Response) => {
      res.json({ status: "OK" });
    });

    router.get("/sql", async (_: express.Request, res: express.Response) => {
      const [row] = (await this.pool.query(sql.unsafe`SELECT 1 as data`)).rows;
      res.json({ message: row.data });
    });
    return router;
  }
}

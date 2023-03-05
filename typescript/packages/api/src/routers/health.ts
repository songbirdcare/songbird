import express from "express";

import type { HealthService } from "../services/health-service";

export class HealthRouter {
  constructor(private readonly svc: HealthService) {}

  init() {
    const router = express.Router();

    router.get("/", async (_: express.Request, res: express.Response) => {
      res.json({ status: "OK" });
    });

    router.get("/sql", async (_: express.Request, res: express.Response) => {
      const data = await this.svc.pingSql();
      res.json({ message: data });
    });
    return router;
  }
}

import express from "express";

import type { ChildService } from "../services/child/child-service";

export class ChildRouter {
  constructor(private readonly childService: ChildService) {}

  init() {
    const router = express.Router();
    router.get("/", async (req: express.Request, res: express.Response) => {
      const child = await this.childService.getOrCreate(req.user.id);
      res.json({ child });
    });

    return router;
  }
}

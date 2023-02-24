import { ZUpdateArguments } from "@songbird/precedent-iso";
import express from "express";

import type { ChildService } from "../services/child/child-service";

export class ChildRouter {
  constructor(private readonly childService: ChildService) {}

  init() {
    const router = express.Router();
    router.get("/", async (req: express.Request, res: express.Response) => {
      const child = await this.childService.get(req.user.id);
      res.json({ child });
    });

    router.put(
      "/update",
      async (req: express.Request, res: express.Response) => {
        const child = await this.childService.get(req.user.id);

        await this.childService.update(
          child.id,
          ZUpdateArguments.parse(req.body)
        );
        res.json({ status: "ok" });
      }
    );

    return router;
  }
}

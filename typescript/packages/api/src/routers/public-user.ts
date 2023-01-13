import express from "express";

import type { UserService } from "../services/user-service";
import { ZEmailWithPassword } from "@songbird/precedent-iso";

export class PublicUserRouter {
  constructor(private readonly userService: UserService) {}

  init() {
    const router = express.Router();

    router.post(
      "/create",
      async (req: express.Request, res: express.Response) => {
        const parsed = ZEmailWithPassword.parse(req.body);
        res.json({ data: await this.userService.create(parsed) });
      }
    );

    return router;
  }
}

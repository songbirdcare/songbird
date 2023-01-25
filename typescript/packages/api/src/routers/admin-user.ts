import { z } from "zod";
import { ZUserRole } from "@songbird/precedent-iso";
import express from "express";

import type { UserService } from "../services/user-service";

export class AdminUserRouter {
  constructor(private readonly userService: UserService) {}

  init() {
    const router = express.Router();

    router.get(
      "/list-users",
      async (_: express.Request, res: express.Response) => {
        const users = await this.userService.list();
        res.json({ data: users });
      }
    );

    router.put(
      "/change-role/:userId",
      async (req: express.Request, res: express.Response) => {
        const userId = z.string().parse(req.params.userId);

        const body = ZChangeRole.parse(req.body);
        const user = await this.userService.changeRole(userId, body.role);
        res.json({ data: user });
      }
    );

    return router;
  }
}

const ZChangeRole = z.object({
  role: ZUserRole,
});

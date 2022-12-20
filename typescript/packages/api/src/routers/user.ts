import express from "express";
import type { UserService } from "../services/user-service";

export class UserRouter {
  constructor(private readonly userService: UserService) {}

  init() {
    const router = express.Router();
    router.get("/", async (_: express.Request, res: express.Response) => {
      await this.userService.ping();
      res.json({ status: "OK" });
    });

    return router;
  }
}

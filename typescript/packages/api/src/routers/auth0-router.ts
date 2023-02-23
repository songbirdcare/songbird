import express from "express";
import { z } from "zod";

import type { UserService } from "../services/user-service";

export class Auth0Router {
  constructor(private readonly userService: UserService) {}
  init() {
    const router = express.Router();

    router.post(
      "/ingest",
      async (req: express.Request, res: express.Response) => {
        const parsed = ZAuth0Payload.array().parse(req.body);
        await this.userService.updateLastLogin(parsed);
        res.json({ data: "okay" });
      }
    );

    return router;
  }
}

const ZAuth0Payload = z
  .object({
    data: z.object({
      date: z.string(),
      user_name: z.string(),
      details: z.object({
        stats: z.object({
          loginsCount: z.number().min(0),
        }),
      }),
    }),
  })
  .transform((val) => ({
    date: new Date(val.data.date),
    email: val.data.user_name,
    loginCount: val.data.details.stats.loginsCount,
  }));

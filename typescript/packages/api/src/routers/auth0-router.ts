import express from "express";
import { z } from "zod";

import { LOGGER } from "../logger";
import type { UserService } from "../services/user-service";

export class Auth0Router {
  constructor(private readonly userService: UserService) {}
  init() {
    const router = express.Router();

    router.post(
      "/ingest",
      async (req: express.Request, res: express.Response) => {
        try {
          await this.userService.updateLastLogin(
            ZAuth0Payload.array().parse(req.body)
          );
          res.json({ data: "okay" });
        } catch (e) {
          LOGGER.error(req.body, "oauth cannot parse");
          LOGGER.error(e);
          res.status(400).send("could not parsed");
        }
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
    }),
  })
  .transform((val) => ({
    date: new Date(val.data.date),
    email: val.data.user_name,
  }));

import express from "express";

import type { Auth0Service } from "../services/auth0/auth0-service";

export class UserRouter {
  constructor(private readonly auth0Service: Auth0Service) {}

  init() {
    const router = express.Router();
    router.get("/me", async (req: express.Request, res: express.Response) => {
      res.json(req.user);
    });

    router.post(
      "/send-email-verification",
      async (req: express.Request, res: express.Response) => {
        if (req.user === undefined) {
          throw new Error("Illegal state error");
        }

        const data = await this.auth0Service.sendEmailVerification(
          req.user.sub
        );

        res.json({ data });
      }
    );

    return router;
  }
}

import type { NextFunction, Response } from "express";
import type { Request } from "express-jwt";

import type { Auth0Service } from "../services/auth0/auth0-service";
import type { UserService } from "../services/user-service";

export class UserInformationMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly auth0Service: Auth0Service
  ) {}

  addUser =
    () =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const sub = req?.auth?.sub;
      if (!sub) {
        res.json({
          status: "failed",
          message: "User is not logged in",
        });
        res.end();
        return;
      }

      req.user = await this.#getUser(sub);
      next();
    };

  #getUser = async (sub: string) => {
    const user = await this.userService.get(sub);
    if (user === undefined || !user.emailVerified) {
      console.log(`Attempting to fetch profile from Auth0 sub=${sub}`);
      const fromAuth0 = await this.auth0Service.getUser(sub);
      console.log(`Fetched profile from Auth0 sub=${sub}`);
      return this.userService.upsert(fromAuth0);
    }
    return user;
  };

  ensureUserVerified =
    () =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const user = req.user;
      if (user === undefined) {
        throw new Error("User is not defined on request");
      }

      if (!user.emailVerified) {
        res.json({
          status: "failed",
          message: "Please verify your email address",
        });
        res.end();
        return;
      }

      next();
    };
}

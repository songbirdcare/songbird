import type { NextFunction, Response } from "express";
import type { Request } from "express-jwt";

import type { UserService } from "../services/user-service";
import { UserInformation } from "./user-information";

const KEY = "https://songbird.com/user";

export class UserInformationMiddleware {
  constructor(private readonly userService: UserService) {}

  init() {
    // DELETE ME
    undefined && this.userService;

    const addUser = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const auth = req.auth;
      const user = auth?.[KEY];
      if (auth === undefined || user === undefined) {
        res.json({
          status: "failed",
          message: "Authentication failed. User information not present",
        });
        res.end();
        return;
      }

      try {
        req.user = UserInformation.parse({
          ...user,
          sub: auth.sub,
        });

        if (!req.user.emailVerified) {
          res.json({
            status: "failed",
            message: "Please verify your email address",
          });
          res.end();
          return;
        }

        await this.userService.upsert(req.user);
        next();
      } catch (error) {
        console.log(error);
        res.json({
          status: "failed",
          message: "Could not read user information",
        });
        res.end();
      }
    };

    return addUser;
  }
}

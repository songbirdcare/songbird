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
    async function addUser(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
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
        next();
      } catch (error) {
        res.json({
          status: "failed",
          message: "Authentication failed invalid token",
        });
        res.end();
      }
    }

    return addUser;
  }
}

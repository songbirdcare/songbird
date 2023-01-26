import type { NextFunction, Response } from "express";
import type { Request } from "express-jwt";
import { ANALYTICS } from "../analytics";

import { LOGGER } from "../logger";
import type { Auth0Service } from "../services/auth0/auth0-service";
import type { FormSubmissionService } from "../services/form-submission-service";
import type { UserService } from "../services/user-service";

export class UserInformationMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly auth0Service: Auth0Service,
    private readonly formSubmissionService: FormSubmissionService
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

      const user = await this.#getUser(sub);
      const impersonate = req.headers["x-impersonate"];
      if (typeof impersonate === "string") {
        if (user.role !== "admin") {
          throw new Error("Only admins can impersonate");
        }
        req.impersonatingUser = user;
        req.user = await this.userService.getById(impersonate);
      } else {
        req.user = user;
      }

      ANALYTICS.identify(req.user.id, req.user.email);
      next();
    };

  #getUser = async (sub: string) => {
    const user = await this.userService.getBySub(sub);
    if (user === undefined || !user.emailVerified) {
      return this.#createUserLazily(sub);
    }
    return user;
  };

  #createUserLazily = async (sub: string) => {
    LOGGER.info(`Attempting to fetch profile from Auth0 sub=${sub}`);
    const fromAuth0 = await this.auth0Service.getUser(sub);

    LOGGER.info(`Fetched profile from Auth0 sub=${sub}`);
    const user = await this.userService.upsert(fromAuth0);

    const submissionForm = await this.formSubmissionService.getSignupForm(
      fromAuth0.email
    );

    if (submissionForm) {
      LOGGER.info(`Found submission form for ${fromAuth0.email}`);
      return await this.userService.upsert({
        sub,
        email: fromAuth0.email,
        givenName: submissionForm.firstName,
        familyName: submissionForm.lastName,
        phone: submissionForm.phone,
      });
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

  ensureAdmin =
    () =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const user = req.user;
      if (user === undefined) {
        throw new Error("User is not defined on request");
      }

      if (user.role !== "admin") {
        res.json({
          status: "failed",
          message: "This is a protected route",
        });
        res.end();
        return;
      }

      next();
    };
}

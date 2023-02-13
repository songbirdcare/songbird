import { isInternalUser, UserModel } from "@songbird/precedent-iso";
import type { NextFunction, Response } from "express";
import type { Request } from "express-jwt";

import { LOGGER } from "../logger";
import type { Auth0Service } from "../services/auth0/auth0-service";
import type { ChildService } from "../services/child/child-service";
import type { FormSubmissionService } from "../services/form/form-submissions-service";
import { qualifiedStatusFromForm } from "../services/form/qualified-status-from-form";
import type { UserService } from "../services/user-service";
import { SETTINGS } from "../settings";
import { AmplitudeTrackingService } from "../tracking";

export class UserInformationMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly childService: ChildService,
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

      const { user, isNewUser } = await this.#getUser(sub);

      const analytics = new AmplitudeTrackingService(SETTINGS.amplitudeKey, {
        type: "user",
        id: user.id,
        isInternal: isInternalUser(user),
      });

      req.trackUser = analytics.track;
      if (isNewUser) {
        req.trackUser("user_created", {
          provider: user.sub.split("|", 1)[0],
        });
      }

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

      next();
    };

  #getUser = async (sub: string) => {
    const fromSub = await this.userService.getBySub(sub);

    const user =
      fromSub === undefined || !fromSub.emailVerified
        ? await this.#upsertUser(sub)
        : fromSub;

    if (fromSub) {
      // there is an edge case where a user gets created w/o a child
      // this should in theory never happen
      LOGGER.warn("User created without child", { userId: user.id });
      await this.childService.createOnlyIfNeeded(user.id, { type: "unknown" });
    }

    return { user, isNewUser: fromSub === undefined };
  };

  #upsertUser = async (sub: string): Promise<UserModel> => {
    const fromAuth0 = await this.auth0Service.getUser(sub);
    const user = await this.userService.upsert(fromAuth0);

    const signupForm = await this.formSubmissionService.getSignupForm(
      fromAuth0.email
    );

    await this.childService.createOnlyIfNeeded(
      user.id,
      qualifiedStatusFromForm(signupForm)
    );

    if (signupForm) {
      LOGGER.info(
        { email: fromAuth0.email },
        `Found submission form for ${fromAuth0.email}`
      );
      return this.userService.upsert({
        sub,
        email: fromAuth0.email,
        givenName: signupForm.firstName,
        familyName: signupForm.lastName,
        phone: signupForm.phone,
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

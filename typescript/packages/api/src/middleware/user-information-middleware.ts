import {
  assertNever,
  isInternalUser,
  UserModel,
} from "@songbird/precedent-iso";
import type { NextFunction, Response } from "express";
import type { Request } from "express-jwt";

import { LOGGER } from "../logger";
import type { Auth0Service } from "../services/auth0/auth0-service";
import type { FormSubmissionService } from "../services/form-submission-service";
import type { UserService } from "../services/user-service";
import { SETTINGS } from "../settings";
import { AmplitudeTrackingService } from "../tracking";

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

      const { user, info } = await this.#getUser(sub);

      const analytics = new AmplitudeTrackingService(SETTINGS.amplitudeKey, {
        type: "user",
        id: user.id,
        isInternal: isInternalUser(user),
      });
      req.trackUser = analytics.track;

      req.trackUser("Test Friday");

      trackUpsert(req.trackUser, info, user.sub);

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

  #getUser = async (sub: string): Promise<UpsertUser> => {
    const user = await this.userService.getBySub(sub);
    if (user === undefined || !user.emailVerified) {
      return this.#upsertUser(sub, user !== undefined);
    }
    return { user, info: "already_exists" };
  };

  #upsertUser = async (
    sub: string,
    userExists: boolean
  ): Promise<UpsertUser> => {
    LOGGER.info(`Attempting to fetch profile from Auth0 sub=${sub}`);
    const fromAuth0 = await this.auth0Service.getUser(sub);

    LOGGER.info(`Fetched profile from Auth0 sub=${sub}`);
    const user = await this.userService.upsert(fromAuth0);

    const submissionForm = await this.formSubmissionService.getSignupForm(
      fromAuth0.email
    );

    const info: UpsertUser["info"] = (() => {
      if (userExists) {
        return "already_exists";
      }
      return submissionForm === undefined
        ? "created_no_form"
        : "created_found_form";
    })();

    if (submissionForm) {
      LOGGER.info(`Found submission form for ${fromAuth0.email}`);
      return {
        user: await this.userService.upsert({
          sub,
          email: fromAuth0.email,
          givenName: submissionForm.firstName,
          familyName: submissionForm.lastName,
          phone: submissionForm.phone,
        }),
        info,
      };
    }

    return {
      user,
      info,
    };
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

function trackUpsert(
  track: (message: string, properties?: Record<string, unknown>) => void,
  info: UpsertUser["info"],
  sub: string
) {
  const [provider] = sub.split("|", 1);

  switch (info) {
    case "already_exists":
      return;
    case "created_found_form":
      track("user_created", { provider });
      track("user_created_found_intake_form");
      return;
    case "created_no_form":
      track("user_created", { provider });
      track("user_created_no_intake_form");
      return;
    default:
      assertNever(info);
  }
}

interface UpsertUser {
  user: UserModel;
  info: "already_exists" | "created_no_form" | "created_found_form";
}

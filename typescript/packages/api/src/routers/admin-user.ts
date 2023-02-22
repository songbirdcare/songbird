import { ZChangeRoleRequest } from "@songbird/precedent-iso";
import express from "express";

import type { ChildService } from "../services/child/child-service";
import type { ProviderService } from "../services/provider/provider-service";
import type { UserService } from "../services/user-service";
import type { WorkflowService } from "../services/workflow/workflow-service";

export class AdminUserRouter {
  constructor(
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly workflowService: WorkflowService,
    private readonly childService: ChildService
  ) {}

  init() {
    const router = express.Router();

    router.get(
      "/list-users",
      async (_: express.Request, res: express.Response) => {
        const users = await this.userService.list();
        res.json({ data: users });
      }
    );

    router.get(
      "/impersonate",
      async (req: express.Request, res: express.Response) => {
        if (!req.impersonatingUser) {
          throw new Error("user is not impersonating anyone");
        }
        res.json({ user: req.user, impersonatingUser: req.impersonatingUser });
      }
    );

    router.put(
      "/change-role",
      async (req: express.Request, res: express.Response) => {
        const body = ZChangeRoleRequest.parse(req.body);
        if (body.userId === req.user.id) {
          throw new Error("cannot change your own role");
        }
        const user = await this.userService.changeRole(body.userId, body.role);
        res.json({ data: user });
      }
    );

    router.delete(
      "/user/:userId",
      async (req: express.Request, res: express.Response) => {
        const userId = req.params.userId;
        if (typeof userId !== "string") {
          throw new Error("invalid userId");
        }
        if (userId === req.user.id || userId === req.impersonatingUser?.id) {
          throw new Error("cannot delete your own user");
        }

        await this.userService.delete(userId);
        res.json({ data: "ok" });
      }
    );

    router.get(
      "/providers",
      async (_: express.Request, res: express.Response) => {
        const providers = await this.providerService.getAll();
        res.json({ providers });
      }
    );

    router.get(
      "/user-data/:userId",
      async (req: express.Request, res: express.Response) => {
        const userId = req.params.userId;
        if (typeof userId !== "string") {
          throw new Error("invalid userId");
        }

        const user = await this.userService.getById(userId);

        const child = await this.childService.get(userId);

        const workflows = await this.workflowService.getAll({
          userId: user.id,
          childId: child.id,
        });

        res.json({ user, child, workflows });
      }
    );
    return router;
  }
}

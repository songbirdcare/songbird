import express from "express";

import type { ChildService } from "../services/child/child-service";
import type { WorkflowService } from "../services/workflow/workflow-service";

export class WorkflowRouter {
  constructor(
    private readonly childService: ChildService,
    private readonly workflowService: WorkflowService
  ) {}

  init() {
    const router = express.Router();
    router.get(
      "/start",
      async (req: express.Request, res: express.Response) => {
        const child = await this.childService.getOrCreate(req.user.id);
        const workflow = await this.workflowService.getOrCreateInitial({
          userId: req.user.id,
          childId: child.id,
        });
        res.json({
          data: {
            workflow,
          },
        });
      }
    );

    return router;
  }
}

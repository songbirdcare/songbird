import { ZAction } from "@songbird/precedent-iso";
import express from "express";

import type { ChildService } from "../services/child/child-service";
import { INITIAL_SLUG } from "../services/workflow/create-initial-workflow";
import type { WorkflowActionService } from "../services/workflow/workflow-action-service";
import type { WorkflowService } from "../services/workflow/workflow-service";

export class WorkflowRouter {
  constructor(
    private readonly childService: ChildService,
    private readonly workflowService: WorkflowService,
    private readonly workflowActionService: WorkflowActionService
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
          slug: INITIAL_SLUG,
        });

        const advancedWorkflow = await this.workflowActionService.tryAdvance(
          { userId: req.user.id },
          workflow
        );

        res.json({
          data: advancedWorkflow,
        });
      }
    );

    router.put(
      "/action/:workflowId",
      async (req: express.Request, res: express.Response) => {
        const { workflowId } = req.params;
        if (workflowId === undefined) {
          throw new Error("undefine workflowId");
        }
        console.log(`Processing workflow action for ${workflowId}`);

        const action = ZAction.parse(req.body);

        const workflow = await this.workflowActionService.processAction(
          workflowId,
          action
        );

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

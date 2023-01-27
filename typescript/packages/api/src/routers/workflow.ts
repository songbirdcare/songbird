import { ZAction } from "@songbird/precedent-iso";
import express from "express";

import { LOGGER } from "../logger";
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
    router.delete(
      "/all",
      async (req: express.Request, res: express.Response) => {
        await this.workflowService.deleteAllForUser(req.user.id);
        res.json({
          data: "ok",
        });
      }
    );

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
          throw new Error("undefined workflowId");
        }
        LOGGER.info("Processing workflow action", { workflowId });

        const action = ZAction.parse(req.body);

        const workflow = await this.workflowActionService.processAction(
          workflowId,
          action
        );

        if (workflow.status === "completed") {
          req.trackUser!("completed_workflow"); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        } else {
          req.trackUser!("process_workflow_action"); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        }

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

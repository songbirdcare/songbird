import { ZSubmitFormRequest } from "@songbird/precedent-iso";
import express from "express";

import type { ChildService } from "../services/child/child-service";
import { WorkflowActionService } from "../services/workflow/workflow-action-service";
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
          data: workflow,
        });
      }
    );

    router.put(
      "/submit-form",
      async (req: express.Request, res: express.Response) => {
        const { stageIndex } = ZSubmitFormRequest.parse(req.body);

        const child = await this.childService.getOrCreate(req.user.id);
        const workflow = await this.workflowService.getOrCreateInitial({
          userId: req.user.id,
          childId: child.id,
        });

        const { hasChanged, workflow: changedWorkflow } =
          WorkflowActionService.submitForm(workflow, stageIndex);

        if (hasChanged) {
          await this.workflowService.update(changedWorkflow);
        }

        res.json({
          data: "ok",
        });
      }
    );

    return router;
  }
}

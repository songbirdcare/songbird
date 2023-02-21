import {
  Action,
  assertNever,
  WorkflowModel,
  WorkflowWrapper,
} from "@songbird/precedent-iso";

import { LOGGER } from "../../logger";
import type { CalendarSubmissionService } from "../calendar-submissions-service";
import type { ChildService } from "../child/child-service";
import type { SignatureSubmissionService } from "../signature-submission-service";
import type { UserService } from "../user-service";
import type { WorkflowService } from "./workflow-service";

const EMAIL_STARTS_WITH = "Songbird Family Services";

export class WorkflowActionService {
  constructor(
    private readonly calendarSubmissionService: CalendarSubmissionService,
    private readonly userService: UserService,
    private readonly workflowService: WorkflowService,
    private readonly signatureSubmissionService: SignatureSubmissionService,
    private readonly childService: ChildService
  ) {}

  async processAction(
    workflowId: string,
    action: Action
  ): Promise<WorkflowModel> {
    const workflow = await this.workflowService.getById(workflowId);

    const wrapper = new WorkflowWrapper(workflow);

    const info = wrapper.fromIds(action.stageId, action.taskId);
    if (info.task === undefined) {
      LOGGER.warn("Task not found");
      return workflow;
    }
    if (info.task.status === "complete") {
      LOGGER.warn("Task is already completed");
      return workflow;
    }

    if (action.type !== info.task.type) {
      throw new Error(
        `task ${action.type} does not match action ${info.task.type}`
      );
    }

    wrapper.advance();

    const newWorkflow = await this.workflowService.update(wrapper.workflow);

    if (wrapper.isCompleted) {
      await this.childService.advanceWorkflow(workflow.childId, workflow.slug);
    }

    return newWorkflow;
  }

  async tryAdvance(
    context: Context,
    workflow: WorkflowModel
  ): Promise<{ workflow: WorkflowModel; hasChanged: boolean }> {
    const wrapper = new WorkflowWrapper(workflow);
    const result = await this.#tryAdvance(context, wrapper);

    if (result.hasChanged) {
      await this.workflowService.update(result.workflow);
    }

    if (result.isCompleted) {
      await this.childService.advanceWorkflow(workflow.childId, workflow.slug);
    }

    return {
      workflow: result.workflow,
      hasChanged: result.hasChanged,
    };
  }

  async #tryAdvance(
    context: Context,
    workflow: WorkflowWrapper
  ): Promise<WorkflowWrapper> {
    if (workflow.isCompleted) {
      return workflow;
    }

    const currentStage = workflow.currentStage;

    switch (currentStage.type) {
      case "create_account": {
        // check if time exists for email
        const user = await this.userService.getById(context.userId);
        const exists = await this.calendarSubmissionService.exists({
          email: user.email,
        });
        LOGGER.info(
          { email: user.email, exists },
          `Calendar entry for ${user.email} exists: ${exists}`
        );
        if (exists) {
          workflow.advance();
        }
        break;
      }
      case "check_insurance_coverage":
      case "submit_records":
        // TODO right now this check is done manually
        // when an action is submitted
        break;
      case "commitment_to_care": {
        // check if signature exists for email
        const user = await this.userService.getById(context.userId);

        const submission = await this.signatureSubmissionService.get({
          counterPartyEmail: user.email,
          emailSubjectStartsWith: EMAIL_STARTS_WITH,
          status: "completed",
        });

        if (submission) {
          workflow.advance();
        }

        break;
      }
      case "therapist_matching":
      case "insurance_approval":
      case "review_care_plan":
      case "complete_assessment":
      case "ongoing_care":
        //  TODO do something eventually
        break;
      default:
        assertNever(currentStage);
    }

    return workflow;
  }
}

export interface WorkflowWithHasChanged {
  hasChanged: boolean;
  workflow: WorkflowModel;
}

interface Context {
  userId: string;
}

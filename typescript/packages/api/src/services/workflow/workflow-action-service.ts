import {
  assertNever,
  WorkflowModel,
  WorkflowWrapper,
} from "@songbird/precedent-iso";

import type { CalendarSubmissionService } from "../calendar-submissions-service";
import type { UserService } from "../user-service";
import type { WorkflowService } from "./workflow-service";

export class WorkflowActionService {
  constructor(
    private readonly calendarSubmissionService: CalendarSubmissionService,
    private readonly userService: UserService,
    private readonly workflowService: WorkflowService
  ) {}

  static submitForm(
    workflow: WorkflowModel,
    stageIndex: number
  ): WorkflowWithHasChanged {
    const clone = JSON.parse(JSON.stringify(workflow)) as WorkflowModel;

    if (stageIndex !== clone.currentStageIndex) {
      console.warn(
        `Stage mismatch ${stageIndex} !== ${clone.currentStageIndex}`
      );
      return {
        hasChanged: false,
        workflow: clone,
      };
    }

    // TODO we might want to update blockingTasks here
    clone.currentStageIndex += 1;
    return {
      hasChanged: true,
      workflow: clone,
    };
  }

  async tryAdvance(
    context: Context,
    workflow: WorkflowModel
  ): Promise<WorkflowModel> {
    const clone = JSON.parse(JSON.stringify(workflow)) as WorkflowModel;

    const result = await this.#tryAdvance(context, new WorkflowWrapper(clone));

    if (result.hasChanged) {
      return await this.workflowService.update(result.workflow);
    }

    return result.workflow;
  }

  async #tryAdvance(
    context: Context,
    workflow: WorkflowWrapper
  ): Promise<WorkflowWrapper> {
    const currentStage = workflow.currentStage;

    switch (currentStage.type) {
      case "create_account": {
        // check if time exists for email
        const user = await this.userService.getById(context.userId);
        const exists = await this.calendarSubmissionService.exists({
          email: user.email,
        });
        console.log("Calendar entry for ${user.email} exists: ${exists}");
        if (exists) {
          workflow.advance();
        }
        break;
      }
      case "check_insurance_coverage": {
        break;
      }
      case "submit_records": {
        break;
      }
      case "commitment_to_care": {
        break;
      }
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

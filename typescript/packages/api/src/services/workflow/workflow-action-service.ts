import type { WorkflowModel } from "@songbird/precedent-iso";

// this could in theory be a while loop
// but I think it's better to cap iterations
// so in case we have a logical bug we fail fast

const MAX_ATTEMPTS = 10;

export class WorkflowActionService {
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

  static tryAdvance(workflow: WorkflowModel): WorkflowWithHasChanged {
    const clone = JSON.parse(JSON.stringify(workflow)) as WorkflowModel;

    let hasChanged = false;

    for (let attempt = 0; attempt <= MAX_ATTEMPTS; attempt++) {
      const { stages, currentStageIndex } = clone;
      const currentStage = stages[currentStageIndex];
      if (currentStage === undefined) {
        throw new Error("Current stage is undefined");
      }

      if (currentStage.blockingTasks.length === 0) {
        clone.currentStageIndex += 1;
        hasChanged = true;
      } else {
        return {
          hasChanged,
          workflow: clone,
        };
      }
    }

    throw new Error("Exceeded attempt limit");
  }
}

export interface WorkflowWithHasChanged {
  hasChanged: boolean;
  workflow: WorkflowModel;
}

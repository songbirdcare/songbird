import type { Workflow } from "@songbird/precedent-iso";

// this could in theory be a while loop
// but I think it's better to cap iterations
// so in case we have a logical bug we fail fast

const MAX_ATTEMPTS = 10;

export class WorkflowEngineImpl {
  static tryAdvanceWorkflow(workflow: Workflow): TryAdvanceWorkflowResult {
    const clone = JSON.parse(JSON.stringify(workflow)) as Workflow;

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

export interface TryAdvanceWorkflowResult {
  hasChanged: boolean;
  workflow: Workflow;
}

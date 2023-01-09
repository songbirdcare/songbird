import type { WorkflowModel } from "@songbird/precedent-iso";
import type { Stage } from "@songbird/precedent-iso";

export interface WorkflowService {
  getOrCreateInitial(
    args: GetOrCreateWorkflowArguments
  ): Promise<WorkflowModel>;
  update(workflow: UpdateWorkflow): Promise<WorkflowModel>;
}

export interface GetOrCreateWorkflowArguments {
  userId: string;
  childId: string;
}
export interface SubmitFormArguments {
  workflowId: string;
  stageIndex: number;
}

interface UpdateWorkflow {
  id: string;
  stages: Stage[];
  currentStageIndex: number;
}

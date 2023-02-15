import type { WorkflowModel, WorkflowSlug } from "@songbird/precedent-iso";
import type { Stage } from "@songbird/precedent-iso";

export interface WorkflowService {
  deleteAllForUser(userId: string): Promise<void>;
  getById(id: string): Promise<WorkflowModel>;
  getOrCreateInitial(
    args: GetOrCreateWorkflowArguments
  ): Promise<WorkflowModel>;
  update(workflow: UpdateWorkflow): Promise<WorkflowModel>;
}

export interface GetOrCreateWorkflowArguments {
  slug: WorkflowSlug;
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

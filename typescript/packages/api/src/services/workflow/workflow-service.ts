import type { WorkflowModel, WorkflowSlug } from "@songbird/precedent-iso";
import type { Stage } from "@songbird/precedent-iso";

export interface WorkflowService {
  deleteAllForUser(userId: string): Promise<void>;

  getById(id: string): Promise<WorkflowModel>;
  // workflows are created lazily. If a user has no workflows, they will be created when they are requested
  getBySlug(args: GetBySlugArguments): Promise<WorkflowModel>;
  getAll(args: GetAllArguments): Promise<Record<WorkflowSlug, WorkflowModel>>;
  update(workflow: UpdateWorkflow): Promise<WorkflowModel>;
}

export interface GetAllArguments {
  userId: string;
  childId: string;
}

export interface GetBySlugArguments {
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

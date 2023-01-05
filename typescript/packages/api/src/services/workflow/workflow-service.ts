import type { WorkflowModel } from "@songbird/precedent-iso";

export interface WorkflowService {
  getOrCreateInitial({
    userId,
    childId,
  }: GetOrCreateWorkflowOptions): Promise<WorkflowModel>;
}

export interface GetOrCreateWorkflowOptions {
  userId: string;
  childId: string;
}

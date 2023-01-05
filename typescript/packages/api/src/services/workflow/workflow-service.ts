import type { Workflow } from "@songbird/precedent-iso";

export interface WorkflowService {
  getOrCreateInitial({
    userId,
    childId,
  }: GetOrCreateWorkflowOptions): Promise<Workflow>;
}

export interface GetOrCreateWorkflowOptions {
  userId: string;
  childId: string;
}

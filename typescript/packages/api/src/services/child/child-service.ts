import type {
  Child,
  QualificationStatus,
  WorkflowSlug,
} from "@songbird/precedent-iso";

export interface ChildService {
  advanceWorkflow(childId: string, workflowSlug: WorkflowSlug): Promise<void>;
  get(userId: string): Promise<Child>;
  createIfNotExists(
    userId: string,
    qualified: QualificationStatus
  ): Promise<void>;
}

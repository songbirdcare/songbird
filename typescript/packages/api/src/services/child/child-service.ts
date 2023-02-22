import type {
  Child,
  QualificationStatus,
  WorkflowSlug,
} from "@songbird/precedent-iso";

export interface ChildService {
  advanceWorkflow(childId: string, from: WorkflowSlug): Promise<void>;
  get(userId: string): Promise<Child>;
  createIfNotExists(
    userId: string,
    qualified: QualificationStatus
  ): Promise<void>;
}

import type {
  Child,
  QualificationStatus,
  Schedule,
  UpdateArguments,
  WorkflowSlug,
} from "@songbird/precedent-iso";

export interface ChildService {
  getSchedule(childId: string): Promise<Schedule>;
  update(childId: string, args: UpdateArguments): Promise<void>;
  advanceWorkflow(childId: string, from: WorkflowSlug): Promise<void>;
  get(userId: string): Promise<Child>;
  createIfNotExists(
    userId: string,
    qualified: QualificationStatus
  ): Promise<void>;
}

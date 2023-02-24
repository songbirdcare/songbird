import type {
  Child,
  QualificationStatus,
  Schedule,
  WorkflowSlug,
} from "@songbird/precedent-iso";

export interface ChildService {
  getSchedule(childId: string): Promise<Schedule>;
  updateSchedule(childId: string, schedule: Schedule): Promise<void>;

  advanceWorkflow(childId: string, from: WorkflowSlug): Promise<void>;
  get(userId: string): Promise<Child>;
  createIfNotExists(
    userId: string,
    qualified: QualificationStatus
  ): Promise<void>;
}

import type { Child, QualificationStatus } from "@songbird/precedent-iso";

export interface ChildService {
  get(userId: string): Promise<Child>;
  createIfNotExists(
    userId: string,
    qualified: QualificationStatus
  ): Promise<void>;
}

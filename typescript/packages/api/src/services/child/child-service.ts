import type { Child, QualificationStatus } from "@songbird/precedent-iso";

export interface ChildService {
  get(userId: string): Promise<Child>;
  createIfNeeded(
    userId: string,
    qualified: QualificationStatus
  ): Promise<Child>;
}

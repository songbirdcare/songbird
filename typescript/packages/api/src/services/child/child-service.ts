import type { Child, QualificationStatus } from "@songbird/precedent-iso";

export interface ChildService {
  get(userId: string): Promise<Child>;
  createOnlyIfNeeded(
    userId: string,
    qualified: QualificationStatus
  ): Promise<"created" | "not_created">;
}

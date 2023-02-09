import type { Child } from "@songbird/precedent-iso";

export interface ChildService {
  getOrCreate(userId: string): Promise<Child>;
}

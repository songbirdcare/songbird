export interface Child {
  id: string;
  qualified: QualificationStatus;
}

export type QualificationStatus =
  | {
      type: "qualified" | "unknown";
    }
  | {
      type: "not_qualified";
      reason: "location" | "age" | "insurance";
    };

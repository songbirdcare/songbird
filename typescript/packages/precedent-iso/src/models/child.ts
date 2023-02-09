export interface Child {
  id: string;
  qualified: QualificationStatus;
}

// technically speaking you can have more than one disqualification
// reason, but to keep it simple let's just stick to one
export type QualificationStatus =
  | {
      type: "qualified" | "unknown";
    }
  | {
      type: "disqualified";
      reason: "location" | "age" | "insurance" | "other";
    };

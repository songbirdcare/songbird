export interface Child {
  id: string;
  qualified: QualificationStatus;
}

export type DisqualificationReason = "location" | "age" | "insurance" | "other";

// technically speaking you can have more than one disqualification
// reason, but to keep it simple let's just stick to one
export type QualificationStatus =
  | {
      type: "qualified" | "unknown" | "qualified-without-diagnosis";
    }
  | {
      type: "disqualified";
      reason: DisqualificationReason;
    };

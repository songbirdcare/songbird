import type { QualificationStatus } from "@songbird/precedent-iso";

import type { SignupForm } from "./form-submissions-service";

export function qualifiedStatusFromForm(
  answers: SignupForm | undefined
): QualificationStatus {
  if (!answers) {
    return {
      type: "unknown",
    };
  }

  if (answers.isQualified) {
    return {
      type: "qualified",
    };
  } else if (answers.isQualifiedWithoutDiagnosis) {
    return {
      type: "qualified-without-diagnosis",
    };
  } else if (!answers.isQualifiedAge) {
    return {
      type: "disqualified",
      reason: "age",
    };
  } else if (!answers.isQualifiedRegion) {
    return {
      type: "disqualified",
      reason: "location",
    };
  } else if (!answers.isQualifiedInsurance) {
    return {
      type: "disqualified",
      reason: "insurance",
    };
  }

  return {
    type: "disqualified",
    reason: "other",
  };
}

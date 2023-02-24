import { z } from "zod";

import { ZSchedule } from "./schedule";
import type { WorkflowSlug } from "./workflow/workflow";

export interface Child {
  id: string;
  qualified: QualificationStatus;
  workflowSlug: WorkflowSlug;
  assessorId: string | undefined;
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

export const ZUpdateArguments = z.object({
  schedule: ZSchedule.optional(),
  assessorId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type UpdateArguments = z.infer<typeof ZUpdateArguments>;

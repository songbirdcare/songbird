import { z } from "zod";

import * as T from "./task";

export type CareTeamStageType = CareTeamStage["type"];

export type CareTeamTask = CareTeamStage["blockingTasks"][number];

export const ZInsuranceApproval = z.object({
  id: z.string(),
  type: z.literal("insurance_approval"),
  blockingTasks: T.ZDummyTask.array(),
});

export type InsuranceApproval = z.infer<typeof ZInsuranceApproval>;

export const ZTherapistMatching = z.object({
  id: z.string(),
  type: z.literal("therapist_matching"),
  blockingTasks: T.ZDummyTask.array(),
});

export type TherapistMatching = z.infer<typeof ZTherapistMatching>;

export const ZOngoingCare = z.object({
  id: z.string(),
  type: z.literal("ongoing_care"),
  blockingTasks: T.ZDummyTask.array(),
});

export type OngoingCare = z.infer<typeof ZOngoingCare>;

export const ZCareTeamStage = z.discriminatedUnion("type", [
  ZInsuranceApproval,
  ZTherapistMatching,
]);

export type CareTeamStage = z.infer<typeof ZCareTeamStage>;

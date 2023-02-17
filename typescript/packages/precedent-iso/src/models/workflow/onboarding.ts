import { z } from "zod";

import * as T from "./task";

export type OnboardingStageType = OnboardingStage["type"];

export type OnboardingTask = OnboardingStage["blockingTasks"][number];

export const ZCreateAccount = z.object({
  id: z.string(),
  type: z.literal("create_account"),
  blockingTasks: T.ZScheduleTask.array(),
});

export type CreateAccount = z.infer<typeof ZCreateAccount>;

export const ZCheckInsuranceCoverage = z.object({
  id: z.string(),
  type: z.literal("check_insurance_coverage"),
  blockingTasks: T.ZFormTask.array(),
});

export type CheckInsuranceCoverage = z.infer<typeof ZCheckInsuranceCoverage>;

export const ZSubmitRecords = z.object({
  id: z.string(),
  type: z.literal("submit_records"),
  blockingTasks: T.ZFormTask.array(),
});

export type SubmitRecords = z.infer<typeof ZSubmitRecords>;

export const ZCommitmentToCare = z.object({
  id: z.string(),
  type: z.literal("commitment_to_care"),
  blockingTasks: T.ZSignatureTask.array(),
});

export type CommitmentToCare = z.infer<typeof ZCommitmentToCare>;
export const ZOnboardingStage = z.discriminatedUnion("type", [
  ZCreateAccount,
  ZCheckInsuranceCoverage,
  ZSubmitRecords,
  ZCommitmentToCare,
]);

export type OnboardingStage = z.infer<typeof ZOnboardingStage>;

export const ZOnboardingStageType = z.union([
  z.literal("create_account"),
  z.literal("check_insurance_coverage"),
  z.literal("submit_records"),
  z.literal("commitment_to_care"),
]);

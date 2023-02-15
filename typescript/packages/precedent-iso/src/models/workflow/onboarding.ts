import type * as T from "./task";

export type OnboardingStage =
  | CreateAccount
  | CheckInsuranceCoverage
  | SubmitRecords
  | CommitmentToCare;

export type OnboardingStageType = OnboardingStage["type"];

type Unarray<T> = T extends Array<infer U> ? U : T;

export type OnboardingTask = Unarray<OnboardingStage["blockingTasks"]>;

interface BaseStage {
  id: string;
}

export interface CreateAccount extends BaseStage {
  type: "create_account";
  blockingTasks: T.ScheduleTask[];
}

export interface CheckInsuranceCoverage extends BaseStage {
  type: "check_insurance_coverage";
  blockingTasks: T.FormTask[];
}

export interface SubmitRecords extends BaseStage {
  type: "submit_records";
  blockingTasks: T.FormTask[];
}

export interface CommitmentToCare extends BaseStage {
  type: "commitment_to_care";
  blockingTasks: T.SignatureTask[];
}

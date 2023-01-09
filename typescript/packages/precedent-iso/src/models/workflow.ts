import type { FormSortConfig } from "./form-sort-config";

export type Stage =
  | CreateAccount
  | CheckInsuranceCoverage
  | SubmitRecords
  | CommitmentToCare;

export type StageType = Stage["type"];

export interface CreateAccount {
  type: "create_account";
  blockingTasks: [];
}

export interface CheckInsuranceCoverage {
  type: "check_insurance_coverage";
  blockingTasks: [FormBlockingTask];
}

export interface SubmitRecords {
  type: "submit_records";
  blockingTasks: [FormBlockingTask];
}

export interface CommitmentToCare {
  type: "commitment_to_care";
  blockingTasks: [SignatureTask];
}

export interface FormBlockingTask {
  type: "form";
  config: FormSortConfig;
}

export interface SignatureTask {
  type: "signature";
}

export interface WorkflowModel {
  id: string;
  userId: string;
  childId: string;
  slug: string;
  version: string;
  stages: Stage[];
  currentStageIndex: number;
}

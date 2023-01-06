import type { FormSortConfig } from "./form-sort-config";

export type Stage =
  | CreateAccount
  | CheckInsuranceCoverage
  | SubmitRecords
  | CommitmentToCare;

export type StageType = Stage["type"];

interface CreateAccount {
  type: "create_account";
  blockingTasks: [];
}

interface CheckInsuranceCoverage {
  type: "check_insurance_coverage";
  blockingTasks: [FormBlockingTask];
}

interface SubmitRecords {
  type: "submit_records";
  blockingTasks: [FormBlockingTask];
}

interface CommitmentToCare {
  type: "commitment_to_care";
  blockingTasks: [SignatureTask];
}

interface FormBlockingTask {
  type: "form";
  config: FormSortConfig;
}
interface SignatureTask {
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

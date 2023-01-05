export type Stage =
  | CreateAccount
  | CheckInsuranceCoverage
  | SubmitRecords
  | CommitmentToCare;

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
  type: "form_blocking";
  formId: string;
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

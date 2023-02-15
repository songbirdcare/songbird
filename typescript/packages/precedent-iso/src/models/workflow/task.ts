interface BaseTask {
  id: string;
  status: "pending" | "complete";
}

export interface ScheduleTask extends BaseTask {
  type: "schedule";
}

export interface FormTask extends BaseTask {
  type: "form";
  slug: "check_insurance_coverage" | "submit_records";
}

export interface SignatureTask extends BaseTask {
  type: "signature";
}

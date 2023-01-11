import type { FormSortConfig } from "./form-sort-config";

export type Stage =
  | CreateAccount
  | CheckInsuranceCoverage
  | SubmitRecords
  | CommitmentToCare;

export type StageType = Stage["type"];

export interface CreateAccount {
  type: "create_account";
  blockingTasks: ScheduleTask[];
}

export interface CheckInsuranceCoverage {
  type: "check_insurance_coverage";
  blockingTasks: FormTask[];
}

export interface SubmitRecords {
  type: "submit_records";
  blockingTasks: FormTask[];
}

export interface CommitmentToCare {
  type: "commitment_to_care";
  blockingTasks: SignatureTask[];
}

export interface ScheduleTask {
  type: "schedule";
}

export interface FormTask {
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

export class WorkflowWrapper {
  #hasChanged: boolean;
  constructor(private readonly wf: WorkflowModel) {
    this.#hasChanged = false;
  }

  get workflow(): WorkflowModel {
    return this.wf;
  }

  get hasChanged(): boolean {
    return this.#hasChanged;
  }

  get currentStage(): Stage {
    const { stages, currentStageIndex } = this.wf;
    const stage = stages[currentStageIndex];
    if (stage === undefined) {
      throw new Error("invalid state");
    }
    return stage;
  }

  advance(): void {
    const stage = this.currentStage;
    stage.blockingTasks.shift();
    if (stage.blockingTasks.length === 0) {
      this.wf.currentStageIndex++;
    }

    this.#hasChanged = true;
  }

  static getLatestBlockingTask<S extends Stage>({
    blockingTasks,
  }: S): S["blockingTasks"][number] {
    const [task] = blockingTasks;
    if (task === undefined) {
      throw new Error("latest blocking task is undefined");
    }
    return task;
  }
}

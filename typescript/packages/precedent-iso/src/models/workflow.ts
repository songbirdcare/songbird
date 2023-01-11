import type { FormSortConfig } from "./form-sort-config";

export type Stage =
  | CreateAccount
  | CheckInsuranceCoverage
  | SubmitRecords
  | CommitmentToCare;

export type StageType = Stage["type"];

type Unarray<T> = T extends Array<infer U> ? U : T;

export type Task = Unarray<Stage["blockingTasks"]>;

interface BaseTask {
  id: string;
}

interface BaseStage {
  id: string;
}

export interface CreateAccount extends BaseStage {
  type: "create_account";
  blockingTasks: ScheduleTask[];
}

export interface CheckInsuranceCoverage extends BaseStage {
  type: "check_insurance_coverage";
  blockingTasks: FormTask[];
}

export interface SubmitRecords extends BaseStage {
  type: "submit_records";
  blockingTasks: FormTask[];
}

export interface CommitmentToCare extends BaseStage {
  type: "commitment_to_care";
  blockingTasks: SignatureTask[];
}

export interface ScheduleTask extends BaseTask {
  type: "schedule";
}

export interface FormTask extends BaseTask {
  type: "form";
  config: FormSortConfig;
}

export interface SignatureTask extends BaseTask {
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
  status: "pending" | "completed";
}

export class WorkflowWrapper {
  #hasChanged: boolean;
  #copy: WorkflowModel;
  constructor(original: WorkflowModel) {
    this.#copy = JSON.parse(JSON.stringify(original)) as WorkflowModel;

    this.#hasChanged = false;
  }

  get workflow(): WorkflowModel {
    return this.#copy;
  }

  get hasChanged(): boolean {
    return this.#hasChanged;
  }

  get isCompleted(): boolean {
    return this.#copy.status === "completed";
  }

  get currentStage(): Stage {
    const { stages, currentStageIndex } = this.#copy;
    const stage = stages[currentStageIndex];
    if (stage === undefined) {
      throw new Error("invalid state");
    }
    return stage;
  }

  fromIds(stageId: string, taskId: string) {
    const stage = this.#copy.stages.find((s) => s.id === stageId);
    if (!stage) {
      throw new Error("stage does not exist");
    }
    const task = (stage.blockingTasks as Task[]).find(
      (task) => task.id === taskId
    );

    return {
      stage,
      task,
    };
  }

  advance(): void {
    const stage = this.currentStage;
    this.#hasChanged = true;
    console.log("wtf");

    debugger;
    stage.blockingTasks.shift();
    if (stage.blockingTasks.length === 0) {
      if (this.#copy.currentStageIndex === this.#copy.stages.length - 1) {
        this.#copy.status = "completed";
      } else {
        this.#copy.currentStageIndex++;
      }
    }
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

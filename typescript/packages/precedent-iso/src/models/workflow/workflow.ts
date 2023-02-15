import { z } from "zod";

export const ZWorkflowSlug = z.enum(["onboarding", "care_plan", "care_team"]);
export type WorkflowSlug = z.infer<typeof ZWorkflowSlug>;

export type OnboardingStage =
  | CreateAccount
  | CheckInsuranceCoverage
  | SubmitRecords
  | CommitmentToCare;

export type OnboardingStageType = OnboardingStage["type"];

type Unarray<T> = T extends Array<infer U> ? U : T;

export type OnboardingTask = Unarray<OnboardingStage["blockingTasks"]>;

interface BaseTask {
  id: string;
  status: "pending" | "complete";
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
  slug: "check_insurance_coverage" | "submit_records";
}

export interface SignatureTask extends BaseTask {
  type: "signature";
}

export interface WorkflowModel {
  id: string;
  userId: string;
  childId: string;
  slug: WorkflowSlug;
  version: 1;
  stages: OnboardingStage[];
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

  get currentStage(): OnboardingStage {
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
    const task = (stage.blockingTasks as OnboardingTask[]).find(
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

    const firstPendingTaskIndex = (
      stage.blockingTasks as OnboardingTask[]
    ).findIndex((t) => t.status === "pending");

    if (firstPendingTaskIndex === -1) {
      throw new Error("no pending tasks available");
    }

    const task = stage.blockingTasks[firstPendingTaskIndex];
    if (task === undefined) {
      throw new Error("illegal state");
    }

    task.status = "complete";

    const isLastTask = firstPendingTaskIndex === stage.blockingTasks.length - 1;
    if (isLastTask && this.isLastStage) {
      this.#copy.status = "completed";
    } else if (isLastTask) {
      this.#copy.currentStageIndex++;
    }
  }

  get isLastStage() {
    return this.#copy.currentStageIndex === this.#copy.stages.length - 1;
  }

  static getLatestBlockingTask<S extends OnboardingStage>({
    blockingTasks,
  }: S): S["blockingTasks"][number] {
    const [task] = blockingTasks;
    if (task === undefined) {
      throw new Error("latest blocking task is undefined");
    }
    return task;
  }
}

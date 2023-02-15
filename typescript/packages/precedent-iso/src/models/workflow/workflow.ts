import { z } from "zod";

import type { OnboardingTask } from "./onboarding";
import type { Stage, StagesWithSlug } from "./stages";

export const ZWorkflowSlug = z.enum(["onboarding", "care_plan", "care_team"]);
export type WorkflowSlug = z.infer<typeof ZWorkflowSlug>;

export interface WorkflowModel {
  id: string;
  userId: string;
  childId: string;
  slug: WorkflowSlug;
  version: 1;
  stages: Stage[];
  stagesWithSlug: StagesWithSlug;
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

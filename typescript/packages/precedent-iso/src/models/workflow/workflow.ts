import { z } from "zod";

import type { BlockingTask, Stage } from "./stages";

export const ALL_WORKFLOW_SLUGS = [
  "onboarding",
  "care_plan",
  "care_team",
] as const;

export const ZWorkflowSlug = z.enum(ALL_WORKFLOW_SLUGS);
export type WorkflowSlug = z.infer<typeof ZWorkflowSlug>;

export interface WorkflowModel {
  id: string;
  childId: string;
  slug: WorkflowSlug;
  version: 1;
  stages: Stage[];
  currentStageIndex: number;
  status: "pending" | "completed";
}

type Change =
  | {
      type: "task_complete";
      taskId: string;
    }
  | {
      type: "workflow_complete";
    }
  | {
      type: "stage_complete";
      stageId: string;
      stageType: Stage["type"];
    };

export class WorkflowWrapper {
  #hasChanged: boolean;
  changes: Change[] = [];
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
    const task = (stage.blockingTasks as BlockingTask[]).find(
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

    const firstPendingTaskIndex = stage.blockingTasks.findIndex(
      (t) => t.status === "pending"
    );

    if (firstPendingTaskIndex === -1) {
      throw new Error("no pending tasks available");
    }

    const task = stage.blockingTasks[firstPendingTaskIndex];
    if (task === undefined) {
      throw new Error("illegal state");
    }

    this.changes.push({
      type: "task_complete",
      taskId: task.id,
    });

    task.status = "complete";

    const isLastTask = firstPendingTaskIndex === stage.blockingTasks.length - 1;

    if (isLastTask && this.isLastStage) {
      this.changes.push({
        type: "workflow_complete",
      });

      this.changes.push({
        type: "stage_complete",
        stageId: stage.id,
        stageType: stage.type,
      });
      this.#copy.status = "completed";
    } else if (isLastTask) {
      this.#copy.currentStageIndex++;
      this.changes.push({
        type: "stage_complete",
        stageId: stage.id,
        stageType: stage.type,
      });
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

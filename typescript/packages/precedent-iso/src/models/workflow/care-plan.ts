import { z } from "zod";

import * as T from "./task";

export type CarePlanStageType = CarePlanStage["type"];

export type CarePlanTask = CarePlanStage["blockingTasks"][number];

export const ZCompleteAssessment = z.object({
  id: z.string(),
  type: z.literal("complete_assessment"),
  blockingTasks: T.ZDummyTask.array(),
});

export type CompleteAssessment = z.infer<typeof ZCompleteAssessment>;

export const ZReviewCarePlan = z.object({
  id: z.string(),
  type: z.literal("review_care_plan"),
  blockingTasks: T.ZDummyTask.array(),
});

export type ReviewCarePlan = z.infer<typeof ZReviewCarePlan>;

export const ZCarePlanStage = z.discriminatedUnion("type", [
  ZCompleteAssessment,
  ZReviewCarePlan,
]);

export type CarePlanStage = z.infer<typeof ZCarePlanStage>;

export const ZCarePlanStageType = z.union([
  z.literal("complete_assessment"),
  z.literal("review_care_plan"),
]);

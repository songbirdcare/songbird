import { z } from "zod";

import { CarePlanTask, ZCarePlanStage } from "./care-plan";
import { CareTeamTask, ZCareTeamStage } from "./care-team";
import { OnboardingTask, ZOnboardingStage } from "./onboarding";

const ZOnboardingWithSlug = z.object({
  slug: z.literal("onboarding"),
  stages: ZOnboardingStage.array(),
});

const ZCarePlanWithSlug = z.object({
  slug: z.literal("care_plan"),
  stages: ZCarePlanStage.array(),
});

const ZCareTeamWithSlug = z.object({
  slug: z.literal("care_team"),
  stages: ZCareTeamStage.array(),
});

export const ZStagesWithSlug = z.discriminatedUnion("slug", [
  ZOnboardingWithSlug,
  ZCarePlanWithSlug,
  ZCareTeamWithSlug,
]);

export type StagesWithSlug = z.infer<typeof ZStagesWithSlug>;
export type Stage = StagesWithSlug["stages"][number];
export type BlockingTask = CarePlanTask | CareTeamTask | OnboardingTask;

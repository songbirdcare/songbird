import type { CarePlanStage, CarePlanTask } from "./care-plan";
import type { CareTeamStage, CareTeamTask } from "./care-team";
import type { OnboardingStage, OnboardingTask } from "./onboarding";

export type Stage = OnboardingStage | CarePlanStage | CareTeamStage;

export type StagesWithSlug =
  | {
      slug: "onboarding";
      stages: OnboardingStage[];
    }
  | {
      slug: "care_plan";
      stages: CarePlanStage[];
    }
  | {
      slug: "care_team";
      stages: CareTeamStage[];
    };

export type BlockingTask = CarePlanTask | CareTeamTask | OnboardingTask;

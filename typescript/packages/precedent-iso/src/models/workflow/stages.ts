import type { CarePlanStage } from "./care-plan";
import type { CareTeamStage } from "./care-team";
import type { OnboardingStage } from "./onboarding";

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

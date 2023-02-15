import type { OnboardingStage } from "@songbird/precedent-iso";

export interface StageWithIndex {
  stage: OnboardingStage;
  index: number;
}
export interface StageDisplayInformation {
  title: string;
  byline: string;
  asset: {
    path: string;
    alt: string;
    width: number;
    height: number;
  };
}

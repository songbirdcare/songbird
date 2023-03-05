import type { Stage } from "@songbird/precedent-iso";

export interface StageWithIndex {
  stage: Stage;
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

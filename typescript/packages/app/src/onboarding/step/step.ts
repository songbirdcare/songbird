export type StepStatus = "disabled" | "in-progress";

export interface Step {
  title: string;
  byline: string;
  status: StepStatus;
  asset: {
    path: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface Step {
  title: string;
  byline: string;
  status: "disabled" | "in-progress" | "complete";
}

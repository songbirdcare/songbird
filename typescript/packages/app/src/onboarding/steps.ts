import type { Step } from "./step/step";

export const STEPS: Step[] = [
  {
    title: "Check insurance coverage",
    byline:
      "If you’d like to know your insurance coverage sooner, just submit additional info here.",
    status: "in-progress",
    asset: {
      path: "/onboarding/hands.svg",
      width: 64,
      height: 60,
      alt: "Insurance coverage",
    },
  },
  {
    title: "Submit records",
    byline:
      "With a few medical records, we’ll be able to begin the process of insurance covering care.",
    status: "disabled",

    asset: {
      path: "/onboarding/flower-pot.svg",
      width: 33,
      height: 42,
      alt: "Submit records",
    },
  },
  {
    title: "Meet your care team",
    byline: "We’ll find time for you to meet your family’s care team",
    status: "disabled",
    asset: {
      path: "/onboarding/heart.svg",
      width: 39,
      height: 31,
      alt: "Care team",
    },
  },
];

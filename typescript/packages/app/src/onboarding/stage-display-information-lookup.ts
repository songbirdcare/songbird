import type { StageType } from "@songbird/precedent-iso";

import type { StageDisplayInformation } from "./stage/stage-display-information";

export const STAGE_DISPLAY_INFO_LOOKUP: Record<
  StageType,
  StageDisplayInformation
> = {
  create_account: {
    title: "Check insurance coverage",
    byline:
      "If you’d like to know your insurance coverage sooner, just submit additional info here.",
    asset: {
      path: "/onboarding/hands.svg",
      width: 64,
      height: 60,
      alt: "Insurance coverage",
    },
  },
  check_insurance_coverage: {
    title: "Submit records",
    byline:
      "With a few medical records, we’ll be able to begin the process of insurance covering care.",

    asset: {
      path: "/onboarding/flower-pot.svg",
      width: 33,
      height: 42,
      alt: "Submit records",
    },
  },
  submit_records: {
    title: "Meet your care team",
    byline: "We’ll find time for you to meet your family’s care team",
    asset: {
      path: "/onboarding/heart.svg",
      width: 39,
      height: 31,
      alt: "Care team",
    },
  },
  commitment_to_care: {
    title: "Complete our Commitment to Care",
    byline:
      "Understand and read our commitment to care, after which you’ll meet your Care Team",
    asset: {
      path: "/onboarding/heart.svg",
      width: 39,
      height: 31,
      alt: "Commitment to care",
    },
  },
};

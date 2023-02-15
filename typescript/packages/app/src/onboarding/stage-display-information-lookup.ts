import type { OnboardingStageType } from "@songbird/precedent-iso";

import type { StageDisplayInformation } from "./stage/stage-display-information";

export const STAGE_DISPLAY_INFO_LOOKUP: Record<
  OnboardingStageType,
  StageDisplayInformation
> = {
  create_account: {
    title: "Book free consultation",
    byline:
      "Consult call with our Care Team to help your family start insurance-covered therapy as quickly as possible.",
    asset: {
      path: "/onboarding/calendar.svg",
      width: 48,
      height: 42,
      alt: "Create account and book time",
    },
  },
  check_insurance_coverage: {
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
  submit_records: {
    title: "Submit records",
    byline:
      "With medical records & your availability, we’ll be able to begin the process of insurance covering care.",
    asset: {
      path: "/onboarding/flower-pot.svg",
      width: 33,
      height: 42,
      alt: "Submit records",
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
      alt: "Care team",
    },
  },
};

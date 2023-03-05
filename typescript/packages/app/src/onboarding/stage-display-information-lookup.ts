import type { Stage } from "@songbird/precedent-iso";

import type { StageDisplayInformation } from "./stage/stage-display-information";

export const STAGE_DISPLAY_INFO_LOOKUP: Record<
  Stage["type"],
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
      alt: "Commitment to care",
    },
  },
  therapist_matching: {
    title: "Therapist matching",
    byline:
      "We’ll let you know as soon as we find the best therapist for your family. We’re working hard.",
    asset: {
      path: "/onboarding/hands.svg",
      width: 64,
      height: 60,
      alt: "Insurance coverage",
    },
  },
  complete_assessment: {
    title: "Complete assessment",
    byline:
      "Meet with a member of your Songbird Care Team to collaborate on your child’s care plan.",
    asset: {
      path: "/onboarding/calendar.svg",
      width: 48,
      height: 42,
      alt: "Create account and book time",
    },
  },
  review_care_plan: {
    title: "Review your child’s care plan",
    byline:
      "You’ll review your child’s care plan with your Songbird Care Team.",
    asset: {
      path: "/onboarding/heart.svg",
      width: 39,
      height: 31,
      alt: "Child care plan",
    },
  },
  insurance_approval: {
    title: "Insurance approval",
    byline:
      "We’ll let you know as soon as insurance approves your family’s ongoing care.",
    asset: {
      path: "/onboarding/flag.svg",
      width: 65,
      height: 59,
      alt: "Insurance approval",
    },
  },
  ongoing_care: {
    title: "Ongoing care",
    byline:
      "You’ll have your first day of in-home care with your Songbird Care Team.",
    asset: {
      path: "/onboarding/blocks.svg",
      width: 37,
      height: 42,
      alt: "Ongoing care",
    },
  },
};

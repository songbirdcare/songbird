export class InsuranceData {
  static INVALID_INSURANCES = new Set([
    "aetna_better_health",
    "medicaid",
    "kaiser",
    "blue_cross_community_health_plan",
    "meridian",
    "countycare",
    "unitedhealth_community_plan",
    "medicare",
    "tricare",
    "beacon",
    "other",
    "molina",
    "no_insurance",
    "texas_childrens",
    "superior",
    "amerigroup",
    "alameda_alliance",
  ]);

  static INSURANCE_PROVIDERS = [
    {
      uuid: "0a9cccd8-4da8-4eeb-9ccf-b3f466d099de",
      label: "Aetna",
      slug: "aetna",
    },
    {
      uuid: "bfe82135-e112-4af9-bc80-004a4831ba79",
      label: "Aetna Better Health",
      slug: "aetna_better_health",
    },
    {
      uuid: "ccdeb336-b39e-4261-a03f-f888988fa495",
      label: "Amerigroup",
      slug: "amerigroup",
    },
    {
      uuid: "5fcb292a-6ae6-4410-8b6f-be9de6339aa9",
      label: "Anthem",
      slug: "anthem",
    },
    {
      uuid: "0c11c2d6-dad7-4680-b002-a439cfbf8c8d",
      label: "Anthem Medi-Cal",
      slug: "anthem_medi_cal",
    },
    {
      uuid: "aa9b38cb-71d8-4804-9810-61354f772112",
      label: "Alameda Alliance",
      slug: "alameda_alliance",
    },
    {
      uuid: "94c7c8d8-68e4-4400-b88a-2cef418015d7",
      label: "Beacon",
      slug: "beacon",
    },
    {
      uuid: "298f3bb0-5e79-44f0-9f49-5ab6e0603edf",
      label: "Blue Shield of California",
      slug: "blue_shield_of_california",
    },
    {
      uuid: "618d7bb6-8f7d-4a8e-bf36-4f97b77540cb",
      label: "Blue Cross Blue Shield",
      slug: "blue_cross_blue_shield",
    },
    {
      uuid: "5383fd1b-c379-4496-9e49-0c7c97076eec",
      label: "Blue Cross Community Health Plan",
      slug: "blue_cross_community_health_plan",
    },
    {
      uuid: "121b1ba5-2304-486a-b6a1-d30e36770299",
      label: "Centene",
      slug: "centene",
    },
    {
      uuid: "7557a7b2-16f2-42cb-9056-f5491280ffe3",
      label: "Cigna",
      slug: "cigna",
    },
    {
      uuid: "43364754-f34c-431b-8ae7-4012801c8329",
      label: "ComPsych",
      slug: "compsych",
    },
    {
      uuid: "d2bcae4f-7ae2-4f3e-99ea-95fce6ac4207",
      label: "Contra Costa Health Plan",
      slug: "contra_costa_health_plan",
    },
    {
      uuid: "6e066374-d79f-4d5f-a3aa-aebdaa1eb94b",
      label: "CountyCare",
      slug: "countycare",
    },
    {
      uuid: "33742a19-3246-488d-8b92-d35056d584af",
      label: "Health Net",
      slug: "health_net",
    },
    {
      uuid: "93fd29ea-7009-44df-90b7-b3380ffa01d5",
      label: "Humana",
      slug: "humana",
    },
    {
      uuid: "f38fc6eb-13e4-45bb-b404-03fce157bd28",
      label: "Kaiser",
      slug: "kaiser",
    },
    {
      uuid: "71417ad3-a07a-46be-8641-68d7c9e17ef7",
      label: "Magellan",
      slug: "magellan",
    },
    {
      uuid: "26ddb7ae-fb2c-4a00-83ec-d6e1de0a54ac",
      label: "MHN",
      slug: "mhn",
    },
    {
      uuid: "190d4286-30d9-44c0-a2c0-a51ce9e095c1",
      label: "Medicaid",
      slug: "medicaid",
    },
    {
      uuid: "025ef49d-eac6-44cc-b5c9-0a6fccfdf15f",
      label: "Medi-Cal",
      slug: "medi_cal",
    },
    {
      uuid: "e42e3d96-279c-4d7a-bc4e-e204016ed6ed",
      label: "Medicare ",
      slug: "medicare",
    },
    {
      uuid: "8378ba4b-de28-452f-a1cb-e5ccbf757119",
      label: "Meridian",
      slug: "meridian",
    },
    {
      uuid: "0806dfa5-482e-4b40-ba83-23062b34d3ab",
      label: "Meritain Health",
      slug: "meritain_health",
    },
    {
      uuid: "b08cc979-a792-4439-b776-fe9bb2acb3ff",
      label: "Molina",
      slug: "molina",
    },
    {
      uuid: "67d40b00-6a10-454c-9624-f1ac7d297b9f",
      label: "MultiPlan",
      slug: "multiplan",
    },
    {
      uuid: "e1e615e0-4e22-4021-b003-240d5649219e",
      label: "Optum",
      slug: "optum",
    },
    {
      uuid: "42c3b660-3415-4190-b5d1-c0629d4751a4",
      label: "Superior",
      slug: "superior",
    },
    {
      uuid: "89cd7d97-5bf3-42fb-a85f-1db7c2b39e60",
      label: "Texas Children's",
      slug: "texas_childrens",
    },
    {
      uuid: "7cf32760-f4cd-4bb5-8f89-49cde41ecd7a",
      label: "Tricare",
      slug: "tricare",
    },
    {
      uuid: "80c57a28-9a7d-40e5-9e7a-d8d34887f751",
      label: "UnitedHealth",
      slug: "unitedhealth",
    },
    {
      uuid: "79ba2fac-0ccc-4f8e-98b0-ab987c0f3b35",
      label: "UnitedHealthcare Community Plan",
      slug: "unitedhealth_community_plan",
    },
    {
      uuid: "4a703e6c-3b95-4d00-9fc5-1a5ae65003c9",
      label: "No insurance",
      slug: "no_insurance",
    },
    {
      uuid: "817c74c2-86a6-4e46-add6-ddf58a6e3dc3",
      label: "Other ",
      slug: "other",
    },
  ] as const;

  static VALID_INSURANCE_PROVIDERS: InsuranceProvider[] =
    this.INSURANCE_PROVIDERS.filter(
      (p) => !InsuranceData.INVALID_INSURANCES.has(p.slug)
    );
}

export type InsuranceProvider =
  (typeof InsuranceData.INSURANCE_PROVIDERS)[number];

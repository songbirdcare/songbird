export class RegionData {
  static REGIONS = ["Bay Area", "Chicago", "Houston", "Sacramento"] as const;
  static SUBREGIONS = [
    "chi - city",
    "chi - evanston",
    "chi - naperville",
    "chi - oakbrook",
    "chi - orlandpark",
    "chi - schaumburg",
    "hou - central",
    "hou - north",
    "hou - west",
    "sac - central",
    "sac - folsom",
    "sac - rocklin",
    "sf - antioch",
    "sf - fremont",
    "sf - mountainview",
    "sf - oakland",
    "sf - pleasanton",
    "sf - sanjose",
    "sf - walnutcreek",
  ] as const;
}

export type Region = (typeof RegionData.REGIONS)[number];
export type SubRegion = (typeof RegionData.SUBREGIONS)[number];

import type { TsdCp010AuthorityKey } from "./source-saturation";

export const TSD_CP010_QL_ALLOCATION = Object.freeze([
  { qlId: "TSD-QL-115", authorityKey: "finishDistanceLeadState" },
  { qlId: "TSD-QL-116", authorityKey: "finishTimeLeadState" },
  { qlId: "TSD-QL-117", authorityKey: "raceSpeedRatioState" },
  { qlId: "TSD-QL-118", authorityKey: "raceLengthFromLeadEvidence" },
  { qlId: "TSD-QL-119", authorityKey: "deadHeatHandicapState" },
  { qlId: "TSD-QL-120", authorityKey: "leadConversionState" },
  { qlId: "TSD-QL-121", authorityKey: "transitiveRaceComparison" },
  { qlId: "TSD-QL-122", authorityKey: "multiOutcomeRaceComparison" },
  { qlId: "TSD-QL-123", authorityKey: "changedRaceOutcomeState" },
  { qlId: "TSD-QL-124", authorityKey: "runnerStateFromTwoRaceOutcomes" },
] as const satisfies readonly { qlId: string; authorityKey: TsdCp010AuthorityKey }[]);

export const TSD_CP010_PERMANENT_QL_IDS = Object.freeze(TSD_CP010_QL_ALLOCATION.map((x) => x.qlId));
export type TsdCp010QlId = (typeof TSD_CP010_QL_ALLOCATION)[number]["qlId"];
export const TSD_CP010_NEXT_PERMANENT_QL = "TSD-QL-125" as const;
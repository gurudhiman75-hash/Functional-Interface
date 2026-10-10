import type { TsdCp011AuthorityKey } from "./source-saturation";

export const TSD_CP011_QL_ALLOCATION_STATUS = "PERMANENT_FROZEN" as const;

export const TSD_CP011_QL_ALLOCATION = Object.freeze([
  Object.freeze({ qlId: "TSD-QL-125", authorityKey: "movingSurfaceTravelState", learnerContract: "Solve direct or inverse travel state on an escalator, moving walkway or conveyor using signed net surface speed." }),
  Object.freeze({ qlId: "TSD-QL-126", authorityKey: "stationaryStepCountState", learnerContract: "Recover stationary-equivalent escalator steps, walked steps, person step rate or escalator step rate from one moving-escalator state." }),
  Object.freeze({ qlId: "TSD-QL-127", authorityKey: "dualEscalatorObservationState", learnerContract: "Infer stopped-escalator time or person-to-escalator rate relation from paired up/down observations." }),
  Object.freeze({ qlId: "TSD-QL-128", authorityKey: "movingSurfaceStateComparison", learnerContract: "Relate stopped walking, standing-carried and walking-on-moving-surface times, including inverse and time-saved forms." }),
  Object.freeze({ qlId: "TSD-QL-129", authorityKey: "wheelRollState", learnerContract: "Translate rolling distance, revolutions and circumference, including radius/diameter when pi is declared." }),
  Object.freeze({ qlId: "TSD-QL-130", authorityKey: "wheelRateTranslationState", learnerContract: "Translate wheel RPM to linear speed, distance or time and invert the relation." }),
  Object.freeze({ qlId: "TSD-QL-131", authorityKey: "twoWheelComparisonState", learnerContract: "Compare two wheel revolution counts or ratios under a shared linear-distance condition." }),
] as const satisfies readonly Readonly<{ qlId: string; authorityKey: TsdCp011AuthorityKey; learnerContract: string }>[]);

export type TsdCp011QlId = (typeof TSD_CP011_QL_ALLOCATION)[number]["qlId"];
export const TSD_CP011_PERMANENT_QL_IDS = Object.freeze(TSD_CP011_QL_ALLOCATION.map((x) => x.qlId));
export const TSD_CP011_NEXT_PERMANENT_QL = "TSD-QL-132" as const;

// Compatibility aliases retained while CP012 is still a stacked review branch.
export const TSD_CP011_PROVISIONAL_QL_IDS = TSD_CP011_PERMANENT_QL_IDS;
export const TSD_CP011_NEXT_QL_ID = TSD_CP011_NEXT_PERMANENT_QL;

export const TSD_CP011_QL_LIFECYCLE = Object.freeze({
  allocationStatus: TSD_CP011_QL_ALLOCATION_STATUS,
  productOwnerApproved: true,
  frozen: true,
  productionRegistered: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const);

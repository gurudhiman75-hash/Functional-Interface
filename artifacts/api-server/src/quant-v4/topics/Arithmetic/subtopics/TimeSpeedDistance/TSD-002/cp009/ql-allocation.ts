import { TSD_CP009_EXECUTABLE_AUTHORITIES } from "./executable-generator";
import type { TsdCp009AuthorityKey } from "./executable-types";

export const TSD_CP009_QL_ALLOCATION = Object.freeze([
  Object.freeze({ qlId: "TSD-QL-104" as const, authorityKey: "mediumAdjustedGroundSpeed" as const }),
  Object.freeze({ qlId: "TSD-QL-105" as const, authorityKey: "mediumComponentsFromAssistedOpposedSpeeds" as const }),
  Object.freeze({ qlId: "TSD-QL-106" as const, authorityKey: "mediumLegTravelState" as const }),
  Object.freeze({ qlId: "TSD-QL-107" as const, authorityKey: "pairedEqualDistanceMediumState" as const }),
  Object.freeze({ qlId: "TSD-QL-108" as const, authorityKey: "roundTripMediumState" as const }),
  Object.freeze({ qlId: "TSD-QL-109" as const, authorityKey: "mixedUnequalLegMediumState" as const }),
  Object.freeze({ qlId: "TSD-QL-110" as const, authorityKey: "equalTimeMediumDistanceSpread" as const }),
  Object.freeze({ qlId: "TSD-QL-111" as const, authorityKey: "mediumShiftedMeetingPoint" as const }),
  Object.freeze({ qlId: "TSD-QL-112" as const, authorityKey: "passiveFloatingObjectState" as const }),
  Object.freeze({ qlId: "TSD-QL-113" as const, authorityKey: "floatingObjectRecoveryState" as const }),
  Object.freeze({ qlId: "TSD-QL-114" as const, authorityKey: "changingMediumState" as const }),
] satisfies readonly Readonly<{ qlId: `TSD-QL-${string}`; authorityKey: TsdCp009AuthorityKey }>[]);

export const TSD_CP009_PERMANENT_QL_IDS = Object.freeze(TSD_CP009_QL_ALLOCATION.map((entry) => entry.qlId));
export const TSD_CP009_NEXT_PERMANENT_QL = "TSD-QL-115" as const;

if (JSON.stringify(TSD_CP009_QL_ALLOCATION.map((entry) => entry.authorityKey)) !== JSON.stringify(TSD_CP009_EXECUTABLE_AUTHORITIES)) {
  throw new Error("TSD-CP-009 QL allocation authority order differs from executable authority order");
}

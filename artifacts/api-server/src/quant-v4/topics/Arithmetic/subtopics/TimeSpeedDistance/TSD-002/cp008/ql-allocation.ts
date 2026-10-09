import { TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES } from "./final-ownership-candidate";

export const TSD_CP008_PERMANENT_QL_ALLOCATIONS = Object.freeze([
  Object.freeze({ permanentQlId: "TSD-QL-095" as const, authorityKey: "oppositeDirectionTrainCrossingTime" as const }),
  Object.freeze({ permanentQlId: "TSD-QL-096" as const, authorityKey: "sameDirectionTrainCrossingTime" as const }),
  Object.freeze({ permanentQlId: "TSD-QL-097" as const, authorityKey: "relativeSpeedFromTrainCrossing" as const }),
  Object.freeze({ permanentQlId: "TSD-QL-098" as const, authorityKey: "trainLengthFromTrainCrossingEvidence" as const }),
  Object.freeze({ permanentQlId: "TSD-QL-099" as const, authorityKey: "trainSpeedFromTrainCrossingEvidence" as const }),
  Object.freeze({ permanentQlId: "TSD-QL-100" as const, authorityKey: "movingObserverTrainCrossingTime" as const }),
  Object.freeze({ permanentQlId: "TSD-QL-101" as const, authorityKey: "trainObserverStateFromCrossingTimes" as const }),
  Object.freeze({ permanentQlId: "TSD-QL-102" as const, authorityKey: "sharedFixedObjectTwoTrainEvidence" as const }),
  Object.freeze({ permanentQlId: "TSD-QL-103" as const, authorityKey: "fullContainmentOverlapDuration" as const }),
]);

export const TSD_CP008_PERMANENT_QL_IDS = Object.freeze(TSD_CP008_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.permanentQlId));
export const TSD_CP008_NEXT_PERMANENT_QL_ID = "TSD-QL-104" as const;

const finalKeys = TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey);
const allocatedKeys = TSD_CP008_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.authorityKey);
if (JSON.stringify(finalKeys) !== JSON.stringify(allocatedKeys)) throw new Error("CP008 QL allocation order differs from source-saturated authority order");
if (new Set(TSD_CP008_PERMANENT_QL_IDS).size !== 9) throw new Error("CP008 permanent QL IDs are not unique");

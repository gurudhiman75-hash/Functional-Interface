import { TSD_CP001_FROZEN_AUTHORITIES } from "./cp001/freeze-registry";
import { proportionRepresentation } from "./cp001/proportion-representation";
import { generateCp001ReviewRows } from "./cp001/runtime";
import type { TsdCp001GeneratedQuestion } from "./cp001/runtime-types";
import { generateFinalPoolSupplements } from "./cp002/final-pool-supplements";
import { generateP1DiversityBatch02Supplements } from "./cp002/p1-diversity-batch-02-supplements";
import { generateP1DiversityBatch03Supplements } from "./cp002/p1-diversity-batch-03-supplements";
import { generateP1Batch03RoundTripFourHourSupplement } from "./cp002/p1-diversity-batch-03-roundtrip-supplement";
import { generateCp002ReviewRows } from "./cp002/runtime";
import type { TsdCp002GeneratedQuestion } from "./cp002/types";
import {
  TSD_FINAL_LEARNER_AUTHORITIES,
  finalAuthorityByKey,
  type TsdFinalAuthority,
  type TsdFinalCheckpoint,
} from "./final-authority-registry";

export interface TsdFinalReviewRecord {
  readonly finalAuthorityKey: string;
  readonly finalCheckpointId: TsdFinalCheckpoint;
  readonly permanentQlId: null;
  readonly legacyReviewQlId: `TSD-QL-${string}`;
  readonly finalRepresentation: string;
  readonly questionLanguageId: string;
  readonly sourceCheckpointId: TsdFinalCheckpoint;
  readonly sourceQuestion: TsdCp001GeneratedQuestion | TsdCp002GeneratedQuestion;
  readonly reviewStatus: "EDITORIAL_REVIEW_REQUIRED";
  readonly englishFreezeStatus: "UNFROZEN";
  readonly publiclyPublishable: false;
}

function cp001LegacyQl(mode: TsdCp001GeneratedQuestion["solveMode"]): `TSD-QL-${string}` {
  const authority = TSD_CP001_FROZEN_AUTHORITIES.find((entry) => entry.solveMode === mode);
  if (!authority) throw new Error(`No legacy CP-001 review QL for ${mode}`);
  return authority.permanentQlId;
}

function cp001AuthorityKey(row: TsdCp001GeneratedQuestion): string {
  if (row.solveMode === "distanceByProportion") return "referenceTripDistanceAtChangedConditions";
  if (row.solveMode === "timeByProportion") return "referenceTripTimeAtChangedConditions";
  return row.solveMode;
}

function cp002AuthorityKey(row: TsdCp002GeneratedQuestion): string {
  switch (row.solveMode) {
    case "totalDistanceFromAverageAndTime":
      return "distanceFromSpeedAndTime";
    case "unknownSegmentShareFromAverage":
      return row.authoritySubmode === "DISTANCE_SHARE"
        ? "unknownDistanceShareFromAverageSpeed"
        : "unknownTimeShareFromAverageSpeed";
    case "segmentRatioFromAverageAndSpeeds":
      return row.authoritySubmode === "DISTANCE_RATIO"
        ? "distanceRatioFromAverageAndSpeeds"
        : "timeRatioFromAverageAndSpeeds";
    case "roundTripTimeFromOneWayDistance":
      return "roundTripLegTimeSum";
    default:
      return row.solveMode;
  }
}

function cp002FinalRepresentation(row: TsdCp002GeneratedQuestion): string {
  if (row.solveMode === "totalDistanceFromAverageAndTime") return "OVERALL_AVERAGE_AS_EFFECTIVE_SPEED";
  if (
    row.representation.startsWith("TIME_SHARE_SUPPLEMENTAL_")
    || row.representation.startsWith("TIME_RATIO_SUPPLEMENTAL_")
    || row.representation.startsWith("DISTANCE_SHARE_SUPPLEMENTAL_")
    || row.representation.startsWith("DISTANCE_RATIO_SUPPLEMENTAL_")
    || row.representation.startsWith("INVERSE_")
    || row.representation.startsWith("RETURN_SPEED_")
    || row.representation.startsWith("ROUND_TRIP_")
    || row.representation.startsWith("OUTWARD_RETURN_")
    || row.representation.startsWith("TARGET_AVERAGE_")
  ) return row.representation;
  return row.authoritySubmode === "STANDARD" ? row.representation : row.authoritySubmode;
}

function cp001Record(row: TsdCp001GeneratedQuestion): TsdFinalReviewRecord {
  const authority = finalAuthorityByKey(cp001AuthorityKey(row));
  return Object.freeze({
    finalAuthorityKey: authority.authorityKey,
    finalCheckpointId: authority.checkpointId,
    permanentQlId: null,
    legacyReviewQlId: cp001LegacyQl(row.solveMode),
    finalRepresentation: proportionRepresentation(row.input) ?? row.representation,
    questionLanguageId: row.questionLanguageId,
    sourceCheckpointId: "TSD-CP-001",
    sourceQuestion: row,
    reviewStatus: "EDITORIAL_REVIEW_REQUIRED",
    englishFreezeStatus: "UNFROZEN",
    publiclyPublishable: false,
  });
}

function cp002Record(row: TsdCp002GeneratedQuestion): TsdFinalReviewRecord {
  const authority = finalAuthorityByKey(cp002AuthorityKey(row));
  return Object.freeze({
    finalAuthorityKey: authority.authorityKey,
    finalCheckpointId: authority.checkpointId,
    permanentQlId: null,
    legacyReviewQlId: row.permanentQlId,
    finalRepresentation: cp002FinalRepresentation(row),
    questionLanguageId: row.questionLanguageId,
    sourceCheckpointId: "TSD-CP-002",
    sourceQuestion: row,
    reviewStatus: "EDITORIAL_REVIEW_REQUIRED",
    englishFreezeStatus: "UNFROZEN",
    publiclyPublishable: false,
  });
}

export function generateFinalAuthorityReview(): readonly TsdFinalReviewRecord[] {
  return Object.freeze([
    ...generateCp001ReviewRows(3).map(cp001Record),
    ...generateCp002ReviewRows().map(cp002Record),
    ...generateFinalPoolSupplements().map(cp002Record),
    ...generateP1DiversityBatch02Supplements().map(cp002Record),
    ...generateP1DiversityBatch03Supplements().map(cp002Record),
    cp002Record(generateP1Batch03RoundTripFourHourSupplement()),
  ]);
}

export interface TsdFinalAuthorityCoverage {
  readonly authorityKey: string;
  readonly checkpointId: TsdFinalCheckpoint;
  readonly rowCount: number;
  readonly representations: readonly string[];
  readonly legacyReviewQlIds: readonly string[];
}

export function finalAuthorityCoverage(
  rows: readonly TsdFinalReviewRecord[] = generateFinalAuthorityReview(),
): readonly TsdFinalAuthorityCoverage[] {
  return Object.freeze(TSD_FINAL_LEARNER_AUTHORITIES.map((authority: TsdFinalAuthority) => {
    const authorityRows = rows.filter((row) => row.finalAuthorityKey === authority.authorityKey);
    return Object.freeze({
      authorityKey: authority.authorityKey,
      checkpointId: authority.checkpointId,
      rowCount: authorityRows.length,
      representations: Object.freeze([...new Set(authorityRows.map((row) => row.finalRepresentation))]),
      legacyReviewQlIds: Object.freeze([...new Set(authorityRows.map((row) => row.legacyReviewQlId))]),
    });
  }));
}

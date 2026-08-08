import { remodelCp001ClockOptionLabels } from "./cp001/clock-option-label-integrity";
import { remodelCp001FinalEditorial } from "./cp001/final-editorial-remediation";
import { TSD_CP001_FROZEN_AUTHORITIES } from "./cp001/freeze-registry";
import { generateP1DiversityBatch04Cp001Supplements } from "./cp001/p1-diversity-batch-04-supplements";
import { generateP2DiversityBatch02Supplements } from "./cp001/p2-diversity-batch-02-supplements";
import { remodelCp001ProportionOptionLabels } from "./cp001/proportion-option-label-integrity";
import { proportionRepresentation } from "./cp001/proportion-representation";
import { generateCp001ReviewRows } from "./cp001/runtime";
import type { TsdCp001GeneratedQuestion } from "./cp001/runtime-types";
import { remodelCp002DistractorExplanations } from "./cp002/distractor-explanation-integrity";
import { generateFinalPoolSupplements } from "./cp002/final-pool-supplements";
import { generateP1DiversityBatch02Supplements } from "./cp002/p1-diversity-batch-02-supplements";
import { generateP1DiversityBatch03Supplements } from "./cp002/p1-diversity-batch-03-supplements";
import { generateP1Batch03RoundTripFourHourSupplement } from "./cp002/p1-diversity-batch-03-roundtrip-supplement";
import { generateP1DiversityBatch04Cp002Supplements } from "./cp002/p1-diversity-batch-04-supplements";
import { generateP2DiversityBatch01Supplements } from "./cp002/p2-diversity-batch-01-supplements";
import { generateP2DiversityBatch03Supplements } from "./cp002/p2-diversity-batch-03-supplements";
import { generateCp002ReviewRows } from "./cp002/runtime";
import type { TsdCp002GeneratedQuestion } from "./cp002/types";
import { remodelTsdContext } from "./context-plausibility";
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
    row.representation.startsWith("P2_")
    || row.representation.startsWith("TIME_SHARE_SUPPLEMENTAL_")
    || row.representation.startsWith("TIME_RATIO_SUPPLEMENTAL_")
    || row.representation.startsWith("DISTANCE_SHARE_SUPPLEMENTAL_")
    || row.representation.startsWith("DISTANCE_RATIO_SUPPLEMENTAL_")
    || row.representation.startsWith("INVERSE_")
    || row.representation.startsWith("RETURN_SPEED_")
    || row.representation.startsWith("ROUND_TRIP_")
    || row.representation.startsWith("OUTWARD_RETURN_")
    || row.representation.startsWith("TARGET_AVERAGE_")
    || row.representation.startsWith("TIME_SHARE_FIELD_")
    || row.representation.startsWith("TIME_RATIO_OPERATING_")
    || row.representation.startsWith("EQUAL_TIME_")
    || row.representation.startsWith("FIRST_DISTANCE_TWO_SPEED_")
    || row.representation.startsWith("TWO_MULTI_SEGMENT_")
  ) return row.representation;
  return row.authoritySubmode === "STANDARD" ? row.representation : row.authoritySubmode;
}

function cp001Record(row: TsdCp001GeneratedQuestion): TsdFinalReviewRecord {
  const remediated = remodelTsdContext(
    remodelCp001FinalEditorial(
      remodelCp001ClockOptionLabels(
        remodelCp001ProportionOptionLabels(row),
      ),
    ),
  );
  const authority = finalAuthorityByKey(cp001AuthorityKey(remediated));
  return Object.freeze({
    finalAuthorityKey: authority.authorityKey,
    finalCheckpointId: authority.checkpointId,
    permanentQlId: null,
    legacyReviewQlId: cp001LegacyQl(remediated.solveMode),
    finalRepresentation: proportionRepresentation(remediated.input) ?? remediated.representation,
    questionLanguageId: remediated.questionLanguageId,
    sourceCheckpointId: "TSD-CP-001",
    sourceQuestion: remediated,
    reviewStatus: "EDITORIAL_REVIEW_REQUIRED",
    englishFreezeStatus: "UNFROZEN",
    publiclyPublishable: false,
  });
}

function cp002Record(row: TsdCp002GeneratedQuestion): TsdFinalReviewRecord {
  const remediated = remodelTsdContext(remodelCp002DistractorExplanations(row));
  const authority = finalAuthorityByKey(cp002AuthorityKey(remediated));
  return Object.freeze({
    finalAuthorityKey: authority.authorityKey,
    finalCheckpointId: authority.checkpointId,
    permanentQlId: null,
    legacyReviewQlId: remediated.permanentQlId,
    finalRepresentation: cp002FinalRepresentation(remediated),
    questionLanguageId: remediated.questionLanguageId,
    sourceCheckpointId: "TSD-CP-002",
    sourceQuestion: remediated,
    reviewStatus: "EDITORIAL_REVIEW_REQUIRED",
    englishFreezeStatus: "UNFROZEN",
    publiclyPublishable: false,
  });
}

export function generateFinalAuthorityReview(): readonly TsdFinalReviewRecord[] {
  return Object.freeze([
    ...generateCp001ReviewRows(3).map(cp001Record),
    ...generateP1DiversityBatch04Cp001Supplements().map(cp001Record),
    ...generateP2DiversityBatch02Supplements().map(cp001Record),
    ...generateCp002ReviewRows().map(cp002Record),
    ...generateFinalPoolSupplements().map(cp002Record),
    ...generateP1DiversityBatch02Supplements().map(cp002Record),
    ...generateP1DiversityBatch03Supplements().map(cp002Record),
    cp002Record(generateP1Batch03RoundTripFourHourSupplement()),
    ...generateP1DiversityBatch04Cp002Supplements().map(cp002Record),
    ...generateP2DiversityBatch01Supplements().map(cp002Record),
    ...generateP2DiversityBatch03Supplements().map(cp002Record),
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

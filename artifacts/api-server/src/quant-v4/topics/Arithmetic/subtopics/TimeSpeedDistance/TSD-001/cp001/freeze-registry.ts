import type { TsdCp001DiscoverySolveMode } from "./discovery-registry";
import type { TsdCp001GeneratedQuestion } from "./runtime-types";
import {
  TSD_CP001_LEARNER_AUTHORITIES,
  TSD_CP001_NON_LEARNER_MODES,
  generateCp001ReviewRows,
} from "./runtime";

export type TsdPermanentQlId = `TSD-QL-${string}`;

export interface TsdCp001FrozenAuthority {
  readonly permanentQlId: TsdPermanentQlId;
  readonly provisionalAuthorityId: `TSD-CP001-DISC-${string}`;
  readonly solveMode: TsdCp001DiscoverySolveMode;
  readonly englishFreezeStatus: "FROZEN";
  readonly reviewedStates: 3;
  readonly publiclyPublishable: false;
}

const LEARNER_MODES: readonly TsdCp001DiscoverySolveMode[] = [
  "distanceFromSpeedAndTime",
  "speedFromDistanceAndTime",
  "timeFromDistanceAndSpeed",
  "convertSpeedUnit",
  "convertDistanceUnit",
  "convertTimeUnit",
  "speedFromMixedUnits",
  "arrivalClockTime",
  "departureClockTime",
  "elapsedClockTime",
  "compareDistancesAtEqualTime",
  "compareTimesAtEqualDistance",
  "compareSpeedsAtEqualTime",
  "distanceRatioFromSpeedAndTimeRatios",
  "speedRatioFromDistanceAndTimeRatios",
  "timeRatioFromDistanceAndSpeedRatios",
  "distanceByProportion",
  "timeByProportion",
  "speedByProportion",
  "speedFromPace",
  "paceFromSpeed",
  "distanceFromPaceAndTime",
  "requiredUniformSpeedForDeadline",
] as const;

function ql(ordinal: number, solveMode: TsdCp001DiscoverySolveMode): TsdCp001FrozenAuthority {
  const authority = TSD_CP001_LEARNER_AUTHORITIES.find((entry) => entry.solveMode === solveMode);
  if (!authority) throw new Error(`Cannot freeze missing CP-001 learner authority: ${solveMode}`);
  if (TSD_CP001_NON_LEARNER_MODES.has(solveMode)) throw new Error(`Internal QA mode cannot receive a permanent learner QL: ${solveMode}`);
  return Object.freeze({
    permanentQlId: `TSD-QL-${String(ordinal).padStart(3, "0")}`,
    provisionalAuthorityId: authority.provisionalId,
    solveMode,
    englishFreezeStatus: "FROZEN",
    reviewedStates: 3,
    publiclyPublishable: false,
  });
}

export const TSD_CP001_FROZEN_AUTHORITIES: readonly TsdCp001FrozenAuthority[] = Object.freeze(
  LEARNER_MODES.map((mode, index) => ql(index + 1, mode)),
);

export const TSD_CP001_NEXT_PERMANENT_QL_ID: TsdPermanentQlId = "TSD-QL-024";

export interface TsdCp001FrozenReviewRecord {
  readonly permanentQlId: TsdPermanentQlId;
  readonly provisionalAuthorityId: `TSD-CP001-DISC-${string}`;
  readonly solveMode: TsdCp001DiscoverySolveMode;
  readonly reviewSeed: string;
  readonly mathematicalFingerprint: string;
  readonly stem: string;
  readonly answerText: string;
  readonly englishDecision: "APPROVED";
  readonly sourceQuestion: TsdCp001GeneratedQuestion;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export function frozenAuthorityForMode(mode: TsdCp001DiscoverySolveMode): TsdCp001FrozenAuthority {
  const authority = TSD_CP001_FROZEN_AUTHORITIES.find((entry) => entry.solveMode === mode);
  if (!authority) throw new Error(`No frozen CP-001 learner authority for ${mode}`);
  return authority;
}

export function generateCp001FrozenEnglishReview(): readonly TsdCp001FrozenReviewRecord[] {
  return Object.freeze(generateCp001ReviewRows(3).map((question) => {
    const authority = frozenAuthorityForMode(question.solveMode);
    return Object.freeze({
      permanentQlId: authority.permanentQlId,
      provisionalAuthorityId: authority.provisionalAuthorityId,
      solveMode: authority.solveMode,
      reviewSeed: question.seed,
      mathematicalFingerprint: question.mathematicalFingerprint,
      stem: question.stem,
      answerText: question.answerText,
      englishDecision: "APPROVED" as const,
      sourceQuestion: question,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    });
  }));
}

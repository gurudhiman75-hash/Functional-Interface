import type { TsdEditorialDifficulty, TsdEditorialLifecycle } from "../editorial-contract";
import type { TsdCp002AuthoritySubmode } from "./editorial-authority-audit";
import type { Fraction } from "./fraction";

export const TSD_CP002_LEARNER_SOLVE_MODES = [
  "averageSpeedFromSegments",
  "averagePaceFromSegments",
  "unknownSegmentSpeedFromAverage",
  "unknownSegmentTimeFromAverage",
  "unknownSegmentDistanceFromAverage",
  "unknownSegmentShareFromAverage",
  "unknownRoundTripLegSpeedFromAverage",
  "oneWayDistanceFromRoundTripData",
  "roundTripTimeFromOneWayDistance",
  "totalDistanceFromAverageAndTime",
  "segmentAllocationFromTotalsAndSpeeds",
  "segmentRatioFromAverageAndSpeeds",
  "requiredRemainingSpeedForTargetAverage",
  "compareSegmentedJourneyPlans",
] as const;

export const TSD_CP002_INTERNAL_SOLVE_MODES = [
  "classifyAverageSpeedState",
  "verifyAverageSpeedClaim",
] as const;

export type TsdCp002LearnerSolveMode = (typeof TSD_CP002_LEARNER_SOLVE_MODES)[number];
export type TsdCp002InternalSolveMode = (typeof TSD_CP002_INTERNAL_SOLVE_MODES)[number];
export type TsdCp002SolveMode = TsdCp002LearnerSolveMode | TsdCp002InternalSolveMode;

export interface Segment {
  readonly distanceKm: Fraction;
  readonly speedKmph: Fraction;
}

export interface PaceSegment {
  readonly distanceKm: Fraction;
  readonly paceMinutesPerKm: Fraction;
}

export interface AverageSpeedFromSegmentsInput {
  readonly mode: "averageSpeedFromSegments";
  readonly segments: readonly Segment[];
}

export interface AveragePaceFromSegmentsInput {
  readonly mode: "averagePaceFromSegments";
  readonly segments: readonly PaceSegment[];
}

export interface UnknownSegmentSpeedInput {
  readonly mode: "unknownSegmentSpeedFromAverage";
  readonly knownDistanceKm: Fraction;
  readonly knownSpeedKmph: Fraction;
  readonly unknownDistanceKm: Fraction;
  readonly overallAverageKmph: Fraction;
}

export interface UnknownSegmentTimeInput {
  readonly mode: "unknownSegmentTimeFromAverage";
  readonly knownDistanceKm: Fraction;
  readonly knownTimeHours: Fraction;
  readonly unknownDistanceKm: Fraction;
  readonly overallAverageKmph: Fraction;
}

export interface UnknownSegmentDistanceInput {
  readonly mode: "unknownSegmentDistanceFromAverage";
  readonly knownDistanceKm: Fraction;
  readonly knownSpeedKmph: Fraction;
  readonly unknownSpeedKmph: Fraction;
  readonly overallAverageKmph: Fraction;
}

export interface UnknownSegmentShareInput {
  readonly mode: "unknownSegmentShareFromAverage";
  readonly firstSpeedKmph: Fraction;
  readonly secondSpeedKmph: Fraction;
  readonly overallAverageKmph: Fraction;
  readonly shareKind: "DISTANCE" | "TIME";
}

export interface UnknownRoundTripSpeedInput {
  readonly mode: "unknownRoundTripLegSpeedFromAverage";
  readonly knownLegSpeedKmph: Fraction;
  readonly overallAverageKmph: Fraction;
  readonly unknownLeg: "OUTWARD" | "RETURN";
}

export interface OneWayDistanceInput {
  readonly mode: "oneWayDistanceFromRoundTripData";
  readonly outwardSpeedKmph: Fraction;
  readonly returnSpeedKmph: Fraction;
  readonly totalTimeHours: Fraction;
}

export interface RoundTripTimeInput {
  readonly mode: "roundTripTimeFromOneWayDistance";
  readonly oneWayDistanceKm: Fraction;
  readonly outwardSpeedKmph: Fraction;
  readonly returnSpeedKmph: Fraction;
}

export interface TotalDistanceInput {
  readonly mode: "totalDistanceFromAverageAndTime";
  readonly overallAverageKmph: Fraction;
  readonly totalTimeHours: Fraction;
}

export interface SegmentAllocationInput {
  readonly mode: "segmentAllocationFromTotalsAndSpeeds";
  readonly totalDistanceKm: Fraction;
  readonly totalTimeHours: Fraction;
  readonly firstSpeedKmph: Fraction;
  readonly secondSpeedKmph: Fraction;
  readonly requested: "FIRST_DISTANCE" | "SECOND_DISTANCE" | "FIRST_TIME" | "SECOND_TIME";
}

export interface SegmentRatioInput {
  readonly mode: "segmentRatioFromAverageAndSpeeds";
  readonly firstSpeedKmph: Fraction;
  readonly secondSpeedKmph: Fraction;
  readonly overallAverageKmph: Fraction;
  readonly ratioKind: "DISTANCE" | "TIME";
}

export interface RequiredRemainingSpeedInput {
  readonly mode: "requiredRemainingSpeedForTargetAverage";
  readonly totalDistanceKm: Fraction;
  readonly completedDistanceKm: Fraction;
  readonly completedTimeHours: Fraction;
  readonly targetAverageKmph: Fraction;
}

export interface ComparePlansInput {
  readonly mode: "compareSegmentedJourneyPlans";
  readonly planA: readonly Segment[];
  readonly planB: readonly Segment[];
}

export interface ClassifyAverageStateInput {
  readonly mode: "classifyAverageSpeedState";
  readonly supplied: "AVERAGE_ONLY" | "DISTANCE_AND_TIME" | "FULL_SEGMENTS" | "CONTRADICTORY";
}

export interface VerifyAverageClaimInput {
  readonly mode: "verifyAverageSpeedClaim";
  readonly segments: readonly Segment[];
  readonly claimedAverageKmph: Fraction;
}

export type TsdCp002Input =
  | AverageSpeedFromSegmentsInput
  | AveragePaceFromSegmentsInput
  | UnknownSegmentSpeedInput
  | UnknownSegmentTimeInput
  | UnknownSegmentDistanceInput
  | UnknownSegmentShareInput
  | UnknownRoundTripSpeedInput
  | OneWayDistanceInput
  | RoundTripTimeInput
  | TotalDistanceInput
  | SegmentAllocationInput
  | SegmentRatioInput
  | RequiredRemainingSpeedInput
  | ComparePlansInput
  | ClassifyAverageStateInput
  | VerifyAverageClaimInput;

export type TsdCp002AnswerKind = "SPEED" | "PACE" | "TIME" | "DISTANCE" | "PERCENT" | "RATIO" | "CHOICE" | "CLASSIFICATION" | "BOOLEAN";

export type TsdCp002Solution =
  | { readonly answerKind: "SPEED" | "PACE" | "TIME" | "DISTANCE" | "PERCENT" | "RATIO"; readonly value: Fraction }
  | { readonly answerKind: "CHOICE"; readonly value: "Plan A" | "Plan B" | "Both plans have the same average speed" }
  | { readonly answerKind: "CLASSIFICATION"; readonly value: "UNIQUE" | "INDETERMINATE" | "IMPOSSIBLE" }
  | { readonly answerKind: "BOOLEAN"; readonly value: boolean };

export interface TsdCp002OptionAudit {
  readonly text: string;
  readonly misconceptionId: string;
  readonly isCorrect: boolean;
}

export interface TsdCp002OptionAnalysis extends TsdCp002OptionAudit {
  readonly option: "A" | "B" | "C" | "D";
  readonly reason: string;
}

export interface TsdCp002Explanation {
  readonly keyRule: string;
  readonly stepByStepSolution: readonly string[];
  readonly examSpeedShortcut: string;
  readonly optionAnalysis: readonly TsdCp002OptionAnalysis[];
  readonly conclusion: string;
}

export interface TsdCp002GeneratedQuestion {
  readonly chapterId: "TSD-001";
  readonly checkpointId: "TSD-CP-002";
  readonly archetypeId: "TSD-001";
  readonly canonicalProblemId: "TSD-CP-002";
  readonly provisionalAuthorityId: `TSD-CP002-DISC-${string}`;
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly questionLanguageId: string;
  readonly solveMode: TsdCp002LearnerSolveMode;
  readonly authoritySubmode: TsdCp002AuthoritySubmode;
  readonly language: "en";
  readonly seed: string;
  readonly representation: string;
  readonly difficulty: TsdEditorialDifficulty;
  readonly stem: string;
  readonly stemMathJax: string;
  readonly input: TsdCp002Input;
  readonly solution: TsdCp002Solution;
  readonly answerText: string;
  readonly options: readonly string[];
  readonly optionAudit: readonly TsdCp002OptionAudit[];
  readonly correctIndex: number;
  readonly explanation: TsdCp002Explanation;
  readonly mathematicalFingerprint: string;
  readonly lifecycle: TsdEditorialLifecycle;
  readonly publiclyPublishable: false;
  readonly validation: {
    readonly valid: boolean;
    readonly errors: readonly string[];
    readonly warnings: readonly string[];
  };
}

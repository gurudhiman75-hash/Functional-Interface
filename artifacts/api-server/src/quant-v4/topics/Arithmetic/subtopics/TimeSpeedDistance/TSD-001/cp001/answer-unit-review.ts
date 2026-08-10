import type { TsdCp001DiscoverySolveMode } from "./discovery-registry";
import type { TsdCp001GeneratedQuestion } from "./runtime-types";

export interface AnswerUnitReviewTarget {
  readonly bucket: string;
  readonly count: number;
}

const THREE_ROW_TARGETS: Partial<Record<TsdCp001DiscoverySolveMode, readonly AnswerUnitReviewTarget[]>> = {
  convertDistanceUnit: [
    { bucket: "KILOMETRE_SCALE", count: 1 },
    { bucket: "MILLIMETRE_SCALE", count: 1 },
    { bucket: "METRE_CENTIMETRE_SCALE", count: 1 },
  ],
  convertTimeUnit: [
    { bucket: "DAY_SCALE", count: 1 },
    { bucket: "SECOND_SCALE", count: 1 },
    { bucket: "HOUR_MINUTE_SCALE", count: 1 },
  ],
  speedFromMixedUnits: [
    { bucket: "KMPH", count: 1 },
    { bucket: "MPS", count: 1 },
    { bucket: "M_PER_MINUTE", count: 1 },
  ],
  speedFromPace: [
    { bucket: "KMPH", count: 2 },
    { bucket: "MPS", count: 1 },
  ],
  paceFromSpeed: [
    { bucket: "MINUTE_PER_KM", count: 2 },
    { bucket: "SECOND_PER_KM", count: 1 },
  ],
  distanceFromPaceAndTime: [
    { bucket: "KM", count: 2 },
    { bucket: "M", count: 1 },
  ],
};

export function answerUnitReviewTargets(
  solveMode: TsdCp001DiscoverySolveMode,
  seedsPerAuthority: number,
): readonly AnswerUnitReviewTarget[] {
  if (seedsPerAuthority !== 3) return [];
  return THREE_ROW_TARGETS[solveMode] ?? [];
}

export function answerUnitReviewBucket(question: TsdCp001GeneratedQuestion): string | null {
  const input = question.input;
  switch (input.solveMode) {
    case "convertDistanceUnit":
      if (input.from === "MM" || input.to === "MM") return "MILLIMETRE_SCALE";
      if (input.from === "KM" || input.to === "KM") return "KILOMETRE_SCALE";
      return "METRE_CENTIMETRE_SCALE";

    case "convertTimeUnit":
      if (input.from === "DAY" || input.to === "DAY") return "DAY_SCALE";
      if (input.from === "SECOND" || input.to === "SECOND") return "SECOND_SCALE";
      return "HOUR_MINUTE_SCALE";

    case "speedFromMixedUnits":
    case "speedFromPace":
    case "paceFromSpeed":
    case "distanceFromPaceAndTime":
      return input.outputUnit;

    default:
      return null;
  }
}

export function formatAnswerUnitTarget(target: AnswerUnitReviewTarget): string {
  return `${target.bucket}:${target.count}`;
}

import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import { roundClean } from "../utils/math-utils";
import { humanizedScaleUnit } from "./humanized-number-pools";

function closeEnough(left: number, right: number, tolerance = 0.01) {
  return Math.abs(left - right) <= tolerance;
}

function isPercentageKey(key: string) {
  return /percent|rate/i.test(key);
}

function snapOptionValue(value: number, answer: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }
  if (Math.abs(value) < 100) {
    return roundClean(value, Number.isInteger(value) ? 0 : 2);
  }
  if (Math.abs(value) < 1000) {
    return roundClean(Math.round(value / 5) * 5, 2);
  }

  const unit = humanizedScaleUnit(
    Math.max(Math.abs(value), Math.abs(answer)),
    "medium",
  );
  return roundClean(Math.round(value / unit) * unit, 2);
}

function distinctFromAll(
  candidate: number,
  values: readonly number[],
  answer: number,
) {
  return (
    Number.isFinite(candidate) &&
    candidate >= 0 &&
    !closeEnough(candidate, answer) &&
    values.every((value) => !closeEnough(value, candidate))
  );
}

function fallbackDistractor(answer: number, index: number) {
  const unit = humanizedScaleUnit(Math.abs(answer), "medium");
  const direction = index % 2 === 0 ? 1 : -1;
  const magnitude = Math.floor(index / 2) + 1;
  return roundClean(answer + direction * unit * magnitude, 2);
}

function adjustedCleanValue(
  snapped: number,
  answer: number,
  existing: readonly number[],
) {
  const unit = humanizedScaleUnit(
    Math.max(Math.abs(snapped), Math.abs(answer)),
    "medium",
  );

  for (const multiplier of [1, -1, 2, -2, 3, -3]) {
    const candidate = roundClean(snapped + unit * multiplier, 2);
    if (distinctFromAll(candidate, existing, answer)) {
      return candidate;
    }
  }

  return undefined;
}

function humanizeDistractors(
  problem: CanonicalPercentageProblem,
): {
  distractors: number[];
  snappedByOriginal: Map<number, number>;
} {
  const distractors: number[] = [];
  const snappedByOriginal = new Map<number, number>();

  for (const original of problem.distractors) {
    const snapped = snapOptionValue(original, problem.answer);
    const value = distinctFromAll(snapped, distractors, problem.answer)
      ? snapped
      : adjustedCleanValue(snapped, problem.answer, distractors);

    if (typeof value === "number") {
      distractors.push(value);
      snappedByOriginal.set(roundClean(original, 2), value);
    }
  }

  let fallbackIndex = 0;
  while (distractors.length < 3 && fallbackIndex < 12) {
    const fallback = fallbackDistractor(problem.answer, fallbackIndex);
    if (distinctFromAll(fallback, distractors, problem.answer)) {
      distractors.push(fallback);
    }
    fallbackIndex += 1;
  }

  return {
    distractors: distractors.slice(0, 3),
    snappedByOriginal,
  };
}

export function beautifyCanonicalValues(
  problem: CanonicalPercentageProblem,
): CanonicalPercentageProblem {
  const { distractors, snappedByOriginal } =
    humanizeDistractors(problem);
  const topology = problem.topology
    ? {
        ...problem.topology,
        misconceptionDistractors:
          problem.topology.misconceptionDistractors.map((item) => {
            const key = roundClean(item.value, 2);
            return {
              ...item,
              value: snappedByOriginal.get(key) ?? item.value,
            };
          }),
      }
    : undefined;

  return {
    ...problem,
    variables: Object.fromEntries(
      Object.entries(problem.variables).map(([key, value]) => [
        key,
        isPercentageKey(key) ? roundClean(value, 2) : roundClean(value, 2),
      ]),
    ),
    answer: roundClean(problem.answer, 2),
    distractors,
    topology,
  };
}

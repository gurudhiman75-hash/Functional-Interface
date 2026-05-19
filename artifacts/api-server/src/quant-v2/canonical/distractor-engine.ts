import type { Trap } from "./percentage-types";
import { roundClean, sanitizeValue } from "../utils/math-utils";

export type TrapCandidate = {
  trap: Trap;
  value: number;
};

export type DistractorInput = {
  answer: number;
  candidates: readonly TrapCandidate[];
  minimumCount?: number;
};

function isDistinct(left: number, right: number) {
  return Math.abs(left - right) > 0.01;
}

export function simpleAdditionDistractor(
  base: number,
  firstPercent: number,
  secondPercent: number,
): TrapCandidate {
  return {
    trap: "simple_addition",
    value: sanitizeValue(
      base * (1 + (firstPercent + secondPercent) / 100),
    ),
  };
}

export function wrongBaseDistractor(
  base: number,
  percent: number,
  shiftedBase: number,
): TrapCandidate {
  return {
    trap: "wrong_base",
    value: sanitizeValue(shiftedBase + (base * percent) / 100),
  };
}

export function reverseDirectionDistractor(
  base: number,
  percent: number,
): TrapCandidate {
  return {
    trap: "reverse_direction",
    value: sanitizeValue(base * (1 - percent / 100)),
  };
}

export function marginConfusionDistractor(
  margin: number,
  confusedPercent: number,
): TrapCandidate {
  return {
    trap: "margin_confusion",
    value: sanitizeValue((margin * 100) / confusedPercent),
  };
}

export function samePercentageAssumptionDistractor(
  base: number,
  percent: number,
): TrapCandidate {
  return {
    trap: "same_percentage_assumption",
    value: sanitizeValue(base + (base * percent) / 100),
  };
}

export function generateDeterministicDistractors(
  input: DistractorInput,
): number[] {
  const minimumCount = input.minimumCount ?? 3;
  const distractors: number[] = [];

  for (const candidate of input.candidates) {
    const value = roundClean(candidate.value, 2);
    if (
      Number.isFinite(value) &&
      isDistinct(value, input.answer) &&
      distractors.every((item) => isDistinct(item, value))
    ) {
      distractors.push(value);
    }
    if (distractors.length >= minimumCount) {
      return distractors;
    }
  }

  const fallbackSteps = [
    -20,
    20,
    -10,
    10,
    -5,
    5,
    25,
    -25,
  ];

  for (const step of fallbackSteps) {
    const value = roundClean(input.answer + step, 2);
    if (
      Number.isFinite(value) &&
      value >= 0 &&
      isDistinct(value, input.answer) &&
      distractors.every((item) => isDistinct(item, value))
    ) {
      distractors.push(value);
    }
    if (distractors.length >= minimumCount) {
      break;
    }
  }

  return distractors;
}

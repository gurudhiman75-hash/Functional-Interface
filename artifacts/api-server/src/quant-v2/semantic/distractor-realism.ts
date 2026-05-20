import { roundClean } from "../utils/math-utils";

function isDistinct(left: number, right: number) {
  return Math.abs(left - right) > 0.01;
}

export function isRealisticDisplayedDistractor(value: number, answer: number) {
  const magnitude = Math.max(Math.abs(answer), 1);
  const distance = Math.abs(value - answer);

  if (magnitude < 1000) return true;
  if (Math.abs(value) > magnitude * 3) return false;
  if (magnitude >= 100000 && distance > magnitude * 1.5) return false;
  return true;
}

export function calibrateDisplayedDistractors(input: {
  answer: number;
  distractors: readonly number[];
  minimumCount?: number;
}) {
  const minimumCount = input.minimumCount ?? 3;
  const result: number[] = [];

  for (const raw of input.distractors) {
    const value = roundClean(raw, 2);
    if (
      Number.isFinite(value) &&
      isRealisticDisplayedDistractor(value, input.answer) &&
      isDistinct(value, input.answer) &&
      result.every((item) => isDistinct(item, value))
    ) {
      result.push(value);
    }
    if (result.length >= minimumCount) return result;
  }

  const magnitude = Math.max(Math.abs(input.answer), 100);
  const steps = magnitude >= 1000
    ? [-0.1, 0.1, -0.05, 0.05, 0.15, -0.15].map((ratio) =>
        roundClean(input.answer * ratio, 2),
      )
    : [-20, 20, -10, 10, -5, 5, 25, -25];

  for (const step of steps) {
    const value = roundClean(input.answer + step, 2);
    if (
      Number.isFinite(value) &&
      value >= 0 &&
      isDistinct(value, input.answer) &&
      result.every((item) => isDistinct(item, value))
    ) {
      result.push(value);
    }
    if (result.length >= minimumCount) break;
  }

  return result;
}


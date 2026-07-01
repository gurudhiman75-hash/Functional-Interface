import { applyIndianGrouping } from "./grouping-rules";
import {
  DEFAULT_NUMBER_PRESENTATION_POLICY,
  type NumberPresentationPolicy,
} from "./presentation-policy";

export interface FormattedNumber {
  numericValue: number;
  plain: string;
  grouped: string;
  approximate: boolean;
}

export function roundForPresentation(
  value: number,
  policy: NumberPresentationPolicy = DEFAULT_NUMBER_PRESENTATION_POLICY,
): number {
  const factor = 10 ** policy.maximumFractionDigits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function trimFraction(value: number, maximumFractionDigits: number): string {
  if (Number.isInteger(value)) return String(value);
  return value
    .toFixed(maximumFractionDigits)
    .replace(/\.?0+$/, "");
}

export function formatNumberForPresentation(
  value: number,
  policy: NumberPresentationPolicy = DEFAULT_NUMBER_PRESENTATION_POLICY,
): FormattedNumber {
  if (!Number.isFinite(value)) {
    throw new Error(`Cannot present non-finite number: ${value}`);
  }
  const numericValue = roundForPresentation(value, policy);
  const plain = trimFraction(
    numericValue,
    policy.maximumFractionDigits,
  );
  return {
    numericValue,
    plain,
    grouped: applyIndianGrouping(plain),
    approximate: Math.abs(numericValue - value) > 1e-12,
  };
}

export function parsePresentedNumbers(text: string): readonly number[] {
  return [...text.matchAll(/-?\d[\d,]*(?:\.\d+)?/g)].map((match) =>
    Number(match[0]!.replace(/,/g, "")),
  );
}


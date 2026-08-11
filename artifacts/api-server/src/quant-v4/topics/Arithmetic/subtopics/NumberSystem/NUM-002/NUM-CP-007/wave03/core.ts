import {
  createRng,
  difficulty,
  explanation,
  numericOptions,
  shuffle,
  sources,
  textOptions,
} from "../wave01/core.ts";
import type { Rng } from "../wave01/core.ts";
import type {
  NumCp007Wave03Explanation,
  NumCp007Wave03Option,
  NumCp007Wave03Package,
} from "./types.ts";

export { createRng, difficulty, numericOptions, shuffle, sources, textOptions };
export type { Rng };

export function mod(value: number, divisor: number): number {
  if (!Number.isInteger(value) || !Number.isInteger(divisor) || divisor <= 0) {
    throw new Error(`Invalid modulo input: ${value}, ${divisor}`);
  }
  return ((value % divisor) + divisor) % divisor;
}

export function base(
  input: Omit<
    NumCp007Wave03Package,
    "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle"
  >,
): NumCp007Wave03Package {
  return {
    packageId: "NUM-002",
    checkpointId: "NUM-CP-007",
    permanentQlId: null,
    locale: "en-IN",
    ...input,
    lifecycle: {
      permanentQlId: null,
      maturity: "EXECUTABLE_DISCOVERY_PROOF",
      reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export function cleanExplanation(
  coreConcept: string,
  strategy: string,
  steps: readonly string[],
  finalAnswer: string,
): NumCp007Wave03Explanation {
  return explanation(coreConcept, strategy, steps, finalAnswer);
}

export const hidden = <T extends object>(
  task: string,
  values: T,
): Readonly<Record<string, unknown>> => ({ task, ...values });

export function tierForSeed(seed: number): 0 | 1 | 2 {
  return ((seed - 1) % 3) as 0 | 1 | 2;
}

export function valuesInRange(
  lower: number,
  upper: number,
  divisor: number,
  remainder: number,
): number[] {
  const output: number[] = [];
  for (let value = lower; value <= upper; value++) {
    if (mod(value, divisor) === remainder) output.push(value);
  }
  return output;
}

export function formatNumberSet(values: readonly number[]): string {
  return values.length === 0 ? "No value" : `{${values.join(", ")}}`;
}

export type DivisionStateClass =
  | "VALID"
  | "INVALID_IDENTITY"
  | "INVALID_REMAINDER"
  | "INVALID_BOTH";

export function classifyDivisionState(
  dividend: number,
  divisor: number,
  quotient: number,
  remainder: number,
): DivisionStateClass {
  const identityValid =
    Number.isInteger(dividend) &&
    Number.isInteger(divisor) &&
    Number.isInteger(quotient) &&
    Number.isInteger(remainder) &&
    divisor > 0 &&
    dividend === divisor * quotient + remainder;
  const remainderValid =
    Number.isInteger(divisor) &&
    Number.isInteger(remainder) &&
    divisor > 0 &&
    remainder >= 0 &&
    remainder < divisor;

  if (identityValid && remainderValid) return "VALID";
  if (!identityValid && remainderValid) return "INVALID_IDENTITY";
  if (identityValid && !remainderValid) return "INVALID_REMAINDER";
  return "INVALID_BOTH";
}

export const STATE_CLASS_LABELS: Readonly<Record<DivisionStateClass, string>> = {
  VALID: "Valid division state",
  INVALID_IDENTITY: "Invalid: division identity fails",
  INVALID_REMAINDER: "Invalid: remainder condition fails",
  INVALID_BOTH: "Invalid: both conditions fail",
};

export type DsClass =
  | "I_ALONE"
  | "II_ALONE"
  | "BOTH_TOGETHER"
  | "NOT_SUFFICIENT";

export const DS_CLASS_LABELS: Readonly<Record<DsClass, string>> = {
  I_ALONE: "Statement I alone is sufficient",
  II_ALONE: "Statement II alone is sufficient",
  BOTH_TOGETHER: "Both statements together are sufficient, but neither alone is sufficient",
  NOT_SUFFICIENT: "Even both statements together are not sufficient",
};

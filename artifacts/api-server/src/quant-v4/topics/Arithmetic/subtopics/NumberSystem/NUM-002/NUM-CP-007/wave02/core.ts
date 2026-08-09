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
  NumCp007Wave02Explanation,
  NumCp007Wave02Option,
  NumCp007Wave02Package,
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
    NumCp007Wave02Package,
    "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle"
  >,
): NumCp007Wave02Package {
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
): NumCp007Wave02Explanation {
  return explanation(coreConcept, strategy, steps, finalAnswer);
}

export const hidden = <T extends object>(
  task: string,
  values: T,
): Readonly<Record<string, unknown>> => ({ task, ...values });

export function tierForSeed(seed: number): 0 | 1 | 2 {
  return ((seed - 1) % 3) as 0 | 1 | 2;
}

export function rangeCount(
  lower: number,
  upper: number,
  divisor: number,
  remainder: number,
): number {
  let count = 0;
  for (let value = lower; value <= upper; value++) {
    if (mod(value, divisor) === remainder) count++;
  }
  return count;
}

export function valuesInRange(
  lower: number,
  upper: number,
  divisor: number,
  remainder: number,
): number[] {
  const values: number[] = [];
  for (let value = lower; value <= upper; value++) {
    if (mod(value, divisor) === remainder) values.push(value);
  }
  return values;
}

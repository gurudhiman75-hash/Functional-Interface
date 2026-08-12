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
  NumCp007Wave04Explanation,
  NumCp007Wave04Package,
} from "./types.ts";

export { createRng, difficulty, numericOptions, shuffle, sources, textOptions };
export type { Rng };

export function mod(value: number, divisor: number): number {
  if (!Number.isInteger(value) || !Number.isInteger(divisor) || divisor <= 0) {
    throw new Error(`Invalid modulo input: ${value}, ${divisor}`);
  }
  return ((value % divisor) + divisor) % divisor;
}

export function tierForSeed(seed: number): 0 | 1 | 2 {
  return ((seed - 1) % 3) as 0 | 1 | 2;
}

export function base(
  input: Omit<
    NumCp007Wave04Package,
    "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle"
  >,
): NumCp007Wave04Package {
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
): NumCp007Wave04Explanation {
  return explanation(coreConcept, strategy, steps, finalAnswer);
}

export const hidden = <T extends object>(
  task: string,
  values: T,
): Readonly<Record<string, unknown>> => ({ task, ...values });

export function divisorsInRange(value: number, lower: number, upper: number): number[] {
  const output: number[] = [];
  for (let divisor = Math.max(1, lower); divisor <= upper; divisor++) {
    if (value % divisor === 0) output.push(divisor);
  }
  return output;
}

export interface LongDivisionTrace {
  readonly prefixes: readonly number[];
  readonly remainders: readonly number[];
}

export function longDivisionTrace(dividend: number, divisor: number): LongDivisionTrace {
  if (!Number.isInteger(dividend) || dividend <= 0 || !Number.isInteger(divisor) || divisor <= 1) {
    throw new Error("Invalid long-division trace input.");
  }
  const digits = String(dividend).split("").map(Number);
  const prefixes: number[] = [];
  const remainders: number[] = [];
  let prefix = 0;
  for (const digit of digits) {
    prefix = prefix * 10 + digit;
    prefixes.push(prefix);
    remainders.push(prefix % divisor);
  }
  return { prefixes, remainders };
}

export function formatRemainderPair(first: number, second: number): string {
  return `First remainder ${first}; second remainder ${second}`;
}

export function formatDivisionResult(quotient: number, remainder: number): string {
  return `Quotient ${quotient}; remainder ${remainder}`;
}

import {
  UNIT_DIGIT_CYCLES,
  createRng,
  difficulty as wave01Difficulty,
  fixedWidthOptions,
  mod,
  numericOptions,
  optionsWithSlot,
  powMod,
  powModVerifier,
  shuffle,
  unitDigitByCycle,
} from "../wave01/core.ts";
import type {
  NumCp009Wave02Difficulty,
  NumCp009Wave02Explanation,
  NumCp009Wave02Package,
} from "./types.ts";

export {
  UNIT_DIGIT_CYCLES,
  createRng,
  fixedWidthOptions,
  mod,
  numericOptions,
  optionsWithSlot,
  powMod,
  powModVerifier,
  shuffle,
  unitDigitByCycle,
};

export function difficulty(score: number): NumCp009Wave02Difficulty {
  return wave01Difficulty(score);
}

export function explanation(
  coreConcept: string,
  strategy: string,
  steps: readonly string[],
  finalAnswer: string,
): NumCp009Wave02Explanation {
  return { coreConcept, strategy, steps, finalAnswer };
}

export function base(
  input: Omit<NumCp009Wave02Package, "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle">,
): NumCp009Wave02Package {
  return {
    packageId: "NUM-002",
    checkpointId: "NUM-CP-009",
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

export function sources(family: string) {
  return Object.freeze([
    family,
    "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
    "NUM-002-COMPLETE-CHECKPOINT-DESIGN:NUM-CP-009",
    "NUM-CP-009-WAVE01-FOUNDATION",
  ]);
}

export function formatSet(values: readonly number[]) {
  return `{${values.join(", ")}}`;
}

export function directTerminalVerifier(
  terms: readonly { base: number; exponent: number }[],
  operator: "SUM" | "DIFFERENCE" | "PRODUCT",
  modulus: number,
): number {
  const residues = terms.map((term) => powModVerifier(term.base, term.exponent, modulus));
  if (operator === "SUM") return mod(residues.reduce((sum, value) => sum + value, 0), modulus);
  if (operator === "PRODUCT") return mod(residues.reduce((product, value) => product * value, 1), modulus);
  return mod(residues[0]! - residues.slice(1).reduce((sum, value) => sum + value, 0), modulus);
}

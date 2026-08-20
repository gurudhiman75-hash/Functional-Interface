import {
  UNIT_DIGIT_CYCLES,
  createRng,
  fixedWidthOptions,
  mod,
  numericOptions,
  optionsWithSlot,
  powMod,
  powModVerifier,
  unitDigitByCycle,
} from "../wave01/core.ts";
import type {
  NumCp009Wave03Difficulty,
  NumCp009Wave03Explanation,
  NumCp009Wave03Package,
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
  unitDigitByCycle,
};

export function difficulty(score: number): NumCp009Wave03Difficulty {
  if (score <= 1) return "EASY";
  if (score <= 3) return "MEDIUM";
  return "HARD";
}

export function explanation(
  coreConcept: string,
  strategy: string,
  steps: readonly string[],
  finalAnswer: string,
): NumCp009Wave03Explanation {
  return { coreConcept, strategy, steps, finalAnswer };
}

export function base(
  input: Omit<NumCp009Wave03Package, "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle">,
): NumCp009Wave03Package {
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
    "NUM-CP-009-POST-WAVE02-SATURATION-AUDIT",
  ]);
}

export function formatClassSet(residues: readonly number[], modulus: number) {
  return `{${residues.map((residue) => `n ≡ ${residue} (mod ${modulus})`).join(", ")}}`;
}

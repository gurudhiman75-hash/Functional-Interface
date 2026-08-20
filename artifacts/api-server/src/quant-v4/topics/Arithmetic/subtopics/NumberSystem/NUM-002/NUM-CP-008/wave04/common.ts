import {
  createRng,
  shuffle,
  mod,
  lcm,
  crtMany,
  systemSolutions,
  solutionsInRange,
  textOptions,
  type Rng,
} from "../wave03/common.ts";
import type { NumCp008Wave04Package } from "./types.ts";

export {
  createRng,
  shuffle,
  mod,
  lcm,
  crtMany,
  systemSolutions,
  solutionsInRange,
  textOptions,
  type Rng,
};

export function base(input: Omit<NumCp008Wave04Package, "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle">): NumCp008Wave04Package {
  return {
    packageId: "NUM-002",
    checkpointId: "NUM-CP-008",
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

export const sources = (family: string) => [
  family,
  "NUMBER-SYSTEM-DESIGN-CP008",
  "CP008-POST-WAVE03-GAP-AUDIT",
  "CP008-WAVE04-FINAL-MATERIAL-GAPS",
] as const;

export function setText(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

export function classifyCount(count: number): "No solution" | "Exactly one solution" | "More than one solution" {
  if (count === 0) return "No solution";
  if (count === 1) return "Exactly one solution";
  return "More than one solution";
}

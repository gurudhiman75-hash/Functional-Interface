import {
  createRng,
  shuffle,
  mod,
  gcd,
  lcm,
  crtMany,
  systemSolutions,
  difficulty,
  numericOptions,
  textOptions,
  type Rng,
} from "../wave03/common.ts";
import type { NumCp008Wave04Package } from "./types.ts";

export { createRng, shuffle, mod, gcd, lcm, crtMany, systemSolutions, difficulty, numericOptions, textOptions, type Rng };

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

export const sources = (family: string, fixture: string) => [
  family,
  fixture,
  "NUMBER-SYSTEM-DESIGN-CP008",
  "CP008-WAVE04-SOURCE-SATURATION-RECHECK",
] as const;

export function leastPositive(residue: number, period: number): number {
  const normalized = mod(residue, period);
  return normalized === 0 ? period : normalized;
}

export function countClassInRange(residue: number, period: number, lower: number, upper: number): number {
  const first = lower + mod(residue - lower, period);
  if (first > upper) return 0;
  return Math.floor((upper - first) / period) + 1;
}

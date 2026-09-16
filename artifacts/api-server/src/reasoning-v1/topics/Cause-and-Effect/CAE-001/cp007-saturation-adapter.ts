import { materializeCae001World } from "./causal-world-authorities.ts";
import { CAE_001_SATURATION_WAVE2_GROUP_C } from "./causal-world-saturation-wave2-c.ts";
import { CAE_001_SATURATION_WAVE4_BRANCH_FAMILIES } from "./causal-world-saturation-wave4-branch.ts";
import { generateCp007CommonFactorFromWorlds } from "./cp007-common-factor.ts";
import type { CaeCausalWorld, CaeLocale } from "./types.ts";

const BRANCHING_FAMILIES = Object.freeze([
  ...CAE_001_SATURATION_WAVE2_GROUP_C.filter((family) => family.topology === "BRANCHING_COMMON_CAUSE"),
  ...CAE_001_SATURATION_WAVE4_BRANCH_FAMILIES,
]);

export const CP007_SATURATION_COMMON_FACTOR_WORLDS: readonly CaeCausalWorld[] = Object.freeze(
  BRANCHING_FAMILIES.flatMap((family) => family.variants.map((variant) => materializeCae001World(family, variant))),
);

export const CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS = Object.freeze(
  Array.from(new Set(CP007_SATURATION_COMMON_FACTOR_WORLDS.map((world) => world.scenarioFamilyId))),
);

/**
 * Reviewed CP007 common-factor saturation adapter.
 * Reuses the calibrated MEDIUM common-factor renderer over approved branching
 * worlds from Waves 2 and 4. No EASY raw correlation projection is allowed.
 */
export function generateReviewedCp007SaturationCommonFactorQuestion(
  input: Readonly<{ locale: CaeLocale; seed: number }>,
) {
  return generateCp007CommonFactorFromWorlds(input, CP007_SATURATION_COMMON_FACTOR_WORLDS);
}

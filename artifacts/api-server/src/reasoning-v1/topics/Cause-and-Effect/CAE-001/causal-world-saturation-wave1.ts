import type { CaeScenarioFamilyAuthority } from "./types.ts";
import { CAE_001_SATURATION_WAVE1_GROUP_A } from "./causal-world-saturation-wave1-a.ts";
import { CAE_001_SATURATION_WAVE1_GROUP_B } from "./causal-world-saturation-wave1-b.ts";
import { CAE_001_SATURATION_WAVE1_GROUP_C } from "./causal-world-saturation-wave1-c.ts";
import { CAE_001_SATURATION_WAVE1_GROUP_D } from "./causal-world-saturation-wave1-d.ts";

/**
 * Wave 1 saturation expansion. Candidate-heavy projections remain gated until
 * each new scenario receives its own semantic distractor authorities. These
 * worlds are immediately eligible for graph-native direct/common/independent/
 * correlation/indirect/sequence projections according to each family contract.
 */
export const CAE_001_SATURATION_WAVE1_FAMILIES: readonly CaeScenarioFamilyAuthority[] = Object.freeze([
  ...CAE_001_SATURATION_WAVE1_GROUP_A,
  ...CAE_001_SATURATION_WAVE1_GROUP_B,
  ...CAE_001_SATURATION_WAVE1_GROUP_C,
  ...CAE_001_SATURATION_WAVE1_GROUP_D,
]);

export const CAE_001_SATURATION_WAVE1_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE1_FAMILIES.map((family) => family.id));
export const CAE_001_SATURATION_WAVE1_VARIANT_COUNT = CAE_001_SATURATION_WAVE1_FAMILIES.reduce((sum, family) => sum + family.variants.length, 0);

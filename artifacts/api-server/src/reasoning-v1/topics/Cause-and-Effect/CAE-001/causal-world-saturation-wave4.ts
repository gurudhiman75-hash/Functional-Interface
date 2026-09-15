import {
  CAE_001_CAUSAL_WORLDS,
  CAE_001_PROJECTION_AUTHORITIES,
  CAE_001_SCENARIO_FAMILIES,
  materializeCae001World,
} from "./causal-world-authorities.ts";
import { withCae001SaturationWave2 } from "./causal-world-saturation-wave2.ts";
import { CAE_001_SATURATION_WAVE4_BRANCH_FAMILIES } from "./causal-world-saturation-wave4-branch.ts";
import { CAE_001_SATURATION_WAVE4_PARALLEL_FAMILIES } from "./causal-world-saturation-wave4-parallel.ts";
import type { CaeCausalWorld, CaeScenarioFamilyAuthority } from "./types.ts";

export const CAE_001_SATURATION_WAVE4_FAMILIES: readonly CaeScenarioFamilyAuthority[] = Object.freeze([
  ...CAE_001_SATURATION_WAVE4_BRANCH_FAMILIES,
  ...CAE_001_SATURATION_WAVE4_PARALLEL_FAMILIES,
]);
export const CAE_001_SATURATION_WAVE4_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE4_FAMILIES.map((family) => family.id));
export const CAE_001_SATURATION_WAVE4_VARIANT_COUNT = CAE_001_SATURATION_WAVE4_FAMILIES.reduce((sum, family) => sum + family.variants.length, 0);
export const CAE_001_SATURATION_WAVE4_EFFECTIVE_FAMILY_COUNT = 40;
export const CAE_001_SATURATION_WAVE4_EFFECTIVE_VARIANT_COUNT = 160;

export const CAE_001_SATURATION_WAVE4_BRANCH_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE4_BRANCH_FAMILIES.map((family) => family.id));
export const CAE_001_SATURATION_WAVE4_PARALLEL_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE4_PARALLEL_FAMILIES.map((family) => family.id));

const ADDITIONS_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "CAE-QL-002": CAE_001_SATURATION_WAVE4_FAMILY_IDS,
  "CAE-QL-007": CAE_001_SATURATION_WAVE4_PARALLEL_FAMILY_IDS,
});

let installed = false;

function installWave4Only(): void {
  if (installed) return;
  const families = CAE_001_SCENARIO_FAMILIES as CaeScenarioFamilyAuthority[];
  const worlds = CAE_001_CAUSAL_WORLDS as CaeCausalWorld[];
  for (const family of CAE_001_SATURATION_WAVE4_FAMILIES) {
    if (!families.some((entry) => entry.id === family.id)) families.push(family);
    for (const variant of family.variants) {
      const world = materializeCae001World(family, variant);
      if (!worlds.some((entry) => entry.id === world.id)) worlds.push(world);
    }
  }
  for (const plan of CAE_001_PROJECTION_AUTHORITIES) {
    const additions = ADDITIONS_BY_QL[plan.qlId] ?? [];
    const compatible = plan.compatibleFamilyIds as string[];
    for (const familyId of additions) if (!compatible.includes(familyId)) compatible.push(familyId);
  }
  installed = true;
}

/** Scoped Wave 4 overlay; legacy registries are restored after each operation. */
export function withCae001SaturationWave4<T>(operation: () => T): T {
  return withCae001SaturationWave2(() => {
    if (installed) return operation();
    const families = CAE_001_SCENARIO_FAMILIES as CaeScenarioFamilyAuthority[];
    const worlds = CAE_001_CAUSAL_WORLDS as CaeCausalWorld[];
    const familyLength = families.length;
    const worldLength = worlds.length;
    const planLengths = new Map(CAE_001_PROJECTION_AUTHORITIES.map((plan) => [plan.id, plan.compatibleFamilyIds.length]));
    installWave4Only();
    try {
      return operation();
    } finally {
      families.splice(familyLength);
      worlds.splice(worldLength);
      for (const plan of CAE_001_PROJECTION_AUTHORITIES) {
        const originalLength = planLengths.get(plan.id);
        if (originalLength !== undefined) (plan.compatibleFamilyIds as string[]).splice(originalLength);
      }
      installed = false;
    }
  });
}

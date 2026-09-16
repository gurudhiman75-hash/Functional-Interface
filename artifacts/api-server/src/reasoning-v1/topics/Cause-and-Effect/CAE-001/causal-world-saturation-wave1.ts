import {
  CAE_001_CAUSAL_WORLDS,
  CAE_001_PROJECTION_AUTHORITIES,
  CAE_001_SCENARIO_FAMILIES,
  materializeCae001World,
} from "./causal-world-authorities.ts";
import type { CaeCausalWorld, CaeScenarioFamilyAuthority } from "./types.ts";
import { CAE_001_SATURATION_WAVE1_GROUP_A } from "./causal-world-saturation-wave1-a.ts";
import { CAE_001_SATURATION_WAVE1_GROUP_B } from "./causal-world-saturation-wave1-b.ts";
import { CAE_001_SATURATION_WAVE1_GROUP_C } from "./causal-world-saturation-wave1-c.ts";
import { CAE_001_SATURATION_WAVE1_GROUP_D } from "./causal-world-saturation-wave1-d.ts";

/**
 * Wave 1 saturation expansion. Candidate-heavy projections remain gated until
 * each new scenario receives its own semantic distractor authorities. These
 * worlds immediately enter only graph-native reviewed projections.
 */
export const CAE_001_SATURATION_WAVE1_FAMILIES: readonly CaeScenarioFamilyAuthority[] = Object.freeze([
  ...CAE_001_SATURATION_WAVE1_GROUP_A,
  ...CAE_001_SATURATION_WAVE1_GROUP_B,
  ...CAE_001_SATURATION_WAVE1_GROUP_C,
  ...CAE_001_SATURATION_WAVE1_GROUP_D,
]);

export const CAE_001_SATURATION_WAVE1_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE1_FAMILIES.map((family) => family.id));
export const CAE_001_SATURATION_WAVE1_VARIANT_COUNT = CAE_001_SATURATION_WAVE1_FAMILIES.reduce((sum, family) => sum + family.variants.length, 0);

const CHAIN_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE1_FAMILIES.filter((family) => family.topology === "DIRECT_CHAIN").map((family) => family.id));
const COMMON_OR_INDEPENDENT_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE1_FAMILIES.filter((family) => family.topology === "BRANCHING_COMMON_CAUSE" || family.topology === "PARALLEL_CHAINS").map((family) => family.id));
const CORRELATION_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE1_FAMILIES.filter((family) => family.topology === "PARALLEL_CHAINS").map((family) => family.id));

const ADDITIONS_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "CAE-QL-001": CHAIN_FAMILY_IDS,
  "CAE-QL-002": COMMON_OR_INDEPENDENT_FAMILY_IDS,
  "CAE-QL-006": CHAIN_FAMILY_IDS,
  "CAE-QL-007": CORRELATION_FAMILY_IDS,
  "CAE-QL-008": CHAIN_FAMILY_IDS,
});

let installed = false;

/**
 * Install the Wave 1 overlay into the existing synchronous generator registry.
 * Prefer `withCae001SaturationWave1` for application/runtime generation so the
 * frozen/source-profile registry is restored immediately after each call.
 */
export function installCae001SaturationWave1(): void {
  if (installed) return;

  const families = CAE_001_SCENARIO_FAMILIES as CaeScenarioFamilyAuthority[];
  for (const family of CAE_001_SATURATION_WAVE1_FAMILIES) {
    if (!families.some((entry) => entry.id === family.id)) families.push(family);
  }

  const worlds = CAE_001_CAUSAL_WORLDS as CaeCausalWorld[];
  for (const family of CAE_001_SATURATION_WAVE1_FAMILIES) {
    for (const variant of family.variants) {
      const world = materializeCae001World(family, variant);
      if (!worlds.some((entry) => entry.id === world.id)) worlds.push(world);
    }
  }

  for (const plan of CAE_001_PROJECTION_AUTHORITIES) {
    const additions = ADDITIONS_BY_QL[plan.qlId] ?? [];
    const compatible = plan.compatibleFamilyIds as string[];
    for (const familyId of additions) {
      if (!compatible.includes(familyId)) compatible.push(familyId);
    }
  }

  installed = true;
}

export function withCae001SaturationWave1<T>(operation: () => T): T {
  if (installed) return operation();

  const families = CAE_001_SCENARIO_FAMILIES as CaeScenarioFamilyAuthority[];
  const worlds = CAE_001_CAUSAL_WORLDS as CaeCausalWorld[];
  const familyLength = families.length;
  const worldLength = worlds.length;
  const planLengths = new Map(CAE_001_PROJECTION_AUTHORITIES.map((plan) => [plan.id, plan.compatibleFamilyIds.length]));

  installCae001SaturationWave1();
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
}

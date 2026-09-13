import {
  CAE_001_CAUSAL_WORLDS,
  CAE_001_PROJECTION_AUTHORITIES,
  CAE_001_SCENARIO_FAMILIES,
  materializeCae001World,
} from "./causal-world-authorities.ts";
import { CAE_001_SATURATION_WAVE1_FAMILIES, CAE_001_SATURATION_WAVE1_VARIANT_COUNT, withCae001SaturationWave1 } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_GROUP_A } from "./causal-world-saturation-wave2-a.ts";
import { CAE_001_SATURATION_WAVE2_GROUP_B } from "./causal-world-saturation-wave2-b.ts";
import { CAE_001_SATURATION_WAVE2_GROUP_C } from "./causal-world-saturation-wave2-c.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS, withSaturationCandidateAuthorities } from "./saturation-candidate-authorities.ts";
import type { CaeCausalWorld, CaeScenarioFamilyAuthority } from "./types.ts";

const RAW_WAVE2_FAMILIES: readonly CaeScenarioFamilyAuthority[] = Object.freeze([
  ...CAE_001_SATURATION_WAVE2_GROUP_A,
  ...CAE_001_SATURATION_WAVE2_GROUP_B,
  ...CAE_001_SATURATION_WAVE2_GROUP_C,
]);

/** Nine additional families / forty-five variants; five chain families carry audited semantic candidate pools. */
export const CAE_001_SATURATION_WAVE2_FAMILIES: readonly CaeScenarioFamilyAuthority[] = Object.freeze(RAW_WAVE2_FAMILIES.map(withSaturationCandidateAuthorities));
export const CAE_001_SATURATION_WAVE2_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE2_FAMILIES.map((family) => family.id));
export const CAE_001_SATURATION_WAVE2_VARIANT_COUNT = CAE_001_SATURATION_WAVE2_FAMILIES.reduce((sum, family) => sum + family.variants.length, 0);
export const CAE_001_SATURATION_EFFECTIVE_FAMILY_COUNT = 9 + CAE_001_SATURATION_WAVE1_FAMILIES.length + CAE_001_SATURATION_WAVE2_FAMILIES.length;
export const CAE_001_SATURATION_EFFECTIVE_VARIANT_COUNT = 27 + CAE_001_SATURATION_WAVE1_VARIANT_COUNT + CAE_001_SATURATION_WAVE2_VARIANT_COUNT;

const CHAIN_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE2_FAMILIES.filter((family) => family.topology === "DIRECT_CHAIN").map((family) => family.id));
const COMMON_OR_INDEPENDENT_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE2_FAMILIES.filter((family) => family.topology === "BRANCHING_COMMON_CAUSE" || family.topology === "PARALLEL_CHAINS").map((family) => family.id));
const CORRELATION_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE2_FAMILIES.filter((family) => family.topology === "PARALLEL_CHAINS").map((family) => family.id));
const CANDIDATE_READY_IDS = Object.freeze(CHAIN_FAMILY_IDS.filter((id) => CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS.includes(id)));

const ADDITIONS_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "CAE-QL-001": CHAIN_FAMILY_IDS,
  "CAE-QL-002": COMMON_OR_INDEPENDENT_FAMILY_IDS,
  "CAE-QL-003": CANDIDATE_READY_IDS,
  "CAE-QL-004": CANDIDATE_READY_IDS,
  "CAE-QL-005": CANDIDATE_READY_IDS,
  "CAE-QL-006": CHAIN_FAMILY_IDS,
  "CAE-QL-007": CORRELATION_FAMILY_IDS,
  "CAE-QL-008": CHAIN_FAMILY_IDS,
  "CAE-QL-009": CANDIDATE_READY_IDS,
});

let installed = false;

function installWave2Only(): void {
  if (installed) return;
  const families = CAE_001_SCENARIO_FAMILIES as CaeScenarioFamilyAuthority[];
  const worlds = CAE_001_CAUSAL_WORLDS as CaeCausalWorld[];

  for (const family of CAE_001_SATURATION_WAVE2_FAMILIES) {
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

/** Scoped reviewed overlay; both saturation waves are restored after every call. */
export function withCae001SaturationWave2<T>(operation: () => T): T {
  return withCae001SaturationWave1(() => {
    if (installed) return operation();
    const families = CAE_001_SCENARIO_FAMILIES as CaeScenarioFamilyAuthority[];
    const worlds = CAE_001_CAUSAL_WORLDS as CaeCausalWorld[];
    const familyLength = families.length;
    const worldLength = worlds.length;
    const planLengths = new Map(CAE_001_PROJECTION_AUTHORITIES.map((plan) => [plan.id, plan.compatibleFamilyIds.length]));

    installWave2Only();
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

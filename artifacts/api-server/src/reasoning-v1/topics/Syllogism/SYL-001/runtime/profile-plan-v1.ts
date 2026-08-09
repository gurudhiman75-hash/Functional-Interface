import {
  SYL_CANONICAL_ARCHETYPES_V2,
} from "../source-authority/ql-archetype-consolidation-v2";
import { SYL_EXAM_TARGET_MIX_V2 } from "../source-authority/source-profile-closeout-v2";
import type { SylQlId } from "./types";

export type SylPlanningProfileV1 =
  | "SSC"
  | "BANKING"
  | "PUNJAB_POLICE"
  | "CROSS_EXAM_PRACTICE";

export type SylPlanSlotReadinessV1 =
  | "ACTIVE_CANONICAL"
  | "BLOCKED_REMODEL"
  | "PRACTICE_ONLY";

export interface SylProfileFamilyBindingV1 {
  familyId: string;
  archetypeId: string;
  scenarioVariant: string;
  readiness: SylPlanSlotReadinessV1;
}

export interface SylProfilePlanSlotV1 {
  index: number;
  cycle: number;
  sourcePercentileSlot: number;
  familyId: string;
  archetypeId: string;
  canonicalQlId: SylQlId | null;
  scenarioVariant: string;
  readiness: SylPlanSlotReadinessV1;
}

export interface SylProfilePlanV1 {
  authority: "SYL_001_PROFILE_PLAN_V1";
  profile: SylPlanningProfileV1;
  seed: number;
  requestedCount: number;
  slots: readonly SylProfilePlanSlotV1[];
  readinessCounts: Readonly<Record<SylPlanSlotReadinessV1, number>>;
  familyCounts: Readonly<Record<string, number>>;
  activationPermitted: false;
}

const FAMILY_BINDINGS: readonly SylProfileFamilyBindingV1[] = Object.freeze([
  {
    familyId: "SSC_TWO_CONCLUSION_FOUR_OPTION",
    archetypeId: "SYL-A-FOUR-OPTION-TWO-CONCLUSION",
    scenarioVariant: "SSC_CORE",
    readiness: "ACTIVE_CANONICAL",
  },
  {
    familyId: "SSC_SINGLE_DEFINITE_SELECTION",
    archetypeId: "SYL-A-SSC-SINGLE-DEFINITE",
    scenarioVariant: "SSC_CORE",
    readiness: "ACTIVE_CANONICAL",
  },
  {
    familyId: "SSC_COMPLEMENTARY_PAIR",
    archetypeId: "SYL-A-FOUR-OPTION-TWO-CONCLUSION",
    scenarioVariant: "SSC_COMPLEMENTARY_PAIR",
    readiness: "ACTIVE_CANONICAL",
  },
  {
    familyId: "SSC_THREE_CONCLUSION_ADVANCED",
    archetypeId: "SYL-A-FOUR-OPTION-THREE-CONCLUSION",
    scenarioVariant: "CROSS_ADAPTED_ADVANCED",
    readiness: "PRACTICE_ONLY",
  },
  {
    familyId: "BANK_TWO_CONCLUSION_FIVE_OPTION",
    archetypeId: "SYL-A-BANK-FIVE-OPTION-TWO-CONCLUSION",
    scenarioVariant: "BANK_CORE",
    readiness: "ACTIVE_CANONICAL",
  },
  {
    familyId: "BANK_EITHER_OR_COMPLEMENTARY",
    archetypeId: "SYL-A-BANK-FIVE-OPTION-TWO-CONCLUSION",
    scenarioVariant: "BANK_EITHER_OR",
    readiness: "ACTIVE_CANONICAL",
  },
  {
    familyId: "BANK_POSSIBILITY_IN_CONCLUSION_SET",
    archetypeId: "SYL-A-BANK-POSSIBILITY-IN-CONCLUSION-SET",
    scenarioVariant: "BANK_POSSIBILITY",
    readiness: "BLOCKED_REMODEL",
  },
  {
    familyId: "BANK_ONLY_AND_ONLY_A_FEW",
    archetypeId: "SYL-A-BANK-FIVE-OPTION-TWO-CONCLUSION",
    scenarioVariant: "BANK_SPECIAL_FORM",
    readiness: "ACTIVE_CANONICAL",
  },
  {
    familyId: "BANK_THREE_CONCLUSION_ADVANCED",
    archetypeId: "SYL-A-FOUR-OPTION-THREE-CONCLUSION",
    scenarioVariant: "BANK_ADVANCED",
    readiness: "ACTIVE_CANONICAL",
  },
  {
    familyId: "CROSS_THREE_CONCLUSION_COMBINATION",
    archetypeId: "SYL-A-FOUR-OPTION-THREE-CONCLUSION",
    scenarioVariant: "CROSS_CORE",
    readiness: "ACTIVE_CANONICAL",
  },
  {
    familyId: "CROSS_MIXED_PRACTICE",
    archetypeId: "SYL-A-PRACTICE-MIXED-TWO-CONCLUSION",
    scenarioVariant: "CROSS_MIXED_PRACTICE",
    readiness: "PRACTICE_ONLY",
  },
  {
    familyId: "PUNJAB_POLICE_TWO_CONCLUSION_FOUR_OPTION",
    archetypeId: "SYL-A-FOUR-OPTION-TWO-CONCLUSION",
    scenarioVariant: "PUNJAB_POLICE_CLASSICAL",
    readiness: "ACTIVE_CANONICAL",
  },
  {
    familyId: "PUNJAB_POLICE_THREE_CONCLUSION_FOUR_OPTION",
    archetypeId: "SYL-A-FOUR-OPTION-THREE-CONCLUSION",
    scenarioVariant: "PUNJAB_POLICE_CLASSICAL_ADVANCED",
    readiness: "ACTIVE_CANONICAL",
  },
]);

function sourceMixProfile(profile: SylPlanningProfileV1): "SSC" | "BANKING" | "PUNJAB" | "CROSS_EXAM" {
  if (profile === "PUNJAB_POLICE") return "PUNJAB";
  if (profile === "CROSS_EXAM_PRACTICE") return "CROSS_EXAM";
  return profile;
}

function stringHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextState(state: number): number {
  let value = state || 0x9e3779b9;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return value >>> 0;
}

function shuffledPercentiles(profile: SylPlanningProfileV1, seed: number, cycle: number): number[] {
  const values = Array.from({ length: 100 }, (_, index) => index);
  let state = stringHash(`${profile}:${seed}:${cycle}`);
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = nextState(state);
    const target = state % (index + 1);
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

function expandedFamilies(profile: SylPlanningProfileV1): string[] {
  const sourceProfile = sourceMixProfile(profile);
  const mix = SYL_EXAM_TARGET_MIX_V2.find((entry) => entry.profile === sourceProfile);
  if (!mix || mix.status !== "PROVISIONAL_SOURCE_BACKED") {
    throw new Error(`No provisional source-backed mix for ${profile}`);
  }
  const families = mix.entries.flatMap((entry) =>
    Array.from({ length: entry.weight }, () => entry.familyId));
  if (families.length !== 100) {
    throw new Error(`${profile} mix must expand to exactly 100 percentile slots`);
  }
  return families;
}

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

export function buildSylProfilePlanV1(
  profile: SylPlanningProfileV1,
  seed: number,
  requestedCount: number,
): SylProfilePlanV1 {
  if (!Number.isSafeInteger(seed)) throw new Error("seed must be a safe integer");
  if (!Number.isSafeInteger(requestedCount) || requestedCount < 1 || requestedCount > 1000) {
    throw new Error("requestedCount must be an integer from 1 through 1000");
  }

  const families = expandedFamilies(profile);
  const bindingByFamily = new Map(FAMILY_BINDINGS.map((entry) => [entry.familyId, entry]));
  const archetypeById = new Map(SYL_CANONICAL_ARCHETYPES_V2.map((entry) => [entry.archetypeId, entry]));
  const slots: SylProfilePlanSlotV1[] = [];
  const readinessCounts: Record<SylPlanSlotReadinessV1, number> = {
    ACTIVE_CANONICAL: 0,
    BLOCKED_REMODEL: 0,
    PRACTICE_ONLY: 0,
  };
  const familyCounts: Record<string, number> = {};

  for (let cycle = 0; slots.length < requestedCount; cycle += 1) {
    const order = shuffledPercentiles(profile, seed, cycle);
    for (const sourcePercentileSlot of order) {
      if (slots.length >= requestedCount) break;
      const familyId = families[sourcePercentileSlot];
      const binding = bindingByFamily.get(familyId);
      if (!binding) throw new Error(`No family binding for ${familyId}`);
      const archetype = archetypeById.get(binding.archetypeId);
      if (!archetype) throw new Error(`No archetype for ${binding.archetypeId}`);

      slots.push({
        index: slots.length,
        cycle,
        sourcePercentileSlot,
        familyId,
        archetypeId: binding.archetypeId,
        canonicalQlId: archetype.canonicalLegacyQlId,
        scenarioVariant: binding.scenarioVariant,
        readiness: binding.readiness,
      });
      increment(readinessCounts, binding.readiness);
      increment(familyCounts, familyId);
    }
  }

  return {
    authority: "SYL_001_PROFILE_PLAN_V1",
    profile,
    seed,
    requestedCount,
    slots,
    readinessCounts,
    familyCounts,
    activationPermitted: false,
  };
}

export const SYL_PROFILE_PLAN_V1 = Object.freeze({
  authorityId: "SYL_001_PROFILE_PLAN_V1",
  status: "PLANNER_ONLY_NOT_CONNECTED_TO_GENERATOR",
  supportedProfiles: ["SSC", "BANKING", "PUNJAB_POLICE", "CROSS_EXAM_PRACTICE"] as const,
  familyBindingCount: FAMILY_BINDINGS.length,
  activationPermitted: false,
});

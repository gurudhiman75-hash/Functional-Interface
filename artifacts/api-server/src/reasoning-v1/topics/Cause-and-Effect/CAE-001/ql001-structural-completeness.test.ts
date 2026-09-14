import assert from "node:assert/strict";
import {
  CAE_001_PROJECTION_AUTHORITIES,
  CAE_001_SCENARIO_FAMILIES,
  materializeCae001World,
} from "./causal-world-authorities.ts";
import { withCae001SaturationWave2 } from "./causal-world-saturation-wave2.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { generateReviewedCaeSourceProfileQuestion } from "./reviewed-source-profiles.ts";
import type { CaeQuestionProfile } from "./types.ts";

const QL_ID = "CAE-QL-001" as const;
const PLAN_ID = "CAE-PLAN-DIRECT";
const SWEEP = 10_000;
const REJECTED_FRAGMENT = "variant:drill|graph:HIDDEN_CHAIN|direction:bridge>effect";

function structuralId(question: Readonly<{ causalStateId: string }>): string {
  return question.causalStateId
    .replace(/\|editorial-remap:\d+->\d+$/u, "")
    .replace(/\|source-profile-editorial-remap:\d+->\d+$/u, "");
}

function stateIdFor(
  familyId: string,
  variantId: string,
  topology: string,
  fromSlot: string,
  toSlot: string,
  visibleSlots: readonly string[],
): string {
  return [
    `projection:${PLAN_ID}`,
    `family:${familyId}`,
    `variant:${variantId}`,
    `graph:${topology}`,
    `direction:${fromSlot}>${toSlot}`,
    `visible:${visibleSlots.join(",")}`,
  ].join("|");
}

function enumerateExpectedSafeStates(): readonly string[] {
  return withCae001SaturationWave2(() => {
    const plan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === QL_ID);
    assert.ok(plan);
    assert.equal(plan.id, PLAN_ID);
    const states: string[] = [];
    for (const familyId of plan.compatibleFamilyIds) {
      const family = CAE_001_SCENARIO_FAMILIES.find((entry) => entry.id === familyId);
      assert.ok(family, `${familyId}: QL001 family missing from scoped registry`);
      assert.ok(family.allowedProjectionKinds.includes("DIRECT_RELATIONSHIP"));
      for (const variant of family.variants) {
        const world = materializeCae001World(family, variant);
        for (const edge of world.edges) {
          const from = world.nodes.find((node) => node.id === edge.from)!;
          const to = world.nodes.find((node) => node.id === edge.to)!;
          for (const visible of [[from.semanticSlot, to.semanticSlot], [to.semanticSlot, from.semanticSlot]] as const) {
            const id = stateIdFor(family.id, variant.id, family.topology, from.semanticSlot, to.semanticSlot, visible);
            if (id.includes(REJECTED_FRAGMENT)) continue;
            states.push(id);
          }
        }
      }
    }
    return states;
  });
}

const expected = enumerateExpectedSafeStates();
const expectedSet = new Set(expected);
assert.equal(expectedSet.size, expected.length, "QL001 theoretical direct-state enumeration contains duplicate identities");
assert.equal(expectedSet.size, 394, `QL001 safe theoretical state ceiling drifted (${expectedSet.size})`);

function sweep(profile: CaeQuestionProfile) {
  const seen = new Set<string>();
  const answers = new Set<string>();
  const families = new Set<string>();
  const variants = new Set<string>();
  let completeSeed: number | null = null;
  for (let seed = 0; seed < SWEEP; seed += 1) {
    const question = generateReviewedCaeQuestion({ qlId: QL_ID, locale: "en-IN", seed, questionProfile: profile });
    const normalized = structuralId(question);
    assert.ok(!normalized.includes(REJECTED_FRAGMENT), `${profile}/${seed}: rejected QL001 drill bridge→effect state escaped the reviewed quality guard`);
    assert.ok(expectedSet.has(normalized), `${profile}/${seed}: reviewed QL001 state is outside the theoretical safe direct-state space: ${normalized}`);
    seen.add(normalized);
    answers.add(question.answerId);
    families.add(question.scenarioFamilyId);
    variants.add(`${question.scenarioFamilyId}|${question.scenarioVariantId}`);
    if (completeSeed === null && seen.size === expectedSet.size) completeSeed = seed;
  }
  return { seen, answers, families, variants, completeSeed };
}

const fourWay = sweep("FOUR_WAY");
assert.equal(fourWay.seen.size, expectedSet.size, `QL001 four-way reached ${fourWay.seen.size}/${expectedSet.size} safe direct states`);
assert.deepEqual(fourWay.answers, new Set(["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST"]));
assert.ok(fourWay.completeSeed !== null, "QL001 four-way did not complete the finite safe state space");

const fiveWay = sweep("FIVE_WAY");
assert.equal(fiveWay.seen.size, expectedSet.size, `QL001 five-way reached ${fiveWay.seen.size}/${expectedSet.size} safe direct states`);
assert.deepEqual(fiveWay.answers, new Set(["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST"]));
assert.ok(fiveWay.completeSeed !== null, "QL001 five-way did not complete the finite safe state space");
assert.deepEqual(fiveWay.families, fourWay.families, "QL001 profile choice changed family coverage");
assert.deepEqual(fiveWay.variants, fourWay.variants, "QL001 profile choice changed variant coverage");

const SOURCE_PROFILES = [
  "CLASSIC_BANK_FIVE_RELATION",
  "PUNJAB_POLICE_SI_2016_FOUR_RELATION",
  "SSC_SELECTION_POST_DIRECT_RECOGNITION",
] as const;
for (const sourceProfileId of SOURCE_PROFILES) {
  for (let seed = 0; seed < 2_000; seed += 1) {
    const question = generateReviewedCaeSourceProfileQuestion({ qlId: QL_ID, locale: "en-IN", seed, sourceProfileId });
    assert.ok(!structuralId(question).includes(REJECTED_FRAGMENT), `${sourceProfileId}/${seed}: reviewed source-profile facade resurfaced rejected QL001 drill bridge→effect state`);
  }
}

console.log("PASS_CAE_QL001_STRUCTURAL_COMPLETENESS", {
  theoreticalSafeStates: expectedSet.size,
  families: fourWay.families.size,
  variants: fourWay.variants.size,
  fourWayCompleteSeed: fourWay.completeSeed,
  fiveWayCompleteSeed: fiveWay.completeSeed,
  sourceProfilesChecked: SOURCE_PROFILES.length,
});
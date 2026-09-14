import assert from "node:assert/strict";
import {
  CAE_001_PROJECTION_AUTHORITIES,
  CAE_001_SCENARIO_FAMILIES,
  materializeCae001World,
} from "./causal-world-authorities.ts";
import { withCae001SaturationWave2 } from "./causal-world-saturation-wave2.ts";
import { CAE_COMBINATION_SCENARIOS } from "./cp003004-combination.ts";
import { CAE_EXPANDED_COMBINATION_SCENARIOS } from "./cp003004-expanded-combination.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";

const QL_ID = "CAE-QL-004" as const;
const BASE_PROJECTION = "CAE-PLAN-PROBABLE-EFFECT";
const LEGACY_COMBINATION_PROJECTION = "CAE-PLAN-PROBABLE-EFFECT-COMBINATION";
const EXPANDED_COMBINATION_FAMILY = "CAE-FAM-POSSIBLE-EFFECT-COMBINATION-EVIDENCE";
const LEGACY_COMBINATION_FAMILY = "CAE-FAM-POSSIBLE-EFFECT-COMBINATION";
const SWEEP = 20_000;

function normalizeState(id: string): string {
  return id.replace(/\|reviewed-saturation-remap:\d+->\d+$/u, "");
}

function probableEffectStateId(
  familyId: string,
  variantId: string,
  topology: string,
  fromSlot: string,
  toSlot: string,
): string {
  return [
    `projection:${BASE_PROJECTION}`,
    `family:${familyId}`,
    `variant:${variantId}`,
    `graph:${topology}`,
    `direction:${fromSlot}>${toSlot}`,
    `visible:${fromSlot}`,
  ].join("|");
}

function directEffectStatesForFamily(family: (typeof CAE_001_SCENARIO_FAMILIES)[number]): readonly string[] {
  const states: string[] = [];
  for (const variant of family.variants) {
    const world = materializeCae001World(family, variant);
    for (const edge of world.edges) {
      const from = world.nodes.find((node) => node.id === edge.from)!;
      const to = world.nodes.find((node) => node.id === edge.to)!;
      states.push(probableEffectStateId(family.id, variant.id, family.topology, from.semanticSlot, to.semanticSlot));
    }
  }
  return states;
}

const basePlan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === QL_ID);
assert.ok(basePlan);
assert.equal(basePlan.id, BASE_PROJECTION);
assert.deepEqual(
  basePlan.compatibleFamilyIds,
  ["CAE-FAM-OPERATIONS-CHAIN", "CAE-FAM-SHARED-PRESSURE", "CAE-FAM-DIAGNOSTIC-DISRUPTION", "CAE-FAM-CIVIC-SEQUENCE"],
  "QL004 frozen base-family contract drifted",
);

const expectedBaseStates = new Set<string>();
for (const familyId of basePlan.compatibleFamilyIds) {
  const family = CAE_001_SCENARIO_FAMILIES.find((entry) => entry.id === familyId);
  assert.ok(family);
  for (const state of directEffectStatesForFamily(family)) expectedBaseStates.add(state);
}
assert.equal(expectedBaseStates.size, 33, `QL004 base probable-effect ceiling drifted (${expectedBaseStates.size})`);

const expectedSaturationStates = withCae001SaturationWave2(() => {
  const states = new Set<string>();
  for (const familyId of CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS) {
    const family = CAE_001_SCENARIO_FAMILIES.find((entry) => entry.id === familyId);
    assert.ok(family, `${familyId}: candidate-ready family missing under Wave2 scope`);
    assert.equal(family.topology, "DIRECT_CHAIN", `${familyId}: QL004 candidate-heavy authority must remain chain-based`);
    for (const state of directEffectStatesForFamily(family)) states.add(state);
  }
  return states;
});
assert.equal(expectedSaturationStates.size, 75, `QL004 candidate-heavy probable-effect ceiling drifted (${expectedSaturationStates.size})`);

const expectedLegacyCombination = new Set(CAE_COMBINATION_SCENARIOS.filter((entry) => entry.qlId === QL_ID).map((entry) => entry.id));
const expectedExpandedCombination = new Set(CAE_EXPANDED_COMBINATION_SCENARIOS.filter((entry) => entry.qlId === QL_ID).map((entry) => entry.id));
assert.equal(expectedLegacyCombination.size, 6, "QL004 legacy combination scenario count drifted");
assert.equal(expectedExpandedCombination.size, 6, "QL004 expanded combination scenario count drifted");

const seenBase = new Set<string>();
const seenSaturation = new Set<string>();
const seenLegacyCombination = new Set<string>();
const seenExpandedCombination = new Set<string>();
const difficultyByNormalizedState = new Map<string, Set<string>>();
let allStructuralCompleteSeed: number | null = null;

for (let seed = 0; seed < SWEEP; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: QL_ID, locale: "en-IN", seed });
  const normalized = normalizeState(question.causalStateId);
  const difficulties = difficultyByNormalizedState.get(normalized) ?? new Set<string>();
  difficulties.add(question.difficulty);
  difficultyByNormalizedState.set(normalized, difficulties);

  if (question.projectionId === BASE_PROJECTION) {
    if (expectedBaseStates.has(normalized)) seenBase.add(normalized);
    else if (expectedSaturationStates.has(normalized)) seenSaturation.add(normalized);
    else assert.fail(`${seed}: QL004 probable-effect state escaped base + candidate-heavy structural authorities: ${normalized}`);
  } else if (question.projectionId === LEGACY_COMBINATION_PROJECTION) {
    if (question.scenarioFamilyId === LEGACY_COMBINATION_FAMILY) {
      assert.ok(expectedLegacyCombination.has(question.scenarioVariantId), `${seed}: unknown legacy QL004 combination scenario`);
      seenLegacyCombination.add(question.scenarioVariantId);
    } else if (question.scenarioFamilyId === EXPANDED_COMBINATION_FAMILY) {
      assert.ok(expectedExpandedCombination.has(question.scenarioVariantId), `${seed}: unknown expanded QL004 combination scenario`);
      seenExpandedCombination.add(question.scenarioVariantId);
    } else {
      assert.fail(`${seed}: QL004 combination used unexpected family ${question.scenarioFamilyId}`);
    }
  } else {
    assert.fail(`${seed}: QL004 reviewed projection escaped approved operation set (${question.projectionId})`);
  }

  if (
    allStructuralCompleteSeed === null
    && seenBase.size === expectedBaseStates.size
    && seenSaturation.size === expectedSaturationStates.size
    && seenLegacyCombination.size === expectedLegacyCombination.size
    && seenExpandedCombination.size === expectedExpandedCombination.size
  ) allStructuralCompleteSeed = seed;
}

assert.equal(seenBase.size, expectedBaseStates.size, `QL004 base reachability ${seenBase.size}/${expectedBaseStates.size}`);
assert.equal(seenSaturation.size, expectedSaturationStates.size, `QL004 candidate-heavy reachability ${seenSaturation.size}/${expectedSaturationStates.size}`);
assert.equal(seenLegacyCombination.size, expectedLegacyCombination.size, `QL004 legacy combination reachability ${seenLegacyCombination.size}/${expectedLegacyCombination.size}`);
assert.equal(seenExpandedCombination.size, expectedExpandedCombination.size, `QL004 expanded combination reachability ${seenExpandedCombination.size}/${expectedExpandedCombination.size}`);
assert.ok(allStructuralCompleteSeed !== null, "QL004 did not complete its current reviewed structural authority set");

const multiDifficultyStates = [...difficultyByNormalizedState.entries()].filter(([, values]) => values.size > 1);
console.log("PASS_CAE_QL004_STRUCTURAL_COVERAGE", {
  baseProbableEffectStates: expectedBaseStates.size,
  candidateHeavyProbableEffectStates: expectedSaturationStates.size,
  legacyCombinationScenarios: expectedLegacyCombination.size,
  expandedCombinationScenarios: expectedExpandedCombination.size,
  totalStructuralForms: expectedBaseStates.size + expectedSaturationStates.size + expectedLegacyCombination.size + expectedExpandedCombination.size,
  completeSeed: allStructuralCompleteSeed,
  multiDifficultyStates: multiDifficultyStates.length,
});
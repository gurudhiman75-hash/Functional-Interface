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

const QL_ID = "CAE-QL-003" as const;
const BASE_PROJECTION = "CAE-PLAN-PROBABLE-CAUSE";
const COMBINATION_PROJECTION = "CAE-PLAN-PROBABLE-CAUSE-COMBINATION";
const LEGACY_COMBINATION_FAMILY = "CAE-FAM-POSSIBLE-CAUSE-COMBINATION";
const EXPANDED_COMBINATION_FAMILY = "CAE-FAM-POSSIBLE-CAUSE-COMBINATION-EVIDENCE";
const SWEEP = 30_000;

function normalizeState(id: string): string {
  return id.replace(/\|reviewed-saturation-remap:\d+->\d+$/u, "");
}

function probableCauseStateId(
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
    `visible:${toSlot}`,
  ].join("|");
}

function directCauseStatesForFamily(family: (typeof CAE_001_SCENARIO_FAMILIES)[number]): readonly string[] {
  const states: string[] = [];
  for (const variant of family.variants) {
    const world = materializeCae001World(family, variant);
    for (const edge of world.edges) {
      const from = world.nodes.find((node) => node.id === edge.from)!;
      const to = world.nodes.find((node) => node.id === edge.to)!;
      states.push(probableCauseStateId(family.id, variant.id, family.topology, from.semanticSlot, to.semanticSlot));
    }
  }
  return states;
}

const basePlan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === QL_ID);
assert.ok(basePlan, "QL003 frozen projection authority missing");
assert.equal(basePlan.id, BASE_PROJECTION);

const expectedBaseStates = new Set<string>();
for (const familyId of basePlan.compatibleFamilyIds) {
  const family = CAE_001_SCENARIO_FAMILIES.find((entry) => entry.id === familyId);
  assert.ok(family, `${familyId}: QL003 base family missing`);
  for (const state of directCauseStatesForFamily(family)) expectedBaseStates.add(state);
}
assert.ok(expectedBaseStates.size > 0, "QL003 base probable-cause authority is empty");

const expectedSaturationStates = withCae001SaturationWave2(() => {
  const states = new Set<string>();
  for (const familyId of CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS) {
    const family = CAE_001_SCENARIO_FAMILIES.find((entry) => entry.id === familyId);
    assert.ok(family, `${familyId}: candidate-ready family missing under Wave2 scope`);
    assert.equal(family.topology, "DIRECT_CHAIN", `${familyId}: QL003 candidate-heavy authority must remain chain-based`);
    for (const state of directCauseStatesForFamily(family)) states.add(state);
  }
  return states;
});
assert.ok(expectedSaturationStates.size > 0, "QL003 candidate-heavy authority is empty");

const expectedLegacyCombination = new Set(CAE_COMBINATION_SCENARIOS.filter((entry) => entry.qlId === QL_ID).map((entry) => entry.id));
const expectedExpandedCombination = new Set(CAE_EXPANDED_COMBINATION_SCENARIOS.filter((entry) => entry.qlId === QL_ID).map((entry) => entry.id));
assert.equal(expectedLegacyCombination.size, 4, "QL003 legacy combination scenario count drifted");
assert.equal(expectedExpandedCombination.size, 6, "QL003 expanded combination scenario count drifted");

const seenBase = new Set<string>();
const seenSaturation = new Set<string>();
const seenLegacyCombination = new Set<string>();
const seenExpandedCombination = new Set<string>();
const difficultyByState = new Map<string, Set<string>>();
let completeSeed: number | null = null;

for (let seed = 0; seed < SWEEP; seed += 1) {
  const q = generateReviewedCaeQuestion({ qlId: QL_ID, locale: "en-IN", seed });
  const state = normalizeState(q.causalStateId);
  const difficulties = difficultyByState.get(state) ?? new Set<string>();
  difficulties.add(q.difficulty);
  difficultyByState.set(state, difficulties);

  if (q.projectionId === BASE_PROJECTION) {
    if (expectedBaseStates.has(state)) seenBase.add(state);
    else if (expectedSaturationStates.has(state)) seenSaturation.add(state);
    else assert.fail(`${seed}: QL003 probable-cause state escaped approved base + candidate-heavy authorities: ${state}`);
  } else if (q.projectionId === COMBINATION_PROJECTION) {
    if (q.scenarioFamilyId === LEGACY_COMBINATION_FAMILY) {
      assert.ok(expectedLegacyCombination.has(q.scenarioVariantId), `${seed}: unknown legacy QL003 combination scenario`);
      seenLegacyCombination.add(q.scenarioVariantId);
    } else if (q.scenarioFamilyId === EXPANDED_COMBINATION_FAMILY) {
      assert.ok(expectedExpandedCombination.has(q.scenarioVariantId), `${seed}: unknown expanded QL003 combination scenario`);
      seenExpandedCombination.add(q.scenarioVariantId);
    } else {
      assert.fail(`${seed}: QL003 combination used unexpected family ${q.scenarioFamilyId}`);
    }
  } else {
    assert.fail(`${seed}: QL003 reviewed projection escaped approved operation set (${q.projectionId})`);
  }

  if (
    completeSeed === null
    && seenBase.size === expectedBaseStates.size
    && seenSaturation.size === expectedSaturationStates.size
    && seenLegacyCombination.size === expectedLegacyCombination.size
    && seenExpandedCombination.size === expectedExpandedCombination.size
  ) completeSeed = seed;
}

assert.equal(seenBase.size, expectedBaseStates.size, `QL003 base reachability ${seenBase.size}/${expectedBaseStates.size}`);
assert.equal(seenSaturation.size, expectedSaturationStates.size, `QL003 candidate-heavy reachability ${seenSaturation.size}/${expectedSaturationStates.size}`);
assert.equal(seenLegacyCombination.size, expectedLegacyCombination.size, `QL003 legacy combination reachability ${seenLegacyCombination.size}/${expectedLegacyCombination.size}`);
assert.equal(seenExpandedCombination.size, expectedExpandedCombination.size, `QL003 expanded combination reachability ${seenExpandedCombination.size}/${expectedExpandedCombination.size}`);
assert.ok(completeSeed !== null, "QL003 did not complete its current reviewed structural authority set");

const overlap = [...expectedBaseStates].filter((state) => expectedSaturationStates.has(state));
const multiDifficultyStates = [...difficultyByState.values()].filter((values) => values.size > 1).length;
console.log("PASS_CAE_QL003_STRUCTURAL_COVERAGE", {
  baseProbableCauseStates: expectedBaseStates.size,
  candidateHeavyProbableCauseStates: expectedSaturationStates.size,
  overlapStates: overlap.length,
  legacyCombinationScenarios: expectedLegacyCombination.size,
  expandedCombinationScenarios: expectedExpandedCombination.size,
  totalAuthorityEntries: expectedBaseStates.size + expectedSaturationStates.size - overlap.length + expectedLegacyCombination.size + expectedExpandedCombination.size,
  completeSeed,
  multiDifficultyStates,
});

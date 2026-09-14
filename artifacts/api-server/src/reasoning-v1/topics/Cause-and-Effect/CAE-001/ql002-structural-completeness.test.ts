import assert from "node:assert/strict";
import { causalPath, nodeById, solveCaeRelationship } from "./causal-solver.ts";
import {
  CAE_001_PROJECTION_AUTHORITIES,
  CAE_001_SCENARIO_FAMILIES,
  materializeCae001World,
} from "./causal-world-authorities.ts";
import { withCae001SaturationWave4 } from "./causal-world-saturation-wave4.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeQuestionProfile } from "./types.ts";

const QL_ID = "CAE-QL-002" as const;
const PLAN_ID = "CAE-PLAN-COMMON-INDEPENDENT";
const SWEEP = 5000;

type Relation = "COMMON_CAUSE" | "INDEPENDENT_CAUSES" | "INDEPENDENT_EFFECTS";

type ExpectedState = Readonly<{
  id: string;
  relation: Relation;
  familyId: string;
  variantId: string;
}>;

function stateIdFor(
  familyId: string,
  variantId: string,
  topology: string,
  directionSlots: readonly string[],
  visibleSlots: readonly string[],
): string {
  return [
    `projection:${PLAN_ID}`,
    `family:${familyId}`,
    `variant:${variantId}`,
    `graph:${topology}`,
    `direction:${directionSlots.join(">")}`,
    `visible:${visibleSlots.join(",")}`,
  ].join("|");
}

function enumerateExpectedStates(): readonly ExpectedState[] {
  return withCae001SaturationWave4(() => {
    const plan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === QL_ID);
    assert.ok(plan, "QL002 projection authority missing");
    assert.equal(plan.id, PLAN_ID);

    const expected: ExpectedState[] = [];
    for (const familyId of plan.compatibleFamilyIds) {
      const family = CAE_001_SCENARIO_FAMILIES.find((entry) => entry.id === familyId);
      assert.ok(family, `${familyId}: compatible QL002 family missing from scoped registry`);
      assert.ok(
        family.topology === "BRANCHING_COMMON_CAUSE" || family.topology === "PARALLEL_CHAINS",
        `${family.id}: QL002 must remain a common-cause/independence classifier, saw ${family.topology}`,
      );

      for (const variant of family.variants) {
        const world = materializeCae001World(family, variant);
        const effects = world.nodes.filter((node) => node.role === "EFFECT");
        const causes = world.nodes.filter((node) => node.role === "CAUSE");

        for (let firstIndex = 0; firstIndex < effects.length; firstIndex += 1) {
          for (let secondIndex = firstIndex + 1; secondIndex < effects.length; secondIndex += 1) {
            const first = effects[firstIndex]!;
            const second = effects[secondIndex]!;
            const relation = solveCaeRelationship(world, first.id, second.id);
            if (relation === "COMMON_CAUSE") {
              const ancestor = world.nodes.find((node) => causalPath(world, node.id, first.id) && causalPath(world, node.id, second.id));
              assert.ok(ancestor, `${world.id}: common-cause pair missing common ancestor`);
              expected.push({
                id: stateIdFor(family.id, variant.id, family.topology, [ancestor.semanticSlot], [first.semanticSlot, second.semanticSlot]),
                relation,
                familyId: family.id,
                variantId: variant.id,
              });
            } else if (relation === "INDEPENDENT_EFFECTS") {
              expected.push({
                id: stateIdFor(family.id, variant.id, family.topology, [first.semanticSlot, second.semanticSlot], [first.semanticSlot, second.semanticSlot]),
                relation,
                familyId: family.id,
                variantId: variant.id,
              });
            }
          }
        }

        for (let firstIndex = 0; firstIndex < causes.length; firstIndex += 1) {
          for (let secondIndex = firstIndex + 1; secondIndex < causes.length; secondIndex += 1) {
            const first = causes[firstIndex]!;
            const second = causes[secondIndex]!;
            const relation = solveCaeRelationship(world, first.id, second.id);
            if (relation !== "INDEPENDENT_CAUSES") continue;
            expected.push({
              id: stateIdFor(family.id, variant.id, family.topology, [first.semanticSlot, second.semanticSlot], [first.semanticSlot, second.semanticSlot]),
              relation,
              familyId: family.id,
              variantId: variant.id,
            });
          }
        }
      }
    }
    return expected;
  });
}

const expectedStates = enumerateExpectedStates();
const expectedIds = new Set(expectedStates.map((entry) => entry.id));
assert.equal(expectedIds.size, expectedStates.length, "QL002 theoretical state enumeration contains duplicate identities");

const expectedByRelation = new Map<Relation, number>();
for (const entry of expectedStates) expectedByRelation.set(entry.relation, (expectedByRelation.get(entry.relation) ?? 0) + 1);
assert.ok((expectedByRelation.get("COMMON_CAUSE") ?? 0) > 0, "QL002 lost common-cause states");
assert.ok((expectedByRelation.get("INDEPENDENT_CAUSES") ?? 0) > 0, "QL002 lost independent-cause states");
assert.ok((expectedByRelation.get("INDEPENDENT_EFFECTS") ?? 0) > 0, "QL002 lost independent-effect states");

function sweep(profile: CaeQuestionProfile) {
  const seen = new Set<string>();
  const answers = new Set<string>();
  const families = new Set<string>();
  const variants = new Set<string>();
  let firstCompleteSeed: number | null = null;
  for (let seed = 0; seed < SWEEP; seed += 1) {
    const question = generateReviewedCaeQuestion({ qlId: QL_ID, locale: "en-IN", seed, questionProfile: profile });
    assert.ok(expectedIds.has(question.causalStateId), `${profile}/${seed}: generated QL002 state is outside the theoretical common/independent state space`);
    seen.add(question.causalStateId);
    answers.add(question.answerId);
    families.add(question.scenarioFamilyId);
    variants.add(question.scenarioVariantId);
    if (firstCompleteSeed === null && seen.size === expectedIds.size) firstCompleteSeed = seed;
  }
  return { seen, answers, families, variants, firstCompleteSeed };
}

const fourWay = sweep("FOUR_WAY");
assert.equal(fourWay.seen.size, expectedIds.size, `QL002 four-way sweep reached ${fourWay.seen.size}/${expectedIds.size} theoretical states`);
assert.deepEqual(fourWay.answers, new Set(["COMMON_CAUSE", "INDEPENDENT"]), "QL002 four-way answer contract drifted");
assert.ok(fourWay.firstCompleteSeed !== null && fourWay.firstCompleteSeed < 1200, `QL002 four-way theoretical state space does not saturate cleanly (complete seed ${fourWay.firstCompleteSeed})`);

const fiveWay = sweep("FIVE_WAY");
assert.equal(fiveWay.seen.size, expectedIds.size, `QL002 five-way sweep reached ${fiveWay.seen.size}/${expectedIds.size} theoretical states`);
assert.deepEqual(
  fiveWay.answers,
  new Set(["COMMON_CAUSE", "INDEPENDENT_CAUSES", "INDEPENDENT_EFFECTS"]),
  "QL002 five-way source profile must keep independent causes and independent effects distinct",
);
assert.ok(fiveWay.firstCompleteSeed !== null && fiveWay.firstCompleteSeed < 1200, `QL002 five-way theoretical state space does not saturate cleanly (complete seed ${fiveWay.firstCompleteSeed})`);

assert.deepEqual(fourWay.families, fiveWay.families, "QL002 profile choice changed family coverage");
assert.deepEqual(fourWay.variants, fiveWay.variants, "QL002 profile choice changed variant coverage");

// Spot-check that the relationship claimed by each generated state is graph-native,
// not inferred from wording or option labels.
withCae001SaturationWave4(() => {
  for (let seed = 0; seed < 256; seed += 1) {
    const question = generateReviewedCaeQuestion({ qlId: QL_ID, locale: "en-IN", seed, questionProfile: "FIVE_WAY" });
    const family = CAE_001_SCENARIO_FAMILIES.find((entry) => entry.id === question.scenarioFamilyId)!;
    const variant = family.variants.find((entry) => entry.id === question.scenarioVariantId)!;
    const world = materializeCae001World(family, variant);
    const [first, second] = question.visibleContext.visibleNodeIds;
    assert.ok(first && second);
    const graphRelation = solveCaeRelationship(world, first, second);
    assert.equal(question.answerId, graphRelation, `${seed}: QL002 five-way answer is not the graph-native relationship`);
    assert.ok(question.stem.includes(nodeById(world, first).text["en-IN"]));
    assert.ok(question.stem.includes(nodeById(world, second).text["en-IN"]));
  }
});

console.log("PASS_CAE_QL002_STRUCTURAL_COMPLETENESS", {
  theoreticalStates: expectedIds.size,
  byRelation: Object.fromEntries(expectedByRelation),
  families: fourWay.families.size,
  variants: fourWay.variants.size,
  fourWayCompleteSeed: fourWay.firstCompleteSeed,
  fiveWayCompleteSeed: fiveWay.firstCompleteSeed,
});
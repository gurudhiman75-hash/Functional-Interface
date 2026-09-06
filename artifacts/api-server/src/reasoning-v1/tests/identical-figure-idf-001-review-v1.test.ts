import assert from "node:assert/strict";
import { IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/identical-figure-source-saturated-discovery-v1";
import {
  IDENTICAL_FIGURE_PERMANENT_QL_ALLOCATIONS_V13,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v13";
import { generateIdenticalFigureReviewQuestionV1 } from "../foundation/spatial/identical-figure-review-runtime-v1";

assert.equal(IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.chapterCode, "IDF-001");
assert.equal(IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.canonicalTaskFamilies.length, 3);
assert.equal(IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.decision.figureClassificationBoundaryPreserved, true);
assert.equal(IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.decision.figureMatrixGroupingLeakClosed, true);
assert.equal(IDENTICAL_FIGURE_PERMANENT_QL_ALLOCATIONS_V13.length, 3);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.permanentQlCount, 63);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.nextAvailablePermanentQlId, "SPA-QL-064");

const qls = ["SPA-QL-061", "SPA-QL-062", "SPA-QL-063"] as const;
const languages = ["en", "hi", "pa"] as const;
const seeds = Array.from({ length: 96 }, (_, index) => `idf-review-${index + 1}`);
const componentModes = new Set<string>();
const topologyRelations = new Set<string>();
const transformPolicies = new Set<string>();
let hardCount = 0;
let multilingualChecks = 0;

for (const qlId of qls) {
  for (const seed of seeds) {
    const english = generateIdenticalFigureReviewQuestionV1({ qlId, seed, language: "en" });
    const repeat = generateIdenticalFigureReviewQuestionV1({ qlId, seed, language: "en" });
    assert.deepEqual(repeat, english, `${qlId}/${seed} must be exactly deterministic`);
    assert.equal(english.chapterCode, "IDF-001");
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.normalizedKey)).size, 4, `${qlId}/${seed} options must be unique`);
    assert.ok(english.correctIndex >= 0 && english.correctIndex < 4);
    assert.equal(english.answer, english.optionLabels[english.correctIndex]);
    assert.equal(english.solveFacts.bankSize, 9);
    assert.equal(english.solveFacts.groupCount, 3);
    assert.equal(english.solveFacts.figuresPerGroup, 3);
    assert.equal(english.solveFacts.distractorFailures.length, 3);
    assert.equal(english.validation.groupKeysRecomputedFromSemanticState, true);
    assert.equal(english.validation.everyFigureUsedExactlyOnce, true);
    assert.equal(english.validation.correctPartitionUnique, true);
    assert.equal(english.validation.everyDistractorBreaksAtLeastOneGroup, true);
    assert.equal(english.lifecycle.reviewOnly, true);
    assert.equal(english.lifecycle.questionStudioDiscoverable, false);
    assert.equal(english.lifecycle.mockTestEligible, false);
    assert.equal(english.lifecycle.publicReleaseAuthorized, false);
    assert.equal(english.lifecycle.studentDeliveryAuthorized, false);

    for (const option of english.options) {
      const numbers = option.groups.flatMap((group) => [...group]).sort((a, b) => a - b);
      assert.deepEqual(numbers, [1, 2, 3, 4, 5, 6, 7, 8, 9], `${qlId}/${seed} option must use every figure exactly once`);
      assert.equal(option.groups.length, 3);
      assert.ok(option.groups.every((group) => group.length === 3));
    }

    const correct = english.options[english.correctIndex];
    const keyByNumber = new Map(english.solveFacts.semanticKeysByFigure.map((row) => [row.number, row.key]));
    for (const group of correct.groups) {
      assert.equal(new Set(group.map((number) => keyByNumber.get(number))).size, 1, `${qlId}/${seed} correct group must be semantically pure`);
    }

    const keys = english.solveFacts.semanticKeysByFigure.map((row) => row.key);
    if (qlId === "SPA-QL-061") {
      const prefix = keys[0]?.split(":")[0];
      componentModes.add(prefix);
      assert.ok(keys.every((key) => key.startsWith(`${prefix}:`)));
    } else if (qlId === "SPA-QL-062") {
      for (const key of keys) topologyRelations.add(key.replace("TOPOLOGY:", ""));
    } else {
      assert.ok(english.solveFacts.transformPolicy);
      transformPolicies.add(english.solveFacts.transformPolicy!);
      hardCount += 1;
    }

    for (const language of languages) {
      const question = generateIdenticalFigureReviewQuestionV1({ qlId, seed, language });
      assert.equal(question.geometryFingerprint, english.geometryFingerprint, `${qlId}/${seed}/${language} geometry parity`);
      assert.equal(question.correctIndex, english.correctIndex, `${qlId}/${seed}/${language} answer parity`);
      assert.equal(question.solveFacts.correctPartitionKey, english.solveFacts.correctPartitionKey, `${qlId}/${seed}/${language} grouping parity`);
      assert.ok(question.stem.length > 30);
      assert.ok(question.explanation.observation.length > 25);
      assert.ok(question.explanation.application.length > 30);
      assert.ok(question.explanation.check.length > 20);
      assert.equal(question.explanation.groupTable.length, 3);
      assert.ok(question.explanation.solutionSvg.includes("<svg"));
      multilingualChecks += 1;
    }
  }
}

assert.deepEqual([...componentModes].sort(), ["INNER", "OUTER", "PARTITION"], "component grouping must cover outer, inner and partition identity");
assert.deepEqual([...topologyRelations].sort(), ["CONTAINED", "CROSSING", "PARTIAL_OVERLAP"], "topology grouping must cover the three source-backed relation families");
assert.deepEqual([...transformPolicies].sort(), ["ROTATION_ONLY", "ROTATION_OR_REFLECTION"], "transform grouping must cover both declared equivalence policies");
assert.equal(hardCount, seeds.length);

console.log(JSON.stringify({
  authority: "SPA-IDF-001-REVIEW-V1",
  qls,
  seedsPerQl: seeds.length,
  generatedEnglishQuestions: qls.length * seeds.length,
  multilingualChecks,
  componentModes: [...componentModes].sort(),
  topologyRelations: [...topologyRelations].sort(),
  transformPolicies: [...transformPolicies].sort(),
  sourceGroupingSurfaceRetained: true,
  releaseGatesRemainClosed: true,
}, null, 2));

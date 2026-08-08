import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  applySpatialAnalogyRule,
  areSpatialAnalogyStatesEqual,
  buildSpatialAnalogyEditorialReviewExport,
  buildSpatialAnalogyEditorialReviewHtml,
  renderSpatialSceneToSvg,
  spatialAnalogyStateFingerprint,
  validateSpatialScene,
  type SpatialAnalogyProofQuestion,
} from "../foundation/spatial";
import { buildSpatialFan001ProofCorpus } from "../proofs/spa-fnd-001-fan-001-corpus";

function assertLifecycleLocked(question: SpatialAnalogyProofQuestion): void {
  assert.equal(question.lifecycle.permanentQlId, null);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

function assertSanitisedSvg(svg: string): void {
  assert.match(svg, /^<svg /);
  assert.doesNotMatch(svg, /<script|foreignObject|javascript:/i);
}

function assertQuestion(question: SpatialAnalogyProofQuestion): void {
  assert.equal(question.familyCode, "SPA-001");
  assert.equal(question.chapterCode, "FAN-001");
  assert.equal(question.instructionKey, "FAN_SELECT_FIGURE_COMPLETING_ANALOGY");
  assert.equal(question.options.length, 4);
  assert(question.correctOptionIndex >= 0 && question.correctOptionIndex < 4);
  assert.deepEqual(question.solverEvidence.inferredRuleIds, [question.ruleId]);
  assert.equal(question.solverEvidence.ambiguityCheck, "PASS");
  assert.equal(question.reviewMetadata.ambiguityCheck, "PASS");
  assert.equal(question.reviewMetadata.optionUniquenessCheck, "PASS");
  assert.equal(question.reviewMetadata.localeMode, "LANGUAGE_NEUTRAL");
  assert.equal(question.explanationSteps.length, 4);
  assert(question.learnerExplanation.observation.length > 25);
  assert(question.learnerExplanation.rule.length > 25);
  assert(question.learnerExplanation.application.length > 25);
  assert(question.learnerExplanation.check.length > 25);
  assertLifecycleLocked(question);

  const expected = applySpatialAnalogyRule(question.cState, question.ruleId);
  assert(expected);
  const correctOption = question.options[question.correctOptionIndex]!;
  assert.equal(correctOption.label, "CORRECT_RULE_APPLICATION");
  assert.equal(correctOption.appliedRuleId, question.ruleId);
  assert.equal(
    areSpatialAnalogyStatesEqual(expected!, correctOption.state),
    true,
  );
  assert.equal(
    spatialAnalogyStateFingerprint(expected!),
    question.solverEvidence.stateFingerprints.correct,
  );

  assert.equal(
    new Set(question.options.map((option) => option.stateFingerprint)).size,
    4,
  );
  assert.equal(
    new Set(question.options.map((option) => option.sceneFingerprint)).size,
    4,
  );
  assert.equal(
    question.options.filter(
      (option) => option.label === "CORRECT_RULE_APPLICATION",
    ).length,
    1,
  );

  for (const scene of [
    question.aScene,
    question.bScene,
    question.cScene,
    ...question.options.map((option) => option.scene),
  ]) {
    const validation = validateSpatialScene(scene);
    assert.equal(validation.ok, true, JSON.stringify(validation.errors));
    assertSanitisedSvg(renderSpatialSceneToSvg(scene));
  }
}

const firstCorpus = buildSpatialFan001ProofCorpus();
const secondCorpus = buildSpatialFan001ProofCorpus();

assert.deepEqual(firstCorpus, secondCorpus);
assert.equal(firstCorpus.length, 10);

for (const question of firstCorpus) {
  assertQuestion(question);
}

assert.deepEqual(
  firstCorpus.map((question) => question.ruleId),
  [
    "ROTATE_90_CW",
    "ROTATE_180",
    "REFLECT_VERTICAL",
    "MOVE_MARKER_CLOCKWISE",
    "ADD_SEGMENT",
    "REMOVE_SEGMENT",
    "SUBSTITUTE_INNER_NEXT",
    "TOGGLE_INNER_SHADING",
    "SWAP_INNER_OUTER",
    "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING",
  ],
);

const answerSequence = firstCorpus.map(
  (question) => question.correctOptionIndex,
);
assert.deepEqual(answerSequence, [0, 1, 2, 3, 0, 1, 2, 3, 0, 1]);
for (let index = 1; index < answerSequence.length; index += 1) {
  assert.notEqual(answerSequence[index], answerSequence[index - 1]);
}
const answerPositions = answerSequence.reduce(
  (counts, position) => {
    counts[position] += 1;
    return counts;
  },
  [0, 0, 0, 0],
);
assert.deepEqual(answerPositions, [3, 3, 2, 2]);

assert.equal(
  new Set(firstCorpus.map((question) => question.seed)).size,
  firstCorpus.length,
);
assert.equal(
  new Set(
    firstCorpus.flatMap((question) => [
      question.solverEvidence.stateFingerprints.a,
      question.solverEvidence.stateFingerprints.b,
      question.solverEvidence.stateFingerprints.c,
    ]),
  ).size >= 20,
  true,
);

const compoundQuestions = firstCorpus.filter(
  (question) =>
    question.reviewMetadata.ruleComplexity === "COMPOUND_TWO_STEP",
);
assert.equal(compoundQuestions.length, 1);
assert.equal(
  compoundQuestions[0]!.ruleId,
  "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING",
);
assert(
  compoundQuestions[0]!.options.some(
    (option) => option.label === "PARTIAL_RULE_ROTATION_ONLY",
  ),
);
assert(
  compoundQuestions[0]!.options.some(
    (option) => option.label === "PARTIAL_RULE_SHADING_ONLY",
  ),
);

const review = buildSpatialAnalogyEditorialReviewExport(firstCorpus);
assert.equal(review.schemaVersion, "1.0");
assert.equal(review.chapterCode, "FAN-001");
assert.equal(review.questionCount, 10);
assert.equal(review.rows.length, 10);
assert(
  review.rows.every(
    (row) =>
      row.aSvg.startsWith("<svg ") &&
      row.bSvg.startsWith("<svg ") &&
      row.cSvg.startsWith("<svg ") &&
      row.optionSvgs.length === 4,
  ),
);

const html = buildSpatialAnalogyEditorialReviewHtml(review);
assert.match(html, /^<!doctype html>/);
assert.match(html, /FAN-001 Figure Analogy Proof Review/);
assert.match(html, /Choose the figure that completes A : B :: C : \?/);
assert.doesNotMatch(html, /<script|javascript:/i);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fan-001-editorial-review.json",
  `${JSON.stringify(review, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fan-001-editorial-review.html",
  html,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SPA_FND_001_FAN_001_PROOF",
      corpus: {
        total: firstCorpus.length,
        answerPositions,
        answerSequence: answerSequence.map((position) =>
          String.fromCharCode(65 + position),
        ),
        rules: firstCorpus.map((question) => question.ruleId),
      },
      checks: {
        deterministicRegeneration: true,
        uniqueRuleInference: true,
        independentRuleApplication: true,
        semanticOptionUniqueness: true,
        sceneOptionUniqueness: true,
        balancedNonRepeatingAnswerSequence: true,
        learnerExplanation: true,
        responsiveEditorialReview: true,
        lifecycleIsolation: true,
      },
    },
    null,
    2,
  ),
);

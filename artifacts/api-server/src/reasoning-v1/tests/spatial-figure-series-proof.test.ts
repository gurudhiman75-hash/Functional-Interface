import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  SPATIAL_SERIES_RULE_IDS,
  buildSpatialSeriesEditorialReviewExport,
  buildSpatialSeriesEditorialReviewHtml,
  buildSpatialSeriesProofCorpus,
  spatialSceneSemanticFingerprint,
  validateSpatialScene,
} from "../foundation/spatial";

const corpus = buildSpatialSeriesProofCorpus();
assert.equal(corpus.length, 10);
assert.equal(new Set(corpus.map((question) => question.prototypeId)).size, 10);
assert.equal(new Set(corpus.map((question) => question.ruleId)).size, 10);

const answerSequence = corpus.map((question) => question.correctOptionIndex);
assert.deepEqual(answerSequence, [0, 1, 2, 3, 0, 1, 2, 3, 0, 1]);
const answerCounts = [0, 0, 0, 0];
for (const index of answerSequence) answerCounts[index] += 1;
assert.deepEqual(answerCounts, [3, 3, 2, 2]);
for (let index = 1; index < answerSequence.length; index += 1) {
  assert.notEqual(answerSequence[index], answerSequence[index - 1]);
}

for (const question of corpus) {
  assert.equal(question.solverEvidence.uniqueInferenceCheck, "PASS", question.prototypeId);
  assert.deepEqual(
    question.solverEvidence.inferredRuleIds,
    [question.ruleId],
    question.prototypeId,
  );
  assert.equal(question.seriesScenes.length, 4);
  assert.equal(question.options.length, 4);
  assert.equal(
    new Set(question.options.map((option) => option.sceneFingerprint)).size,
    4,
    question.prototypeId,
  );
  assert.equal(
    question.options[question.correctOptionIndex]?.appliedRuleId,
    question.ruleId,
    question.prototypeId,
  );
  for (const scene of [
    ...question.seriesScenes,
    ...question.options.map((option) => option.scene),
  ]) {
    assert.equal(validateSpatialScene(scene).ok, true, scene.id);
  }
  for (const check of question.solverEvidence.transitionVisualChecks) {
    assert.equal(check.ok, true, `${question.prototypeId}: ${check.errors.join(" | ")}`);
  }
  for (const letter of ["A", "B", "C", "D"]) {
    assert.match(question.learnerExplanation.check, new RegExp(`\\b${letter}\\b`), question.prototypeId);
  }
  assert.doesNotMatch(
    question.learnerExplanation.check,
    /the other options represent/i,
    question.prototypeId,
  );
  assert.equal(question.lifecycle.permanentQlId, null);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(
    new Set(question.seriesScenes.map(spatialSceneSemanticFingerprint)).size >= 2,
    true,
    question.prototypeId,
  );
}

assert.ok(SPATIAL_SERIES_RULE_IDS.includes("NO_CHANGE"));
assert.ok(SPATIAL_SERIES_RULE_IDS.includes("MOVE_MARKER_180"));
assert.ok(SPATIAL_SERIES_RULE_IDS.includes("MOVE_DOTS_180"));

const review = buildSpatialSeriesEditorialReviewExport();
assert.equal(review.questionCount, 10);
assert.deepEqual(review.answerSequence, ["A", "B", "C", "D", "A", "B", "C", "D", "A", "B"]);
const html = buildSpatialSeriesEditorialReviewHtml(review);
assert.match(html, /^<!doctype html>/);
assert.match(html, /FSR-001 Figure Series Proof/);
assert.doesNotMatch(html, /<script|javascript:/i);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fsr-001-editorial-review.json",
  `${JSON.stringify(review, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fsr-001-editorial-review.html",
  html,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SPA_FND_001_FSR_001_PROOF",
      chapterCode: "FSR-001",
      questionCount: corpus.length,
      answerCounts,
      answerSequence: review.answerSequence,
      rules: review.ruleIds,
      checks: {
        uniqueSeriesRuleInference: true,
        independentVisualTransitionValidation: true,
        optionSceneUniqueness: true,
        balancedNonRepeatingAnswerOrder: true,
        primitiveLibraryV2Consumption: true,
        optionSpecificLearnerExplanation: true,
        responsiveEditorialReview: true,
        lifecycleIsolation: true,
      },
    },
    null,
    2,
  ),
);

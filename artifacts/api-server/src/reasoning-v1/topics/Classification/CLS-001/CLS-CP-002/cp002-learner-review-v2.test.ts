import assert from "node:assert/strict";
import { CLS_CP002_QL_ID } from "./cp002-permanent-contract";
import { generateClsCp002Question } from "./cp002-multilingual-runtime";
import { generateClsCp002LearnerReviewV2 } from "./cp002-learner-review-v2";
import type { ClsCp002Locale } from "./localization/cp002-language-pack";

const locales: readonly ClsCp002Locale[] = ["en-IN", "hi-IN", "pa-IN"];

let checked = 0;
for (const locale of locales) {
  for (let seed = 0; seed < 400; seed += 1) {
    const frozen = generateClsCp002Question(CLS_CP002_QL_ID, locale, seed);
    const learner = generateClsCp002LearnerReviewV2(CLS_CP002_QL_ID, locale, seed);

    assert.equal(learner.checkpointId, frozen.checkpointId);
    assert.equal(learner.qlId, frozen.qlId);
    assert.equal(learner.permanentQlId, frozen.permanentQlId);
    assert.equal(learner.seed, frozen.seed);
    assert.equal(learner.task, frozen.task);
    assert.equal(learner.generationProfile, frozen.generationProfile);
    assert.equal(learner.family, frozen.family);
    assert.equal(learner.stem, frozen.stem);
    assert.deepEqual(learner.pairs, frozen.pairs);
    assert.deepEqual(learner.options, frozen.options);
    assert.equal(learner.correctIndex, frozen.correctIndex);
    assert.equal(learner.answer, frozen.answer);
    assert.equal(learner.intendedRelationId, frozen.intendedRelationId);
    assert.equal(learner.intendedRelationLabel, frozen.intendedRelationLabel);
    assert.deepEqual(learner.evidenceByOption, frozen.evidenceByOption);
    assert.deepEqual(learner.ambiguityAudit, frozen.ambiguityAudit);
    assert.equal(learner.difficulty, frozen.difficulty);
    assert.deepEqual(learner.difficultyFeatures, frozen.difficultyFeatures);
    assert.deepEqual(learner.lifecycle, frozen.lifecycle);
    assert.equal(learner.reviewOnly, frozen.reviewOnly);
    assert.equal(learner.questionStudioVisible, frozen.questionStudioVisible);

    assert.deepEqual(learner.explanation.coreConcept, frozen.explanation.coreConcept);
    assert.deepEqual(learner.explanation.stepByStep, frozen.explanation.stepByStep);
    assert.equal(learner.explanation.stepByStep.length, 3);
    assert.equal(learner.explanation.examSpeedShortcut.length, 0);
    assert.equal(learner.explanation.commonTrapWarning.length, 0);

    const {
      learnerReviewVersion,
      learnerEditorialVersion,
      ...learnerMetadata
    } = learner.metadata;
    assert.deepEqual(learnerMetadata, frozen.metadata);
    assert.equal(learnerReviewVersion, "cls-cp002-learner-review-v2");
    assert.equal(learnerEditorialVersion, "compact-explanation-no-boilerplate-v2");

    const learnerText = [
      learner.stem,
      ...learner.explanation.coreConcept,
      ...learner.explanation.stepByStep,
    ].join("\n");
    assert.doesNotMatch(learnerText, /\b(?:shortcut|common trap|exam speed|candidate relation|quality rank)\b/i);
    assert.ok(learner.explanation.stepByStep.at(-1)?.includes(learner.answer));
    checked += 1;
  }
}

assert.equal(checked, locales.length * 400);
console.log("CLS-CP-002 compact learner review V2 audit passed.", {
  checked,
  frozenStateChanges: 0,
  shortcutTrapLearnerSections: false,
  routineOptionByOptionLearnerAnalysis: false,
});

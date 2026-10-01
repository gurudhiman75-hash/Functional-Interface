import assert from "node:assert/strict";

import { generateQuestion as generateSharedQuestionStudioQuestion } from "../../../../question-studio/shared-generation-engine";
import { WOR_001_PERMANENT_QL_IDS } from "./permanent-ql-registry";
import {
  WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES,
  WOR_001_QUESTION_STUDIO_SOURCE_DEFERRED_PROTOTYPE_IDS,
} from "./question-studio-production-authority";
import {
  previewWor001QuestionStudioReview,
  WOR_001_QUESTION_STUDIO_CATALOG,
} from "./question-studio-review";

const banned = /TODO|TBD|placeholder|prototype|structured[- ]prompt|solver|solution count|candidate state|transformed words|alphabet offset/iu;
const permanentQlIds = new Set<string>();
const observedPrototypes = new Set<string>();

for (const prototype of WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES) {
  const catalog = WOR_001_QUESTION_STUDIO_CATALOG.find((entry) => entry.prototypeId === prototype.prototypeId);
  assert.ok(catalog, `Missing Question Studio catalog entry for ${prototype.prototypeId}`);

  for (const difficulty of catalog.supportedDifficulties) {
    const localized = (["en", "hi", "pa"] as const).map((language) =>
      previewWor001QuestionStudioReview({
        language,
        prototypeId: prototype.prototypeId,
        difficulty,
        count: 1,
        seed: `wor-wave1:${prototype.prototypeId}:${difficulty}`,
      }).questions[0]!,
    );

    const [english, hindi, punjabi] = localized;
    for (const question of localized) {
      assert.equal(question.prototypeId, prototype.prototypeId);
      assert.equal(question.difficultyBand, difficulty);
      assert.ok(question.permanentQlId, `${prototype.prototypeId} unexpectedly lacks a permanent QL`);
      assert.equal(question.qlId, question.permanentQlId);
      assert.equal(question.validation.valid, true);
      assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
      assert.equal(new Set(question.options).size, question.options.length);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.ok(question.displayStem.length > 20);
      assert.ok(question.explanation.length > 30);
      assert.doesNotMatch(question.displayStem, banned, `${prototype.prototypeId}/${question.language} exposes internal wording in stem`);
      assert.doesNotMatch(question.explanation, banned, `${prototype.prototypeId}/${question.language} exposes internal wording in explanation`);
      const expectedOptions = question.checkpointId === "WOR-CP-005" ? 5 : 4;
      assert.equal(question.options.length, expectedOptions, `${prototype.prototypeId} option-count contract drifted`);
      permanentQlIds.add(question.permanentQlId);
      observedPrototypes.add(question.prototypeId);
    }

    assert.equal(hindi.permanentQlId, english.permanentQlId);
    assert.equal(punjabi.permanentQlId, english.permanentQlId);
    assert.equal(hindi.correctIndex, english.correctIndex);
    assert.equal(punjabi.correctIndex, english.correctIndex);
    assert.equal(hindi.difficultyBand, english.difficultyBand);
    assert.equal(punjabi.difficultyBand, english.difficultyBand);
    assert.equal(hindi.options.length, english.options.length);
    assert.equal(punjabi.options.length, english.options.length);
  }
}

assert.deepEqual(permanentQlIds, new Set(WOR_001_PERMANENT_QL_IDS));
assert.deepEqual(
  observedPrototypes,
  new Set(WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES.map((entry) => entry.prototypeId)),
);
assert.equal(WOR_001_QUESTION_STUDIO_SOURCE_DEFERRED_PROTOTYPE_IDS.length, 9);

const live = await generateSharedQuestionStudioQuestion({
  packageId: "WOR-001",
  language: "en",
  count: WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES.length,
  seed: "wor-wave1-live-full-surface",
});
const livePackages = live.questionPackages as Array<{ prototypeId: string; permanentQlId: string | null }>;
assert.equal(livePackages.length, 15);
assert.deepEqual(
  new Set(livePackages.map((entry) => entry.prototypeId)),
  new Set(WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES.map((entry) => entry.prototypeId)),
);
assert.ok(livePackages.every((entry) => entry.permanentQlId !== null));
assert.ok(livePackages.every((entry) => !WOR_001_QUESTION_STUDIO_SOURCE_DEFERRED_PROTOTYPE_IDS.includes(entry.prototypeId as any)));

console.log("WOR-001 deep audit Wave 1 passed: all 15 frozen prototypes, supported difficulties, EN/HI/PA parity, all 8 permanent QLs and live shared-route boundary proved.");

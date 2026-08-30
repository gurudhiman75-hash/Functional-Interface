import assert from "node:assert/strict";

import { STC_V2_EDITORIAL_AUTHORITIES } from "./editorial-v2-authorities.ts";
import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE } from "./question-studio-review-v2.ts";
import { STC_QL_IDS } from "./types.ts";

const FORBIDDEN_LEARNER_TOKENS = [
  /scenarioId/iu,
  /surfaceArchetype/iu,
  /answerClass/iu,
  /questionStudio/iu,
  /canonical/iu,
  /prototype/iu,
  /generator/iu,
  /ql[-_ ]?\d/iu,
  /cp[-_ ]?\d/iu,
];

const INSTRUCTION_BOILERPLATE = [
  /^read the statement/iu,
  /which conclusion\(s\)/iu,
  /choose the correct option/iu,
  /given below/iu,
];

assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.localizationStatus, "TRILINGUAL_REVIEW_READY");
assert.deepEqual(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.locales, ["en-IN", "hi-IN", "pa-IN"]);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.localizedReviewSurfaceCount, 144);
assert.deepEqual(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles, ["FOUR_WAY", "FIVE_WAY_EITHER"]);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.dedicatedFiveWayEitherAuthorityCount, 8);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

assert.equal(STC_V2_EDITORIAL_AUTHORITIES.length, 48);
assert.equal(new Set(STC_V2_EDITORIAL_AUTHORITIES.map((entry) => entry.id)).size, 48);

const allGenerated = [];
for (const qlId of STC_QL_IDS) {
  const pool = STC_V2_EDITORIAL_AUTHORITIES.filter((entry) => entry.qlId === qlId);
  assert.equal(pool.length, 8, `${qlId}: exactly eight authorities required`);
  assert.equal(new Set(pool.map((entry) => entry.surfaceArchetype)).size, 8, `${qlId}: eight distinct surface archetypes required`);

  const answerCounts = new Map<string, number>();
  for (let seed = 0; seed < 8; seed += 1) {
    const question = generateStcV2EditorialQuestion({ qlId, locale: "en-IN", seed });
    const replay = generateStcV2EditorialQuestion({ qlId, locale: "en-IN", seed });
    assert.deepEqual(question, replay, `${qlId}/${seed}: deterministic replay failed`);
    allGenerated.push(question);

    answerCounts.set(question.answerClass, (answerCounts.get(question.answerClass) ?? 0) + 1);
    assert.equal(question.options.length, 4);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
    assert.equal(question.conclusions.length, 2);
    assert.notEqual(question.conclusions[0], question.conclusions[1], `${question.scenarioId}: conclusions must differ`);
    assert.ok(question.stem.length >= 45 && question.stem.length <= 280, `${question.scenarioId}: stem length outside review bounds`);
    assert.ok(question.conclusions.every((value) => value.length >= 18 && value.length <= 180), `${question.scenarioId}: conclusion length outside review bounds`);
    assert.ok(question.explanation.length >= 55 && question.explanation.length <= 420, `${question.scenarioId}: explanation length outside review bounds`);
    assert.match(question.explanation, /^I (follows|does not follow):/u);
    assert.match(question.explanation, / II (follows|does not follow):/u);

    const learnerSurface = [question.stem, ...question.conclusions, ...question.options, question.explanation].join("\n");
    for (const pattern of FORBIDDEN_LEARNER_TOKENS) {
      assert.doesNotMatch(learnerSurface, pattern, `${question.scenarioId}: internal token leaked to learner surface`);
    }
    for (const pattern of INSTRUCTION_BOILERPLATE) {
      assert.doesNotMatch(question.stem, pattern, `${question.scenarioId}: repeated instruction boilerplate returned`);
    }

    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.testEligible, false);
    assert.equal(question.metadata.mockEligible, false);
    assert.equal(question.metadata.publicEligible, false);
    assert.equal(question.metadata.automaticPublication, false);
  }

  assert.deepEqual(
    Object.fromEntries([...answerCounts.entries()].sort()),
    { BOTH: 2, NEITHER: 2, ONLY_I: 2, ONLY_II: 2 },
    `${qlId}: answer classes must remain balanced 2/2/2/2`,
  );
}

assert.equal(allGenerated.length, 48);
assert.equal(new Set(allGenerated.map((question) => question.scenarioId)).size, 48);
assert.equal(new Set(allGenerated.map((question) => question.stem)).size, 48);
assert.equal(new Set(allGenerated.flatMap((question) => question.conclusions)).size, 96, "All 96 V2 conclusions should be editorially distinct");

const byScenario = new Map(allGenerated.map((question) => [question.scenarioId, question]));
const sc039 = byScenario.get("STC-V2-SC-039")!;
assert.deepEqual(sc039.conclusions, [
  "Grade A carries more weight than Grade C.",
  "Grade B carries less weight than Grade A.",
]);
assert.notEqual(sc039.conclusions[0], "Grade C carries less weight than Grade A.");

const sc040 = byScenario.get("STC-V2-SC-040")!;
assert.deepEqual(sc040.conclusions, [
  "Arjun was faster than Karan.",
  "Mohit's time was lower than Karan's.",
]);
assert.notEqual(sc040.conclusions[1], "Karan was slower than Arjun.");

const sc047 = byScenario.get("STC-V2-SC-047")!;
assert.match(sc047.stem, /including the latest quarter/u);
assert.match(sc047.explanation, /In the latest quarter, disposal time fell/u);

const stemLengths = allGenerated.map((question) => question.stem.length);
assert.ok(Math.min(...stemLengths) >= 45);
assert.ok(Math.max(...stemLengths) <= 280);

console.log("PASS_STC_001_V2_ENGLISH_SURFACE_REVIEW_READINESS questions=48 conclusions=96 trilingualPackage=true");

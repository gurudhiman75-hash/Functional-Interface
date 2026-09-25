import assert from "node:assert/strict";

import { DIR_001_QLS, generateDirectionQuestion } from "./chapter-registry";
import { generateDirectionQuestionHindi, generateDirectionQuestionPunjabi } from "./localization";
import { DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1 } from "./DIR-001-MULTILINGUAL-FREEZE";
import {
  DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  generateDir001QuestionStudioBatch,
} from "./dir-001-question-studio-integration";

assert.equal(DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.status, "MULTILINGUAL_FROZEN");
assert.equal(DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.permanentQlCount, 44);
assert.equal(DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.checkpointCount, 8);
assert.deepEqual(DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.locales, ["en-IN", "hi-IN", "pa-IN"]);
assert.equal(
  DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.questionStudioAuthority,
  DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
);
assert.equal(DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.questionBankWritable, false);
assert.equal(DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.testEligible, false);
assert.equal(DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.mockTestEligible, false);
assert.equal(DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.publiclyPublishable, false);
assert.equal(DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.automaticStudentPublication, false);
assert.equal(DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.productionReleaseAuthorized, false);

const seeds = [0, 1, 2, 7, 17, 31, 63, 95, 127, 191, 255, 383] as const;
let parityCases = 0;
let diagramCases = 0;

for (const ql of DIR_001_QLS) {
  for (const seed of seeds) {
    const english = generateDirectionQuestion(ql.qlId, seed) as any;
    const hindi = generateDirectionQuestionHindi(ql.qlId, seed) as any;
    const punjabi = generateDirectionQuestionPunjabi(ql.qlId, seed) as any;

    assert.equal(hindi.qlId, english.qlId);
    assert.equal(punjabi.qlId, english.qlId);
    assert.equal(hindi.checkpointId, english.checkpointId);
    assert.equal(punjabi.checkpointId, english.checkpointId);
    assert.equal(hindi.ruleId, english.ruleId);
    assert.equal(punjabi.ruleId, english.ruleId);
    assert.equal(hindi.seed, english.seed);
    assert.equal(punjabi.seed, english.seed);
    assert.equal(hindi.difficulty, english.difficulty);
    assert.equal(punjabi.difficulty, english.difficulty);
    assert.deepEqual(hindi.structuredPrompt, english.structuredPrompt);
    assert.deepEqual(punjabi.structuredPrompt, english.structuredPrompt);
    assert.equal(hindi.correctIndex, english.correctIndex);
    assert.equal(punjabi.correctIndex, english.correctIndex);
    assert.deepEqual(hindi.correctAnswer, english.correctAnswer);
    assert.deepEqual(punjabi.correctAnswer, english.correctAnswer);
    assert.deepEqual(hindi.options.map((option: any) => option.value), english.options.map((option: any) => option.value));
    assert.deepEqual(punjabi.options.map((option: any) => option.value), english.options.map((option: any) => option.value));
    assert.equal(hindi.questionDiagram, undefined);
    assert.equal(punjabi.questionDiagram, undefined);

    assert.match(hindi.stem, /[ऀ-ॿ]/u);
    assert.match(punjabi.stem, /[਀-੿]/u);
    assert.equal(hindi.metadata.answerParityVerified, true);
    assert.equal(punjabi.metadata.answerParityVerified, true);

    if (english.explanation?.diagram) {
      diagramCases += 1;
      assert.ok(hindi.explanation?.diagram?.svg.includes("<svg"));
      assert.ok(punjabi.explanation?.diagram?.svg.includes("<svg"));
      assert.equal(hindi.explanation.diagram.kind, english.explanation.diagram.kind);
      assert.equal(punjabi.explanation.diagram.kind, english.explanation.diagram.kind);
    }

    parityCases += 1;
  }
}

const frozenPreview = await generateDir001QuestionStudioBatch({
  packageId: "DIR-001",
  language: "pa",
  count: 12,
  seed: "dir001-multilingual-freeze-question-studio",
});
assert.equal(frozenPreview.questions.length, 12);
for (const raw of frozenPreview.questions as Array<Record<string, any>>) {
  assert.equal(raw.packageId, "DIR-001");
  assert.equal(raw.registrationAuthorityId, DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1);
  assert.equal(raw.questionBankWritable, false);
  assert.equal(raw.testEligible, false);
  assert.equal(raw.mockTestEligible, false);
  assert.equal(raw.publiclyPublishable, false);
  assert.equal(raw.productionReleaseAuthorized, false);
  assert.equal(raw.validation.questionDiagramAbsent, true);
}

assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.questionBankWritable, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.testEligible, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.mockTestEligible, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.publiclyPublishable, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.productionReleaseAuthorized, false);

console.log(JSON.stringify({
  verdict: "PASS_DIR_001_MULTILINGUAL_FREEZE_V1",
  authority: DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.authorityId,
  parityCases,
  diagramCases,
  qlCount: DIR_001_QLS.length,
  seedCount: seeds.length,
  locales: DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.locales,
  downstreamReleaseStillLocked: true,
}, null, 2));

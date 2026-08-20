import assert from "node:assert/strict";
import {
  INT_CP007_QUESTION_STUDIO_CHECKPOINT_ID,
  INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
  INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewIntCp007QuestionStudioReview,
} from "./cp007-question-studio-review-adapter";
import { INT_CP007_ENGLISH_FREEZE_ID } from "./cp007-scheme-equivalence-english-v8-frozen";
import { INT_CP007_LOCALIZED_FREEZE_ID } from "./cp007-scheme-equivalence-localized-v5-frozen";
import { INT_CP007_QL_IDS } from "./cp007-scheme-equivalence-runtime-v3-final";

const LANGUAGES = ["en", "hi", "pa"] as const;
let questions = 0;
let deterministicChecks = 0;
let lifecycleChecks = 0;
let authorityChecks = 0;
let learnerChecks = 0;
let qlCoverageChecks = 0;

assert.equal(INT_CP007_QUESTION_STUDIO_PACKAGE_ID, "INT-001");
assert.equal(INT_CP007_QUESTION_STUDIO_CHECKPOINT_ID, "INT-CP-007");
assert.equal(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
assert.equal(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
assert.equal(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioDiscoverable, true);
assert.equal(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);

for (const language of LANGUAGES) {
  const all = previewIntCp007QuestionStudioReview({ language, seed: `cp007-qs-audit-${language}`, count: 35 });
  const replay = previewIntCp007QuestionStudioReview({ language, seed: `cp007-qs-audit-${language}`, count: 35 });
  assert.deepEqual(all, replay, `${language}: Question Studio preview is not deterministic`);
  deterministicChecks += 35;
  assert.equal(all.generationContext.integrationAuthority, INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY);
  assert.equal(all.generationContext.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(all.generationContext.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
  assert.equal(all.generationContext.questionBankStatus, "NOT_STORED");
  assert.equal(all.generationContext.questionBankWritable, false);
  assert.equal(all.generationContext.testEligible, false);
  assert.equal(all.generationContext.publiclyPublishable, false);
  const seen = new Set(all.questions.map((question) => question.qlId));
  assert.deepEqual([...INT_CP007_QL_IDS].sort(), [...seen].sort(), `${language}: incomplete CP007 QL coverage`);
  qlCoverageChecks += INT_CP007_QL_IDS.length;

  for (const question of all.questions) {
    assert.equal(question.packageId, "INT-001");
    assert.equal(question.canonicalProblemId, "INT-CP-007");
    assert.equal(question.integrationAuthority, INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY);
    assert.equal(question.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
    assert.equal(question.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.testEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.manualApprovalRequired, true);
    assert.equal(question.automaticStudentPublication, false);
    lifecycleChecks += 10;

    const expectedFreeze = language === "en" ? INT_CP007_ENGLISH_FREEZE_ID : INT_CP007_LOCALIZED_FREEZE_ID;
    assert.equal(question.sourceFreezeId, expectedFreeze);
    assert.equal(question.traceability.activeSourceFreezeId, expectedFreeze);
    assert.equal(question.validation.frozenAuthority, true);
    assert.equal(question.validation.learnerPayloadPreserved, true);
    assert.equal(question.validation.latexPreserved, true);
    assert.equal(question.validation.sourceLifecycleLocked, true);
    authorityChecks += 6;

    const text = [
      question.stem,
      ...question.options,
      question.explanation.keyIdea,
      ...question.explanation.steps,
      question.explanation.conclusion,
      question.explanation.commonTrap,
    ].join("\n");
    assert.ok(!text.includes("ब्याज हर वर्ष मूलधन में जुड़ता है"));
    assert.ok(!text.includes("ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ"));
    if (language === "pa") assert.ok(!text.includes("ਚੱਕਰਵੱਧੀ"));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.ok(!text.includes("INT-CP-004-HI-PA-v9-frozen"), "CP004 legacy authority leaked into CP007");
    learnerChecks += 7;
    questions += 1;
  }
}

for (const qlId of INT_CP007_QL_IDS) {
  for (const language of LANGUAGES) {
    const result = previewIntCp007QuestionStudioReview({ language, qlId, seed: `cp007-qs-ql-${qlId}-${language}`, count: 4 });
    assert.ok(result.questions.every((question) => question.qlId === qlId));
    qlCoverageChecks += result.questions.length;
  }
}

console.log(JSON.stringify({
  integrationAuthority: INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  packageId: INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
  checkpointId: INT_CP007_QUESTION_STUDIO_CHECKPOINT_ID,
  qls: INT_CP007_QL_IDS.length,
  languages: LANGUAGES,
  questions,
  deterministicChecks,
  lifecycleChecks,
  authorityChecks,
  learnerChecks,
  qlCoverageChecks,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP007_QUESTION_STUDIO_REVIEW_AUDIT");

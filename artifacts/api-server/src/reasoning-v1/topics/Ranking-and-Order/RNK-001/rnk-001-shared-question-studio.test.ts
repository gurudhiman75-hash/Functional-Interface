import assert from "node:assert/strict";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry";
import {
  generateQuestion as generateSharedQuestionStudioQuestion,
  listQuestionStudioPackages,
} from "../../../../question-studio/shared-generation-engine";
import { auditRnkExamModeMix } from "./rnk-001-exam-delivery-policy-v1";
import {
  RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
  RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  listRnk001QuestionStudioQlIds,
  previewRnk001QuestionStudioReview,
} from "./question-studio-review";

async function run() {
  const qls = listRnk001QuestionStudioQlIds();
  assert.equal(qls.length, 42);
  assert.deepEqual(qls, Array.from({ length: 42 }, (_, index) => `RNK-QL-${String(index + 1).padStart(3, "0")}`));

  const registry = listReasoningV1QuestionStudioReviewPackages();
  const registered = registry.find((entry) => entry.packageId === "RNK-001") as any;
  assert.ok(registered, "RNK-001 must be registered in the shared Reasoning Question Studio registry");
  assert.equal(registered.reviewOnly, true);
  assert.deepEqual(registered.supportedLanguages, ["en"]);
  assert.equal(registered.permanentQlCount, 42);
  assert.equal(registered.questionBankWritable, false);
  assert.equal(registered.testEligible, false);
  assert.equal(registered.publiclyPublishable, false);
  assert.equal(registered.releaseFreezeStatus, RNK_001_QUESTION_STUDIO_RELEASE_FREEZE);

  const enabled = listEnabledReasoningV1QuestionStudioPackages();
  assert.ok(enabled.some((entry) => entry.packageId === "RNK-001"));

  const coverage = previewRnk001QuestionStudioReview({
    language: "en",
    examProfileId: "CHAPTER_COVERAGE",
    count: 42,
    seed: "rnk-all-ql-coverage",
  });
  assert.equal(coverage.questions.length, 42);
  assert.deepEqual(coverage.questions.map((question) => question.qlId), qls);
  for (const question of coverage.questions) {
    assert.equal(question.packageId, "RNK-001");
    assert.equal(question.language, "en");
    assert.equal(question.locale, "en-IN");
    assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
    assert.equal(question.questionStudioVisible, true);
    assert.equal(question.optionCount, 4);
    assert.equal(question.options.length, 4);
    assert.equal(question.validation.optionsDistinct, true, question.questionId);
    assert.equal(question.validation.valid, true, question.questionId);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
    assert.ok(question.stem.length > 10);
    assert.ok(question.explanation.length > 0);
  }

  for (const profile of ["SSC_CGL_T1", "PUNJAB_POLICE", "IBPS_PO_PRE"] as const) {
    const preview = previewRnk001QuestionStudioReview({
      language: "en",
      examProfileId: profile,
      count: 50,
      seed: `rnk-profile-${profile}`,
    });
    const mix = auditRnkExamModeMix(preview.questions.map((question) => question.qlId));
    assert.equal(mix.passesExamRealismGuard, true, `${profile}: ${mix.violations.join(",")}`);
    const expectedOptionCount = profile.startsWith("IBPS_") ? 5 : 4;
    assert.ok(preview.questions.every((question) => question.optionCount === expectedOptionCount));
    assert.ok(preview.questions.every((question) => question.validation.valid));
  }

  assert.throws(
    () => previewRnk001QuestionStudioReview({ language: "hi" as any, count: 1 }),
    /multilingual lineage is consolidated/u,
  );
  assert.throws(
    () => persistReasoningV1QuestionStudioReview({ packageId: "RNK-001", language: "en", count: 1 }),
    /Question Bank\/publication locks remain closed/u,
  );

  const registryPreview = previewReasoningV1QuestionStudioReview({
    packageId: "RNK-001",
    language: "en",
    qlId: "RNK-QL-001",
    count: 1,
    seed: "rnk-registry-preview",
  });
  assert.equal(registryPreview.questions[0]!.permanentQlId, "RNK-QL-001");

  const cockpit = listQuestionStudioPackages();
  const capability = cockpit.find((entry: any) => entry.packageId === "RNK-001") as any;
  assert.ok(capability, "RNK-001 must be exposed in normal Question Studio capabilities");
  assert.equal(capability.enabled, true);
  assert.equal(capability.permanentQlCount, 42);
  assert.deepEqual(capability.supportedLanguages, ["en"]);
  assert.equal(capability.questionBankWritable, false);
  assert.equal(capability.publiclyPublishable, false);
  assert.equal(capability.englishOnlyUntilMultilingualConsolidation, true);

  const shared = await generateSharedQuestionStudioQuestion({
    packageId: "RNK-001",
    patternId: "RNK-QL-010",
    language: "en",
    count: 3,
    seed: "rnk-shared-fixed-ql",
  });
  assert.equal(shared.questions.length, 3);
  assert.ok((shared.questions as any[]).every((question) => question.permanentQlId === "RNK-QL-010"));
  assert.ok((shared.questions as any[]).every((question) => question.questionBankWritable === false));
  assert.ok((shared.questions as any[]).every((question) => question.publiclyPublishable === false));

  const bank = await generateSharedQuestionStudioQuestion({
    packageId: "RNK-001",
    examProfileId: "IBPS_PO_PRE",
    language: "en",
    count: 20,
    seed: "rnk-shared-bank",
  });
  assert.ok((bank.questions as any[]).every((question) => question.options.length === 5));
  assert.ok((bank.questions as any[]).every((question) => question.optionDetails[4].text === "None of these"));

  const cp = await generateSharedQuestionStudioQuestion({
    packageId: "RNK-001",
    cpId: "RNK-CP-004",
    language: "en",
    count: 12,
    seed: "rnk-cp004-filter",
  });
  assert.ok((cp.questions as any[]).every((question) => question.checkpointId === "RNK-CP-004"));
  assert.ok((cp.questions as any[]).every((question) => Number(String(question.permanentQlId).slice(-3)) >= 27 && Number(String(question.permanentQlId).slice(-3)) <= 35));

  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.percentageAdapterStatus, "V2_NATIVE_GRAMMAR_PENDING_BRANCH_CONSOLIDATION");

  console.log(JSON.stringify({
    status: "PASS",
    qlCount: qls.length,
    releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
    supportedLanguages: RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages,
    bankOptionCount: 5,
    questionBankWritable: false,
    publiclyPublishable: false,
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

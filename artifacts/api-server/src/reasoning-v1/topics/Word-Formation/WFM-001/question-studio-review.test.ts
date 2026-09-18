import assert from "node:assert/strict";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry";
import { WFM_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import {
  WFM_001_QUESTION_STUDIO_PACKAGE_ID,
  WFM_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewWfm001QuestionStudioReview,
} from "./question-studio-review";
import { WFM_001_CHECKPOINT_IDS, WFM_001_QL_IDS } from "./runtime";
import type { WfmDifficulty, WfmLanguage, WfmQlId } from "./types";

const LANGUAGES: readonly WfmLanguage[] = ["en-IN", "hi-IN", "pa-IN"];
const DIFFICULTIES: readonly WfmDifficulty[] = ["EASY", "MEDIUM", "HARD"];

assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId, "WFM-001");
assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.productCode, "REAS-WFM");
assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.family, "SYMBOLIC_SEQUENCE");
assert.deepEqual(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.qlIds, [
  "WFM-QL-001",
  "WFM-QL-002",
  "WFM-QL-003",
  "WFM-QL-004",
]);
assert.deepEqual(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointIds, [
  "WFM-CP-001",
  "WFM-CP-002",
  "WFM-CP-003",
]);
assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);
assert.equal(WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.genericPersistenceAllowed, false);

assert.deepEqual(WFM_001_QL_IDS, WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.qlIds);
assert.deepEqual(WFM_001_CHECKPOINT_IDS, WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointIds);
assert.equal(WFM_001_QL_IDS.includes("WFM-QL-005" as WfmQlId), false, "WFM-QL-005 must not be implicitly reserved.");

const allPackages = listReasoningV1QuestionStudioReviewPackages();
const allWfm = allPackages.filter((entry) => entry.packageId === WFM_001_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(allWfm.length, 1, "Shared registry must contain exactly one WFM-001 package.");

const enabledPackages = listEnabledReasoningV1QuestionStudioPackages();
assert.equal(enabledPackages.some((entry) => entry.packageId === WFM_001_QUESTION_STUDIO_PACKAGE_ID), true, "WFM-001 must be visible in the enabled review list.");

let generated = 0;
const answerPositions = [0, 0, 0, 0];
const checkpoints = new Set<string>();
const renderers = new Set<string>();

for (const qlId of WFM_001_QL_IDS) {
  for (const difficulty of DIFFICULTIES) {
    for (const language of LANGUAGES) {
      const request = {
        packageId: WFM_001_QUESTION_STUDIO_PACKAGE_ID,
        qlId,
        difficulty,
        language,
        examProfile: "SSC_CGL_4" as const,
        seed: 91000 + Number(qlId.slice(-3)) * 101 + difficulty.charCodeAt(0) + language.length,
        count: 2,
      };
      const viaShared = previewReasoningV1QuestionStudioReview(request);
      const replay = previewReasoningV1QuestionStudioReview(request);
      const direct = previewWfm001QuestionStudioReview(request);

      assert.deepEqual(replay, viaShared, `${qlId}/${difficulty}/${language} shared preview must replay deterministically.`);
      assert.deepEqual(direct, viaShared, `${qlId}/${difficulty}/${language} direct/shared review wrappers must agree.`);
      assert.equal(viaShared.integrationAuthority, WFM_001_QUESTION_STUDIO_REVIEW_AUTHORITY);
      assert.equal(viaShared.reviewOnly, true);
      assert.equal(viaShared.questionStudioVisible, true);
      assert.equal(viaShared.questions.length, 2);

      for (const question of viaShared.questions) {
        assert.equal(question.packageId, "WFM-001");
        assert.equal(question.chapterId, "WFM-001");
        assert.equal(question.productCode, "REAS-WFM");
        assert.equal(question.qlId, qlId);
        assert.equal(question.difficulty, difficulty);
        assert.equal(question.language, language);
        assert.equal(question.questionStudioVisible, true);
        assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
        assert.equal(question.sourceRuntimeLifecycle.questionStudioVisible, false, "Raw WFM runtime must remain non-discoverable outside the guarded review wrapper.");
        assert.equal(question.sourceRuntimeLifecycle.questionBankStored, false);
        assert.equal(question.sourceRuntimeLifecycle.testEligible, false);
        assert.equal(question.sourceRuntimeLifecycle.mockTestEligible, false);
        assert.equal(question.sourceRuntimeLifecycle.publiclyPublishable, false);
        assert.equal(question.options.length, 4);
        assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
        const correctIndex = question.options.findIndex((option) => option.id === question.correctOptionId);
        assert(correctIndex >= 0);
        answerPositions[correctIndex] += 1;
        checkpoints.add(question.checkpointId);
        renderers.add(question.renderer);
        generated += 1;
      }
    }
  }
}

assert.equal(generated, 72, "Integration proof should cover 4 QLs × 3 difficulties × 3 languages × 2 samples.");
assert.deepEqual([...checkpoints].sort(), ["WFM-CP-001", "WFM-CP-002", "WFM-CP-003"]);
assert(renderers.has("FULL_SOURCE_WORD"));
assert(renderers.has("SELECTED_POSITION_COUNT"));
assert(renderers.has("JUMBLED_WORD") || renderers.has("NUMBERED_SEQUENCE"));
assert(answerPositions.every((count) => count > 0), `All answer positions must be exercised: ${answerPositions.join("/")}.`);

const raw = WFM_001_QUESTION_STUDIO_ADAPTER.generate({
  qlId: "WFM-QL-001",
  seed: 19091,
  language: "en-IN",
  difficulty: "HARD",
  examProfile: "SSC_CGL_4",
});
assert.equal(raw.metadata.questionStudioVisible, false);
assert.equal(raw.metadata.questionBankStored, false);
assert.equal(raw.metadata.testEligible, false);
assert.equal(raw.metadata.mockTestEligible, false);
assert.equal(raw.metadata.publiclyPublishable, false);

assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: "WFM-001",
    qlId: "WFM-QL-001",
    seed: 1,
    language: "en-IN",
  }),
  /persistence is disabled/i,
);

console.log(JSON.stringify({
  status: "WFM-001 SHARED QUESTION STUDIO GOVERNANCE PASSED",
  packageId: WFM_001_QUESTION_STUDIO_PACKAGE_ID,
  productCode: WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE.productCode,
  generated,
  qlIds: WFM_001_QL_IDS,
  checkpointIds: WFM_001_CHECKPOINT_IDS,
  languages: LANGUAGES,
  difficulties: DIFFICULTIES,
  answerPositions,
  renderers: [...renderers].sort(),
  lifecycle: {
    sharedReviewVisible: true,
    rawRuntimeVisible: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  },
}, null, 2));

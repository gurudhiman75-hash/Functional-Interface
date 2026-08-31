import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../../lib/admin-question-conversion";
import { COM001_DIFFICULTY_CLASSIFIER_VERSION_V2 } from "../../knowledge-v1/computer-awareness/com001-difficulty-routing-v2";
import { COM001_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-english-freeze-v2";
import { COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v2";
import { listCom001ReviewV2QlIds } from "../../knowledge-v1/computer-awareness/com001-review-synthesis-v2";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import {
  COM001_QUESTION_STUDIO_PACKAGE_ID,
  COM001_QUESTION_STUDIO_RUNTIME_MODE,
  COM001_REVIEW_CONTENT_AUTHORITY_VERSION,
  COM001_STANDARD_QUESTION_STUDIO_PACKAGE,
  knowledgeV1Com001QuestionStudioAdapter,
} from "./knowledge-v1-com001-adapter";

const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
const pkg = COM001_STANDARD_QUESTION_STUDIO_PACKAGE;
assert.equal(pkg.enabled, true);
assert.equal(pkg.engineId, "knowledge-v1");
assert.equal(pkg.runtimeMode, "review-only");
assert.equal(pkg.questionBankStatus, lifecycle.questionBankStatus);
assert.equal(pkg.testEligibility, lifecycle.testEligibility);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.metadata?.lifecycleId, lifecycle.lifecycleId);
assert.equal(pkg.metadata?.stage, "BANK_ONLY");
assert.equal(pkg.metadata?.questionBankWritable, true);
assert.equal(pkg.metadata?.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(pkg.metadata?.questionBankAcceptanceAuthority, lifecycle.lifecycleId);
assert.equal(pkg.metadata?.testEligible, false);
assert.equal(pkg.metadata?.mockTestEligible, false);
assert.equal(pkg.metadata?.publiclyPublishable, false);
assert.equal(pkg.metadata?.automaticStudentPublication, false);
assert.equal(pkg.metadata?.productionReleaseAuthorized, false);
assert.equal(pkg.metadata?.difficultyFilterSupported, true);
assert.equal(pkg.metadata?.difficultyClassifierVersion, COM001_DIFFICULTY_CLASSIFIER_VERSION_V2);
assert.equal(pkg.metadata?.productionDifficultyClaimsAuthorized, false);
assert.equal(pkg.metadata?.englishFreezeAuthorityId, COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId);
assert.equal(
  pkg.metadata?.localizationFreezeAuthorityId,
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
);

const qlIds = listCom001ReviewV2QlIds();
assert.equal(qlIds.length, 9);
let audited = 0;
let approvalChecks = 0;

for (const qlId of qlIds) {
  for (const language of ["en", "hi", "pa"] as const) {
    const request = {
      engineId: "knowledge-v1" as const,
      packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
      patternId: qlId,
      language,
      runtimeMode: COM001_QUESTION_STUDIO_RUNTIME_MODE,
      count: 40,
      seed: `question-studio-v2-batch:${qlId}:${language}`,
      difficulty: "Mixed" as const,
    };
    const first = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
    const replay = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
    assert.deepEqual(first, replay, `${qlId}/${language}: deterministic replay changed`);
    assert.equal(first.questions.length, 40);
    assert.equal(first.generationContext?.lifecycleId, lifecycle.lifecycleId);
    assert.equal(first.generationContext?.stage, "BANK_ONLY");
    assert.equal(first.generationContext?.contentAuthorityVersion, COM001_REVIEW_CONTENT_AUTHORITY_VERSION);
    assert.equal(first.generationContext?.questionBankWritable, true);
    assert.equal(first.generationContext?.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(first.generationContext?.questionBankAcceptanceAuthority, lifecycle.lifecycleId);
    assert.equal(first.generationContext?.testEligible, false);
    assert.equal(first.generationContext?.mockTestEligible, false);
    assert.equal(first.generationContext?.publiclyPublishable, false);
    assert.equal(first.generationContext?.productionReleaseAuthorized, false);

    const stems = new Set<string>();
    const positions = new Set<number>();
    const relationalModes = new Set<string>();
    const capacityConventions = new Set<string>();
    const difficulties = new Set<string>();

    for (const raw of first.questions) {
      const question = raw as Record<string, any>;
      audited += 1;
      assert.equal(question.packageId, "COM-001");
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
      assert.equal(question.text, question.stem);
      assert.equal(question.lifecycleId, lifecycle.lifecycleId);
      assert.equal(question.stage, "BANK_ONLY");
      assert.equal(question.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(question.questionBankWritable, true);
      assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(question.questionBankAcceptanceAuthority, lifecycle.lifecycleId);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.productionReleaseAuthorized, false);
      assert.equal(question.questionStudioReview.lifecycleId, lifecycle.lifecycleId);
      assert.equal(question.questionStudioReview.registrationStatus, "STANDARD_QUESTION_STUDIO_REGISTERED");
      assert.equal(question.questionStudioReview.questionBankWritable, true);
      assert.equal(question.questionStudioReview.testEligible, false);
      assert.equal(question.questionStudioReview.publiclyPublishable, false);

      assert.equal(getGeneratedQuestionBankAcceptanceMode(question), "BANK_ONLY");
      assert.equal(getGeneratedQuestionBankEligibilityIssue(question), null);
      assert.deepEqual(getGeneratedItemApprovalDisposition(question), {
        mode: "question_bank",
        reason: null,
      });
      approvalChecks += 1;

      assert.equal(question.sourceFactIds.includes("com001-sram-layer"), false);
      assert.equal(
        question.sourceFactIds.some((factId: string) => /windows-pagefile|windows-paging/i.test(factId)),
        false,
      );
      if (qlId === "COM-001-QL-007") {
        assert.equal(question.options.some((option: string) => /RDX/i.test(option)), false);
      }
      stems.add(question.stem);
      positions.add(question.correctIndex);
      difficulties.add(question.difficulty);
      if (question.relationalSurfaceMode) relationalModes.add(question.relationalSurfaceMode);
      if (question.capacityConvention) capacityConventions.add(question.capacityConvention);
    }

    assert.equal(stems.size >= 3, true, `${qlId}/${language}: thin stem diversity`);
    assert.equal(positions.size >= 3, true, `${qlId}/${language}: narrow answer-position spread`);
    if (["COM-001-QL-001", "COM-001-QL-002", "COM-001-QL-003", "COM-001-QL-004", "COM-001-QL-005"].includes(qlId)) {
      assert.equal(relationalModes.size >= 2, true, `${qlId}/${language}: V2 relational surfaces collapsed`);
      assert.deepEqual([...difficulties].sort(), ["Easy", "Medium"]);
    }
    if (qlId === "COM-001-QL-006") assert.deepEqual([...difficulties], ["Medium"]);
    if (["COM-001-QL-007", "COM-001-QL-008"].includes(qlId)) assert.deepEqual([...difficulties], ["Hard"]);
    if (qlId === "COM-001-QL-009") {
      assert.deepEqual([...capacityConventions].sort(), ["SI_IEC_EXPLICIT", "TRADITIONAL_EXAM_1024"]);
      assert.deepEqual([...difficulties].sort(), ["Easy", "Medium"]);
    }
  }
}

assert.equal(audited, 1080);
assert.equal(approvalChecks, 1080);

const mixedBase = {
  engineId: "knowledge-v1" as const,
  packageId: "COM-001",
  language: "en" as const,
  runtimeMode: "review-only",
  count: 30,
};
for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const request = { ...mixedBase, difficulty, seed: `standard-lifecycle:${difficulty}` };
  const first = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
  const replay = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
  assert.deepEqual(first, replay);
  assert.equal(first.questions.length, 30);
  assert.equal(first.questions.every((question) => question.difficulty === difficulty), true);
  assert.equal(first.questions.every((question) => question.questionBankWritable === true), true);
  assert.equal(first.questions.every((question) => question.testEligible === false), true);
}

await assert.rejects(
  () => knowledgeV1Com001QuestionStudioAdapter.generate({ packageId: "COM-001", runtimeMode: "production", count: 1 }),
  /only supports review-only runtime/,
);
await assert.rejects(
  () => knowledgeV1Com001QuestionStudioAdapter.generate({ packageId: "COM-001", patternId: "COM-001-QL-007", difficulty: "Easy", count: 1 }),
  /does not produce Easy questions/,
);
await assert.rejects(
  () => knowledgeV1Com001QuestionStudioAdapter.generate({ packageId: "COM-001", count: 51 }),
  /count between 1 and 50/,
);

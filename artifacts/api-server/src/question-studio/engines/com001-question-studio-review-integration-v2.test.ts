import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { buildRegenerationRequest } from "../../lib/question-studio-regeneration";
import { COM001_DIFFICULTY_CLASSIFIER_VERSION_V2 } from "../../knowledge-v1/computer-awareness/com001-difficulty-routing-v2";
import { COM001_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-english-freeze-v2";
import { COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v2";
import { listCom001ReviewV2QlIds } from "../../knowledge-v1/computer-awareness/com001-review-synthesis-v2";
import { listQuestionStudioPackages } from "../engine-registry";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V2 } from "./com001-question-studio-review-integration-v2";
import {
  COM001_QUESTION_BANK_STATUS,
  COM001_QUESTION_STUDIO_RUNTIME_MODE,
  COM001_REVIEW_CONTENT_AUTHORITY_VERSION,
  COM001_REVISION_POLICY,
  knowledgeV1Com001QuestionStudioAdapter,
} from "./knowledge-v1-com001-adapter";

const authority = COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V2;
const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

assert.equal(authority.contentAuthorityVersion, "V2");
assert.equal(authority.engineId, "knowledge-v1");
assert.equal(authority.packageId, "COM-001");
assert.equal(authority.runtimeMode, "review-only");
assert.equal(authority.permanentQlCount, 9);
assert.deepEqual(authority.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(authority.contentAuthorities.englishFreezeAuthorityId, COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId);
assert.equal(authority.contentAuthorities.englishCombinedFingerprint, COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint);
assert.equal(authority.contentAuthorities.localizationFreezeAuthorityId, COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId);
assert.equal(authority.contentAuthorities.localizationCombinedFingerprint, COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint);
assert.equal(authority.contentAuthorities.humanReviewStatus, "APPROVED");
assert.equal(authority.exactReviewedImplementation.contentEngineRunNumber, 156);
assert.equal(authority.exactReviewedImplementation.integratedAdminRunNumber, 8924);
assert.equal(authority.auditCoverage.explicitQlLanguageQuestions, 1080);
assert.equal(authority.auditCoverage.hindiPunjabiParityQuestions, 720);
assert.equal(authority.auditCoverage.englishV2AuditQuestions, 360);
assert.equal(authority.learnerSurfaceV2.ql007RdxLearnerSurfaceRemoved, true);
assert.equal(authority.learnerSurfaceV2.ql009TraditionalExam1024ConventionAdded, true);
assert.equal(authority.learnerSurfaceV2.ql009StrictSiIecModeRetainedSeparately, true);

// Historical V2 review integration remains immutable.
assert.equal(authority.editorSafety.approvalDisposition, "REVIEW_ONLY");
assert.equal(authority.editorSafety.questionBankStatus, "NOT_STORED");
assert.equal(authority.editorSafety.questionBankWritable, false);
assert.equal(authority.editorSafety.revisionPolicy, "SOURCE_GENERATOR_ONLY");
assert.equal(authority.editorSafety.manualFreeTextRevisionAllowed, false);
assert.equal(authority.editorSafety.canonicalQuestionPersistenceAllowed, false);
assert.equal(authority.difficulty.filterSupported, false);
assert.equal(authority.lifecycle.productionReleaseAuthorized, false);

// Current package uses the engine-agnostic standard BANK_ONLY lifecycle.
const registered = listQuestionStudioPackages().find((pkg) => pkg.packageId === "COM-001");
assert.ok(registered);
assert.equal(registered.engineId, "knowledge-v1");
assert.equal(registered.runtimeMode, COM001_QUESTION_STUDIO_RUNTIME_MODE);
assert.equal(registered.questionBankStatus, COM001_QUESTION_BANK_STATUS);
assert.equal(registered.questionBankStatus, lifecycle.questionBankStatus);
assert.equal(registered.testEligibility, lifecycle.testEligibility);
assert.equal(registered.publiclyPublishable, false);
assert.equal(registered.metadata?.contentAuthorityVersion, COM001_REVIEW_CONTENT_AUTHORITY_VERSION);
assert.equal(registered.metadata?.humanReviewApproved, true);
assert.equal(registered.metadata?.revisionPolicy, COM001_REVISION_POLICY);
assert.equal(registered.metadata?.difficultyFilterSupported, true);
assert.equal(registered.metadata?.difficultyClassifierVersion, COM001_DIFFICULTY_CLASSIFIER_VERSION_V2);
assert.equal(registered.metadata?.lifecycleId, lifecycle.lifecycleId);
assert.equal(registered.metadata?.stage, "BANK_ONLY");
assert.equal(registered.metadata?.questionBankWritable, true);
assert.equal(registered.metadata?.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(registered.metadata?.questionBankAcceptanceAuthority, lifecycle.lifecycleId);
assert.equal(registered.metadata?.testEligible, false);
assert.equal(registered.metadata?.mockTestEligible, false);
assert.equal(registered.metadata?.productionDifficultyClaimsAuthorized, false);
assert.equal(registered.metadata?.productionReleaseAuthorized, false);
assert.equal(registered.metadata?.englishFreezeAuthorityId, COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId);
assert.equal(registered.metadata?.localizationFreezeAuthorityId, COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId);

const qlIds = listCom001ReviewV2QlIds();
assert.equal(qlIds.length, 9);
let audited = 0;
for (const qlId of qlIds) {
  for (const language of ["en", "hi", "pa"] as const) {
    const generated = await knowledgeV1Com001QuestionStudioAdapter.generate({
      engineId: "knowledge-v1",
      packageId: "COM-001",
      patternId: qlId,
      language,
      runtimeMode: "review-only",
      count: 1,
      seed: `integration-v2-authority:${qlId}:${language}`,
      difficulty: "Mixed",
    });
    assert.equal(generated.questions.length, 1);
    assert.equal(generated.generationContext?.contentAuthorityVersion, "V2");
    assert.equal(generated.generationContext?.lifecycleId, lifecycle.lifecycleId);
    assert.equal(generated.generationContext?.questionBankWritable, true);
    assert.equal(generated.generationContext?.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(generated.generationContext?.questionBankAcceptanceAuthority, lifecycle.lifecycleId);
    assert.equal(generated.generationContext?.testEligible, false);
    assert.equal(generated.generationContext?.publiclyPublishable, false);

    const question = generated.questions[0] as Record<string, any>;
    audited += 1;
    assert.equal(question.qlId, qlId);
    assert.equal(question.language, language);
    assert.equal(["Easy", "Medium", "Hard"].includes(question.difficulty), true);
    assert.equal(question.questionStudioReview.contentAuthorityVersion, "V2");
    assert.equal(question.questionStudioReview.humanReviewApproved, true);
    assert.equal(question.questionStudioReview.lifecycleId, lifecycle.lifecycleId);
    assert.equal(question.questionStudioReview.questionBankWritable, true);
    assert.equal(question.questionStudioReview.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(question.questionStudioReview.testEligible, false);
    assert.equal(question.questionStudioReview.publiclyPublishable, false);
    assert.equal(question.lifecycleV2?.questionStudioV2Active, false);
    assert.equal(question.lifecycleV2?.questionBankWritable, false);
    assert.equal(question.localizationV2?.englishFreezeAuthorityId, COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId);

    assert.deepEqual(getGeneratedItemApprovalDisposition({
      ...question,
      generationContext: generated.generationContext,
    }), {
      mode: "question_bank",
      reason: null,
    });

    assert.throws(
      () => buildRegenerationRequest(
        {
          itemId: `integration-v2-${qlId}-${language}`,
          status: "needs_fix",
          acceptedQuestionId: null,
          currentVersionNumber: 1,
          runCode: "GEN-COM001-INTEGRATION-AUTHORITY-V2",
          requestSnapshot: {
            engineId: "knowledge-v1",
            packageId: "COM-001",
            patternId: qlId,
            language,
            runtimeMode: "review-only",
          },
          payload: {
            ...question,
            engineId: "knowledge-v1",
            generationContext: generated.generationContext,
          },
        },
        "regeneration-must-stay-locked-v2",
      ),
      /KNOWLEDGE_V1_REGENERATION_LOCKED/,
    );
  }
}
assert.equal(audited, 27);

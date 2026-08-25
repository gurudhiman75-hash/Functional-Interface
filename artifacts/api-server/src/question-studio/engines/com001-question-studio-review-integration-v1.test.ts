import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { buildRegenerationRequest } from "../../lib/question-studio-regeneration";
import { COM001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com001-english-freeze-v1";
import { COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v1";
import { listCom001ReviewQlIds } from "../../knowledge-v1/computer-awareness/com001-review-synthesis";
import { listQuestionStudioPackages } from "../engine-registry";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V1 } from "./com001-question-studio-review-integration-v1";
import {
  COM001_QUESTION_BANK_STATUS,
  COM001_QUESTION_STUDIO_RUNTIME_MODE,
  COM001_REVISION_POLICY,
  knowledgeV1Com001QuestionStudioAdapter,
} from "./knowledge-v1-com001-adapter";

const authority = COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V1;
const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

assert.equal(authority.status, "REVIEW_ONLY_QUESTION_STUDIO_INTEGRATION_APPROVED");
assert.equal(authority.engineId, "knowledge-v1");
assert.equal(authority.packageId, "COM-001");
assert.equal(authority.runtimeMode, "review-only");
assert.equal(authority.permanentQlCount, 9);
assert.deepEqual(authority.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(authority.contentAuthorities.englishFreezeAuthorityId, COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId);
assert.equal(authority.contentAuthorities.localizationFreezeAuthorityId, COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId);
assert.equal(authority.exactReviewedAdminSurface.contentEngineRunNumber, 115);
assert.equal(authority.exactReviewedAdminSurface.integratedAdminRunNumber, 8854);
assert.equal(authority.auditCoverage.explicitQlLanguageQuestions, 1080);
assert.equal(authority.editorSafety.approvalDisposition, "REVIEW_ONLY");
assert.equal(authority.editorSafety.questionBankStatus, "NOT_STORED");
assert.equal(authority.editorSafety.questionBankWritable, false);
assert.equal(authority.editorSafety.revisionPolicy, "SOURCE_GENERATOR_ONLY");
assert.equal(authority.editorSafety.regenerationStatus, "LOCKED_UNTIL_ENGINE_AWARE_REGENERATION");
assert.equal(authority.lifecycle.productionReleaseAuthorized, false);

// Historical V1 authority is immutable; the live package now uses the standard lifecycle.
const registered = listQuestionStudioPackages().find((pkg) => pkg.packageId === "COM-001");
assert.ok(registered);
assert.equal(registered.engineId, "knowledge-v1");
assert.equal(registered.runtimeMode, COM001_QUESTION_STUDIO_RUNTIME_MODE);
assert.equal(registered.questionBankStatus, COM001_QUESTION_BANK_STATUS);
assert.equal(registered.questionBankStatus, lifecycle.questionBankStatus);
assert.equal(registered.testEligibility, lifecycle.testEligibility);
assert.equal(registered.publiclyPublishable, false);
assert.equal(registered.metadata?.revisionPolicy, COM001_REVISION_POLICY);
assert.equal(registered.metadata?.difficultyFilterSupported, true);
assert.equal(registered.metadata?.lifecycleId, lifecycle.lifecycleId);
assert.equal(registered.metadata?.stage, "BANK_ONLY");
assert.equal(registered.metadata?.questionBankWritable, true);
assert.equal(registered.metadata?.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(registered.metadata?.questionBankAcceptanceAuthority, lifecycle.lifecycleId);
assert.equal(registered.metadata?.testEligible, false);
assert.equal(registered.metadata?.mockTestEligible, false);
assert.equal(registered.metadata?.productionDifficultyClaimsAuthorized, false);
assert.equal(registered.metadata?.productionReleaseAuthorized, false);

const qlIds = listCom001ReviewQlIds();
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
      seed: `integration-authority:${qlId}:${language}`,
      difficulty: "Mixed",
    });
    assert.equal(generated.questions.length, 1);
    const question = generated.questions[0] as Record<string, any>;
    audited += 1;
    assert.equal(question.qlId, qlId);
    assert.equal(question.language, language);
    assert.equal(question.revisionPolicy, COM001_REVISION_POLICY);
    assert.equal(question.lifecycleId, lifecycle.lifecycleId);
    assert.equal(question.questionBankStatus, lifecycle.questionBankStatus);
    assert.equal(question.questionBankWritable, true);
    assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(question.questionBankAcceptanceAuthority, lifecycle.lifecycleId);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.productionReleaseAuthorized, false);

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
          itemId: `integration-${qlId}-${language}`,
          status: "needs_fix",
          acceptedQuestionId: null,
          currentVersionNumber: 1,
          runCode: "GEN-COM001-INTEGRATION-AUTHORITY",
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
        "regeneration-must-stay-locked",
      ),
      /KNOWLEDGE_V1_REGENERATION_LOCKED/,
    );
  }
}
assert.equal(audited, 27);

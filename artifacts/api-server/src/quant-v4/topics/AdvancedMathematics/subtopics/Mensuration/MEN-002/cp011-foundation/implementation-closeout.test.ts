import assert from "node:assert/strict";
import {
  MEN_CP011_COMPLETION_STATUS,
  MEN_CP011_IMPLEMENTATION_CLOSEOUT_AUTHORITY,
  MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS,
  MEN_CP011_IMPLEMENTATION_MANIFEST,
  MEN_CP011_RUNTIME_PROTOTYPE_IDS,
  auditMenCp011ImplementationCloseout,
} from "./implementation-closeout";

const audit = auditMenCp011ImplementationCloseout();

console.log(
  "MEN_CP011_CLOSEOUT_DIAGNOSTIC",
  JSON.stringify(
    {
      runtimePrototypeCount: audit.runtimePrototypeCount,
      implementationWaveCount: audit.implementationWaveCount,
      generatedEnglishReviewRecordCount:
        audit.generatedEnglishReviewRecordCount,
      uniqueEnglishStemCount: audit.uniqueEnglishStemCount,
      uniqueQuestionOptionPackageCount:
        audit.uniqueQuestionOptionPackageCount,
      validAndVerifiedRecordCount: audit.validAndVerifiedRecordCount,
      technicallyCleanRecordCount: audit.technicallyCleanRecordCount,
      structurallyValidOptionRecordCount:
        audit.structurallyValidOptionRecordCount,
      lifecycleLockedRecordCount: audit.lifecycleLockedRecordCount,
      recordCountsByWave: audit.recordCountsByWave,
      answerPositionCounts: audit.answerPositionCounts,
    },
    null,
    2,
  ),
);

assert.equal(audit.authority, MEN_CP011_IMPLEMENTATION_CLOSEOUT_AUTHORITY);
assert.equal(
  audit.completionStatus,
  "IMPLEMENTATION_COMPLETE__ACTIVATION_LOCKED",
);
assert.equal(audit.completionStatus, MEN_CP011_COMPLETION_STATUS);
assert.equal(
  audit.sourceAuthority,
  "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V5",
);

assert.equal(audit.runtimePrototypeCount, 28);
assert.equal(audit.uniqueRuntimePrototypeCount, 28);
assert.equal(MEN_CP011_RUNTIME_PROTOTYPE_IDS.length, 28);
assert.equal(new Set(MEN_CP011_RUNTIME_PROTOTYPE_IDS).size, 28);
assert.equal(audit.implementationWaveCount, 11);
assert.equal(audit.generatedEnglishReviewRecordCount, 448);
assert.equal(MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS.length, 448);
assert.equal(audit.uniqueEnglishStemCount, 448);
assert.equal(audit.uniqueQuestionOptionPackageCount, 448);
assert.equal(audit.validAndVerifiedRecordCount, 448);
assert.equal(audit.technicallyCleanRecordCount, 448);
assert.equal(audit.structurallyValidOptionRecordCount, 448);
assert.equal(audit.lifecycleLockedRecordCount, 448);

assert.deepEqual(audit.recordCountsByWave, {
  PIPE_MATERIAL_AND_INVERSE_CORE: 48,
  PIPE_SURFACE_EXPOSURE: 72,
  OPEN_CONTAINER_EXPOSURE: 32,
  INVERSE_THICKNESS_AND_LENGTH: 32,
  HOLLOW_CUBE_AND_CUBOID: 32,
  SPHERICAL_AND_HEMISPHERICAL_SHELLS: 48,
  JOINED_AND_PLACED_HIDDEN_FACES: 32,
  COST_AND_INNER_LINING: 32,
  MATERIAL_RATIO_AND_PERCENT_CHANGE: 32,
  CONICAL_MATERIAL_VOLUME: 48,
  CONICAL_SURFACE_AND_LINING_COST: 40,
});
assert.deepEqual(audit.answerPositionCounts, {
  A: 112,
  B: 112,
  C: 112,
  D: 112,
});

assert.equal(audit.implementationManifestCount, 28);
assert.equal(audit.implementedManifestCount, 28);
assert.equal(MEN_CP011_IMPLEMENTATION_MANIFEST.length, 28);
assert.ok(
  MEN_CP011_IMPLEMENTATION_MANIFEST.every(
    (entry) =>
      entry.runtimeStatus === "IMPLEMENTED_AND_EXECUTABLY_VERIFIED" &&
      entry.generatedReviewRecordCount > 0 &&
      entry.ownershipStatus === "CANONICAL_OWNER_CONFIRMED" &&
      entry.formulaAuthorityStatus ===
        "EXECUTABLE_AND_INDEPENDENTLY_VERIFIED" &&
      entry.permanentQlId === null &&
      entry.questionStudioDiscoverable === false &&
      entry.questionBankStatus === "NOT_STORED" &&
      entry.testEligibility === "INELIGIBLE" &&
      entry.publiclyPublishable === false,
  ),
);

assert.equal(audit.attachedSourceReferenceCount, 17);
assert.equal(audit.directSourceCandidateCount, 4);
assert.equal(audit.representationOnlySourceCount, 13);
assert.equal(audit.missingDirectSourceReferenceCount, 11);
assert.equal(audit.directlyNormalisedSourceCount, 0);
assert.equal(audit.pendingHumanSourceReviewCount, 4);
assert.equal(audit.approvedHumanSourceReviewCount, 0);

assert.equal(audit.runtimeImplementationComplete, true);
assert.equal(audit.automatedEnglishAuditComplete, true);
assert.equal(audit.remainingEngineeringImplementationBlockerCount, 0);
assert.equal(audit.implementationComplete, true);
assert.equal(audit.activationReady, false);
assert.equal(audit.sourceNormalisationComplete, false);
assert.equal(audit.humanEnglishApprovalComplete, false);
assert.equal(audit.permanentQlAllocationComplete, false);
assert.equal(audit.multilingualParityComplete, false);
assert.equal(audit.questionStudioActivationAllowed, false);
assert.equal(audit.questionBankPersistenceAllowed, false);
assert.equal(audit.mockTestEligibilityAllowed, false);
assert.equal(audit.publicPublicationAllowed, false);
assert.equal(audit.activationBlockers.length, 7);

assert.ok(
  MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS.every(
    (question) =>
      question.validation?.valid === true &&
      question.verification?.valid === true &&
      question.options.length === 4 &&
      new Set(question.options.map((option: any) => option.display)).size === 4 &&
      question.options.filter((option: any) => option.isCorrect).length === 1 &&
      question.options[question.correctIndex]?.isCorrect === true &&
      question.learnerSolution?.wrongOptionAnalysis?.length === 3,
  ),
);
assert.ok(
  MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS.every(
    (question) =>
      question.permanentQlId === null &&
      question.questionBankStatus === "NOT_STORED" &&
      question.testEligibility === "INELIGIBLE" &&
      question.publiclyPublishable === false &&
      question.questionStudioDiscoverable === false,
  ),
);

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      completionStatus: audit.completionStatus,
      runtimePrototypeCount: audit.runtimePrototypeCount,
      generatedEnglishReviewRecordCount:
        audit.generatedEnglishReviewRecordCount,
      runtimeImplementationComplete: audit.runtimeImplementationComplete,
      automatedEnglishAuditComplete: audit.automatedEnglishAuditComplete,
      remainingEngineeringImplementationBlockerCount:
        audit.remainingEngineeringImplementationBlockerCount,
      attachedSourceReferenceCount: audit.attachedSourceReferenceCount,
      directSourceCandidateCount: audit.directSourceCandidateCount,
      representationOnlySourceCount: audit.representationOnlySourceCount,
      missingDirectSourceReferenceCount:
        audit.missingDirectSourceReferenceCount,
      activationReady: audit.activationReady,
    },
    null,
    2,
  ),
);

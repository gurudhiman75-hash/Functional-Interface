import assert from "node:assert/strict";

import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { DSF_CP002_ENGLISH_REVIEW_APPROVAL } from "../DSF-CP-002/english-review-approval-v1.ts";
import { DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL } from "../DSF-CP-003/exam-answer-profiles-approval-v1.ts";
import {
  DSF_CP003_ANSWER_PROFILES,
  generateDsfExamProfileBatch,
} from "../DSF-CP-003/exam-answer-profiles-v1.ts";
import { DSF_CP004_QUESTION_BANK_ACCEPTANCE } from "../DSF-CP-004/question-bank-acceptance-v1.ts";
import { DSF_CP005_TEST_RELEASE } from "../DSF-CP-005/test-release-v1.ts";
import { DSF_CP006_MOCK_TEST_RELEASE } from "../DSF-CP-006/mock-test-release-v1.ts";
import {
  DSF_CP007_CHECKPOINT_ID,
  DSF_CP007_PRODUCTION_PACKAGE,
  DSF_CP007_PRODUCTION_READINESS_FREEZE,
  DSF_CP007_PRODUCTION_READINESS_FREEZE_AUTHORITY,
} from "./production-readiness-freeze-v1.ts";

const authority = DSF_CP007_PRODUCTION_READINESS_FREEZE;
assert.equal(authority.authorityId, DSF_CP007_PRODUCTION_READINESS_FREEZE_AUTHORITY);
assert.equal(authority.checkpointId, DSF_CP007_CHECKPOINT_ID);
assert.equal(authority.status, "PRODUCTION_READY_FROZEN");
assert.deepEqual(authority.permanentQlIds, ["DSF-QL-001"]);
assert.equal(authority.nextAvailableQlId, "DSF-QL-002");

assert.equal(authority.pinnedAuthorities.semanticSourceFreeze, DSF_CP001_FREEZE_AUTHORITY.authorityId);
assert.equal(authority.pinnedAuthorities.genericEnglishApproval, DSF_CP002_ENGLISH_REVIEW_APPROVAL.authorityId);
assert.equal(authority.pinnedAuthorities.examProfileApproval, DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL.authorityId);
assert.equal(authority.pinnedAuthorities.questionBankAcceptance, DSF_CP004_QUESTION_BANK_ACCEPTANCE.authorityId);
assert.equal(authority.pinnedAuthorities.scoredTestRelease, DSF_CP005_TEST_RELEASE.authorityId);
assert.equal(authority.pinnedAuthorities.mockTestRelease, DSF_CP006_MOCK_TEST_RELEASE.authorityId);

assert.equal(authority.productionScope.language, "en");
assert.deepEqual(authority.productionScope.supportedExamFamilies, ["BANKING", "SSC"]);
assert.equal(authority.productionScope.productionDomains.length, 4);
assert.equal(authority.productionScope.solveModeCount, 8);
assert.equal(authority.productionScope.answerProfileCount, 5);
assert.equal(authority.productionScope.canonicalSemanticClassCount, 5);

assert.equal(authority.releaseLifecycle.questionStudioDiscoverable, true);
assert.equal(authority.releaseLifecycle.questionBankWritable, true);
assert.equal(authority.releaseLifecycle.questionBankAcceptanceMode, "FULL_RELEASE");
assert.equal(authority.releaseLifecycle.testEligible, true);
assert.equal(authority.releaseLifecycle.publiclyPublishable, true);
assert.equal(authority.releaseLifecycle.mockTestEligible, true);
assert.equal(authority.releaseLifecycle.automaticStudentPublication, false);

assert.equal(authority.studentDelivery.mode, "CANONICAL_MANUAL_TEST_PUBLICATION");
assert.equal(authority.studentDelivery.generatedQuestionAutoPublish, false);
assert.equal(authority.studentDelivery.questionMustBePublished, true);
assert.equal(authority.studentDelivery.testMustPassCanonicalValidation, true);
assert.equal(authority.studentDelivery.testMustPassQaOrReleaseLifecycle, true);
assert.equal(authority.studentDelivery.studentSeriesRequiresLivePublishedTest, true);
assert.equal(authority.studentDelivery.directDsfStudentEndpointAdded, false);

assert.equal(authority.boundaries.cp001SemanticRuntimeReopened, false);
assert.equal(authority.boundaries.newPermanentQlAllocated, false);
assert.equal(authority.boundaries.sscUnrepresentableClassRemappingAllowed, false);
assert.equal(authority.boundaries.punjabSpecificProfileEnabled, false);
assert.equal(authority.boundaries.hindiEnabled, false);
assert.equal(authority.boundaries.punjabiEnabled, false);
assert.equal(authority.boundaries.automaticStudentPublicationEnabled, false);
assert.equal(authority.boundaries.manualSafetyGatesBypassed, false);
assert.equal(authority.closure.currentApprovedScopeExamReady, true);
assert.equal(authority.closure.currentApprovedScopeProductionReady, true);
assert.equal(authority.closure.currentApprovedScopeClosed, true);
assert.equal(authority.closure.futureExpansionRequiresNewCheckpoint, true);
assert.equal(DSF_CP007_PRODUCTION_PACKAGE.productionReadinessStatus, "PRODUCTION_READY_FROZEN");
assert.equal(DSF_CP007_PRODUCTION_PACKAGE.chapterClosedForCurrentApprovedScope, true);
assert.equal(DSF_CP007_PRODUCTION_PACKAGE.automaticStudentPublication, false);

const MODE_MATRIX = [
  { domain: "NUMBER_SYSTEM", solveMode: "DSF-SM-NUM-MISSING-DIGIT" },
  { domain: "NUMBER_SYSTEM", solveMode: "DSF-SM-NUM-DIGIT-PARITY" },
  { domain: "RATIO_PROPORTION", solveMode: "DSF-SM-RAP-RATIO-AB" },
  { domain: "RATIO_PROPORTION", solveMode: "DSF-SM-RAP-GREATER-QUANTITY" },
  { domain: "PERCENTAGE", solveMode: "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE" },
  { domain: "PERCENTAGE", solveMode: "DSF-SM-PCT-FINAL-DIRECTION" },
  { domain: "ALGEBRA", solveMode: "DSF-SM-ALG-SINGLE-VARIABLE-X" },
  { domain: "ALGEBRA", solveMode: "DSF-SM-ALG-LINEAR-SYSTEM-X" },
] as const;

const seenProfiles = new Set<string>();
const seenModes = new Set<string>();
const seenDomains = new Set<string>();
const seenClasses = new Set<string>();
let proofs = 0;
for (const profile of DSF_CP003_ANSWER_PROFILES) {
  for (const mode of MODE_MATRIX) {
    const question = generateDsfExamProfileBatch({
      answerProfile: profile.id,
      domain: mode.domain,
      solveMode: mode.solveMode,
      count: 1,
      seed: `dsf-cp007:${profile.id}:${mode.solveMode}`,
    }).questions[0]!;
    assert.equal(question.qlId, "DSF-QL-001");
    assert.equal(question.answerProfile, profile.id);
    assert.equal(question.domain, mode.domain);
    assert.equal(question.solveModeId, mode.solveMode);
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.sourceFrozen, true);
    assert.equal(question.validation.semanticTruthPreserved, true);
    assert.equal(question.validation.optionOrderMatchesProfile, true);
    assert.ok(profile.representedSemanticClasses.includes(question.canonicalAnswer));
    seenProfiles.add(profile.id);
    seenModes.add(mode.solveMode);
    seenDomains.add(mode.domain);
    seenClasses.add(question.canonicalAnswer);
    proofs += 1;
  }
}

assert.equal(proofs, 40);
assert.equal(seenProfiles.size, 5);
assert.equal(seenModes.size, 8);
assert.equal(seenDomains.size, 4);
assert.ok(seenClasses.size >= 4, "Final production proof unexpectedly lost semantic breadth");

console.log(JSON.stringify({
  status: "PASS_DSF_CP007_PRODUCTION_READINESS_FREEZE",
  authority: DSF_CP007_PRODUCTION_READINESS_FREEZE_AUTHORITY,
  checkpointId: DSF_CP007_CHECKPOINT_ID,
  permanentQlIds: ["DSF-QL-001"],
  nextAvailableQlId: "DSF-QL-002",
  productionScope: {
    language: "en",
    examFamilies: ["BANKING", "SSC"],
    domains: seenDomains.size,
    solveModes: seenModes.size,
    profiles: seenProfiles.size,
    matrixProofs: proofs,
  },
  questionBankWritable: true,
  testEligible: true,
  mockTestEligible: true,
  publiclyPublishable: true,
  automaticStudentPublication: false,
  studentDeliveryMode: authority.studentDelivery.mode,
  currentApprovedScopeClosed: true,
  punjabSpecificProfileEnabled: false,
  hindiEnabled: false,
  punjabiEnabled: false,
}, null, 2));

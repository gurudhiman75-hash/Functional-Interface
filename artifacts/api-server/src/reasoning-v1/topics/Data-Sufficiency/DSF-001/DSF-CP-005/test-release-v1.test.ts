import assert from "node:assert/strict";

import { getPublicationIssues } from "../../../../../lib/admin-question-management.ts";
import { getGeneratedItemApprovalDisposition } from "../../../../../lib/admin-question-studio-approval-policy.ts";
import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { DSF_CP003_ANSWER_PROFILES, generateDsfExamProfileBatch } from "../DSF-CP-003/exam-answer-profiles-v1.ts";
import { DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY, DSF_CP004_QUESTION_BANK_PROFILE_IDS } from "../DSF-CP-004/question-bank-acceptance-v1.ts";
import {
  DSF_CP005_CHECKPOINT_ID,
  DSF_CP005_QUESTION_STUDIO_PACKAGE,
  DSF_CP005_TEST_RELEASE,
  DSF_CP005_TEST_RELEASE_AUTHORITY,
} from "./test-release-v1.ts";

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
const {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} = await import("../../../../../lib/admin-question-conversion.ts");
const { dsfCp004ReviewPayload, dsfCp005ReviewPayload } = await import(
  "../../../../../routes/admin-question-studio-data-sufficiency.ts"
);

assert.equal(DSF_CP001_FREEZE_AUTHORITY.status, "FROZEN");
assert.equal(DSF_CP005_TEST_RELEASE.checkpointId, DSF_CP005_CHECKPOINT_ID);
assert.equal(DSF_CP005_TEST_RELEASE.authorityId, DSF_CP005_TEST_RELEASE_AUTHORITY);
assert.equal(DSF_CP005_TEST_RELEASE.questionBankAcceptanceAuthority, DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY);
assert.equal(DSF_CP005_TEST_RELEASE.permanentQlId, "DSF-QL-001");
assert.equal(DSF_CP005_TEST_RELEASE.nextAvailableQlId, "DSF-QL-002");
assert.equal(DSF_CP005_TEST_RELEASE.release.questionBankAcceptanceMode, "FULL_RELEASE");
assert.equal(DSF_CP005_TEST_RELEASE.release.manualGenerationApprovalRequired, true);
assert.equal(DSF_CP005_TEST_RELEASE.release.manualQuestionPublicationRequired, true);
assert.equal(DSF_CP005_TEST_RELEASE.release.testEligible, true);
assert.equal(DSF_CP005_TEST_RELEASE.release.publiclyPublishable, true);
assert.equal(DSF_CP005_TEST_RELEASE.release.mockTestEligible, false);
assert.equal(DSF_CP005_TEST_RELEASE.release.automaticStudentPublication, false);
assert.equal(DSF_CP005_TEST_RELEASE.boundaries.punjabSpecificProfileEnabled, false);
assert.equal(DSF_CP005_TEST_RELEASE.boundaries.newPermanentQlAllocated, false);
assert.equal(DSF_CP005_QUESTION_STUDIO_PACKAGE.testEligible, true);
assert.equal(DSF_CP005_QUESTION_STUDIO_PACKAGE.publiclyPublishable, true);
assert.equal(DSF_CP005_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(DSF_CP005_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.equal(DSF_CP004_QUESTION_BANK_PROFILE_IDS.length, 5);

const releaseLifecycle = {
  questionBankStatus: "READY_FOR_STORAGE",
  questionBankWritable: true,
  questionBankAcceptanceMode: "FULL_RELEASE",
  questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
  testEligibility: "ELIGIBLE",
  testEligible: true,
  publiclyPublishable: true,
  mockTestEligible: false,
  automaticStudentPublication: false,
};
assert.deepEqual(getGeneratedItemApprovalDisposition(releaseLifecycle), { mode: "question_bank", reason: null });
assert.equal(getGeneratedQuestionBankAcceptanceMode(releaseLifecycle), "FULL_RELEASE");
assert.equal(getGeneratedQuestionBankEligibilityIssue(releaseLifecycle), null);

const basePublicationSnapshot = {
  status: "approved",
  approvedVersionId: "version-1",
  examVersionId: "exam-1",
  primaryTaxonomyNodeId: "topic-1",
  taxonomyNodeIds: ["topic-1"],
  stem: "Question stem",
  explanation: "Explanation",
  optionCount: 4,
  correctOptionCount: 1,
};
assert.equal(getPublicationIssues({
  ...basePublicationSnapshot,
  generationTestEligible: true,
  generationPubliclyPublishable: true,
}).length, 0);

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
for (const answerProfile of DSF_CP004_QUESTION_BANK_PROFILE_IDS) {
  const profile = DSF_CP003_ANSWER_PROFILES.find((entry) => entry.id === answerProfile)!;
  for (const mode of MODE_MATRIX) {
    const question = generateDsfExamProfileBatch({
      answerProfile,
      domain: mode.domain,
      solveMode: mode.solveMode,
      count: 1,
      seed: `dsf-cp005:${answerProfile}:${mode.solveMode}`,
    }).questions[0]!;
    assert.ok(profile.representedSemanticClasses.includes(question.canonicalAnswer));
    assert.equal(question.validation.semanticTruthPreserved, true);

    const oldPayload = dsfCp004ReviewPayload(question);
    assert.equal(oldPayload.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(oldPayload.testEligible, false);
    assert.equal(oldPayload.publiclyPublishable, false);

    const payload = dsfCp005ReviewPayload(question);
    assert.equal(payload.questionBankAcceptanceMode, "FULL_RELEASE");
    assert.equal(payload.testEligible, true);
    assert.equal(payload.publiclyPublishable, true);
    assert.equal(payload.mockTestEligible, false);
    assert.equal(payload.automaticStudentPublication, false);
    assert.equal(payload.testReleaseAuthority, DSF_CP005_TEST_RELEASE_AUTHORITY);
    assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);

    const normalized = normalizeGeneratedQuestionPayload(payload, {
      itemId: `item-${proofs}`,
      generationRunCode: "DSF-CP005-PROOF",
    });
    const generation = normalized.answerModel.generation as Record<string, unknown>;
    assert.equal(normalized.answerModel.canonicalAnswer, question.canonicalAnswer);
    assert.equal(generation.qlId, "DSF-QL-001");
    assert.equal(generation.solveMode, question.solveModeId);
    assert.equal(generation.answerProfile, answerProfile);
    assert.equal(generation.questionBankAcceptanceMode, "FULL_RELEASE");
    assert.equal(generation.testEligible, true);
    assert.equal(generation.publiclyPublishable, true);
    assert.equal(generation.mockTestEligible, false);
    assert.equal(generation.automaticStudentPublication, false);

    seenProfiles.add(answerProfile);
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
assert.ok(seenClasses.size >= 4);

console.log(JSON.stringify({
  status: "PASS_DSF_CP005_MANUAL_TEST_RELEASE",
  authority: DSF_CP005_TEST_RELEASE_AUTHORITY,
  checkpointId: DSF_CP005_CHECKPOINT_ID,
  permanentQlIds: ["DSF-QL-001"],
  nextAvailableQlId: "DSF-QL-002",
  acceptedProfiles: [...seenProfiles].sort(),
  profileModeProofs: proofs,
  solveModesProven: seenModes.size,
  productionDomainsProven: seenDomains.size,
  semanticClassesObserved: [...seenClasses].sort(),
  questionBankAcceptanceMode: "FULL_RELEASE",
  manualQuestionPublicationRequired: true,
  testEligible: true,
  publiclyPublishable: true,
  mockTestEligible: false,
  automaticStudentPublication: false,
  legacyCp004BankOnlyPayloadPreserved: true,
  punjabSpecificProfileEnabled: false,
}, null, 2));

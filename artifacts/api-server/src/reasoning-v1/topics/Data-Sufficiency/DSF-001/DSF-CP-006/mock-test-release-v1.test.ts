import assert from "node:assert/strict";

import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { DSF_CP003_ANSWER_PROFILES, generateDsfExamProfileBatch } from "../DSF-CP-003/exam-answer-profiles-v1.ts";
import { DSF_CP004_QUESTION_BANK_PROFILE_IDS } from "../DSF-CP-004/question-bank-acceptance-v1.ts";
import { DSF_CP005_TEST_RELEASE_AUTHORITY } from "../DSF-CP-005/test-release-v1.ts";
import { dsfCp005ReviewPayload, dsfCp006ReviewPayload } from "../../../../../routes/admin-question-studio-data-sufficiency.ts";
import {
  DSF_CP006_CHECKPOINT_ID,
  DSF_CP006_MOCK_TEST_RELEASE,
  DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
  DSF_CP006_QUESTION_STUDIO_PACKAGE,
} from "./mock-test-release-v1.ts";

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
const { normalizeGeneratedQuestionPayload } = await import("../../../../../lib/admin-question-conversion.ts");

assert.equal(DSF_CP001_FREEZE_AUTHORITY.status, "FROZEN");
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.checkpointId, DSF_CP006_CHECKPOINT_ID);
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.authorityId, DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY);
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.testReleaseAuthority, DSF_CP005_TEST_RELEASE_AUTHORITY);
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.permanentQlId, "DSF-QL-001");
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.nextAvailableQlId, "DSF-QL-002");
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.release.testEligible, true);
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.release.publiclyPublishable, true);
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.release.mockTestEligible, true);
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.release.automaticStudentPublication, false);
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.assessmentPipeline.parallelDsfMockEndpointAdded, false);
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.boundaries.legacyCp005MockIneligiblePayloadsUpgraded, false);
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.boundaries.punjabSpecificProfileEnabled, false);
assert.equal(DSF_CP006_MOCK_TEST_RELEASE.boundaries.newPermanentQlAllocated, false);
assert.equal(DSF_CP006_QUESTION_STUDIO_PACKAGE.mockTestEligible, true);
assert.equal(DSF_CP006_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);

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
      seed: `dsf-cp006:${answerProfile}:${mode.solveMode}`,
    }).questions[0]!;
    assert.ok(profile.representedSemanticClasses.includes(question.canonicalAnswer));
    assert.equal(question.validation.semanticTruthPreserved, true);

    const cp005 = dsfCp005ReviewPayload(question);
    assert.equal(cp005.mockTestEligible, false, "CP-005 payload must remain mock-ineligible");
    assert.equal(cp005.automaticStudentPublication, false);

    const payload = dsfCp006ReviewPayload(question);
    assert.equal(payload.mockTestEligible, true);
    assert.equal(payload.automaticStudentPublication, false);
    assert.equal(payload.mockTestReleaseAuthority, DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY);
    assert.equal(payload.questionBankAcceptanceMode, "FULL_RELEASE");
    assert.equal(payload.testEligible, true);
    assert.equal(payload.publiclyPublishable, true);

    const normalized = normalizeGeneratedQuestionPayload(payload, {
      itemId: `cp006-${proofs}`,
      generationRunCode: "DSF-CP006-PROOF",
    });
    const generation = normalized.answerModel.generation as Record<string, unknown>;
    assert.equal(normalized.answerModel.canonicalAnswer, question.canonicalAnswer);
    assert.equal(generation.qlId, "DSF-QL-001");
    assert.equal(generation.solveMode, question.solveModeId);
    assert.equal(generation.answerProfile, answerProfile);
    assert.equal(generation.testEligible, true);
    assert.equal(generation.publiclyPublishable, true);
    assert.equal(generation.mockTestEligible, true);
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
  status: "PASS_DSF_CP006_MOCK_TEST_RELEASE",
  authority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
  checkpointId: DSF_CP006_CHECKPOINT_ID,
  permanentQlIds: ["DSF-QL-001"],
  nextAvailableQlId: "DSF-QL-002",
  acceptedProfiles: [...seenProfiles].sort(),
  profileModeProofs: proofs,
  solveModesProven: seenModes.size,
  productionDomainsProven: seenDomains.size,
  semanticClassesObserved: [...seenClasses].sort(),
  testEligible: true,
  publiclyPublishable: true,
  mockTestEligible: true,
  automaticStudentPublication: false,
  legacyCp005MockIneligiblePayloadPreserved: true,
  punjabSpecificProfileEnabled: false,
}, null, 2));

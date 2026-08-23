import assert from "node:assert/strict";

import { getGeneratedItemApprovalDisposition } from "../../../../../lib/admin-question-studio-approval-policy.ts";
import { getPublicationIssues } from "../../../../../lib/admin-question-management.ts";
import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { DSF_CP002_ENGLISH_REVIEW_APPROVAL } from "../DSF-CP-002/english-review-approval-v1.ts";
import { DSF_CP002_QUESTION_STUDIO_PACKAGE } from "../DSF-CP-002/question-studio-integration-v1.ts";
import {
  DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL,
} from "../DSF-CP-003/exam-answer-profiles-approval-v1.ts";
import {
  DSF_CP003_ANSWER_PROFILES,
  generateDsfExamProfileBatch,
} from "../DSF-CP-003/exam-answer-profiles-v1.ts";
import {
  DSF_CP004_CHECKPOINT_ID,
  DSF_CP004_QUESTION_BANK_ACCEPTANCE,
  DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  DSF_CP004_QUESTION_BANK_PROFILE_IDS,
  DSF_CP004_QUESTION_STUDIO_PACKAGE,
} from "./question-bank-acceptance-v1.ts";

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
const {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} = await import("../../../../../lib/admin-question-conversion.ts");

const authority = DSF_CP004_QUESTION_BANK_ACCEPTANCE;
assert.equal(authority.status, "QUESTION_BANK_ACCEPTANCE_ENABLED");
assert.equal(authority.checkpointId, DSF_CP004_CHECKPOINT_ID);
assert.equal(authority.authorityId, DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY);
assert.equal(authority.sourceFreezeAuthority, DSF_CP001_FREEZE_AUTHORITY.authorityId);
assert.equal(authority.questionStudioAuthority, DSF_CP002_QUESTION_STUDIO_PACKAGE.integrationAuthority);
assert.equal(authority.genericEnglishApprovalAuthority, DSF_CP002_ENGLISH_REVIEW_APPROVAL.authorityId);
assert.equal(authority.examProfileApprovalAuthority, DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL.authorityId);
assert.equal(authority.permanentQlId, "DSF-QL-001");
assert.equal(authority.nextAvailableQlId, "DSF-QL-002");
assert.equal(authority.questionBank.statusBeforeAcceptance, "READY_FOR_STORAGE");
assert.equal(authority.questionBank.writable, true);
assert.equal(authority.questionBank.acceptanceMode, "BANK_ONLY");
assert.equal(authority.questionBank.manualGenerationApprovalRequired, true);
assert.equal(authority.downstreamLifecycle.testEligible, false);
assert.equal(authority.downstreamLifecycle.mockTestEligible, false);
assert.equal(authority.downstreamLifecycle.publiclyPublishable, false);
assert.equal(authority.downstreamLifecycle.automaticStudentPublication, false);
assert.equal(authority.boundaries.punjabSpecificProfileEnabled, false);
assert.equal(authority.boundaries.hindiEnabled, false);
assert.equal(authority.boundaries.punjabiEnabled, false);
assert.equal(authority.boundaries.newPermanentQlAllocated, false);
assert.equal(DSF_CP004_QUESTION_BANK_PROFILE_IDS.length, 5);
assert.deepEqual(
  [...DSF_CP004_QUESTION_BANK_PROFILE_IDS].sort(),
  DSF_CP003_ANSWER_PROFILES.map((profile) => profile.id).sort(),
);
assert.equal(DSF_CP004_QUESTION_STUDIO_PACKAGE.questionBankWritable, true);
assert.equal(DSF_CP004_QUESTION_STUDIO_PACKAGE.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(DSF_CP004_QUESTION_STUDIO_PACKAGE.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(DSF_CP004_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(DSF_CP004_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);

const bankOnlyLifecycle = {
  questionBankStatus: "READY_FOR_STORAGE",
  questionBankWritable: true,
  questionBankAcceptanceMode: "BANK_ONLY",
  questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
};

assert.deepEqual(
  getGeneratedItemApprovalDisposition(bankOnlyLifecycle),
  { mode: "question_bank", reason: null },
);
assert.equal(getGeneratedQuestionBankAcceptanceMode(bankOnlyLifecycle), "BANK_ONLY");
assert.equal(getGeneratedQuestionBankEligibilityIssue(bankOnlyLifecycle), null);

assert.equal(
  getGeneratedQuestionBankEligibilityIssue({
    ...bankOnlyLifecycle,
    questionBankAcceptanceMode: undefined,
  }),
  "testEligibility is INELIGIBLE",
);
assert.equal(
  getGeneratedQuestionBankEligibilityIssue({
    ...bankOnlyLifecycle,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
  }),
  "questionBankStatus is NOT_STORED",
);
assert.deepEqual(
  getGeneratedItemApprovalDisposition({
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  }),
  {
    mode: "review_only",
    reason: "Payload explicitly disables Question Bank storage",
  },
);

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
const bankOnlyPublicationIssues = getPublicationIssues({
  ...basePublicationSnapshot,
  generationTestEligible: false,
  generationPubliclyPublishable: false,
});
assert.ok(bankOnlyPublicationIssues.includes("Generation lifecycle has not enabled scored-test eligibility."));
assert.ok(bankOnlyPublicationIssues.includes("Generation lifecycle has not enabled public publication."));
assert.equal(
  getPublicationIssues({
    ...basePublicationSnapshot,
    generationTestEligible: null,
    generationPubliclyPublishable: null,
  }).length,
  0,
  "Legacy Question Bank records without generation lifecycle metadata must keep the existing publication behavior.",
);

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

let profileModeProofs = 0;
const seenProfiles = new Set<string>();
const seenModes = new Set<string>();
const seenDomains = new Set<string>();
const seenSemanticClasses = new Set<string>();

for (const answerProfile of DSF_CP004_QUESTION_BANK_PROFILE_IDS) {
  const profile = DSF_CP003_ANSWER_PROFILES.find((entry) => entry.id === answerProfile)!;
  for (const mode of MODE_MATRIX) {
    const generated = generateDsfExamProfileBatch({
      answerProfile,
      domain: mode.domain,
      solveMode: mode.solveMode,
      count: 1,
      seed: `dsf-cp004:${answerProfile}:${mode.solveMode}`,
    });
    assert.equal(generated.questions.length, 1);
    const question = generated.questions[0]!;
    assert.equal(question.qlId, "DSF-QL-001");
    assert.equal(question.answerProfile, answerProfile);
    assert.equal(question.domain, mode.domain);
    assert.equal(question.solveModeId, mode.solveMode);
    assert.ok(profile.representedSemanticClasses.includes(question.canonicalAnswer));
    assert.equal(question.validation.semanticTruthPreserved, true);

    const payload = {
      text: `${question.stem}\nI. ${question.statements[0].text}\nII. ${question.statements[1].text}`,
      options: question.options.map((option) => option.value),
      correctIndex: question.correctIndex,
      canonicalAnswer: question.canonicalAnswer,
      qlId: question.qlId,
      packageId: question.packageId,
      sourceChapterId: question.sourceChapterId,
      solveMode: question.solveModeId,
      answerProfile: question.answerProfile,
      examFamily: question.examFamily,
      topic: "Data Sufficiency",
      subtopic: question.domainLabel,
      language: question.language,
      locale: question.locale,
      integrationAuthority: question.integrationAuthority,
      deliveryProfileAuthority: question.deliveryProfileAuthority,
      sourceFreezeAuthority: question.sourceFreezeAuthority,
      ...bankOnlyLifecycle,
      generationContext: {
        qlId: question.qlId,
        sourceChapterId: question.sourceChapterId,
        solveMode: question.solveModeId,
        semanticClass: question.canonicalAnswer,
        answerProfile: question.answerProfile,
        examFamily: question.examFamily,
        locale: question.locale,
        ...bankOnlyLifecycle,
      },
    };

    assert.deepEqual(
      getGeneratedItemApprovalDisposition(payload),
      { mode: "question_bank", reason: null },
    );
    assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);

    const normalized = normalizeGeneratedQuestionPayload(payload, {
      itemId: `item-${profileModeProofs}`,
      generationRunCode: "DSF-CP004-PROOF",
    });
    const generation = normalized.answerModel.generation as Record<string, unknown>;
    assert.equal(normalized.answerModel.canonicalAnswer, question.canonicalAnswer);
    assert.equal(generation.qlId, "DSF-QL-001");
    assert.equal(generation.solveMode, question.solveModeId);
    assert.equal(generation.semanticClass, question.canonicalAnswer);
    assert.equal(generation.answerProfile, answerProfile);
    assert.equal(generation.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(generation.questionBankAcceptanceAuthority, DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY);
    assert.equal(generation.testEligible, false);
    assert.equal(generation.mockTestEligible, false);
    assert.equal(generation.publiclyPublishable, false);

    seenProfiles.add(answerProfile);
    seenModes.add(mode.solveMode);
    seenDomains.add(mode.domain);
    seenSemanticClasses.add(question.canonicalAnswer);
    profileModeProofs += 1;
  }
}

assert.equal(profileModeProofs, 40);
assert.equal(seenProfiles.size, 5);
assert.equal(seenModes.size, 8);
assert.equal(seenDomains.size, 4);
assert.ok(seenSemanticClasses.size >= 4, "CP-004 matrix unexpectedly lost semantic breadth");

console.log(JSON.stringify({
  status: "PASS_DSF_CP004_QUESTION_BANK_ACCEPTANCE",
  authority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  checkpointId: DSF_CP004_CHECKPOINT_ID,
  permanentQlIds: ["DSF-QL-001"],
  nextAvailableQlId: "DSF-QL-002",
  acceptedProfiles: [...seenProfiles].sort(),
  profileModeProofs,
  solveModesProven: seenModes.size,
  productionDomainsProven: seenDomains.size,
  semanticClassesObserved: [...seenSemanticClasses].sort(),
  questionBankWritable: true,
  questionBankAcceptanceMode: "BANK_ONLY",
  legacyReviewOnlyPayloadPreserved: true,
  publicationBlocked: true,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  punjabSpecificProfileEnabled: false,
}, null, 2));

import { createHash } from "node:crypto";
import { TRG_001_AUTHORITY_ALIGNED_IDS, authorityFamilyForTrg001Ql } from "./production-authority-runtime";
import { generateFinalEditorialTrg001Question } from "./production-final-editorial-runtime";
import {
  TRG_001_HUMAN_APPROVAL,
  generateHumanApprovedTrg001Question,
} from "./production-human-approved-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function reviewProjection(question: any, qlId: string, seed: string) {
  return {
    qlId,
    cpId: question.cpId,
    solveMode: question.solveMode,
    authorityFamily: authorityFamilyForTrg001Ql(qlId),
    difficulty: question.difficulty,
    seed,
    stem: question.stem,
    options: question.options.map((option: any) => ({
      label: option.label,
      display: option.display,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
    })),
    answer: question.answer,
    explanation: {
      keyRule: question.explanation.keyRule,
      steps: question.explanation.steps,
      shortcut: question.explanation.shortcut,
      traps: question.explanation.traps,
    },
    canonicalState: question.canonicalState,
    verification: question.verification,
  };
}

assert(TRG_001_AUTHORITY_ALIGNED_IDS.length === 144, "Human approval must bind all 144 permanent QLs.");

const approvedProjection = TRG_001_AUTHORITY_ALIGNED_IDS.map((qlId, index) => {
  const seed = `trg001-human-review-${String(index + 1).padStart(3, "0")}`;
  const base: any = generateFinalEditorialTrg001Question(qlId, seed);
  return reviewProjection(base, qlId, seed);
});

const fingerprint = createHash("sha256")
  .update(JSON.stringify(approvedProjection), "utf8")
  .digest("hex");

assert(
  fingerprint === TRG_001_HUMAN_APPROVAL.approvedContentFingerprint,
  `Approved TRG-001 content drifted: expected ${TRG_001_HUMAN_APPROVAL.approvedContentFingerprint}, got ${fingerprint}. New human approval is required.`,
);

for (let index = 0; index < TRG_001_AUTHORITY_ALIGNED_IDS.length; index += 1) {
  const qlId = TRG_001_AUTHORITY_ALIGNED_IDS[index];
  const seed = `trg001-human-review-${String(index + 1).padStart(3, "0")}`;
  const base: any = generateFinalEditorialTrg001Question(qlId, seed);
  const approved: any = generateHumanApprovedTrg001Question(qlId, seed);

  assert(
    JSON.stringify(reviewProjection(approved, qlId, seed)) === JSON.stringify(reviewProjection(base, qlId, seed)),
    `${qlId}: human-approved overlay changed reviewed question content.`,
  );
  assert(approved.reviewStatus === "HUMAN_APPROVED", `${qlId}: reviewStatus is not HUMAN_APPROVED.`);
  assert(approved.humanReviewStatus === "APPROVED", `${qlId}: humanReviewStatus is not APPROVED.`);
  assert(approved.humanReview?.humanReviewSubstituted === false, `${qlId}: human approval was marked as substituted.`);
  assert(approved.freezeEligible === true, `${qlId}: approved QL is not freeze eligible.`);
  assert(approved.aiEditorialStatus === "PASS", `${qlId}: AI editorial PASS was lost.`);
  assert(approved.validation?.valid === true && approved.verification?.valid === true, `${qlId}: validation/verification regressed.`);
  assert(
    approved.questionBankStatus === "NOT_STORED"
      && approved.testEligibility === "INELIGIBLE"
      && approved.publiclyPublishable === false
      && approved.questionStudioDiscoverable === false,
    `${qlId}: approval must not activate storage, tests, publication, or Question Studio.`,
  );
}

console.log(`TRG001_HUMAN_APPROVAL_BINDING_PASS count=144 fingerprint=${fingerprint} approvedBy=${TRG_001_HUMAN_APPROVAL.approvedBy}`);

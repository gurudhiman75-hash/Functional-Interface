import { createHash } from "node:crypto";
import { TRG_002_MVP_48_IDS } from "./mvp-48-registry";
import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";
import {
  TRG_002_FREEZE,
  TRG_002_HUMAN_APPROVAL,
  generateHumanApprovedTrg002Mvp48Question,
} from "./mvp-human-approved-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function approvedReviewProjection(question: any, qlId: string) {
  return {
    qlId,
    cpId: question.cpId,
    difficulty: question.difficulty,
    stem: question.stem,
    answer: question.answer,
    options: question.options.map((option: any) => ({
      label: option.label,
      display: option.display,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
    })),
    explanation: question.explanation,
    strategy: question.solutionDiagram.strategy,
    solutionDiagram: question.solutionDiagram,
    solutionAnnotations: question.solutionAnnotations ?? [],
    validation: question.validation,
  };
}

assert(TRG_002_MVP_48_IDS.length === 48, "Human approval must bind exactly 48 TRG-002 MVP QLs.");
assert(TRG_002_HUMAN_APPROVAL.status === "APPROVED", "TRG-002 human approval record is not APPROVED.");
assert(TRG_002_FREEZE.status === "FROZEN", "TRG-002 freeze record is not FROZEN.");
assert(
  TRG_002_FREEZE.approvedContentFingerprint === TRG_002_HUMAN_APPROVAL.approvedContentFingerprint,
  "TRG-002 freeze fingerprint does not match the human-approved fingerprint.",
);
assert(TRG_002_FREEZE.perGeneratedSeedVisualPassClaimed === false, "Freeze must not claim per-generated-seed visual PASS.");

const approvedProjection = TRG_002_MVP_48_IDS.map((qlId, index) => {
  const seed = `trg002-render-review-${String(index + 1).padStart(2, "0")}`;
  const base: any = generateFinalEditorialTrg002Mvp48Question(qlId, seed);
  return approvedReviewProjection(base, qlId);
});

const fingerprint = createHash("sha256")
  .update(JSON.stringify(approvedProjection), "utf8")
  .digest("hex");

assert(
  fingerprint === TRG_002_HUMAN_APPROVAL.approvedContentFingerprint,
  `Approved TRG-002 content drifted: expected ${TRG_002_HUMAN_APPROVAL.approvedContentFingerprint}, got ${fingerprint}. New human approval is required.`,
);

for (let index = 0; index < TRG_002_MVP_48_IDS.length; index += 1) {
  const qlId = TRG_002_MVP_48_IDS[index];
  const seed = `trg002-render-review-${String(index + 1).padStart(2, "0")}`;
  const base: any = generateFinalEditorialTrg002Mvp48Question(qlId, seed);
  const approved: any = generateHumanApprovedTrg002Mvp48Question(qlId, seed);

  assert(
    JSON.stringify(approvedReviewProjection(approved, qlId)) === JSON.stringify(approvedReviewProjection(base, qlId)),
    `${qlId}: frozen approval overlay changed approved question content.`,
  );
  assert(approved.reviewStatus === "HUMAN_APPROVED", `${qlId}: reviewStatus is not HUMAN_APPROVED.`);
  assert(approved.humanReviewStatus === "APPROVED", `${qlId}: humanReviewStatus is not APPROVED.`);
  assert(approved.humanReview?.humanReviewSubstituted === false, `${qlId}: human approval was marked as substituted.`);
  assert(approved.humanReview?.perGeneratedSeedVisualPassClaimed === false, `${qlId}: per-seed visual PASS was overstated.`);
  assert(approved.freezeEligible === true, `${qlId}: approved QL is not freeze eligible.`);
  assert(approved.frozen === true && approved.freezeStatus === "FROZEN", `${qlId}: QL is not marked FROZEN.`);
  assert(approved.freeze?.approvedContentFingerprint === fingerprint, `${qlId}: freeze is not bound to approved fingerprint.`);
  assert(approved.freeze?.contentChangeRequiresNewHumanApproval === true, `${qlId}: drift policy is missing.`);
  assert(approved.freeze?.expansionAuthorizedByFreeze === false, `${qlId}: freeze must not authorize 48→96 expansion.`);
  assert(approved.freeze?.mergeAuthorized === false && approved.freeze?.activationAuthorized === false, `${qlId}: freeze must not authorize merge or activation.`);
  assert(approved.aiEditorialStatus === "PASS", `${qlId}: AI editorial PASS was lost.`);
  assert(
    approved.validation?.valid === true
      && approved.verification?.spatial?.valid === true
      && approved.verification?.answer?.valid === true,
    `${qlId}: validation/verification regressed.`,
  );
  assert(
    approved.questionBankStatus === "NOT_STORED"
      && approved.testEligibility === "INELIGIBLE"
      && approved.publiclyPublishable === false
      && approved.questionStudioDiscoverable === false,
    `${qlId}: freeze must not activate storage, tests, publication, or Question Studio.`,
  );
}

console.log(`TRG002_HUMAN_APPROVAL_BINDING_PASS count=48 fingerprint=${fingerprint} approvedBy=${TRG_002_HUMAN_APPROVAL.approvedBy} freeze=FROZEN perSeedVisual=false`);

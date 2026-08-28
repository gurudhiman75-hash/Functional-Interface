import { createHash } from "node:crypto";
import { TRG_002_HUMAN_APPROVAL } from "./mvp-human-approved-runtime";
import {
  TRG_002_FROZEN_MVP_48_ID_SET,
  TRG_002_PRODUCTION_96_IDS,
  TRG_002_PRODUCTION_EXPANSION_48_IDS,
  TRG_002_PRODUCTION_EXPANSION_48_ID_SET,
} from "./production-96-registry";
import { generateFinalEditorialTrg002ProductionExpansionQuestion } from "./production-final-editorial-runtime";
import {
  TRG_002_PHASE8_FREEZE,
  TRG_002_PHASE8_HUMAN_APPROVAL,
} from "./phase8-human-approved-runtime";
import { generateFrozenTrg002Production96Question } from "./production-frozen-96-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function approvedPhase8ReviewRecords() {
  return TRG_002_PRODUCTION_EXPANSION_48_IDS.map((qlId, index) => {
    const seed = `trg002-production-editorial-review-${String(index + 1).padStart(2, "0")}`;
    const question: any = generateFinalEditorialTrg002ProductionExpansionQuestion(qlId, seed);
    return {
      qlId,
      cpId: question.cpId,
      difficulty: question.difficulty,
      lockedFamily: question.lockedFamily,
      solveMode: question.solveMode,
      seed,
      stem: question.stem,
      answer: question.answer,
      options: question.options.map((option: any) => ({
        label: option.label,
        display: option.display,
        isCorrect: option.isCorrect,
        misconceptionId: option.misconceptionId,
      })),
      explanation: question.explanation,
      solutionDiagramStrategy: question.solutionDiagram.strategy,
      solutionDiagram: question.solutionDiagram,
      solutionAnnotations: question.solutionAnnotations ?? [],
      validation: question.validation,
      verification: {
        spatial: question.verification?.spatial,
        answer: question.verification?.answer,
        diagram: question.verification?.diagram,
        diagramPolicy: question.verification?.diagramPolicy,
      },
      reviewStatus: question.reviewStatus,
      aiEditorialStatus: question.aiEditorialStatus,
      humanReviewStatus: question.humanReviewStatus,
      freezeStatus: question.freezeStatus,
      finalEditorialReview: question.finalEditorialReview,
    };
  });
}

assert(TRG_002_PHASE8_HUMAN_APPROVAL.status === "APPROVED", "Phase-8 human approval record must be APPROVED.");
assert(TRG_002_PHASE8_HUMAN_APPROVAL.approvedQlCount === 48, "Phase-8 approval must cover exactly 48 QLs.");
assert(TRG_002_PHASE8_HUMAN_APPROVAL.approvedContentSourceHead === "495f7c99dcb6d5d2b5716ab85f3cdf32a9ad8b49", "Phase-8 approval source head drifted.");
assert(TRG_002_PHASE8_HUMAN_APPROVAL.approvedWorkflowRunId === "32027888513", "Phase-8 approved workflow run drifted.");
assert(TRG_002_PHASE8_FREEZE.status === "FROZEN", "Phase-8 freeze record must be FROZEN.");
assert(TRG_002_PHASE8_FREEZE.perGeneratedSeedVisualPassClaimed === false, "Phase-8 freeze must not claim exhaustive visual inspection.");

const reviewRecords = approvedPhase8ReviewRecords();
assert(reviewRecords.length === 48, `Expected 48 approved Phase-8 review records, got ${reviewRecords.length}.`);
const reviewFingerprint = createHash("sha256")
  .update(JSON.stringify(reviewRecords, null, 2), "utf8")
  .digest("hex");
assert(
  reviewFingerprint === TRG_002_PHASE8_HUMAN_APPROVAL.approvedContentFingerprint,
  `Phase-8 approved content fingerprint drifted: expected ${TRG_002_PHASE8_HUMAN_APPROVAL.approvedContentFingerprint}, got ${reviewFingerprint}.`,
);

let frozenMvp = 0;
let frozenPhase8 = 0;
for (let index = 0; index < TRG_002_PRODUCTION_96_IDS.length; index += 1) {
  const qlId = TRG_002_PRODUCTION_96_IDS[index];
  const question: any = generateFrozenTrg002Production96Question(
    qlId,
    `trg002-production96-freeze-proof-${String(index + 1).padStart(3, "0")}`,
  );

  assert(question.qlId === qlId, `${qlId}: frozen runtime changed QL identity.`);
  assert(question.validation?.valid === true, `${qlId}: frozen runtime validation is not PASS.`);
  assert(question.reviewStatus === "HUMAN_APPROVED", `${qlId}: reviewStatus must be HUMAN_APPROVED.`);
  assert(question.humanReviewStatus === "APPROVED", `${qlId}: humanReviewStatus must be APPROVED.`);
  assert(question.frozen === true && question.freezeEligible === true, `${qlId}: frozen runtime must be freeze-eligible and frozen.`);
  assert(question.freezeStatus === "FROZEN", `${qlId}: freezeStatus must be FROZEN.`);
  assert(question.activationAuthorized === false, `${qlId}: freeze must not authorize activation.`);
  assert(question.questionBankStatus === "NOT_STORED", `${qlId}: question-bank storage must remain OFF.`);
  assert(question.testEligibility === "INELIGIBLE", `${qlId}: Test Builder eligibility must remain OFF.`);
  assert(question.publiclyPublishable === false, `${qlId}: public publication must remain OFF.`);
  assert(question.questionStudioDiscoverable === false, `${qlId}: Question Studio discovery must remain OFF.`);
  assert(question.productionQlTarget === 96, `${qlId}: production target must remain 96.`);

  if (TRG_002_FROZEN_MVP_48_ID_SET.has(qlId)) {
    frozenMvp += 1;
    assert(question.productionBaseline === "FROZEN_MVP_48", `${qlId}: original frozen baseline provenance changed.`);
    assert(question.productionExpansion === false, `${qlId}: original MVP QL must not be marked as expansion.`);
    assert(question.humanReview?.scope === "MVP_48_PERMANENT_ENGLISH_QLS", `${qlId}: original human-review scope changed.`);
    assert(question.humanReview?.approvedContentFingerprint === TRG_002_HUMAN_APPROVAL.approvedContentFingerprint, `${qlId}: original approved fingerprint changed.`);
  } else {
    assert(TRG_002_PRODUCTION_EXPANSION_48_ID_SET.has(qlId), `${qlId}: QL belongs to neither frozen production half.`);
    frozenPhase8 += 1;
    assert(question.productionBaseline === "FROZEN_PHASE8_EXPANSION_48", `${qlId}: Phase-8 frozen provenance missing.`);
    assert(question.productionExpansion === true, `${qlId}: Phase-8 provenance must remain expansion=true.`);
    assert(question.aiEditorialStatus === "PASS", `${qlId}: Phase-8 AI editorial status must remain PASS.`);
    assert(question.finalEditorialReview?.status === "PASS", `${qlId}: Phase-8 final editorial status must remain PASS.`);
    assert(question.humanVisualReviewStatus === "APPROVED", `${qlId}: representative human visual review must be APPROVED.`);
    assert(question.humanReview?.scope === "PHASE8_EXPANSION_48_PERMANENT_ENGLISH_QLS", `${qlId}: Phase-8 human-review scope is incorrect.`);
    assert(question.humanReview?.approvedContentFingerprint === TRG_002_PHASE8_HUMAN_APPROVAL.approvedContentFingerprint, `${qlId}: Phase-8 approved fingerprint missing.`);
    assert(question.humanReview?.perGeneratedSeedVisualPassClaimed === false, `${qlId}: exhaustive visual PASS must not be claimed.`);
    assert(question.freeze?.activationAuthorized === false, `${qlId}: nested freeze metadata must keep activation OFF.`);
    assert(question.freeze?.contentChangeRequiresNewHumanApproval === true, `${qlId}: content drift must require new human approval.`);
  }
}

assert(frozenMvp === 48, `Expected 48 original frozen QLs, got ${frozenMvp}.`);
assert(frozenPhase8 === 48, `Expected 48 Phase-8 frozen QLs, got ${frozenPhase8}.`);

console.log(
  `TRG002_PRODUCTION96_FREEZE_PASS total=96 originalFrozen=${frozenMvp} phase8Frozen=${frozenPhase8} phase8Fingerprint=${reviewFingerprint} human=APPROVED activation=OFF exhaustiveVisualClaim=false`,
);

import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { buildBankingModalCandidateOverlayV1 } from "./banking-modal-candidate-overlay-v1";
import { buildBankingModalCandidateReviewOverlayV2 } from "./banking-modal-candidate-review-overlay-v2";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const plannerSeed = 731;
const requestedCount = 100;
let records = 0;
let ordinary = 0;
let canNever = 0;
let v5ExplanationChanges = 0;

for (const locale of locales) {
  const base = buildBankingModalCandidateOverlayV1(plannerSeed, requestedCount, locale);
  const review = buildBankingModalCandidateReviewOverlayV2(plannerSeed, requestedCount, locale);
  const repeat = buildBankingModalCandidateReviewOverlayV2(plannerSeed, requestedCount, locale);
  assert.equal(base.length, 20);
  assert.equal(review.length, 20);
  assert.deepEqual(review, repeat);

  for (let index = 0; index < review.length; index += 1) {
    const before = base[index];
    const after = review[index];
    records += 1;

    assert.equal(after.authority, "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V2");
    assert.equal(after.plannerAuthority, before.plannerAuthority);
    assert.equal(after.plannerSeed, before.plannerSeed);
    assert.equal(after.plannerSlotIndex, before.plannerSlotIndex);
    assert.equal(after.candidateOrdinal, before.candidateOrdinal);
    assert.equal(after.sourcePercentileSlot, before.sourcePercentileSlot);
    assert.equal(after.familyId, before.familyId);
    assert.equal(after.readiness, "CANDIDATE_INACTIVE");
    assert.equal(after.canonicalQlId, null);
    assert.equal(after.candidateSeed, before.candidateSeed);
    assert.equal(after.locale, before.locale);
    assert.deepEqual(after.policy, before.policy);

    assert.equal(after.policy.registeredQlCreated, false);
    assert.equal(after.policy.connectedToProductionGenerator, false);
    assert.equal(after.policy.questionStudioVisible, false);
    assert.equal(after.policy.questionBankWritable, false);
    assert.equal(after.policy.testEligible, false);
    assert.equal(after.policy.publiclyPublishable, false);
    assert.equal(after.policy.sourceFrequencyClaim, false);
    assert.equal(after.policy.activationPermitted, false);

    assert.equal(after.question.diagram.enabled, true);
    assert.equal(after.question.diagram.diagramCount, 1);
    assert.equal(after.question.diagram.premiseOnly, true);
    assert.equal(after.question.diagram.mobileViewBoxWidth, 340);
    assert.equal(after.question.visualPolicy.stemDiagram, "NONE");
    assert.equal(after.question.visualPolicy.solutionDiagram, "ONE_COMBINED_PREMISE_DIAGRAM");
    assert.equal(after.question.visualPolicy.disclosure, "AFTER_ATTEMPT");
    assert.equal(after.question.visualPolicy.separateConclusionDiagrams, false);

    if (after.candidateKind === "ORDINARY_POSSIBILITY") {
      ordinary += 1;
      assert.equal(after.candidateAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3");
      assert.equal(after.question.editorialAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3");
      assert.deepEqual(after.question, before.question);
    } else {
      canNever += 1;
      assert.equal(after.candidateAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5");
      assert.equal(after.question.editorialAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5");
      assert.deepEqual(after.question.statements, before.question.statements);
      assert.deepEqual(after.question.conclusions, before.question.conclusions);
      assert.deepEqual(after.question.options, before.question.options);
      assert.equal(after.question.correctIndex, before.question.correctIndex);
      assert.equal(after.question.semanticAnswer, before.question.semanticAnswer);
      assert.deepEqual(after.question.diagram, before.question.diagram);
      assert.deepEqual(after.question.visualPolicy, before.question.visualPolicy);
      if (after.question.explanation.join("\n") !== before.question.explanation.join("\n")) {
        v5ExplanationChanges += 1;
      }
      const text = after.question.explanation.join("\n");
      assert.equal(text.includes("“all can never be” is not proved"), false);
      assert.equal(text.includes("“सभी कभी नहीं”"), false);
      assert.equal(text.includes("“ਸਾਰੇ ਕਦੇ ਨਹੀਂ”"), false);
    }
  }
}

assert.equal(records, 60);
assert.equal(ordinary, 30);
assert.equal(canNever, 30);
assert.ok(v5ExplanationChanges > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V2",
  localizedRecords: records,
  logicalCandidateSlots: 20,
  ordinaryPossibilityLocalized: ordinary,
  canNeverLocalized: canNever,
  v5ExplanationChanges,
  plannerSlotParityWithV1: true,
  candidateSeedParityWithV1: true,
  semanticAnswerParityWithV1: true,
  diagramByteParityWithV1: true,
  emittedQlIds: 0,
  sourceFrequencyClaim: false,
  activationPermitted: false,
}, null, 2));

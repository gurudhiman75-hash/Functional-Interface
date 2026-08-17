import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { buildBankingModalCandidateReviewOverlayV3 } from "./banking-modal-candidate-review-overlay-v3";
import { buildBankingModalCandidateReviewOverlayV4 } from "./banking-modal-candidate-review-overlay-v4";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const plannerSeed = 731;
const requestedCount = 100;
let records = 0;
let ordinary = 0;
let canNever = 0;
let canNeverExplanationChanges = 0;
let awkwardWholeClassBefore = 0;
let awkwardWholeClassAfter = 0;

function awkwardCount(text: string): number {
  return (text.match(/सभी “[^”]+” वर्ग (?:का|को)/gu) ?? []).length
    + (text.match(/ਸਾਰੇ “[^”]+” ਵਰਗ (?:ਦਾ|ਨੂੰ)/gu) ?? []).length;
}

for (const locale of locales) {
  const before = buildBankingModalCandidateReviewOverlayV3(plannerSeed, requestedCount, locale);
  const after = buildBankingModalCandidateReviewOverlayV4(plannerSeed, requestedCount, locale);
  const repeat = buildBankingModalCandidateReviewOverlayV4(plannerSeed, requestedCount, locale);
  assert.equal(before.length, 20);
  assert.equal(after.length, 20);
  assert.deepEqual(after, repeat);

  for (let index = 0; index < after.length; index += 1) {
    const prior = before[index];
    const current = after[index];
    records += 1;

    assert.equal(current.authority, "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V4");
    assert.equal(current.plannerAuthority, prior.plannerAuthority);
    assert.equal(current.plannerSeed, prior.plannerSeed);
    assert.equal(current.plannerSlotIndex, prior.plannerSlotIndex);
    assert.equal(current.candidateOrdinal, prior.candidateOrdinal);
    assert.equal(current.sourcePercentileSlot, prior.sourcePercentileSlot);
    assert.equal(current.familyId, prior.familyId);
    assert.equal(current.readiness, "CANDIDATE_INACTIVE");
    assert.equal(current.canonicalQlId, null);
    assert.equal(current.candidateSeed, prior.candidateSeed);
    assert.equal(current.locale, prior.locale);
    assert.deepEqual(current.policy, prior.policy);

    assert.deepEqual(current.question.statements, prior.question.statements);
    assert.deepEqual(current.question.conclusions, prior.question.conclusions);
    assert.deepEqual(current.question.options, prior.question.options);
    assert.equal(current.question.correctIndex, prior.question.correctIndex);
    assert.equal(current.question.semanticAnswer, prior.question.semanticAnswer);
    assert.deepEqual(current.question.diagram, prior.question.diagram);
    assert.deepEqual(current.question.visualPolicy, prior.question.visualPolicy);

    const beforeText = prior.question.explanation.join("\n");
    const afterText = current.question.explanation.join("\n");
    awkwardWholeClassBefore += awkwardCount(beforeText);
    awkwardWholeClassAfter += awkwardCount(afterText);

    if (current.candidateKind === "ORDINARY_POSSIBILITY") {
      ordinary += 1;
      assert.equal(current.candidateAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4");
      assert.equal(current.question.editorialAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4");
      assert.deepEqual(current.question, prior.question);
    } else {
      canNever += 1;
      assert.equal(current.candidateAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6");
      assert.equal(current.question.editorialAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6");
      if (afterText !== beforeText) canNeverExplanationChanges += 1;
    }

    assert.equal(current.policy.registeredQlCreated, false);
    assert.equal(current.policy.connectedToProductionGenerator, false);
    assert.equal(current.policy.questionStudioVisible, false);
    assert.equal(current.policy.questionBankWritable, false);
    assert.equal(current.policy.testEligible, false);
    assert.equal(current.policy.publiclyPublishable, false);
    assert.equal(current.policy.sourceFrequencyClaim, false);
    assert.equal(current.policy.activationPermitted, false);
  }
}

assert.equal(records, 60);
assert.equal(ordinary, 30);
assert.equal(canNever, 30);
assert.ok(canNeverExplanationChanges > 0);
assert.ok(awkwardWholeClassBefore > 0);
assert.equal(awkwardWholeClassAfter, 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V4",
  localizedRecords: records,
  logicalCandidateSlots: 20,
  ordinaryPossibilityLocalized: ordinary,
  canNeverLocalized: canNever,
  canNeverExplanationChanges,
  awkwardWholeClassBefore,
  awkwardWholeClassAfter,
  plannerSlotParityWithV3: true,
  candidateSeedParityWithV3: true,
  semanticAnswerParityWithV3: true,
  diagramByteParityWithV3: true,
  emittedQlIds: 0,
  sourceFrequencyClaim: false,
  activationPermitted: false,
}, null, 2));

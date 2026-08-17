import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { buildBankingModalCandidateReviewOverlayV2 } from "./banking-modal-candidate-review-overlay-v2";
import { buildBankingModalCandidateReviewOverlayV3 } from "./banking-modal-candidate-review-overlay-v3";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const plannerSeed = 731;
const requestedCount = 100;
let records = 0;
let ordinary = 0;
let canNever = 0;
let ordinaryExplanationChanges = 0;
let duplicateTokensBefore = 0;
let duplicateTokensAfter = 0;

for (const locale of locales) {
  const before = buildBankingModalCandidateReviewOverlayV2(plannerSeed, requestedCount, locale);
  const after = buildBankingModalCandidateReviewOverlayV3(plannerSeed, requestedCount, locale);
  const repeat = buildBankingModalCandidateReviewOverlayV3(plannerSeed, requestedCount, locale);
  assert.equal(before.length, 20);
  assert.equal(after.length, 20);
  assert.deepEqual(after, repeat);

  for (let index = 0; index < after.length; index += 1) {
    const prior = before[index];
    const current = after[index];
    records += 1;

    assert.equal(current.authority, "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V3");
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

    assert.equal(current.policy.registeredQlCreated, false);
    assert.equal(current.policy.connectedToProductionGenerator, false);
    assert.equal(current.policy.questionStudioVisible, false);
    assert.equal(current.policy.questionBankWritable, false);
    assert.equal(current.policy.testEligible, false);
    assert.equal(current.policy.publiclyPublishable, false);
    assert.equal(current.policy.sourceFrequencyClaim, false);
    assert.equal(current.policy.activationPermitted, false);

    assert.deepEqual(current.question.statements, prior.question.statements);
    assert.deepEqual(current.question.conclusions, prior.question.conclusions);
    assert.deepEqual(current.question.options, prior.question.options);
    assert.equal(current.question.correctIndex, prior.question.correctIndex);
    assert.equal(current.question.semanticAnswer, prior.question.semanticAnswer);
    assert.deepEqual(current.question.diagram, prior.question.diagram);
    assert.deepEqual(current.question.visualPolicy, prior.question.visualPolicy);

    const beforeText = prior.question.explanation.join("\n");
    const afterText = current.question.explanation.join("\n");
    duplicateTokensBefore += (beforeText.match(/वर्ग वर्ग/gu) ?? []).length;
    duplicateTokensBefore += (beforeText.match(/ਵਰਗ ਵਰਗ/gu) ?? []).length;
    duplicateTokensAfter += (afterText.match(/वर्ग वर्ग/gu) ?? []).length;
    duplicateTokensAfter += (afterText.match(/ਵਰਗ ਵਰਗ/gu) ?? []).length;

    if (current.candidateKind === "ORDINARY_POSSIBILITY") {
      ordinary += 1;
      assert.equal(current.candidateAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4");
      assert.equal(current.question.editorialAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4");
      if (afterText !== beforeText) ordinaryExplanationChanges += 1;
    } else {
      canNever += 1;
      assert.equal(current.candidateAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5");
      assert.equal(current.question.editorialAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5");
      assert.deepEqual(current.question, prior.question);
    }
  }
}

assert.equal(records, 60);
assert.equal(ordinary, 30);
assert.equal(canNever, 30);
assert.ok(ordinaryExplanationChanges > 0);
assert.ok(duplicateTokensBefore > 0);
assert.equal(duplicateTokensAfter, 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V3",
  localizedRecords: records,
  logicalCandidateSlots: 20,
  ordinaryPossibilityLocalized: ordinary,
  canNeverLocalized: canNever,
  ordinaryExplanationChanges,
  duplicateTokensBefore,
  duplicateTokensAfter,
  plannerSlotParityWithV2: true,
  candidateSeedParityWithV2: true,
  semanticAnswerParityWithV2: true,
  diagramByteParityWithV2: true,
  emittedQlIds: 0,
  sourceFrequencyClaim: false,
  activationPermitted: false,
}, null, 2));

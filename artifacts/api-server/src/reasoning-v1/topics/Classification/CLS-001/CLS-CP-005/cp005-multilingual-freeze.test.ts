import assert from "node:assert/strict";

import "./cp005-multilingual-runtime.test";
import {
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
} from "./cp005-english-contracts";
import { generateClsCp005EnglishQuestion } from "./cp005-english-runtime";
import {
  CLS_CP005_MULTILINGUAL_FREEZE as freeze,
  generateClsCp005FrozenQuestion,
} from "./cp005-multilingual-freeze";
import type { ClsCp005TranslatedLocale } from "./localization/cp005-language-pack";
import { localizeClsCp005Question } from "./localization/cp005-localizer";

assert.equal(freeze.chapterId, "CLS-001");
assert.equal(freeze.checkpointId, "CLS-CP-005");
assert.equal(freeze.status, "FROZEN_MULTILINGUAL_RUNTIME_PROOF");
assert.equal(freeze.approvalAuthority, "EXPLICIT_USER_EDITORIAL_SIGN_OFF");
assert.equal(freeze.approvalCommentId, 5157862721);
assert.equal(freeze.permanentQlIds.length, 2);
assert.deepEqual(freeze.permanentQlIds, [
  CLS_CP005_ODD_TUPLE_QL_ID,
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
]);
assert.deepEqual(freeze.frozenLocales, ["hi-IN", "pa-IN"]);
assert.equal(freeze.ruleCount, 35);
assert.equal(freeze.reviewQuestionCount, 140);
assert.equal(
  Object.values(freeze.localeQuestionCounts).reduce((sum, count) => sum + count, 0),
  140,
);
assert.equal(
  Object.values(freeze.qlQuestionCounts).reduce((sum, count) => sum + count, 0),
  140,
);
assert.match(freeze.approvedReviewedHead, /^[a-f0-9]{40}$/);
assert.match(freeze.synchronizedBaseHead, /^[a-f0-9]{40}$/);
assert.match(freeze.preFreezeValidatedHead, /^[a-f0-9]{40}$/);
assert.equal(freeze.synchronizedProof.workflowRunId, 30748032576);
assert.equal(freeze.synchronizedProof.reviewArtifact.questionCount, 140);
assert.match(
  freeze.synchronizedProof.reviewArtifact.digest,
  /^sha256:[a-f0-9]{64}$/,
);
assert.match(
  freeze.synchronizedProof.diagnosticsArtifact.digest,
  /^sha256:[a-f0-9]{64}$/,
);

assert.equal(freeze.contentGuarantees.canonicalEnglishSolverUnchanged, true);
assert.equal(freeze.contentGuarantees.mathematicalStateUnchanged, true);
assert.equal(freeze.contentGuarantees.optionOrderUnchanged, true);
assert.equal(freeze.contentGuarantees.answerAndIndexUnchanged, true);
assert.equal(freeze.contentGuarantees.ambiguityProofUnchanged, true);
assert.equal(freeze.contentGuarantees.learnerFacingHindiApproved, true);
assert.equal(freeze.contentGuarantees.learnerFacingPunjabiApproved, true);
assert.equal(freeze.lifecycle.questionStudioDiscoverable, false);
assert.equal(freeze.lifecycle.questionBankWritable, false);
assert.equal(freeze.lifecycle.testEligible, false);
assert.equal(freeze.lifecycle.publiclyPublishable, false);
assert.ok(freeze.reopenOnlyFor.length >= 7);

const locales: readonly ClsCp005TranslatedLocale[] = ["hi-IN", "pa-IN"];
const qlRuns = [
  [CLS_CP005_ODD_TUPLE_QL_ID, 420],
  [CLS_CP005_EQUIVALENT_TUPLE_QL_ID, 960],
] as const;

let frozenQuestionCount = 0;
for (const locale of locales) {
  for (const [qlId, seedCount] of qlRuns) {
    const representedRules = new Set<string>();

    for (let seed = 0; seed < seedCount; seed += 1) {
      const english = generateClsCp005EnglishQuestion(qlId, seed);
      const reviewed = localizeClsCp005Question(english, locale);
      const frozen = generateClsCp005FrozenQuestion(qlId, locale, seed);

      const {
        metadata: frozenMetadata,
        lifecycle: frozenLifecycle,
        ...frozenContent
      } = frozen;
      const {
        metadata: reviewedMetadata,
        lifecycle: reviewedLifecycle,
        ...reviewedContent
      } = reviewed;
      assert.deepEqual(frozenContent, reviewedContent);

      const {
        runtimeVersion: frozenRuntimeVersion,
        localizationStatus: frozenLocalizationStatus,
        ...frozenMetadataRest
      } = frozenMetadata;
      const {
        runtimeVersion: _reviewRuntimeVersion,
        localizationStatus: _reviewLocalizationStatus,
        ...reviewedMetadataRest
      } = reviewedMetadata;
      assert.deepEqual(frozenMetadataRest, reviewedMetadataRest);
      assert.equal(
        frozenRuntimeVersion,
        "cls-cp005-multilingual-frozen-runtime-v1",
      );
      assert.equal(
        frozenLocalizationStatus,
        "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
      );

      const {
        reviewStatus: frozenReviewStatus,
        ...frozenLifecycleRest
      } = frozenLifecycle;
      const {
        reviewStatus: _reviewStatus,
        ...reviewedLifecycleRest
      } = reviewedLifecycle;
      assert.deepEqual(frozenLifecycleRest, reviewedLifecycleRest);
      assert.equal(frozenReviewStatus, "APPROVED_MULTILINGUAL_FROZEN");
      assert.equal(frozenLifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(frozenLifecycle.testEligibility, "INELIGIBLE");
      assert.equal(frozenLifecycle.publiclyPublishable, false);
      assert.equal(frozenLifecycle.questionStudioDiscoverable, false);
      assert.equal(frozen.questionStudioVisible, false);
      assert.equal(frozen.reviewOnly, true);

      representedRules.add(frozen.intendedRuleId);
      frozenQuestionCount += 1;
    }

    assert.equal(
      representedRules.size,
      35,
      `${locale}/${qlId} did not preserve the full 35-rule universe`,
    );
  }
}

assert.equal(frozenQuestionCount, 2760);

console.log("CLS-CP-005 multilingual freeze guard passed.", {
  approvedReviewedHead: freeze.approvedReviewedHead,
  preFreezeValidatedHead: freeze.preFreezeValidatedHead,
  permanentQls: freeze.permanentQlIds.length,
  locales: freeze.frozenLocales.length,
  rulesPerQlAndLocale: freeze.ruleCount,
  frozenQuestionsReplayed: frozenQuestionCount,
  lifecycle: freeze.lifecycle,
});

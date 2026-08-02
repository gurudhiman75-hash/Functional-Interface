import assert from "node:assert/strict";

import "./cp006-multilingual-runtime.test";
import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
} from "./cp006-english-contracts";
import { generateClsCp006EnglishQuestion } from "./cp006-english-runtime";
import {
  CLS_CP006_MULTILINGUAL_FREEZE as freeze,
  generateClsCp006FrozenQuestion,
} from "./cp006-multilingual-freeze";
import type { ClsCp006TranslatedLocale } from "./localization/cp006-language-pack";
import { localizeClsCp006Question } from "./localization/cp006-localizer";

assert.equal(freeze.chapterId, "CLS-001");
assert.equal(freeze.checkpointId, "CLS-CP-006");
assert.equal(freeze.status, "FROZEN_MULTILINGUAL_RUNTIME_PROOF");
assert.equal(freeze.approvalAuthority, "EXPLICIT_USER_EDITORIAL_SIGN_OFF");
assert.equal(freeze.approvalCommentId, 5158340874);
assert.equal(freeze.approvedOnUtcDate, "2026-08-02");
assert.deepEqual(freeze.permanentQlIds, [
  CLS_CP006_ODD_LETTER_QL_ID,
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
]);
assert.deepEqual(freeze.frozenLocales, ["hi-IN", "pa-IN"]);
assert.equal(freeze.ruleCount, 8);
assert.deepEqual(freeze.ruleCountsByQl, {
  [CLS_CP006_ODD_LETTER_QL_ID]: 3,
  [CLS_CP006_ODD_LETTER_PAIR_QL_ID]: 5,
});
assert.equal(freeze.reviewQuestionCount, 32);
assert.equal(
  Object.values(freeze.localeQuestionCounts).reduce((sum, count) => sum + count, 0),
  32,
);
assert.equal(
  Object.values(freeze.qlQuestionCounts).reduce((sum, count) => sum + count, 0),
  32,
);
assert.match(freeze.approvedReviewedHead, /^[a-f0-9]{40}$/);
assert.match(freeze.synchronizedBaseHead, /^[a-f0-9]{40}$/);
assert.match(freeze.preFreezeValidatedHead, /^[a-f0-9]{40}$/);
assert.equal(freeze.synchronizedProof.workflowRunId, 30750954437);
assert.equal(freeze.synchronizedProof.reviewArtifact.questionCount, 32);
assert.match(
  freeze.synchronizedProof.reviewArtifact.digest,
  /^sha256:[a-f0-9]{64}$/,
);
assert.match(
  freeze.synchronizedProof.diagnosticsArtifact.digest,
  /^sha256:[a-f0-9]{64}$/,
);

for (const value of Object.values(freeze.contentGuarantees)) {
  assert.equal(value, true);
}
assert.equal(freeze.lifecycle.questionStudioDiscoverable, false);
assert.equal(freeze.lifecycle.questionBankWritable, false);
assert.equal(freeze.lifecycle.testEligible, false);
assert.equal(freeze.lifecycle.publiclyPublishable, false);
assert.ok(freeze.reopenOnlyFor.length >= 7);

const locales: readonly ClsCp006TranslatedLocale[] = ["hi-IN", "pa-IN"];
const qlRuns = [
  [CLS_CP006_ODD_LETTER_QL_ID, 720, 3],
  [CLS_CP006_ODD_LETTER_PAIR_QL_ID, 720, 5],
] as const;

let frozenQuestionCount = 0;
for (const locale of locales) {
  for (const [qlId, seedCount, expectedRuleCount] of qlRuns) {
    const representedRules = new Set<string>();

    for (let seed = 0; seed < seedCount; seed += 1) {
      const english = generateClsCp006EnglishQuestion(qlId, seed);
      const reviewed = localizeClsCp006Question(english, locale);
      const frozen = generateClsCp006FrozenQuestion(qlId, locale, seed);

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
        "cls-cp006-multilingual-frozen-runtime-v1",
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
      expectedRuleCount,
      `${locale}/${qlId} did not preserve its complete rule universe`,
    );
  }
}

assert.equal(frozenQuestionCount, 2880);

console.log("CLS-CP-006 multilingual freeze guard passed.", {
  approvedReviewedHead: freeze.approvedReviewedHead,
  preFreezeValidatedHead: freeze.preFreezeValidatedHead,
  permanentQls: freeze.permanentQlIds.length,
  locales: freeze.frozenLocales.length,
  rules: freeze.ruleCount,
  frozenQuestionsReplayed: frozenQuestionCount,
  lifecycle: freeze.lifecycle,
});

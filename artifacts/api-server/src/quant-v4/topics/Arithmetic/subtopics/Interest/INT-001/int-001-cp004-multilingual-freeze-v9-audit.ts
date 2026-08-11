import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { INT_CP004_LOCALIZED_LOCALES } from "./cp004-localization-language-pack";
import { generateIntCp004ExamFriendlyLocalizedQuestionV9 } from "./cp004-localized-exam-friendly-runtime-v9";
import {
  INT_CP004_MULTILINGUAL_FREEZE_V9 as freeze,
  generateIntCp004MultilingualFrozenQuestionV9,
} from "./cp004-multilingual-freeze-v9";

function assertDeepFrozen(value: unknown, seen = new WeakSet<object>()): number {
  if (typeof value !== "object" || value === null) return 0;
  const objectValue = value as object;
  if (seen.has(objectValue)) return 0;
  seen.add(objectValue);
  assert.equal(Object.isFrozen(value), true);
  let checks = 1;
  for (const key of Reflect.ownKeys(objectValue)) {
    checks += assertDeepFrozen((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return checks;
}

assert.equal(freeze.chapterId, "INT-001");
assert.equal(freeze.checkpointId, "INT-CP-004");
assert.equal(freeze.freezeId, "INT-CP-004-HI-PA-v9-frozen");
assert.equal(freeze.status, "FROZEN_MULTILINGUAL_RUNTIME_PROOF");
assert.equal(freeze.approvalAuthority, "EXPLICIT_USER_EDITORIAL_SIGN_OFF");
assert.equal(freeze.approvalCommentId, 5244153118);
assert.equal(freeze.approvedAtUtc, "2026-08-10T18:12:00Z");
assert.equal(freeze.approvedAtIst, "2026-08-10T23:42:00+05:30");
assert.equal(freeze.approvedReviewedHead, "16e8a7f772f79e222aa8e09475b15b6eddf42d6b");
assert.equal(freeze.canonicalEnglishFreezeId, "INT-CP-004-EN-v1-frozen");
assert.equal(freeze.qlCount, 19);
assert.deepEqual(freeze.frozenLocales, ["hi-IN", "pa-IN"]);
assert.equal(freeze.reviewQuestionCount, 152);
assert.equal(freeze.localeQuestionCounts["hi-IN"], 76);
assert.equal(freeze.localeQuestionCounts["pa-IN"], 76);
assert.equal(freeze.validationProof.cp004LocalizationWorkflowRunId, 31416083460);
assert.equal(freeze.validationProof.examFriendlyV9WorkflowRunId, 31416083505);
assert.equal(freeze.validationProof.cp001IsolationWorkflowRunId, 31416083578);
assert.equal(freeze.validationProof.reviewArtifact.id, 9073471740);
assert.equal(freeze.validationProof.runtimeEvidenceArtifact.id, 9073464813);
assert.match(freeze.validationProof.reviewArtifact.digest, /^sha256:[a-f0-9]{64}$/u);
assert.match(freeze.validationProof.runtimeEvidenceArtifact.digest, /^sha256:[a-f0-9]{64}$/u);
assert.equal(freeze.contentGuarantees.historicalEnglishFreezeUntouched, true);
assert.equal(freeze.contentGuarantees.approvedRemediationStateFrozen, true);
assert.equal(freeze.contentGuarantees.learnerContentIdenticalToApprovedV9, true);
assert.equal(freeze.contentGuarantees.zeroDecimalTokens, true);
assert.equal(freeze.contentGuarantees.formulaFirstEveryQuestion, true);
assert.equal(freeze.contentGuarantees.completeCalculationEveryQuestion, true);
assert.equal(freeze.contentGuarantees.hindiApproved, true);
assert.equal(freeze.contentGuarantees.punjabiApproved, true);
assert.equal(freeze.lifecycle.enabled, false);
assert.equal(freeze.lifecycle.stagingStatus, "NOT_STAGED");
assert.equal(freeze.lifecycle.registrationStatus, "NOT_REGISTERED");
assert.equal(freeze.lifecycle.questionStudioDiscoverable, false);
assert.equal(freeze.lifecycle.questionBankStatus, "NOT_STORED");
assert.equal(freeze.lifecycle.testEligibility, "INELIGIBLE");
assert.equal(freeze.lifecycle.publiclyPublishable, false);
assert.ok(freeze.reopenOnlyFor.length >= 8);

const decimalToken = /\d+\.\d+/u;
let frozenQuestions = 0;
let contentIdentityChecks = 0;
let formulaFirstChecks = 0;
let decimalFreeChecks = 0;
let calculationChecks = 0;
let lifecycleChecks = 0;
let frozenObjectChecks = 0;
const localeCounts: Record<string, number> = {};
const qlCounts: Record<string, number> = {};

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  for (const qlId of INT_CP004_QL_IDS) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `int-cp004-multilingual-freeze-v9:${qlId}:${index}`;
      const input = { qlId, seed, locale } as const;
      const reviewed = generateIntCp004ExamFriendlyLocalizedQuestionV9(input);
      const frozen = generateIntCp004MultilingualFrozenQuestionV9(input);

      const { multilingualFreeze: frozenApprovalRecord, ...frozenWithoutApprovalRecord } = frozen;
      assert.equal(frozenApprovalRecord, freeze);
      const normalizedFrozen = {
        ...frozenWithoutApprovalRecord,
        editorialStatus: reviewed.editorialStatus,
        approvalStatus: reviewed.approvalStatus,
        allocationStatus: reviewed.allocationStatus,
        lifecycle: {
          ...frozen.lifecycle,
          maturity: reviewed.lifecycle.maturity,
          reviewStatus: reviewed.lifecycle.reviewStatus,
        },
        localization: {
          ...frozen.localization,
          status: reviewed.localization.status,
        },
      };
      assert.deepEqual(normalizedFrozen, reviewed);
      contentIdentityChecks += 1;

      assert.equal(frozen.editorialStatus, "MULTILINGUAL_FROZEN");
      assert.equal(frozen.approvalStatus, "APPROVED_MULTILINGUAL_FROZEN");
      assert.equal(frozen.allocationStatus, "INACTIVE_MULTILINGUAL_FROZEN");
      assert.equal(frozen.lifecycle.maturity, "MULTILINGUAL_FROZEN");
      assert.equal(frozen.lifecycle.reviewStatus, "APPROVED_MULTILINGUAL_FROZEN");
      assert.equal(frozen.localization.status, "FROZEN_MULTILINGUAL_RUNTIME_PROOF");

      const learnerText = [
        frozen.stem,
        ...frozen.options.map((option) => option.text),
        frozen.correctAnswer,
        frozen.explanation.whatAsked,
        ...frozen.explanation.steps,
        frozen.explanation.finalAnswer,
        frozen.explanation.commonMistake,
      ].join("\n");
      decimalFreeChecks += 1;
      assert.equal(decimalToken.test(learnerText), false);

      const firstStep = frozen.explanation.steps[0] ?? "";
      formulaFirstChecks += 1;
      assert.equal(locale === "hi-IN" ? firstStep.startsWith("सूत्र:") : firstStep.startsWith("ਸੂਤਰ:"), true);

      calculationChecks += 1;
      assert.equal(
        frozen.explanation.steps.slice(1).some((step) => /[=×÷+−^/]/u.test(step)),
        true,
      );

      lifecycleChecks += 7;
      assert.equal(frozen.lifecycle.enabled, false);
      assert.equal(frozen.lifecycle.stagingStatus, "NOT_STAGED");
      assert.equal(frozen.lifecycle.registrationStatus, "NOT_REGISTERED");
      assert.equal(frozen.lifecycle.questionStudioDiscoverable, false);
      assert.equal(frozen.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(frozen.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(frozen.lifecycle.publiclyPublishable, false);

      frozenObjectChecks += assertDeepFrozen(frozen);
      frozenQuestions += 1;
      localeCounts[locale] = (localeCounts[locale] ?? 0) + 1;
      qlCounts[`${locale}/${qlId}`] = (qlCounts[`${locale}/${qlId}`] ?? 0) + 1;
    }
  }
}

assert.equal(frozenQuestions, 3800);
assert.equal(contentIdentityChecks, 3800);
assert.equal(decimalFreeChecks, 3800);
assert.equal(formulaFirstChecks, 3800);
assert.equal(calculationChecks, 3800);
assert.equal(localeCounts["hi-IN"], 1900);
assert.equal(localeCounts["pa-IN"], 1900);
for (const count of Object.values(qlCounts)) assert.equal(count, 100);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-multilingual-freeze-v9");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "INT_CP004_MULTILINGUAL_V9_FROZEN",
  freezeId: freeze.freezeId,
  approvalCommentId: freeze.approvalCommentId,
  approvedAtIst: freeze.approvedAtIst,
  approvedReviewedHead: freeze.approvedReviewedHead,
  qlRange: freeze.qlRange,
  qlCount: freeze.qlCount,
  locales: freeze.frozenLocales,
  frozenQuestions,
  contentIdentityChecks,
  decimalFreeChecks,
  formulaFirstChecks,
  calculationChecks,
  lifecycleChecks,
  frozenObjectChecks,
  localeCounts,
  qlCounts,
  lifecycle: freeze.lifecycle,
};
writeFileSync(
  join(outputDirectory, "int-cp004-multilingual-freeze-v9-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_MULTILINGUAL_FREEZE_V9");

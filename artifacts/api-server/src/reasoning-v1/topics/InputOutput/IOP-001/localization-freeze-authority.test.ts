import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import { IOP_001_ENGLISH_FREEZE_AUTHORITY } from "./english-freeze-authority.ts";
import {
  generateIopFrozenLocalizedReviewCaselet,
  IOP_001_LOCALIZATION_FREEZE_AUTHORITY,
} from "./localization-freeze-authority.ts";
import type { IopLocalizedLocale } from "./localization-v1.ts";

const locales: readonly IopLocalizedLocale[] = ["hi-IN", "pa-IN"] as const;

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, stable(entry)]),
    );
  }
  return value;
}

const learnerCaselets = locales.flatMap((locale) =>
  IOP_ENGLISH_SOURCE_MODES.flatMap((mode) =>
    [0, 1].map((sample) => {
      const seed = `IOP-EN-REVIEW-${mode.sourceModeId}-${String(sample).padStart(2, "0")}`;
      const caselet = generateIopFrozenLocalizedReviewCaselet(seed, mode.qlId, mode.sourceModeId, locale);
      assert.equal(caselet.lifecycle.maturity, "MULTILINGUAL_FROZEN");
      assert.equal(caselet.lifecycle.localizationFreeze, true);
      assert.equal(caselet.lifecycle.questionStudioDiscoverable, false);
      assert.equal(caselet.lifecycle.questionBankWritable, false);
      assert.equal(caselet.lifecycle.testEligible, false);
      assert.equal(caselet.lifecycle.publiclyPublishable, false);
      return {
        qlId: caselet.qlId,
        sourceModeId: caselet.sourceModeId,
        seed: caselet.seed,
        locale: caselet.locale,
        difficulty: caselet.difficulty,
        directions: caselet.directions,
        demonstration: caselet.demonstration,
        target: caselet.target,
        ruleExplanation: caselet.ruleExplanation,
        children: caselet.children.map((question) => ({
          questionOrder: question.questionOrder,
          kind: question.kind,
          evidence: question.evidence,
          text: question.text,
          options: question.options.map((option) => ({
            display: option.display,
            semanticFingerprint: option.semanticFingerprint,
            isCorrect: option.isCorrect,
          })),
          answerIndex: question.answerIndex,
          answerDisplay: question.answerDisplay,
          explanation: question.explanation,
        })),
      };
    }),
  ),
);

const payload = JSON.stringify(stable(learnerCaselets));
const digest = createHash("sha256").update(payload, "utf8").digest("hex");

assert.equal(IOP_001_ENGLISH_FREEZE_AUTHORITY.englishFreeze, true);
assert.equal(IOP_001_LOCALIZATION_FREEZE_AUTHORITY.humanLanguageApproval, "APPROVED_2026_08_18");
assert.equal(IOP_001_LOCALIZATION_FREEZE_AUTHORITY.localizationFreeze, true);
assert.equal(IOP_001_LOCALIZATION_FREEZE_AUTHORITY.questionStudioIntegrationAllowed, true);
assert.equal(IOP_001_LOCALIZATION_FREEZE_AUTHORITY.questionBankWritable, false);
assert.equal(IOP_001_LOCALIZATION_FREEZE_AUTHORITY.testEligible, false);
assert.equal(IOP_001_LOCALIZATION_FREEZE_AUTHORITY.publiclyPublishable, false);
assert.equal(learnerCaselets.length, IOP_001_LOCALIZATION_FREEZE_AUTHORITY.reviewCaseletCount);
assert.equal(learnerCaselets.reduce((sum, caselet) => sum + caselet.children.length, 0), IOP_001_LOCALIZATION_FREEZE_AUTHORITY.reviewQuestionCount);
assert.equal(digest, IOP_001_LOCALIZATION_FREEZE_AUTHORITY.canonicalLocalizedLearnerContentSha256);

console.log("PASS_IOP_001_LOCALIZATION_FREEZE_AUTHORITY");
console.log(`approved localization head ${IOP_001_LOCALIZATION_FREEZE_AUTHORITY.reviewedHead}`);
console.log(`approved localization artifact ${IOP_001_LOCALIZATION_FREEZE_AUTHORITY.reviewedArtifactId}`);
console.log(`locales ${IOP_001_LOCALIZATION_FREEZE_AUTHORITY.locales.join(",")}`);
console.log(`frozen localized caselets ${learnerCaselets.length}`);
console.log(`frozen localized questions ${learnerCaselets.reduce((sum, caselet) => sum + caselet.children.length, 0)}`);
console.log(`localized learner content sha256 ${digest}`);
console.log(`question studio integration allowed ${IOP_001_LOCALIZATION_FREEZE_AUTHORITY.questionStudioIntegrationAllowed}`);
console.log(`question bank writable ${IOP_001_LOCALIZATION_FREEZE_AUTHORITY.questionBankWritable}`);
console.log(`test eligible ${IOP_001_LOCALIZATION_FREEZE_AUTHORITY.testEligible}`);
console.log(`publicly publishable ${IOP_001_LOCALIZATION_FREEZE_AUTHORITY.publiclyPublishable}`);

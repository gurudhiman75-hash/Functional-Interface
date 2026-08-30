import assert from "node:assert/strict";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { trg001V3ResidualEnglishTokens } from "./localization-editorial-v3";
import { generateLocalizedTrg001QuestionNativeReviewFinal3Human } from "./localization-native-v5-pedagogic-review-final3-human";

type Locale = "hi-IN" | "pa-IN";

function optionSemantics(question: any) {
  return question.options.map((option: any) => ({
    value: option.value,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  }));
}

function learnerFields(question: any) {
  return [
    ["stem", question.stem],
    ...question.options.map((option: any, index: number) => [`option-${index + 1}`, option.display]),
    ["answer", question.localizedAnswerDisplay],
    ["keyRule", question.explanation?.keyRule],
    ...question.explanation.steps.flatMap((step: any, index: number) => [
      [`step-${index + 1}-title`, step.title],
      [`step-${index + 1}-body`, step.body],
    ]),
    ["shortcut", question.explanation?.shortcut],
    ...question.explanation.traps.map((trap: any, index: number) => [`trap-${index + 1}`, trap]),
  ] as Array<[string, unknown]>;
}

const residualHindiPatterns = [
  /tanθ=[^।.]+ के मान रखें/u,
] as const;

const residualPunjabiPatterns = [
  /ਇੱਕ ਦਸ਼ਮਲਵ ਨਾ ਰੱਖੋ/u,
  /ਟੈਂਜੈਂਟ ਹੈ sin\/cos/u,
  /ਦੋਵੇਂ ਪਰਸਪਰ ਫੰਕਸ਼ਨ ਦਾ/u,
  /ਹਨ ਪਰਸਪਰ ਦਾ ਇੱਕ-ਦੂਜੇ/u,
  /ਦੇ ਪਰਸਪਰ ਕੱਢੋ/u,
  /^ਕਾਇਮ ਰੱਖੋ ਅੰਤਿਮ/u,
  /ਗੁਣਾ ਨਾ ਕਰੋ ਨਾਲ/u,
  /ਚਤੁਰਭਾਗ ਚਿੰਨ੍ਹ ਹਨ ਵੱਖ ਕਦਮ/u,
  /ਵਿੱਚ ਹੁੰਦਾ ਹੈ cot²θ/u,
  /ਸਾਂਝੇ ਹਰ ਨਾਲ ਜੋੜੋ/u,
  /ਜਦੋਂ ਬਦਲਦੇ ਵੇਲੇ ਤੋਂ tan ਨੂੰ cot/u,
  /ਰਿਣਾਤਮਕ ਐਂਪਲੀਟਿਊਡ/u,
  /tanθ=[^।.]+ ਦੇ ਮਾਨ ਰੱਖੋ/u,
] as const;

const failures: Array<{ id: string; field: string; issue: string; text: string }> = [];
const fingerprints = new Set<string>();
const seedsPerQl = 3;
let cases = 0;
let inspectedFields = 0;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const seed = `trg001-review-final3-human-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const localized = generateLocalizedTrg001QuestionNativeReviewFinal3Human(qlId, seed, locale as Locale) as any;
      const repeated = generateLocalizedTrg001QuestionNativeReviewFinal3Human(qlId, seed, locale as Locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(localized, repeated, `${id}: human-polish surface is not deterministic.`);
      assert.equal(trg001CanonicalSemanticFingerprint(localized), trg001CanonicalSemanticFingerprint(source), `${id}: semantic fingerprint drift.`);
      assert.equal(localized.answer, source.answer, `${id}: canonical answer drift.`);
      assert.equal(localized.correctIndex, source.correctIndex, `${id}: correct-index drift.`);
      assert.deepEqual(optionSemantics(localized), optionSemantics(source), `${id}: option semantics drift.`);
      assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical-state drift.`);
      assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);
      assert.equal(localized.explanation.steps.length, source.explanation.steps.length, `${id}: step-count drift.`);

      for (const [field, raw] of learnerFields(localized)) {
        const text = String(raw ?? "");
        const residual = trg001V3ResidualEnglishTokens(text);
        if (residual.length) failures.push({ id, field, issue: `residual-english:${residual.join(",")}`, text });
        if (locale === "hi-IN") {
          for (const pattern of residualHindiPatterns) {
            if (pattern.test(text)) failures.push({ id, field, issue: `hindi-human-style:${pattern.source}`, text });
          }
        }
        if (locale === "pa-IN") {
          for (const pattern of residualPunjabiPatterns) {
            if (pattern.test(text)) failures.push({ id, field, issue: `punjabi-human-style:${pattern.source}`, text });
          }
        }
        inspectedFields += 1;
      }

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL3_HUMAN", `${id}: review status drift.`);
      assert.equal(localized.localizationProof?.final3HumanPolish, true, `${id}: human-polish proof missing.`);
      assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
      assert.equal(localized.frozen, false, `${id}: localized surface cannot auto-freeze.`);
      assert.equal(localized.freezeEligible, false, `${id}: localized surface cannot become freeze eligible automatically.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: freeze status drift.`);
      assert.equal(localized.activationAuthorized, false, `${id}: activation must remain OFF.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Studio must remain OFF.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized Bank must remain locked.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized Test Builder must remain OFF.`);
      assert.equal(localized.publiclyPublishable, false, `${id}: publication must remain OFF.`);
      assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release must remain OFF.`);
      assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze must remain false.`);
      assert.equal(localized.localizationLifecycle?.activationAuthorized, false, `${id}: lifecycle activation must remain false.`);
      assert.equal(localized.localizationLifecycle?.questionStudioEnabled, false, `${id}: Studio lifecycle gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.questionBankWritable, false, `${id}: Bank lifecycle gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.testBuilderEligible, false, `${id}: Test Builder lifecycle gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery must remain locked.`);
      assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: fingerprint invalid.`);
      assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate fingerprint.`);
      fingerprints.add(localized.localizationProof.localizationFingerprint);
      cases += 1;
    }
  }
}

console.log(JSON.stringify({
  status: failures.length ? "TRG001_FINAL3_HUMAN_DEFECT_INVENTORY" : "TRG001_FINAL3_HUMAN_ENGINEERING_PASS",
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  inspectedFields,
  failures: failures.length,
  failureSamples: failures.slice(0, 120),
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
}, null, 2));

assert.equal(failures.length, 0, `Final3 human-polish sweep has ${failures.length} failures.`);
assert.equal(cases, 144 * 2 * seedsPerQl, `Expected 864 human-polish cases, got ${cases}.`);
assert.equal(fingerprints.size, cases, "Expected one unique human-polish fingerprint per case.");

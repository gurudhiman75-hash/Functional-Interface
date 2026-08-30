import assert from "node:assert/strict";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { trg001V3ResidualEnglishTokens } from "./localization-editorial-v3";
import { generateLocalizedTrg001QuestionNativeReviewFinal } from "./localization-native-v5-pedagogic-review-final";

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

function translationese(text: string, locale: Locale) {
  const patterns = locale === "hi-IN"
    ? [
        /^मान ज्ञात कीजिए प्रत्येक/u,
        /नहीं है स्वतः/u,
        /हैं व्युत्क्रम केवल/u,
        /करने पर [^।]{0,60} देता है/u,
        /जोड़ने पर देता है/u,
        /उसका अपने/u,
        /के साथ उसका दिए/u,
        /पद हैं पर भिन्न/u,
        /साझा करते हैं पुनर्निर्मित/u,
        /घटाने पर में/u,
        /अलग कर देता है/u,
        /संबंध स्थापित करें वर्ग/u,
        /व्यंजक है हमेशा/u,
        /हल करें के लिए/u,
        /देता है से भाग देने पर/u,
        /मिलाने पर करनियों/u,
        /सटीक भिन्न देता है/u,
        /हैं व्युत्क्रम पर/u,
        /यह सरल होकर को/u,
        /बाद सरलीकरण/u,
        /गुणा करने से से/u,
        /मानs\b/u,
        /अनुपातs\b/u,
      ]
    : [
        /^ਮਾਨ ਕੱਢੋ ਹਰੇਕ/u,
        /ਨਹੀਂ ਹੈ ਆਪੇ/u,
        /ਹਨ ਪਰਸਪਰ ਕੇਵਲ/u,
        /ਕਰਨ ਤੇ [^।]{0,60} ਦਿੰਦਾ ਹੈ/u,
        /ਜੋੜਨ ਤੇ ਦਿੰਦਾ ਹੈ/u,
        /ਇਸਦਾ ਆਪਣੇ/u,
        /ਨਾਲ ਇਸਦਾ ਦਿੱਤੇ/u,
        /ਪਦ ਹਨ ਤੇ ਵੱਖਰਾ/u,
        /ਸਾਂਝਾ ਕਰਦੇ ਹਨ ਮੁੜ ਬਣਾਇਆ/u,
        /ਘਟਾਉਣ ਤੇ ਵਿੱਚ/u,
        /ਵੱਖ ਕਰ ਦਿੰਦਾ ਹੈ/u,
        /ਸਬੰਧ ਬਣਾਓ ਵਰਗ/u,
        /ਵਿਅੰਜਕ ਹੈ ਹਮੇਸ਼ਾਂ/u,
        /ਹੱਲ ਕਰੋ ਲਈ/u,
        /ਦਿੰਦਾ ਹੈ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ/u,
        /ਮਿਲਾਉਣ ਤੇ ਕਰਨੀਆਂ/u,
        /ਸਹੀ ਭਿੰਨ ਦਿੰਦਾ ਹੈ/u,
        /ਹਨ ਪਰਸਪਰ ਤੇ/u,
        /ਇਹ ਸਰਲ ਹੋ ਕੇ ਨੂੰ/u,
        /ਬਾਅਦ ਸਰਲੀਕਰਨ/u,
        /ਗੁਣਾ ਕਰਨ ਨਾਲ ਨਾਲ/u,
        /ਮਾਨs\b/u,
        /ਅਨੁਪਾਤs\b/u,
      ];
  return patterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

const failures: Array<{ id: string; field: string; issue: string; text: string }> = [];
const fingerprints = new Set<string>();
const seedsPerQl = 3;
let cases = 0;
let inspectedFields = 0;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const seed = `trg001-review-final-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const localized = generateLocalizedTrg001QuestionNativeReviewFinal(qlId, seed, locale) as any;
      const repeated = generateLocalizedTrg001QuestionNativeReviewFinal(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(localized, repeated, `${id}: final review surface is not deterministic.`);
      assert.equal(trg001CanonicalSemanticFingerprint(localized), trg001CanonicalSemanticFingerprint(source), `${id}: semantic drift.`);
      assert.equal(localized.answer, source.answer, `${id}: canonical answer drift.`);
      assert.equal(localized.correctIndex, source.correctIndex, `${id}: correct index drift.`);
      assert.deepEqual(optionSemantics(localized), optionSemantics(source), `${id}: option semantic drift.`);
      assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical state drift.`);
      assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);
      assert.equal(localized.explanation.steps.length, source.explanation.steps.length, `${id}: step count drift.`);

      for (const [field, raw] of learnerFields(localized)) {
        const text = String(raw ?? "");
        const residual = trg001V3ResidualEnglishTokens(text);
        if (residual.length) failures.push({ id, field, issue: `residual-english:${residual.join(",")}`, text });
        for (const pattern of translationese(text, locale as Locale)) {
          failures.push({ id, field, issue: `translationese:${pattern}`, text });
        }
        inspectedFields += 1;
      }

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL", `${id}: review status drift.`);
      assert.equal(localized.localizationProof?.finalNativeReviewOverlay, true, `${id}: final native review proof missing.`);
      assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
      assert.equal(localized.frozen, false, `${id}: localized surface cannot auto-freeze.`);
      assert.equal(localized.freezeEligible, false, `${id}: localized surface cannot become freeze eligible automatically.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: freeze status drift.`);
      assert.equal(localized.activationAuthorized, false, `${id}: activation must remain off.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Studio must remain off.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized Bank must remain locked.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized Test Builder must remain off.`);
      assert.equal(localized.publiclyPublishable, false, `${id}: publication must remain off.`);
      assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release must remain off.`);
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

const inventory = {
  status: failures.length ? "TRG001_NATIVE_REVIEW_FINAL_DEFECT_INVENTORY" : "TRG001_NATIVE_REVIEW_FINAL_ENGINEERING_PASS",
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  inspectedFields,
  failures: failures.length,
  failureSamples: failures.slice(0, 160),
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
};
console.log(JSON.stringify(inventory, null, 2));

assert.equal(failures.length, 0, `Final native editorial sweep has ${failures.length} failures.`);
assert.equal(cases, 144 * 2 * seedsPerQl, `Expected 864 final review cases, got ${cases}.`);
assert.equal(fingerprints.size, cases, "Expected one unique localization fingerprint per case.");

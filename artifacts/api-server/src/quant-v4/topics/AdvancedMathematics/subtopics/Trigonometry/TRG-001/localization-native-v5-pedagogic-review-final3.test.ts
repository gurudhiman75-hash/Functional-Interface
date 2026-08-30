import assert from "node:assert/strict";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { trg001V3ResidualEnglishTokens } from "./localization-editorial-v3";
import { generateLocalizedTrg001QuestionNativeReviewFinal3 } from "./localization-native-v5-pedagogic-review-final3";

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

function humanStyleArtifacts(text: string, locale: Locale) {
  const patterns = locale === "hi-IN"
    ? [
        /^पहचानें पूरक बराबर/u, /^व्युत्क्रम लें दोनों भुजाएँ का/u, /^व्युत्क्रम लें साइन, नहीं कोसाइन/u,
        /^प्रतिस्थापित न करें .* के साथ/u, /^भ्रमित न हों .* के साथ/u, /^न काटें के आर-पार/u,
        /45° के आर-पार/u, /पहले जोड़ने पर का वर्ग/u, /^न काटें .* के साथ .* क्योंकि/u,
        /^90° का स्थानांतरण फलन के साथ/u, /काम करता केवल/u, /नहीं हैं व्युत्क्रम का/u,
        /गुणा न करें से/u, /अदला-बदली करें के लिए/u, /सुरक्षित रखती है हर/u,
        /सर्वसमिका पहले मान रखने/u, /लागू होता है को/u, /यह है उलटें दिशा/u,
        /व्युत्क्रम फलन गुणा करके/u, /मान न रखें लगभग/u, /^पुनर्लिखें/u,
        /o²\+a²=h² जब जोड़ने पर/u, /टैन्जेंट को पुनर्निर्मित करें सेकेंट/u, /^न जोड़ें 1 को/u,
        /संयुग्मी युग्म गुणा करके/u, /नहीं सेकेंट-टैन्जेंट/u, /^क्रॉस पद है/u,
        /भाग दें, फिर अलग करें/u, /उलट जाता है जब बदलते समय/u, /^चक्कर प्रत्येक/u,
        /^लागू न करें एक/u, /रुकने पर पर/u, /^न छोड़ें गुणक/u,
        /गुणनफल अतः सरल हो जाता है को/u, /युग्म गुणा होकर को/u, /न भूलें को वर्ग/u,
        /^तीन कोण हैं भिन्न/u, /नहीं किया जा सकता स्वतंत्र/u, /^गणना करें/u,
        /^यह है √/u, /से से भाग देने पर/u, /। मिलता है/u,
      ]
    : [
        /^ਪਰਸਪਰ ਲਓ ਸਾਈਨ, ਨਹੀਂ ਕੋਸਾਈਨ/u, /^ਪਛਾਣੋ ਪੂਰਕ ਬਰਾਬਰ/u, /^ਪਰਸਪਰ ਲਓ ਦੋਵੇਂ ਭੁਜਾਵਾਂ ਦਾ/u,
        /^ਨਾ ਕੱਟੋ ਦੇ ਪਾਰ/u, /ਪਹਿਲਾਂ ਜੋੜਨ ਤੇ ਦਾ ਵਰਗ/u, /^ਨਾ ਕੱਟੋ .* ਨਾਲ .* ਕਿਉਂਕਿ/u,
        /^90° ਦਾ ਸਥਾਨਾਂਤਰ ਫੰਕਸ਼ਨ ਦੇ ਨਾਲ/u, /(?:ਪਹਿਲਾ|ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ) ਚਤੁਰਭਾਗ ਵਿੱਚ/u,
        /^ਗਲਤ ਨਾ ਮਿਲਾਓ/u, /ਕੰਮ ਕਰਦਾ ਕੇਵਲ/u, /ਅਦਲਾ-ਬਦਲੀ ਕਰੋ ਲਈ/u,
        /ਸੁਰੱਖਿਅਤ ਰੱਖਦੀ ਹੈ ਹਰ/u, /ਸਰਬਸਮਿਕਾ ਪਹਿਲਾਂ ਮਾਨ/u, /ਲਾਗੂ ਹੁੰਦਾ ਹੈ ਨੂੰ/u,
        /ਇਹ ਹੈ ਉਲਟੋ ਦਿਸ਼ਾ/u, /ਪਰਸਪਰ ਫੰਕਸ਼ਨ ਗੁਣਾ ਕਰਕੇ/u, /ਮਾਨ ਨਾ ਰੱਖੋ ਲਗਭਗ/u,
        /^ਮੁੜ ਲਿਖੋ/u, /o²\+a² ਜਦੋਂ ਜੋੜਨ/u, /ਟੈਂਜੈਂਟ ਨੂੰ ਮੁੜ ਬਣਾਓ ਸੀਕੈਂਟ/u,
        /^ਨਾ ਜੋੜੋ 1 ਨੂੰ/u, /ਸੰਯੁਗਮੀ ਜੋੜੇ ਗੁਣਾ ਕਰਕੇ/u, /ਨਹੀਂ ਸੀਕੈਂਟ-ਟੈਂਜੈਂਟ/u,
        /^ਕਰਾਸ ਪਦ ਹੈ/u, /ਭਾਗ ਦਿਓ, ਫਿਰ ਵੱਖ ਕਰੋ/u, /^ਚੱਕਰ ਹਰੇਕ/u,
        /^ਲਾਗੂ ਨਾ ਕਰੋ ਇੱਕ/u, /ਰੁਕਣ ਤੇ ਤੇ/u, /^ਨਾ ਛੱਡੋ ਗੁਣਕ/u,
        /ਗੁਣਨਫਲ ਇਸ ਲਈ ਸਰਲ ਹੋ ਜਾਂਦਾ ਹੈ ਨੂੰ/u, /ਜੋੜਾ ਗੁਣਾ ਹੋ ਕੇ ਨੂੰ/u, /ਨਾ ਭੁੱਲੋ ਨੂੰ ਵਰਗ/u,
        /^ਤਿੰਨ ਕੋਣ ਹਨ ਵੱਖਰਾ/u, /ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ ਸੁਤੰਤਰ/u, /^ਗਣਨਾ ਕਰੋ/u,
        /^ਇਹ ਹੈ √/u, /ਤੋਂ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ/u, /। ਮਿਲਦਾ ਹੈ/u,
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
      const seed = `trg001-review-final3-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const localized = generateLocalizedTrg001QuestionNativeReviewFinal3(qlId, seed, locale) as any;
      const repeated = generateLocalizedTrg001QuestionNativeReviewFinal3(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(localized, repeated, `${id}: Final3 surface is not deterministic.`);
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
        for (const pattern of humanStyleArtifacts(text, locale as Locale)) failures.push({ id, field, issue: `human-style-artifact:${pattern}`, text });
        inspectedFields += 1;
      }

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL3", `${id}: review status drift.`);
      assert.equal(localized.localizationProof?.finalNativeReviewOverlay3, true, `${id}: Final3 proof missing.`);
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

const inventory = {
  status: failures.length ? "TRG001_NATIVE_REVIEW_FINAL3_DEFECT_INVENTORY" : "TRG001_NATIVE_REVIEW_FINAL3_ENGINEERING_PASS",
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
assert.equal(failures.length, 0, `Final3 human-style sweep has ${failures.length} failures.`);
assert.equal(cases, 144 * 2 * seedsPerQl, `Expected 864 Final3 cases, got ${cases}.`);
assert.equal(fingerprints.size, cases, "Expected one unique Final3 fingerprint per case.");

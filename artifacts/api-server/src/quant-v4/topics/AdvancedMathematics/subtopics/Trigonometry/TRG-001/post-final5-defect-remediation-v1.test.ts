import assert from "node:assert/strict";

import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeReviewFinal5 } from "./localization-native-v5-pedagogic-review-final5";
import {
  TRG_001_LOCALIZATION_FINAL6_REMEDIATED_IDS,
  generateLocalizedTrg001QuestionNativeReviewFinal6,
} from "./localization-native-v5-pedagogic-review-final6";
import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_POST_FREEZE_REMEDIATION_V1_IDS,
  generatePostFreezeRemediatedTrg001Question,
} from "./production-post-freeze-remediation-v1";

type Locale = "hi-IN" | "pa-IN";
type ConjugateVariant = "sin" | "cos";

function learnerStrings(question: any) {
  return [
    question.stem,
    ...(question.options ?? []).map((option: any) => option.display ?? option),
    question.localizedAnswerDisplay ?? question.answer,
    question.explanation?.keyRule,
    ...(question.explanation?.steps ?? []).flatMap((step: any) => [step.title, step.body]),
    question.explanation?.shortcut,
    ...(question.explanation?.traps ?? []),
  ].map((value) => String(value ?? ""));
}

function assertLifecycleLocked(question: any, label: string) {
  assert.equal(question.humanReviewStatus, "PENDING", `${label}: human review must remain pending.`);
  assert.equal(question.frozen, false, `${label}: candidate must not inherit frozen=true.`);
  assert.equal(question.freezeEligible, false, `${label}: candidate must not be freeze eligible before review.`);
  assert.equal(question.freezeStatus, "NOT_FROZEN", `${label}: candidate must remain not frozen.`);
  assert.equal(question.questionStudioDiscoverable, false, `${label}: Question Studio must remain off.`);
  assert.equal(question.questionBankStatus, "NOT_STORED", `${label}: Question Bank writes must remain off.`);
  assert.equal(question.testEligibility, "INELIGIBLE", `${label}: Test Builder must remain off.`);
  assert.equal(question.publiclyPublishable, false, `${label}: public publication must remain off.`);
}

function ql142ConjugateVariant(question: any): ConjugateVariant {
  const workedText = (question.explanation?.steps ?? []).map((step: any) => String(step?.body ?? "")).join(" ");
  const usesSinConjugate = workedText.includes("1−sin²");
  const usesCosConjugate = workedText.includes("1−cos²");
  assert.notEqual(usesSinConjugate, usesCosConjugate, "QL142 must expose exactly one conjugate variant in worked steps.");
  return usesSinConjugate ? "sin" : "cos";
}

function expectedQl142Shortcut(question: any, locale: Locale) {
  const variant = ql142ConjugateVariant(question);
  if (locale === "hi-IN") {
    return variant === "sin"
      ? "संयुग्मी गुणनफल (1+sinα)(1−sinα)=1−sin²α=cos²α का प्रयोग करें।"
      : "संयुग्मी गुणनफल (1+cosα)(1−cosα)=1−cos²α=sin²α का प्रयोग करें।";
  }
  return variant === "sin"
    ? "ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ (1+sinα)(1−sinα)=1−sin²α=cos²α ਵਰਤੋ।"
    : "ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ (1+cosα)(1−cosα)=1−cos²α=sin²α ਵਰਤੋ।";
}

const expectedLocalizedCorrections: Record<string, Record<Locale, { field: "keyRule" | "shortcut"; text: string }>> = {
  "TRG-001-QL-093": {
    "hi-IN": { field: "shortcut", text: "sin θ के अनुपात से cos θ ज्ञात करें, फिर माँगे गए व्यंजक में मान रखें।" },
    "pa-IN": { field: "shortcut", text: "sin θ ਦੇ ਅਨੁਪਾਤ ਤੋਂ cos θ ਕੱਢੋ, ਫਿਰ ਮੰਗੇ ਗਏ ਵਿਅੰਜਕ ਵਿੱਚ ਮਾਨ ਰੱਖੋ।" },
  },
  "TRG-001-QL-098": {
    "hi-IN": { field: "shortcut", text: "tan θ के अनुपात से sec θ और cos θ ज्ञात करें।" },
    "pa-IN": { field: "shortcut", text: "tan θ ਦੇ ਅਨੁਪਾਤ ਤੋਂ sec θ ਅਤੇ cos θ ਕੱਢੋ।" },
  },
  "TRG-001-QL-100": {
    "hi-IN": { field: "shortcut", text: "tan θ के अनुपात से sin θ और cos θ ज्ञात करें, फिर उनके वर्गों को दिए गए क्रम में घटाएँ।" },
    "pa-IN": { field: "shortcut", text: "tan θ ਦੇ ਅਨੁਪਾਤ ਤੋਂ sin θ ਅਤੇ cos θ ਕੱਢੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਦੇ ਵਰਗ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਘਟਾਓ।" },
  },
  "TRG-001-QL-113": {
    "hi-IN": { field: "keyRule", text: "cos θ से भाग देकर tan θ को अलग करें।" },
    "pa-IN": { field: "keyRule", text: "cos θ ਨਾਲ ਭਾਗ ਦੇ ਕੇ tan θ ਨੂੰ ਵੱਖ ਕਰੋ।" },
  },
  "TRG-001-QL-114": {
    "hi-IN": { field: "keyRule", text: "रैखिक संबंध से sin θ:cos θ का अनुपात निकालें, फिर माँगा गया योग-अंतर अनुपात बनाएँ।" },
    "pa-IN": { field: "keyRule", text: "ਰੇਖੀ ਸੰਬੰਧ ਤੋਂ sin θ:cos θ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ, ਫਿਰ ਮੰਗਿਆ ਗਿਆ ਜੋੜ-ਅੰਤਰ ਅਨੁਪਾਤ ਬਣਾਓ।" },
  },
  "TRG-001-QL-115": {
    "hi-IN": { field: "keyRule", text: "रैखिक संबंध को tan अनुपात में बदलें, फिर cot के लिए व्युत्क्रम लें।" },
    "pa-IN": { field: "keyRule", text: "ਰੇਖੀ ਸੰਬੰਧ ਨੂੰ tan ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ cot ਲਈ ਪਰਸਪਰ ਲਓ।" },
  },
};

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144);
assert.deepEqual(TRG_001_POST_FREEZE_REMEDIATION_V1_IDS, ["TRG-001-QL-093"]);
assert.equal(TRG_001_LOCALIZATION_FINAL6_REMEDIATED_IDS.length, 7);

let englishCases = 0;
let localizedCases = 0;
let correctionAssertions = 0;
const seedsPerQl = 3;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (let seedIndex = 1; seedIndex <= seedsPerQl; seedIndex += 1) {
    const seed = `trg001-post-final5-remediation-${String(seedIndex).padStart(2, "0")}-${qlId}`;
    const frozen = generateHumanApprovedTrg001Question(qlId, seed) as any;
    const englishCandidate = generatePostFreezeRemediatedTrg001Question(qlId, seed) as any;

    assert.equal(englishCandidate.answer, frozen.answer, `${qlId}: English answer drift.`);
    assert.equal(englishCandidate.correctIndex, frozen.correctIndex, `${qlId}: English correct-index drift.`);
    assert.deepEqual(englishCandidate.canonicalState, frozen.canonicalState, `${qlId}: English canonical-state drift.`);
    assert.deepEqual(englishCandidate.verification, frozen.verification, `${qlId}: English verification drift.`);
    assert.equal(
      trg001CanonicalSemanticFingerprint(englishCandidate),
      trg001CanonicalSemanticFingerprint(frozen),
      `${qlId}: English canonical semantic drift.`,
    );
    assertLifecycleLocked(englishCandidate, `${qlId}:English`);
    for (const text of learnerStrings(englishCandidate)) {
      assert(!/\$\{[^}]+\}/u.test(text), `${qlId}: unresolved learner-facing template placeholder: ${text}`);
    }

    if (qlId === "TRG-001-QL-093") {
      assert.equal(
        englishCandidate.explanation.traps?.[0],
        "Write 1 as a fraction with the same denominator before combining.",
        "QL093 English placeholder remediation is not pinned.",
      );
      correctionAssertions += 1;
    } else {
      assert.deepEqual(englishCandidate.explanation, frozen.explanation, `${qlId}: unrelated English explanation drift.`);
    }
    englishCases += 1;

    for (const locale of TRG_001_LOCALIZATION_LOCALES as readonly Locale[]) {
      const final5 = generateLocalizedTrg001QuestionNativeReviewFinal5(qlId, seed, locale) as any;
      const final6 = generateLocalizedTrg001QuestionNativeReviewFinal6(qlId, seed, locale) as any;
      const label = `${qlId}:${locale}`;

      assert.equal(final6.stem, final5.stem, `${label}: stem drift.`);
      assert.deepEqual(final6.options, final5.options, `${label}: option drift.`);
      assert.equal(final6.localizedAnswerDisplay, final5.localizedAnswerDisplay, `${label}: localized answer drift.`);
      assert.equal(final6.answer, final5.answer, `${label}: canonical answer drift.`);
      assert.equal(final6.correctIndex, final5.correctIndex, `${label}: correct-index drift.`);
      assert.deepEqual(final6.canonicalState, final5.canonicalState, `${label}: canonical-state drift.`);
      assert.deepEqual(final6.verification, final5.verification, `${label}: verification drift.`);
      assert.equal(
        trg001CanonicalSemanticFingerprint(final6),
        trg001CanonicalSemanticFingerprint(englishCandidate),
        `${label}: Final6 semantic drift from remediated English candidate.`,
      );
      assertLifecycleLocked(final6, label);

      if (qlId === "TRG-001-QL-142") {
        assert.equal(final6.explanation.shortcut, expectedQl142Shortcut(final5, locale), `${label}: variant-aware QL142 correction missing.`);
        correctionAssertions += 1;
      } else {
        const expected = expectedLocalizedCorrections[qlId]?.[locale];
        if (expected) {
          assert.equal(final6.explanation[expected.field], expected.text, `${label}: targeted Final6 correction missing.`);
          correctionAssertions += 1;
        } else {
          assert.deepEqual(final6.explanation, final5.explanation, `${label}: unrelated localization explanation drift.`);
        }
      }

      const badTexts = learnerStrings(final6).filter((text) =>
        text.includes("cos θ से समकोण त्रिभुज पुनर्निर्मित करें, फिर sin θ का मान रखें।")
        || text.includes("cos θ ਤੋਂ ਸਮਕੋਣ ਤਿਕੋਣ ਮੁੜ ਬਣਾਓ, ਫਿਰ sin θ ਦਾ ਮਾਨ ਲਗਾਓ।")
        || text.includes("sec θ और cos θ की सहायता से tan θ पुनर्निर्मित करें।")
        || text.includes("sec θ ਅਤੇ cos θ ਦੀ ਮਦਦ ਨਾਲ tan θ ਮੁੜ ਬਣਾਓ।")
        || text.includes("पहले sin²θ और cos²θ का अंतर निकालें, फिर tan θ का अनुपात बनाएँ।")
        || text.includes("ਪਹਿਲਾਂ sin²θ ਅਤੇ cos²θ ਦਾ ਅੰਤਰ ਕੱਢੋ, ਫਿਰ tan θ ਦਾ ਅਨੁਪਾਤ ਬਣਾਓ।")
      );
      assert.equal(badTexts.length, 0, `${label}: known post-Final5 defect remains: ${badTexts.join(" | ")}`);
      localizedCases += 1;
    }
  }
}

const ql142Variants = new Set<ConjugateVariant>();
for (const seed of [
  "trg001-final5-review-TRG-001-QL-142",
  "trg001-post-final5-review-TRG-001-QL-142",
]) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES as readonly Locale[]) {
    const final5 = generateLocalizedTrg001QuestionNativeReviewFinal5("TRG-001-QL-142", seed, locale) as any;
    const final6 = generateLocalizedTrg001QuestionNativeReviewFinal6("TRG-001-QL-142", seed, locale) as any;
    ql142Variants.add(ql142ConjugateVariant(final5));
    assert.equal(
      final6.explanation.shortcut,
      expectedQl142Shortcut(final5, locale),
      `TRG-001-QL-142:${locale}:${seed}: seed-dependent conjugate shortcut mismatch.`,
    );
  }
}
assert.deepEqual([...ql142Variants].sort(), ["cos", "sin"], "QL142 dedicated seeds must exercise both conjugate variants.");

assert.equal(englishCases, 144 * seedsPerQl);
assert.equal(localizedCases, 144 * 2 * seedsPerQl);
assert.equal(correctionAssertions, seedsPerQl * (1 + 7 * 2));

console.log(JSON.stringify({
  status: "PASS",
  englishCases,
  localizedCases,
  correctionAssertions,
  ql142ConjugateVariants: [...ql142Variants].sort(),
  englishRemediationIds: TRG_001_POST_FREEZE_REMEDIATION_V1_IDS,
  localizedRemediationIds: TRG_001_LOCALIZATION_FINAL6_REMEDIATED_IDS,
  humanReview: "PENDING",
  frozen: false,
  activation: false,
}, null, 2));

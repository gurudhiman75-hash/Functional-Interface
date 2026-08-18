import assert from "node:assert/strict";

import {
  TRG_002_EXAM_REALNESS_V2_CANONICAL_OVERRIDE_IDS,
  generateTrg002ExamRealnessV2CanonicalQuestion,
  isTrg002ExamRealnessV2CanonicalOverride,
} from "./production-exam-realness-v2";
import {
  TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS,
  generateExamRealLocalizedTrg002Question,
  type Trg002ExamRealnessLocale,
} from "./localization-exam-realness-v2";

const LOCALES: readonly Trg002ExamRealnessLocale[] = ["hi-IN", "pa-IN"];
const ALLOWED_LATIN = new Set(["m", "tan", "sin", "cos", "x", "h", "d", "w", "s", "l", "a", "b", "o", "p", "q", "t", "e"]);

function semanticOptions(question: any) {
  return question.options.map((option: any) => ({
    value: option.value,
    display: option.display,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  }));
}

function learnerText(question: any) {
  return [
    question.stem,
    question.explanation.keyRule,
    ...question.explanation.steps.map((step: any) => step.body),
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join(" ");
}

function assertNoExamRealnessLeaks(question: any, locale: Trg002ExamRealnessLocale) {
  const text = learnerText(question);
  const stem = question.stem as string;

  assert(!/[-−]\d+\s*\+\s*\d+√3\s*m/u.test(stem), `${question.qlId}:${locale}: artificial signed compound-surd measurement leaked into stem.`);
  assert(!/\b\d+\/2\s*m\b/u.test(text), `${question.qlId}:${locale}: fractional half-metre learner surface must use decimal formatting.`);
  assert(!stem.includes("पेड़/खंभा") && !stem.includes("ਦਰੱਖਤ/ਖੰਭਾ"), `${question.qlId}:${locale}: slash object placeholder leaked.`);
  assert(!stem.includes("छोटी/पहली") && !stem.includes("ਛੋਟੀ/ਪਹਿਲੀ"), `${question.qlId}:${locale}: slash building placeholder leaked.`);
  assert(!/(खंभा की|खंभा का|खंभा के|खंभा तक|खंभा से)/u.test(text), `${question.qlId}:${locale}: Hindi pole inflection regression.`);
  assert(!/(ਖੰਭਾ ਦੀ|ਖੰਭਾ ਦਾ|ਖੰਭਾ ਦੇ|ਖੰਭਾ ਤੱਕ|ਖੰਭਾ ਤੋਂ)/u.test(text), `${question.qlId}:${locale}: Punjabi pole inflection regression.`);
  assert(!stem.includes("डिप्रैशन") && !stem.includes("ਡਿਪ੍ਰੈਸ਼ਨ"), `${question.qlId}:${locale}: English depression transliteration leaked.`);
  if (["TRG-002-QL-083", "TRG-002-QL-084", "TRG-002-QL-085"].includes(question.qlId)) {
    assert(!/उसके शीर्ष से .+ m दूर दूसरी इमारत/u.test(stem), `${question.qlId}: ambiguous top-to-top distance wording remains.`);
    assert(!/ਇਸ ਦੀ ਛੱਤ ਤੋਂ .+ m ਦੂਰ ਦੂਜੀ ਇਮਾਰਤ/u.test(stem), `${question.qlId}: ambiguous Punjabi top-to-top distance wording remains.`);
    assert(locale === "hi-IN" ? stem.includes("पादों के बीच क्षैतिज दूरी") : stem.includes("ਪੈਰਾਂ ਵਿਚਕਾਰ ਖਿਤਿਜੀ ਦੂਰੀ"), `${question.qlId}:${locale}: horizontal foot-to-foot separation must be explicit.`);
  }

  const latinTokens = text.match(/[A-Za-z][A-Za-z-]*/g) ?? [];
  for (const raw of latinTokens) {
    const token = raw.toLowerCase();
    assert(ALLOWED_LATIN.has(token), `${question.qlId}:${locale}: avoidable English learner token leaked: ${raw}`);
  }
}

assert.equal(TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS.length, 96, "Exam-realness V2 must cover all 96 TRG-002 QLs.");
assert.equal(new Set(TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS).size, 96, "Exam-realness V2 contains duplicate QL IDs.");
assert.equal(TRG_002_EXAM_REALNESS_V2_CANONICAL_OVERRIDE_IDS.length, 8, "Expected eight canonical realness overrides.");

let cases = 0;
const qlLocaleFingerprints = new Set<string>();
for (const qlId of TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS) {
  for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
    const seed = `trg002-exam-realness-v2-gate-${String(seedIndex).padStart(2, "0")}`;
    const canonical: any = generateTrg002ExamRealnessV2CanonicalQuestion(qlId, seed);
    assert.equal(canonical.qlId, qlId, `${qlId}: canonical QL identity drift.`);
    assert.equal(canonical.validation.valid, true, `${qlId}: canonical validation must remain PASS.`);

    for (const locale of LOCALES) {
      const localized: any = generateExamRealLocalizedTrg002Question(qlId, seed, locale);
      assert.equal(localized.qlId, canonical.qlId, `${qlId}:${locale}: QL identity drift.`);
      assert.equal(localized.seed, canonical.seed, `${qlId}:${locale}: seed drift.`);
      assert.equal(localized.cpId, canonical.cpId, `${qlId}:${locale}: CP drift.`);
      assert.equal(localized.lockedFamily, canonical.lockedFamily, `${qlId}:${locale}: family drift.`);
      assert.equal(localized.solveMode, canonical.solveMode, `${qlId}:${locale}: solve-mode drift.`);
      assert.equal(localized.difficulty, canonical.difficulty, `${qlId}:${locale}: difficulty drift.`);
      assert.equal(localized.target, canonical.target, `${qlId}:${locale}: target drift.`);
      assert.deepEqual(localized.exactAnswer, canonical.exactAnswer, `${qlId}:${locale}: exact answer drift.`);
      assert.equal(localized.answer, canonical.answer, `${qlId}:${locale}: displayed answer drift.`);
      assert.equal(localized.correctIndex, canonical.correctIndex, `${qlId}:${locale}: correct-index drift.`);
      assert.deepEqual(semanticOptions(localized), semanticOptions(canonical), `${qlId}:${locale}: option semantics drift.`);
      assert.deepEqual(localized.canonicalSpatialState, canonical.canonicalSpatialState, `${qlId}:${locale}: canonical spatial state drift.`);
      assert.deepEqual(localized.solutionDiagram, canonical.solutionDiagram, `${qlId}:${locale}: solution diagram drift.`);
      assert.deepEqual(localized.diagramEvidence, canonical.diagramEvidence, `${qlId}:${locale}: diagram evidence drift.`);
      assert.equal(localized.validation.valid, true, `${qlId}:${locale}: validation must remain PASS.`);

      assert.equal(localized.realnessRemediation.canonicalOverride, isTrg002ExamRealnessV2CanonicalOverride(qlId), `${qlId}:${locale}: canonical override flag mismatch.`);
      assert.equal(localized.humanReviewStatus, "PENDING", `${qlId}:${locale}: human review must remain pending.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${qlId}:${locale}: V2 must remain unfrozen.`);
      assert.equal(localized.freezeEligible, false, `${qlId}:${locale}: V2 cannot be freeze-eligible before human review.`);
      assert.equal(localized.activationAuthorized, false, `${qlId}:${locale}: activation must remain OFF.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${qlId}:${locale}: Question Studio must remain OFF.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${qlId}:${locale}: question bank must remain OFF.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${qlId}:${locale}: Test Builder must remain OFF.`);
      assert.equal(localized.publiclyPublishable, false, `${qlId}:${locale}: public publishing must remain OFF.`);
      assert.equal(localized.localizationLifecycle.multilingualFreezeGranted, false, `${qlId}:${locale}: multilingual freeze must remain false.`);
      assert.equal(localized.localizationLifecycle.productDeliveryUnlocked, false, `${qlId}:${locale}: product delivery must remain locked.`);

      assert(localized.stem.length >= 35, `${qlId}:${locale}: stem too short after remediation.`);
      assert(localized.explanation.steps.length >= 2, `${qlId}:${locale}: explanation too shallow.`);
      if (locale === "hi-IN") {
        assert(/[\u0900-\u097F]/u.test(localized.stem), `${qlId}: Hindi stem lacks Devanagari.`);
        assert(/[\u0900-\u097F]/u.test(localized.explanation.keyRule), `${qlId}: Hindi explanation lacks Devanagari.`);
      } else {
        assert(/[\u0A00-\u0A7F]/u.test(localized.stem), `${qlId}: Punjabi stem lacks Gurmukhi.`);
        assert(/[\u0A00-\u0A7F]/u.test(localized.explanation.keyRule), `${qlId}: Punjabi explanation lacks Gurmukhi.`);
      }
      assertNoExamRealnessLeaks(localized, locale);

      const fingerprintKey = `${qlId}|${seed}|${locale}|${localized.localizationProof.localizationFingerprint}`;
      assert(!qlLocaleFingerprints.has(fingerprintKey), `${qlId}:${locale}: duplicate fingerprint key.`);
      qlLocaleFingerprints.add(fingerprintKey);

      const repeat: any = generateExamRealLocalizedTrg002Question(qlId, seed, locale);
      assert.equal(repeat.stem, localized.stem, `${qlId}:${locale}: deterministic stem drift.`);
      assert.deepEqual(repeat.explanation, localized.explanation, `${qlId}:${locale}: deterministic explanation drift.`);
      assert.equal(repeat.localizationProof.localizationFingerprint, localized.localizationProof.localizationFingerprint, `${qlId}:${locale}: deterministic fingerprint drift.`);
      cases += 1;
    }
  }
}

assert.equal(cases, 96 * 12 * 2, `Expected 2,304 V2 realness cases, got ${cases}.`);
console.log(`TRG002_EXAM_REALNESS_REMEDIATION_V2_PASS qls=96 locales=2 cases=${cases} canonicalOverrides=8 human=PENDING multilingualFreeze=false activation=false`);

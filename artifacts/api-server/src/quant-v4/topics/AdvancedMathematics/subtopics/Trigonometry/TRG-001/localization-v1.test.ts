import assert from "node:assert/strict";

import { TRG_001_AUTHORITY_ALIGNED_IDS } from "./production-authority-runtime";
import {
  TRG_001_FREEZE,
  generateHumanApprovedTrg001Question,
} from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  generateLocalizedTrg001Question,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";

function semanticOptionProjection(question: any) {
  return question.options.map((option: any) => ({
    value: option.value,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  }));
}

function containsNativeScript(value: unknown, locale: "hi-IN" | "pa-IN") {
  const text = String(value ?? "");
  return locale === "hi-IN" ? /[\u0900-\u097F]/u.test(text) : /[\u0A00-\u0A7F]/u.test(text);
}

function isLanguageNeutralMathRule(value: unknown) {
  const text = String(value ?? "")
    .replace(/\b(?:sin|cos|tan|cot|sec|cosec)\b/giu, "")
    .replace(/\b(?:A|B|C|R)\b/gu, "");
  return !/[A-Za-z]{2,}/u.test(text);
}

assert.equal(TRG_001_AUTHORITY_ALIGNED_IDS.length, 144, "TRG-001 localization requires the frozen 144-QL authority.");
assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144, "TRG-001 localization scope must contain 144 QLs.");
assert.equal(new Set(TRG_001_LOCALIZATION_QL_IDS).size, 144, "TRG-001 localization scope contains duplicate QLs.");
assert.deepEqual(TRG_001_LOCALIZATION_LOCALES, ["hi-IN", "pa-IN"], "TRG-001 localization locales drifted.");
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
  "TRG-001 English authority fingerprint drifted before localization.",
);

const cpCounts = new Map<string, number>();
const fingerprints = new Set<string>();
let cases = 0;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  const canonical = generateHumanApprovedTrg001Question(qlId, `trg001-localization-audit-${qlId}`) as any;
  cpCounts.set(canonical.cpId, (cpCounts.get(canonical.cpId) ?? 0) + 1);

  assert.equal(canonical.frozen, true, `${qlId}: English authority is not frozen.`);
  assert.equal(canonical.freezeStatus, "FROZEN", `${qlId}: English freeze status drift.`);
  assert.equal(canonical.language, "en", `${qlId}: English authority language drift.`);

  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    const seed = `trg001-localization-v1-${qlId}-${locale}`;
    const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
    const localized = generateLocalizedTrg001Question(qlId, seed, locale) as any;
    const repeated = generateLocalizedTrg001Question(qlId, seed, locale) as any;
    const id = `${qlId}:${locale}`;

    assert.deepEqual(localized, repeated, `${id}: localization is not deterministic.`);
    assert.equal(localized.qlId, source.qlId, `${id}: QL identity drift.`);
    assert.equal(localized.cpId, source.cpId, `${id}: CP identity drift.`);
    assert.equal(localized.seed, source.seed, `${id}: seed drift.`);
    assert.equal(localized.lockedFamily, source.lockedFamily, `${id}: locked family drift.`);
    assert.equal(localized.solveMode, source.solveMode, `${id}: solve-mode drift.`);
    assert.equal(localized.difficulty, source.difficulty, `${id}: difficulty drift.`);
    assert.equal(localized.target, source.target, `${id}: target drift.`);
    assert.deepEqual(localized.exactAnswer, source.exactAnswer, `${id}: exact-answer drift.`);
    assert.equal(localized.answer, source.answer, `${id}: canonical answer drift.`);
    assert.equal(localized.correctIndex, source.correctIndex, `${id}: correct-index drift.`);
    assert.deepEqual(semanticOptionProjection(localized), semanticOptionProjection(source), `${id}: option semantic drift.`);
    assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical-state drift.`);
    assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);
    assert.equal(
      trg001CanonicalSemanticFingerprint(localized),
      trg001CanonicalSemanticFingerprint(source),
      `${id}: canonical semantic fingerprint changed after localization.`,
    );

    assert.equal(localized.locale, locale, `${id}: locale mismatch.`);
    assert.equal(localized.language, locale === "hi-IN" ? "hi" : "pa", `${id}: language mismatch.`);
    assert.notEqual(localized.stem, source.stem, `${id}: stem was not localized.`);
    assert(containsNativeScript(localized.stem, locale), `${id}: localized stem lacks native script.`);
    assert(
      containsNativeScript(localized.explanation?.keyRule, locale)
        || isLanguageNeutralMathRule(localized.explanation?.keyRule),
      `${id}: key rule contains untranslated English prose.`,
    );
    assert(localized.explanation?.steps?.length >= 1, `${id}: localized explanation has no steps.`);
    assert(
      localized.explanation.steps.every((step: any) => containsNativeScript(`${step.title} ${step.body}`, locale)),
      `${id}: one or more localized explanation steps lack native script.`,
    );

    assert.equal(localized.reviewStatus, "LOCALIZATION_REVIEW_CANDIDATE_V1", `${id}: review status drift.`);
    assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human language review must remain pending.`);
    assert.equal(localized.frozen, false, `${id}: localized candidate inherited English freeze.`);
    assert.equal(localized.freezeEligible, false, `${id}: localized candidate became freeze eligible automatically.`);
    assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: localized freeze status drift.`);
    assert.equal(localized.activationAuthorized, false, `${id}: activation must remain OFF.`);
    assert.equal(localized.questionStudioDiscoverable, false, `${id}: Question Studio must remain OFF for localized candidate.`);
    assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: Question Bank must remain locked.`);
    assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: test eligibility must remain OFF.`);
    assert.equal(localized.publiclyPublishable, false, `${id}: publication must remain OFF.`);
    assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release authorization must remain OFF.`);
    assert.equal(localized.localizationLifecycle?.hindiPunjabi, "REVIEW_CANDIDATE_V1", `${id}: localization lifecycle drift.`);
    assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze must remain false.`);
    assert.equal(localized.localizationLifecycle?.questionBankWritable, false, `${id}: localized bank write gate must remain false.`);
    assert.equal(localized.localizationLifecycle?.testBuilderEligible, false, `${id}: localized Test Builder gate must remain false.`);
    assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery must remain locked.`);
    assert.equal(
      localized.localizationLifecycle?.englishAuthorityFingerprint,
      TRG_001_FREEZE.approvedContentFingerprint,
      `${id}: localization provenance lost the frozen English fingerprint.`,
    );
    assert.equal(localized.localizationProof?.semanticParity, "CANONICAL_SEMANTICS_PRESERVED", `${id}: semantic parity proof drift.`);
    assert.match(localized.localizationProof?.canonicalSemanticFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: canonical semantic fingerprint invalid.`);
    assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: localization fingerprint invalid.`);
    assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate localization fingerprint.`);
    fingerprints.add(localized.localizationProof.localizationFingerprint);
    cases += 1;
  }
}

for (let cp = 1; cp <= 6; cp += 1) {
  const cpId = `TRG-CP-${String(cp).padStart(3, "0")}`;
  assert.equal(cpCounts.get(cpId), 24, `${cpId}: expected exactly 24 permanent QLs.`);
}
assert.equal(cases, 288, `Expected 288 localized review-candidate surfaces, got ${cases}.`);
assert.equal(fingerprints.size, 288, "Localization fingerprint count mismatch.");

console.log(JSON.stringify({
  status: "TRG001_LOCALIZATION_V1_PARITY_PASS",
  frozenEnglishQls: 144,
  localizedSurfaces: 288,
  locales: [...TRG_001_LOCALIZATION_LOCALES],
  cpCount: 6,
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
}, null, 2));

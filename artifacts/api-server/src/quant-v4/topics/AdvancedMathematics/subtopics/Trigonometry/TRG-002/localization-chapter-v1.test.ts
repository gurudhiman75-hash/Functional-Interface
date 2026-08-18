import assert from "node:assert/strict";

import { generateFrozenTrg002Production96Question } from "./production-frozen-96-runtime";
import { TRG_002_PRODUCTION_96_IDS } from "./production-96-registry";
import { generateLocalizedTrg002Cp007Question } from "./localization-cp007-v1";
import { generateLocalizedTrg002Cp008QuestionCompat } from "./localization-cp008-v1-compat";
import { generateLocalizedTrg002Cp009QuestionCompat } from "./localization-cp009-v1-compat";
import { generateLocalizedTrg002Cp010Question } from "./localization-cp010-v1";

type Locale = "hi-IN" | "pa-IN";
const LOCALES: readonly Locale[] = ["hi-IN", "pa-IN"];

function qlNumber(qlId: string) {
  const match = /^TRG-002-QL-(\d{3})$/.exec(qlId);
  if (!match) throw new Error(`Invalid TRG-002 QL ${qlId}.`);
  return Number(match[1]);
}
function generateLocalized(qlId: string, seed: string, locale: Locale): any {
  const n = qlNumber(qlId);
  if (n <= 24) return generateLocalizedTrg002Cp007Question(qlId, seed, locale as any);
  if (n <= 48) return generateLocalizedTrg002Cp008QuestionCompat(qlId, seed, locale as any);
  if (n <= 72) return generateLocalizedTrg002Cp009QuestionCompat(qlId, seed, locale as any);
  return generateLocalizedTrg002Cp010Question(qlId, seed, locale as any);
}
function optionProjection(question: any) {
  return question.options.map((option: any) => ({ value: option.value, display: option.display, isCorrect: option.isCorrect, misconceptionId: option.misconceptionId }));
}

assert.equal(TRG_002_PRODUCTION_96_IDS.length, 96, "TRG-002 chapter localization audit requires exactly 96 frozen English QLs.");
assert.equal(new Set(TRG_002_PRODUCTION_96_IDS).size, 96, "TRG-002 chapter localization audit found duplicate English QL IDs.");

const localizedIds = new Set<string>();
const localizationFingerprints = new Set<string>();
const cpCounts = new Map<string, number>();
let cases = 0;
for (const qlId of TRG_002_PRODUCTION_96_IDS) {
  const seed = `trg002-localization-chapter-v1-${qlId}`;
  const canonical: any = generateFrozenTrg002Production96Question(qlId, seed);
  assert.equal(canonical.frozen, true, `${qlId}: frozen English authority lost.`);
  assert.equal(canonical.freezeStatus, "FROZEN", `${qlId}: English freeze status drift.`);
  cpCounts.set(canonical.cpId, (cpCounts.get(canonical.cpId) ?? 0) + 1);

  for (const locale of LOCALES) {
    const localized: any = generateLocalized(qlId, seed, locale);
    const id = `${qlId}:${locale}`;
    assert(!localizedIds.has(id), `${id}: duplicate localized identity.`);
    localizedIds.add(id);

    assert.equal(localized.qlId, canonical.qlId, `${id}: QL identity drift.`);
    assert.equal(localized.cpId, canonical.cpId, `${id}: CP identity drift.`);
    assert.equal(localized.seed, canonical.seed, `${id}: seed drift.`);
    assert.equal(localized.lockedFamily, canonical.lockedFamily, `${id}: family drift.`);
    assert.equal(localized.solveMode, canonical.solveMode, `${id}: solve-mode drift.`);
    assert.equal(localized.difficulty, canonical.difficulty, `${id}: difficulty drift.`);
    assert.equal(localized.target, canonical.target, `${id}: target drift.`);
    assert.equal(localized.answer, canonical.answer, `${id}: answer drift.`);
    assert.deepEqual(localized.exactAnswer, canonical.exactAnswer, `${id}: exact-answer drift.`);
    assert.equal(localized.correctIndex, canonical.correctIndex, `${id}: correct-index drift.`);
    assert.deepEqual(optionProjection(localized), optionProjection(canonical), `${id}: option-semantic drift.`);
    assert.deepEqual(localized.canonicalSpatialState, canonical.canonicalSpatialState, `${id}: canonical-spatial-state drift.`);
    assert.deepEqual(localized.solutionDiagram, canonical.solutionDiagram, `${id}: solution-diagram drift.`);
    assert.deepEqual(localized.diagramEvidence, canonical.diagramEvidence, `${id}: diagram-evidence drift.`);
    assert.equal(localized.validation.valid, true, `${id}: inherited canonical validation must remain PASS.`);

    assert.equal(localized.locale, locale, `${id}: locale mismatch.`);
    assert.notEqual(localized.stem, canonical.stem, `${id}: learner stem was not localized.`);
    assert(localized.stem.length >= 30, `${id}: localized stem unexpectedly short.`);
    assert(localized.explanation?.keyRule?.length >= 12, `${id}: localized key rule unexpectedly short.`);
    assert(localized.explanation?.steps?.length >= 2, `${id}: localized explanation unexpectedly shallow.`);
    if (locale === "hi-IN") {
      assert(/[\u0900-\u097F]/.test(localized.stem), `${id}: Hindi stem lacks Devanagari.`);
      assert(/[\u0900-\u097F]/.test(localized.explanation.keyRule), `${id}: Hindi rule lacks Devanagari.`);
    } else {
      assert(/[\u0A00-\u0A7F]/.test(localized.stem), `${id}: Punjabi stem lacks Gurmukhi.`);
      assert(/[\u0A00-\u0A7F]/.test(localized.explanation.keyRule), `${id}: Punjabi rule lacks Gurmukhi.`);
    }

    assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human language review must remain pending.`);
    assert.equal(localized.frozen, false, `${id}: localized candidate must not inherit English freeze.`);
    assert.equal(localized.freezeEligible, false, `${id}: localized candidate must not become freeze eligible automatically.`);
    assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: localized candidate freeze status drift.`);
    assert.equal(localized.localizationLifecycle?.hindiPunjabi, "REVIEW_CANDIDATE_V1", `${id}: lifecycle drift.`);
    assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze must remain false.`);
    assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery must remain locked.`);
    assert.equal(localized.activationAuthorized, false, `${id}: activation must remain OFF.`);
    assert.equal(localized.questionStudioDiscoverable, false, `${id}: Question Studio must remain OFF.`);
    assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: Question Bank must remain locked.`);
    assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: test eligibility must remain OFF.`);
    assert.equal(localized.publiclyPublishable, false, `${id}: publication must remain OFF.`);

    const localizationFingerprint = String(localized.localizationProof?.localizationFingerprint ?? "");
    assert.match(localizationFingerprint, /^[0-9a-f]{64}$/, `${id}: localization fingerprint missing/invalid.`);
    assert(!localizationFingerprints.has(localizationFingerprint), `${id}: duplicate localization fingerprint.`);
    localizationFingerprints.add(localizationFingerprint);
    cases += 1;
  }
}

assert.equal(cases, 192, `Expected 192 chapter review-candidate surfaces, got ${cases}.`);
assert.equal(localizedIds.size, 192, "Chapter audit localized identity count mismatch.");
assert.equal(localizationFingerprints.size, 192, "Chapter audit localization fingerprint count mismatch.");
for (const cp of ["TRG-CP-007", "TRG-CP-008", "TRG-CP-009", "TRG-CP-010"] as const) {
  assert.equal(cpCounts.get(cp), 24, `${cp}: expected 24 frozen English QLs.`);
}
console.log(`TRG002_LOCALIZATION_CHAPTER_V1_PASS englishQls=96 localizedSurfaces=192 locales=2 cpCount=4 humanLanguageReview=PENDING multilingualFreeze=false activation=false`);

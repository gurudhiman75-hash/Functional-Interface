import assert from "node:assert/strict";

import { generateFrozenTrg002Production96Question } from "./production-frozen-96-runtime";
import {
  TRG_002_CP008_LOCALIZATION_QL_IDS,
  generateLocalizedTrg002Cp008Question,
  trg002Cp008CanonicalSemanticFingerprint,
  type Trg002Cp008LocalizedLocale,
} from "./localization-cp008-v1";

const LOCALES: readonly Trg002Cp008LocalizedLocale[] = ["hi-IN", "pa-IN"];
const ENGLISH_STEM_FRAGMENTS = [
  "Find the",
  "casts a",
  "shadow when",
  "leans against",
  "makes an angle",
  "touches the ground",
  "guy wire",
  "supporting wire",
];

function semanticOptionProjection(question: any) {
  return question.options.map((option: any) => ({
    value: option.value,
    display: option.display,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  }));
}

assert.equal(TRG_002_CP008_LOCALIZATION_QL_IDS.length, 24, "CP008 localization must cover exactly 24 permanent QLs.");
assert.equal(new Set(TRG_002_CP008_LOCALIZATION_QL_IDS).size, 24, "CP008 localization contains duplicate QL IDs.");
assert.equal(TRG_002_CP008_LOCALIZATION_QL_IDS[0], "TRG-002-QL-025", "CP008 localization must begin at QL-025.");
assert.equal(TRG_002_CP008_LOCALIZATION_QL_IDS[23], "TRG-002-QL-048", "CP008 localization must end at QL-048.");

const seenFamilies = new Set<string>();
let cases = 0;
for (const qlId of TRG_002_CP008_LOCALIZATION_QL_IDS) {
  for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
    const seed = `trg002-cp008-localization-gate-${String(seedIndex).padStart(2, "0")}`;
    const canonical: any = generateFrozenTrg002Production96Question(qlId, seed);
    const beforeFingerprint = trg002Cp008CanonicalSemanticFingerprint(canonical);
    seenFamilies.add(canonical.lockedFamily);

    assert.equal(canonical.cpId, "TRG-CP-008", `${qlId}: canonical CP drift.`);
    assert.equal(canonical.frozen, true, `${qlId}: English source must remain frozen.`);
    assert.equal(canonical.freezeStatus, "FROZEN", `${qlId}: English source freeze status drift.`);
    assert.equal(canonical.activationAuthorized, false, `${qlId}: English activation lock drift.`);

    for (const locale of LOCALES) {
      const localized: any = generateLocalizedTrg002Cp008Question(qlId, seed, locale);
      const afterFingerprint = trg002Cp008CanonicalSemanticFingerprint(canonical);

      assert.equal(afterFingerprint, beforeFingerprint, `${qlId}:${locale}: localizer mutated canonical English source.`);
      assert.equal(localized.localizationProof.canonicalSemanticFingerprint, beforeFingerprint, `${qlId}:${locale}: canonical semantic fingerprint mismatch.`);
      assert.equal(trg002Cp008CanonicalSemanticFingerprint(localized), beforeFingerprint, `${qlId}:${locale}: localized semantic projection drift.`);
      assert.equal(localized.qlId, canonical.qlId, `${qlId}:${locale}: QL identity drift.`);
      assert.equal(localized.seed, canonical.seed, `${qlId}:${locale}: seed drift.`);
      assert.equal(localized.lockedFamily, canonical.lockedFamily, `${qlId}:${locale}: locked family drift.`);
      assert.equal(localized.solveMode, canonical.solveMode, `${qlId}:${locale}: solve-mode drift.`);
      assert.equal(localized.difficulty, canonical.difficulty, `${qlId}:${locale}: difficulty drift.`);
      assert.equal(localized.target, canonical.target, `${qlId}:${locale}: target drift.`);
      assert.equal(localized.answer, canonical.answer, `${qlId}:${locale}: displayed answer drift.`);
      assert.deepEqual(localized.exactAnswer, canonical.exactAnswer, `${qlId}:${locale}: exact answer drift.`);
      assert.equal(localized.correctIndex, canonical.correctIndex, `${qlId}:${locale}: correct-index drift.`);
      assert.deepEqual(semanticOptionProjection(localized), semanticOptionProjection(canonical), `${qlId}:${locale}: option semantics drift.`);
      assert.deepEqual(localized.canonicalSpatialState, canonical.canonicalSpatialState, `${qlId}:${locale}: canonical spatial state drift.`);
      assert.deepEqual(localized.solutionDiagram, canonical.solutionDiagram, `${qlId}:${locale}: solution diagram drift.`);
      assert.deepEqual(localized.diagramEvidence, canonical.diagramEvidence, `${qlId}:${locale}: diagram evidence drift.`);
      assert.equal(localized.validation.valid, true, `${qlId}:${locale}: inherited canonical validation must remain PASS.`);

      assert.equal(localized.frozen, false, `${qlId}:${locale}: localized candidate must not inherit English freeze.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${qlId}:${locale}: localized candidate freeze status invalid.`);
      assert.equal(localized.freezeEligible, false, `${qlId}:${locale}: localized candidate must not be freeze eligible before human language review.`);
      assert.equal(localized.humanReviewStatus, "PENDING", `${qlId}:${locale}: human language review must remain pending.`);
      assert.equal(localized.localizationLifecycle.hindiPunjabi, "REVIEW_CANDIDATE_V1", `${qlId}:${locale}: lifecycle mismatch.`);
      assert.equal(localized.localizationLifecycle.humanLanguageReviewRequired, true, `${qlId}:${locale}: human-language gate missing.`);
      assert.equal(localized.localizationLifecycle.multilingualFreezeGranted, false, `${qlId}:${locale}: multilingual freeze must remain false.`);
      assert.equal(localized.localizationLifecycle.productDeliveryUnlocked, false, `${qlId}:${locale}: delivery must remain locked.`);
      assert.equal(localized.activationAuthorized, false, `${qlId}:${locale}: activation must remain OFF.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${qlId}:${locale}: Question Studio must remain OFF.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${qlId}:${locale}: question bank storage must remain OFF.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${qlId}:${locale}: Test Builder eligibility must remain OFF.`);
      assert.equal(localized.publiclyPublishable, false, `${qlId}:${locale}: public publication must remain OFF.`);

      assert(localized.stem.length >= 25, `${qlId}:${locale}: localized stem is unexpectedly short.`);
      assert(localized.explanation.steps.length >= 3, `${qlId}:${locale}: localized explanation is too shallow.`);
      for (const fragment of ENGLISH_STEM_FRAGMENTS) {
        assert(!localized.stem.includes(fragment), `${qlId}:${locale}: English stem fragment leaked: ${fragment}`);
      }
      if (locale === "hi-IN") {
        assert(/[\u0900-\u097F]/.test(localized.stem), `${qlId}: Hindi stem lacks Devanagari text.`);
        assert(/[\u0900-\u097F]/.test(localized.explanation.keyRule), `${qlId}: Hindi explanation lacks Devanagari text.`);
      } else {
        assert(/[\u0A00-\u0A7F]/.test(localized.stem), `${qlId}: Punjabi stem lacks Gurmukhi text.`);
        assert(/[\u0A00-\u0A7F]/.test(localized.explanation.keyRule), `${qlId}: Punjabi explanation lacks Gurmukhi text.`);
      }

      const repeat: any = generateLocalizedTrg002Cp008Question(qlId, seed, locale);
      assert.equal(repeat.localizationProof.localizationFingerprint, localized.localizationProof.localizationFingerprint, `${qlId}:${locale}: localization must be deterministic.`);
      assert.equal(repeat.stem, localized.stem, `${qlId}:${locale}: deterministic stem drift.`);
      assert.deepEqual(repeat.explanation, localized.explanation, `${qlId}:${locale}: deterministic explanation drift.`);

      cases += 1;
    }
  }
}

assert.deepEqual(
  [...seenFamilies].sort(),
  ["BROKEN_TREE_TOUCHING_GROUND", "CHANGED_SHADOW", "GUY_WIRE_MAST_ANCHOR", "HEIGHT_TO_SHADOW", "LADDER_AGAINST_WALL", "SHADOW_TO_HEIGHT"].sort(),
  "CP008 localization must cover all six locked application families.",
);
assert.equal(cases, 24 * 12 * 2, `Expected 576 localized semantic-parity cases, got ${cases}.`);
console.log(`TRG002_CP008_LOCALIZATION_V1_PASS qls=24 families=${seenFamilies.size} locales=2 cases=${cases} englishFrozen=true humanLanguageReview=PENDING multilingualFreeze=false activation=false`);

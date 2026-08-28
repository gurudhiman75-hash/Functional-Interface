import assert from "node:assert/strict";

import { generateFrozenTrg002Production96Question } from "./production-frozen-96-runtime";
import {
  TRG_002_CP010_LOCALIZATION_QL_IDS,
  generateLocalizedTrg002Cp010Question,
  trg002Cp010CanonicalSemanticFingerprint,
  type Trg002Cp010LocalizedLocale,
} from "./localization-cp010-v1";

const LOCALES: readonly Trg002Cp010LocalizedLocale[] = ["hi-IN", "pa-IN"];
const ENGLISH_STEM_FRAGMENTS = ["Find the", "angle of elevation", "angle of depression", "building's height", "river width", "observation point"];
function semanticOptionProjection(question: any) {
  return question.options.map((option: any) => ({ value: option.value, display: option.display, isCorrect: option.isCorrect, misconceptionId: option.misconceptionId }));
}
assert.equal(TRG_002_CP010_LOCALIZATION_QL_IDS.length, 24);
assert.equal(new Set(TRG_002_CP010_LOCALIZATION_QL_IDS).size, 24);
assert.equal(TRG_002_CP010_LOCALIZATION_QL_IDS[0], "TRG-002-QL-073");
assert.equal(TRG_002_CP010_LOCALIZATION_QL_IDS[23], "TRG-002-QL-096");

const seenFamilies = new Set<string>();
let cases = 0;
for (const qlId of TRG_002_CP010_LOCALIZATION_QL_IDS) {
  for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
    const seed = `trg002-cp010-localization-gate-${String(seedIndex).padStart(2, "0")}`;
    const canonical: any = generateFrozenTrg002Production96Question(qlId, seed);
    const beforeFingerprint = trg002Cp010CanonicalSemanticFingerprint(canonical);
    seenFamilies.add(canonical.lockedFamily);
    assert.equal(canonical.cpId, "TRG-CP-010", `${qlId}: canonical CP drift.`);
    assert.equal(canonical.frozen, true, `${qlId}: English source must remain frozen.`);
    assert.equal(canonical.freezeStatus, "FROZEN", `${qlId}: English source freeze status drift.`);
    for (const locale of LOCALES) {
      const localized: any = generateLocalizedTrg002Cp010Question(qlId, seed, locale);
      assert.equal(trg002Cp010CanonicalSemanticFingerprint(canonical), beforeFingerprint, `${qlId}:${locale}: canonical source mutated.`);
      assert.equal(localized.localizationProof.canonicalSemanticFingerprint, beforeFingerprint, `${qlId}:${locale}: canonical fingerprint mismatch.`);
      assert.equal(trg002Cp010CanonicalSemanticFingerprint(localized), beforeFingerprint, `${qlId}:${locale}: semantic projection drift.`);
      assert.equal(localized.qlId, canonical.qlId);
      assert.equal(localized.seed, canonical.seed);
      assert.equal(localized.lockedFamily, canonical.lockedFamily);
      assert.equal(localized.solveMode, canonical.solveMode);
      assert.equal(localized.difficulty, canonical.difficulty);
      assert.equal(localized.target, canonical.target);
      assert.equal(localized.answer, canonical.answer);
      assert.deepEqual(localized.exactAnswer, canonical.exactAnswer);
      assert.equal(localized.correctIndex, canonical.correctIndex);
      assert.deepEqual(semanticOptionProjection(localized), semanticOptionProjection(canonical));
      assert.deepEqual(localized.canonicalSpatialState, canonical.canonicalSpatialState);
      assert.deepEqual(localized.solutionDiagram, canonical.solutionDiagram);
      assert.deepEqual(localized.diagramEvidence, canonical.diagramEvidence);
      assert.equal(localized.validation.valid, true);
      assert.equal(localized.frozen, false);
      assert.equal(localized.freezeStatus, "NOT_FROZEN");
      assert.equal(localized.freezeEligible, false);
      assert.equal(localized.humanReviewStatus, "PENDING");
      assert.equal(localized.activationAuthorized, false);
      assert.equal(localized.questionStudioDiscoverable, false);
      assert.equal(localized.questionBankStatus, "NOT_STORED");
      assert.equal(localized.testEligibility, "INELIGIBLE");
      assert.equal(localized.publiclyPublishable, false);
      assert.equal(localized.localizationLifecycle.multilingualFreezeGranted, false);
      assert.equal(localized.localizationLifecycle.productDeliveryUnlocked, false);
      assert(localized.stem.length >= 35, `${qlId}:${locale}: localized stem too short.`);
      assert(localized.explanation.steps.length >= 3, `${qlId}:${locale}: explanation too shallow.`);
      for (const fragment of ENGLISH_STEM_FRAGMENTS) assert(!localized.stem.includes(fragment), `${qlId}:${locale}: English stem fragment leaked: ${fragment}`);
      if (locale === "hi-IN") {
        assert(/[\u0900-\u097F]/.test(localized.stem), `${qlId}: Hindi stem lacks Devanagari.`);
        assert(/[\u0900-\u097F]/.test(localized.explanation.keyRule), `${qlId}: Hindi explanation lacks Devanagari.`);
      } else {
        assert(/[\u0A00-\u0A7F]/.test(localized.stem), `${qlId}: Punjabi stem lacks Gurmukhi.`);
        assert(/[\u0A00-\u0A7F]/.test(localized.explanation.keyRule), `${qlId}: Punjabi explanation lacks Gurmukhi.`);
      }
      const repeat: any = generateLocalizedTrg002Cp010Question(qlId, seed, locale);
      assert.equal(repeat.localizationProof.localizationFingerprint, localized.localizationProof.localizationFingerprint);
      assert.equal(repeat.stem, localized.stem);
      assert.deepEqual(repeat.explanation, localized.explanation);
      cases += 1;
    }
  }
}
for (const family of ["OBSERVER_HEIGHT_CORRECTION", "OPPOSITE_SIDE_OBSERVATIONS", "BUILDING_TO_BUILDING", "ELEVATION_AND_DEPRESSION", "COMPOSITE_VERTICAL_OBJECT_RELATIONS"] as const) {
  assert(seenFamilies.has(family), `CP010 localization missing family ${family}.`);
}
assert([...seenFamilies].some((family) => family.startsWith("RIVER_WIDTH")), "CP010 localization missing river-width family.");
assert.equal(cases, 24 * 12 * 2, `Expected 576 localized semantic-parity cases, got ${cases}.`);
console.log(`TRG002_CP010_LOCALIZATION_V1_PASS qls=24 families=${seenFamilies.size} locales=2 cases=${cases} englishFrozen=true humanLanguageReview=PENDING multilingualFreeze=false activation=false`);

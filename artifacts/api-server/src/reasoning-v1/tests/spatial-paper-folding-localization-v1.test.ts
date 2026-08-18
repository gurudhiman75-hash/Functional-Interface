import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { generatePfcPermanentEnglishCorpusV1, generatePfcPermanentEnglishQlV1 } from "../foundation/spatial/paper-folding-permanent-english-runtime-v1";
import {
  PFC_001_LOCALIZATION_AUTHORITY_DRAFT_V1,
  generatePfcLocalizedCorpusV1,
  generatePfcLocalizedQlV1,
  renderPfcLocalizedStimulusSvgV1,
  renderPfcLocalizationReviewHtmlV1,
} from "../foundation/spatial/paper-folding-localization-v1";

const english = generatePfcPermanentEnglishCorpusV1();
const hindi = generatePfcLocalizedCorpusV1("hi");
const punjabi = generatePfcLocalizedCorpusV1("pa");
assert.equal(english.length, 320);
assert.equal(hindi.length, 320);
assert.equal(punjabi.length, 320);
assert.equal(PFC_001_LOCALIZATION_AUTHORITY_DRAFT_V1.status, "HINDI_PUNJABI_RUNTIME_IMPLEMENTED_REVIEW_PENDING");

const forbiddenHindi = ["परावर्तन", "अक्षीय", "सममिति", "ज्यामिति", "प्रतिच्छेदन"];
const forbiddenPunjabi = ["ਪਰਾਵਰਤਨ", "ਅਕਸੀਅਲ", "ਸਮਮਿਤੀ", "ਜਿਆਮਿਤੀ"];

for (let index = 0; index < english.length; index += 1) {
  const en = english[index];
  const hi = hindi[index];
  const pa = punjabi[index];
  for (const localized of [hi, pa]) {
    assert.equal(localized.permanentQuestionId, en.permanentQuestionId);
    assert.equal(localized.canonicalQuestionId, en.canonicalQuestionId);
    assert.equal(localized.permanentQlId, en.permanentQlId);
    assert.equal(localized.sourceDiscoveryQuestionId, en.sourceDiscoveryQuestionId);
    assert.equal(localized.sourceDiscoveryIndex, en.sourceDiscoveryIndex);
    assert.equal(localized.semanticFingerprint, en.semanticFingerprint);
    assert.equal(localized.deliveryFingerprint, en.deliveryFingerprint);
    assert.deepEqual(localized.sheetBoundary, en.sheetBoundary);
    assert.deepEqual(localized.folds, en.folds);
    assert.deepEqual(localized.cuts, en.cuts);
    assert.deepEqual(localized.options, en.options);
    assert.equal(localized.correctOptionIndex, en.correctOptionIndex);
    assert.equal(localized.correctOptionId, en.correctOptionId);
    assert.equal(localized.localization.geometryInvariant, true);
    assert.equal(localized.localization.optionOrderInvariant, true);
    assert.equal(localized.localization.answerInvariant, true);
    assert.equal(localized.localization.idInvariant, true);
    assert.equal(localized.localization.fingerprintInvariant, true);
  }

  assert.equal(hi.language, "hi");
  assert.equal(hi.locale, "hi-IN");
  assert.equal(pa.language, "pa");
  assert.equal(pa.locale, "pa-IN");
  assert.notEqual(hi.stem, en.stem);
  assert.notEqual(pa.stem, en.stem);
  assert.ok(hi.explanation.includes(`विकल्प ${hi.correctOptionId}`));
  assert.ok(pa.explanation.includes(`ਵਿਕਲਪ ${pa.correctOptionId}`));
  for (const word of forbiddenHindi) assert.ok(!hi.explanation.includes(word), `formal Hindi term ${word}`);
  for (const word of forbiddenPunjabi) assert.ok(!pa.explanation.includes(word), `formal Punjabi term ${word}`);
  assert.ok(!/\(\d+(?:\.\d+)?,\s*\d/.test(hi.explanation));
  assert.ok(!/\(\d+(?:\.\d+)?,\s*\d/.test(pa.explanation));

  const hiSvg = renderPfcLocalizedStimulusSvgV1(hi, 520);
  const paSvg = renderPfcLocalizedStimulusSvgV1(pa, 520);
  assert.ok(hiSvg.includes("कागज़"));
  assert.ok(hiSvg.includes("मोड़"));
  assert.ok(hiSvg.includes("कट"));
  assert.ok(paSvg.includes("ਕਾਗਜ਼"));
  assert.ok(paSvg.includes("ਮੋੜ"));
  assert.ok(paSvg.includes("ਕੱਟ"));
  assert.ok(!hiSvg.includes(">Paper<"));
  assert.ok(!paSvg.includes(">Paper<"));
  assert.ok(hiSvg.includes("marker-end="));
  assert.ok(paSvg.includes("marker-end="));
}

const qlIds = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"] as const;
for (const qlId of qlIds) {
  const enQl = generatePfcPermanentEnglishQlV1(qlId);
  const hiQl = generatePfcLocalizedQlV1(qlId, "hi");
  const paQl = generatePfcLocalizedQlV1(qlId, "pa");
  assert.equal(enQl.length, 80);
  assert.equal(hiQl.length, 80);
  assert.equal(paQl.length, 80);
  assert.deepEqual(hiQl.map((q) => q.correctOptionId), enQl.map((q) => q.correctOptionId));
  assert.deepEqual(paQl.map((q) => q.correctOptionId), enQl.map((q) => q.correctOptionId));
}

const reviewOffsets = [0, 16, 32, 48, 64, 79];
const reviewQuestions = qlIds.flatMap((qlId) => [
  ...reviewOffsets.map((offset) => generatePfcLocalizedQlV1(qlId, "hi")[offset]),
  ...reviewOffsets.map((offset) => generatePfcLocalizedQlV1(qlId, "pa")[offset]),
]);
assert.equal(reviewQuestions.length, 48);
const reviewHtml = renderPfcLocalizationReviewHtmlV1(reviewQuestions);
assert.ok(reviewHtml.includes("PFC-001 Hindi Punjabi Review V1"));
assert.ok(reviewHtml.includes("lang=\"hi\""));
assert.ok(reviewHtml.includes("lang=\"pa\""));
assert.ok(reviewHtml.includes("कागज़"));
assert.ok(reviewHtml.includes("ਕਾਗਜ਼"));
assert.ok(reviewHtml.includes("width=\"112\""));
assert.ok(!reviewHtml.includes("<script"));

const evidence = {
  authority: PFC_001_LOCALIZATION_AUTHORITY_DRAFT_V1,
  status: "PASS_PFC_001_HI_PA_LOCALIZATION_PARITY_V1",
  corpus: {
    englishQuestions: english.length,
    hindiQuestions: hindi.length,
    punjabiQuestions: punjabi.length,
    parityComparisons: 640,
    retainedLearnerReviewQuestions: reviewQuestions.length,
    localizedDiagramLabels: true,
    optionPixels: 112,
    stimulusPixels: 520,
  },
  invariants: {
    geometry: true,
    folds: true,
    cuts: true,
    optionOrder: true,
    answer: true,
    ids: true,
    fingerprints: true,
  },
  governance: {
    localizationFrozen: false,
    questionStudioRegistered: false,
    automaticPublication: false,
  },
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-hi-pa-localization-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-hi-pa-localization-v1-review.html",
  reviewHtml,
  "utf8",
);
console.log(JSON.stringify(evidence));

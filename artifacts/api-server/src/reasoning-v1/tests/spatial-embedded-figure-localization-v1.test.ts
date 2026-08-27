import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  generateEmbeddedFigurePermanentEnglishQuestionV1,
  type EmbeddedFigurePermanentEnglishQuestionV1,
} from "../foundation/spatial/embedded-figure-permanent-english-runtime-v1";
import {
  EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1,
  generateEmbeddedFigureLocalizedPairV1,
  localizeEmbeddedFigureQuestionV1,
  type EmbeddedFigureLocalizedQuestionV1,
} from "../foundation/spatial/embedded-figure-localization-v1";
import { EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/embedded-figure-english-freeze-v1";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function explanationText(question: EmbeddedFigurePermanentEnglishQuestionV1 | EmbeddedFigureLocalizedQuestionV1): string {
  return [question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check].join(" ");
}

function assertInvariantParity(source: EmbeddedFigurePermanentEnglishQuestionV1, localized: EmbeddedFigureLocalizedQuestionV1): void {
  assert.equal(localized.seed, source.seed, `${source.seed}: seed changed in localization.`);
  assert.equal(localized.permanentQlId, source.permanentQlId, `${source.seed}: permanent QL changed.`);
  assert.equal(localized.proposalId, source.proposalId, `${source.seed}: proposal changed.`);
  assert.equal(localized.chapterCode, source.chapterCode, `${source.seed}: chapter changed.`);
  assert.equal(localized.equivalencePolicy, source.equivalencePolicy, `${source.seed}: equivalence policy changed.`);
  assert.equal(localized.motifId, source.motifId, `${source.seed}: motif ID changed.`);
  assert.equal(localized.motifFamily, source.motifFamily, `${source.seed}: motif family changed.`);
  assert.equal(localized.motifVariant, source.motifVariant, `${source.seed}: motif variant changed.`);
  assert.equal(localized.difficulty, source.difficulty, `${source.seed}: difficulty changed.`);
  assert.equal(localized.stemVariant, source.stemVariant, `${source.seed}: stem variant changed.`);
  assert.equal(localized.correctIndex, source.correctIndex, `${source.seed}: correct index changed.`);
  assert.equal(localized.answer, source.answer, `${source.seed}: answer changed.`);
  assert.equal(localized.targetSvg, source.targetSvg, `${source.seed}: target SVG changed.`);
  assert.deepEqual(localized.optionSvgs, source.optionSvgs, `${source.seed}: option SVGs changed.`);
  assert.deepEqual(localized.targetGraph, source.targetGraph, `${source.seed}: target graph changed.`);
  assert.deepEqual(localized.optionGraphs, source.optionGraphs, `${source.seed}: option graphs changed.`);
  assert.deepEqual(localized.distractorKindsByIndex, source.distractorKindsByIndex, `${source.seed}: distractor ownership changed.`);
  assert.equal(localized.geometryFingerprint, source.geometryFingerprint, `${source.seed}: geometry fingerprint changed.`);
  assert.equal(localized.contentFingerprint, source.contentFingerprint, `${source.seed}: canonical content fingerprint changed.`);
  assert.equal(localized.targetFingerprint, source.targetFingerprint, `${source.seed}: target fingerprint changed.`);
  assert.equal(localized.targetScaleInCorrectHost, source.targetScaleInCorrectHost, `${source.seed}: target scale changed.`);
  assert.deepEqual(localized.validation, source.validation, `${source.seed}: validation changed.`);
  assert.deepEqual(localized.visualValidation, source.visualValidation, `${source.seed}: visual validation changed.`);
  assert.deepEqual(localized.connectivityValidation, source.connectivityValidation, `${source.seed}: connectivity validation changed.`);
  assert.deepEqual(localized.lifecycle, source.lifecycle, `${source.seed}: downstream lifecycle changed.`);
  assert.equal(localized.localization.sourceEnglishContentFingerprint, source.contentFingerprint, `${source.seed}: English content trace missing.`);
  assert.equal(localized.localization.sourceEnglishGeometryFingerprint, source.geometryFingerprint, `${source.seed}: English geometry trace missing.`);
  assert.equal(localized.localization.reviewOnly, true, `${source.seed}: localization escaped review-only state.`);
  assert.equal(localized.localization.frozen, false, `${source.seed}: localization froze itself.`);
  assert.equal(localized.localization.activationBlockedUntilEnglishFreezeCiGreen, true, `${source.seed}: activation prerequisite missing.`);
}

assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen, true);
assert.equal(EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.englishFreezeAuthorityId, EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.authorityId);
assert.equal(EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.status, "DRAFT_REVIEW_ONLY_PENDING_ENGLISH_FREEZE_CI_INFRASTRUCTURE");
assert.equal(EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.questionStudioRegistered, false);
assert.equal(EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.questionBankWritable, false);
assert.equal(EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.testEligible, false);
assert.equal(EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.automaticPublication, false);

const scaleSeeds = Array.from({ length: 240 }, (_, index) => `EMB-LOC-SCALE-${index}`);
const hiStems = new Set<string>();
const paStems = new Set<string>();
const geometryFingerprints = new Set<string>();
const contentFingerprints = new Set<string>();
const motifFamilies = new Set<string>();
const difficulties = new Set<string>();
const answerPositions = new Set<number>();
let parityChecks = 0;
let devanagariChecks = 0;
let gurmukhiChecks = 0;
let explanationChecks = 0;

for (const seed of scaleSeeds) {
  const { en, hi, pa } = generateEmbeddedFigureLocalizedPairV1(seed);
  assertInvariantParity(en, hi);
  assertInvariantParity(en, pa);
  parityChecks += 2;

  assert.equal(hi.language, "hi");
  assert.equal(hi.locale, "hi-IN");
  assert.equal(pa.language, "pa");
  assert.equal(pa.locale, "pa-IN");
  assert.match(hi.permanentQlTitle, /[\u0900-\u097F]/, `${seed}: Hindi title is not Devanagari.`);
  assert.match(pa.permanentQlTitle, /[\u0A00-\u0A7F]/, `${seed}: Punjabi title is not Gurmukhi.`);
  assert.match(hi.stem, /[\u0900-\u097F]/, `${seed}: Hindi stem is not Devanagari.`);
  assert.match(pa.stem, /[\u0A00-\u0A7F]/, `${seed}: Punjabi stem is not Gurmukhi.`);
  devanagariChecks += 2;
  gurmukhiChecks += 2;

  const hiExplanation = explanationText(hi);
  const paExplanation = explanationText(pa);
  assert.match(hiExplanation, /[\u0900-\u097F]/, `${seed}: Hindi explanation is not Devanagari.`);
  assert.match(paExplanation, /[\u0A00-\u0A7F]/, `${seed}: Punjabi explanation is not Gurmukhi.`);
  assert.equal(hi.explanation.application.includes(`विकल्प ${en.answer}`), true, `${seed}: Hindi application does not name the answer.`);
  assert.equal(hi.explanation.check.includes(`विकल्प ${en.answer}`), true, `${seed}: Hindi check does not name the answer.`);
  assert.equal(pa.explanation.application.includes(`ਵਿਕਲਪ ${en.answer}`), true, `${seed}: Punjabi application does not name the answer.`);
  assert.equal(pa.explanation.check.includes(`ਵਿਕਲਪ ${en.answer}`), true, `${seed}: Punjabi check does not name the answer.`);
  assert.equal(hi.stem.includes("Rotation is not allowed"), false, `${seed}: English leakage in Hindi stem.`);
  assert.equal(pa.stem.includes("Rotation is not allowed"), false, `${seed}: English leakage in Punjabi stem.`);
  explanationChecks += 8;

  hiStems.add(hi.stem);
  paStems.add(pa.stem);
  geometryFingerprints.add(en.geometryFingerprint);
  contentFingerprints.add(en.contentFingerprint);
  motifFamilies.add(en.motifFamily);
  difficulties.add(en.difficulty);
  answerPositions.add(en.correctIndex);
}

assert.equal(parityChecks, 480);
assert.equal(geometryFingerprints.size, 240);
assert.equal(contentFingerprints.size, 240);
assert.equal(hiStems.size, 8, `Hindi stem variety is ${hiStems.size}/8.`);
assert.equal(paStems.size, 8, `Punjabi stem variety is ${paStems.size}/8.`);
assert.equal(motifFamilies.size, 8);
assert.equal(difficulties.size, 3);
assert.equal(answerPositions.size, 4);

const reviewPool = Object.freeze(Array.from({ length: 720 }, (_, index) => generateEmbeddedFigurePermanentEnglishQuestionV1(`EMB-WOC-REVIEW-${index}`)));
const reviewSelected: EmbeddedFigurePermanentEnglishQuestionV1[] = [];
const reviewSeeds = new Set<string>();
const add = (question: EmbeddedFigurePermanentEnglishQuestionV1 | undefined) => {
  assert.ok(question, "Unable to satisfy EMB localization human-review coverage.");
  if (reviewSeeds.has(question.seed)) return;
  reviewSeeds.add(question.seed);
  reviewSelected.push(question);
};

const families = [...new Set(reviewPool.map((question) => question.motifFamily))].sort();
for (const family of families) {
  for (const difficulty of ["L1", "L2", "L3"] as const) add(reviewPool.find((question) => question.motifFamily === family && question.difficulty === difficulty));
}
for (let stemVariant = 0; stemVariant < 8; stemVariant += 1) add(reviewPool.find((question) => question.stemVariant === stemVariant));
for (let correctIndex = 0; correctIndex < 4; correctIndex += 1) add(reviewPool.find((question) => question.correctIndex === correctIndex));
for (const trap of ["ROTATION_TRAP", "REFLECTION_TRAP", "MISSING_EDGE", "WRONG_INCIDENCE", "NON_UNIFORM_SCALE"] as const) add(reviewPool.find((question) => question.distractorKindsByIndex.includes(trap)));
add(reviewPool.find((question) => question.connectivityValidation.sourceComponentCounts.some((count) => count > 1)));

const reviewQuestions = Object.freeze(reviewSelected);
assert.equal(reviewQuestions.length, 25, `Expected the same 25-item review surface, got ${reviewQuestions.length}.`);
assert.equal(new Set(reviewQuestions.map((question) => question.motifFamily)).size, 8);
assert.equal(new Set(reviewQuestions.map((question) => question.difficulty)).size, 3);
assert.equal(new Set(reviewQuestions.map((question) => question.stemVariant)).size, 8);
assert.equal(new Set(reviewQuestions.map((question) => question.correctIndex)).size, 4);
assert.equal(new Set(reviewQuestions.flatMap((question) => question.distractorKindsByIndex.filter((kind) => kind !== "CORRECT"))).size, 5);

const cards = reviewQuestions.map((en, index) => {
  const hi = localizeEmbeddedFigureQuestionV1(en, "hi");
  const pa = localizeEmbeddedFigureQuestionV1(en, "pa");
  assertInvariantParity(en, hi);
  assertInvariantParity(en, pa);
  const options = en.optionSvgs.map((svg, optionIndex) => `<div class="option"><b>${["A", "B", "C", "D"][optionIndex]}</b>${svg}</div>`).join("");
  const languageBlock = (label: string, question: EmbeddedFigurePermanentEnglishQuestionV1 | EmbeddedFigureLocalizedQuestionV1) => `<section class="lang"><h3>${label}</h3><p class="stem">${escapeHtml(question.stem)}</p><p><b>Observe:</b> ${escapeHtml(question.explanation.observation)}</p><p><b>Rule:</b> ${escapeHtml(question.explanation.rule)}</p><p><b>Apply:</b> ${escapeHtml(question.explanation.application)}</p><p><b>Check:</b> ${escapeHtml(question.explanation.check)}</p></section>`;
  return `<article class="card"><div class="meta">#${index + 1} · ${escapeHtml(en.motifFamily)} · ${en.difficulty} · Stem ${en.stemVariant + 1} · Answer ${en.answer}</div><div class="target"><div><b>Question figure</b>${en.targetSvg}</div><div class="options">${options}</div></div><div class="langs">${languageBlock("English", en)}${languageBlock("Hindi", hi)}${languageBlock("Punjabi", pa)}</div></article>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>EMB-001 EN/HI/PA Localization Review V1</title><style>:root{font-family:Inter,system-ui,sans-serif;color:#0f172a;background:#f8fafc}*{box-sizing:border-box}body{margin:0}main{max-width:1180px;margin:auto;padding:18px}.intro,.card{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:16px}.meta{font-size:11px;color:#64748b}.target{display:grid;grid-template-columns:170px 1fr;gap:14px;margin:12px 0}.target svg,.option svg{width:100%;height:auto;display:block}.options{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.option{border:1px solid #cbd5e1;border-radius:8px;padding:5px}.langs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.lang{border-top:1px solid #e2e8f0;padding-top:9px}.lang h3{margin:0 0 6px;font-size:13px}.lang p{font-size:12px;line-height:1.55;margin:5px 0}.stem{font-weight:650}@media(max-width:800px){.target,.langs{grid-template-columns:1fr}.options{grid-template-columns:repeat(2,1fr)}}</style></head><body><main><section class="intro"><h1>EMB-001 · English / Hindi / Punjabi Review V1</h1><p>Review-only localization candidate. Geometry, option order, answer, IDs and fingerprints are invariant. Activation remains blocked until the English Freeze V1 CI gate can execute successfully.</p></section>${cards}</main></body></html>`;

const evidence = {
  status: "PASS_EMB_001_HI_PA_LOCALIZATION_V1_REVIEW_CANDIDATE",
  authorityId: EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.authorityId,
  englishFreezeAuthorityId: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  activationPrerequisite: EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.activationPrerequisite,
  scaleEnglishQuestionCount: scaleSeeds.length,
  localizedScaleQuestionCount: scaleSeeds.length * 2,
  parityChecks,
  devanagariChecks,
  gurmukhiChecks,
  explanationChecks,
  uniqueGeometryFingerprints: geometryFingerprints.size,
  uniqueCanonicalContentFingerprints: contentFingerprints.size,
  hindiStemVariantCount: hiStems.size,
  punjabiStemVariantCount: paStems.size,
  reviewQuestionCount: reviewQuestions.length,
  localizedReviewQuestionCount: reviewQuestions.length * 2,
  reviewCoverage: {
    motifFamilyCount: new Set(reviewQuestions.map((question) => question.motifFamily)).size,
    difficultyBandCount: new Set(reviewQuestions.map((question) => question.difficulty)).size,
    stemVariantCount: new Set(reviewQuestions.map((question) => question.stemVariant)).size,
    answerPositionCount: new Set(reviewQuestions.map((question) => question.correctIndex)).size,
    distractorFamilyCount: new Set(reviewQuestions.flatMap((question) => question.distractorKindsByIndex.filter((kind) => kind !== "CORRECT"))).size,
    connectivityRemediationQuestionCount: reviewQuestions.filter((question) => question.connectivityValidation.sourceComponentCounts.some((count) => count > 1)).length,
  },
  invariants: {
    diagramsInvariant: true,
    optionOrderInvariant: true,
    answerInvariant: true,
    permanentQlIdInvariant: true,
    equivalencePolicyInvariant: true,
    geometryFingerprintInvariant: true,
    canonicalContentFingerprintInvariant: true,
    downstreamLifecycleStillLocked: true,
  },
  governance: {
    reviewOnly: true,
    localizationFrozen: false,
    activationBlockedUntilEnglishFreezeCiGreen: true,
    questionStudioRegistered: false,
    questionBankWritable: false,
    testEligible: false,
    automaticPublication: false,
  },
  nextGate: "ENGLISH_FREEZE_V1_CI_GREEN_THEN_DIRECT_HI_PA_HUMAN_REVIEW",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-localization-v1-review.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-localization-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));

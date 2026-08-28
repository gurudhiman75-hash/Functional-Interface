import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { matchEmbeddedGraphV1 } from "../foundation/spatial/embedded-figure-graph-v1";
import { EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/embedded-figure-localization-freeze-v1";
import { generateEmbeddedFigurePermanentEnglishQuestionV1 } from "../foundation/spatial/embedded-figure-permanent-english-runtime-v1";
import {
  EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  generateEmbeddedFigureQuestionStudioBatchV1,
  generateEmbeddedFigureQuestionStudioSeededV1,
} from "../foundation/spatial/embedded-figure-question-studio-seeded-runtime-v1";

assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.localizationFrozen, true);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.seededQuestionStudioIntegrationAuthorized, true);
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.questionStudioDiscoverable, false);
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.persistenceAllowed, false);
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.questionBankWritable, false);
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.testEligible, false);
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.publiclyPublishable, false);
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.automaticPublication, false);

const seeds = Array.from({ length: 240 }, (_, index) => `EMB-QS-SCALE-${index}`);
const canonicalIds = new Set<string>();
const languageIds = new Set<string>();
const geometries = new Set<string>();
const contentFingerprints = new Set<string>();
const motifFamilies = new Set<string>();
const hiStems = new Set<string>();
const paStems = new Set<string>();
const answerCounts = [0, 0, 0, 0];
const difficultyCounts: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
let studioQuestionCount = 0;
let crossLanguageParityChecks = 0;
let solverChecks = 0;
let lifecycleChecks = 0;

for (const seed of seeds) {
  const source = generateEmbeddedFigurePermanentEnglishQuestionV1(seed);
  const en = generateEmbeddedFigureQuestionStudioSeededV1({ seed, language: "en" });
  const hi = generateEmbeddedFigureQuestionStudioSeededV1({ seed, language: "hi" });
  const pa = generateEmbeddedFigureQuestionStudioSeededV1({ seed, language: "pa" });
  const localized = [en, hi, pa] as const;

  assert.equal(en.stem, source.stem, `${seed}: English stem drifted.`);
  assert.deepEqual(en.explanation, source.explanation, `${seed}: English explanation drifted.`);
  assert.equal(en.stimulusSvgs[0], source.targetSvg, `${seed}: target SVG drifted.`);
  assert.deepEqual(en.optionSvgs, source.optionSvgs, `${seed}: option SVGs drifted.`);
  assert.equal(en.correctIndex, source.correctIndex, `${seed}: answer index drifted.`);
  assert.equal(en.answer, source.answer, `${seed}: answer drifted.`);

  for (const question of localized) {
    assert.equal(question.version, "EMB-001-QUESTION-STUDIO-QUESTION-V1");
    assert.equal(question.packageId, "SPA-001");
    assert.equal(question.qlId, "SPA-QL-041");
    assert.equal(question.proposalId, "EMB-PROP-01");
    assert.equal(question.chapterCode, "EMB-001");
    assert.equal(question.equivalencePolicy, "FIXED_ORIENTATION");
    assert.equal(question.optionSvgs.length, 4);
    assert.deepEqual(question.optionLabels, ["A", "B", "C", "D"]);
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.exactSolverBacked, true);
    assert.equal(question.validation.uniqueAnswer, true);
    assert.equal(question.validation.everyOptionConnected, true);
    assert.equal(question.validation.fixedOrientation, true);
    assert.equal(question.lifecycle.reviewOnly, true);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.persistenceAllowed, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    assert.equal(question.localization.authority, EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId);
    lifecycleChecks += 6;
    languageIds.add(question.questionLanguageId);
    studioQuestionCount += 1;
  }

  assert.equal(en.canonicalItemId, hi.canonicalItemId);
  assert.equal(en.canonicalItemId, pa.canonicalItemId);
  assert.equal(en.geometryFingerprint, hi.geometryFingerprint);
  assert.equal(en.geometryFingerprint, pa.geometryFingerprint);
  assert.equal(en.contentFingerprint, hi.contentFingerprint);
  assert.equal(en.contentFingerprint, pa.contentFingerprint);
  assert.equal(en.correctIndex, hi.correctIndex);
  assert.equal(en.correctIndex, pa.correctIndex);
  assert.equal(en.answer, hi.answer);
  assert.equal(en.answer, pa.answer);
  assert.deepEqual(en.stimulusSvgs, hi.stimulusSvgs);
  assert.deepEqual(en.stimulusSvgs, pa.stimulusSvgs);
  assert.deepEqual(en.optionSvgs, hi.optionSvgs);
  assert.deepEqual(en.optionSvgs, pa.optionSvgs);
  crossLanguageParityChecks += 14;

  assert.equal(hi.locale, "hi-IN");
  assert.equal(pa.locale, "pa-IN");
  assert.match(hi.stem, /[\u0900-\u097F]/, `${seed}: Hindi stem lacks Devanagari.`);
  assert.match(pa.stem, /[\u0A00-\u0A7F]/, `${seed}: Punjabi stem lacks Gurmukhi.`);
  assert.match(Object.values(hi.explanation).join(" "), /[\u0900-\u097F]/, `${seed}: Hindi explanation lacks Devanagari.`);
  assert.match(Object.values(pa.explanation).join(" "), /[\u0A00-\u0A7F]/, `${seed}: Punjabi explanation lacks Gurmukhi.`);
  hiStems.add(hi.stem);
  paStems.add(pa.stem);

  const solved = source.optionGraphs.map((option) => matchEmbeddedGraphV1(source.targetGraph, option, "FIXED_ORIENTATION"));
  const solvedIndices = solved.map((result, index) => result.matched ? index : -1).filter((index) => index >= 0);
  assert.deepEqual(solvedIndices, [source.correctIndex], `${seed}: exact solver disagrees with Question Studio answer.`);
  solverChecks += 4;

  canonicalIds.add(en.canonicalItemId);
  geometries.add(en.geometryFingerprint);
  contentFingerprints.add(en.contentFingerprint);
  motifFamilies.add(en.motifFamily);
  answerCounts[en.correctIndex] += 1;
  difficultyCounts[en.difficultyBand] += 1;

  const replay = generateEmbeddedFigureQuestionStudioSeededV1({ seed, language: "pa" });
  assert.deepEqual(replay, pa, `${seed}: seeded runtime replay failed.`);
}

assert.equal(studioQuestionCount, 720);
assert.equal(canonicalIds.size, 240);
assert.equal(languageIds.size, 720);
assert.equal(geometries.size, 240);
assert.equal(contentFingerprints.size, 240);
assert.equal(motifFamilies.size, 8);
assert.equal(hiStems.size, 8);
assert.equal(paStems.size, 8);
assert.deepEqual(answerCounts, [60, 60, 60, 60]);
assert.deepEqual(difficultyCounts, { Easy: 80, Medium: 80, Hard: 80 });

const batches = (["en", "hi", "pa"] as const).map((language) => generateEmbeddedFigureQuestionStudioBatchV1({ seed: `EMB-QS-BATCH-${language}`, language, count: 50 }));
for (const batch of batches) {
  assert.equal(batch.length, 50);
  assert.equal(new Set(batch.map((question) => question.geometryFingerprint)).size, 50);
}
assert.deepEqual(batches[2], generateEmbeddedFigureQuestionStudioBatchV1({ seed: "EMB-QS-BATCH-pa", language: "pa", count: 50 }));

const evidence = {
  status: "PASS_EMB_001_QUESTION_STUDIO_SEEDED_RUNTIME_V1",
  authorityId: EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.authorityId,
  localizationFreezeAuthorityId: EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  canonicalSeedCount: seeds.length,
  studioQuestionCount,
  canonicalItemCount: canonicalIds.size,
  questionLanguageIdCount: languageIds.size,
  uniqueGeometryFingerprints: geometries.size,
  uniqueContentFingerprints: contentFingerprints.size,
  motifFamilyCount: motifFamilies.size,
  hindiStemVariantCount: hiStems.size,
  punjabiStemVariantCount: paStems.size,
  answerCounts,
  difficultyCounts,
  crossLanguageParityChecks,
  solverChecks,
  lifecycleChecks,
  batchProofCountPerLanguage: 50,
  governance: {
    reviewOnly: true,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticPublication: false,
  },
  nextGate: "EMB_001_QUESTION_STUDIO_OPERATOR_REVIEW_V1",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-question-studio-seeded-runtime-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));

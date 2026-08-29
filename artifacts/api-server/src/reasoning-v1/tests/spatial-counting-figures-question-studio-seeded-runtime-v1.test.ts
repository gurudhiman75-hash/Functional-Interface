import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  enumerateRectanglesV1,
  enumerateSquaresV1,
  enumerateTrianglesV1,
} from "../foundation/spatial/counting-figures-graph-v1";
import { enumerateSimpleQuadrilateralsV2 } from "../foundation/spatial/counting-figures-graph-v2";
import { FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/counting-figures-localization-freeze-v1";
import { generateCountingFiguresPermanentEnglishQuestionV1 } from "../foundation/spatial/counting-figures-permanent-english-runtime-v1";
import {
  FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  generateCountingFiguresQuestionStudioBatchV1,
  generateCountingFiguresQuestionStudioSeededV1,
} from "../foundation/spatial/counting-figures-question-studio-seeded-runtime-v1";
import type { CountingFigureTargetShapeV1 } from "../foundation/spatial/counting-figures-production-generator-v1";

const TARGETS = ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const satisfies readonly CountingFigureTargetShapeV1[];
const LANGUAGES = ["en", "hi", "pa"] as const;
const ANSWERS = ["A", "B", "C", "D"] as const;

function independentCount(source: ReturnType<typeof generateCountingFiguresPermanentEnglishQuestionV1>): number {
  switch (source.targetShape) {
    case "TRIANGLE": return enumerateTrianglesV1(source.graph).length;
    case "SQUARE": return enumerateSquaresV1(source.graph).length;
    case "RECTANGLE": return enumerateRectanglesV1(source.graph, "INCLUDE_SQUARES").length;
    case "QUADRILATERAL": return enumerateSimpleQuadrilateralsV2(source.graph).length;
  }
}

assert.equal(FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.status, "FCT_001_HINDI_PUNJABI_V1_FROZEN");
assert.equal(FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.seededQuestionStudioIntegrationAuthorized, true);
assert.equal(FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.permanentQlId, "SPA-QL-042");
assert.equal(FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.localizationFreezeAuthorityId, FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId);
assert.deepEqual(FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.questionStudioDiscoverable, false);
assert.equal(FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.persistenceAllowed, false);
assert.equal(FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.questionBankWritable, false);
assert.equal(FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.testEligible, false);
assert.equal(FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.publiclyPublishable, false);
assert.equal(FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.automaticPublication, false);

const surfaces = [];
let exactSolverChecks = 0;
let languageParityChecks = 0;
for (let index = 0; index < 240; index += 1) {
  const targetShape = TARGETS[index % TARGETS.length]!;
  const seed = `FCT-QS-SEEDED-${index}`;
  const source = generateCountingFiguresPermanentEnglishQuestionV1({ seed, targetShape });
  assert.equal(independentCount(source), source.correctCount);
  exactSolverChecks += 1;
  const localized = LANGUAGES.map((language) => generateCountingFiguresQuestionStudioSeededV1({ seed, targetShape, language }));
  const [en, hi, pa] = localized;
  for (const question of localized) {
    assert.equal(question.packageId, "SPA-001");
    assert.equal(question.qlId, "SPA-QL-042");
    assert.equal(question.proposalId, "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION");
    assert.equal(question.chapterCode, "FCT-001");
    assert.equal(question.targetShape, source.targetShape);
    assert.equal(question.motifFamily, source.motifFamily);
    assert.equal(question.structuralVariant, source.structuralVariant);
    assert.equal(question.stimulusSvgs[0], source.svg);
    assert.deepEqual(question.options, source.options);
    assert.equal(question.correctIndex, source.correctIndex);
    assert.equal(question.answer, ANSWERS[source.correctIndex]);
    assert.equal(question.contentFingerprint, source.contentFingerprint);
    assert.equal(question.geometryFingerprint, source.geometryFingerprint);
    assert.equal(question.structuralFingerprint, source.structuralFingerprint);
    assert.equal(question.validation.exactGraphSolverBacked, true);
    assert.equal(question.validation.constructionCountMatched, true);
    assert.equal(question.validation.uniqueNumericOptions, true);
    assert.equal(question.validation.uniqueAnswer, true);
    assert.equal(question.lifecycle.reviewOnly, true);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.persistenceAllowed, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    assert.deepEqual(generateCountingFiguresQuestionStudioSeededV1({ seed, targetShape, language: question.language }), question);
    surfaces.push(question);
  }
  assert.equal(en!.canonicalItemId, hi!.canonicalItemId);
  assert.equal(en!.canonicalItemId, pa!.canonicalItemId);
  assert.equal(en!.answer, hi!.answer);
  assert.equal(en!.answer, pa!.answer);
  assert.equal(en!.correctIndex, hi!.correctIndex);
  assert.equal(en!.correctIndex, pa!.correctIndex);
  assert.deepEqual(en!.options, hi!.options);
  assert.deepEqual(en!.options, pa!.options);
  assert.deepEqual(en!.stimulusSvgs, hi!.stimulusSvgs);
  assert.deepEqual(en!.stimulusSvgs, pa!.stimulusSvgs);
  assert.equal(en!.geometryFingerprint, hi!.geometryFingerprint);
  assert.equal(en!.geometryFingerprint, pa!.geometryFingerprint);
  assert.equal(en!.contentFingerprint, hi!.contentFingerprint);
  assert.equal(en!.contentFingerprint, pa!.contentFingerprint);
  languageParityChecks += 12;
}
assert.equal(surfaces.length, 720);
assert.equal(new Set(surfaces.map((q) => q.canonicalItemId)).size, 240);
assert.equal(new Set(surfaces.map((q) => q.questionLanguageId)).size, 720);
assert.equal(new Set(surfaces.map((q) => q.motifFamily)).size, 11);
assert.equal(new Set(surfaces.map((q) => q.targetShape)).size, 4);
assert.equal(new Set(surfaces.map((q) => q.difficultyBand)).size, 3);
assert.equal(new Set(surfaces.map((q) => q.correctIndex)).size, 4);
assert.equal(new Set(surfaces.map((q) => q.language)).size, 3);

const batchCounts: Record<string, number> = {};
for (const language of LANGUAGES) {
  const batch = generateCountingFiguresQuestionStudioBatchV1({ seed: `FCT-QS-BATCH-${language}`, language, count: 50 });
  assert.equal(batch.length, 50);
  assert.equal(new Set(batch.map((q) => q.geometryFingerprint)).size, 50);
  assert.equal(new Set(batch.map((q) => q.questionLanguageId)).size, 50);
  batchCounts[language] = batch.length;
}
for (const targetShape of TARGETS) {
  const batch = generateCountingFiguresQuestionStudioBatchV1({ seed: `FCT-QS-${targetShape}-25`, language: "en", count: 25, targetShape });
  assert.equal(batch.length, 25);
  assert.ok(batch.every((q) => q.targetShape === targetShape));
  assert.equal(new Set(batch.map((q) => q.geometryFingerprint)).size, 25);
}

const evidence = {
  status: "PASS_FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_V1",
  runtimeAuthority: FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.authorityId,
  localizationFreezeAuthority: FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  canonicalSeedCount: 240,
  languageSurfaceCount: surfaces.length,
  exactSolverChecks,
  languageParityChecks,
  canonicalItemUniqueCount: new Set(surfaces.map((q) => q.canonicalItemId)).size,
  questionLanguageIdUniqueCount: new Set(surfaces.map((q) => q.questionLanguageId)).size,
  motifFamilyCount: new Set(surfaces.map((q) => q.motifFamily)).size,
  targetShapeCount: new Set(surfaces.map((q) => q.targetShape)).size,
  difficultyBandCount: new Set(surfaces.map((q) => q.difficultyBand)).size,
  answerPositionCount: new Set(surfaces.map((q) => q.correctIndex)).size,
  languageCount: new Set(surfaces.map((q) => q.language)).size,
  mixedBatchCounts: batchCounts,
  perTargetBatchCount: 25,
  lifecycle: {
    reviewOnly: true,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  nextGate: "FCT_001_QUESTION_STUDIO_OPERATOR_REVIEW_V1",
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-question-studio-seeded-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));

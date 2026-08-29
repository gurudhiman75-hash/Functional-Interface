import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  enumerateRectanglesV1,
  enumerateSquaresV1,
  enumerateTrianglesV1,
} from "../foundation/spatial/counting-figures-graph-v1";
import { enumerateSimpleQuadrilateralsV2 } from "../foundation/spatial/counting-figures-graph-v2";
import {
  FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1,
  generateCountingFigureCandidateBatchV1,
  generateCountingFigureCandidateV1,
  type CountingFigureCandidateQuestionV1,
  type CountingFigureTargetShapeV1,
} from "../foundation/spatial/counting-figures-production-generator-v1";

assert.equal(FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.permanentQlAllocated, false);
assert.equal(FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.questionStudioDiscoverable, false);
assert.equal(FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.automaticStudentPublication, false);
assert.equal(FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.motifFamilies.length, 7);
assert.equal(FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.stemVariantCount, 8);

const TARGETS = ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const;

function independentCount(question: CountingFigureCandidateQuestionV1): number {
  switch (question.targetShape) {
    case "TRIANGLE": return enumerateTrianglesV1(question.graph).length;
    case "SQUARE": return enumerateSquaresV1(question.graph).length;
    case "RECTANGLE": return enumerateRectanglesV1(question.graph, "INCLUDE_SQUARES").length;
    case "QUADRILATERAL": return enumerateSimpleQuadrilateralsV2(question.graph).length;
  }
}

function svgCoordinates(svg: string): readonly number[] {
  return [...svg.matchAll(/(?:x1|x2|y1|y2)="([0-9.]+)"/g)].map((match) => Number(match[1]));
}

const questions: CountingFigureCandidateQuestionV1[] = [];
for (let index = 0; index < 240; index += 1) {
  const targetShape: CountingFigureTargetShapeV1 = TARGETS[index % TARGETS.length]!;
  const question = generateCountingFigureCandidateV1({ seed: `FCT-CP003-SCALE-${index}`, targetShape });
  questions.push(question);
  assert.equal(question.chapterCode, "FCT-001");
  assert.equal(question.candidateId, "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION");
  assert.equal(question.targetShape, targetShape);
  assert.equal(question.correctCount, question.constructionExpectedCount);
  assert.equal(independentCount(question), question.correctCount);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.correctCount);
  assert.equal(question.optionEvidence.length, 4);
  assert.equal(question.optionEvidence.filter((entry) => entry.kind === "CORRECT").length, 1);
  assert.ok(question.optionEvidence.filter((entry) => entry.kind !== "CORRECT").every((entry) => entry.kind !== "CORRECT"));
  assert.ok(question.svg.startsWith("<svg"));
  assert.ok(question.svg.includes('viewBox="0 0 120 120"'));
  assert.ok(question.svg.includes('fill="white"'));
  assert.ok(!question.svg.includes("NaN"));
  const coordinates = svgCoordinates(question.svg);
  assert.ok(coordinates.length >= 8);
  assert.ok(coordinates.every((coordinate) => coordinate >= 11.999 && coordinate <= 108.001));
  assert.ok(question.explanation.observation.length > 20);
  assert.ok(question.explanation.rule.includes("Count each distinct closed"));
  assert.ok(question.explanation.application.includes(String(question.correctCount)));
  assert.ok(question.explanation.check.includes(String(question.correctCount)));
  assert.deepEqual(
    generateCountingFigureCandidateV1({ seed: `FCT-CP003-SCALE-${index}`, targetShape }),
    question,
    `Deterministic replay failed at ${index}.`,
  );
}

const targetCounts = Object.fromEntries(TARGETS.map((target) => [target, questions.filter((question) => question.targetShape === target).length]));
assert.deepEqual(targetCounts, { TRIANGLE: 60, SQUARE: 60, RECTANGLE: 60, QUADRILATERAL: 60 });

const motifFamilies = new Set(questions.map((question) => question.motifFamily));
assert.equal(motifFamilies.size, FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.motifFamilies.length);
for (const motif of FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.motifFamilies) assert.ok(motifFamilies.has(motif));

const structuralFingerprints = new Set(questions.map((question) => question.structuralFingerprint));
assert.ok(structuralFingerprints.size >= 18, `Only ${structuralFingerprints.size} structural variants were exercised.`);
assert.equal(new Set(questions.map((question) => question.geometryFingerprint)).size, 240);
assert.equal(new Set(questions.map((question) => question.contentFingerprint)).size, 240);

const stemVariants = new Set(questions.map((question) => question.stemVariant));
assert.equal(stemVariants.size, 8);

const difficultyCounts = {
  EASY: questions.filter((question) => question.difficulty === "EASY").length,
  MEDIUM: questions.filter((question) => question.difficulty === "MEDIUM").length,
  HARD: questions.filter((question) => question.difficulty === "HARD").length,
};
assert.ok(difficultyCounts.EASY >= 30, JSON.stringify(difficultyCounts));
assert.ok(difficultyCounts.MEDIUM >= 30, JSON.stringify(difficultyCounts));
assert.ok(difficultyCounts.HARD >= 30, JSON.stringify(difficultyCounts));

const answerPositionCounts = [0, 1, 2, 3].map((position) => questions.filter((question) => question.correctIndex === position).length);
assert.ok(answerPositionCounts.every((count) => count >= 35), JSON.stringify(answerPositionCounts));

const distractorKinds = new Set(
  questions.flatMap((question) => question.optionEvidence.filter((entry) => entry.kind !== "CORRECT").map((entry) => entry.kind)),
);
assert.ok(distractorKinds.has("SMALLEST_ONLY"));
assert.ok(distractorKinds.has("OMIT_LARGEST"));
assert.ok(distractorKinds.has("MISS_COMPOSITE_CLASS"));
assert.ok(distractorKinds.has("DOUBLE_COUNT_LARGEST"));
assert.ok(distractorKinds.has("NEAR_MISS"));

const batch = generateCountingFigureCandidateBatchV1({ seed: "FCT-CP003-BATCH-50", count: 50 });
assert.equal(batch.length, 50);
assert.equal(new Set(batch.map((question) => question.contentFingerprint)).size, 50);

for (const targetShape of TARGETS) {
  const targetBatch = generateCountingFigureCandidateBatchV1({
    seed: `FCT-CP003-${targetShape}-BATCH`,
    count: 25,
    targetShape,
  });
  assert.equal(targetBatch.length, 25);
  assert.ok(targetBatch.every((question) => question.targetShape === targetShape));
  assert.equal(new Set(targetBatch.map((question) => question.contentFingerprint)).size, 25);
}

const answerRange = {
  min: Math.min(...questions.map((question) => question.correctCount)),
  max: Math.max(...questions.map((question) => question.correctCount)),
};

const evidence = {
  status: "PASS_FCT_001_CP003_DETERMINISTIC_PRODUCTION_GENERATOR_V1",
  generatorAuthority: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.authorityId,
  scaleQuestionCount: questions.length,
  targetCounts,
  motifFamilies: [...motifFamilies].sort(),
  motifFamilyCount: motifFamilies.size,
  structuralVariantCount: structuralFingerprints.size,
  geometryUniqueCount: new Set(questions.map((question) => question.geometryFingerprint)).size,
  contentUniqueCount: new Set(questions.map((question) => question.contentFingerprint)).size,
  stemVariantCount: stemVariants.size,
  difficultyCounts,
  answerPositionCounts,
  distractorKinds: [...distractorKinds].sort(),
  exactSolverChecks: questions.length,
  constructionCountChecks: questions.length,
  svgBoundsChecks: questions.length,
  answerRange,
  mixedBatchCount: batch.length,
  perTargetBatchCount: 25,
  governance: {
    permanentQlAllocated: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    automaticStudentPublication: false,
    mergeAuthorized: false,
    deploymentPerformed: false,
  },
  nextGate: "FCT_001_CP004_LEARNER_VISUAL_REVIEW_AND_EXAM_REALNESS_AUDIT",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fct-001-cp003-production-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence, null, 2));

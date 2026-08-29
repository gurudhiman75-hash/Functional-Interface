import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  enumerateRectanglesV1,
  enumerateSquaresV1,
  enumerateTrianglesV1,
} from "../foundation/spatial/counting-figures-graph-v1";
import { enumerateSimpleQuadrilateralsV2 } from "../foundation/spatial/counting-figures-graph-v2";
import {
  FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  generateCountingFiguresPermanentEnglishBatchV1,
  generateCountingFiguresPermanentEnglishQuestionV1,
  type CountingFiguresPermanentEnglishQuestionV1,
} from "../foundation/spatial/counting-figures-permanent-english-runtime-v1";
import { FCT_001_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/counting-figures-product-owner-approval-v1";
import { FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2 } from "../foundation/spatial/counting-figures-production-generator-v2";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6,
  SPATIAL_COUNTING_FIGURES_PERMANENT_QL_ALLOCATIONS_V6,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v6";
import type { CountingFigureTargetShapeV1 } from "../foundation/spatial/counting-figures-production-generator-v1";

const TARGETS = ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const satisfies readonly CountingFigureTargetShapeV1[];

function independentCount(question: CountingFiguresPermanentEnglishQuestionV1): number {
  switch (question.targetShape) {
    case "TRIANGLE": return enumerateTrianglesV1(question.graph).length;
    case "SQUARE": return enumerateSquaresV1(question.graph).length;
    case "RECTANGLE": return enumerateRectanglesV1(question.graph, "INCLUDE_SQUARES").length;
    case "QUADRILATERAL": return enumerateSimpleQuadrilateralsV2(question.graph).length;
  }
}

assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorization.englishRuntimeImplementationAllowed, true);
assert.equal(SPATIAL_COUNTING_FIGURES_PERMANENT_QL_ALLOCATIONS_V6[0].permanentQlId, "SPA-QL-042");
assert.equal(FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.permanentQlId, "SPA-QL-042");
assert.equal(FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.allocationAuthorityId, SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.authorityId);
assert.equal(FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.sourceRuntimeAuthorityId, FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.authorityId);
assert.equal(FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance.questionStudioRegistrationAuthorized, false);
assert.equal(FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance.persistenceAllowed, false);
assert.equal(FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance.questionBankWritesAuthorized, false);
assert.equal(FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance.automaticPublicationAuthorized, false);

const questions = Array.from({ length: 240 }, (_, index) => {
  const targetShape = TARGETS[index % TARGETS.length]!;
  const seed = `FCT-PERM-EN-V1-${index}`;
  const question = generateCountingFiguresPermanentEnglishQuestionV1({ seed, targetShape });
  assert.equal(question.permanentQlId, "SPA-QL-042");
  assert.equal(question.permanentQlTitle, "Systematic counting of closed figures");
  assert.equal(question.language, "en");
  assert.equal(question.locale, "en-IN");
  assert.equal(question.qlStatus, "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME");
  assert.equal(question.runtimeAuthorityId, FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId);
  assert.equal(question.allocationAuthorityId, SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.authorityId);
  assert.equal(question.authority, FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.authorityId);
  assert.equal(question.options[question.correctIndex], question.correctCount);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(independentCount(question), question.correctCount);
  assert.equal(question.constructionExpectedCount, question.correctCount);
  assert.equal(question.lifecycle.permanentQlAllocated, true);
  assert.equal(question.lifecycle.englishRuntimeImplemented, true);
  assert.equal(question.lifecycle.englishImplementationFrozen, false);
  assert.equal(question.lifecycle.questionStudioRegistered, false);
  assert.equal(question.lifecycle.persistenceAllowed, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.automaticStudentPublication, false);
  assert.deepEqual(generateCountingFiguresPermanentEnglishQuestionV1({ seed, targetShape }), question);
  return question;
});

const targetCounts = Object.fromEntries(TARGETS.map((target) => [target, questions.filter((question) => question.targetShape === target).length]));
assert.deepEqual(targetCounts, { TRIANGLE: 60, SQUARE: 60, RECTANGLE: 60, QUADRILATERAL: 60 });
assert.equal(new Set(questions.map((question) => question.geometryFingerprint)).size, 240);
assert.equal(new Set(questions.map((question) => question.contentFingerprint)).size, 240);
assert.equal(new Set(questions.map((question) => question.motifFamily)).size, 11);
assert.equal(new Set(questions.map((question) => question.difficulty)).size, 3);
assert.equal(new Set(questions.map((question) => question.stemVariant)).size, 8);
assert.equal(new Set(questions.map((question) => question.correctIndex)).size, 4);
assert.equal(new Set(questions.flatMap((question) => question.optionEvidence.filter((entry) => entry.kind !== "CORRECT").map((entry) => entry.kind))).size, 5);

const batch = generateCountingFiguresPermanentEnglishBatchV1({ seed: "FCT-PERM-EN-BATCH-50", count: 50 });
assert.equal(batch.length, 50);
assert.equal(new Set(batch.map((question) => question.geometryFingerprint)).size, 50);
assert.equal(new Set(batch.map((question) => question.contentFingerprint)).size, 50);
assert.ok(batch.every((question) => question.permanentQlId === "SPA-QL-042"));

for (const targetShape of TARGETS) {
  const targetBatch = generateCountingFiguresPermanentEnglishBatchV1({
    seed: `FCT-PERM-EN-${targetShape}-25`,
    count: 25,
    targetShape,
  });
  assert.equal(targetBatch.length, 25);
  assert.ok(targetBatch.every((question) => question.targetShape === targetShape));
  assert.equal(new Set(targetBatch.map((question) => question.geometryFingerprint)).size, 25);
}

const evidence = {
  status: "PASS_FCT_001_PERMANENT_ENGLISH_RUNTIME_V1",
  runtimeAuthority: FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId,
  allocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.authorityId,
  sourceRuntimeAuthority: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.authorityId,
  permanentQlId: "SPA-QL-042",
  scaleQuestionCount: questions.length,
  targetCounts,
  motifFamilyCount: new Set(questions.map((question) => question.motifFamily)).size,
  difficultyCount: new Set(questions.map((question) => question.difficulty)).size,
  stemVariantCount: new Set(questions.map((question) => question.stemVariant)).size,
  answerPositionCount: new Set(questions.map((question) => question.correctIndex)).size,
  distractorFamilyCount: new Set(questions.flatMap((question) => question.optionEvidence.filter((entry) => entry.kind !== "CORRECT").map((entry) => entry.kind))).size,
  exactSolverChecks: questions.length,
  constructionChecks: questions.length,
  deterministicReplayChecks: questions.length,
  geometryUniqueCount: new Set(questions.map((question) => question.geometryFingerprint)).size,
  contentUniqueCount: new Set(questions.map((question) => question.contentFingerprint)).size,
  mixedBatchCount: batch.length,
  perTargetBatchCount: 25,
  lifecycle: FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance,
  nextGate: "FCT_001_ENGLISH_FREEZE_V1",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fct-001-permanent-english-runtime-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence, null, 2));

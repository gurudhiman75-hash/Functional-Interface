import assert from "node:assert/strict";
import { VEN_001_PERMANENT_QLS, ven001QlForOperation } from "./ql-registry.ts";
import { generateVen001QuestionStudioBatch } from "./question-studio-integration.ts";
import { generateVen001NextCheckpointBatch } from "./ven-001-next-checkpoints.ts";
import { generateVen001NumericalBatch, NUMERICAL_CP_IDS } from "./ven-001-numerical.ts";
import { generateVen001ShapeRegionBatch, VEN_001_SHAPE_REGION_CP_ID } from "./ven-001-shape-regions.ts";

assert.equal(VEN_001_PERMANENT_QLS.length, 10);
assert.equal(new Set(VEN_001_PERMANENT_QLS.map((entry) => entry.qlId)).size, 10);
assert.equal(ven001QlForOperation("RELATIONS_TO_DIAGRAM"), "VEN-QL-001");
assert.equal(ven001QlForOperation("CATEGORIES_TO_DIAGRAM"), "VEN-QL-002");
assert.equal(ven001QlForOperation("DIAGRAM_TO_CATEGORIES"), "VEN-QL-003");
assert.equal(ven001QlForOperation("REGION_IDENTIFICATION"), "VEN-QL-004");
assert.equal(ven001QlForOperation("SET_COUNT"), "VEN-QL-005");
assert.equal(ven001QlForOperation("PERCENTAGE_RATIO"), "VEN-QL-006");
assert.equal(ven001QlForOperation("SOLVE_UNKNOWN"), "VEN-QL-007");
assert.equal(ven001QlForOperation("CASELET_COUNT"), "VEN-QL-008");
assert.equal(ven001QlForOperation("OVERLAP_BOUNDS"), "VEN-QL-009");
assert.equal(ven001QlForOperation("GEOMETRIC_REGION_COUNT"), "VEN-QL-010");

function oneQuestion(result: { questions: readonly any[] }) {
  assert.equal(result.questions.length, 1);
  return result.questions[0]!;
}

for (const cp of ["VEN-CP001", "VEN-CP002"] as const) {
  const q = oneQuestion(generateVen001NextCheckpointBatch({ patternId: cp, language: "en", seed: `ql-audit:${cp}`, count: 1 }));
  assert.equal(q.questionOperation, "RELATIONS_TO_DIAGRAM");
  assert.equal(q.qlId, "VEN-QL-001");
  assert.equal(q.permanentQlId, "VEN-QL-001");
}

{
  const direct = oneQuestion(generateVen001QuestionStudioBatch({ canonicalProblemId: "VEN-CP003-DIRECT", language: "en", seed: "ql-audit:cp003-direct", count: 1 }));
  assert.equal(direct.questionOperation, "CATEGORIES_TO_DIAGRAM");
  assert.equal(direct.qlId, "VEN-QL-002");
  const reverse = oneQuestion(generateVen001QuestionStudioBatch({ canonicalProblemId: "VEN-CP003-REVERSE", language: "en", seed: "ql-audit:cp003-reverse", count: 1 }));
  assert.equal(reverse.questionOperation, "DIAGRAM_TO_CATEGORIES");
  assert.equal(reverse.qlId, "VEN-QL-003");
}

{
  const q = oneQuestion(generateVen001NextCheckpointBatch({ patternId: "VEN-CP004", language: "en", seed: "ql-audit:cp004", count: 1 }));
  assert.equal(q.questionOperation, "REGION_IDENTIFICATION");
  assert.equal(q.qlId, "VEN-QL-004");
}

const expectedNumerical = new Map([
  ["VEN-CP005", "VEN-QL-005"],
  ["VEN-CP006", "VEN-QL-005"],
  ["VEN-CP007", "VEN-QL-006"],
  ["VEN-CP008", "VEN-QL-007"],
  ["VEN-CP009", "VEN-QL-008"],
  ["VEN-CP010", "VEN-QL-009"],
] as const);

for (const cp of NUMERICAL_CP_IDS) {
  const q = oneQuestion(generateVen001NumericalBatch({ patternId: cp, language: "en", seed: `ql-audit:${cp}`, count: 1 }));
  assert.equal(q.qlId, expectedNumerical.get(cp));
  assert.equal(q.permanentQlId, expectedNumerical.get(cp));
}

{
  const q = oneQuestion(generateVen001ShapeRegionBatch({ patternId: VEN_001_SHAPE_REGION_CP_ID, language: "en", seed: "ql-audit:cp011", count: 1 }));
  assert.equal(q.questionOperation, "GEOMETRIC_REGION_COUNT");
  assert.equal(q.qlId, "VEN-QL-010");
}

console.log(JSON.stringify({
  status: "PASS_VEN_001_PERMANENT_QL_INTEGRATION_V1",
  permanentQlCount: 10,
  checkpointCoverage: "VEN-CP001..VEN-CP011",
  cp005Cp006CompressedIntoOneLearnerContract: true,
  nextPermanentQlId: "VEN-QL-011",
}, null, 2));

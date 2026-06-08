import { strict as assert } from "node:assert";
import {
  generateNsRem002FullAudit,
  NS_REM_002_CP_001,
  NS_REM_002_CP_002,
  NS_REM_002_CP_003,
  NS_REM_002_CP_004,
  NS_REM_002_CP_005,
  NS_REM_002_CP_006,
  NS_REM_002_CP_007,
  NS_REM_002_CP_008,
  NS_REM_002_CP_009,
  NS_REM_002_PIPELINES,
  runNsRem002Cp001Pipeline,
  runNsRem002Cp002Pipeline,
  runNsRem002Cp003Pipeline,
  runNsRem002Cp004Pipeline,
  runNsRem002Cp005Pipeline,
  runNsRem002Cp006Pipeline,
  runNsRem002Cp007Pipeline,
  runNsRem002Cp008Pipeline,
  runNsRem002Cp009Pipeline,
  validateNsRem002Libraries,
} from "../topics/NumberSystem/subtopics/Remainders/archetypes/NS-REM-002";

const libraryValidation = validateNsRem002Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

const cp001 = runNsRem002Cp001Pipeline({ divisor: 7, quotient: 14, remainder: 3, seed: "fixture-cp001" });
assert.equal(cp001.answer, 101);
assert.equal(cp001.validation.valid, true);

const cp002 = runNsRem002Cp002Pipeline({ divisor: 7, remainder: 3, lowerBound: 100, seed: "fixture-cp002" });
assert.equal(cp002.answer, 101);
assert.equal(cp002.answer % 7, 3);
assert.equal(cp002.answer > 100, true);

const cp003 = runNsRem002Cp003Pipeline({ divisor: 9, remainder: 4, upperBound: 1000, seed: "fixture-cp003" });
assert.equal(cp003.answer, 994);
assert.equal(cp003.answer % 9, 4);
assert.equal(cp003.answer < 1000, true);

const cp004 = runNsRem002Cp004Pipeline({ divisor: 7, remainder: 3, lowerBound: 100, upperBound: 500, seed: "fixture-cp004" });
assert.equal(cp004.answer, cp004.solver.validNumbers.length);
assert.equal(cp004.solver.validNumbers.every((value) => value >= 100 && value <= 500 && value % 7 === 3), true);

const cp005 = runNsRem002Cp005Pipeline({ divisor: 5, remainder: 2, lowerBound: 50, upperBound: 200, seed: "fixture-cp005" });
assert.equal(cp005.answer, 3735);

const cp006 = runNsRem002Cp006Pipeline({ dividend: 23, quotient: 4, remainder: 3, seed: "fixture-cp006" });
assert.equal(cp006.answer, 5);

const cp007 = runNsRem002Cp007Pipeline({ dividend: 23, divisor: 5, remainder: 3, seed: "fixture-cp007" });
assert.equal(cp007.answer, 4);

const cp008 = runNsRem002Cp008Pipeline({ dividend: 23, divisor: 5, quotient: 4, seed: "fixture-cp008" });
assert.equal(cp008.answer, 3);

const cp009 = runNsRem002Cp009Pipeline({ divisor: 7, quotient: 14, remainder: 3, seed: "fixture-cp009" });
assert.equal(cp009.answer, 101);

const pipelineCases = [
  { id: NS_REM_002_CP_001, run: runNsRem002Cp001Pipeline },
  { id: NS_REM_002_CP_002, run: runNsRem002Cp002Pipeline },
  { id: NS_REM_002_CP_003, run: runNsRem002Cp003Pipeline },
  { id: NS_REM_002_CP_004, run: runNsRem002Cp004Pipeline },
  { id: NS_REM_002_CP_005, run: runNsRem002Cp005Pipeline },
  { id: NS_REM_002_CP_006, run: runNsRem002Cp006Pipeline },
  { id: NS_REM_002_CP_007, run: runNsRem002Cp007Pipeline },
  { id: NS_REM_002_CP_008, run: runNsRem002Cp008Pipeline },
  { id: NS_REM_002_CP_009, run: runNsRem002Cp009Pipeline },
] as const;

for (const testCase of pipelineCases) {
  const output = testCase.run({ seed: `ns-rem-002-smoke:${testCase.id}` });
  assert.equal(output.canonicalProblemId, testCase.id);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.questionId, output.parameters.questionId);
  assert.ok(output.questionLanguageId.startsWith("QL-"));
  assert.ok(output.explanationStyleId.startsWith("ES-"));
  assert.equal(output.explanation.graphId, output.reasoningGraph.graphId);
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Answer Extraction"));
  assert.ok(output.explanation.lines.join("\n").includes(String(output.answer)));
  assert.equal(output.stem.includes("{"), false);
}

assert.deepEqual(Object.keys(NS_REM_002_PIPELINES), [
  "CP-001",
  "CP-002",
  "CP-003",
  "CP-004",
  "CP-005",
  "CP-006",
  "CP-007",
  "CP-008",
  "CP-009",
]);

const fullAudit = generateNsRem002FullAudit({ countPerCp: 1000, seed: "ns-rem-002-final-audit" });
for (const [canonicalProblemId, report] of Object.entries(fullAudit)) {
  assert.equal(report.questionCount, 1000, canonicalProblemId);
  assert.equal(report.generationFailures, 0, canonicalProblemId);
  assert.equal(report.validationFailures, 0, canonicalProblemId);
  assert.equal(report.traceabilityFailures, 0, canonicalProblemId);
  assert.ok(Object.keys(report.difficultyDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.divisorDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.questionLanguageDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.explanationDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.topologyDistribution).length > 0, canonicalProblemId);
}

console.log("NS-REM-002 CP-001 through CP-009 implementation passed.");

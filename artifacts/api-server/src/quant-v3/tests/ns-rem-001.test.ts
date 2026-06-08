import { strict as assert } from "node:assert";
import {
  generateNsRem001FullAudit,
  NS_REM_001_CP_001,
  NS_REM_001_CP_002,
  NS_REM_001_CP_003,
  NS_REM_001_CP_004,
  NS_REM_001_CP_005,
  NS_REM_001_CP_006,
  NS_REM_001_CP_007,
  NS_REM_001_PIPELINES,
  runNsRem001Cp001Pipeline,
  runNsRem001Cp002Pipeline,
  runNsRem001Cp003Pipeline,
  runNsRem001Cp004Pipeline,
  runNsRem001Cp005Pipeline,
  runNsRem001Cp006Pipeline,
  runNsRem001Cp007Pipeline,
  validateNsRem001Libraries,
} from "../topics/NumberSystem/subtopics/Remainders/archetypes/NS-REM-001";

const libraryValidation = validateNsRem001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

const fixtureInput = { numberExpression: "12x", divisor: 10, targetRemainder: 3 };
const cp001Fixture = runNsRem001Cp001Pipeline(fixtureInput);
assert.equal(cp001Fixture.answer, 3);
assert.ok(["QL-001", "QL-002", "QL-003", "QL-004", "QL-005"].includes(cp001Fixture.questionLanguageId));
assert.equal(cp001Fixture.stem.includes("12x"), true);
assert.equal(cp001Fixture.stem.includes("3"), true);
assert.equal(cp001Fixture.stem.includes("10"), true);
assert.deepEqual(cp001Fixture.solver.validValueSet, [3]);

const cp002Fixture = runNsRem001Cp002Pipeline({ numberExpression: "12x", divisor: 4, targetRemainder: 1 });
const cp003Fixture = runNsRem001Cp003Pipeline({ numberExpression: "12x", divisor: 4, targetRemainder: 1 });
const cp004Fixture = runNsRem001Cp004Pipeline({ numberExpression: "12x", divisor: 4, targetRemainder: 1 });
const cp005Fixture = runNsRem001Cp005Pipeline({ numberExpression: "12x", divisor: 4, targetRemainder: 1 });
const cp006Fixture = runNsRem001Cp006Pipeline({ numberExpression: "12x", divisor: 4, targetRemainder: 1 });
const cp007Fixture = runNsRem001Cp007Pipeline({ numberExpression: "12x", divisor: 4, targetRemainder: 1 });

assert.deepEqual(cp002Fixture.solver.validValueSet, [1, 5, 9]);
assert.equal(cp002Fixture.answer, 1);
assert.equal(cp003Fixture.answer, 9);
assert.equal(cp004Fixture.answer, 3);
assert.equal(cp005Fixture.answer, 15);
assert.equal(cp006Fixture.answer, 121);
assert.equal(cp007Fixture.answer, 129);

const pipelineCases = [
  { id: NS_REM_001_CP_001, run: runNsRem001Cp001Pipeline },
  { id: NS_REM_001_CP_002, run: runNsRem001Cp002Pipeline },
  { id: NS_REM_001_CP_003, run: runNsRem001Cp003Pipeline },
  { id: NS_REM_001_CP_004, run: runNsRem001Cp004Pipeline },
  { id: NS_REM_001_CP_005, run: runNsRem001Cp005Pipeline },
  { id: NS_REM_001_CP_006, run: runNsRem001Cp006Pipeline },
  { id: NS_REM_001_CP_007, run: runNsRem001Cp007Pipeline },
] as const;

for (const testCase of pipelineCases) {
  const output = testCase.run({ seed: `ns-rem-001-smoke:${testCase.id}` });
  assert.equal(output.canonicalProblemId, testCase.id);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.questionId, output.parameters.questionId);
  assert.equal(output.patternId, output.parameters.patternId);
  assert.equal(output.instanceId, output.parameters.instanceId);
  assert.ok(output.questionLanguageId.startsWith("QL-"));
  assert.ok(output.explanationStyleId.startsWith("ES-"));
  assert.equal(output.explanation.graphId, output.reasoningGraph.graphId);
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Valid Value Set"));
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "CP Specific Answer Extraction"));
  assert.ok(output.explanation.lines.join("\n").includes(output.solver.validValueSet.join(", ")));
  assert.ok(output.explanation.lines.join("\n").includes(String(output.answer)));
}

for (const canonicalProblemId of Object.keys(NS_REM_001_PIPELINES)) {
  assert.ok(NS_REM_001_PIPELINES[canonicalProblemId as keyof typeof NS_REM_001_PIPELINES]);
}

const fullAudit = generateNsRem001FullAudit({ countPerCp: 1000, seed: "ns-rem-001-final-audit" });
for (const [canonicalProblemId, report] of Object.entries(fullAudit)) {
  assert.equal(report.questionCount, 1000, canonicalProblemId);
  assert.equal(report.generationFailures, 0, canonicalProblemId);
  assert.equal(report.validationFailures, 0, canonicalProblemId);
  assert.equal(report.traceabilityFailures, 0, canonicalProblemId);
  assert.ok(Object.keys(report.patternDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.divisorDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.targetRemainderDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.difficultyDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.questionLanguageDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.explanationDistribution).length > 0, canonicalProblemId);
}

console.log("NS-REM-001 CP-001 through CP-007 implementation passed.");

import { strict as assert } from "node:assert";
import {
  NS_TRAIL_001_CP_001,
  NS_TRAIL_001_CP_002,
  NS_TRAIL_001_CP_003,
  NS_TRAIL_001_CP_004,
  NS_TRAIL_001_CP_005,
  NS_TRAIL_001_MATHJAX_KEYS,
  NS_TRAIL_001_PIPELINES,
  factorialExpressionZeros,
  generateNsTrail001FullAudit,
  runNsTrail001Cp001Pipeline,
  runNsTrail001Cp002Pipeline,
  runNsTrail001Cp003Pipeline,
  runNsTrail001Cp004Pipeline,
  runNsTrail001Cp005Pipeline,
  trailingZerosFactorial,
  validateNsTrail001Libraries,
} from "../topics/NumberSystem/subtopics/Trailing Zeros/archetypes/NS-TRAIL-001";

const libraryValidation = validateNsTrail001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

assert.equal(trailingZerosFactorial(125), 31);
assert.equal(factorialExpressionZeros([100], [25]), 18);

const cp001 = runNsTrail001Cp001Pipeline({ questionLanguageId: "QL-027", n: 125, seed: "fixture-cp001" });
assert.equal(cp001.answer, 31);
assert.equal(cp001.solver.largestPowerOfFiveReached, "crosses125");
assert.ok(cp001.factorFiveCountLatex.includes("\\frac{125}{125}"));

const cp002 = runNsTrail001Cp002Pipeline({
  questionLanguageId: "QL-031",
  expression: "100! / 25!",
  numeratorTerms: [100],
  denominatorTerms: [25],
  seed: "fixture-cp002",
});
assert.equal(cp002.answer, 18);
assert.equal(cp002.solver.expressionType, "numeratorDenominator");

const cp003 = runNsTrail001Cp003Pipeline({ questionLanguageId: "QL-012", zeroCount: 6, seed: "fixture-cp003" });
assert.equal(cp003.answer, 25);
assert.equal(cp003.solver.verification.smallestExactMatch, true);

const cp004 = runNsTrail001Cp004Pipeline({ questionLanguageId: "QL-034", base: 40, exponent: 2, seed: "fixture-cp004" });
assert.equal(cp004.answer, 2);
assert.equal(cp004.solver.baseFactorizationType, "excessTwos");

const cp005 = runNsTrail001Cp005Pipeline({ questionLanguageId: "QL-037", numberA: 20, numberB: 50, seed: "fixture-cp005" });
assert.equal(cp005.answer, 3);
assert.equal(cp005.solver.productType, "productAddsZeros");

const pipelineCases = [
  { id: NS_TRAIL_001_CP_001, run: runNsTrail001Cp001Pipeline },
  { id: NS_TRAIL_001_CP_002, run: runNsTrail001Cp002Pipeline },
  { id: NS_TRAIL_001_CP_003, run: runNsTrail001Cp003Pipeline },
  { id: NS_TRAIL_001_CP_004, run: runNsTrail001Cp004Pipeline },
  { id: NS_TRAIL_001_CP_005, run: runNsTrail001Cp005Pipeline },
] as const;

for (const testCase of pipelineCases) {
  const output = testCase.run({ seed: `ns-trail-001-smoke:${testCase.id}` });
  assert.equal(output.canonicalProblemId, testCase.id);
  assert.equal(output.validation.valid, true, `${testCase.id}\n${output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n")}`);
  assert.equal(output.questionId, output.parameters.questionId);
  assert.ok(output.questionLanguageId.startsWith("QL-"));
  assert.ok(output.explanationStyleId.startsWith("ES-"));
  assert.equal(output.explanation.graphId, output.reasoningGraph.graphId);
  assert.equal(output.traceability.questionId, output.questionId);
  assert.equal(output.traceability.answer, output.answer);
  assert.equal(output.traceability.reasoningGraphId, output.reasoningGraph.graphId);
  assert.equal(output.stem.includes("{"), false);
  const explanationText = output.explanation.lines.join("\n");
  for (const placeholder of ["answer", "n", "zeroCount", ...NS_TRAIL_001_MATHJAX_KEYS]) {
    assert.equal(explanationText.includes(`{${placeholder}}`), false, placeholder);
  }
  for (const key of NS_TRAIL_001_MATHJAX_KEYS) {
    assert.ok(output[key].length > 0, key);
  }
}

assert.deepEqual(Object.keys(NS_TRAIL_001_PIPELINES), ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005"]);

const fullAudit = generateNsTrail001FullAudit({ countPerCp: 1000, seed: "ns-trail-001-final-audit" });
for (const [canonicalProblemId, report] of Object.entries(fullAudit)) {
  assert.equal(report.questionCount, 1000, canonicalProblemId);
  assert.equal(report.generationFailures, 0, canonicalProblemId);
  assert.equal(report.validationFailures, 0, canonicalProblemId);
  assert.equal(report.traceabilityFailures, 0, canonicalProblemId);
  assert.equal(report.mathJaxFailures, 0, canonicalProblemId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, canonicalProblemId);
  assert.equal(report.unusedExplanationIds.length, 0, canonicalProblemId);
  assert.ok(Object.values(report.mathJaxUsage).every((count) => count === 1000), canonicalProblemId);
}

const cp001Audit = fullAudit[NS_TRAIL_001_CP_001];
for (const bucket of ["smallFactorial", "mediumFactorial", "largeFactorial"]) {
  assert.ok((cp001Audit.nBucketCoverage[bucket] ?? 0) > 0, bucket);
}
for (const bucket of ["crosses25", "crosses125", "crosses625"]) {
  assert.ok((cp001Audit.largestPowerOfFiveReachedCoverage[bucket] ?? 0) > 0, bucket);
}

const cp002Audit = fullAudit[NS_TRAIL_001_CP_002];
for (const bucket of ["numeratorOnly", "numeratorDenominator", "cancellationCase"]) {
  assert.ok((cp002Audit.expressionTypeCoverage[bucket] ?? 0) > 0, bucket);
}

const cp003Audit = fullAudit[NS_TRAIL_001_CP_003];
for (const bucket of ["solutionExists", "smallZeroCount", "mediumZeroCount", "largeZeroCount"]) {
  assert.ok((cp003Audit.targetZeroBucketCoverage[bucket] ?? 0) > 0, bucket);
}

const cp004Audit = fullAudit[NS_TRAIL_001_CP_004];
for (const bucket of ["balancedTwoFive", "excessTwos", "excessFives", "noTrailingZero"]) {
  assert.ok((cp004Audit.baseFactorizationTypeCoverage[bucket] ?? 0) > 0, bucket);
}

const cp005Audit = fullAudit[NS_TRAIL_001_CP_005];
for (const bucket of ["productCreatesZeros", "productAddsZeros", "productNoZeroChange"]) {
  assert.ok((cp005Audit.productTypeCoverage[bucket] ?? 0) > 0, bucket);
}

console.log("NS-TRAIL-001 CP-001 through CP-005 implementation passed.");

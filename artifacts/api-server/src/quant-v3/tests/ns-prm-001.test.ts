import { strict as assert } from "node:assert";
import {
  generateNsPrm001FullAudit,
  isPrime,
  NS_PRM_001_CP_001,
  NS_PRM_001_CP_002,
  NS_PRM_001_CP_003,
  NS_PRM_001_CP_004,
  NS_PRM_001_CP_005,
  NS_PRM_001_CP_006,
  NS_PRM_001_CP_007,
  NS_PRM_001_CP_008,
  NS_PRM_001_PIPELINES,
  primesBetween,
  runNsPrm001Cp001Pipeline,
  runNsPrm001Cp002Pipeline,
  runNsPrm001Cp003Pipeline,
  runNsPrm001Cp004Pipeline,
  runNsPrm001Cp005Pipeline,
  runNsPrm001Cp006Pipeline,
  runNsPrm001Cp007Pipeline,
  runNsPrm001Cp008Pipeline,
  validateNsPrm001Libraries,
} from "../topics/NumberSystem/subtopics/PrimeNumbers/archetypes/NS-PRM-001";

const libraryValidation = validateNsPrm001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

const cp001Prime = runNsPrm001Cp001Pipeline({ number: 2, seed: "fixture-cp001-prime" });
assert.equal(cp001Prime.answer, "Prime");
assert.equal(cp001Prime.validation.valid, true);

const cp001Composite = runNsPrm001Cp001Pipeline({ number: 4, seed: "fixture-cp001-composite" });
assert.equal(cp001Composite.answer, "Composite");
assert.equal(cp001Composite.validation.valid, true);

assert.throws(() => runNsPrm001Cp001Pipeline({ number: 1, seed: "edge-number-one-cp001" }));

const cp002 = runNsPrm001Cp002Pipeline({ lowerBound: 10, upperBound: 20, seed: "fixture-cp002" });
assert.equal(cp002.answer, 4);
assert.deepEqual(cp002.solver.primesInRange, [11, 13, 17, 19]);

const cp002Empty = runNsPrm001Cp002Pipeline({ lowerBound: 24, upperBound: 28, seed: "fixture-cp002-empty" });
assert.equal(cp002Empty.answer, 0);

const cp003 = runNsPrm001Cp003Pipeline({ lowerBound: 10, upperBound: 20, seed: "fixture-cp003" });
assert.equal(cp003.answer, 11);

const cp004 = runNsPrm001Cp004Pipeline({ lowerBound: 10, upperBound: 20, seed: "fixture-cp004" });
assert.equal(cp004.answer, 19);

const cpSinglePrime = runNsPrm001Cp003Pipeline({ lowerBound: 14, upperBound: 17, seed: "fixture-single-prime" });
assert.equal(cpSinglePrime.answer, 17);
assert.equal(runNsPrm001Cp004Pipeline({ lowerBound: 14, upperBound: 17, seed: "fixture-single-prime-cp004" }).answer, 17);
assert.throws(() => runNsPrm001Cp003Pipeline({ lowerBound: 24, upperBound: 28, seed: "fixture-cp003-empty" }));
assert.throws(() => runNsPrm001Cp004Pipeline({ lowerBound: 24, upperBound: 28, seed: "fixture-cp004-empty" }));

const cp005 = runNsPrm001Cp005Pipeline({ lowerBound: 10, upperBound: 20, seed: "fixture-cp005" });
assert.equal(cp005.answer, 60);
assert.equal(runNsPrm001Cp005Pipeline({ lowerBound: 24, upperBound: 28, seed: "fixture-cp005-empty" }).answer, 0);
assert.equal(runNsPrm001Cp005Pipeline({ lowerBound: 14, upperBound: 17, seed: "fixture-cp005-single" }).answer, 17);

const cp006 = runNsPrm001Cp006Pipeline({ number: 14, seed: "fixture-cp006" });
assert.equal(cp006.answer, 17);
assert.throws(() => runNsPrm001Cp006Pipeline({ number: 1, seed: "edge-number-one-cp006" }));

const cp007 = runNsPrm001Cp007Pipeline({ number: 14, seed: "fixture-cp007" });
assert.equal(cp007.answer, 13);
assert.equal(runNsPrm001Cp007Pipeline({ number: 3, seed: "fixture-cp007-minimum" }).answer, 2);
assert.throws(() => runNsPrm001Cp007Pipeline({ number: 1, seed: "edge-number-one-cp007" }));
assert.throws(() => runNsPrm001Cp007Pipeline({ number: 2, seed: "edge-too-small-cp007" }));

const cp008 = runNsPrm001Cp008Pipeline({ position: 10, seed: "fixture-cp008" });
assert.equal(cp008.answer, 29);

const pipelineCases = [
  { id: NS_PRM_001_CP_001, run: runNsPrm001Cp001Pipeline },
  { id: NS_PRM_001_CP_002, run: runNsPrm001Cp002Pipeline },
  { id: NS_PRM_001_CP_003, run: runNsPrm001Cp003Pipeline },
  { id: NS_PRM_001_CP_004, run: runNsPrm001Cp004Pipeline },
  { id: NS_PRM_001_CP_005, run: runNsPrm001Cp005Pipeline },
  { id: NS_PRM_001_CP_006, run: runNsPrm001Cp006Pipeline },
  { id: NS_PRM_001_CP_007, run: runNsPrm001Cp007Pipeline },
  { id: NS_PRM_001_CP_008, run: runNsPrm001Cp008Pipeline },
] as const;

for (const testCase of pipelineCases) {
  const output = testCase.run({ seed: `ns-prm-001-smoke:${testCase.id}` });
  assert.equal(output.canonicalProblemId, testCase.id);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.questionId, output.parameters.questionId);
  assert.ok(output.questionLanguageId.startsWith("QL-"));
  assert.ok(output.explanationStyleId.startsWith("ES-"));
  assert.equal(output.explanation.graphId, output.reasoningGraph.graphId);
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Answer Extraction"));
  assert.ok(output.explanation.lines.join("\n").includes(String(output.answer)));
  assert.equal(output.stem.includes("{"), false);
  if (typeof output.answer === "number" && [NS_PRM_001_CP_003, NS_PRM_001_CP_004, NS_PRM_001_CP_006, NS_PRM_001_CP_007, NS_PRM_001_CP_008].includes(output.canonicalProblemId)) {
    assert.equal(isPrime(output.answer), true, output.canonicalProblemId);
  }
  if ([NS_PRM_001_CP_002, NS_PRM_001_CP_003, NS_PRM_001_CP_004, NS_PRM_001_CP_005].includes(output.canonicalProblemId)) {
    assert.deepEqual(output.solver.primesInRange, primesBetween(output.parameters.lowerBound!, output.parameters.upperBound!));
  }
}

assert.deepEqual(Object.keys(NS_PRM_001_PIPELINES), ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007", "CP-008"]);

const fullAudit = generateNsPrm001FullAudit({ countPerCp: 1000, seed: "ns-prm-001-final-audit" });
for (const [canonicalProblemId, report] of Object.entries(fullAudit)) {
  assert.equal(report.questionCount, 1000, canonicalProblemId);
  assert.equal(report.generationFailures, 0, canonicalProblemId);
  assert.equal(report.validationFailures, 0, canonicalProblemId);
  assert.equal(report.traceabilityFailures, 0, canonicalProblemId);
  assert.ok(Object.keys(report.difficultyDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.questionLanguageDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.explanationDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.topologyDistribution).length > 0, canonicalProblemId);
  if (canonicalProblemId === NS_PRM_001_CP_001) {
    assert.ok((report.primeCompositeDistribution.Prime ?? 0) > 0, canonicalProblemId);
    assert.ok((report.primeCompositeDistribution.Composite ?? 0) > 0, canonicalProblemId);
  }
  if (["CP-002", "CP-003", "CP-004", "CP-005"].includes(canonicalProblemId)) {
    assert.ok(Object.keys(report.rangeBucketDistribution).some((key) => key !== "not-applicable"), canonicalProblemId);
  }
  if (canonicalProblemId === NS_PRM_001_CP_008) {
    assert.ok(Object.keys(report.positionBucketDistribution).some((key) => key !== "not-applicable"), canonicalProblemId);
  }
}

console.log("NS-PRM-001 CP-001 through CP-008 implementation passed.");

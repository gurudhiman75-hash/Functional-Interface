import { strict as assert } from "node:assert";
import {
  generateNsPf001FullAudit,
  NS_PF_001_CP_001,
  NS_PF_001_CP_002,
  NS_PF_001_CP_003,
  NS_PF_001_CP_004,
  NS_PF_001_CP_005,
  NS_PF_001_CP_006,
  NS_PF_001_CP_007,
  NS_PF_001_PIPELINES,
  primeFactorize,
  runNsPf001Cp001Pipeline,
  runNsPf001Cp002Pipeline,
  runNsPf001Cp003Pipeline,
  runNsPf001Cp004Pipeline,
  runNsPf001Cp005Pipeline,
  runNsPf001Cp006Pipeline,
  runNsPf001Cp007Pipeline,
  validateNsPf001Libraries,
} from "../topics/NumberSystem/subtopics/Factors/archetypes/NS-PF-001";

const libraryValidation = validateNsPf001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

const factorization360 = primeFactorize(360);
assert.equal(factorization360.factorizationText, "360 = 2^3 x 3^2 x 5");
assert.equal(factorization360.factorizationLatex, "360 = 2^{3} \\times 3^{2} \\times 5");

const cp001 = runNsPf001Cp001Pipeline({ number: 360, seed: "fixture-cp001" });
assert.equal(cp001.answer, "2^3 x 3^2 x 5");
assert.equal(cp001.factorizationLatex, "360 = 2^{3} \\times 3^{2} \\times 5");
assert.equal(cp001.validation.valid, true);

const cp002 = runNsPf001Cp002Pipeline({ number: 360, seed: "fixture-cp002" });
assert.equal(cp002.answer, 6);
assert.deepEqual(cp002.solver.factorization.repeatedPrimeFactors, [2, 2, 2, 3, 3, 5]);

const cp003 = runNsPf001Cp003Pipeline({ number: 360, seed: "fixture-cp003" });
assert.equal(cp003.answer, 3);
assert.deepEqual(cp003.solver.factorization.orderedPrimeBases, [2, 3, 5]);

const cp004 = runNsPf001Cp004Pipeline({ number: 360, seed: "fixture-cp004" });
assert.equal(cp004.answer, 5);

const cp005 = runNsPf001Cp005Pipeline({ number: 360, seed: "fixture-cp005" });
assert.equal(cp005.answer, 2);

const cp006 = runNsPf001Cp006Pipeline({ number: 360, prime: 2, seed: "fixture-cp006" });
assert.equal(cp006.answer, 8);
assert.equal(cp006.solver.selectedExponent, 3);
assert.equal(cp006.solver.selectedPrimePower, 8);
assert.notEqual(cp006.answer, cp006.solver.selectedExponent);
assert.ok(cp006.stem.includes("2"));
assert.ok(cp006.explanation.lines.join("\n").includes("2^3 = 8"));

const cp007 = runNsPf001Cp007Pipeline({ number: 360, prime: 2, seed: "fixture-cp007" });
assert.equal(cp007.answer, 3);
assert.equal(cp007.solver.selectedPrimePower, 8);
assert.notEqual(cp007.answer, cp007.solver.selectedPrimePower);
assert.ok(cp007.explanation.lines.join("\n").includes("The exponent of 2 is 3."));

assert.throws(() => runNsPf001Cp006Pipeline({ number: 360, prime: 7, seed: "invalid-selected-prime-cp006" }));
assert.throws(() => runNsPf001Cp007Pipeline({ number: 360, prime: 7, seed: "invalid-selected-prime-cp007" }));
assert.throws(() => runNsPf001Cp001Pipeline({ number: 1, seed: "invalid-number-cp001" }));

const primeCp001 = runNsPf001Cp001Pipeline({ number: 13, seed: "prime-cp001" });
assert.equal(primeCp001.answer, "13");
assert.equal(primeCp001.solver.inputClass, "Prime");
assert.equal(primeCp001.factorizationText, "13 = 13");
assert.equal(primeCp001.factorizationLatex, "13 = 13");

assert.equal(runNsPf001Cp002Pipeline({ number: 13, seed: "prime-cp002" }).answer, 1);
assert.equal(runNsPf001Cp003Pipeline({ number: 13, seed: "prime-cp003" }).answer, 1);
assert.equal(runNsPf001Cp004Pipeline({ number: 13, seed: "prime-cp004" }).answer, 13);
assert.equal(runNsPf001Cp005Pipeline({ number: 13, seed: "prime-cp005" }).answer, 13);
assert.equal(runNsPf001Cp006Pipeline({ number: 13, prime: 13, seed: "prime-cp006" }).answer, 13);
assert.equal(runNsPf001Cp007Pipeline({ number: 13, prime: 13, seed: "prime-cp007" }).answer, 1);

const pipelineCases = [
  { id: NS_PF_001_CP_001, run: runNsPf001Cp001Pipeline },
  { id: NS_PF_001_CP_002, run: runNsPf001Cp002Pipeline },
  { id: NS_PF_001_CP_003, run: runNsPf001Cp003Pipeline },
  { id: NS_PF_001_CP_004, run: runNsPf001Cp004Pipeline },
  { id: NS_PF_001_CP_005, run: runNsPf001Cp005Pipeline },
  { id: NS_PF_001_CP_006, run: runNsPf001Cp006Pipeline },
  { id: NS_PF_001_CP_007, run: runNsPf001Cp007Pipeline },
] as const;

for (const testCase of pipelineCases) {
  const output = testCase.run({ seed: `ns-pf-001-smoke:${testCase.id}` });
  assert.equal(output.canonicalProblemId, testCase.id);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.questionId, output.parameters.questionId);
  assert.ok(output.questionLanguageId.startsWith("QL-"));
  assert.ok(output.explanationStyleId.startsWith("ES-"));
  assert.equal(output.explanation.graphId, output.reasoningGraph.graphId);
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Answer Extraction"));
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "MathJax Evidence"));
  assert.ok(output.explanation.lines.join("\n").includes(output.factorizationText));
  assert.equal(output.stem.includes("{"), false);
  assert.equal(output.traceability.factorizationText, output.factorizationText);
  assert.equal(output.traceability.factorizationLatex, output.factorizationLatex);
  assert.equal(output.reasoningGraph.factorizationLatex, output.factorizationLatex);
  assert.ok(output.factorizationLatex.includes("="));
}

assert.deepEqual(Object.keys(NS_PF_001_PIPELINES), ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"]);

const fullAudit = generateNsPf001FullAudit({ countPerCp: 1000, seed: "ns-pf-001-final-audit" });
for (const [canonicalProblemId, report] of Object.entries(fullAudit)) {
  assert.equal(report.questionCount, 1000, canonicalProblemId);
  assert.equal(report.generationFailures, 0, canonicalProblemId);
  assert.equal(report.validationFailures, 0, canonicalProblemId);
  assert.equal(report.traceabilityFailures, 0, canonicalProblemId);
  assert.equal(report.mathJaxFailures, 0, canonicalProblemId);
  assert.ok(report.factorizationLatexSamples.length > 0, canonicalProblemId);
  assert.ok(report.factorizationLatexSamples.every((sample) => sample.includes("=")), canonicalProblemId);
  assert.ok((report.primeInputCoverage.true ?? 0) > 0, canonicalProblemId);
  assert.ok((report.compositeInputCoverage.true ?? 0) > 0, canonicalProblemId);
  assert.ok(Object.keys(report.difficultyDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.questionLanguageDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.explanationDistribution).length > 0, canonicalProblemId);
  assert.ok(Object.keys(report.topologyDistribution).length > 0, canonicalProblemId);
  if (canonicalProblemId === NS_PF_001_CP_006 || canonicalProblemId === NS_PF_001_CP_007) {
    assert.ok(Object.keys(report.selectedPrimeCoverage).some((key) => key !== "not-applicable"), canonicalProblemId);
    assert.ok(Object.keys(report.selectedExponentCoverage).some((key) => key !== "not-applicable"), canonicalProblemId);
  }
}

console.log("NS-PF-001 CP-001 through CP-007 implementation passed.");

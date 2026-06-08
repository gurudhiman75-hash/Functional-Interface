import { strict as assert } from "node:assert";
import {
  NS_HCF_001_CP_001,
  NS_HCF_001_CP_002,
  NS_HCF_001_CP_003,
  NS_HCF_001_CP_004,
  NS_HCF_001_PIPELINES,
  factorCount,
  generateNsHcf001FullAudit,
  gcd,
  hcfOf,
  runNsHcf001Cp001Pipeline,
  runNsHcf001Cp002Pipeline,
  runNsHcf001Cp003Pipeline,
  runNsHcf001Cp004Pipeline,
  validateNsHcf001Libraries,
} from "../topics/NumberSystem/subtopics/HCF/archetypes/NS-HCF-001";

const libraryValidation = validateNsHcf001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

assert.equal(gcd(24, 36), 12);
assert.equal(hcfOf([18, 30, 42]), 6);
assert.equal(hcfOf([35, 64]), 1);
assert.equal(factorCount(12), 6);

const cp001 = runNsHcf001Cp001Pipeline({ numbers: [24, 36], questionLanguageId: "QL-001", seed: "fixture-cp001" });
assert.equal(cp001.answer, 12);
assert.ok(cp001.operandFactorizationLatex.length > 0);
assert.ok(cp001.reasoningGraph.nodes.some((node) => node.type === "Prime Factorization"));

const cp002 = runNsHcf001Cp002Pipeline({ numbers: [24, 36], questionLanguageId: "QL-009", seed: "fixture-cp002" });
assert.equal(cp002.answer, 6);
assert.ok(cp002.hcfFactorCountFormulaLatex.includes("= 6"));

const cp003Families = [
  { id: "QL-016", family: "bounded_range" },
  { id: "QL-021", family: "candidate_set" },
  { id: "QL-026", family: "divisibility_restriction" },
  { id: "QL-031", family: "arithmetic_restriction" },
  { id: "QL-036", family: "exam_mixed" },
] as const;

for (const item of cp003Families) {
  const output = runNsHcf001Cp003Pipeline({ questionLanguageId: item.id, seed: `fixture-cp003:${item.id}` });
  assert.equal(output.cp003Family, item.family);
  assert.equal(output.solver.validCandidates.length, 1);
  assert.equal(output.answer, output.solver.validCandidates[0]);
  assert.equal(output.stem.includes("uniquenessConstraint"), false);
  assert.equal(output.stem.includes("{"), false);
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Generate Candidates"));
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Eliminate Invalid Candidates"));
  assert.ok(output.candidateEvaluationLatex.length > 0);
}

assert.throws(() =>
  runNsHcf001Cp003Pipeline({
    questionLanguageId: "QL-021",
    knownOperands: [30],
    targetHcf: 15,
    numbers: [45],
    candidateValues: [45, 75],
    seed: "invalid-ambiguous-cp003",
  }),
);

const cp004 = runNsHcf001Cp004Pipeline({ questionLanguageId: "QL-041", seed: "fixture-cp004" });
assert.equal(cp004.answer, 42);
assert.ok(cp004.stem.includes("84 apples and 126 oranges"));
assert.ok(cp004.reasoningGraph.nodes.some((node) => node.type === "Context Interpretation"));
assert.ok(cp004.groupingInterpretationLatex.length > 0);

const pipelineCases = [
  { id: NS_HCF_001_CP_001, run: runNsHcf001Cp001Pipeline },
  { id: NS_HCF_001_CP_002, run: runNsHcf001Cp002Pipeline },
  { id: NS_HCF_001_CP_003, run: runNsHcf001Cp003Pipeline },
  { id: NS_HCF_001_CP_004, run: runNsHcf001Cp004Pipeline },
] as const;

for (const testCase of pipelineCases) {
  const output = testCase.run({ seed: `ns-hcf-001-smoke:${testCase.id}` });
  assert.equal(output.canonicalProblemId, testCase.id);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.questionId, output.parameters.questionId);
  assert.ok(output.questionLanguageId.startsWith("QL-"));
  assert.ok(output.explanationStyleId.startsWith("ES-"));
  assert.equal(output.explanation.graphId, output.reasoningGraph.graphId);
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Answer Extraction"));
  assert.equal(output.traceability.questionId, output.questionId);
  assert.equal(output.traceability.answer, output.answer);
  assert.equal(output.traceability.reasoningGraphId, output.reasoningGraph.graphId);
  assert.equal(output.stem.includes("{"), false);
  const explanationText = output.explanation.lines.join("\n");
  for (const placeholder of [
    "answer",
    "operandFactorizationLatex",
    "commonPrimeIntersectionLatex",
    "minimumExponentSelectionLatex",
    "hcfLatex",
    "hcfFactorCountFormulaLatex",
    "candidateEvaluationLatex",
    "groupingInterpretationLatex",
  ]) {
    assert.equal(explanationText.includes(`{${placeholder}}`), false, placeholder);
  }
  assert.ok(output.hcfLatex.length > 0);
}

assert.deepEqual(Object.keys(NS_HCF_001_PIPELINES), ["CP-001", "CP-002", "CP-003", "CP-004"]);

const fullAudit = generateNsHcf001FullAudit({ countPerCp: 1000, seed: "ns-hcf-001-final-audit" });
for (const [canonicalProblemId, report] of Object.entries(fullAudit)) {
  assert.equal(report.questionCount, 1000, canonicalProblemId);
  assert.equal(report.generationFailures, 0, canonicalProblemId);
  assert.equal(report.validationFailures, 0, canonicalProblemId);
  assert.equal(report.traceabilityFailures, 0, canonicalProblemId);
  assert.equal(report.mathJaxFailures, 0, canonicalProblemId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, canonicalProblemId);
  assert.equal(report.unusedExplanationIds.length, 0, canonicalProblemId);
  assert.ok(Object.values(report.mathJaxObjectCoverage).every((count) => count === 1000), canonicalProblemId);
  if (canonicalProblemId === NS_HCF_001_CP_003) {
    for (const family of ["bounded_range", "candidate_set", "divisibility_restriction", "arithmetic_restriction", "exam_mixed"]) {
      assert.ok((report.cpFamilyDistribution[family] ?? 0) > 0, family);
    }
  }
}

console.log("NS-HCF-001 CP-001 through CP-004 implementation passed.");

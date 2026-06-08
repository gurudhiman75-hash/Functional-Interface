import { strict as assert } from "node:assert";
import {
  NS_LCM_001_CP_001,
  NS_LCM_001_CP_002,
  NS_LCM_001_CP_003,
  NS_LCM_001_CP_004,
  NS_LCM_001_CP_005,
  NS_LCM_001_PIPELINES,
  countCommonMultiplesInRange,
  firstCommonMultipleGreaterThan,
  generateNsLcm001FullAudit,
  gcd,
  lcmOf,
  runNsLcm001Cp001Pipeline,
  runNsLcm001Cp002Pipeline,
  runNsLcm001Cp003Pipeline,
  runNsLcm001Cp004Pipeline,
  runNsLcm001Cp005Pipeline,
  validateNsLcm001Libraries,
} from "../topics/NumberSystem/subtopics/LCM/archetypes/NS-LCM-001";

const libraryValidation = validateNsLcm001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

assert.equal(gcd(24, 36), 12);
assert.equal(lcmOf([4, 6]), 12);
assert.equal(lcmOf([12, 18, 30]), 180);
assert.equal(countCommonMultiplesInRange([6, 10], 1, 20), 0);
assert.equal(countCommonMultiplesInRange([8, 12], 50, 150), 4);
assert.equal(firstCommonMultipleGreaterThan([6, 10], 60), 90);
assert.equal(firstCommonMultipleGreaterThan([8, 12], 70), 72);

const cp001 = runNsLcm001Cp001Pipeline({ numbers: [8, 12], questionLanguageId: "QL-001", seed: "fixture-cp001" });
assert.equal(cp001.answer, 24);
assert.ok(cp001.operandFactorizationLatex.length > 0);
assert.ok(cp001.primeUnionLatex.length > 0);
assert.ok(cp001.reasoningGraph.nodes.some((node) => node.type === "Maximum Exponent Selection"));

const cp002 = runNsLcm001Cp002Pipeline({ questionLanguageId: "QL-024", seed: "fixture-cp002:buses" });
assert.equal(cp002.cycleContext, "buses");
assert.equal(cp002.answer, lcmOf(cp002.parameters.cycleLengths ?? []));
assert.ok(cp002.stem.includes("buses"));
assert.ok(cp002.synchronizationInterpretationLatex.length > 0);

const cp003Families = [
  { id: "QL-011", family: "candidate_list" },
  { id: "QL-012", family: "bounded_range" },
  { id: "QL-013", family: "divisibility_condition" },
  { id: "QL-014", family: "arithmetic_condition" },
] as const;

for (const item of cp003Families) {
  const output = runNsLcm001Cp003Pipeline({ questionLanguageId: item.id, seed: `fixture-cp003:${item.id}` });
  assert.equal(output.cp003Family, item.family);
  assert.equal(output.solver.validCandidates.length, 1);
  assert.equal(output.answer, output.solver.validCandidates[0]);
  assert.equal(output.solver.exactLcmMatch, true);
  assert.equal(output.stem.includes("{"), false);
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Candidate Evaluation"));
  assert.ok(output.candidateEvaluationLatex.includes("\\checkmark"));
}

assert.throws(() =>
  runNsLcm001Cp003Pipeline({
    questionLanguageId: "QL-011",
    knownNumbers: [12],
    targetLcm: 60,
    numbers: [20],
    candidateValues: [10, 15, 20],
    seed: "invalid-ambiguous-cp003",
  }),
);

const cp004 = runNsLcm001Cp004Pipeline({ numbers: [8, 12], lowerBound: 50, upperBound: 150, questionLanguageId: "QL-017", seed: "fixture-cp004" });
assert.equal(cp004.answer, 4);
assert.ok(cp004.rangeCountFormulaLatex.includes("= 4"));
assert.ok(cp004.reasoningGraph.nodes.some((node) => node.type === "Range Count"));

const cp005 = runNsLcm001Cp005Pipeline({ numbers: [8, 12], threshold: 70, questionLanguageId: "QL-029", seed: "fixture-cp005" });
assert.equal(cp005.answer, 72);
assert.ok(cp005.thresholdSelectionFormulaLatex.includes("= 72"));
assert.ok(cp005.reasoningGraph.nodes.some((node) => node.type === "Threshold Selection"));

const pipelineCases = [
  { id: NS_LCM_001_CP_001, run: runNsLcm001Cp001Pipeline },
  { id: NS_LCM_001_CP_002, run: runNsLcm001Cp002Pipeline },
  { id: NS_LCM_001_CP_003, run: runNsLcm001Cp003Pipeline },
  { id: NS_LCM_001_CP_004, run: runNsLcm001Cp004Pipeline },
  { id: NS_LCM_001_CP_005, run: runNsLcm001Cp005Pipeline },
] as const;

for (const testCase of pipelineCases) {
  const output = testCase.run({ seed: `ns-lcm-001-smoke:${testCase.id}` });
  assert.equal(output.canonicalProblemId, testCase.id);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.questionId, output.parameters.questionId);
  assert.ok(output.questionLanguageId.startsWith("QL-"));
  assert.notEqual(output.questionLanguageId, "QL-015");
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
    "targetLcm",
    "threshold",
    "operandFactorizationLatex",
    "primeUnionLatex",
    "maximumExponentSelectionLatex",
    "lcmLatex",
    "synchronizationInterpretationLatex",
    "candidateEvaluationLatex",
    "rangeCountFormulaLatex",
    "thresholdSelectionFormulaLatex",
  ]) {
    assert.equal(explanationText.includes(`{${placeholder}}`), false, placeholder);
  }
  assert.ok(output.lcmLatex.length > 0);
  assert.ok(output.operandFactorizationLatex.length > 0);
  assert.ok(output.primeUnionLatex.length > 0);
  assert.ok(output.maximumExponentSelectionLatex.length > 0);
  assert.ok(output.synchronizationInterpretationLatex.length > 0);
  assert.ok(output.candidateEvaluationLatex.length > 0);
  assert.ok(output.rangeCountFormulaLatex.length > 0);
  assert.ok(output.thresholdSelectionFormulaLatex.length > 0);
}

assert.deepEqual(Object.keys(NS_LCM_001_PIPELINES), ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005"]);

const cp002Audit = generateNsLcm001FullAudit({ countPerCp: 1000, seed: "ns-lcm-001-final-audit" })[NS_LCM_001_CP_002];
for (const context of ["bells", "lights", "alarms", "runners", "machines", "buses", "trains", "traffic_signals", "sprinklers", "cleaning_schedules"]) {
  assert.ok((cp002Audit.cycleContextCoverage[context] ?? 0) > 0, context);
}

const fullAudit = generateNsLcm001FullAudit({ countPerCp: 1000, seed: "ns-lcm-001-final-audit" });
for (const [canonicalProblemId, report] of Object.entries(fullAudit)) {
  assert.equal(report.questionCount, 1000, canonicalProblemId);
  assert.equal(report.generationFailures, 0, canonicalProblemId);
  assert.equal(report.validationFailures, 0, canonicalProblemId);
  assert.equal(report.traceabilityFailures, 0, canonicalProblemId);
  assert.equal(report.mathJaxFailures, 0, canonicalProblemId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, canonicalProblemId);
  assert.equal(report.unusedExplanationIds.length, 0, canonicalProblemId);
  assert.ok(Object.values(report.mathJaxObjectCoverage).every((count) => count === 1000), canonicalProblemId);
  if (canonicalProblemId === NS_LCM_001_CP_003) {
    for (const family of ["candidate_list", "bounded_range", "divisibility_condition", "arithmetic_condition"]) {
      assert.ok((report.cp003FamilyCoverage[family] ?? 0) > 0, family);
    }
    assert.ok((report.exactLcmMatchCoverage.true ?? 0) === 1000, canonicalProblemId);
  }
}

console.log("NS-LCM-001 CP-001 through CP-005 implementation passed.");

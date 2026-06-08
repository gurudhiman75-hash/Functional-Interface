import { strict as assert } from "node:assert";
import {
  NS_COP_001_CP_001,
  NS_COP_001_CP_002,
  NS_COP_001_CP_003,
  NS_COP_001_CP_004,
  NS_COP_001_CP_005,
  NS_COP_001_CP_006,
  NS_COP_001_MATHJAX_KEYS,
  NS_COP_001_PIPELINES,
  generateNsCop001FullAudit,
  gcd,
  reduceRatio,
  runNsCop001Cp001Pipeline,
  runNsCop001Cp002Pipeline,
  runNsCop001Cp003Pipeline,
  runNsCop001Cp004Pipeline,
  runNsCop001Cp005Pipeline,
  runNsCop001Cp006Pipeline,
  validateNsCop001Libraries,
} from "../topics/NumberSystem/subtopics/Co-Prime Numbers/archetypes/NS-COP-001";

const libraryValidation = validateNsCop001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

assert.equal(gcd(14, 25), 1);
assert.equal(gcd(18, 30), 6);
assert.equal(reduceRatio(18, 30).ratio, "3:5");

const cp001Classification = runNsCop001Cp001Pipeline({ questionLanguageId: "QL-001", a: 14, b: 25, seed: "fixture-cp001-classification" });
assert.equal(cp001Classification.answer, "Co-prime");
assert.equal(cp001Classification.solver.cp001AnswerType, "coprimeClassification");

const cp001Hcf = runNsCop001Cp001Pipeline({ questionLanguageId: "QL-029", a: 18, b: 30, seed: "fixture-cp001-hcf" });
assert.equal(cp001Hcf.answer, 6);
assert.equal(cp001Hcf.solver.cp001AnswerType, "hcfValue");

const cp001CommonFactors = runNsCop001Cp001Pipeline({ questionLanguageId: "QL-030", a: 18, b: 30, seed: "fixture-cp001-common-factors" });
assert.equal(cp001CommonFactors.answer, 4);
assert.equal(cp001CommonFactors.solver.cp001AnswerType, "commonFactorCount");

const cp001Category = runNsCop001Cp001Pipeline({ questionLanguageId: "QL-031", a: 14, b: 25, seed: "fixture-cp001-category" });
assert.equal(cp001Category.answer, "Co-prime pair");
assert.equal(cp001Category.solver.cp001AnswerType, "categorySelection");

const cp002 = runNsCop001Cp002Pipeline({ questionLanguageId: "QL-033", targetNumber: 12, numberList: [5, 6, 7], seed: "fixture-cp002" });
assert.equal(cp002.answer, 2);
assert.ok(cp002.coprimeCheckLatex.includes("\\checkmark"));

const cp003 = runNsCop001Cp003Pipeline({ questionLanguageId: "QL-011", number: 12, candidateSet: [6, 8, 25, 30], seed: "fixture-cp003" });
assert.equal(cp003.answer, 25);
assert.equal(cp003.solver.validCandidates.length, 1);

assert.throws(() =>
  runNsCop001Cp003Pipeline({ questionLanguageId: "QL-011", number: 12, candidateSet: [5, 25, 30], seed: "invalid-multiple-cp003" }),
);

const cp004 = runNsCop001Cp004Pipeline({ questionLanguageId: "QL-036", numberSet: [6, 10, 35], seed: "fixture-cp004" });
assert.equal(cp004.answer, 1);
assert.ok(cp004.pairEvaluationLatex.length > 0);

const cp005Hcf = runNsCop001Cp005Pipeline({ questionLanguageId: "QL-020", number: 35, nextNumber: 36, seed: "fixture-cp005-hcf" });
assert.equal(cp005Hcf.answer, 1);
assert.ok(cp005Hcf.consecutivePropertyLatex.includes("= 1"));

const cp005CommonFactors = runNsCop001Cp005Pipeline({ questionLanguageId: "QL-021", number: 35, nextNumber: 36, seed: "fixture-cp005-common-factors" });
assert.equal(cp005CommonFactors.answer, "1");

const cp006 = runNsCop001Cp006Pipeline({ questionLanguageId: "QL-039", a: 18, b: 30, seed: "fixture-cp006" });
assert.equal(cp006.answer, "3:5");
assert.ok(cp006.ratioReductionLatex.includes("3:5"));

const pipelineCases = [
  { id: NS_COP_001_CP_001, run: runNsCop001Cp001Pipeline },
  { id: NS_COP_001_CP_002, run: runNsCop001Cp002Pipeline },
  { id: NS_COP_001_CP_003, run: runNsCop001Cp003Pipeline },
  { id: NS_COP_001_CP_004, run: runNsCop001Cp004Pipeline },
  { id: NS_COP_001_CP_005, run: runNsCop001Cp005Pipeline },
  { id: NS_COP_001_CP_006, run: runNsCop001Cp006Pipeline },
] as const;

for (const testCase of pipelineCases) {
  const output = testCase.run({ seed: `ns-cop-001-smoke:${testCase.id}` });
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
  for (const placeholder of ["answer", "a", "b", "hcf", "decisionText", "targetNumber", "number", "nextNumber", ...NS_COP_001_MATHJAX_KEYS]) {
    assert.equal(explanationText.includes(`{${placeholder}}`), false, placeholder);
  }
  for (const key of NS_COP_001_MATHJAX_KEYS) {
    assert.ok(output[key].length > 0, key);
  }
}

assert.deepEqual(Object.keys(NS_COP_001_PIPELINES), ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"]);

const fullAudit = generateNsCop001FullAudit({ countPerCp: 1000, seed: "ns-cop-001-final-audit" });
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

const cp001Audit = fullAudit[NS_COP_001_CP_001];
for (const answerType of ["coprimeClassification", "hcfValue", "commonFactorCount", "categorySelection"]) {
  assert.ok((cp001Audit.cp001AnswerTypeCoverage[answerType] ?? 0) > 0, answerType);
}
for (const status of ["coprime", "notCoprime"]) {
  assert.ok((cp001Audit.coprimeStatusCoverage[status] ?? 0) > 0, status);
}

const cp002Audit = fullAudit[NS_COP_001_CP_002];
for (const listLength of ["shortList", "mediumList", "longList"]) {
  assert.ok((cp002Audit.listLengthCoverage[listLength] ?? 0) > 0, listLength);
}

const cp004Audit = fullAudit[NS_COP_001_CP_004];
for (const setSize of ["smallSet", "mediumSet", "largeSet"]) {
  assert.ok((cp004Audit.setSizeCoverage[setSize] ?? 0) > 0, setSize);
}

const cp006Audit = fullAudit[NS_COP_001_CP_006];
for (const ratioType of ["alreadyReduced", "reducibleOnce", "reducibleMultipleFactors", "equalTerms", "largeHcf"]) {
  assert.ok((cp006Audit.ratioTypeCoverage[ratioType] ?? 0) > 0, ratioType);
}

console.log("NS-COP-001 CP-001 through CP-006 implementation passed.");

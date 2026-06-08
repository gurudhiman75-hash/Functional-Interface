import { strict as assert } from "node:assert";
import {
  NS_HL_001_CP_001,
  NS_HL_001_CP_002,
  NS_HL_001_CP_003,
  NS_HL_001_CP_004,
  NS_HL_001_CP_005,
  NS_HL_001_CP_006,
  NS_HL_001_MATHJAX_KEYS,
  NS_HL_001_PIPELINES,
  generateNsHl001FullAudit,
  gcd,
  hcfOf,
  lcmOf,
  runNsHl001Cp001Pipeline,
  runNsHl001Cp002Pipeline,
  runNsHl001Cp003Pipeline,
  runNsHl001Cp004Pipeline,
  runNsHl001Cp005Pipeline,
  runNsHl001Cp006Pipeline,
  validateNsHl001Libraries,
} from "../topics/NumberSystem/subtopics/HCF-LCM Relationship/archetypes/NS-HL-001";

const libraryValidation = validateNsHl001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

assert.equal(gcd(24, 36), 12);
assert.equal(hcfOf([12, 30]), 6);
assert.equal(lcmOf([12, 30]), 60);

const cp001Product = runNsHl001Cp001Pipeline({ questionLanguageId: "QL-001", seed: "fixture-cp001-product" });
assert.equal(cp001Product.answer, 360);
assert.equal(cp001Product.solver.cp001Family, "findProduct");

const cp001Lcm = runNsHl001Cp001Pipeline({ questionLanguageId: "QL-004", seed: "fixture-cp001-lcm" });
assert.equal(cp001Lcm.answer, 120);
assert.equal(cp001Lcm.solver.cp001Family, "findLcm");

const cp001Hcf = runNsHl001Cp001Pipeline({ questionLanguageId: "QL-005", seed: "fixture-cp001-hcf" });
assert.equal(cp001Hcf.answer, 6);
assert.equal(cp001Hcf.solver.cp001Family, "findHcf");

const cp002Valid = runNsHl001Cp002Pipeline({ questionLanguageId: "QL-010", seed: "fixture-cp002-valid" });
assert.ok(["Valid", "Invalid"].includes(String(cp002Valid.answer)));
assert.ok(cp002Valid.reasoningGraph.nodes.some((node) => node.type === "Decision Node"));

const cp002Invalid = runNsHl001Cp002Pipeline({ questionLanguageId: "QL-010", seed: "product-failure:5" });
assert.equal(cp002Invalid.validation.valid, true);
assert.ok(cp002Invalid.divisibilityCheckLatex.length > 0);
assert.ok(cp002Invalid.productRelationCheckLatex.length > 0);

const cp003 = runNsHl001Cp003Pipeline({ questionLanguageId: "QL-011", seed: "fixture-cp003" });
assert.equal(cp003.answer, 30);
assert.equal(cp003.solver.answerPair?.a, 12);
assert.equal(cp003.solver.answerPair?.b, 30);
assert.ok(cp003.missingNumberFormulaLatex.includes("30"));

for (const item of [
  { id: "QL-015", condition: "sumCondition", answer: "18 and 60" },
  { id: "QL-017", condition: "differenceCondition", answer: "12 and 90" },
  { id: "QL-021", condition: "rangeCondition", answer: "18 and 60" },
  { id: "QL-019", condition: "directPairCondition", answer: "6 and 96" },
] as const) {
  const output = runNsHl001Cp004Pipeline({ questionLanguageId: item.id, seed: `fixture-cp004:${item.id}` });
  assert.equal(output.solver.conditionType, item.condition);
  assert.equal(output.answer, item.answer);
  assert.equal(output.solver.selectedPairs.length, 1);
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Coprime Filter"));
}

const cp005Ordered = runNsHl001Cp005Pipeline({ questionLanguageId: "QL-026", seed: "fixture-cp005-ordered" });
assert.equal(cp005Ordered.solver.pairPolicy, "orderedPairs");
assert.equal(typeof cp005Ordered.answer, "number");

const cp005Unordered = runNsHl001Cp005Pipeline({ questionLanguageId: "QL-027", seed: "fixture-cp005-unordered" });
assert.equal(cp005Unordered.solver.pairPolicy, "unorderedPairs");
assert.equal(typeof cp005Unordered.answer, "number");

for (const item of [
  { id: "QL-028", ratioType: "ratioPlusHcf" },
  { id: "QL-030", ratioType: "ratioPlusLcm" },
  { id: "QL-032", ratioType: "ratioPlusHcfPlusLcm" },
] as const) {
  const output = runNsHl001Cp006Pipeline({ questionLanguageId: item.id, seed: `fixture-cp006:${item.id}` });
  assert.equal(output.solver.ratioType, item.ratioType);
  assert.ok(output.solver.answerPair);
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Ratio Reduction"));
}

const pipelineCases = [
  { id: NS_HL_001_CP_001, run: runNsHl001Cp001Pipeline },
  { id: NS_HL_001_CP_002, run: runNsHl001Cp002Pipeline },
  { id: NS_HL_001_CP_003, run: runNsHl001Cp003Pipeline },
  { id: NS_HL_001_CP_004, run: runNsHl001Cp004Pipeline },
  { id: NS_HL_001_CP_005, run: runNsHl001Cp005Pipeline },
  { id: NS_HL_001_CP_006, run: runNsHl001Cp006Pipeline },
] as const;

for (const testCase of pipelineCases) {
  const output = testCase.run({ seed: `ns-hl-001-smoke:${testCase.id}` });
  assert.equal(output.canonicalProblemId, testCase.id);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.questionId, output.parameters.questionId);
  assert.ok(output.questionLanguageId.startsWith("QL-"));
  assert.ok(output.explanationStyleId.startsWith("ES-"));
  assert.equal(output.explanation.graphId, output.reasoningGraph.graphId);
  assert.equal(output.traceability.questionId, output.questionId);
  assert.equal(output.traceability.answer, output.answer);
  assert.equal(output.traceability.reasoningGraphId, output.reasoningGraph.graphId);
  assert.equal(output.stem.includes("{"), false);
  const explanationText = output.explanation.lines.join("\n");
  for (const placeholder of ["answer", ...NS_HL_001_MATHJAX_KEYS]) {
    assert.equal(explanationText.includes(`{${placeholder}}`), false, placeholder);
  }
  for (const key of NS_HL_001_MATHJAX_KEYS) {
    assert.ok(output[key].length > 0, key);
  }
}

assert.deepEqual(Object.keys(NS_HL_001_PIPELINES), ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"]);

const fullAudit = generateNsHl001FullAudit({ countPerCp: 1000, seed: "ns-hl-001-final-audit" });
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

const cp002Audit = fullAudit[NS_HL_001_CP_002];
for (const validityType of ["validAllChecksPass", "hcfDoesNotDivideLcm", "productRelationFailure", "numberConsistencyFailure"]) {
  assert.ok((cp002Audit.validityTypeCoverage[validityType] ?? 0) > 0, validityType);
}

const cp004Audit = fullAudit[NS_HL_001_CP_004];
for (const conditionType of ["sumCondition", "differenceCondition", "rangeCondition", "directPairCondition"]) {
  assert.ok((cp004Audit.conditionTypeCoverage[conditionType] ?? 0) > 0, conditionType);
}

const cp005Audit = fullAudit[NS_HL_001_CP_005];
for (const pairPolicy of ["orderedPairs", "unorderedPairs"]) {
  assert.ok((cp005Audit.pairPolicyCoverage[pairPolicy] ?? 0) > 0, pairPolicy);
}
for (const pairCountCase of ["singlePairCase", "multiplePairCase"]) {
  assert.ok((cp005Audit.pairCountCaseCoverage[pairCountCase] ?? 0) > 0, pairCountCase);
}

const cp006Audit = fullAudit[NS_HL_001_CP_006];
for (const ratioType of ["ratioPlusHcf", "ratioPlusLcm", "ratioPlusHcfPlusLcm"]) {
  assert.ok((cp006Audit.ratioTypeCoverage[ratioType] ?? 0) > 0, ratioType);
}
for (const ratioReductionType of ["alreadyReducedRatio", "reducibleRatio"]) {
  assert.ok((cp006Audit.ratioReductionCoverage[ratioReductionType] ?? 0) > 0, ratioReductionType);
}

console.log("NS-HL-001 CP-001 through CP-006 implementation passed.");

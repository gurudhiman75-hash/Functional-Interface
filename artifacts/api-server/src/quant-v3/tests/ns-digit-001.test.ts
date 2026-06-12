import { strict as assert } from "node:assert";
import {
  NS_DIGIT_001_MATHJAX_KEYS,
  NS_DIGIT_001_PIPELINES,
  digitCountOfNumber,
  digitCountOfPower,
  digitCountOfProduct,
  generateNsDigit001FullCoverageAudit,
  nDigitBoundary,
  runNsDigit001Cp001Pipeline,
  runNsDigit001Cp002Pipeline,
  runNsDigit001Cp003Pipeline,
  runNsDigit001Cp004Pipeline,
  runNsDigit001Cp005Pipeline,
  validateNsDigit001Libraries,
} from "../topics/NumberSystem/subtopics/Number Of Digits/archetypes/NS-DIGIT-001";

const libraries = validateNsDigit001Libraries();
assert.equal(libraries.valid, true, libraries.failures.join("\n"));

assert.equal(digitCountOfNumber(1001), 4);
assert.equal(digitCountOfPower(2, 10), 4);
assert.equal(digitCountOfProduct([12, 345]), 4);
assert.equal(nDigitBoundary(4, "smallest"), "1000");
assert.equal(nDigitBoundary(4, "largest"), "9999");

const cp001 = runNsDigit001Cp001Pipeline({ questionLanguageId: "QL-001", number: 1001, seed: "fixture-cp001" });
assert.equal(cp001.answer, 4);
assert.ok(cp001.reasoningGraph.nodes.some((node) => node.id === "captureNumber"));

const cp002 = runNsDigit001Cp002Pipeline({ questionLanguageId: "QL-013", base: 2, exponent: 10, seed: "fixture-cp002" });
assert.equal(cp002.answer, 4);
assert.ok(cp002.reasoningGraph.nodes.some((node) => node.id === "applyFloor"));

const cp003 = runNsDigit001Cp003Pipeline({ questionLanguageId: "QL-028", factors: [12, 345], seed: "fixture-cp003" });
assert.equal(cp003.answer, 4);
assert.ok(cp003.reasoningGraph.nodes.some((node) => node.id === "sumLogarithms"));

const cp004 = runNsDigit001Cp004Pipeline({ questionLanguageId: "QL-041", digitCount: 4, seed: "fixture-cp004" });
assert.equal(cp004.answer, "9999");
assert.ok(cp004.reasoningGraph.nodes.some((node) => node.id === "applyBoundaryFormula"));

const cp005 = runNsDigit001Cp005Pipeline({ questionLanguageId: "QL-075", base: 2, digitCount: 4, options: [5, 9, 10, 15], seed: "fixture-cp005" });
assert.equal(cp005.answer, 10);
assert.equal(cp005.solver.validOptions?.length, 1);
assert.ok(cp005.reasoningGraph.nodes.some((node) => node.id === "selectUniqueAnswer"));

for (const [cpId, pipeline] of Object.entries(NS_DIGIT_001_PIPELINES)) {
  const output = pipeline({ seed: `smoke:${cpId}` });
  assert.equal(output.canonicalProblemId, cpId);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.stem.includes("{"), false);
  for (const placeholder of ["answer", "number", "base", "exponent", "expression", "digitCount", ...NS_DIGIT_001_MATHJAX_KEYS]) {
    assert.equal(output.explanation.lines.join("\n").includes(`{${placeholder}}`), false, placeholder);
  }
  for (const key of NS_DIGIT_001_MATHJAX_KEYS) assert.ok(output[key].length > 0, key);
}

const fullAudit = generateNsDigit001FullCoverageAudit({ countPerCp: 1000, seed: "ns-digit-001-maturity" });
for (const [cpId, report] of Object.entries(fullAudit)) {
  assert.equal(report.questionCount, 1000, cpId);
  assert.equal(report.generationFailures, 0, cpId);
  assert.equal(report.validationFailures, 0, cpId);
  assert.equal(report.traceabilityFailures, 0, cpId);
  assert.equal(report.mathJaxFailures, 0, cpId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, cpId);
  assert.equal(report.unusedExplanationIds.length, 0, cpId);
}

console.log("NS-DIGIT-001 CP-001 through CP-005 implementation passed.");

import { strict as assert } from "node:assert";
import {
  NS_LASTDIG_001_MATHJAX_KEYS,
  NS_LASTDIG_001_PIPELINES,
  cycleForBase,
  generateNsLastdig001FullCoverageAudit,
  lastDigitOfPower,
  lastDigitOfProduct,
  lastDigitOfTower,
  runNsLastdig001Cp001Pipeline,
  runNsLastdig001Cp002Pipeline,
  runNsLastdig001Cp003Pipeline,
  runNsLastdig001Cp004Pipeline,
  runNsLastdig001Cp005Pipeline,
  validateNsLastdig001Libraries,
} from "../topics/NumberSystem/subtopics/Last Digit/archetypes/NS-LASTDIG-001";

const libraryValidation = validateNsLastdig001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

assert.deepEqual(cycleForBase(7), [7, 9, 3, 1]);
assert.equal(lastDigitOfPower(7, 123), 3);
assert.equal(lastDigitOfProduct([{ base: 2, exponent: 15 }, { base: 3, exponent: 17 }]), 4);
assert.equal(lastDigitOfTower([3, 3, 3]), 7);

const cp001 = runNsLastdig001Cp001Pipeline({ questionLanguageId: "QL-045", base: 7, exponent: 123, seed: "fixture-cp001" });
assert.equal(cp001.answer, 3);
assert.ok(cp001.reasoningGraph.nodes.some((node) => node.id === "captureBaseLastDigit"));

const cp002 = runNsLastdig001Cp002Pipeline({
  questionLanguageId: "QL-050",
  powerTerms: [
    { base: 2, exponent: 15 },
    { base: 3, exponent: 17 },
  ],
  seed: "fixture-cp002",
});
assert.equal(cp002.answer, 4);
assert.ok(cp002.reasoningGraph.nodes.some((node) => node.id === "multiplyUnitDigits"));

const cp003 = runNsLastdig001Cp003Pipeline({ questionLanguageId: "QL-019", towerBases: [3, 3, 3], seed: "fixture-cp003" });
assert.equal(cp003.answer, 7);
assert.ok(cp003.reasoningGraph.nodes.some((node) => node.id === "reduceTopExponent"));

const cp004 = runNsLastdig001Cp004Pipeline({ questionLanguageId: "QL-053", base: 7, seed: "fixture-cp004" });
assert.equal(cp004.answer, "7, 9, 3, 1");
assert.ok(cp004.reasoningGraph.nodes.some((node) => node.id === "generateCycle"));

const cp005 = runNsLastdig001Cp005Pipeline({ questionLanguageId: "QL-056", base: 2, targetLastDigit: 8, options: [5, 7, 9, 10], seed: "fixture-cp005" });
assert.equal(cp005.answer, 7);
assert.equal(cp005.solver.validOptions?.length, 1);
assert.ok(cp005.reasoningGraph.nodes.some((node) => node.id === "selectUniqueAnswer"));

for (const [cpId, pipeline] of Object.entries(NS_LASTDIG_001_PIPELINES)) {
  const output = pipeline({ seed: `smoke:${cpId}` });
  assert.equal(output.canonicalProblemId, cpId);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.stem.includes("{"), false);
  for (const placeholder of ["answer", "base", "exponent", "powerProduct", "towerExpression", "targetLastDigit", "options", ...NS_LASTDIG_001_MATHJAX_KEYS]) {
    assert.equal(output.explanation.lines.join("\n").includes(`{${placeholder}}`), false, placeholder);
  }
  for (const key of NS_LASTDIG_001_MATHJAX_KEYS) assert.ok(output[key].length > 0, key);
}

const fullAudit = generateNsLastdig001FullCoverageAudit({ countPerCp: 1000, seed: "ns-lastdig-001-maturity" });
for (const [cpId, report] of Object.entries(fullAudit)) {
  assert.equal(report.questionCount, 1000, cpId);
  assert.equal(report.generationFailures, 0, cpId);
  assert.equal(report.validationFailures, 0, cpId);
  assert.equal(report.traceabilityFailures, 0, cpId);
  assert.equal(report.mathJaxFailures, 0, cpId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, cpId);
  assert.equal(report.unusedExplanationIds.length, 0, cpId);
}

console.log("NS-LASTDIG-001 CP-001 through CP-005 implementation passed.");

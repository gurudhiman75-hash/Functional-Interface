import { strict as assert } from "node:assert";
import {
  generateNsFac001FullAudit,
  NS_FAC_001_CP_001,
  NS_FAC_001_CP_002,
  NS_FAC_001_CP_003,
  NS_FAC_001_CP_004,
  NS_FAC_001_CP_005,
  NS_FAC_001_CP_006,
  NS_FAC_001_CP_007,
  NS_FAC_001_CP_008,
  NS_FAC_001_CP_009,
  NS_FAC_001_PIPELINES,
  buildFactorModel,
  factorsDivisibleBy,
  ordinalDisplay,
  runNsFac001Cp001Pipeline,
  runNsFac001Cp002Pipeline,
  runNsFac001Cp003Pipeline,
  runNsFac001Cp004Pipeline,
  runNsFac001Cp005Pipeline,
  runNsFac001Cp006Pipeline,
  runNsFac001Cp007Pipeline,
  runNsFac001Cp008Pipeline,
  runNsFac001Cp009Pipeline,
  validateNsFac001Libraries,
} from "../topics/NumberSystem/subtopics/Factors/archetypes/NS-FAC-001";

const libraryValidation = validateNsFac001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

assert.equal(ordinalDisplay(1), "1st");
assert.equal(ordinalDisplay(2), "2nd");
assert.equal(ordinalDisplay(3), "3rd");
assert.equal(ordinalDisplay(11), "11th");
assert.equal(ordinalDisplay(21), "21st");

const model360 = buildFactorModel(360, 6, 1);
assert.equal(model360.factorCount, 24);
assert.equal(model360.factorSum, 1170);
assert.equal(model360.factorProductString, 360n ** 12n + "");
assert.equal(model360.productDigitCount, model360.factorProductString.length);
assert.equal(model360.isHighlyCompositeNumber, true);
assert.ok(model360.primeFactorizationLatex.includes("\\times"));

const cp001 = runNsFac001Cp001Pipeline({ number: 360, seed: "fixture-cp001" });
assert.equal(cp001.answer, 24);

const cp002 = runNsFac001Cp002Pipeline({ number: 360, seed: "fixture-cp002" });
assert.equal(cp002.answer, 1170);

const cp003 = runNsFac001Cp003Pipeline({ number: 360, seed: "fixture-cp003" });
assert.equal(cp003.answer, model360.factorProductString);
assert.equal(typeof cp003.answer, "string");
assert.equal(cp003.productDigitCount, String(cp003.answer).length);
assert.ok(cp003.explanation.lines.join("\n").includes("Product is stored exactly as a decimal string."));

assert.equal(runNsFac001Cp004Pipeline({ number: 36, seed: "fixture-cp004-square" }).answer, "Odd");
assert.equal(runNsFac001Cp004Pipeline({ number: 18, seed: "fixture-cp004-nonsquare" }).answer, "Even");

assert.equal(runNsFac001Cp005Pipeline({ number: 18, seed: "fixture-cp005-composite" }).answer, 9);
assert.equal(runNsFac001Cp005Pipeline({ number: 17, seed: "fixture-cp005-prime" }).answer, 1);

const cp006 = runNsFac001Cp006Pipeline({ number: 360, k: 6, seed: "fixture-cp006" });
assert.equal(cp006.answer, factorsDivisibleBy(model360.factorList, 6).length);
assert.equal(cp006.validation.valid, true);

const cp007 = runNsFac001Cp007Pipeline({ number: 360, k: 6, seed: "fixture-cp007" });
assert.equal(cp007.answer, model360.factorCount - Number(cp006.answer));
assert.equal(cp007.solver.notDivisibleFactorCount, model360.factorCount - cp007.solver.divisibleFactors.length);
assert.ok(cp007.reasoningGraph.nodes.some((node) => node.type === "Complement Counting"));

assert.throws(() => runNsFac001Cp006Pipeline({ number: 360, k: 7, seed: "invalid-k-cp006" }));
assert.throws(() => runNsFac001Cp007Pipeline({ number: 360, k: 7, seed: "invalid-k-cp007" }));

const cp008First = runNsFac001Cp008Pipeline({ number: 360, position: 1, seed: "fixture-cp008-first" });
assert.equal(cp008First.answer, 1);
assert.equal(cp008First.ordinalDisplay, "1st");
assert.equal(cp008First.stem.includes("1th"), false);

const cp008Last = runNsFac001Cp008Pipeline({ number: 360, position: 24, seed: "fixture-cp008-last" });
assert.equal(cp008Last.answer, 360);

const cp009First = runNsFac001Cp009Pipeline({ number: 360, position: 1, seed: "fixture-cp009-first" });
assert.equal(cp009First.answer, 360);

const cp009Last = runNsFac001Cp009Pipeline({ number: 360, position: 24, seed: "fixture-cp009-last" });
assert.equal(cp009Last.answer, 1);

const pipelineCases = [
  { id: NS_FAC_001_CP_001, run: runNsFac001Cp001Pipeline },
  { id: NS_FAC_001_CP_002, run: runNsFac001Cp002Pipeline },
  { id: NS_FAC_001_CP_003, run: runNsFac001Cp003Pipeline },
  { id: NS_FAC_001_CP_004, run: runNsFac001Cp004Pipeline },
  { id: NS_FAC_001_CP_005, run: runNsFac001Cp005Pipeline },
  { id: NS_FAC_001_CP_006, run: runNsFac001Cp006Pipeline },
  { id: NS_FAC_001_CP_007, run: runNsFac001Cp007Pipeline },
  { id: NS_FAC_001_CP_008, run: runNsFac001Cp008Pipeline },
  { id: NS_FAC_001_CP_009, run: runNsFac001Cp009Pipeline },
] as const;

for (const testCase of pipelineCases) {
  const output = testCase.run({ seed: `ns-fac-001-smoke:${testCase.id}` });
  assert.equal(output.canonicalProblemId, testCase.id);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.questionId, output.parameters.questionId);
  assert.ok(output.questionLanguageId.startsWith("QL-"));
  assert.ok(output.explanationStyleId.startsWith("ES-"));
  assert.equal(output.explanation.graphId, output.reasoningGraph.graphId);
  assert.ok(output.reasoningGraph.nodes.some((node) => node.type === "Answer Extraction"));
  assert.equal(output.traceability.answer, output.answer);
  assert.equal(output.traceability.productDigitCount, output.productDigitCount);
  assert.equal(output.traceability.graphId, output.reasoningGraph.graphId);
  assert.equal(output.stem.includes("{"), false);
  const explanationText = output.explanation.lines.join("\n");
  for (const placeholder of [
    "number",
    "answer",
    "k",
    "position",
    "ordinalDisplay",
    "primeFactorizationLatex",
    "factorCountFormulaLatex",
    "factorSumFormulaLatex",
    "factorProductFormulaLatex",
    "perfectSquareRuleLatex",
    "factorListLatex",
    "orderedFactorListLatex",
    "divisibleFactorConstraintLatex",
    "complementFormulaLatex",
  ]) {
    assert.equal(explanationText.includes(`{${placeholder}}`), false, placeholder);
  }
  assert.ok(output.primeFactorizationLatex.length > 0);
  assert.ok(output.factorProductFormulaLatex.length > 0);
}

assert.deepEqual(Object.keys(NS_FAC_001_PIPELINES), ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007", "CP-008", "CP-009"]);

const fullAudit = generateNsFac001FullAudit({ countPerCp: 1000, seed: "ns-fac-001-final-audit" });
for (const [canonicalProblemId, report] of Object.entries(fullAudit)) {
  assert.equal(report.questionCount, 1000, canonicalProblemId);
  assert.equal(report.generationFailures, 0, canonicalProblemId);
  assert.equal(report.validationFailures, 0, canonicalProblemId);
  assert.equal(report.traceabilityFailures, 0, canonicalProblemId);
  assert.equal(report.mathJaxFailures, 0, canonicalProblemId);
  assert.equal(report.bigIntSerializationFailures, 0, canonicalProblemId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, canonicalProblemId);
  assert.equal(report.unusedExplanationIds.length, 0, canonicalProblemId);
  assert.ok((report.primeInputCoverage.true ?? 0) > 0, canonicalProblemId);
  assert.ok((report.compositeInputCoverage.true ?? 0) > 0, canonicalProblemId);
  assert.ok((report.highlyCompositeNumberCoverage.true ?? 0) > 0, canonicalProblemId);
  assert.ok(Object.values(report.mathJaxObjectCoverage).every((count) => count === 1000), canonicalProblemId);
  if (canonicalProblemId === NS_FAC_001_CP_008 || canonicalProblemId === NS_FAC_001_CP_009) {
    for (const key of ["first", "second", "middle", "penultimate", "last", "general"]) {
      assert.ok((report.edgePositionCoverage[key] ?? 0) > 0, `${canonicalProblemId}:${key}`);
    }
  }
  if (canonicalProblemId === NS_FAC_001_CP_003) {
    assert.ok(Object.keys(report.productDigitCountCoverage).length > 0, canonicalProblemId);
  }
}

console.log("NS-FAC-001 CP-001 through CP-009 implementation passed.");

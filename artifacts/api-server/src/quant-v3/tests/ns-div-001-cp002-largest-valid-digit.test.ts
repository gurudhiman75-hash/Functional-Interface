import { strict as assert } from "node:assert";
import {
  auditNsDiv001Cp002Batch,
  containsForbiddenLanguage,
  FORBIDDEN_EXPLANATION_LANGUAGE,
  FORBIDDEN_STEM_LANGUAGE,
  generateCp002Parameters,
  getNsDiv001AllowedStructures,
  getNsDiv001ApprovedDivisorCapabilities,
  runNsDiv001Cp002Pipeline,
} from "../topics/NumberSystem/subtopics/Divisibility/archetypes/NS-DIV-001";

const expectedCp002NodeTypes = [
  "Recognize Divisor",
  "Select Divisibility Rule",
  "Generate Candidate Digit Set",
  "Evaluate Candidates",
  "Build Valid Digit Set",
  "Select Largest Valid Digit",
  "Verify Result",
];

function assertCp002Package(questionPackage: ReturnType<typeof runNsDiv001Cp002Pipeline>) {
  const answerNode = questionPackage.reasoningGraph.nodes.find((node) => node.id === questionPackage.reasoningGraph.answerNodeId);
  const validDigitsFromEvaluation = questionPackage.solver.candidateEvaluations.filter((entry) => entry.isValid).map((entry) => entry.candidate);

  assert.equal(questionPackage.archetypeId, "NS-DIV-001");
  assert.equal(questionPackage.canonicalProblemId, "CP-002");
  assert.equal(questionPackage.validation.valid, true);
  assert.deepEqual(
    questionPackage.reasoningGraph.nodes.map((node) => node.type),
    expectedCp002NodeTypes,
  );
  assert.equal(questionPackage.reasoningGraph.nodes.length, 7);
  assert.deepEqual(questionPackage.solver.validDigitSet, validDigitsFromEvaluation);
  assert.equal(questionPackage.solver.validDigitSet.length >= 1, true);
  assert.deepEqual(questionPackage.solver.sortedValidDigitSet, [...questionPackage.solver.validDigitSet].sort((left, right) => left - right));
  assert.equal(questionPackage.solver.largestValidDigit, Math.max(...questionPackage.solver.validDigitSet));
  assert.equal(questionPackage.answer, questionPackage.solver.answerDigit);
  assert.equal(answerNode?.outputs.answerDigit, questionPackage.answer);
  assert.equal(questionPackage.explanation.lines.join("\n").includes(String(questionPackage.answer)), true);
  assert.equal(questionPackage.solver.resolvedNumber % questionPackage.parameters.divisor, 0);
  assert.deepEqual(containsForbiddenLanguage(questionPackage.stem, FORBIDDEN_STEM_LANGUAGE), []);
  assert.deepEqual(containsForbiddenLanguage(questionPackage.explanation.lines.join("\n"), FORBIDDEN_EXPLANATION_LANGUAGE), []);
}

const supportedPositionCases = [
  { name: "4-digit first missing", numberExpression: "x724", divisor: 3 },
  { name: "4-digit middle missing", numberExpression: "72x4", divisor: 3 },
  { name: "4-digit last missing", numberExpression: "724x", divisor: 2 },
  { name: "5-digit first missing", numberExpression: "x7384", divisor: 2 },
  { name: "5-digit middle missing", numberExpression: "83x96", divisor: 3 },
  { name: "5-digit last missing", numberExpression: "8396x", divisor: 2 },
  { name: "6-digit first missing", numberExpression: "x72849", divisor: 3 },
  { name: "6-digit middle missing position 2", numberExpression: "7x2849", divisor: 3 },
  { name: "6-digit middle missing position 3", numberExpression: "72x849", divisor: 3 },
  { name: "6-digit middle missing position 4", numberExpression: "728x49", divisor: 3 },
  { name: "6-digit middle missing position 5", numberExpression: "7284x9", divisor: 3 },
  { name: "6-digit last missing", numberExpression: "72849x", divisor: 2 },
];

for (const testCase of supportedPositionCases) {
  const questionPackage = runNsDiv001Cp002Pipeline({
    seed: testCase.name,
    numberExpression: testCase.numberExpression,
    divisor: testCase.divisor,
  });
  assertCp002Package(questionPackage);
}

const approvedStructures = getNsDiv001AllowedStructures();
assert.equal(approvedStructures.some((structure) => structure.length === 4 && structure.indexOf("x") === 0), true);
assert.equal(approvedStructures.some((structure) => structure.length === 6), true);

const approvedDivisors = getNsDiv001ApprovedDivisorCapabilities("CP-002").map((entry) => entry.divisor);
const divisorOutputs = approvedDivisors.map((divisor) => runNsDiv001Cp002Pipeline({ seed: `cp-002-divisor-${divisor}`, divisor }));
assert.deepEqual(
  divisorOutputs.map((output) => output.parameters.divisor).sort((left, right) => left - right),
  [...approvedDivisors].sort((left, right) => left - right),
);
divisorOutputs.forEach(assertCp002Package);

const largestDigitCases = [
  { largest: 9, numberExpression: "x24", divisor: 2, validDigitSet: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
  { largest: 8, numberExpression: "x24", divisor: 8, validDigitSet: [2, 4, 6, 8] },
  { largest: 7, numberExpression: "8x396", divisor: 3, validDigitSet: [1, 4, 7] },
  { largest: 0, numberExpression: "24x", divisor: 10, validDigitSet: [0] },
];

for (const testCase of largestDigitCases) {
  const questionPackage = runNsDiv001Cp002Pipeline({
    seed: `largest-${testCase.largest}`,
    numberExpression: testCase.numberExpression,
    divisor: testCase.divisor,
  });
  assertCp002Package(questionPackage);
  assert.equal(questionPackage.answer, testCase.largest);
  assert.deepEqual(questionPackage.solver.validDigitSet, testCase.validDigitSet);
}

const firstPositionParameters = generateCp002Parameters({ numberExpression: "x7384", divisor: 2 });
assert.deepEqual(firstPositionParameters.candidateDomain, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
assert.throws(() => generateCp002Parameters({ numberExpression: "x24", divisor: 5 }), /non-empty valid digit set/);

const audit = auditNsDiv001Cp002Batch([...divisorOutputs, ...largestDigitCases.map((testCase) => {
  return runNsDiv001Cp002Pipeline({
    seed: `audit-largest-${testCase.largest}`,
    numberExpression: testCase.numberExpression,
    divisor: testCase.divisor,
  });
})]);

assert.equal(audit.questionCount, divisorOutputs.length + largestDigitCases.length);
assert.ok(Object.keys(audit.largestDigitDistribution).length > 0);
assert.ok(Object.keys(audit.validSetSizeDistribution).length > 0);
assert.ok(Object.keys(audit.divisorDistribution).length > 0);
assert.ok(Object.keys(audit.patternDistribution).length > 0);
assert.ok(Object.keys(audit.explanationStyleDistribution).length > 0);
assert.equal(audit.failureReporting.validationFailureCount, 0);

console.log("NS-DIV-001 CP-002 largest valid digit passed.");

import { strict as assert } from "node:assert";
import {
  auditNsDiv001ValidDigitSetBatch,
  runNsDiv001Cp003Pipeline,
  runNsDiv001Cp004Pipeline,
  runNsDiv001Cp005Pipeline,
  runNsDiv001Cp006Pipeline,
  runNsDiv001Cp007Pipeline,
  validateNsDiv001RealismLibraries,
} from "../topics/NumberSystem/subtopics/Divisibility/archetypes/NS-DIV-001";

const libraryValidation = validateNsDiv001RealismLibraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));

const exampleInput = { numberExpression: "7x2", divisor: 3 };
const cp003Example = runNsDiv001Cp003Pipeline(exampleInput);
const cp004Example = runNsDiv001Cp004Pipeline(exampleInput);
const cp005Example = runNsDiv001Cp005Pipeline(exampleInput);
const cp006Example = runNsDiv001Cp006Pipeline(exampleInput);
const cp007Example = runNsDiv001Cp007Pipeline(exampleInput);

assert.deepEqual(cp003Example.solver.validDigitSet, [0, 3, 6, 9]);
assert.equal(cp003Example.answer, 0);
assert.equal(cp004Example.answer, 4);
assert.equal(cp005Example.answer, 18);
assert.equal(cp006Example.answer, 792);
assert.equal(cp007Example.answer, 702);

const pipelineCases = [
  { id: "CP-003", run: runNsDiv001Cp003Pipeline, extractionNode: "Minimum Selection", answerNode: "Answer Production" },
  { id: "CP-004", run: runNsDiv001Cp004Pipeline, extractionNode: "Counting", answerNode: "Answer Production" },
  { id: "CP-005", run: runNsDiv001Cp005Pipeline, extractionNode: "Summation", answerNode: "Answer Production" },
  { id: "CP-006", run: runNsDiv001Cp006Pipeline, extractionNode: "Maximum Selection", answerNode: "Number Formation" },
  { id: "CP-007", run: runNsDiv001Cp007Pipeline, extractionNode: "Minimum Selection", answerNode: "Number Formation" },
] as const;

const outputs = pipelineCases.flatMap((testCase) => {
  return Array.from({ length: 25 }, (_, index) => testCase.run({ seed: `valid-digit-set-${testCase.id}-${index}` }));
});

for (const testCase of pipelineCases) {
  const sample = testCase.run({ seed: `graph-check-${testCase.id}` });
  assert.equal(sample.canonicalProblemId, testCase.id);
  assert.equal(sample.validation.valid, true);
  assert.deepEqual(
    sample.reasoningGraph.nodes.map((node) => node.type),
    [
      "Problem Recognition",
      "Divisor Recognition",
      "Rule Selection",
      "Candidate Generation",
      "Valid Digit Identification",
      testCase.extractionNode,
      testCase.answerNode,
    ],
  );
  assert.ok(sample.questionId);
  assert.equal(sample.questionId, sample.parameters.questionId);
  assert.equal(sample.patternId, sample.parameters.patternId);
  assert.equal(sample.instanceId, sample.parameters.instanceId);
  assert.ok(sample.stemFamilyId.startsWith("SF-"));
  assert.equal(sample.questionLanguageId, sample.stemFamilyId);
  assert.ok(sample.explanation.styleId.startsWith("EX-"));
  assert.ok(sample.explanation.lines.join("\n").includes(sample.solver.validDigitSet.join(", ")));
  assert.ok(sample.explanation.lines.join("\n").includes(String(sample.answer)));
}

assert.equal(outputs.length, 125);
assert.equal(outputs.every((output) => output.validation.valid), true);

const audit = auditNsDiv001ValidDigitSetBatch(outputs);
assert.equal(audit.questionCount, 125);
assert.equal(audit.validationFailureCount, 0);
assert.equal(audit.traceabilityFailureCount, 0);
assert.ok(Object.keys(audit.patternDistribution).length > 0);
assert.ok(Object.keys(audit.instanceDistribution).length > 0);
assert.ok(Object.keys(audit.divisorDistribution).length > 0);
assert.ok(Object.keys(audit.answerDistribution).length > 0);
assert.ok(Object.keys(audit.stemFamilyDistribution).length > 0);
assert.ok(Object.keys(audit.explanationStyleDistribution).length > 0);
assert.ok(Object.keys(audit.validDigitSetDistribution).length > 0);

console.log("NS-DIV-001 CP-003 to CP-007 valid digit set passed.");

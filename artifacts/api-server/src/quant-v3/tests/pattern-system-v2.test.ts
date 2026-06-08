import { strict as assert } from "node:assert";
import fixtures from "../topics/NumberSystem/subtopics/Divisibility/archetypes/NS-DIV-001/fixtures/fixed-template-fixtures.json";
import {
  auditNsDiv001PatternSystemV2Batch,
  generateNsDiv001StructuralInstance,
  getNsDiv001StructuralPatterns,
  runNsDiv001Cp001Pipeline,
  runNsDiv001Cp002Pipeline,
  validateNsDiv001StructuralInstance,
  validateNsDiv001StructuralPatternLibrary,
} from "../topics/NumberSystem/subtopics/Divisibility/archetypes/NS-DIV-001";

const structuralLibraryValidation = validateNsDiv001StructuralPatternLibrary();
assert.equal(structuralLibraryValidation.valid, true);
assert.deepEqual(structuralLibraryValidation.failures, []);

const structuralPatterns = getNsDiv001StructuralPatterns();
assert.equal(structuralPatterns.length, 18);
assert.deepEqual(
  structuralPatterns.map((pattern) => pattern.patternId),
  [
    "SP-3-1",
    "SP-3-2",
    "SP-3-3",
    "SP-4-1",
    "SP-4-2",
    "SP-4-3",
    "SP-4-4",
    "SP-5-1",
    "SP-5-2",
    "SP-5-3",
    "SP-5-4",
    "SP-5-5",
    "SP-6-1",
    "SP-6-2",
    "SP-6-3",
    "SP-6-4",
    "SP-6-5",
    "SP-6-6",
  ],
);

for (const pattern of structuralPatterns) {
  const instance = generateNsDiv001StructuralInstance({
    canonicalProblemId: "CP-001",
    seed: `pattern-system-v2-${pattern.patternId}`,
    patternId: pattern.patternId,
  });
  assert.equal(instance.patternId, pattern.patternId);
  assert.equal(instance.numberExpression.length, pattern.length);
  assert.equal(instance.missingPosition, pattern.missingPosition);
  assert.equal(instance.numberExpression.indexOf("x") + 1, pattern.missingPosition);
  assert.equal(validateNsDiv001StructuralInstance({ patternId: instance.patternId, instance: instance.numberExpression }).valid, true);
}

const cp001Outputs = Array.from({ length: 50 }, (_, index) => runNsDiv001Cp001Pipeline({ seed: `pattern-v2-cp001-${index}` }));
const cp002Outputs = Array.from({ length: 50 }, (_, index) => runNsDiv001Cp002Pipeline({ seed: `pattern-v2-cp002-${index}` }));

for (const output of [...cp001Outputs, ...cp002Outputs]) {
  assert.equal(output.validation.valid, true);
  assert.ok(output.questionId);
  assert.ok(output.patternId);
  assert.ok(output.instanceId);
  assert.equal(output.questionId, output.parameters.questionId);
  assert.equal(output.patternId, output.parameters.patternId);
  assert.equal(output.instanceId, output.parameters.instanceId);
  assert.equal(validateNsDiv001StructuralInstance({ patternId: output.patternId, instance: output.parameters.numberExpression }).valid, true);
}

assert.ok(cp001Outputs.every((output) => output.canonicalProblemId === "CP-001"));
assert.ok(cp002Outputs.every((output) => output.canonicalProblemId === "CP-002"));

const audit = auditNsDiv001PatternSystemV2Batch([...cp001Outputs, ...cp002Outputs]);
assert.equal(audit.questionCount, 100);
assert.ok(Object.keys(audit.patternDistribution).length > 0);
assert.ok(Object.keys(audit.instanceDistribution).length > 0);
assert.deepEqual(audit.questionDistribution, { "CP-001": 50, "CP-002": 50 });
assert.equal(audit.validationFailureCount, 0);
assert.equal(audit.traceabilityFailureCount, 0);

assert.deepEqual(fixtures.roles, ["Regression Fixtures", "Audit Fixtures", "Reference Examples", "Solver Validation Cases"]);
assert.ok(fixtures.templates.includes("72849x"));
assert.ok(fixtures.templates.includes("57x28"));
assert.ok(fixtures.templates.includes("83x96"));

console.log("NS-DIV-001 Pattern System V2 passed.");

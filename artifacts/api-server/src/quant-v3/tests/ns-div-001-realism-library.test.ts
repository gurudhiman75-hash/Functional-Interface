import { strict as assert } from "node:assert";
import {
  assertNsDiv001BatchRealism,
  auditNsDiv001BatchRealism,
  getNsDiv001ExplanationStyles,
  getNsDiv001QuestionLanguageFamilies,
  runNsDiv001Cp001Pipeline,
  validateNsDiv001RealismLibraries,
} from "../topics/NumberSystem/subtopics/Divisibility/archetypes/NS-DIV-001";

const libraryValidation = validateNsDiv001RealismLibraries();
assert.equal(libraryValidation.valid, true);
assert.deepEqual(libraryValidation.failures, []);
assert.equal(getNsDiv001QuestionLanguageFamilies().length, 6);
assert.deepEqual(
  getNsDiv001ExplanationStyles().map((style) => [style.id, style.name, style.defaultUsageTarget]),
  [
    ["ES-001", "Teacher Style", "70%"],
    ["ES-002", "Short Exam Style", "20%"],
    ["ES-003", "Detailed Teaching Style", "10%"],
  ],
);

const outputs = Array.from({ length: 100 }, (_, index) => {
  return runNsDiv001Cp001Pipeline({ seed: `phase-9-realism-test-${index}` });
});

const audit = auditNsDiv001BatchRealism(outputs);
assert.equal(audit.batchSize, 100);
assert.ok(Object.keys(audit.distributions.answerDistribution).length > 0);
assert.ok(Object.keys(audit.distributions.divisorDistribution).length > 0);
assert.ok(Object.keys(audit.distributions.positionDistribution).length > 0);
assert.ok(Object.keys(audit.distributions.stemFamilyDistribution).length > 0);
assert.ok(Object.keys(audit.distributions.explanationVariantDistribution).length > 0);
assert.ok(Object.keys(audit.distributions.styleUsageDistribution).length > 0);
assert.equal(audit.auditContract.questionCount, 100);
assert.ok(Object.keys(audit.auditContract.stemFamilyDistribution).length > 0);
assert.ok(Object.keys(audit.auditContract.explanationVariantDistribution).length > 0);
assert.ok(Object.keys(audit.auditContract.styleUsageDistribution).length > 0);
assert.equal(audit.auditContract.es001Count + audit.auditContract.es002Count + audit.auditContract.es003Count, 100);
assert.ok(Object.keys(audit.auditContract.answerDistribution).length > 0);
assert.ok(Object.keys(audit.auditContract.divisorDistribution).length > 0);
assert.ok(Object.keys(audit.auditContract.missingPositionDistribution).length > 0);
assert.equal(typeof audit.auditContract.validationFailureCount, "number");
assert.equal(typeof audit.auditContract.languageFailureCount, "number");
assert.equal(typeof audit.auditContract.realismFailureCount, "number");
assert.equal(audit.valid, false);
assert.throws(() => assertNsDiv001BatchRealism(outputs), /distribution rules/);

console.log("NS-DIV-001 realism library enforcement passed.");

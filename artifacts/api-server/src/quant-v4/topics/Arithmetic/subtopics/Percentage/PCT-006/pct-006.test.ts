import { strict as assert } from "node:assert";
import {
  auditPct006Packages,
  generatePct006Batch,
  getAnswerType,
  getQuestionEntry,
  getRequiredVariables,
  getSolveMode,
  getTaskKind,
  runPct006ForLanguages,
  runPct006Pipeline,
  solvePct006,
  validatePct006Libraries,
} from "./index";
import { PCT_006_ARCHETYPE_ID, PCT_006_CP_IDS, type Pct006CanonicalProblemId, type Pct006Parameters, type Pct006Variables } from "./types";

function explanationIdFor(cpId: Pct006CanonicalProblemId) {
  return `PCT-ES-${String(PCT_006_CP_IDS.indexOf(cpId) + 1).padStart(3, "0")}`;
}

function buildParams(cpId: Pct006CanonicalProblemId, qlId: string, variables: Pct006Variables): Pct006Parameters {
  return {
    archetypeId: PCT_006_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${qlId}:fixed`,
    questionLanguageId: qlId,
    explanationId: explanationIdFor(cpId),
    language: "en",
    difficultyBand: getQuestionEntry(cpId, qlId, "en").difficulty,
    taskKind: getTaskKind(cpId, qlId),
    solveMode: getSolveMode(cpId, qlId),
    answerType: getAnswerType(cpId, qlId),
    requiredVariables: getRequiredVariables(cpId, qlId),
    variables,
    sourceTrace: {
      questionLanguageSource: "question-language.en.json",
      explanationSource: "explanation.en.json",
      variableRangeSource: "variable-ranges.library.json",
    },
  };
}

function assertFixed(cpId: Pct006CanonicalProblemId, qlId: string, variables: Pct006Variables, expected: string) {
  const result = solvePct006(buildParams(cpId, qlId, variables));
  assert.equal(result.answer, expected, `${cpId}:${qlId} answer mismatch`);
}

const libraryValidation = validatePct006Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

assert.deepEqual(PCT_006_CP_IDS, [
  "PCT-CP-001",
  "PCT-CP-002",
  "PCT-CP-003",
  "PCT-CP-004",
  "PCT-CP-005",
  "PCT-CP-006",
  "PCT-CP-007",
  "PCT-CP-008",
  "PCT-CP-009",
  "PCT-CP-010",
]);

assertFixed("PCT-CP-001", "PCT-QL-001", { percentageRate: 20, baseValue: 100, wholeLabel: "salary", valuePrefix: "Rs. ", unitLabel: "" }, "$$120$$");
assertFixed("PCT-CP-001", "PCT-QL-011", { percentageRate: 25, baseValue: 150, wholeLabel: "salary", valuePrefix: "Rs. ", unitLabel: "" }, "$$120$$");
assertFixed("PCT-CP-002", "PCT-QL-051", { percentageRate: 20, baseValue: 100, wholeLabel: "salary", valuePrefix: "Rs. ", unitLabel: "" }, "$$80$$");
assertFixed("PCT-CP-002", "PCT-QL-061", { percentageRate: 25, baseValue: 75, wholeLabel: "salary", valuePrefix: "Rs. ", unitLabel: "" }, "$$100$$");
assertFixed("PCT-CP-003", "PCT-QL-101", { percentageRate: 25 }, "$$20\\%$$");
assertFixed("PCT-CP-003", "PCT-QL-111", { percentageRate: 20 }, "$$25\\%$$");
assertFixed("PCT-CP-004", "PCT-QL-151", { value1: 100, value2: 125 }, "$$25\\%$$");
assertFixed("PCT-CP-004", "PCT-QL-161", { value1: 100, value2: 125 }, "$$20\\%$$");
assertFixed("PCT-CP-005", "PCT-QL-201", { ratioA: 5, ratioB: 4 }, "$$25\\%$$");
assertFixed("PCT-CP-005", "PCT-QL-211", { ratioA: 5, ratioB: 4 }, "$$20\\%$$");
assertFixed("PCT-CP-006", "PCT-QL-251", { value1: 80, value2: 100 }, "$$25\\%$$");
assertFixed("PCT-CP-006", "PCT-QL-261", { value1: 100, value2: 80 }, "$$20\\%$$");
assertFixed("PCT-CP-007", "PCT-QL-302", { subjectA: "Riya", subjectB: "Karan", value1: 100, value2: 80, rate1: 20, rate2: 25, wholeLabel: "marks", valuePrefix: "", unitLabel: "marks" }, "Riya is greater by 20 marks.");
assertFixed("PCT-CP-007", "PCT-QL-321", { subjectA: "Aman", subjectB: "Bharat", value1: 1000, value2: 1000, rate1: 20, rate2: 10, wholeLabel: "salary", valuePrefix: "Rs. ", unitLabel: "" }, "Aman is greater by Rs. 300.");
assertFixed("PCT-CP-008", "PCT-QL-351", { subjectA: "Aman", subjectB: "Bharat", subjectC: "Charan", rate1: 20, rate2: 25, wholeLabel: "salary", valuePrefix: "Rs. ", unitLabel: "" }, "Aman is 10% less than Charan.");
assertFixed("PCT-CP-008", "PCT-QL-361", { subjectA: "Riya", subjectB: "Karan", subjectC: "Meera", rate1: 20, rate2: 25, wholeLabel: "marks", valuePrefix: "", unitLabel: "marks" }, "Riya and Meera are equal.");
assertFixed("PCT-CP-009", "PCT-QL-401", { oldRate: 40, newRate: 50 }, "10 percentage points");
assertFixed("PCT-CP-009", "PCT-QL-411", { oldRate: 40, newRate: 50 }, "$$25\\%$$");
assertFixed("PCT-CP-010", "PCT-QL-451", { subjectA: "Aman", subjectB: "Bharat", rate1: 60, baseValue1: 500, rate2: 70, baseValue2: 400, wholeLabel: "salary", valuePrefix: "Rs. ", unitLabel: "" }, "Aman is greater by Rs. 20.");
assertFixed("PCT-CP-010", "PCT-QL-462", { subjectA: "Riya", subjectB: "Karan", rate1: 60, baseValue1: 500, rate2: 70, baseValue2: 400, wholeLabel: "marks", valuePrefix: "", unitLabel: "marks" }, "$$20$$");

for (let index = 0; index < 40; index += 1) {
  const pkg = runPct006Pipeline("PCT-CP-010", { language: "en", seed: `pct-006-cross-base:${index}` });
  const unitLabel = String(pkg.parameters.variables.unitLabel ?? "");
  if (["marks", "people", "units", "students", "items", "passengers"].includes(unitLabel)) {
    const actual1 = Number(pkg.solver.evidence.actual1 ?? NaN);
    const actual2 = Number(pkg.solver.evidence.actual2 ?? NaN);
    const difference = Number(pkg.solver.evidence.difference ?? NaN);
    assert.ok(Number.isInteger(actual1), `cross-base actual1 must be integer for ${unitLabel}`);
    assert.ok(Number.isInteger(actual2), `cross-base actual2 must be integer for ${unitLabel}`);
    assert.ok(Number.isInteger(difference), `cross-base difference must be integer for ${unitLabel}`);
  }
}

for (let index = 0; index < 40; index += 1) {
  const pkg = runPct006Pipeline("PCT-CP-007", { language: "en", seed: `pct-006-final-compare:${index}` });
  const unitLabel = String(pkg.parameters.variables.unitLabel ?? "");
  if (["marks", "people", "units", "students", "items", "passengers"].includes(unitLabel)) {
    const final1 = Number(pkg.solver.evidence.final1 ?? NaN);
    const final2 = Number(pkg.solver.evidence.final2 ?? NaN);
    const difference = Number(pkg.solver.evidence.difference ?? NaN);
    assert.ok(Number.isInteger(final1), `final1 must be integer for ${unitLabel}`);
    assert.ok(Number.isInteger(final2), `final2 must be integer for ${unitLabel}`);
    assert.ok(Number.isInteger(difference), `final comparison difference must be integer for ${unitLabel}`);
  }
}

const batch = generatePct006Batch(500, "en");
const audit = auditPct006Packages(batch);

assert.equal(batch.length, 500);
assert.equal(audit.generationFailures, 0);
assert.equal(audit.validationFailures, 0);
assert.equal(audit.renderFailures, 0);
assert.equal(audit.solverFailures, 0);
assert.equal(Object.keys(audit.cpCoverage).length, 10);
assert.equal(Object.keys(audit.qlCoverage).length, 500);
assert.equal(Object.keys(audit.esCoverage).length, 10);
assert.equal(audit.unusedQlIds.length, 0);
assert.equal(audit.unusedEsIds.length, 0);
assert.equal(audit.crossLanguageConsistencyFailures, 0);
assert.equal(audit.libraryValidationFailures.length, 0);

for (const cpId of PCT_006_CP_IDS) {
  assert.equal(runPct006ForLanguages(cpId, { seed: `pct-006-triplet:${cpId}` }).length, 3, `${cpId} must expose three language packages`);
}

for (let index = 0; index < 20; index += 1) {
  const cpId = PCT_006_CP_IDS[index % PCT_006_CP_IDS.length]!;
  const pkg = runPct006Pipeline(cpId, { language: "en", seed: `pct-006-foundation:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.ok(pkg.explanation.lines.length >= 4, "Explanation must expose statement/math pairs.");
  assert.ok(pkg.explanation.lines.every((line, lineIndex) => lineIndex % 2 === 0 || line.includes("\\Rightarrow")));
}

console.log("PCT-006 implementation test passed.");

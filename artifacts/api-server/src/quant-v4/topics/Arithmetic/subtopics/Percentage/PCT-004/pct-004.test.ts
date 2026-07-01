import { strict as assert } from "node:assert";
import {
  auditPct004Packages,
  generatePct004Batch,
  getAnswerType,
  getCommonQuestionLanguageIds,
  getQuestionEntry,
  getRequiredVariables,
  getTaskKind,
  runPct004ForLanguages,
  runPct004Pipeline,
  solvePct004,
  validatePct004Libraries,
} from "./index";
import { PCT_004_ARCHETYPE_ID, PCT_004_CP_IDS, type Pct004CanonicalProblemId, type Pct004Parameters, type Pct004Variables } from "./types";

function buildParams(cpId: Pct004CanonicalProblemId, qlId: string, variables: Pct004Variables): Pct004Parameters {
  return {
    archetypeId: PCT_004_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${qlId}:fixed`,
    questionLanguageId: qlId,
    explanationId: `PCT-ES-${cpId.slice(-3)}`,
    language: "en",
    difficultyBand: getQuestionEntry(cpId, qlId, "en").difficulty,
    taskKind: getTaskKind(cpId, qlId),
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

function assertFixed(cpId: Pct004CanonicalProblemId, qlId: string, variables: Pct004Variables, expected: string) {
  const result = solvePct004(buildParams(cpId, qlId, variables));
  assert.equal(result.answer, expected, `${cpId}:${qlId} answer mismatch`);
}

const libraryValidation = validatePct004Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

assert.deepEqual(PCT_004_CP_IDS, [
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

assertFixed("PCT-CP-001", "PCT-QL-001", { originalValue: 50000, decreaseRate: 20, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$40000$$");
assertFixed("PCT-CP-001", "PCT-QL-002", { originalValue: 8000, decreaseRate: 10, wholeLabel: "population" }, "$$7200$$");
assertFixed("PCT-CP-002", "PCT-QL-003", { originalValue: 50000, decreaseRate: 12, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$6000$$");
assertFixed("PCT-CP-002", "PCT-QL-004", { originalValue: 800, decreaseRate: 25, wholeLabel: "production" }, "$$200$$");
assertFixed("PCT-CP-003", "PCT-QL-005", { decreasedValue: 480, decreaseRate: 20, wholeLabel: "value" }, "$$600$$");
assertFixed("PCT-CP-003", "PCT-QL-006", { decreasedValue: 15000, decreaseRate: 25, wholeLabel: "population" }, "$$20000$$");
assertFixed("PCT-CP-004", "PCT-QL-007", { decreaseRate: 20, wholeLabel: "salary" }, "$$0.8$$");
assertFixed("PCT-CP-004", "PCT-QL-008", { decreaseRate: 25, wholeLabel: "inventory" }, "$$0.75$$");
assertFixed("PCT-CP-005", "PCT-QL-009", { originalValue: 40000, rate1: 15, rate2: 10, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$30600$$");
assertFixed("PCT-CP-005", "PCT-QL-010", { originalValue: 1000, rate1: 10, rate2: 20, wholeLabel: "population" }, "$$720$$");
assertFixed("PCT-CP-006", "PCT-QL-011", { rate1: 10, rate2: 20, wholeLabel: "price" }, "$$28\\%$$");
assertFixed("PCT-CP-006", "PCT-QL-012", { rate1: 15, rate2: 15, wholeLabel: "attendance" }, "$$27.75\\%$$");
assertFixed("PCT-CP-007", "PCT-QL-013", { originalA: 40000, rateA: 15, labelA: "salary A", originalB: 30000, rateB: 10, labelB: "salary B", valuePrefix: "Rs. " }, "$$7000$$");
assertFixed("PCT-CP-007", "PCT-QL-014", { originalA: 600, rateA: 20, labelA: "production A", originalB: 500, rateB: 10, labelB: "production B" }, "$$30$$");
assertFixed("PCT-CP-008", "PCT-QL-015", { totalValue: 200, partRate: 40, partDecreaseRate: 10, otherDecreaseRate: 20, wholeLabel: "students", partLabel: "boys", otherLabel: "girls" }, "$$42.8571\\%$$");
assertFixed("PCT-CP-008", "PCT-QL-016", { totalValue: 400, partRate: 50, partDecreaseRate: 20, otherDecreaseRate: 10, wholeLabel: "workers", partLabel: "urban workers", otherLabel: "rural workers" }, "$$47.0588\\%$$");
assertFixed("PCT-CP-009", "PCT-QL-017", { currentValue: 50000, targetValue: 40000, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$20\\%$$");
assertFixed("PCT-CP-009", "PCT-QL-018", { currentValue: 800, targetValue: 600, wholeLabel: "production" }, "$$25\\%$$");
assertFixed("PCT-CP-010", "PCT-QL-019", { currentValue: 1000, decreaseRate: 10, periodCount: 2, wholeLabel: "inventory" }, "$$810$$");
assertFixed("PCT-CP-010", "PCT-QL-020", { currentValue: 20000, decreaseRate: 20, periodCount: 3, wholeLabel: "expenditure", valuePrefix: "Rs. " }, "$$10240$$");

const batch = generatePct004Batch(200, "en");
const audit = auditPct004Packages(batch);

assert.equal(batch.length, 200);
assert.equal(audit.generationFailures, 0);
assert.equal(audit.validationFailures, 0);
assert.equal(audit.renderFailures, 0);
assert.equal(audit.solverFailures, 0);
assert.equal(Object.keys(audit.cpCoverage).length, 10);
assert.equal(Object.keys(audit.qlCoverage).length, 50);
assert.equal(Object.keys(audit.esCoverage).length, 10);
assert.equal(audit.unusedQlIds.length, 0);
assert.equal(audit.unusedEsIds.length, 0);
assert.equal(audit.crossLanguageConsistencyFailures, 0);
assert.equal(audit.libraryValidationFailures.length, 0);

for (const cpId of PCT_004_CP_IDS) {
  assert.equal(getCommonQuestionLanguageIds(cpId).length, 2, `${cpId} must expose two shared QL IDs`);
}

for (let index = 0; index < 40; index += 1) {
  const cpId = PCT_004_CP_IDS[index % PCT_004_CP_IDS.length]!;
  const pkg = runPct004Pipeline(cpId, { language: "en", seed: `pct-004-foundation:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.ok(pkg.explanation.lines.length >= 6, "Explanation must expose V2.1 statement/math pairs.");
  assert.ok(pkg.explanation.lines.every((line, lineIndex) => lineIndex % 2 === 0 || line.includes("\\Rightarrow")));

  const triplet = runPct004ForLanguages(cpId, {
    seed: `pct-004-foundation:${index}`,
    questionLanguageId: pkg.questionLanguageId,
    difficultyBand: pkg.difficultyBand,
  });
  assert.equal(new Set(triplet.map((item) => item.answer)).size, 1, `${cpId} must preserve cross-language answer parity`);
}

console.log("PCT-004 first-pass implementation test passed.");

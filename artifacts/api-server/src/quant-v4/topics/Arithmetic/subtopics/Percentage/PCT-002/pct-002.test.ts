import { strict as assert } from "node:assert";
import {
  auditPct002Packages,
  generatePct002Batch,
  getAnswerType,
  getCommonQuestionLanguageIds,
  getQuestionEntry,
  getRequiredVariables,
  getTaskKind,
  runPct002ForLanguages,
  runPct002Pipeline,
  solvePct002,
  validatePct002Libraries,
} from "./index";
import { PCT_002_ARCHETYPE_ID, PCT_002_CP_IDS, type Pct002CanonicalProblemId, type Pct002Parameters, type Pct002Variables } from "./types";

function buildParams(cpId: Pct002CanonicalProblemId, qlId: string, variables: Pct002Variables): Pct002Parameters {
  return {
    archetypeId: PCT_002_ARCHETYPE_ID,
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

function assertFixed(cpId: Pct002CanonicalProblemId, qlId: string, variables: Pct002Variables, expected: string) {
  const result = solvePct002(buildParams(cpId, qlId, variables));
  assert.equal(result.answer, expected, `${cpId}:${qlId} answer mismatch`);
}

const libraryValidation = validatePct002Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

assert.deepEqual(PCT_002_CP_IDS, [
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

assertFixed("PCT-CP-001", "PCT-QL-001", { knownRate: 25, knownValue: 180, partLabel: "girls", wholeLabel: "students" }, "$$720$$");
assertFixed("PCT-CP-001", "PCT-QL-002", { knownRate: 20, knownValue: 12000, partLabel: "savings", wholeLabel: "monthly income", valuePrefix: "Rs. " }, "$$60000$$");
assertFixed("PCT-CP-002", "PCT-QL-003", { knownRate: 20, knownValue: 8000, targetRate: 60, wholeLabel: "income", valuePrefix: "Rs. " }, "$$24000$$");
assertFixed("PCT-CP-002", "PCT-QL-004", { knownRate: 35, knownValue: 140, targetRate: 50, wholeLabel: "students" }, "$$200$$");
assertFixed("PCT-CP-003", "PCT-QL-005", { partValue: 180, wholeValue: 720, partLabel: "girls", wholeLabel: "students" }, "$$25\\%$$");
assertFixed("PCT-CP-003", "PCT-QL-006", { partValue: 12000, wholeValue: 60000, partLabel: "savings", wholeLabel: "income", valuePrefix: "Rs. " }, "$$20\\%$$");
assertFixed("PCT-CP-004", "PCT-QL-007", { knownRate: 40, knownValue: 240, targetValue: 180, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$30\\%$$");
assertFixed("PCT-CP-004", "PCT-QL-008", { knownRate: 25, knownValue: 150, targetValue: 90, wholeLabel: "books" }, "$$15\\%$$");
assertFixed("PCT-CP-005", "PCT-QL-009", { partA: 3, partB: 2, targetPartLabel: "first part" }, "$$60\\%$$");
assertFixed("PCT-CP-005", "PCT-QL-010", { partA: 1, partB: 4, targetPartLabel: "second part" }, "$$80\\%$$");
assertFixed("PCT-CP-006", "PCT-QL-011", { knownRate: 25, partLabel: "girls", complementLabel: "boys" }, "$$75\\%$$");
assertFixed("PCT-CP-006", "PCT-QL-012", { knownRate: 18, partLabel: "savings", complementLabel: "expenditure" }, "$$82\\%$$");
assertFixed("PCT-CP-007", "PCT-QL-013", { rate1: 40, rate2: 25, partLabel: "boys", otherLabel: "girls" }, "$$15\\%$$");
assertFixed("PCT-CP-007", "PCT-QL-014", { rate1: 35, rate2: 20, partLabel: "food expenses", otherLabel: "transport expenses" }, "$$15\\%$$");
assertFixed("PCT-CP-008", "PCT-QL-015", { totalValue: 400, targetRate: 40, otherRate: 35, thirdRate: 25, wholeLabel: "students", targetLabel: "girls", otherLabel: "boys", thirdLabel: "other students" }, "$$160$$");
assertFixed("PCT-CP-008", "PCT-QL-016", { totalValue: 20000, targetRate: 30, otherRate: 25, thirdRate: 45, wholeLabel: "monthly expenses", targetLabel: "rent", otherLabel: "food", thirdLabel: "transport", valuePrefix: "Rs. " }, "$$6000$$");
assertFixed("PCT-CP-009", "PCT-QL-017", { rate1: 30, rate2: 25, rate3: 20, partLabel: "food", otherLabel: "rent", thirdLabel: "transport", complementLabel: "remaining expenses" }, "$$25\\%$$");
assertFixed("PCT-CP-009", "PCT-QL-018", { rate1: 20, rate2: 15, rate3: 25, partLabel: "marketing", otherLabel: "salaries", thirdLabel: "rent", complementLabel: "other expenses" }, "$$40\\%$$");
assertFixed("PCT-CP-010", "PCT-QL-019", { totalValue: 5000, rate1: 35, rate2: 30, targetRate: 35, wholeLabel: "population", targetLabel: "children", otherLabel: "males", thirdLabel: "females" }, "$$1750$$");
assertFixed("PCT-CP-010", "PCT-QL-020", { totalValue: 40000, rate1: 30, rate2: 25, rate3: 15, targetRate: 30, wholeLabel: "monthly expenses", targetLabel: "education", otherLabel: "food", thirdLabel: "rent", fourthLabel: "transport", valuePrefix: "Rs. " }, "$$12000$$");

const batch = generatePct002Batch(200, "en");
const audit = auditPct002Packages(batch);

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

for (const cpId of PCT_002_CP_IDS) {
  assert.equal(getCommonQuestionLanguageIds(cpId).length, 2, `${cpId} must expose two shared QL IDs`);
}

for (let index = 0; index < 40; index += 1) {
  const cpId = PCT_002_CP_IDS[index % PCT_002_CP_IDS.length]!;
  const pkg = runPct002Pipeline(cpId, { language: "en", seed: `pct-002-recovery:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.ok(pkg.explanation.lines.length >= 6, "Explanation must expose V2.1 statement/math pairs.");
  assert.ok(pkg.explanation.lines.every((line, lineIndex) => lineIndex % 2 === 0 || line.includes("\\Rightarrow")));

  const triplet = runPct002ForLanguages(cpId, {
    seed: `pct-002-recovery:${index}`,
    questionLanguageId: pkg.questionLanguageId,
    difficultyBand: pkg.difficultyBand,
  });
  assert.equal(new Set(triplet.map((item) => item.answer)).size, 1, `${cpId} must preserve cross-language answer parity`);
}

console.log("PCT-002 foundational recovery test passed.");

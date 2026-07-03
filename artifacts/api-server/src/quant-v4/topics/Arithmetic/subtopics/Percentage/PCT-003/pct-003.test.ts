import { strict as assert } from "node:assert";
import {
  auditPct003Packages,
  generatePct003Batch,
  getAnswerType,
  getCommonQuestionLanguageIds,
  getQuestionEntry,
  getQuestionLanguageIds,
  getRequiredVariables,
  getTaskKind,
  runPct003ForLanguages,
  runPct003Pipeline,
  solvePct003,
  validatePct003Libraries,
} from "./index";
import { PCT_003_ARCHETYPE_ID, PCT_003_CP_IDS, type Pct003CanonicalProblemId, type Pct003Parameters, type Pct003Variables } from "./types";

function buildParams(cpId: Pct003CanonicalProblemId, qlId: string, variables: Pct003Variables): Pct003Parameters {
  return {
    archetypeId: PCT_003_ARCHETYPE_ID,
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

function assertFixed(cpId: Pct003CanonicalProblemId, qlId: string, variables: Pct003Variables, expected: string) {
  const result = solvePct003(buildParams(cpId, qlId, variables));
  assert.equal(result.answer, expected, `${cpId}:${qlId} answer mismatch`);
}

const libraryValidation = validatePct003Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

assert.deepEqual(PCT_003_CP_IDS, [
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

assertFixed("PCT-CP-001", "PCT-QL-001", { originalValue: 40000, increaseRate: 20, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$48000$$");
assertFixed("PCT-CP-001", "PCT-QL-002", { originalValue: 12000, increaseRate: 25, wholeLabel: "population" }, "$$15000$$");
assertFixed("PCT-CP-002", "PCT-QL-003", { originalValue: 40000, increaseRate: 20, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$8000$$");
assertFixed("PCT-CP-002", "PCT-QL-004", { originalValue: 800, increaseRate: 25, wholeLabel: "production" }, "$$200$$");
assertFixed("PCT-CP-003", "PCT-QL-005", { increasedValue: 48000, increaseRate: 20, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$40000$$");
assertFixed("PCT-CP-003", "PCT-QL-006", { increasedValue: 50000, increaseRate: 25, wholeLabel: "population" }, "$$40000$$");
assertFixed("PCT-CP-004", "PCT-QL-007", { increaseRate: 20, wholeLabel: "salary" }, "$$1.2$$");
assertFixed("PCT-CP-004", "PCT-QL-008", { increaseRate: 15, wholeLabel: "population" }, "$$1.15$$");
assertFixed("PCT-CP-005", "PCT-QL-009", { originalValue: 40000, rate1: 10, rate2: 20, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$52800$$");
assertFixed("PCT-CP-005", "PCT-QL-010", { originalValue: 1000, rate1: 15, rate2: 10, wholeLabel: "population" }, "$$1265$$");
assertFixed("PCT-CP-006", "PCT-QL-011", { rate1: 10, rate2: 20, wholeLabel: "price" }, "$$32\\%$$");
assertFixed("PCT-CP-006", "PCT-QL-012", { rate1: 15, rate2: 15, wholeLabel: "population" }, "$$32.25\\%$$");
assertFixed("PCT-CP-007", "PCT-QL-013", { originalA: 40000, rateA: 10, labelA: "salary A", originalB: 30000, rateB: 20, labelB: "salary B", valuePrefix: "Rs. " }, "$$8000$$");
assertFixed("PCT-CP-007", "PCT-QL-014", { originalA: 600, rateA: 20, labelA: "production A", originalB: 500, rateB: 10, labelB: "production B" }, "$$170$$");
assertFixed("PCT-CP-008", "PCT-QL-015", { totalValue: 200, partRate: 40, partIncreaseRate: 20, otherIncreaseRate: 10, wholeLabel: "students", partLabel: "boys", otherLabel: "girls" }, "$$42.1053\\%$$");
assertFixed("PCT-CP-008", "PCT-QL-016", { totalValue: 400, partRate: 50, partIncreaseRate: 20, otherIncreaseRate: 10, wholeLabel: "workers", partLabel: "urban workers", otherLabel: "rural workers" }, "$$52.1739\\%$$");
assertFixed("PCT-CP-009", "PCT-QL-017", { currentValue: 48000, targetValue: 60000, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$25\\%$$");
assertFixed("PCT-CP-009", "PCT-QL-018", { currentValue: 400, targetValue: 500, wholeLabel: "production" }, "$$25\\%$$");
assertFixed("PCT-CP-010", "PCT-QL-019", { currentValue: 5000, growthRate: 10, periodCount: 2, wholeLabel: "population" }, "$$6050$$");
assertFixed("PCT-CP-010", "PCT-QL-020", { currentValue: 20000, growthRate: 20, periodCount: 3, wholeLabel: "production value", valuePrefix: "Rs. " }, "$$34560$$");

const batch = generatePct003Batch(200, "en");
const audit = auditPct003Packages(batch);

assert.equal(batch.length, 200);
assert.equal(audit.generationFailures, 0);
assert.equal(audit.validationFailures, 0);
assert.equal(audit.renderFailures, 0);
assert.equal(audit.solverFailures, 0);
assert.equal(Object.keys(audit.cpCoverage).length, 10);
assert.equal(Object.keys(audit.qlCoverage).length, 150);
assert.equal(Object.keys(audit.esCoverage).length, 10);
assert.equal(audit.unusedQlIds.length, 0);
assert.equal(audit.unusedEsIds.length, 0);
assert.equal(audit.crossLanguageConsistencyFailures, 0);
assert.equal(audit.libraryValidationFailures.length, 0);

for (const cpId of PCT_003_CP_IDS) {
  assert.equal(getQuestionLanguageIds(cpId, "en").length, 15, `${cpId} must expose fifteen English QL IDs`);
  assert.equal(getCommonQuestionLanguageIds(cpId).length, 2, `${cpId} must expose two shared QL IDs`);
}

for (let index = 0; index < 40; index += 1) {
  const cpId = PCT_003_CP_IDS[index % PCT_003_CP_IDS.length]!;
  const pkg = runPct003Pipeline(cpId, { language: "en", seed: `pct-003-foundation:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.ok(pkg.explanation.lines.length >= 6, "Explanation must expose V2.1 statement/math pairs.");
  assert.ok(pkg.explanation.lines.every((line, lineIndex) => lineIndex % 2 === 0 || line.includes("\\Rightarrow")));

  const triplet = runPct003ForLanguages(cpId, {
    seed: `pct-003-foundation:${index}`,
    questionLanguageId: pkg.questionLanguageId,
    difficultyBand: pkg.difficultyBand,
  });
  assert.equal(new Set(triplet.map((item) => item.answer)).size, 1, `${cpId} must preserve cross-language answer parity`);
}

for (let index = 0; index < 40; index += 1) {
  const repeatedIncreasePkg = runPct003Pipeline("PCT-CP-005", {
    language: "en",
    seed: `pct-003-repeated-count:${index}`,
  });
  const repeatedWholeLabel = String(repeatedIncreasePkg.parameters.variables.wholeLabel ?? "");
  if (
    repeatedIncreasePkg.answerType === "ABSOLUTE" &&
    /population|students|residents|passengers|applicants|boxes|cartons|units|accounts|users/i.test(repeatedWholeLabel)
  ) {
    assert.ok(
      Number.isInteger(Number(repeatedIncreasePkg.solver.numericAnswer ?? NaN)),
      `repeated increase result must stay integral for ${repeatedWholeLabel}`,
    );
  }

  const growthBridgePkg = runPct003Pipeline("PCT-CP-010", {
    language: "en",
    seed: `pct-003-growth-bridge:${index}`,
  });
  const growthWholeLabel = String(growthBridgePkg.parameters.variables.wholeLabel ?? "");
  if (
    growthBridgePkg.answerType === "ABSOLUTE" &&
    /population|students|residents|passengers|applicants|boxes|cartons|units|accounts|users/i.test(growthWholeLabel)
  ) {
    assert.ok(
      Number.isInteger(Number(growthBridgePkg.solver.numericAnswer ?? NaN)),
      `growth bridge result must stay integral for ${growthWholeLabel}`,
    );
  }
}

console.log("PCT-003 first-pass implementation test passed.");

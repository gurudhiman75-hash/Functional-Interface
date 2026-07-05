import { strict as assert } from "node:assert";
import {
  auditPct005Packages,
  generatePct005Batch,
  getAnswerType,
  getCommonQuestionLanguageIds,
  getQuestionEntry,
  getQuestionLanguageIds,
  getRequiredVariables,
  getTaskKind,
  runPct005ForLanguages,
  runPct005Pipeline,
  solvePct005,
  validatePct005Libraries,
} from "./index";
import { PCT_005_ARCHETYPE_ID, PCT_005_CP_IDS, type Pct005CanonicalProblemId, type Pct005Parameters, type Pct005Variables } from "./types";

function buildParams(cpId: Pct005CanonicalProblemId, qlId: string, variables: Pct005Variables): Pct005Parameters {
  return {
    archetypeId: PCT_005_ARCHETYPE_ID,
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

function assertFixed(cpId: Pct005CanonicalProblemId, qlId: string, variables: Pct005Variables, expected: string) {
  const result = solvePct005(buildParams(cpId, qlId, variables));
  assert.equal(result.answer, expected, `${cpId}:${qlId} answer mismatch`);
}

const libraryValidation = validatePct005Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

assert.deepEqual(PCT_005_CP_IDS, [
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

assertFixed("PCT-CP-001", "PCT-QL-001", { originalValue: 1000, rate1: 10, rate2: 20, wholeLabel: "value" }, "$$1320$$");
assertFixed("PCT-CP-001", "PCT-QL-002", { originalValue: 40000, rate1: 20, rate2: 25, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$60000$$");
assertFixed("PCT-CP-002", "PCT-QL-003", { originalValue: 1000, rate1: 10, rate2: 20, wholeLabel: "population" }, "$$720$$");
assertFixed("PCT-CP-002", "PCT-QL-004", { originalValue: 40000, rate1: 10, rate2: 20, wholeLabel: "salary", valuePrefix: "Rs. " }, "$$28800$$");
assertFixed("PCT-CP-003", "PCT-QL-005", { originalValue: 1000, rate1: 20, rate2: 20, wholeLabel: "value" }, "$$960$$");
assertFixed("PCT-CP-003", "PCT-QL-006", { originalValue: 800, rate1: 25, rate2: 20, wholeLabel: "production" }, "$$800$$");
assertFixed("PCT-CP-004", "PCT-QL-007", { originalValue: 1000, rate1: 20, rate2: 20, wholeLabel: "value" }, "$$960$$");
assertFixed("PCT-CP-004", "PCT-QL-008", { originalValue: 500, rate1: 10, rate2: 20, wholeLabel: "attendance" }, "$$540$$");
assertFixed("PCT-CP-005", "PCT-QL-009", { rate1: 10, rate2: 20, direction1: "increase", direction2: "increase", wholeLabel: "value" }, "$$32\\%$$");
assertFixed("PCT-CP-005", "PCT-QL-010", { rate1: 20, rate2: 10, direction1: "increase", direction2: "decrease", wholeLabel: "value" }, "$$8\\%$$");
assertFixed("PCT-CP-006", "PCT-QL-011", { rate1: 20, rate2: 25, direction1: "increase", direction2: "increase", wholeLabel: "value" }, "$$1.5$$");
assertFixed("PCT-CP-006", "PCT-QL-012", { rate1: 20, rate2: 10, direction1: "increase", direction2: "decrease", wholeLabel: "value" }, "$$1.08$$");
assertFixed("PCT-CP-007", "PCT-QL-013", { finalValue: 540, rate1: 20, rate2: 25, direction1: "increase", direction2: "increase", wholeLabel: "value" }, "$$360$$");
assertFixed("PCT-CP-007", "PCT-QL-014", { finalValue: 1080, rate1: 20, rate2: 10, direction1: "increase", direction2: "decrease", wholeLabel: "value" }, "$$1000$$");
assertFixed("PCT-CP-008", "PCT-QL-015", { originalA: 1000, labelA: "A", directionA1: "increase", rateA1: 10, directionA2: "increase", rateA2: 20, originalB: 1000, labelB: "B", directionB1: "increase", rateB1: 15, directionB2: "increase", rateB2: 12 }, "$$32$$");
assertFixed("PCT-CP-008", "PCT-QL-016", { originalA: 30000, labelA: "salary A", valuePrefix: "Rs. ", directionA1: "increase", rateA1: 10, directionA2: "decrease", rateA2: 10, originalB: 30000, labelB: "salary B", directionB1: "increase", rateB1: 15, directionB2: "increase", rateB2: 10 }, "$$8250$$");
assertFixed("PCT-CP-009", "PCT-QL-017", { originalValue: 1000, stageCount: 3, direction1: "increase", rate1: 10, direction2: "increase", rate2: 20, direction3: "decrease", rate3: 5, wholeLabel: "value" }, "$$1254$$");
assertFixed("PCT-CP-009", "PCT-QL-018", { originalValue: 1000, stageCount: 4, direction1: "increase", rate1: 10, direction2: "increase", rate2: 20, direction3: "decrease", rate3: 5, direction4: "increase", rate4: 15, wholeLabel: "value" }, "$$1442.1$$");
assertFixed("PCT-CP-010", "PCT-QL-019", { originalValue: 5000, stageCount: 3, direction1: "increase", rate1: 10, direction2: "decrease", rate2: 5, direction3: "increase", rate3: 10, wholeLabel: "population" }, "$$5747.5$$");
assertFixed("PCT-CP-010", "PCT-QL-020", { originalValue: 20000, stageCount: 3, direction1: "increase", rate1: 15, direction2: "increase", rate2: 20, direction3: "decrease", rate3: 10, wholeLabel: "sales", valuePrefix: "Rs. " }, "$$24840$$");

const batch = generatePct005Batch(200, "en");
const audit = auditPct005Packages(batch);

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

for (const cpId of PCT_005_CP_IDS) {
  assert.equal(getQuestionLanguageIds(cpId, "en").length, 15, `${cpId} must expose fifteen English QL IDs`);
  assert.equal(getCommonQuestionLanguageIds(cpId).length, 15, `${cpId} must expose fifteen shared QL IDs`);
}

for (let index = 0; index < 40; index += 1) {
  const cpId = PCT_005_CP_IDS[index % PCT_005_CP_IDS.length]!;
  const pkg = runPct005Pipeline(cpId, { language: "en", seed: `pct-005-foundation:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.ok(pkg.explanation.lines.length >= 6, "Explanation must expose V2.1 statement/math pairs.");
  assert.ok(pkg.explanation.lines.every((line, lineIndex) => lineIndex % 2 === 0 || line.includes("\\Rightarrow")));

  const triplet = runPct005ForLanguages(cpId, {
    seed: `pct-005-foundation:${index}`,
    questionLanguageId: pkg.questionLanguageId,
    difficultyBand: pkg.difficultyBand,
  });
  assert.equal(new Set(triplet.map((item) => item.answer)).size, 1, `${cpId} must preserve cross-language answer parity`);
}

for (let index = 0; index < 80; index += 1) {
  const cpId = PCT_005_CP_IDS[index % PCT_005_CP_IDS.length]!;
  const pkg = runPct005Pipeline(cpId, { language: "en", seed: `pct-005-discrete-count:${index}` });
  const wholeLabel = String(pkg.parameters.variables.wholeLabel ?? "");
  if (
    pkg.answerType === "ABSOLUTE" &&
    /\b(population|students|residents|cartons|passengers|units|users|admissions|attendance|stock)\b/i.test(wholeLabel)
  ) {
    const numericAnswer = Number(pkg.solver.numericAnswer ?? NaN);
    assert.ok(
      Number.isFinite(numericAnswer) && Math.abs(numericAnswer - Math.round(numericAnswer)) < 1e-9,
      `discrete PCT-005 result must stay integral for ${wholeLabel}`,
    );
  }
}

{
  const pkg = runPct005Pipeline("PCT-CP-008", {
    language: "en",
    questionLanguageId: "PCT-QL-044",
    seed: "pct-005-school-attendance-grammar",
  });
  assert.ok(!pkg.stem.includes("School An attendance"));
  assert.ok(!pkg.explanation.lines.join("\n").includes("School An attendance"));
}

const hiPkg005 = runPct005Pipeline("PCT-CP-001", {
  language: "hi",
  questionLanguageId: "PCT-QL-001",
  seed: "pct-005-hi-localization",
});
assert.equal(hiPkg005.parameters.language, "hi");
assert.ok(!/\b(First|Now|Therefore|So the|required|increase|decrease|multiplier)\b/.test(hiPkg005.explanation.lines.join(" ")));

const paPkg005 = runPct005Pipeline("PCT-CP-008", {
  language: "pa",
  questionLanguageId: "PCT-QL-020",
  seed: "pct-005-pa-localization",
});
assert.equal(paPkg005.parameters.language, "pa");
assert.ok(!/\b(First|Now|Therefore|So the|required|increase|decrease|multiplier)\b/.test(paPkg005.explanation.lines.join(" ")));

console.log("PCT-005 first-pass implementation test passed.");

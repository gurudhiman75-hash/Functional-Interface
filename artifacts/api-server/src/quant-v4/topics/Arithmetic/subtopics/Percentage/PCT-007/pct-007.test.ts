import { strict as assert } from "node:assert";
import {
  auditPct007Packages,
  generatePct007Batch,
  getAnswerType,
  getQuestionEntry,
  getRequiredVariables,
  getSolveMode,
  getTaskKind,
  runPct007ForLanguages,
  runPct007Pipeline,
  solvePct007,
  validatePct007Libraries,
} from "./index";
import { PCT_007_ARCHETYPE_ID, PCT_007_CP_IDS, type Pct007CanonicalProblemId, type Pct007Parameters, type Pct007Variables } from "./types";

function explanationIdFor(cpId: Pct007CanonicalProblemId) {
  return `PCT-ES-${String(PCT_007_CP_IDS.indexOf(cpId) + 1).padStart(3, "0")}`;
}

function buildParams(cpId: Pct007CanonicalProblemId, qlId: string, variables: Pct007Variables): Pct007Parameters {
  return {
    archetypeId: PCT_007_ARCHETYPE_ID,
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

function assertFixed(cpId: Pct007CanonicalProblemId, qlId: string, variables: Pct007Variables, expected: string) {
  const result = solvePct007(buildParams(cpId, qlId, variables));
  assert.equal(result.answer, expected, `${cpId}:${qlId} answer mismatch`);
}

const libraryValidation = validatePct007Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

assert.deepEqual(PCT_007_CP_IDS, [
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

assertFixed("PCT-CP-001", "PCT-QL-001", { percentageRate: 40, baseValue: 5000 }, "$$3000$$");
assertFixed("PCT-CP-001", "PCT-QL-021", { percentageRate: 25, value1: 1500 }, "$$6000$$");

assertFixed("PCT-CP-002", "PCT-QL-051", { percentageRate: 40, totalMarks: 500 }, "$$200$$");
assertFixed("PCT-CP-002", "PCT-QL-091", { percentageRate: 60, passRate: 50, value1: 40 }, "$$400$$");

assertFixed("PCT-CP-003", "PCT-QL-101", { turnoutRate: 60, totalVoters: 5000 }, "$$3000$$");
assertFixed("PCT-CP-003", "PCT-QL-131", { turnoutRate: 80, totalVoters: 10000, invalidRate: 10, rate1: 60, rate2: 30 }, "$$2160$$");

assertFixed("PCT-CP-004", "PCT-QL-151", { percentageRate: 20, totalValue: 200 }, "$$240$$");
assertFixed("PCT-CP-004", "PCT-QL-191", { percentageRate: 25, totalValue: 200 }, "$$150$$");

assertFixed("PCT-CP-005", "PCT-QL-201", { componentRate: 25, totalValue: 80 }, "$$20$$");
assertFixed("PCT-CP-005", "PCT-QL-241", { componentRate: 25, value1: 60 }, "$$80$$");

assertFixed("PCT-CP-006", "PCT-QL-251", { waterRate: 80, dryWaterRate: 20, baseValue: 100 }, "$$25$$");
assertFixed("PCT-CP-006", "PCT-QL-291", { waterRate: 75, dryWaterRate: 25, value1: 40 }, "$$120$$");

assertFixed("PCT-CP-007", "PCT-QL-301", { discountRate: 20, baseValue: 500 }, "$$100$$");
assertFixed("PCT-CP-007", "PCT-QL-331", { rate1: 20, rate2: 10, baseValue: 500 }, "$$440$$");

assertFixed("PCT-CP-008", "PCT-QL-351", { wrongValue: 120, correctValue: 100 }, "$$20\\%$$");
assertFixed("PCT-CP-008", "PCT-QL-371", { wrongValue: 75, percentageRate: 25 }, "$$100$$");

assertFixed("PCT-CP-009", "PCT-QL-401", { totalValue: 500, percentageRate: 20 }, "$$400$$");
assertFixed("PCT-CP-009", "PCT-QL-441", { totalValue: 1000, rate1: 20, rate2: 25 }, "$$400$$");

assertFixed("PCT-CP-010", "PCT-QL-451", { percentageRate: 40, baseValue: 5000 }, "$$3000$$");
assertFixed(
  "PCT-CP-010",
  "PCT-QL-491",
  { subjectA: "Riya", subjectB: "Karan", rate1: 60, baseValue1: 500, rate2: 50, baseValue2: 400, valuePrefix: "", unitLabel: "marks" },
  "Riya is greater by 100 marks.",
);

for (let index = 0; index < 40; index += 1) {
  const applicationPkg = runPct007Pipeline("PCT-CP-004", { language: "en", seed: `pct-007-application:${index}` });
  const unitLabel = String(applicationPkg.parameters.variables.unitLabel ?? "");
  if (["people", "students", "passengers", "votes", "bags", "items", "units", "marks"].includes(unitLabel)) {
    assert.ok(
      Number.isInteger(Number(applicationPkg.solver.numericAnswer ?? NaN)),
      `count-like application result must stay integral for ${unitLabel}`,
    );
  }

  const comparisonPkg = runPct007Pipeline("PCT-CP-010", { language: "en", seed: `pct-007-caselet-compare:${index}` });
  const comparisonUnitLabel = String(comparisonPkg.parameters.variables.unitLabel ?? "");
  if (
    comparisonPkg.parameters.solveMode === "findCaseletComparison" &&
    ["people", "students", "passengers", "votes", "bags", "items", "units", "marks"].includes(comparisonUnitLabel)
  ) {
    const actual1 = Number(comparisonPkg.solver.evidence.actual1 ?? NaN);
    const actual2 = Number(comparisonPkg.solver.evidence.actual2 ?? NaN);
    const difference = Number(comparisonPkg.solver.evidence.difference ?? NaN);
    assert.ok(Number.isInteger(actual1), `caselet actual1 must be integral for ${comparisonUnitLabel}`);
    assert.ok(Number.isInteger(actual2), `caselet actual2 must be integral for ${comparisonUnitLabel}`);
    assert.ok(Number.isInteger(difference), `caselet difference must be integral for ${comparisonUnitLabel}`);
  }
}

for (let index = 0; index < 40; index += 1) {
  const candidateVotesPkg = runPct007Pipeline("PCT-CP-003", { language: "en", seed: `pct-007-election-candidate:${index}` });
  if (candidateVotesPkg.parameters.solveMode === "findCandidateVotesFromValidVotes") {
    assert.ok(
      Number.isInteger(Number(candidateVotesPkg.solver.numericAnswer ?? NaN)),
      "candidate vote totals must stay integral",
    );
  }

  const winningMarginPkg = runPct007Pipeline("PCT-CP-003", { language: "en", seed: `pct-007-election-margin:${index}` });
  if (winningMarginPkg.parameters.solveMode === "findWinningMarginFromVoteShare") {
    assert.ok(
      Number.isInteger(Number(winningMarginPkg.solver.numericAnswer ?? NaN)),
      "winning margins must stay integral",
    );
  }
}

const repeatedExplanationPkg = runPct007Pipeline("PCT-CP-009", {
  language: "en",
  questionLanguageId: "PCT-QL-441",
  seed: "pct-007-repeated-explanation",
});
const repeatedExplanationText = repeatedExplanationPkg.explanation.lines.join(" ");
assert.match(repeatedExplanationText, /After the first reduction/i);
assert.ok(!/\.\./.test(repeatedExplanationText), "Repeated-reduction explanation must not contain double periods.");

const comparisonExplanationPkg = runPct007Pipeline("PCT-CP-010", {
  language: "en",
  questionLanguageId: "PCT-QL-491",
  seed: "pct-007-comparison-explanation",
});
assert.ok(!/\.\./.test(comparisonExplanationPkg.explanation.lines.join(" ")), "Comparison explanation must not contain double periods.");

const batch = generatePct007Batch(500, "en");
const audit = auditPct007Packages(batch);

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

for (const cpId of PCT_007_CP_IDS) {
  assert.equal(runPct007ForLanguages(cpId, { seed: `pct-007-triplet:${cpId}` }).length, 3, `${cpId} must expose three language packages`);
}

for (let index = 0; index < 20; index += 1) {
  const cpId = PCT_007_CP_IDS[index % PCT_007_CP_IDS.length]!;
  const pkg = runPct007Pipeline(cpId, { language: "en", seed: `pct-007-foundation:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.ok(pkg.explanation.lines.length >= 4, "Explanation must expose statement and math pairs.");
  assert.ok(pkg.explanation.lines.every((line, lineIndex) => lineIndex % 2 === 0 || line.includes("\\Rightarrow")));
}

console.log("PCT-007 implementation test passed.");

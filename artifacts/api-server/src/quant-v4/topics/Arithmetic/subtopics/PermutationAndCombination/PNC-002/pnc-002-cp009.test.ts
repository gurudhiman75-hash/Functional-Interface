import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { auditPnc002Cp009Coverage } from "./foundation/coverage-auditor-cp009";
import { getPnc002QuestionEntries } from "./foundation/library";
import { runPnc002Pipeline } from "./foundation/pipeline";
import {
  countAllOrNoneSpecifiedMembersExact,
  countAtLeastFromTwoCategoriesExact,
  countAtLeastOneFromCategoryExact,
  countAtLeastOneFromEachOfThreeCategoriesExact,
  countAtLeastOneFromEachOfTwoCategoriesExact,
  countAtLeastOneSpecifiedMemberExact,
  countAtMostFromTwoCategoriesExact,
  countAtMostTSpecifiedMembersExact,
  countExactThreeCategoryDistributionExact,
  countExactlyFromTwoCategoriesExact,
  countExactlyTSpecifiedMembersExact,
  countImplicationBetweenSpecifiedMembersExact,
  countNamedCompulsoryWithCategoryQuotaExact,
  countNamedExcludedWithCategoryQuotaExact,
  countNotAllSpecifiedMembersTogetherExact,
  countWithCompulsoryAndExcludedMembersExact,
  countWithCompulsoryMembersExact,
  countWithExcludedMembersExact,
} from "./foundation/solver-cp009";

const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-009");
const checkpointIds = Array.from({ length: 25 }, (_, index) => `PNC-QL-${String(index + 148).padStart(3, "0")}`);
assert.equal(entries.length, 25);
assert.deepEqual(entries.map((entry) => entry.qlId), checkpointIds);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 25);
const difficultyCounts = Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]));
assert.deepEqual(difficultyCounts, { Easy: 5, Medium: 12, Hard: 8 });
const solveModeCounts = Object.fromEntries([...new Set(entries.map((entry) => entry.solveMode))].map((solveMode) => [solveMode, entries.filter((entry) => entry.solveMode === solveMode).length]));
assert.deepEqual(solveModeCounts, {
  countWithCompulsoryMembers: 2,
  countWithExcludedMembers: 2,
  countWithCompulsoryAndExcludedMembers: 1,
  countExactlyFromTwoCategories: 2,
  countAtLeastFromTwoCategories: 2,
  countAtMostFromTwoCategories: 1,
  countAtLeastOneFromCategory: 1,
  countAtLeastOneFromEachOfTwoCategories: 1,
  countExactThreeCategoryDistribution: 1,
  countAtLeastOneFromEachOfThreeCategories: 1,
  countExactlyTSpecifiedMembers: 2,
  countAtLeastOneSpecifiedMember: 1,
  countNotAllSpecifiedMembersTogether: 1,
  countAllOrNoneSpecifiedMembers: 1,
  countImplicationBetweenSpecifiedMembers: 1,
  countAtMostTSpecifiedMembers: 1,
  countNamedCompulsoryWithCategoryQuota: 1,
  countNamedExcludedWithCategoryQuota: 1,
  recoverConditionalSelectionParameter: 2,
});

assert.equal(countWithCompulsoryMembersExact(9, 4, 1), 56);
assert.equal(countWithExcludedMembersExact(9, 4, 1), 70);
assert.equal(countWithCompulsoryAndExcludedMembersExact(9, 4, 1, 1), 35);
assert.equal(countExactlyFromTwoCategoriesExact(6, 5, 4, 2), 150);
assert.deepEqual(countAtLeastFromTwoCategoriesExact(6, 5, 5, 3), { answer: 281, acceptedCounts: [3, 4, 5], caseCounts: [200, 75, 6] });
assert.deepEqual(countAtMostFromTwoCategoriesExact(6, 5, 5, 2), { answer: 181, acceptedCounts: [0, 1, 2], caseCounts: [1, 30, 150] });
assert.equal(countAtLeastOneFromCategoryExact(5, 7, 4), 460);
assert.equal(countAtLeastOneFromEachOfTwoCategoriesExact(5, 6, 4), 310);
assert.equal(countExactThreeCategoryDistributionExact([5, 4, 3], [2, 2, 1]), 180);
assert.equal(countAtLeastOneFromEachOfThreeCategoriesExact([4, 4, 3], 5).answer, 364);
assert.equal(countExactlyTSpecifiedMembersExact(10, 5, 4, 2), 120);
assert.equal(countAtLeastOneSpecifiedMemberExact(10, 5, 4), 246);
assert.equal(countNotAllSpecifiedMembersTogetherExact(10, 5, 2), 196);
assert.equal(countAllOrNoneSpecifiedMembersExact(10, 5, 2), 112);
assert.equal(countImplicationBetweenSpecifiedMembersExact(10, 5), 182);
assert.equal(countAtMostTSpecifiedMembersExact(10, 5, 4, 2).answer, 186);
assert.equal(countNamedCompulsoryWithCategoryQuotaExact(6, 5, 5, 3), 100);
assert.equal(countNamedExcludedWithCategoryQuotaExact(6, 5, 5, 2), 100);

for (const qlId of checkpointIds) {
  const sample = runPnc002Pipeline({ questionLanguageId: qlId, seed: `cp009-contract:${qlId}` });
  assert.equal(sample.canonicalProblemId, "PNC-CP-009");
  assert.equal(sample.taskKind, "conditionalSelection");
  assert.equal(sample.independentVerification.answer, sample.solver.numericAnswer);
  assert.equal(sample.validation.valid, true, `${qlId}: ${sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
}
const poolInverse = runPnc002Pipeline({ questionLanguageId: "PNC-QL-171", seed: "cp009-total-inverse-proof" });
assert.equal(poolInverse.solver.evidence.recoveredParameter, "totalObjects");
const categoryInverse = runPnc002Pipeline({ questionLanguageId: "PNC-QL-172", seed: "cp009-category-inverse-proof" });
assert.equal(categoryInverse.solver.evidence.recoveredParameter, "categorySize");

let generatedCases = 0;
for (const entry of entries) {
  for (let seedIndex = 0; seedIndex < 12; seedIndex += 1) {
    const seed = `pnc-002-cp009-proof:${entry.qlId}:${seedIndex}`;
    const first = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed });
    assert.deepEqual(second.parameters, first.parameters, `${entry.qlId} parameter determinism`);
    assert.equal(second.stem, first.stem, `${entry.qlId} stem determinism`);
    assert.deepEqual(second.options, first.options, `${entry.qlId} option determinism`);
    assert.deepEqual(second.explanation, first.explanation, `${entry.qlId} explanation determinism`);
    assert.equal(first.validation.valid, true, `${entry.qlId}: ${first.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
    assert.equal(first.independentVerification.answer, first.solver.numericAnswer);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.traceability.formulaRendering, "LATEX_MATHJAX");
    generatedCases += 1;
  }
}
assert.equal(generatedCases, 300);
assert.throws(() => runPnc002Pipeline({ questionLanguageId: "PNC-QL-148", language: "hi", seed: "unsupported-hi" }), /not implemented/);
assert.throws(() => runPnc002Pipeline({ questionLanguageId: "PNC-QL-148", language: "pa", seed: "unsupported-pa" }), /not implemented/);
const audit = auditPnc002Cp009Coverage();
assert.equal(audit.passed, true, JSON.stringify(audit, null, 2));

const reviewDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp009-review");
mkdirSync(reviewDirectory, { recursive: true });
const reviewRows = entries.map((entry) => {
  const generated = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-002-cp009-review:${entry.qlId}` });
  return { qlId: entry.qlId, cpId: entry.cpId, difficulty: entry.difficulty, solveMode: entry.solveMode, stem: generated.stem, options: generated.options, correctIndex: generated.correctIndex, answer: generated.answer, equation: generated.solver.equation, mathJax: generated.solver.mathJax, explanation: generated.explanation.lines, validation: generated.validation.valid, mathematicalFingerprint: generated.mathematicalFingerprint };
});
writeFileSync(resolve(reviewDirectory, "pnc-002-cp009-question-explanation-review.json"), `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");
function csvCell(value: unknown): string { const text = String(value ?? "").replace(/\r?\n/g, "\\n"); return `"${text.replace(/"/g, '""')}"`; }
const columns = ["qlId", "cpId", "difficulty", "solveMode", "stem", "options", "correctIndex", "answer", "equation", "mathJax", "explanation", "validation", "mathematicalFingerprint"] as const;
const csvRows = [columns.map(csvCell).join(","), ...reviewRows.map((row) => columns.map((column) => csvCell(Array.isArray(row[column]) ? row[column].join("\n") : row[column])).join(","))];
writeFileSync(resolve(reviewDirectory, "pnc-002-cp009-question-explanation-review.csv"), `${csvRows.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ packageId: "PNC-002", canonicalProblemId: "PNC-CP-009", activeQlCount: entries.length, activeSolveModeCount: Object.keys(solveModeCounts).length, generatedCases, generatedTwicePerCase: true, reviewRows: reviewRows.length, audit, status: "PASS" }, null, 2));

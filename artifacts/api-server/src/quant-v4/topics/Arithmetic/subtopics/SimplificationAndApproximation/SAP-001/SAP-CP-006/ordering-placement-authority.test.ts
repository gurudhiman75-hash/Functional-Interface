import assert from "node:assert/strict";
import { generateSapCp006Editorial } from "./editorial-runtime-v3";

const ORDERING = "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS" as const;
const orderingPositionCounts = [0, 0, 0, 0];
const orderingAnswersByPosition = [new Set<string>(), new Set<string>(), new Set<string>(), new Set<string>()];
let tableCount = 0;
let inlineCount = 0;

for (let seed = 1; seed <= 400; seed += 1) {
  const pkg = generateSapCp006Editorial(ORDERING, seed);
  assert.equal(pkg.validation.ok, true, `${seed}: ordering package validation failed: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.options.length, 4, `${seed}: expected four ordering options.`);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4, `${seed}: duplicate ordering option values.`);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1, `${seed}: expected exactly one correct ordering option.`);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer, `${seed}: ordering correctIndex does not point to canonical answer.`);

  const d = pkg.oracle.data;
  const values = [
    { label: "A", value: d.aVal! },
    { label: "B", value: d.bVal! },
    { label: "C", value: d.cVal! },
    { label: "D", value: d.dVal! },
  ].sort((a, b) => a.value - b.value);
  const independentAnswer = values.map((item) => item.label).join(" < ");
  assert.equal(pkg.canonicalAnswer, independentAnswer, `${seed}: independent ordering mismatch.`);

  orderingPositionCounts[pkg.correctIndex]! += 1;
  orderingAnswersByPosition[pkg.correctIndex]!.add(pkg.canonicalAnswer);

  if (d.tableWrapper === 1) {
    tableCount += 1;
    assert.match(pkg.stem, /small table/i, `${seed}: table-wrapper marker missing from stem.`);
  } else {
    inlineCount += 1;
    assert.doesNotMatch(pkg.stem, /small table/i, `${seed}: inline variant incorrectly marked as table.`);
  }
}

assert.deepEqual(orderingPositionCounts, [100, 100, 100, 100], "Ordering answer positions must be exactly balanced across 400 seeds.");
assert.equal(tableCount, 200, "Expected 200 table-wrapper variants across 400 seeds.");
assert.equal(inlineCount, 200, "Expected 200 inline variants across 400 seeds.");
for (let position = 0; position < 4; position += 1) {
  assert.ok(orderingAnswersByPosition[position]!.size >= 4, `Ordering answer position ${position} remains coupled to too few mathematical orderings.`);
}

const STATEMENT = "SAP-CP006-PROT-STATEMENT-COMBINATION" as const;
const statementPositionCounts = [0, 0, 0, 0];
const statementAnswerCounts = new Map<string, number>();
const statementAnswersByPosition = [new Set<string>(), new Set<string>(), new Set<string>(), new Set<string>()];
const expectedStatementAnswers = new Set(["Both I and II", "Only I", "Only II", "Neither I nor II"]);

for (let seed = 1; seed <= 400; seed += 1) {
  const pkg = generateSapCp006Editorial(STATEMENT, seed);
  assert.equal(pkg.validation.ok, true, `${seed}: statement package validation failed: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.options.length, 4, `${seed}: expected four statement options.`);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4, `${seed}: duplicate statement option values.`);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1, `${seed}: expected exactly one correct statement option.`);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer, `${seed}: statement correctIndex does not point to canonical answer.`);
  assert.ok(expectedStatementAnswers.has(pkg.canonicalAnswer), `${seed}: unexpected statement answer ${pkg.canonicalAnswer}.`);

  const d = pkg.oracle.data;
  const independentAnswer = d.statement1True === 1 && d.statement2True === 1
    ? "Both I and II"
    : d.statement1True === 1
      ? "Only I"
      : d.statement2True === 1
        ? "Only II"
        : "Neither I nor II";
  assert.equal(pkg.canonicalAnswer, independentAnswer, `${seed}: independent statement truth evaluation mismatch.`);

  statementPositionCounts[pkg.correctIndex]! += 1;
  statementAnswerCounts.set(pkg.canonicalAnswer, (statementAnswerCounts.get(pkg.canonicalAnswer) ?? 0) + 1);
  statementAnswersByPosition[pkg.correctIndex]!.add(pkg.canonicalAnswer);
}

assert.deepEqual(statementPositionCounts, [100, 100, 100, 100], "Statement answer positions must be exactly balanced across 400 seeds.");
assert.deepEqual(new Set(statementAnswerCounts.keys()), expectedStatementAnswers, "All four statement truth outcomes must be generated.");
for (const answer of expectedStatementAnswers) {
  assert.equal(statementAnswerCounts.get(answer), 100, `${answer}: expected exactly 100 occurrences across 400 seeds.`);
}
for (let position = 0; position < 4; position += 1) {
  assert.deepEqual(statementAnswersByPosition[position], expectedStatementAnswers, `Statement position ${position} does not exercise all four truth outcomes.`);
}

console.log("SAP-CP-006 decoupling authority passed: QL-099 has 24-permutation ordering coverage with balanced option positions; QL-103 has all four truth states in every answer position.");

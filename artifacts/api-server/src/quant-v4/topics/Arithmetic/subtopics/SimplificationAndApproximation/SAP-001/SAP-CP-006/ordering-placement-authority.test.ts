import assert from "node:assert/strict";
import { generateSapCp006Editorial } from "./editorial-runtime-v3";

const PROTOTYPE = "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS" as const;
const positionCounts = [0, 0, 0, 0];
const answersByPosition = [new Set<string>(), new Set<string>(), new Set<string>(), new Set<string>()];
let tableCount = 0;
let inlineCount = 0;

for (let seed = 1; seed <= 400; seed += 1) {
  const pkg = generateSapCp006Editorial(PROTOTYPE, seed);
  assert.equal(pkg.validation.ok, true, `${seed}: package validation failed: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.options.length, 4, `${seed}: expected four options.`);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4, `${seed}: duplicate option values.`);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1, `${seed}: expected exactly one correct option.`);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer, `${seed}: correctIndex does not point to canonical answer.`);

  const d = pkg.oracle.data;
  const values = [
    { label: "A", value: d.aVal! },
    { label: "B", value: d.bVal! },
    { label: "C", value: d.cVal! },
    { label: "D", value: d.dVal! },
  ].sort((a, b) => a.value - b.value);
  const independentAnswer = values.map((item) => item.label).join(" < ");
  assert.equal(pkg.canonicalAnswer, independentAnswer, `${seed}: independent ordering mismatch.`);

  positionCounts[pkg.correctIndex]! += 1;
  answersByPosition[pkg.correctIndex]!.add(pkg.canonicalAnswer);

  if (d.tableWrapper === 1) {
    tableCount += 1;
    assert.match(pkg.stem, /small table/i, `${seed}: table-wrapper marker missing from stem.`);
  } else {
    inlineCount += 1;
    assert.doesNotMatch(pkg.stem, /small table/i, `${seed}: inline variant incorrectly marked as table.`);
  }
}

assert.deepEqual(positionCounts, [100, 100, 100, 100], "Ordering answer positions must be exactly balanced across 400 seeds.");
assert.equal(tableCount, 200, "Expected 200 table-wrapper variants across 400 seeds.");
assert.equal(inlineCount, 200, "Expected 200 inline variants across 400 seeds.");
for (let position = 0; position < 4; position += 1) {
  assert.ok(answersByPosition[position]!.size >= 4, `Answer position ${position} remains coupled to too few mathematical orderings.`);
}

console.log("SAP-CP-006 ordering placement authority passed: 400 cases, 100 per A/B/C/D position, independent ordering proof, and 200/200 table-inline coverage.");

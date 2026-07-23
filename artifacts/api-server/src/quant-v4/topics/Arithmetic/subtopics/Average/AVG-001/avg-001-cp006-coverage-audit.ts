import { strict as assert } from "node:assert";
import { equals } from "./foundation/math";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-006");
const expectedModes: Record<string, number> = {
  findClassAverageFromSectionAverages: 8,
  findSuperGroupAverageFromSubgroups: 6,
  findMissingSectionAverage: 6,
  findSectionCountFromOverallAverage: 5,
  findMissingSubgroupCount: 5,
  findSubgroupTotalFromAverageAndCount: 5,
  findOverallTotalFromHierarchy: 5,
  findMissingLowerLevelAverage: 4,
};
const failures: string[] = [];
let cases = 0;

assert.equal(entries.length, 44);
assert.deepEqual(entries.map((entry) => entry.qlId), Array.from({ length: 44 }, (_, index) => `AVG-QL-${String(index + 330).padStart(3, "0")}`));
for (const [mode, count] of Object.entries(expectedModes)) assert.equal(entries.filter((entry) => entry.solveMode === mode).length, count, mode);
assert.equal(new Set(entries.map((entry) => entry.contextDomain)).size >= 6, true);
assert.deepEqual(
  Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length])),
  { Easy: 14, Medium: 15, Hard: 15 },
);

for (const entry of entries) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `avg-cp006-proof:${entry.qlId}:${index}`;
    const pkg = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed });
    cases += 1;
    if (!pkg.validation.valid) failures.push(`${entry.qlId}:${index}: validation failed`);
    if (!equals(pkg.solver.exactAnswer, pkg.independentVerification.exactAnswer)) failures.push(`${entry.qlId}:${index}: verifier mismatch`);
    if (pkg.options.length !== 4 || new Set(pkg.options).size !== 4) failures.push(`${entry.qlId}:${index}: invalid options`);
    if (pkg.options[pkg.correctIndex] !== pkg.answer) failures.push(`${entry.qlId}:${index}: wrong correct index`);
    if (/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem)) failures.push(`${entry.qlId}:${index}: unresolved stem`);
    if (pkg.explanation.lines.length !== 5) failures.push(`${entry.qlId}:${index}: explanation must have five lines`);
    if (!pkg.explanation.lines.some((line) => line.includes(pkg.answer))) failures.push(`${entry.qlId}:${index}: answer missing from explanation`);
    const explanationText = pkg.explanation.lines.join(" ");
    if (/reconstruct|recover|derive|determine|hierarchical resolution|weighted aggregation|solve mode/i.test(explanationText)) failures.push(`${entry.qlId}:${index}: formal/internal wording`);
    if (/;\s*quad|\\quad|,\s*;|;;/.test(explanationText)) failures.push(`${entry.qlId}:${index}: malformed equation text`);
    if (pkg.explanation.lines.some((line) => /^\s*\$\$\s*\$\$\s*$/.test(line))) failures.push(`${entry.qlId}:${index}: empty equation line`);
    const equationLines = pkg.explanation.lines.filter((line) => /\$\$/.test(line));
    if (equationLines.length !== 2) failures.push(`${entry.qlId}:${index}: expected exactly two calculation lines`);
    const values = pkg.parameters.values;
    const counts = values.subgroupCounts ?? [];
    const averages = values.subgroupAverages ?? [];
    if (counts.some((count) => !Number.isInteger(count) || count <= 0)) failures.push(`${entry.qlId}:${index}: invalid subgroup count`);
    if (averages.some((value) => value.numerator <= 0 || value.denominator <= 0)) failures.push(`${entry.qlId}:${index}: invalid subgroup average`);
    if (values.overallCount !== counts.reduce((sum, count) => sum + count, 0)) failures.push(`${entry.qlId}:${index}: overall count mismatch`);
    if (values.hierarchyDepth !== 1 && values.hierarchyDepth !== 2) failures.push(`${entry.qlId}:${index}: invalid hierarchy depth`);
  }
}

for (const language of ["hi", "pa"] as const) {
  assert.throws(() => runAvg001Pipeline({ questionLanguageId: "AVG-QL-330", seed: "unsupported", language }), /English only/);
}

console.log(JSON.stringify({ qlCount: entries.length, cases, modeCounts: expectedModes, failureCount: failures.length, failures: failures.slice(0, 100), status: failures.length ? "FAIL" : "PASS" }, null, 2));
assert.equal(cases, 528);
assert.equal(failures.length, 0, failures.join("\n"));

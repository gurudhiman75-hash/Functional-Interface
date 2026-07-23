import { strict as assert } from "node:assert";
import { equals } from "./foundation/math";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter((entry) => Number(entry.qlId.slice(-3)) >= 374);
const expectedModes: Record<string, number> = {
  findAverageAfterUniformTransformation: 8,
  findTermCountFromAverageAndExtreme: 6,
  findCommonDifferenceFromAverageCountAndExtreme: 6,
  findOriginalCountFromJoiningMemberShift: 6,
  findOriginalCountFromLeavingMemberShift: 6,
  findGroupCountRatioFromCombinedAverage: 8,
  findAverageSpeedForUnequalDistances: 6,
  findAverageSpeedForUnequalTimes: 6,
};
const failures: string[] = [];
let cases = 0;
assert.equal(entries.length, 52);
assert.deepEqual(entries.map((entry) => entry.qlId), Array.from({ length: 52 }, (_, index) => `AVG-QL-${String(index + 374).padStart(3, "0")}`));
for (const [mode, count] of Object.entries(expectedModes)) assert.equal(entries.filter((entry) => entry.solveMode === mode).length, count, mode);
for (const entry of entries) {
  const placeholders = [...entry.template.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!);
  assert.deepEqual([...new Set(placeholders)].sort(), [...entry.requiredVariables].sort(), `${entry.qlId}: placeholder contract`);
  for (let index = 0; index < 12; index += 1) {
    const pkg = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed: `avg-gap-proof:${entry.qlId}:${index}` });
    cases += 1;
    if (!pkg.validation.valid) failures.push(`${entry.qlId}:${index}: validation`);
    if (!equals(pkg.solver.exactAnswer, pkg.independentVerification.exactAnswer)) failures.push(`${entry.qlId}:${index}: verifier mismatch`);
    if (pkg.options.length !== 4 || new Set(pkg.options).size !== 4) failures.push(`${entry.qlId}:${index}: option uniqueness`);
    if (pkg.options[pkg.correctIndex] !== pkg.answer) failures.push(`${entry.qlId}:${index}: correct index`);
    if (/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem)) failures.push(`${entry.qlId}:${index}: unresolved stem`);
    if (pkg.explanation.lines.length !== 5) failures.push(`${entry.qlId}:${index}: explanation lines`);
    if (pkg.explanation.lines.filter((line) => /\$\$/.test(line)).length !== 2) failures.push(`${entry.qlId}:${index}: calculation lines`);
    if (/reconstruct|recover|derive|determine|solve mode|weighted aggregation/i.test(pkg.explanation.lines.join(" "))) failures.push(`${entry.qlId}:${index}: formal wording`);
    if (pkg.parameters.answerType === "COUNT" && (!Number.isInteger(pkg.solver.exactAnswer.numerator / pkg.solver.exactAnswer.denominator) || pkg.solver.exactAnswer.numerator <= 0)) failures.push(`${entry.qlId}:${index}: invalid count`);
    if (pkg.parameters.answerType === "RATIO" && !/^\d+:\d+$/.test(pkg.answer)) failures.push(`${entry.qlId}:${index}: invalid ratio display`);
  }
}
for (const language of ["hi", "pa"] as const) assert.throws(() => runAvg001Pipeline({ questionLanguageId: "AVG-QL-374", seed: "unsupported", language }), /English only/);
console.log(JSON.stringify({ qlCount: entries.length, cases, modeCounts: expectedModes, failures: failures.slice(0, 100), failureCount: failures.length, status: failures.length ? "FAIL" : "PASS" }, null, 2));
assert.equal(cases, 624);
assert.equal(failures.length, 0, failures.join("\n"));

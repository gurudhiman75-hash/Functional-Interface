import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import {
  add,
  divide,
  equals,
  multiply,
  rational,
  subtract,
  toNumber,
} from "./foundation/math";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-004",
);
const failures: string[] = [];
let cases = 0;
let weightedCases = 0;
let speedCases = 0;

for (const entry of entries) {
  for (let index = 0; index < 12; index += 1) {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-cp004-validity:${entry.qlId}:${index}`,
    });
    cases += 1;
    const values = pkg.parameters.values;

    if (!pkg.validation.valid) failures.push(`${entry.qlId}:${index}: package validation failed`);
    if (pkg.options.length !== 4 || new Set(pkg.options).size !== 4 || pkg.options[pkg.correctIndex] !== pkg.answer) {
      failures.push(`${entry.qlId}:${index}: invalid options`);
    }
    if (/undefined|NaN|Infinity|null|\{[A-Za-z]/.test(pkg.stem)) {
      failures.push(`${entry.qlId}:${index}: unresolved stem`);
    }

    if (entry.solveMode === "findAverageSpeedEqualDistance" || entry.solveMode === "findAverageSpeedEqualTime") {
      speedCases += 1;
      const speed1 = values.speed1!;
      const speed2 = values.speed2!;
      const expected = entry.solveMode === "findAverageSpeedEqualDistance"
        ? divide(multiply(rational(2), multiply(speed1, speed2)), add(speed1, speed2))
        : divide(add(speed1, speed2), rational(2));
      if (!equals(expected, pkg.solver.exactAnswer)) failures.push(`${entry.qlId}:${index}: speed formula mismatch`);
      const answer = toNumber(pkg.solver.exactAnswer);
      if (answer < Math.min(toNumber(speed1), toNumber(speed2)) || answer > Math.max(toNumber(speed1), toNumber(speed2))) {
        failures.push(`${entry.qlId}:${index}: speed answer outside bounds`);
      }
      continue;
    }

    weightedCases += 1;
    const counts = values.groupCounts ?? [];
    const averages = values.groupAverages ?? [];
    const totals = values.groupTotals ?? [];
    const combinedCount = counts.reduce((sum, value) => sum + value, 0);
    const combinedTotal = totals.reduce(add, rational(0));
    const combinedAverage = divide(combinedTotal, rational(combinedCount));

    if (counts.length < 2 || counts.some((count) => !Number.isInteger(count) || count <= 0)) failures.push(`${entry.qlId}:${index}: invalid group counts`);
    if (averages.length !== counts.length || totals.length !== counts.length) failures.push(`${entry.qlId}:${index}: incomplete weighted state`);
    if (!equals(combinedAverage, values.combinedAverage!)) failures.push(`${entry.qlId}:${index}: combined average mismatch`);
    if (!equals(combinedTotal, values.combinedTotal!)) failures.push(`${entry.qlId}:${index}: combined total mismatch`);

    const numericAverages = averages.map(toNumber);
    const numericCombined = toNumber(values.combinedAverage!);
    if (numericCombined < Math.min(...numericAverages) || numericCombined > Math.max(...numericAverages)) {
      failures.push(`${entry.qlId}:${index}: combined average outside group bounds`);
    }

    if (entry.solveMode === "findGroupCountFromCombinedAverage") {
      const expected = divide(
        multiply(rational(values.knownGroupCount!), subtract(values.combinedAverage!, values.knownGroupAverage!)),
        subtract(values.unknownGroupAverage!, values.combinedAverage!),
      );
      if (!equals(expected, pkg.solver.exactAnswer)) failures.push(`${entry.qlId}:${index}: unknown count mismatch`);
    }

    if (entry.solveMode === "findMissingGroupAverage") {
      const requiredTotal = multiply(values.combinedAverage!, rational(values.combinedCount!));
      const knownTotal = multiply(values.knownGroupAverage!, rational(values.knownGroupCount!));
      const expected = divide(subtract(requiredTotal, knownTotal), rational(values.unknownGroupCount!));
      if (!equals(expected, pkg.solver.exactAnswer)) failures.push(`${entry.qlId}:${index}: missing group average mismatch`);
    }
  }
}

console.log(JSON.stringify({
  qlCount: entries.length,
  cases,
  weightedCases,
  speedCases,
  failureCount: failures.length,
  failures: failures.slice(0, 100),
  status: failures.length ? "FAIL" : "PASS",
}, null, 2));

assert.equal(cases, 780);
assert.equal(weightedCases, 600);
assert.equal(speedCases, 180);
assert.equal(failures.length, 0, failures.join("\n"));

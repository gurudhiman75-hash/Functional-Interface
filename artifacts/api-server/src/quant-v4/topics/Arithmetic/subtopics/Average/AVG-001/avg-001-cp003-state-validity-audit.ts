import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { add, divide, equals, multiply, rational, subtract, toNumber } from "./foundation/math";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-003",
);
const failures: string[] = [];
let cases = 0;
let ageShiftCases = 0;
let cricketCases = 0;

for (const entry of entries) {
  for (let index = 0; index < 12; index += 1) {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-cp003-validity:${entry.qlId}:${index}`,
    });
    cases += 1;
    const v = pkg.parameters.values;
    const oldCount = v.oldCount ?? v.count;
    const newCount = v.newCount ?? oldCount;
    const currentAverage = v.currentAverage ?? v.average;
    const currentTotal = multiply(currentAverage, rational(oldCount));
    const newTotal = multiply(v.newAverage!, rational(newCount));

    if (!pkg.validation.valid) {
      failures.push(`${entry.qlId}:${index}: package validation failed`);
    }

    const isAgeShift =
      entry.scenarioVariant.includes("AfterYears") ||
      entry.scenarioVariant.includes("ElapsedYears");
    if (isAgeShift) {
      ageShiftCases += 1;
      const shifted = add(
        v.oldAverage ?? v.average,
        rational(v.yearsElapsed ?? 0),
      );
      if (!equals(shifted, currentAverage)) {
        failures.push(`${entry.qlId}:${index}: elapsed age shift is wrong`);
      }
    }

    switch (entry.solveMode) {
      case "findNewAverageAfterAddition":
      case "findAddedMemberValueFromShift":
        if (newCount !== oldCount + 1) {
          failures.push(`${entry.qlId}:${index}: addition count mismatch`);
        }
        if (
          !equals(
            newTotal,
            add(currentTotal, v.addedValue!),
          )
        ) {
          failures.push(`${entry.qlId}:${index}: addition total mismatch`);
        }
        break;
      case "findNewAverageAfterRemoval":
      case "findRemovedMemberValueFromShift":
        if (newCount !== oldCount - 1) {
          failures.push(`${entry.qlId}:${index}: removal count mismatch`);
        }
        if (
          !equals(
            newTotal,
            subtract(currentTotal, v.removedValue!),
          )
        ) {
          failures.push(`${entry.qlId}:${index}: removal total mismatch`);
        }
        break;
      case "findNewAverageAfterReplacement":
      case "findReplacementValueFromShift":
        if (newCount !== oldCount) {
          failures.push(`${entry.qlId}:${index}: replacement count mismatch`);
        }
        if (
          !equals(
            newTotal,
            add(subtract(currentTotal, v.oldValue!), v.newValue!),
          )
        ) {
          failures.push(`${entry.qlId}:${index}: replacement total mismatch`);
        }
        break;
      case "findInningsValueOrNewCricketAverage":
        cricketCases += 1;
        if (newCount !== oldCount + 1) {
          failures.push(`${entry.qlId}:${index}: cricket innings count mismatch`);
        }
        if (!equals(newTotal, add(currentTotal, v.nextScore!))) {
          failures.push(`${entry.qlId}:${index}: cricket run total mismatch`);
        }
        break;
    }

    const answerNumber = toNumber(pkg.solver.exactAnswer);
    if (!Number.isFinite(answerNumber) || answerNumber < 0) {
      failures.push(`${entry.qlId}:${index}: invalid non-finite/negative answer`);
    }
    if (pkg.options.length !== 4 || new Set(pkg.options).size !== 4) {
      failures.push(`${entry.qlId}:${index}: invalid options`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      cases,
      ageShiftCases,
      cricketCases,
      failureCount: failures.length,
      failures: failures.slice(0, 100),
    },
    null,
    2,
  ),
);
assert.equal(cases, 1176);
assert.equal(ageShiftCases, 216);
assert.equal(cricketCases, 144);
assert.equal(failures.length, 0, failures.join("\n"));

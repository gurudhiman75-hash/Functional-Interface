import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import {
  add,
  divide,
  equals,
  isInteger,
  multiply,
  rational,
} from "./foundation/math";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-002",
);
const failures: string[] = [];
let cases = 0;

for (const entry of entries) {
  for (let index = 0; index < 12; index += 1) {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-ap-validity:${entry.qlId}:${index}`,
    });
    cases += 1;

    const {
      count,
      average,
      firstTerm,
      lastTerm,
      middleTerm,
      lowerMiddleTerm,
      upperMiddleTerm,
      commonDifference,
      targetExtreme,
      sequenceParity,
    } = pkg.parameters.values;

    if (
      entry.solveMode === "findTermCountFromAverageAndExtreme" ||
      entry.solveMode === "findCommonDifferenceFromAverageCountAndExtreme"
    ) {
      if (!commonDifference || !isInteger(commonDifference) || commonDifference.numerator <= 0) {
        failures.push(`${entry.qlId}:${index}: invalid reverse-AP common difference`);
        continue;
      }
      if (!Number.isInteger(count) || count < 3 || count % 2 === 0) {
        failures.push(`${entry.qlId}:${index}: reverse-AP count must be a positive odd integer`);
        continue;
      }

      const extremeValue = Number(pkg.parameters.renderVariables.extremeValue);
      const averageValue = average.numerator / average.denominator;
      const differenceValue = commonDifference.numerator / commonDifference.denominator;
      const oneSideGaps = (count - 1) / 2;
      const expectedDistance = oneSideGaps * differenceValue;
      if (Math.abs(Math.abs(extremeValue - averageValue) - expectedDistance) > 1e-9) {
        failures.push(`${entry.qlId}:${index}: reverse-AP extreme distance mismatch`);
      }

      if (entry.solveMode === "findTermCountFromAverageAndExtreme") {
        const expectedCount = (2 * Math.abs(extremeValue - averageValue)) / differenceValue + 1;
        if (!Number.isInteger(expectedCount) || pkg.solver.exactAnswer.numerator !== expectedCount || pkg.solver.exactAnswer.denominator !== 1) {
          failures.push(`${entry.qlId}:${index}: reverse term-count answer mismatch`);
        }
      } else {
        const expectedDifference = (2 * Math.abs(extremeValue - averageValue)) / (count - 1);
        if (Math.abs(expectedDifference - differenceValue) > 1e-9 || !equals(pkg.solver.exactAnswer, commonDifference)) {
          failures.push(`${entry.qlId}:${index}: reverse common-difference answer mismatch`);
        }
      }
      continue;
    }

    if (
      !firstTerm ||
      !lastTerm ||
      !middleTerm ||
      !lowerMiddleTerm ||
      !upperMiddleTerm ||
      !commonDifference
    ) {
      failures.push(`${entry.qlId}:${index}: incomplete AP state`);
      continue;
    }

    const expectedLast = add(
      firstTerm,
      multiply(commonDifference, rational(count - 1)),
    );
    if (!equals(lastTerm, expectedLast)) {
      failures.push(`${entry.qlId}:${index}: invalid last-term formula`);
    }

    const endpointAverage = divide(add(firstTerm, lastTerm), rational(2));
    if (!equals(average, endpointAverage)) {
      failures.push(`${entry.qlId}:${index}: endpoint mean mismatch`);
    }

    const terms = Array.from({ length: count }, (_, termIndex) =>
      add(firstTerm, multiply(commonDifference, rational(termIndex))),
    );
    const total = terms.reduce((sum, term) => add(sum, term), rational(0));
    const enumeratedAverage = divide(total, rational(count));
    if (!equals(average, enumeratedAverage)) {
      failures.push(`${entry.qlId}:${index}: enumerated mean mismatch`);
    }

    if (
      entry.solveMode === "findMiddleTermFromAverage" &&
      (count % 2 === 0 ||
        !equals(middleTerm, terms[Math.floor(count / 2)]!) ||
        !equals(pkg.solver.exactAnswer, middleTerm))
    ) {
      failures.push(`${entry.qlId}:${index}: invalid middle-term state`);
    }

    if (entry.solveMode === "findExtremeFromAverageAndCount") {
      const expected =
        targetExtreme === "smallest" ? terms[0]! : terms[terms.length - 1]!;
      if (!equals(pkg.solver.exactAnswer, expected)) {
        failures.push(`${entry.qlId}:${index}: extreme answer mismatch`);
      }
    }

    if (sequenceParity !== "any") {
      const required = sequenceParity === "even" ? 0 : 1;
      if (
        !terms.every(
          (term) =>
            isInteger(term) &&
            Math.abs(term.numerator % 2) === required,
        )
      ) {
        failures.push(`${entry.qlId}:${index}: parity mismatch`);
      }
    }

    if (
      entry.solveMode === "findAverageOfOddOrEvenSet" &&
      commonDifference.numerator !== 2
    ) {
      failures.push(`${entry.qlId}:${index}: odd/even sequence step is not 2`);
    }

    if (entry.difficulty !== "Hard" && count > 15) {
      failures.push(`${entry.qlId}:${index}: sequence too long for ${entry.difficulty}`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      cases,
      failureCount: failures.length,
      failures: failures.slice(0, 100),
    },
    null,
    2,
  ),
);

assert.equal(entries.length, 62);
assert.equal(cases, 744);
assert.equal(failures.length, 0, failures.join("\n"));

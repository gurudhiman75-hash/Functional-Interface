import {
  divide,
  formatRational,
  multiply,
  rational,
  subtract,
} from "./math";
import type {
  Avg001IndependentVerification,
  Avg001Parameters,
} from "./types";

export function independentlyVerifyAvg001(
  parameters: Avg001Parameters,
): Avg001IndependentVerification {
  const values = parameters.values;
  let exactAnswer;
  let method;

  switch (parameters.solveMode) {
    case "findSumFromAverageAndCount":
      exactAnswer = rational(
        values.average.numerator * values.count,
        values.average.denominator,
      );
      method = "Independent repeated-equal-share reconstruction";
      break;
    case "findAverageFromSumAndCount":
      exactAnswer = rational(
        values.total.numerator,
        values.total.denominator * values.count,
      );
      method = "Independent total partition across observations";
      break;
    case "findCountFromSumAndAverage":
      exactAnswer = divide(values.total, values.average);
      method = "Independent quotient of total by one-observation mean";
      break;
    case "findMissingValueFromAverage":
      if (!values.knownTotal) {
        throw new Error("Verifier missing known total");
      }
      exactAnswer = subtract(
        multiply(values.average, rational(values.count)),
        values.knownTotal,
      );
      method = "Independent required-total minus known-total reconstruction";
      break;
    default:
      throw new Error(
        `Independent verifier unsupported solve mode: ${parameters.solveMode}`,
      );
  }

  return {
    supported: true,
    exactAnswer,
    displayAnswer: formatRational(exactAnswer, parameters.displayPolicy),
    method,
  };
}

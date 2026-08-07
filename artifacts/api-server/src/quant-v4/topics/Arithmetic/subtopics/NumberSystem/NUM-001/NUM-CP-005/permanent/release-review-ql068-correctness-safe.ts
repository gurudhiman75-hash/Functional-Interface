import {
  buildOptions,
  divisorCountFromState,
  oddDivisorCountFromState,
  primePowers,
  squareDivisorCountFromState,
  wrong,
} from "./english-remediation-common";

function secondState(hiddenState) {
  return Array.isArray(hiddenState.secondFactorState)
    ? hiddenState.secondFactorState.map((entry) => ({
      prime: Number(entry?.prime),
      exponent: Number(entry?.exponent),
    }))
    : [];
}

function metricCount(state, metricKind) {
  if (metricKind === "ODD_DIVISORS") return oddDivisorCountFromState(state);
  if (metricKind === "SQUARE_DIVISORS") return squareDivisorCountFromState(state);
  return divisorCountFromState(state);
}

function outcome(first, second) {
  if (first > second) return "Number A";
  if (first < second) return "Number B";
  return "They are equal";
}

function optionText(first, second, result) {
  return `A has ${first} and B has ${second}; ${result}.`;
}

export function applyNumCp005Ql068CorrectnessSafe(source, result) {
  const firstState = primePowers(source.hiddenState);
  const secondFactorState = secondState(source.hiddenState);
  const metricKind = String(source.hiddenState.metricKind);
  const first = metricCount(firstState, metricKind);
  const second = metricCount(secondFactorState, metricKind);
  const correctOutcome = outcome(first, second);
  const correct = optionText(first, second, correctOutcome);

  const alternatives = [
    wrong(
      optionText(second, first, outcome(second, first)),
      "NUM-CP005-TRAP-SWAPPED-A-B-COUNTS",
      "This swaps the calculated values of Number A and Number B.",
    ),
    wrong(
      optionText(first, second, correctOutcome === "Number A" ? "Number B" : "Number A"),
      "NUM-CP005-TRAP-WRONG-COMPARISON-AFTER-CORRECT-COUNTS",
      "The two counts are correct, but the comparison conclusion is wrong.",
    ),
    wrong(
      optionText(first + 1, second, outcome(first + 1, second)),
      "NUM-CP005-TRAP-FIRST-COUNT-ONE-TOO-HIGH",
      "The count for Number A is one too high.",
    ),
    wrong(
      optionText(first, second + 1, outcome(first, second + 1)),
      "NUM-CP005-TRAP-SECOND-COUNT-ONE-TOO-HIGH",
      "The count for Number B is one too high.",
    ),
    wrong(
      optionText(Math.max(1, first - 1), second, outcome(Math.max(1, first - 1), second)),
      "NUM-CP005-TRAP-FIRST-COUNT-ONE-TOO-LOW",
      "The count for Number A is one too low.",
    ),
    wrong(
      optionText(first, Math.max(1, second - 1), outcome(first, Math.max(1, second - 1))),
      "NUM-CP005-TRAP-SECOND-COUNT-ONE-TOO-LOW",
      "The count for Number B is one too low.",
    ),
  ];

  const options = buildOptions(correct, alternatives, result.correctIndex);
  const difficulty = metricKind === "SQUARE_DIVISORS"
    ? "MEDIUM"
    : firstState.length + secondFactorState.length <= 4
      ? "EASY"
      : "MEDIUM";

  return {
    ...result,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    difficulty,
    hiddenState: {
      ...source.hiddenState,
      firstMetricValue: first,
      secondMetricValue: second,
      comparisonOutcome: correctOutcome,
    },
  };
}

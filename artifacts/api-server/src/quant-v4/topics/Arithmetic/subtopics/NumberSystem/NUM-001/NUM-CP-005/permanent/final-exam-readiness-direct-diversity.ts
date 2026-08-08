import {
  buildOptions,
  divisorCountFromState,
  divisorsFromState,
  factorMath,
  setText,
  wrong,
} from "./english-remediation-common";

const DIVISOR_SET_STATES = [
  [{ prime: 2, exponent: 1 }],
  [{ prime: 3, exponent: 1 }],
  [{ prime: 2, exponent: 2 }],
  [{ prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 1 }, { prime: 3, exponent: 1 }],
  [{ prime: 3, exponent: 2 }],
  [{ prime: 2, exponent: 3 }],
  [{ prime: 2, exponent: 1 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 1 }],
  [{ prime: 3, exponent: 1 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 4 }],
  [{ prime: 2, exponent: 1 }, { prime: 3, exponent: 2 }],
  [{ prime: 2, exponent: 2 }, { prime: 5, exponent: 1 }],
  [{ prime: 3, exponent: 3 }],
  [{ prime: 2, exponent: 1 }, { prime: 3, exponent: 1 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 3 }, { prime: 3, exponent: 1 }],
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 2 }],
  [{ prime: 2, exponent: 1 }, { prime: 7, exponent: 1 }],
  [{ prime: 5, exponent: 2 }],
  [{ prime: 2, exponent: 1 }, { prime: 3, exponent: 1 }, { prime: 7, exponent: 1 }],
] as const;

const ORDERED_DIVISOR_STATES = [
  [{ prime: 2, exponent: 3 }, { prime: 3, exponent: 1 }],
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 2 }],
  [{ prime: 2, exponent: 4 }, { prime: 3, exponent: 1 }],
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 1 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 3 }, { prime: 3, exponent: 2 }],
  [{ prime: 2, exponent: 1 }, { prime: 3, exponent: 1 }, { prime: 5, exponent: 1 }, { prime: 7, exponent: 1 }],
  [{ prime: 2, exponent: 5 }, { prime: 3, exponent: 1 }],
  [{ prime: 2, exponent: 3 }, { prime: 3, exponent: 1 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 3 }],
  [{ prime: 2, exponent: 4 }, { prime: 5, exponent: 1 }],
  [{ prime: 3, exponent: 3 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 2 }, { prime: 5, exponent: 2 }],
  [{ prime: 2, exponent: 1 }, { prime: 3, exponent: 2 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 3 }, { prime: 5, exponent: 2 }],
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 1 }, { prime: 7, exponent: 1 }],
  [{ prime: 2, exponent: 4 }, { prime: 3, exponent: 2 }],
  [{ prime: 2, exponent: 1 }, { prime: 3, exponent: 3 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 3 }, { prime: 3, exponent: 1 }, { prime: 7, exponent: 1 }],
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 2 }, { prime: 5, exponent: 1 }],
  [{ prime: 3, exponent: 4 }, { prime: 5, exponent: 1 }],
] as const;

function integerFromState(state) {
  return state.reduce((value, { prime, exponent }) => value * prime ** exponent, 1);
}

function optionSet(correct, candidates, correctIndex) {
  return buildOptions(
    correct,
    candidates.map(({ value, id, reason }) => wrong(value, id, reason)),
    correctIndex,
  );
}

export function applyNumCp005FinalQl053Diversity(source, result) {
  const state = DIVISOR_SET_STATES[(source.seed - 1) % DIVISOR_SET_STATES.length]
    .map((entry) => ({ ...entry }));
  const divisors = divisorsFromState(state);
  const n = integerFromState(state);
  const correct = setText(divisors.map(String));
  const withoutOne = setText(divisors.filter((value) => value !== 1).map(String));
  const withoutNumber = setText(divisors.filter((value) => value !== n).map(String));
  const withExtra = setText([...divisors, n + 1].map(String));
  const properPlusZero = setText([0, ...divisors.filter((value) => value !== n)].map(String));
  const options = optionSet(correct, [
    {
      value: withoutOne,
      id: "NUM-CP005-TRAP-OMITTED-ONE",
      reason: "1 is a positive divisor of every positive integer.",
    },
    {
      value: withoutNumber,
      id: "NUM-CP005-TRAP-LISTED-ONLY-PROPER-DIVISORS",
      reason: "The question asks for all positive divisors, so n itself must be included.",
    },
    {
      value: withExtra,
      id: "NUM-CP005-TRAP-INCLUDED-NON-DIVISOR",
      reason: `${n + 1} does not divide ${n}.`,
    },
    {
      value: properPlusZero,
      id: "NUM-CP005-TRAP-INCLUDED-ZERO",
      reason: "0 is not a positive divisor.",
    },
  ], result.correctIndex);
  const difficulty = divisors.length <= 4 ? "EASY" : divisors.length <= 9 ? "MEDIUM" : "HARD";
  return {
    ...result,
    stem: `The prime factorisation is ${factorMath(state)}. Select the complete set of positive divisors of n.`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...source.hiddenState,
      factorState: state,
      factorisation: state.map(({ prime, exponent }) => exponent === 1 ? String(prime) : `${prime}^${exponent}`).join(" × "),
      integerValue: String(n),
      divisorSet: divisors.map(String),
      divisorCount: divisors.length,
    },
    difficulty,
    mathematicalFingerprint: `NUM-QL-053|${state.map(({ prime, exponent }) => `${prime}^${exponent}`).join("|")}`,
  };
}

export function applyNumCp005FinalQl059Diversity(source, result) {
  const state = ORDERED_DIVISOR_STATES[(source.seed - 1) % ORDERED_DIVISOR_STATES.length]
    .map((entry) => ({ ...entry }));
  const divisors = divisorsFromState(state);
  const n = integerFromState(state);
  const interiorCount = Math.max(1, divisors.length - 4);
  const requestedIndex = 3 + ((source.seed - 1) % interiorCount);
  const correctValue = divisors[requestedIndex - 1];
  const previous = divisors[Math.max(0, requestedIndex - 2)];
  const next = divisors[Math.min(divisors.length - 1, requestedIndex)];
  const paired = n / correctValue;
  const options = optionSet(String(correctValue), [
    {
      value: String(previous),
      id: "NUM-CP005-TRAP-USED-PREVIOUS-POSITION",
      reason: `This is the divisor at position ${requestedIndex - 1}.`,
    },
    {
      value: String(next),
      id: "NUM-CP005-TRAP-USED-NEXT-POSITION",
      reason: `This is the divisor at position ${requestedIndex + 1}.`,
    },
    {
      value: String(paired),
      id: "NUM-CP005-TRAP-USED-PAIRED-DIVISOR",
      reason: `This is paired with ${correctValue} because their product is ${n}.`,
    },
    {
      value: String(requestedIndex),
      id: "NUM-CP005-TRAP-RETURNED-POSITION-NUMBER",
      reason: "The position number is not necessarily the divisor at that position.",
    },
    {
      value: String(n),
      id: "NUM-CP005-TRAP-RETURNED-LARGEST-DIVISOR",
      reason: "n is the last divisor, not the requested middle divisor.",
    },
  ], result.correctIndex);
  const difficulty = divisors.length <= 10 ? "MEDIUM" : "HARD";
  return {
    ...result,
    stem: `The positive divisors of ${factorMath(state)} are arranged in increasing order. What is the divisor at position ${requestedIndex}?`,
    options,
    canonicalAnswer: String(correctValue),
    verifierAnswer: String(correctValue),
    hiddenState: {
      ...source.hiddenState,
      factorState: state,
      factorisation: state.map(({ prime, exponent }) => exponent === 1 ? String(prime) : `${prime}^${exponent}`).join(" × "),
      integerValue: String(n),
      orderedDivisors: divisors.map(String),
      divisorCount: divisors.length,
      requestedIndex,
      orderedDivisor: String(correctValue),
    },
    difficulty,
    mathematicalFingerprint: `NUM-QL-059|${state.map(({ prime, exponent }) => `${prime}^${exponent}`).join("|")}|${requestedIndex}`,
  };
}

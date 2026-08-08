import {
  EMPTY_SET,
  buildOptions,
  math,
  setText,
  wrong,
} from "./english-remediation-common";

const ODD_PRIME_POOLS = [
  [3, 5],
  [3, 5, 7],
  [5, 7],
  [3, 7, 11],
  [5, 7, 11],
];

export function applyNumCp005FinalQl066Safe(source, result) {
  const index = source.seed - 1;
  const b = index % 5;
  const a = (index * 2 + Math.floor(index / 5)) % 6;
  const primes = ODD_PRIME_POOLS[index % ODD_PRIME_POOLS.length];
  const oddDivisors = b + 1;
  const invalid = index % 4 === 2;
  const totalDivisors = invalid
    ? b === 0
      ? 7
      : (a + 1) * oddDivisors + 1
    : (a + 1) * oddDivisors;
  const possibleIntegers = invalid
    ? []
    : [...new Set(primes.map((prime) => 2 ** a * prime ** b))].sort((left, right) => left - right);
  const correct = setText(possibleIntegers.map(String));
  const derivedA = totalDivisors / oddDivisors - 1;
  const safeA = Number.isInteger(derivedA)
    ? Math.max(0, Math.min(5, derivedA))
    : Math.max(0, Math.min(5, Math.floor(derivedA)));
  const forced = [...new Set(primes.map((prime) => 2 ** safeA * prime ** b))].sort((left, right) => left - right);
  const ignoredTwo = [...new Set(primes.map((prime) => prime ** b))].sort((left, right) => left - right);
  const doubled = [...new Set(forced.map((value) => value * 2))];
  const wrongCandidates = [
    wrong(
      setText(forced.map(String)),
      "NUM-CP005-TRAP-FORCED-INVALID-EXPONENT",
      "This forces a value of a even when the divisor equations do not allow it.",
    ),
    wrong(
      setText(ignoredTwo.map(String)),
      "NUM-CP005-TRAP-IGNORED-POWER-OF-TWO",
      "The recovered power of 2 has been left out.",
    ),
    wrong(
      setText(doubled.map(String)),
      "NUM-CP005-TRAP-ADDED-EXTRA-FACTOR-TWO",
      "An extra factor 2 was included after finding a.",
    ),
    wrong(
      setText(forced.slice(0, 1).map(String)),
      "NUM-CP005-TRAP-TESTED-ONLY-ONE-ALLOWED-PRIME",
      "Only one permitted odd prime was tested.",
    ),
    wrong(
      invalid ? "{1}" : EMPTY_SET,
      "NUM-CP005-TRAP-WRONG-EXISTENCE-DECISION",
      invalid ? "The exponent equations do not allow the value 1." : "The exponent equations do have valid solutions.",
    ),
    wrong(
      "{2}",
      "NUM-CP005-TRAP-ASSUMED-SINGLE-FACTOR-TWO",
      "This assumes n=2 without satisfying both divisor-count equations.",
    ),
    wrong(
      "{3,5}",
      "NUM-CP005-TRAP-USED-PRIMES-INSTEAD-OF-VALUES",
      "This lists allowed primes instead of substituting the recovered exponents.",
    ),
    wrong(
      "{1,2}",
      "NUM-CP005-TRAP-MIXED-VALID-AND-INVALID-VALUES",
      "This includes a value that does not satisfy both divisor conditions.",
    ),
    wrong(
      "{2,4}",
      "NUM-CP005-TRAP-USED-POWERS-OF-TWO-ONLY",
      "This ignores the role of the allowed odd prime.",
    ),
    wrong(
      String(totalDivisors),
      "NUM-CP005-TRAP-RETURNED-DIVISOR-COUNT",
      "The answer must be a set of possible integers, not the divisor count.",
    ),
  ];
  const options = buildOptions(correct, wrongCandidates, result.correctIndex);
  const difficulty = invalid || b === 0
    ? "EASY"
    : possibleIntegers.length <= 2 && b <= 2
      ? "MEDIUM"
      : "HARD";

  return {
    ...result,
    stem: `A number is ${math("n=2^{a}p^{b}")}, where ${math("0\\le a\\le5")}, ${math("0\\le b\\le4")} and ${math(`p\\in\\{${primes.join(",")}\\}`)}. It has ${totalDivisors} positive divisors and ${oddDivisors} odd positive ${oddDivisors === 1 ? "divisor" : "divisors"}. Which set contains all possible values of n?`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...source.hiddenState,
      factorState: [],
      totalDivisors,
      oddDivisors,
      oddPrimes: primes,
      possibleIntegers: possibleIntegers.map(String),
      solutionClass: possibleIntegers.length === 0
        ? "No solution"
        : possibleIntegers.length === 1
          ? "Unique solution"
          : "Multiple solutions",
    },
    difficulty,
    mathematicalFingerprint: `NUM-QL-066|${totalDivisors}|${oddDivisors}|${primes.join("-")}|${correct}`,
  };
}

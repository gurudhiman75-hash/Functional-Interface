import {
  EMPTY_SET,
  buildOptions,
  divisorCountFromState,
  factorExpression,
  factorMath,
  geometricSum,
  math,
  oddDivisorCountFromState,
  pairSetText,
  primePowers,
  secondPrimePowers,
  setText,
  squareDivisorCountFromState,
  wrong,
} from "./english-remediation-common";

const PRIME_POOL = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
const ODD_PRIME_POOLS = [
  [3, 5],
  [3, 5, 7],
  [5, 7],
  [3, 7, 11],
  [5, 7, 11],
];

const QL064_TARGETS = [
  6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24,
  25, 27, 28, 30, 32, 35, 36, 40, 42, 45, 48, 49,
];

const QL067_EXPONENTS = [
  [1, 1], [1, 2], [1, 3], [1, 4], [1, 5],
  [1, 6], [2, 2], [2, 3], [2, 4], [2, 5],
  [2, 6], [3, 3], [3, 4], [3, 5], [3, 6],
  [4, 4], [4, 5], [4, 6], [5, 5], [5, 6],
  [6, 6], [7, 2], [7, 3], [7, 4], [7, 5],
];

const DS_OPTIONS = [
  "Statement I alone is sufficient, but Statement II alone is not.",
  "Statement II alone is sufficient, but Statement I alone is not.",
  "Both statements together are sufficient, but neither statement alone is sufficient.",
  "Even both statements together are not sufficient.",
];

function factorPairs(value) {
  const pairs = [];
  for (let left = 1; left <= value; left += 1) {
    if (value % left === 0) pairs.push([left, value / left]);
  }
  return pairs;
}

function factorStateText(state) {
  return state
    .map(({ prime, exponent }) => exponent === 1 ? String(prime) : `${prime}^${exponent}`)
    .join(" × ");
}

function exponentPairFingerprint(pairs) {
  return pairs.map(([x, y]) => `${x}:${y}`).join("|") || "none";
}

function optionSet(correct, values, correctIndex) {
  return buildOptions(
    correct,
    values.map(({ value, id, reason }) => wrong(value, id, reason)),
    correctIndex,
  );
}

function ql055(source, result) {
  const index = (source.seed - 1) % PRIME_POOL.length;
  const prime = PRIME_POOL[index];
  const target = 2 + ((source.seed - 1) % 11);
  const exponent = target - 1;
  const correct = math(exponent === 1 ? String(prime) : `${prime}^{${exponent}}`);
  const lower = exponent === 1 ? math("1") : math(`${prime}^{${exponent - 1}}`);
  const options = optionSet(correct, [
    {
      value: math(`${prime}^{${target}}`),
      id: "NUM-CP005-TRAP-USED-DIVISOR-COUNT-AS-EXPONENT",
      reason: `This power has ${target + 1} divisors, not ${target}.`,
    },
    {
      value: lower,
      id: "NUM-CP005-TRAP-EXPONENT-ONE-TOO-SMALL",
      reason: "The exponent is one smaller than required.",
    },
    {
      value: math(`${exponent}^{${prime}}`),
      id: "NUM-CP005-TRAP-SWAPPED-BASE-AND-EXPONENT",
      reason: "The base and exponent have been interchanged.",
    },
    {
      value: math(`${prime}+${exponent}`),
      id: "NUM-CP005-TRAP-ADDED-INSTEAD-OF-FORMING-POWER",
      reason: "The prime and exponent must form a power, not a sum.",
    },
  ], result.correctIndex);
  const hiddenState = {
    ...source.hiddenState,
    factorState: [{ prime, exponent }],
    factorisation: exponent === 1 ? String(prime) : `${prime}^${exponent}`,
    prime,
    exponent,
    targetDivisorCount: target,
    integerValue: (BigInt(prime) ** BigInt(exponent)).toString(),
  };
  return {
    ...result,
    stem: `Which power of the prime ${prime} has exactly ${target} positive divisors?`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState,
    difficulty: target <= 4 ? "EASY" : "MEDIUM",
    mathematicalFingerprint: `NUM-QL-055|${prime}|${target}`,
  };
}

function multiplicativePatterns(target, minimum = 2) {
  const output = [[target]];
  for (let factor = minimum; factor * factor <= target; factor += 1) {
    if (target % factor !== 0) continue;
    const quotient = target / factor;
    for (const tail of multiplicativePatterns(quotient, factor)) {
      output.push([factor, ...tail]);
    }
  }
  return output
    .map((pattern) => [...pattern].sort((a, b) => b - a))
    .filter((pattern, index, values) =>
      values.findIndex((candidate) => candidate.join(",") === pattern.join(",")) === index);
}

function ql056Difficulty(source, result) {
  const target = Number(source.hiddenState.targetDivisorCount);
  const patterns = multiplicativePatterns(target);
  const difficulty = target <= 4
    ? "EASY"
    : patterns.length <= 2
      ? "MEDIUM"
      : "HARD";
  return {
    ...result,
    difficulty,
    mathematicalFingerprint: `NUM-QL-056|${target}|${String(source.hiddenState.parity ?? "ANY")}|${result.canonicalAnswer}`,
  };
}

function ql057Difficulty(source, result) {
  const target = Number(source.hiddenState.targetDivisorCount);
  const patterns = multiplicativePatterns(target);
  const noSolution = result.canonicalAnswer === "No such integer";
  const difficulty = noSolution && patterns.length === 1
    ? "EASY"
    : patterns.length <= 2
      ? "MEDIUM"
      : "HARD";
  return {
    ...result,
    difficulty,
    mathematicalFingerprint: `NUM-QL-057|${target}|${source.hiddenState.bound}|${source.hiddenState.parity}|${result.canonicalAnswer}`,
  };
}

function orderedExponentPairs(target, maximum) {
  return factorPairs(target)
    .map(([left, right]) => [left - 1, right - 1])
    .filter(([x, y]) => x <= maximum && y <= maximum);
}

function ql064(source, result) {
  const index = (source.seed - 1) % QL064_TARGETS.length;
  const target = QL064_TARGETS[index];
  const maximum = 2 + ((source.seed - 1) % 6);
  const allPairs = factorPairs(target);
  const valid = orderedExponentPairs(target, maximum);
  const correct = String(valid.length);
  const unordered = new Set(valid.map(([x, y]) => [x, y].sort((a, b) => a - b).join(","))).size;
  const options = optionSet(correct, [
    {
      value: String(unordered),
      id: "NUM-CP005-TRAP-MERGED-REVERSED-ORDERED-PAIRS",
      reason: "Reversed ordered pairs were treated as one pair.",
    },
    {
      value: String(allPairs.length),
      id: "NUM-CP005-TRAP-IGNORED-EXPONENT-BOUND",
      reason: "All factor pairs were counted without checking the exponent limit.",
    },
    {
      value: String(maximum + 1),
      id: "NUM-CP005-TRAP-COUNTED-ONLY-ONE-EXPONENT",
      reason: "This counts possible values of one exponent without solving the equation.",
    },
    {
      value: String(target),
      id: "NUM-CP005-TRAP-RETURNED-TARGET-DIVISOR-COUNT",
      reason: "The question asks for the number of pairs, not the divisor-count target.",
    },
    {
      value: String(valid.length + 2),
      id: "NUM-CP005-TRAP-ADDED-EXTRA-PAIRS",
      reason: "Two pairs that fail the equation or the bound were included.",
    },
    {
      value: String(Math.max(0, valid.length - 1)),
      id: "NUM-CP005-TRAP-OMITTED-ONE-VALID-PAIR",
      reason: "One valid ordered pair was missed.",
    },
  ], result.correctIndex);
  const difficulty = allPairs.length <= 2 ? "EASY" : allPairs.length <= 6 ? "MEDIUM" : "HARD";
  return {
    ...result,
    stem: `For ${math("n=p^{x}q^{y}")}, where p and q are distinct primes and ${math(`0\\le x,y\\le${maximum}`)}, how many ordered pairs ${math("(x,y)")} give exactly ${target} positive divisors?`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...source.hiddenState,
      factorState: [],
      maximumExponent: maximum,
      targetDivisorCount: target,
      canonicalPairs: valid,
      verifierPairs: valid,
    },
    difficulty,
    mathematicalFingerprint: `NUM-QL-064|${maximum}|${target}|${exponentPairFingerprint(valid)}`,
  };
}

function ql065(source, result) {
  const index = (source.seed - 1) % QL064_TARGETS.length;
  const target = QL064_TARGETS[(index + 7) % QL064_TARGETS.length];
  const maximum = 2 + ((source.seed + 1) % 6);
  const all = factorPairs(target).map(([left, right]) => [left - 1, right - 1]);
  const valid = all.filter(([x, y]) => x <= maximum && y <= maximum);
  const correct = pairSetText(valid);
  const missing = valid.length > 1 ? pairSetText(valid.slice(0, -1)) : EMPTY_SET;
  const outOfBound = all.find(([x, y]) => x > maximum || y > maximum) ?? [maximum, maximum];
  const shifted = valid.length
    ? pairSetText(valid.map(([x, y], itemIndex) => itemIndex === 0 ? [x + 1, y] : [x, y]))
    : pairSetText([[Math.max(0, outOfBound[0] - 1), outOfBound[1]]]);
  const options = optionSet(correct, [
    {
      value: pairSetText(all),
      id: "NUM-CP005-TRAP-IGNORED-BOUND",
      reason: "These pairs solve the factor equation, but some exceed the exponent bound.",
    },
    {
      value: missing,
      id: "NUM-CP005-TRAP-OMITTED-VALID-ORDERED-PAIR",
      reason: "At least one valid ordered pair is missing.",
    },
    {
      value: pairSetText([...valid, outOfBound]),
      id: "NUM-CP005-TRAP-ADDED-OUT-OF-BOUND-PAIR",
      reason: "The added pair does not satisfy the stated bound.",
    },
    {
      value: shifted,
      id: "NUM-CP005-TRAP-FORGOT-TO-SUBTRACT-ONE",
      reason: "A factor-pair entry was used directly as an exponent.",
    },
    {
      value: String(valid.length),
      id: "NUM-CP005-TRAP-RETURNED-COUNT-INSTEAD-OF-SET",
      reason: "The question asks for the complete set, not the number of pairs.",
    },
    {
      value: valid.length ? EMPTY_SET : "{(0,0)}",
      id: "NUM-CP005-TRAP-WRONG-SOLUTION-CLASS",
      reason: valid.length ? "Valid bounded pairs do exist." : "The displayed pair does not give the required divisor count.",
    },
  ], result.correctIndex);
  const difficulty = all.length <= 2 ? "EASY" : all.length <= 6 ? "MEDIUM" : "HARD";
  return {
    ...result,
    stem: `For ${math("n=p^{x}q^{y}")}, where p and q are distinct primes and ${math(`0\\le x,y\\le${maximum}`)}, which option lists every ordered pair ${math("(x,y)")} for which n has exactly ${target} positive divisors?`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...source.hiddenState,
      factorState: [],
      maximumExponent: maximum,
      targetDivisorCount: target,
      exponentPairs: valid,
    },
    difficulty,
    mathematicalFingerprint: `NUM-QL-065|${maximum}|${target}|${exponentPairFingerprint(valid)}`,
  };
}

function ql066(source, result) {
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
  const safeA = Number.isInteger(derivedA) ? Math.max(0, Math.min(5, derivedA)) : Math.max(0, Math.min(5, Math.floor(derivedA)));
  const forced = [...new Set(primes.map((prime) => 2 ** safeA * prime ** b))].sort((left, right) => left - right);
  const ignoredTwo = [...new Set(primes.map((prime) => prime ** b))].sort((left, right) => left - right);
  const options = optionSet(correct, [
    {
      value: setText(forced.map(String)),
      id: "NUM-CP005-TRAP-FORCED-INVALID-EXPONENT",
      reason: "This forces a value of a even when the divisor equations do not allow it.",
    },
    {
      value: setText(ignoredTwo.map(String)),
      id: "NUM-CP005-TRAP-IGNORED-POWER-OF-TWO",
      reason: "The recovered power of 2 has been left out.",
    },
    {
      value: setText(forced.map((value) => String(value * 2))),
      id: "NUM-CP005-TRAP-ADDED-EXTRA-FACTOR-TWO",
      reason: "An extra factor 2 was included after finding a.",
    },
    {
      value: setText(forced.slice(0, 1).map(String)),
      id: "NUM-CP005-TRAP-TESTED-ONLY-ONE-ALLOWED-PRIME",
      reason: "Only one permitted odd prime was tested.",
    },
    {
      value: invalid ? "{1}" : EMPTY_SET,
      id: "NUM-CP005-TRAP-WRONG-EXISTENCE-DECISION",
      reason: invalid ? "The equations do not allow the value 1." : "The exponent equations do have valid solutions.",
    },
    {
      value: String(totalDivisors),
      id: "NUM-CP005-TRAP-RETURNED-DIVISOR-COUNT",
      reason: "The answer must be a set of possible integers, not the divisor count.",
    },
  ], result.correctIndex);
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

function metricPair(a, b) {
  return {
    total: (a + 1) * (b + 1),
    square: (Math.floor(a / 2) + 1) * (Math.floor(b / 2) + 1),
  };
}

function ql067(source, result) {
  const pair = QL067_EXPONENTS[(source.seed - 1) % QL067_EXPONENTS.length];
  const [a, b] = pair;
  const correctState = [{ prime: 2, exponent: a }, { prime: 3, exponent: b }];
  const target = metricPair(a, b);
  const alternatives = [];
  for (let first = 1; first <= 8 && alternatives.length < 3; first += 1) {
    for (let second = 1; second <= 7 && alternatives.length < 3; second += 1) {
      if (first === a && second === b) continue;
      const counts = metricPair(first, second);
      if (counts.total === target.total && counts.square === target.square) continue;
      alternatives.push([{ prime: 2, exponent: first }, { prime: 3, exponent: second }]);
    }
  }
  const correct = factorMath(correctState);
  const options = optionSet(correct, alternatives.map((state, optionIndex) => {
    const counts = metricPair(state[0].exponent, state[1].exponent);
    return {
      value: factorMath(state),
      id: `NUM-CP005-TRAP-CANDIDATE-COUNT-MISMATCH-${optionIndex + 1}`,
      reason: `This option gives ${counts.total} total divisors and ${counts.square} square divisors.`,
    };
  }), result.correctIndex);
  const candidateStates = [correctState, ...alternatives]
    .map((state) => factorStateText(state));
  const difficulty = target.total <= 10 ? "EASY" : target.total <= 24 ? "MEDIUM" : "HARD";
  return {
    ...result,
    stem: `Which prime factorisation has exactly ${target.total} positive divisors and exactly ${target.square} perfect-square positive ${target.square === 1 ? "divisor" : "divisors"}?`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...source.hiddenState,
      factorState: correctState,
      candidateStates,
      totalDivisors: target.total,
      squareDivisors: target.square,
      matchCount: 1,
    },
    difficulty,
    mathematicalFingerprint: `NUM-QL-067|${a}|${b}|${target.total}|${target.square}`,
  };
}

function inferComparisonMetric(stem, hiddenMetric) {
  if (/sum of (?:their |all )?positive divisors|divisor sum/iu.test(stem)) return "DIVISOR_SUM";
  if (/perfect-square positive divisors/iu.test(stem)) return "SQUARE_DIVISORS";
  if (/odd positive divisors/iu.test(stem)) return "ODD_DIVISORS";
  if (/total positive divisors|number of positive divisors/iu.test(stem)) return "TOTAL_DIVISORS";
  if (["DIVISOR_SUM", "SQUARE_DIVISORS", "ODD_DIVISORS", "TOTAL_DIVISORS"].includes(hiddenMetric)) {
    return hiddenMetric;
  }
  throw new Error(`Unable to infer QL-068 metric from stem: ${stem}`);
}

function divisorSumFromState(state) {
  return state.reduce((value, { prime, exponent }) => value * geometricSum(prime, exponent), 1);
}

function metricValue(state, metric) {
  if (metric === "DIVISOR_SUM") return divisorSumFromState(state);
  if (metric === "SQUARE_DIVISORS") return squareDivisorCountFromState(state);
  if (metric === "ODD_DIVISORS") return oddDivisorCountFromState(state);
  return divisorCountFromState(state);
}

function metricLabel(metric) {
  if (metric === "DIVISOR_SUM") return "sum of positive divisors";
  if (metric === "SQUARE_DIVISORS") return "number of perfect-square positive divisors";
  if (metric === "ODD_DIVISORS") return "number of odd positive divisors";
  return "total number of positive divisors";
}

function ql068(source, result) {
  const firstState = primePowers(source.hiddenState);
  const secondState = secondPrimePowers(source.hiddenState);
  const hiddenMetric = String(source.hiddenState.metricKind);
  const metric = ["DIVISOR_SUM", "SQUARE_DIVISORS", "ODD_DIVISORS", "TOTAL_DIVISORS"].includes(hiddenMetric)
    ? hiddenMetric
    : inferComparisonMetric(result.stem, hiddenMetric);
  const first = metricValue(firstState, metric);
  const second = metricValue(secondState, metric);
  const correct = first > second
    ? "Number A has more."
    : first < second
      ? "Number B has more."
      : "Both numbers have the same value.";
  const comparisonChoices = [
    "Number A has more.",
    "Number B has more.",
    "Both numbers have the same value.",
    "The comparison cannot be determined from the given information.",
  ];
  const options = optionSet(correct, comparisonChoices
    .filter((value) => value !== correct)
    .map((value, index) => ({
      value,
      id: `NUM-CP005-TRAP-COMPARISON-${index + 1}`,
      reason: value.startsWith("The comparison")
        ? "Both factorisations and the required divisor function are given, so the comparison can be calculated."
        : "The calculated values do not support this comparison.",
    })), result.correctIndex);
  const difficulty = metric === "TOTAL_DIVISORS" && firstState.length + secondState.length <= 3
    ? "EASY"
    : metric === "ODD_DIVISORS" && firstState.length + secondState.length <= 4
      ? "EASY"
      : "MEDIUM";
  return {
    ...result,
    stem: `Number A is ${factorMath(firstState)} and Number B is ${factorMath(secondState)}. Compare their ${metricLabel(metric)}.`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...source.hiddenState,
      metricKind: metric,
      firstMetricValue: first,
      secondMetricValue: second,
      comparisonOutcome: correct,
    },
    difficulty,
    mathematicalFingerprint: `NUM-QL-068|${metric}|${factorExpression(firstState)}|${factorExpression(secondState)}|${first}|${second}`,
  };
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_value, index) => start + index);
}

function intersect(first, second) {
  const secondSet = new Set(second);
  return first.filter((value) => secondSet.has(value));
}

function exactTotal(k, x) {
  return {
    text: `n has exactly ${(x + 1) * (k + 1)} positive divisors.`,
    candidates: [x],
  };
}

function exactEven(k, x) {
  return {
    text: `n has exactly ${x * (k + 1)} even positive divisors.`,
    candidates: [x],
  };
}

function atLeastPower(power) {
  return {
    text: `n is divisible by ${math(`2^{${power}}`)}.`,
    candidates: range(power, 5),
  };
}

function atMostPower(power) {
  return {
    text: `n is not divisible by ${math(`2^{${power + 1}}`)}.`,
    candidates: range(0, power),
  };
}

function exponentRange(low, high) {
  return {
    text: `n is divisible by ${math(`2^{${low}}`)} but not by ${math(`2^{${high + 1}}`)}.`,
    candidates: range(low, high),
  };
}

function quotientSquare(k) {
  return {
    text: `${math(`n\\div3^{${k}}`)} is a perfect square.`,
    candidates: [0, 2, 4],
  };
}

function quotientTwiceSquare(k) {
  return {
    text: `${math(`n\\div3^{${k}}`)} is twice a perfect square.`,
    candidates: [1, 3, 5],
  };
}

function dataSufficiencyCases() {
  return [
    { k: 2, first: exactTotal(2, 3), second: quotientTwiceSquare(2) },
    { k: 3, first: atLeastPower(2), second: exactEven(3, 4) },
    { k: 4, first: atLeastPower(3), second: atMostPower(3) },
    { k: 1, first: quotientSquare(1), second: atMostPower(4) },
    { k: 2, first: exactTotal(2, 4), second: atLeastPower(2) },
    { k: 3, first: atMostPower(4), second: exactTotal(3, 2) },
    { k: 4, first: exponentRange(1, 3), second: atLeastPower(3) },
    { k: 1, first: quotientTwiceSquare(1), second: atLeastPower(1) },
    { k: 2, first: exactEven(2, 1), second: atMostPower(3) },
    { k: 3, first: quotientSquare(3), second: exactTotal(3, 4) },
    { k: 4, first: atMostPower(2), second: atLeastPower(2) },
    { k: 1, first: atLeastPower(2), second: atMostPower(4) },
    { k: 2, first: exactTotal(2, 0), second: quotientSquare(2) },
    { k: 3, first: atLeastPower(1), second: exactEven(3, 0) },
    { k: 4, first: quotientTwiceSquare(4), second: exponentRange(2, 4) },
  ];
}

function ql069(source, result) {
  const cases = dataSufficiencyCases();
  const selected = cases[(source.seed - 1) % cases.length];
  const first = selected.first.candidates;
  const second = selected.second.candidates;
  const combined = intersect(first, second);
  const firstSufficient = first.length === 1;
  const secondSufficient = second.length === 1;
  const correct = firstSufficient && !secondSufficient
    ? DS_OPTIONS[0]
    : secondSufficient && !firstSufficient
      ? DS_OPTIONS[1]
      : !firstSufficient && !secondSufficient && combined.length === 1
        ? DS_OPTIONS[2]
        : DS_OPTIONS[3];
  const options = optionSet(correct, DS_OPTIONS
    .filter((value) => value !== correct)
    .map((value, index) => ({
      value,
      id: `NUM-CP005-TRAP-DATA-SUFFICIENCY-${index + 1}`,
      reason: "This classification does not match the values left by the two statements.",
    })), result.correctIndex);
  const representative = combined[0] ?? first[0] ?? second[0] ?? 0;
  const difficulty = firstSufficient || secondSufficient ? "EASY" : "MEDIUM";
  return {
    ...result,
    stem: `For ${math(`n=2^{x}\\times3^{${selected.k}}`)}, where ${math("x\\in\\{0,1,2,3,4,5\\}")}, determine whether x can be found. Statement I: ${selected.first.text} Statement II: ${selected.second.text}`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...source.hiddenState,
      factorState: [
        { prime: 2, exponent: representative },
        { prime: 3, exponent: selected.k },
      ],
      hiddenExponent: representative,
      knownExponent: selected.k,
      scenario: (source.seed - 1) % cases.length,
      firstCandidates: first,
      secondCandidates: second,
      combinedCandidates: combined,
    },
    difficulty,
    mathematicalFingerprint: `NUM-QL-069|${selected.k}|${first.join("-")}|${second.join("-")}|${combined.join("-")}`,
  };
}

export function applyNumCp005FinalExamQuestionCorrections(source, result) {
  switch (source.qlId) {
    case "NUM-QL-055": return ql055(source, result);
    case "NUM-QL-056": return ql056Difficulty(source, result);
    case "NUM-QL-057": return ql057Difficulty(source, result);
    case "NUM-QL-064": return ql064(source, result);
    case "NUM-QL-065": return ql065(source, result);
    case "NUM-QL-066": return ql066(source, result);
    case "NUM-QL-067": return ql067(source, result);
    case "NUM-QL-068": return ql068(source, result);
    case "NUM-QL-069": return ql069(source, result);
    default: return result;
  }
}

export {
  inferComparisonMetric,
  metricValue,
  metricLabel,
  multiplicativePatterns,
};

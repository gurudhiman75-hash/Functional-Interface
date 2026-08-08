import {
  EMPTY_SET,
  buildOptions,
  divisorCountFromState,
  divisorsFromState,
  factorExpression,
  factorMath,
  geometricSum,
  integerFromState,
  math,
  pairSetText,
  primePowers,
  secondPrimePowers,
  squareDivisorCountFromState,
  oddDivisorCountFromState,
  wrong,
} from "./english-remediation-common";
import {
  inferComparisonMetric,
  metricLabel,
  metricValue,
} from "./final-exam-readiness-question-corrections";

const QL051_STATES = [
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 2 }],
  [{ prime: 2, exponent: 3 }, { prime: 5, exponent: 1 }],
  [{ prime: 3, exponent: 2 }, { prime: 5, exponent: 2 }],
  [{ prime: 2, exponent: 2 }, { prime: 7, exponent: 2 }],
  [{ prime: 2, exponent: 3 }, { prime: 3, exponent: 2 }],
  [{ prime: 3, exponent: 3 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 4 }, { prime: 3, exponent: 1 }],
  [{ prime: 5, exponent: 2 }, { prime: 7, exponent: 1 }],
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 1 }, { prime: 5, exponent: 1 }],
  [{ prime: 3, exponent: 2 }, { prime: 5, exponent: 1 }, { prime: 7, exponent: 1 }],
  [{ prime: 2, exponent: 3 }, { prime: 7, exponent: 2 }],
  [{ prime: 2, exponent: 2 }, { prime: 5, exponent: 2 }],
  [{ prime: 3, exponent: 3 }, { prime: 7, exponent: 1 }],
  [{ prime: 2, exponent: 4 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 2 }, { prime: 5, exponent: 1 }],
  [{ prime: 2, exponent: 3 }, { prime: 3, exponent: 1 }, { prime: 7, exponent: 1 }],
  [{ prime: 3, exponent: 2 }, { prime: 7, exponent: 2 }],
  [{ prime: 2, exponent: 2 }, { prime: 11, exponent: 1 }],
  [{ prime: 2, exponent: 3 }, { prime: 5, exponent: 2 }],
  [{ prime: 3, exponent: 2 }, { prime: 5, exponent: 1 }, { prime: 11, exponent: 1 }],
  [{ prime: 2, exponent: 4 }, { prime: 7, exponent: 1 }],
  [{ prime: 5, exponent: 3 }, { prime: 2, exponent: 1 }],
  [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 1 }, { prime: 7, exponent: 1 }],
  [{ prime: 3, exponent: 3 }, { prime: 2, exponent: 2 }],
];

const QL065_CASES = [
  { maximum: 4, target: 16 },
  { maximum: 5, target: 18 },
  { maximum: 6, target: 20 },
  { maximum: 7, target: 21 },
  { maximum: 2, target: 24 },
  { maximum: 4, target: 25 },
  { maximum: 5, target: 24 },
  { maximum: 3, target: 30 },
  { maximum: 7, target: 32 },
  { maximum: 6, target: 49 },
  { maximum: 6, target: 35 },
  { maximum: 4, target: 42 },
  { maximum: 5, target: 36 },
  { maximum: 5, target: 30 },
  { maximum: 3, target: 20 },
  { maximum: 4, target: 12 },
  { maximum: 5, target: 16 },
  { maximum: 2, target: 10 },
  { maximum: 6, target: 28 },
  { maximum: 7, target: 36 },
  { maximum: 3, target: 8 },
  { maximum: 4, target: 27 },
  { maximum: 6, target: 42 },
  { maximum: 7, target: 48 },
];

const QL067_TEMPLATES = [
  { correct: [1, 5], sameTotal: [2, 3] },
  { correct: [2, 3], sameTotal: [1, 5] },
  { correct: [1, 8], sameTotal: [2, 5] },
  { correct: [2, 5], sameTotal: [1, 8] },
  { correct: [2, 7], sameTotal: [3, 5] },
  { correct: [3, 5], sameTotal: [2, 7] },
  { correct: [3, 8], sameTotal: [5, 5] },
  { correct: [5, 5], sameTotal: [3, 8] },
];

const PRIME_PAIRS = [
  [2, 3], [2, 5], [2, 7], [2, 11], [3, 5],
  [3, 7], [3, 11], [5, 7], [5, 11], [7, 11],
  [2, 13], [3, 13], [5, 13], [7, 13], [11, 13],
];

const DS_OPTIONS = [
  "Statement I alone is sufficient, but Statement II alone is not.",
  "Statement II alone is sufficient, but Statement I alone is not.",
  "Both statements together are sufficient, but neither statement alone is sufficient.",
  "Even both statements together are not sufficient.",
];

const DS_CASES = [
  { k: 2, first: exactTotal(2, 3), second: atLeastPower(2) },
  { k: 3, first: atMostPower(4), second: exactTotal(3, 2) },
  { k: 4, first: atLeastPower(3), second: atMostPower(3) },
  { k: 2, first: perfectSquareCandidates(), second: atMostPower(4) },
  { k: 1, first: exactEven(1, 4), second: atLeastPower(2) },
  { k: 2, first: atLeastPower(1), second: exactTotal(2, 1) },
  { k: 3, first: atLeastPower(3), second: atMostPower(3) },
  { k: 4, first: perfectSquareCandidates(), second: atLeastPower(4) },
  { k: 3, first: atLeastPower(2), second: atMostPower(4) },
  { k: 2, first: exactTotal(2, 0), second: perfectSquareCandidates() },
  { k: 1, first: atMostPower(2), second: exactEven(1, 2) },
  { k: 4, first: atLeastPower(1), second: atMostPower(2) },
  { k: 2, first: atLeastPower(3), second: perfectSquareCandidates() },
  { k: 3, first: exactTotal(3, 5), second: atLeastPower(3) },
  { k: 4, first: atMostPower(3), second: exactEven(4, 1) },
];

function optionSet(correct, candidates, correctIndex) {
  return buildOptions(correct, candidates.map(({ value, id, reason }) =>
    wrong(value, id, reason)), correctIndex);
}

function sumOfDivisors(state) {
  return state.reduce((value, { prime, exponent }) => value * geometricSum(prime, exponent), 1);
}

function ql051(source, result) {
  const state = QL051_STATES[(source.seed - 1) % QL051_STATES.length];
  const proper = source.seed % 2 === 0;
  const allSum = sumOfDivisors(state);
  const n = integerFromState(state);
  const correctValue = proper ? allSum - n : allSum;
  const blockSums = state.map(({ prime, exponent }) => geometricSum(prime, exponent));
  const addedBlocks = blockSums.reduce((sum, value) => sum + value, 0);
  const options = optionSet(String(correctValue), [
    {
      value: String(divisorCountFromState(state)),
      id: "NUM-CP005-TRAP-COUNTED-DIVISORS-INSTEAD-OF-SUMMING",
      reason: "This is the number of divisors, not their sum.",
    },
    {
      value: String(n),
      id: "NUM-CP005-TRAP-RETURNED-NUMBER-ITSELF",
      reason: "The question asks for a divisor sum, not n itself.",
    },
    {
      value: String(addedBlocks),
      id: "NUM-CP005-TRAP-ADDED-PRIME-BLOCK-SUMS",
      reason: "The prime-power sums must be multiplied, not added.",
    },
    {
      value: String(proper ? allSum : Math.max(1, allSum - n)),
      id: "NUM-CP005-TRAP-CONFUSED-ALL-AND-PROPER-DIVISORS",
      reason: proper ? "n itself was not removed." : "n itself was removed even though all divisors were requested.",
    },
    {
      value: String(correctValue + blockSums[0]),
      id: "NUM-CP005-TRAP-REPEATED-ONE-PRIME-BLOCK",
      reason: "One prime-power block was counted twice.",
    },
  ], result.correctIndex);
  const factorCount = state.length;
  return {
    ...result,
    stem: `For ${math(`n=${factorExpression(state)}`)}, find the sum of all ${proper ? "proper " : ""}positive divisors.`,
    options,
    canonicalAnswer: String(correctValue),
    verifierAnswer: String(correctValue),
    hiddenState: {
      ...source.hiddenState,
      factorState: state,
      factorisation: factorExpression(state).replaceAll("^{", "^").replaceAll("}", "").replaceAll(" \\times ", " × "),
      integerValue: String(n),
      divisorCount: divisorCountFromState(state),
    },
    difficulty: factorCount === 1 ? "EASY" : factorCount === 2 && !proper ? "EASY" : "MEDIUM",
    mathematicalFingerprint: `NUM-QL-051|${factorExpression(state)}|${proper ? "proper" : "all"}|${correctValue}`,
  };
}

function ql052(source, result) {
  const count = Number((result.hiddenState ?? source.hiddenState).divisorCount);
  return {
    ...result,
    difficulty: count % 2 === 0 ? "EASY" : "MEDIUM",
  };
}

function ql054(source, result) {
  const state = primePowers(result.hiddenState ?? source.hiddenState);
  return {
    ...result,
    difficulty: state.length <= 2 ? "EASY" : "MEDIUM",
  };
}

function powerText(prime, exponent) {
  return math(exponent === 1 ? String(prime) : `${prime}^{${exponent}}`);
}

function ql055(source, result) {
  const hidden = { ...(source.hiddenState ?? {}), ...(result.hiddenState ?? {}) };
  const prime = Number(hidden.prime ?? primePowers(hidden)[0]?.prime);
  const exponent = Number(hidden.exponent ?? primePowers(hidden)[0]?.exponent);
  const target = exponent + 1;
  const correct = powerText(prime, exponent);
  const wrongExponents = [
    Math.max(0, exponent - 1),
    exponent + 1,
    exponent + 2,
    exponent + 3,
  ].filter((value, index, values) => value !== exponent && values.indexOf(value) === index);
  const options = optionSet(correct, wrongExponents.map((value, index) => ({
    value: powerText(prime, value),
    id: `NUM-CP005-TRAP-WRONG-EXPONENT-${index + 1}`,
    reason: `This power has ${value + 1} positive divisors, not ${target}.`,
  })), result.correctIndex);
  return {
    ...result,
    stem: `Which power of the prime ${prime} has exactly ${target} positive divisors?`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...hidden,
      factorState: [{ prime, exponent }],
      prime,
      exponent,
      targetDivisorCount: target,
    },
    difficulty: target <= 6 ? "EASY" : "MEDIUM",
  };
}

function ql058(source, result) {
  const hidden = { ...(source.hiddenState ?? {}), ...(result.hiddenState ?? {}) };
  const state = primePowers(hidden);
  const divisors = divisorsFromState(state);
  const answerIndex = Math.min(
    divisors.length - 1,
    Math.max(3, 3 + ((source.seed - 1) % Math.max(1, divisors.length - 3))),
  );
  const answer = divisors[answerIndex];
  const next = divisors[answerIndex + 1];
  const bound = next && next - answer > 1 ? Math.min(next - 1, answer + 3) : answer;
  const candidates = [];
  for (let index = answerIndex - 1; index >= 0; index -= 1) candidates.push(divisors[index]);
  for (let value = bound; value >= 1; value -= 1) {
    if (!candidates.includes(value) && value !== answer) candidates.push(value);
  }
  const options = optionSet(String(answer), candidates.map((value, index) => ({
    value: String(value),
    id: divisors.includes(value)
      ? `NUM-CP005-TRAP-CHOSE-EARLIER-DIVISOR-${index + 1}`
      : `NUM-CP005-TRAP-CHOSE-NON-DIVISOR-${index + 1}`,
    reason: divisors.includes(value)
      ? "This is a divisor within the bound, but a larger valid divisor exists."
      : "This value is within the bound but is not a divisor of n.",
  })), result.correctIndex);
  return {
    ...result,
    stem: `For ${math(`n=${factorExpression(state)}`)}, find the greatest positive divisor not exceeding ${bound}.`,
    options,
    canonicalAnswer: String(answer),
    verifierAnswer: String(answer),
    hiddenState: {
      ...hidden,
      factorState: state,
      bound: String(bound),
    },
    difficulty: divisors.length <= 8 ? "EASY" : "MEDIUM",
    mathematicalFingerprint: `NUM-QL-058|${factorExpression(state)}|${bound}|${answer}`,
  };
}

function orderedPairs(target, maximum) {
  const output = [];
  for (let x = 0; x <= maximum; x += 1) {
    for (let y = 0; y <= maximum; y += 1) {
      if ((x + 1) * (y + 1) === target) output.push([x, y]);
    }
  }
  return output;
}

function allOrderedPairs(target) {
  const output = [];
  for (let left = 1; left <= target; left += 1) {
    if (target % left === 0) output.push([left - 1, target / left - 1]);
  }
  return output;
}

function ql065(source, result) {
  const selected = QL065_CASES[(source.seed - 1) % QL065_CASES.length];
  const valid = orderedPairs(selected.target, selected.maximum);
  const all = allOrderedPairs(selected.target);
  const correct = pairSetText(valid);
  const outOfBound = all.find(([x, y]) => x > selected.maximum || y > selected.maximum)
    ?? [selected.maximum + 1, 0];
  const options = optionSet(correct, [
    {
      value: pairSetText(all),
      id: "NUM-CP005-TRAP-IGNORED-EXPONENT-BOUND",
      reason: "This includes factor-pair solutions that exceed the exponent bound.",
    },
    {
      value: valid.length > 1 ? pairSetText(valid.slice(0, -1)) : EMPTY_SET,
      id: "NUM-CP005-TRAP-OMITTED-VALID-ORDERED-PAIR",
      reason: valid.length ? "At least one valid ordered pair is missing." : "No bounded pair satisfies the equation.",
    },
    {
      value: pairSetText([...valid, outOfBound]),
      id: "NUM-CP005-TRAP-ADDED-OUT-OF-BOUND-PAIR",
      reason: "The extra pair exceeds the stated bound.",
    },
    {
      value: pairSetText([[Math.min(selected.maximum, Math.max(0, outOfBound[0] - 1)), Math.min(selected.maximum, outOfBound[1])]]),
      id: "NUM-CP005-TRAP-FORGOT-TO-SUBTRACT-ONE",
      reason: "A factor-pair entry was used directly as an exponent.",
    },
    {
      value: String(valid.length),
      id: "NUM-CP005-TRAP-RETURNED-COUNT-INSTEAD-OF-SET",
      reason: "The question asks for the complete set, not only its size.",
    },
    {
      value: valid.length ? EMPTY_SET : "{(0,0)}",
      id: "NUM-CP005-TRAP-WRONG-SOLUTION-CLASS",
      reason: valid.length ? "Valid pairs do exist." : "The displayed pair does not give the target divisor count.",
    },
  ], result.correctIndex);
  return {
    ...result,
    stem: `For ${math("n=p^{x}q^{y}")}, where p and q are distinct primes and ${math(`0\\le x,y\\le${selected.maximum}`)}, which option lists every ordered pair ${math("(x,y)")} for which n has exactly ${selected.target} positive divisors?`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...(source.hiddenState ?? {}),
      ...(result.hiddenState ?? {}),
      factorState: [],
      maximumExponent: selected.maximum,
      targetDivisorCount: selected.target,
      exponentPairs: valid,
    },
    difficulty: valid.length >= 4 ? "HARD" : "MEDIUM",
    mathematicalFingerprint: `NUM-QL-065|${selected.maximum}|${selected.target}|${correct}`,
  };
}

function metricPair(a, b) {
  return {
    total: (a + 1) * (b + 1),
    square: (Math.floor(a / 2) + 1) * (Math.floor(b / 2) + 1),
  };
}

function findQl067Alternative(target, used, predicate) {
  for (let first = 1; first <= 9; first += 1) {
    for (let second = 1; second <= 9; second += 1) {
      const key = `${first}:${second}`;
      if (used.has(key)) continue;
      const counts = metricPair(first, second);
      if (predicate(counts)) return [first, second];
    }
  }
  throw new Error("Unable to build a QL-067 alternative");
}

function ql067(source, result) {
  const template = QL067_TEMPLATES[(source.seed - 1) % QL067_TEMPLATES.length];
  const primes = PRIME_PAIRS[(source.seed - 1) % PRIME_PAIRS.length];
  const [a, b] = template.correct;
  const target = metricPair(a, b);
  const used = new Set([
    `${a}:${b}`,
    `${template.sameTotal[0]}:${template.sameTotal[1]}`,
  ]);
  const sameSquare = findQl067Alternative(target, used,
    (counts) => counts.square === target.square && counts.total !== target.total);
  used.add(`${sameSquare[0]}:${sameSquare[1]}`);
  const wrongBoth = findQl067Alternative(target, used,
    (counts) => counts.square !== target.square && counts.total !== target.total);
  const exponentStates = [template.correct, template.sameTotal, sameSquare, wrongBoth];
  const states = exponentStates.map(([first, second]) => [
    { prime: primes[0], exponent: first },
    { prime: primes[1], exponent: second },
  ]);
  const correctState = states[0];
  const correct = factorMath(correctState);
  const options = optionSet(correct, states.slice(1).map((state, index) => {
    const counts = metricPair(state[0].exponent, state[1].exponent);
    return {
      value: factorMath(state),
      id: `NUM-CP005-TRAP-TWO-CONDITION-MISMATCH-${index + 1}`,
      reason: `This option gives ${counts.total} total divisors and ${counts.square} square divisors.`,
    };
  }), result.correctIndex);
  return {
    ...result,
    stem: `Using only the primes ${primes[0]} and ${primes[1]}, which factorisation has exactly ${target.total} positive divisors and exactly ${target.square} perfect-square positive ${target.square === 1 ? "divisor" : "divisors"}?`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...(source.hiddenState ?? {}),
      ...(result.hiddenState ?? {}),
      factorState: correctState,
      candidateStates: states.map((state) => state.map(({ prime, exponent }) =>
        exponent === 1 ? String(prime) : `${prime}^${exponent}`).join(" × ")),
      totalDivisors: target.total,
      squareDivisors: target.square,
      matchCount: 1,
      sameTotalDistractor: true,
    },
    difficulty: "MEDIUM",
    mathematicalFingerprint: `NUM-QL-067|${primes.join("-")}|${a}|${b}|${target.total}|${target.square}`,
  };
}

function comparisonOutcome(first, second) {
  return first > second
    ? "Number A has more."
    : first < second
      ? "Number B has more."
      : "Both numbers have the same value.";
}

function comparisonOption(first, second) {
  return `A has ${first}; B has ${second}; ${comparisonOutcome(first, second)}`;
}

function ql068(source, result) {
  const hidden = { ...(source.hiddenState ?? {}), ...(result.hiddenState ?? {}) };
  const firstState = primePowers(hidden);
  const secondState = secondPrimePowers(hidden);
  const metric = inferComparisonMetric(result.stem, String(hidden.metricKind));
  const first = metricValue(firstState, metric);
  const second = metricValue(secondState, metric);
  const correct = comparisonOption(first, second);
  const candidatePairs = [
    [second, first],
    [first + 1, second],
    [first, second + 1],
    [Math.max(1, first - 1), second],
    [first, Math.max(1, second - 1)],
    [first + 1, second + 1],
  ];
  const options = optionSet(correct, candidatePairs.map(([a, b], index) => ({
    value: comparisonOption(a, b),
    id: `NUM-CP005-TRAP-COMPARISON-COUNT-${index + 1}`,
    reason: index === 0
      ? "The values for A and B have been interchanged."
      : "At least one divisor-function value was calculated incorrectly.",
  })), result.correctIndex);
  return {
    ...result,
    stem: `Number A is ${factorMath(firstState)} and Number B is ${factorMath(secondState)}. Which statement correctly compares their ${metricLabel(metric)}?`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...hidden,
      metricKind: metric,
      firstMetricValue: first,
      secondMetricValue: second,
      comparisonOutcome: comparisonOutcome(first, second),
    },
    difficulty: metric === "TOTAL_DIVISORS" || metric === "ODD_DIVISORS" ? "EASY" : "MEDIUM",
    mathematicalFingerprint: `NUM-QL-068|${metric}|${factorExpression(firstState)}|${factorExpression(secondState)}|${first}|${second}`,
  };
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_value, index) => start + index);
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

function perfectSquareCandidates() {
  return {
    text: "n is a perfect square.",
    candidates: [0, 2, 4],
  };
}

function intersect(first, second) {
  const secondSet = new Set(second);
  return first.filter((value) => secondSet.has(value));
}

function ql069(source, result) {
  const selected = DS_CASES[(source.seed - 1) % DS_CASES.length];
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
  const options = optionSet(correct, DS_OPTIONS.filter((value) => value !== correct).map((value, index) => ({
    value,
    id: `NUM-CP005-TRAP-DATA-SUFFICIENCY-${index + 1}`,
    reason: "This classification does not match the possible values left by the statements.",
  })), result.correctIndex);
  const representative = combined[0] ?? first[0] ?? second[0] ?? 0;
  return {
    ...result,
    stem: `For ${math(`n=2^{x}\\times3^{${selected.k}}`)}, where ${math("x\\in\\{0,1,2,3,4,5\\}")}, determine whether x can be found. Statement I: ${selected.first.text} Statement II: ${selected.second.text}`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...(source.hiddenState ?? {}),
      ...(result.hiddenState ?? {}),
      factorState: [
        { prime: 2, exponent: representative },
        { prime: 3, exponent: selected.k },
      ],
      hiddenExponent: representative,
      knownExponent: selected.k,
      firstCandidates: first,
      secondCandidates: second,
      combinedCandidates: combined,
    },
    difficulty: firstSufficient || secondSufficient ? "EASY" : "MEDIUM",
    mathematicalFingerprint: `NUM-QL-069|${selected.k}|${first.join("-")}|${second.join("-")}|${combined.join("-")}`,
  };
}

function publicationTier(qlId, result) {
  if (["NUM-QL-052", "NUM-QL-064", "NUM-QL-065", "NUM-QL-066", "NUM-QL-067", "NUM-QL-069"].includes(qlId)) {
    return "ADVANCED_PRACTICE";
  }
  if (["NUM-QL-053", "NUM-QL-058", "NUM-QL-059", "NUM-QL-063"].includes(qlId)) {
    return "GUIDED_LEARNING";
  }
  if (qlId === "NUM-QL-068" && ["SQUARE_DIVISORS", "DIVISOR_SUM"].includes(String(result.hiddenState?.metricKind))) {
    return "ADVANCED_PRACTICE";
  }
  return "STANDARD_MOCK";
}

export function applyNumCp005FinalPublicationReadinessCorrections(source, result) {
  let corrected = result;
  switch (source.qlId) {
    case "NUM-QL-050":
      corrected = {
        ...result,
        stem: result.stem.replaceAll("perfect 4th powers", "perfect fourth powers"),
      };
      break;
    case "NUM-QL-051": corrected = ql051(source, result); break;
    case "NUM-QL-052": corrected = ql052(source, result); break;
    case "NUM-QL-054": corrected = ql054(source, result); break;
    case "NUM-QL-055": corrected = ql055(source, result); break;
    case "NUM-QL-058": corrected = ql058(source, result); break;
    case "NUM-QL-063":
      corrected = {
        ...result,
        stem: `If one factor of ${result.hiddenState.integerValue} is ${result.hiddenState.visiblePartner}, what is the paired factor?`,
      };
      break;
    case "NUM-QL-065": corrected = ql065(source, result); break;
    case "NUM-QL-066":
      corrected = {
        ...result,
        stem: result.stem.replace("It has 1 positive divisors", "It has 1 positive divisor"),
      };
      break;
    case "NUM-QL-067": corrected = ql067(source, result); break;
    case "NUM-QL-068": corrected = ql068(source, result); break;
    case "NUM-QL-069": corrected = ql069(source, result); break;
    default: break;
  }

  const tier = publicationTier(source.qlId, corrected);
  return {
    ...corrected,
    examUseTier: tier,
    hiddenState: {
      ...(source.hiddenState ?? {}),
      ...(corrected.hiddenState ?? {}),
      examUseTier: tier,
    },
  };
}

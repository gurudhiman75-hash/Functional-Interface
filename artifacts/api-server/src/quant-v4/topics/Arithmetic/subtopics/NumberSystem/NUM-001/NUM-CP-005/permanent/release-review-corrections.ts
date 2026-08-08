import {
  EMPTY_SET,
  asNumber,
  buildOptions,
  divisorCountFromState,
  divisorCountOfInteger,
  divisorsFromState,
  factorExpression,
  factorMath,
  factorisationTextToMath,
  integerFromState,
  math,
  oddDivisorCountFromState,
  pairSetText,
  primePowers,
  setText,
  squareDivisorCountFromState,
  wrong,
} from "./english-remediation-common";

function explanation(coreConcept, strategy, steps, speedMethod, traps, finalAnswer) {
  return {
    coreConcept,
    givenDataAndStrategy: strategy,
    stepByStep: steps,
    examSpeedMethod: speedMethod,
    commonTraps: traps,
    finalAnswer,
  };
}

function parityMatches(value, parity) {
  return parity === "ANY" || (parity === "ODD" ? value % 2 === 1 : value % 2 === 0);
}

function parseFactorisation(value) {
  if (typeof value !== "string" || value.trim() === "" || value.trim() === "1") return [];
  return value.split(/\s*×\s*/u).map((term) => {
    const match = term.trim().match(/^(\d+)(?:\^(\d+))?$/u);
    if (!match) throw new Error(`Invalid factorisation term: ${term}`);
    return { prime: Number(match[1]), exponent: Number(match[2] ?? 1) };
  });
}

function requirementChoiceData(state, requirementText) {
  const requirement = parseFactorisation(requirementText);
  const minimumByPrime = new Map(requirement.map(({ prime, exponent }) => [prime, exponent]));
  const rows = state.map(({ prime, exponent }) => {
    const minimum = minimumByPrime.get(prime) ?? 0;
    const choices = Math.max(0, exponent - minimum + 1);
    return { prime, exponent, minimum, choices };
  });
  return {
    rows,
    count: rows.reduce((value, row) => value * row.choices, 1),
  };
}

function mergedRequirement(firstText, secondText) {
  const merged = new Map();
  for (const { prime, exponent } of [...parseFactorisation(firstText), ...parseFactorisation(secondText)]) {
    merged.set(prime, Math.max(merged.get(prime) ?? 0, exponent));
  }
  return [...merged.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([prime, exponent]) => exponent === 1 ? String(prime) : `${prime}^${exponent}`)
    .join(" × ");
}

function factorPairs(value) {
  const pairs = [];
  for (let left = 1; left <= value; left += 1) {
    if (value % left === 0) pairs.push([left, value / left]);
  }
  return pairs;
}

function formatPairs(pairs) {
  return pairs.length === 0 ? "none" : pairs.map(([x, y]) => `(${x}, ${y})`).join(", ");
}

function isPrime(value) {
  if (!Number.isInteger(value) || value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function claimOption(value, claimed) {
  const verdict = String(value) === String(claimed) ? "correct" : "incorrect";
  return `The claim is ${verdict}; the actual value is ${value}.`;
}

function ql055Question(source, result) {
  const prime = asNumber(source.hiddenState.prime, "prime");
  const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
  const exponent = target - 1;
  const correct = math(exponent === 1 ? String(prime) : `${prime}^{${exponent}}`);
  const lowerPower = exponent <= 1 ? math("1") : math(`${prime}^{${exponent - 1}}`);
  const added = math(`${prime}+${exponent}`);
  const options = buildOptions(correct, [
    wrong(math(`${prime}^{${target}}`), "NUM-CP005-TRAP-USED-D-AS-EXPONENT", `This would have ${target + 1} divisors, not ${target}.`),
    wrong(lowerPower, "NUM-CP005-TRAP-SUBTRACTED-TWICE", "This uses an exponent one smaller than required."),
    wrong(added, "NUM-CP005-TRAP-ADDED-PRIME-AND-EXPONENT", "This adds the prime and exponent instead of forming a prime power."),
    wrong(math(`${exponent}^{${prime}}`), "NUM-CP005-TRAP-SWAPPED-BASE-EXPONENT", "This swaps the base and exponent."),
  ], result.correctIndex);
  return { ...result, options, canonicalAnswer: correct, verifierAnswer: correct };
}

function ql056Question(source, result) {
  const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
  const parity = typeof source.hiddenState.parity === "string" ? source.hiddenState.parity : "ANY";
  const answer = asNumber(source.hiddenState.integerValue, "integerValue");
  const wrongs = [];
  let leastUnrestricted = 1;
  while (divisorCountOfInteger(leastUnrestricted) !== target) leastUnrestricted += 1;
  if (leastUnrestricted !== answer) {
    wrongs.push(wrong(
      leastUnrestricted,
      "NUM-CP005-TRAP-IGNORED-PARITY",
      `This is the least unrestricted value, but it does not meet the ${parity.toLowerCase()} condition.`,
    ));
  }

  let nextValid = answer + 1;
  while (nextValid <= answer + 500) {
    if (parityMatches(nextValid, parity) && divisorCountOfInteger(nextValid) === target) {
      wrongs.push(wrong(nextValid, "NUM-CP005-TRAP-NOT-LEAST", "This has the required divisor count, but a smaller valid integer exists."));
      break;
    }
    nextValid += 1;
  }

  for (let value = Math.max(1, answer - 12); value <= answer + 24 && wrongs.length < 8; value += 1) {
    if (value === answer || !parityMatches(value, parity)) continue;
    const count = divisorCountOfInteger(value);
    if (count === target) continue;
    wrongs.push(wrong(
      value,
      "NUM-CP005-TRAP-WRONG-DIVISOR-COUNT",
      `${value} satisfies the visible parity condition but has ${count} divisors, not ${target}.`,
    ));
  }

  wrongs.push(wrong(target, "NUM-CP005-TRAP-RETURNED-DIVISOR-COUNT", "This returns the required count instead of an integer having that count."));

  const options = buildOptions(String(answer), wrongs, result.correctIndex);
  return { ...result, options };
}

function ql058Question(source, result) {
  const state = primePowers(source.hiddenState);
  const n = integerFromState(state);
  const bound = asNumber(source.hiddenState.bound, "bound");
  const divisors = divisorsFromState(state);
  const allowed = divisors.filter((value) => value <= bound);
  const answer = allowed.at(-1);
  const previous = allowed.length > 1 ? allowed.at(-2) : 1;
  const above = divisors.find((value) => value > bound);
  let nonDivisor = bound;
  while (nonDivisor > 1 && divisors.includes(nonDivisor)) nonDivisor -= 1;

  const wrongs = [
    ...(above === undefined ? [] : [wrong(above, "NUM-CP005-TRAP-IGNORED-BOUND", `${above} divides n but exceeds the bound ${bound}.`)]),
    wrong(previous, "NUM-CP005-TRAP-STOPPED-EARLY", `${previous} is allowed, but ${answer} is a larger allowed divisor.`),
    wrong(nonDivisor, "NUM-CP005-TRAP-ASSUMED-NEARBY-NUMBER-DIVIDES", `${nonDivisor} is near the bound but does not divide ${n}.`),
  ];
  const options = buildOptions(String(answer), wrongs, result.correctIndex);
  const difficulty = answer === bound ? "EASY" : allowed.length <= 5 ? "EASY" : "MEDIUM";
  return { ...result, options, difficulty };
}

function ql059Question(source, result) {
  const state = primePowers(source.hiddenState);
  const divisors = divisorsFromState(state);
  const originalIndex = asNumber(source.hiddenState.requestedIndex, "requestedIndex");
  let index = originalIndex;
  if (originalIndex === 1 && divisors.length >= 5) index = 4;
  if (originalIndex === divisors.length && divisors.length >= 8) index = Math.floor(divisors.length / 2);
  const answer = divisors[index - 1];
  const previous = divisors[index - 2];
  const next = divisors[index];
  const complement = integerFromState(state) / answer;
  const options = buildOptions(String(answer), [
    ...(previous === undefined ? [] : [wrong(previous, "NUM-CP005-TRAP-PREVIOUS-RANK", "This is the divisor immediately before the requested position.")]),
    ...(next === undefined ? [] : [wrong(next, "NUM-CP005-TRAP-NEXT-RANK", "This is the divisor immediately after the requested position.")]),
    wrong(complement, "NUM-CP005-TRAP-USED-PAIRED-DIVISOR", "This is the paired divisor, not necessarily the divisor at the requested position."),
    wrong(index, "NUM-CP005-TRAP-RETURNED-RANK", "This returns the position number instead of the divisor at that position."),
  ], result.correctIndex);
  const hiddenState = {
    ...source.hiddenState,
    requestedIndex: index,
    positionClass: "MIDDLE",
  };
  const difficulty = divisors.length > 30 ? "HARD" : "MEDIUM";
  return {
    ...result,
    stem: `The positive divisors of ${math(`n=${factorExpression(state)}`)} are arranged in increasing order. What is the divisor at position ${index}?`,
    options,
    canonicalAnswer: String(answer),
    verifierAnswer: String(answer),
    hiddenState,
    difficulty,
    mathematicalFingerprint: `${source.mathematicalFingerprint ?? ""}|review-position:${index}`,
  };
}

function ql061Question(source, result) {
  const actual = String(source.hiddenState.actualValue);
  const claimed = String(source.hiddenState.claimedValue);
  const correct = claimOption(actual, claimed);
  const numericActual = Number(actual);
  const candidateValues = [
    claimed,
    String(numericActual + 1),
    String(Math.max(0, numericActual - 1)),
    String(numericActual + 2),
    String(Math.max(0, numericActual - 2)),
  ];
  const wrongs = candidateValues
    .filter((value) => value !== actual)
    .map((value, index) => wrong(
      claimOption(value, claimed),
      `NUM-CP005-TRAP-CLAIM-VALUE-${index + 1}`,
      `This option is internally consistent, but ${value} is not the calculated value.`,
    ));
  const options = buildOptions(correct, wrongs, result.correctIndex);
  const state = primePowers(source.hiddenState);
  const metric = String(source.hiddenState.propertyKind);
  const difficulty = metric === "SQUARE_DIVISORS" && state.length >= 3 ? "MEDIUM" : "EASY";
  return { ...result, options, canonicalAnswer: correct, verifierAnswer: correct, difficulty };
}

function ql063Question(source, result) {
  const n = asNumber(source.hiddenState.integerValue, "integerValue");
  return { ...result, difficulty: n > 1_000_000 ? "MEDIUM" : "EASY" };
}

function ql065Question(source, result) {
  const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
  const originalMaximum = asNumber(source.hiddenState.maximumExponent, "maximumExponent");
  const maximum = isPrime(target) && originalMaximum === target - 1 && source.seed % 3 === 0
    ? Math.max(0, originalMaximum - 1)
    : originalMaximum;
  const all = factorPairs(target).map(([left, right]) => [left - 1, right - 1]);
  const valid = all.filter(([x, y]) => x <= maximum && y <= maximum);
  const correct = pairSetText(valid);
  const wrongs = [];
  if (valid.length > 0) {
    wrongs.push(
      wrong(pairSetText(valid.slice(0, -1)), "NUM-CP005-TRAP-OMITTED-PAIR", "This omits a valid ordered pair."),
      wrong(pairSetText([...valid, [maximum, maximum]]), "NUM-CP005-TRAP-ADDED-NON-SOLUTION", "The added pair does not satisfy the divisor-count equation."),
      wrong(pairSetText(valid.map(([x, y], index) => index === 0 ? [x + 1, y] : [x, y])), "NUM-CP005-TRAP-FORGOT-SUBTRACT-ONE", "This leaves one factor-pair entry unconverted."),
      wrong(EMPTY_SET, "NUM-CP005-TRAP-ASSUMED-NO-SOLUTION", "Valid bounded exponent pairs do exist."),
    );
  } else {
    wrongs.push(
      wrong(pairSetText(all), "NUM-CP005-TRAP-IGNORED-BOUND", "These pairs solve the equation but exceed the stated exponent limit."),
      wrong(pairSetText(all.slice(0, 1)), "NUM-CP005-TRAP-KEPT-ONE-OUT-OF-BOUND-PAIR", "This keeps a pair that violates the exponent bound."),
      wrong(`{(${maximum},${maximum})}`, "NUM-CP005-TRAP-USED-BOUND-AS-SOLUTION", "The upper bound itself does not automatically solve the equation."),
      wrong(String(valid.length), "NUM-CP005-TRAP-RETURNED-COUNT", "The question asks for the complete set, not the number of pairs."),
    );
  }
  const options = buildOptions(correct, wrongs, result.correctIndex);
  const hiddenState = { ...source.hiddenState, maximumExponent: maximum, exponentPairs: valid };
  const difficulty = valid.length === 0 ? "MEDIUM" : all.length <= 3 ? "EASY" : "MEDIUM";
  return {
    ...result,
    stem: `For ${math("n=p^{x}q^{y}")}, where p and q are distinct primes and ${math(`0\\le x,y\\le${maximum}`)}, find the complete set of ordered pairs (x,y) for which n has exactly ${target} positive divisors.`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState,
    difficulty,
    mathematicalFingerprint: `${source.mathematicalFingerprint ?? ""}|review-bound:${maximum}`,
  };
}

function ql068Question(source, result) {
  const first = primePowers(source.hiddenState);
  const second = Array.isArray(source.hiddenState.secondFactorState) ? source.hiddenState.secondFactorState : [];
  const metric = String(source.hiddenState.metricKind);
  const difficulty = metric === "SQUARE_DIVISORS" ? "MEDIUM" : first.length + second.length <= 4 ? "EASY" : "MEDIUM";
  return { ...result, difficulty };
}

function ql069Question(source, result) {
  const second = Array.isArray(source.hiddenState.secondCandidates)
    ? source.hiddenState.secondCandidates.map(Number)
    : [];
  if (second.length !== 2 || !/remainder on division/iu.test(result.stem)) return result;
  const known = asNumber(source.hiddenState.knownExponent, "knownExponent");
  const counts = second.map((x) => (x + 1) * (known + 1));
  const stem = result.stem.replace(
    /Statement II:.*$/u,
    `Statement II: the total number of positive divisors is either ${counts[0]} or ${counts[1]}.`,
  );
  return { ...result, stem };
}

export function applyNumCp005QuestionCorrections(source, result) {
  switch (source.qlId) {
    case "NUM-QL-053": {
      const state = primePowers(source.hiddenState);
      return { ...result, difficulty: divisorCountFromState(state) <= 4 ? "EASY" : result.difficulty };
    }
    case "NUM-QL-055": return ql055Question(source, result);
    case "NUM-QL-056": return ql056Question(source, result);
    case "NUM-QL-058": return ql058Question(source, result);
    case "NUM-QL-059": return ql059Question(source, result);
    case "NUM-QL-060": {
      const lower = asNumber(source.hiddenState.lower, "lower");
      const upper = asNumber(source.hiddenState.upper, "upper");
      const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
      return { ...result, difficulty: (target === 2 || target === 3) && upper - lower + 1 <= 20 ? "EASY" : "MEDIUM" };
    }
    case "NUM-QL-061": return ql061Question(source, result);
    case "NUM-QL-063": return ql063Question(source, result);
    case "NUM-QL-065": return ql065Question(source, result);
    case "NUM-QL-068": return ql068Question(source, result);
    case "NUM-QL-069": return ql069Question(source, result);
    default: return result;
  }
}

function ql049Explanation(input) {
  const state = primePowers(input.hiddenState);
  const firstText = String(input.hiddenState.firstRequirement);
  const secondText = String(input.hiddenState.secondRequirement);
  const overlapText = mergedRequirement(firstText, secondText);
  const first = requirementChoiceData(state, firstText);
  const overlap = requirementChoiceData(state, overlapText);
  const firstMath = factorisationTextToMath(firstText);
  const secondMath = factorisationTextToMath(secondText);
  const firstProduct = first.rows.map(({ choices }) => choices).join(" \\times ");
  const overlapProduct = overlap.rows.map(({ choices }) => choices).join(" \\times ");
  return explanation(
    `Count divisors containing ${firstMath}, then remove those that also contain ${secondMath}.`,
    "For each prime, count the allowed exponents and multiply the choice counts.",
    [
      `For ${firstMath}, the exponent choices give ${math(`${firstProduct}=${first.count}`)} divisors.`,
      `For both conditions, the choices give ${math(`${overlapProduct}=${overlap.count}`)} divisors.`,
      `Required count ${math(`=${first.count}-${overlap.count}=${input.canonicalAnswer}`)}.`,
    ],
    "Count the first group, count the overlap, then subtract.",
    [
      `The first count still includes the ${overlap.count} overlapping divisors.`,
      "The words “but not” require subtraction.",
      "Multiply exponent choices; do not add them.",
    ],
    input.canonicalAnswer,
  );
}

function ql056Explanation(input) {
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const parity = typeof input.hiddenState.parity === "string" ? input.hiddenState.parity : "ANY";
  const state = primePowers(input.hiddenState);
  const answer = asNumber(input.hiddenState.integerValue, "integerValue");
  const pattern = state.map(({ exponent }) => exponent + 1).join(" \\times ");
  const singlePattern = state.length === 1;
  return explanation(
    `The factors ${math("(a+1)(b+1)\\cdots")} must multiply to ${target}.`,
    `Use the smallest allowed primes${parity === "ANY" ? "" : ` while keeping the number ${parity.toLowerCase()}`}.`,
    [
      singlePattern
        ? `Only the pattern ${math(`${state[0].exponent}+1=${target}`)} is needed.`
        : `The selected exponent pattern gives ${math(`${pattern}=${target}`)}.`,
      `Using the smallest allowed primes gives ${math(`n=${factorExpression(state)}=${answer}`)}.`,
      `Check: ${math(`d(n)=${pattern}=${target}`)}.`,
    ],
    singlePattern ? "Find the exponent, use the smallest allowed prime, and verify." : "Compare the valid exponent patterns using the smallest primes.",
    [
      parity === "ODD" ? "Use odd primes only." : parity === "EVEN" ? "The number must contain 2." : "Start with the smallest primes.",
      singlePattern ? `The exponent is ${target - 1}, not ${target}.` : "Put the larger exponent on the smaller prime.",
      "Verify the divisor count before choosing the minimum.",
    ],
    input.canonicalAnswer,
  );
}

function ql057Explanation(input, base) {
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const bound = asNumber(input.hiddenState.bound, "bound");
  const parity = typeof input.hiddenState.parity === "string" ? input.hiddenState.parity : "ANY";
  const form = target === 2
    ? "a prime"
    : target === 3
      ? "a square of a prime"
      : target === 4
        ? "either p³ or pq"
        : target === 6
          ? "either p⁵ or p²q"
          : target === 8
            ? "p⁷, p³q or pqr"
            : null;
  if (!form) return base;
  return {
    ...base,
    coreConcept: `A number with exactly ${target} divisors has a restricted prime-exponent form.`,
    givenDataAndStrategy: `Use the form ${form}, then apply the bound${parity === "ANY" ? "" : ` and ${parity.toLowerCase()} condition`}.`,
    examSpeedMethod: `Check only numbers of the form ${form} near ${bound}.`,
  };
}

function ql058Explanation(input) {
  const state = primePowers(input.hiddenState);
  const bound = asNumber(input.hiddenState.bound, "bound");
  const divisors = divisorsFromState(state);
  const answer = Number(input.canonicalAnswer);
  const index = divisors.indexOf(answer);
  const previous = index > 0 ? divisors[index - 1] : null;
  const next = index + 1 < divisors.length ? divisors[index + 1] : null;
  const near = [previous, answer, next].filter((value) => value !== null).join(", ");
  const steps = [
    `The divisors nearest the bound are ${near}.`,
    `${answer} divides ${integerFromState(state)} because ${math(`${integerFromState(state)}\\div${answer}=${integerFromState(state) / answer}`)}.`,
  ];
  if (next !== null) steps.push(`The next greater divisor is ${next}, which exceeds ${bound}. Therefore no larger allowed divisor exists.`);
  else steps.push(`${answer} is n itself, so no larger positive divisor exists.`);
  return explanation(
    `Choose the greatest divisor of ${factorMath(state)} that does not exceed ${bound}.`,
    "Compare the consecutive divisors around the bound.",
    steps,
    "Find the divisor immediately below the first divisor that exceeds the bound.",
    [
      `${bound} need not divide n.`,
      `A divisor above ${bound} is not allowed.`,
      `A divisor below ${answer} is valid but not greatest.`,
    ],
    input.canonicalAnswer,
  );
}

function ql059Explanation(input) {
  const state = primePowers(input.hiddenState);
  const divisors = divisorsFromState(state);
  const index = asNumber(input.hiddenState.requestedIndex, "requestedIndex");
  const answer = divisors[index - 1];
  const start = Math.max(0, index - 3);
  const end = Math.min(divisors.length, index + 2);
  return explanation(
    `Arrange the divisors of ${factorMath(state)} in increasing order and use one-based positions.`,
    `Read position ${index}, not array position ${index - 1}.`,
    [
      `Around position ${index}, the divisors are ${divisors.slice(start, end).join(", ")}.`,
      `${math(`d_{${index}}=${answer}`)}.`,
    ],
    divisors.length > 20 ? "Use paired divisors to build only the middle part of the ordered list." : "Order the divisors once and read the required position.",
    [
      "Positions begin at 1.",
      `The rank ${index} is not the answer unless it appears there.`,
      "The paired divisor may have a different position.",
    ],
    input.canonicalAnswer,
  );
}

function ql061Explanation(input) {
  const state = primePowers(input.hiddenState);
  const kind = String(input.hiddenState.propertyKind);
  const claimed = String(input.hiddenState.claimedValue);
  const actual = String(input.hiddenState.actualValue);
  let label;
  let formula;
  if (kind === "TOTAL_DIVISORS") {
    label = "positive-divisor count";
    formula = state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ");
  } else if (kind === "ODD_DIVISORS") {
    label = "odd-divisor count";
    const oddState = state.filter(({ prime }) => prime !== 2);
    formula = oddState.length ? oddState.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ") : "1";
  } else {
    label = "square-divisor count";
    formula = state.map(({ exponent }) => `(\\lfloor ${exponent}/2\\rfloor+1)`).join(" \\times ");
  }
  return explanation(
    `Calculate the ${label} of ${factorMath(state)} before judging the claim.`,
    `Compare the calculated value with ${claimed}.`,
    [
      `${math(`${formula}=${actual}`)}.`,
      `${math(`${actual}${actual === claimed ? "=" : "\\ne"}${claimed}`)}, so the claim is ${actual === claimed ? "correct" : "incorrect"}.`,
    ],
    "Calculate first; judge the wording second.",
    [
      "Every option must state a logically consistent verdict.",
      `A nearby value is still wrong unless it equals ${actual}.`,
      `Use the formula for the ${label}.`,
    ],
    input.canonicalAnswer,
  );
}

function ql064Explanation(input) {
  const maximum = asNumber(input.hiddenState.maximumExponent, "maximumExponent");
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const all = factorPairs(target).map(([left, right]) => [left - 1, right - 1]);
  const valid = all.filter(([x, y]) => x <= maximum && y <= maximum);
  return explanation(
    `For ${math("n=p^{x}q^{y}")}, ${math(`d(n)=(x+1)(y+1)=${target}`)}.`,
    `Convert ordered factor pairs of ${target} into exponent pairs, then apply ${math(`0\\le x,y\\le${maximum}`)}.`,
    [
      `Ordered factor pairs of ${target}: ${formatPairs(factorPairs(target))}.`,
      `After subtracting 1: ${formatPairs(all)}.`,
      `Valid pairs: ${formatPairs(valid)}; count ${math(`=${valid.length}`)}.`,
    ],
    "List ordered factor pairs, subtract 1, and check both bounds.",
    [
      "Reversed ordered pairs are different.",
      `Remove any exponent above ${maximum}.`,
      "Return the number of valid pairs.",
    ],
    input.canonicalAnswer,
  );
}

function ql065Explanation(input) {
  const maximum = asNumber(input.hiddenState.maximumExponent, "maximumExponent");
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const all = factorPairs(target).map(([left, right]) => [left - 1, right - 1]);
  const valid = all.filter(([x, y]) => x <= maximum && y <= maximum);
  return explanation(
    `For ${math("n=p^{x}q^{y}")}, ${math(`d(n)=(x+1)(y+1)=${target}`)}.`,
    `Convert every ordered factor pair of ${target}, then keep exponents from 0 to ${maximum}.`,
    [
      `Exponent pairs before the bound: ${formatPairs(all)}.`,
      `After applying the bound: ${formatPairs(valid)}.`,
    ],
    "Subtract 1 from both entries of each ordered factor pair.",
    [
      "Keep reversed pairs separately.",
      "Subtract 1 from both factors.",
      `Remove exponents above ${maximum}.`,
    ],
    input.canonicalAnswer,
  );
}

function ql066Explanation(input) {
  const total = asNumber(input.hiddenState.totalDivisors, "totalDivisors");
  const odd = asNumber(input.hiddenState.oddDivisors, "oddDivisors");
  const primes = Array.isArray(input.hiddenState.oddPrimes) ? input.hiddenState.oddPrimes.map(Number) : [];
  const possible = Array.isArray(input.hiddenState.possibleIntegers) ? input.hiddenState.possibleIntegers.map(String) : [];
  const b = odd - 1;
  const aChoice = total / odd;
  const validA = Number.isInteger(aChoice);
  const a = aChoice - 1;
  const steps = [
    `${math(`b+1=${odd}`)}, so ${math(`b=${b}`)}.`,
    validA
      ? `${math(`a+1=${total}\\div${odd}=${aChoice}`)}, so ${math(`a=${a}`)}.`
      : `${math(`a+1=${total}\\div${odd}`)} is not a whole number, so no integer a exists.`,
  ];
  if (validA && possible.length > 0) {
    steps.push(b === 0
      ? `${math("p^{0}=1")}, so every allowed p gives the same value ${setText(possible)}.`
      : `Substituting p from {${primes.join(", ")}} gives ${setText(possible)}.`);
  } else {
    steps.push("Therefore there is no possible integer.");
  }
  const traps = validA && b === 0
    ? ["Do not list the same value more than once.", "Use p⁰=1.", "Check the bounds on a and b."]
    : validA
      ? ["Test every allowed odd prime.", "Different primes give different values when b>0.", "Check the bounds on a and b."]
      : ["Do not force a fractional exponent.", "The divisor counts must give whole-number exponents.", "An empty set is a valid answer."];
  return explanation(
    `For ${math("n=2^{a}p^{b}")}, odd divisors equal b+1 and total divisors equal (a+1)(b+1).`,
    "Find b first, then divide total divisors by odd divisors to find a+1.",
    steps,
    "Use total divisors ÷ odd divisors = a+1.",
    traps,
    input.canonicalAnswer,
  );
}

function ql068Explanation(input) {
  const first = primePowers(input.hiddenState);
  const second = Array.isArray(input.hiddenState.secondFactorState)
    ? input.hiddenState.secondFactorState.map(({ prime, exponent }) => ({ prime: Number(prime), exponent: Number(exponent) }))
    : [];
  const kind = String(input.hiddenState.metricKind);
  const firstValue = kind === "TOTAL_DIVISORS"
    ? divisorCountFromState(first)
    : kind === "ODD_DIVISORS"
      ? oddDivisorCountFromState(first)
      : squareDivisorCountFromState(first);
  const secondValue = kind === "TOTAL_DIVISORS"
    ? divisorCountFromState(second)
    : kind === "ODD_DIVISORS"
      ? oddDivisorCountFromState(second)
      : squareDivisorCountFromState(second);
  const relation = firstValue > secondValue ? ">" : firstValue < secondValue ? "<" : "=";
  const conclusion = firstValue > secondValue
    ? "Number A has more divisors."
    : firstValue < secondValue
      ? "Number B has more divisors."
      : "Both numbers have the same number of divisors.";
  return explanation(
    `Calculate the same divisor count for A and B, then compare the two results.`,
    `A is ${factorMath(first)} and B is ${factorMath(second)}.`,
    [
      `A gives ${firstValue}; B gives ${secondValue}.`,
      `${math(`${firstValue}${relation}${secondValue}`)}. ${conclusion}`,
    ],
    "Write the two counts side by side.",
    [
      "Do not compare the sizes of A and B.",
      "Use the same rule for both numbers.",
      "Keep A and B in the correct order.",
    ],
    conclusion,
  );
}

function ql069Explanation(input) {
  const first = Array.isArray(input.hiddenState.firstCandidates) ? input.hiddenState.firstCandidates.map(Number) : [];
  const second = Array.isArray(input.hiddenState.secondCandidates) ? input.hiddenState.secondCandidates.map(Number) : [];
  const combined = Array.isArray(input.hiddenState.combinedCandidates) ? input.hiddenState.combinedCandidates.map(Number) : [];
  return explanation(
    "A statement is sufficient only when it leaves exactly one possible value of x.",
    "Find the candidate set from each statement and then their common values.",
    [
      `Statement I gives {${first.join(", ")}}; it is ${first.length === 1 ? "sufficient" : "not sufficient"} alone.`,
      `Statement II gives {${second.join(", ")}}; it is ${second.length === 1 ? "sufficient" : "not sufficient"} alone.`,
      `Together they give {${combined.join(", ")}}.`,
    ],
    "One candidate means sufficient; two or more means insufficient.",
    [
      "Do not test only the hidden answer.",
      "Judge each statement separately first.",
      "Use the intersection only when needed.",
    ],
    input.canonicalAnswer,
  );
}

function compactEasyExplanation(explanationValue) {
  const result = {
    ...explanationValue,
    stepByStep: [...explanationValue.stepByStep],
    commonTraps: [...explanationValue.commonTraps],
  };
  result.stepByStep = result.stepByStep
    .filter((step, index, values) => index === 0 || step.trim().toLowerCase() !== values[index - 1].trim().toLowerCase())
    .slice(0, 3);
  if (result.stepByStep.length < 2) result.stepByStep.push(result.finalAnswer);
  return result;
}

export function applyNumCp005ExplanationCorrections(input, explanationValue, difficulty) {
  let result;
  switch (input.qlId) {
    case "NUM-QL-049": result = ql049Explanation(input); break;
    case "NUM-QL-056": result = ql056Explanation(input); break;
    case "NUM-QL-057": result = ql057Explanation(input, explanationValue); break;
    case "NUM-QL-058": result = ql058Explanation(input); break;
    case "NUM-QL-059": result = ql059Explanation(input); break;
    case "NUM-QL-061": result = ql061Explanation(input); break;
    case "NUM-QL-064": result = ql064Explanation(input); break;
    case "NUM-QL-065": result = ql065Explanation(input); break;
    case "NUM-QL-066": result = ql066Explanation(input); break;
    case "NUM-QL-068": result = ql068Explanation(input); break;
    case "NUM-QL-069": result = ql069Explanation(input); break;
    default: result = explanationValue;
  }
  return difficulty === "EASY" ? compactEasyExplanation(result) : result;
}

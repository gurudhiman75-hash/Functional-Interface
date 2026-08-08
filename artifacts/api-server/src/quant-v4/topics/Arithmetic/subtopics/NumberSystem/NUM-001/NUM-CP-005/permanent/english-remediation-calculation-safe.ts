import {
  EMPTY_SET,
  asNumber,
  asString,
  primePowers,
  divisorsFromState,
  divisorCountOfInteger,
  math,
  factorExpression,
  factorMath,
  setText,
  pairSetText,
  buildOptions,
  wrong,
  numericFallbacks,
  explanation,
  standardResult,
} from "./english-remediation-common";

export function ql053CalculationSafe(source) {
  const state = primePowers(source.hiddenState);
  const divisors = divisorsFromState(state);
  const correct = setText(divisors);
  const withoutOne = setText(divisors.filter((value) => value !== 1));
  const withoutN = setText(divisors.slice(0, -1));
  let nonDivisor = divisors[divisors.length - 1] + 1;
  while (divisors.includes(nonDivisor)) nonDivisor += 1;
  const replaced = [...divisors.slice(0, -1), nonDivisor].sort((left, right) => left - right);
  const choiceProduct = state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ");

  const options = buildOptions(correct, [
    wrong(withoutOne, "NUM-CP005-TRAP-OMITTED-ONE", "This omits 1, which divides every positive integer."),
    wrong(withoutN, "NUM-CP005-TRAP-OMITTED-N", "This omits n itself, which is always a positive divisor."),
    wrong(setText(replaced), "NUM-CP005-TRAP-INSERTED-NONDIVISOR", "This replaces a genuine divisor with a number that does not divide n."),
  ], source.correctIndex);

  return standardResult(source, {
    stem: `The prime factorisation is ${math(`n=${factorExpression(state)}`)}. Select the complete set of positive divisors of n.`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    explanation: explanation(
      "The complete divisor set contains every product formed from the allowed prime exponents.",
      "Generate the exponent combinations systematically and verify both endpoints 1 and n.",
      [
        `The exponent ranges are ${state.map(({ prime, exponent }) => math(`${prime}:0\\text{ to }${exponent}`)).join(", ")}.`,
        `The generated ordered divisor set is ${correct}.`,
        `Its size check is ${math(`|D(n)|=${choiceProduct}=${divisors.length}`)}.`,
      ],
      "Generate divisors in prime-power blocks and confirm that the set size equals the divisor-count product.",
      [
        "Do not omit 1.",
        "Do not omit n.",
        "Every listed number must divide n exactly.",
      ],
      correct,
    ),
  });
}

function parityMatches(value, parity) {
  return parity === "ANY" || (parity === "ODD" ? value % 2 === 1 : value % 2 === 0);
}

export function ql056CalculationSafe(source) {
  const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
  const parity = typeof source.hiddenState.parity === "string" ? source.hiddenState.parity : "ANY";
  const answer = asNumber(source.hiddenState.integerValue, "integerValue");
  let leastIgnoringParity = 1;
  while (divisorCountOfInteger(leastIgnoringParity) !== target) leastIgnoringParity += 1;
  let nextValid = answer + 1;
  while (
    nextValid < answer + 5000
    && (!parityMatches(nextValid, parity) || divisorCountOfInteger(nextValid) !== target)
  ) nextValid += 1;
  const primeBase = parity === "ODD" ? 3 : 2;
  const singlePrimePattern = primeBase ** (target - 1);

  const options = buildOptions(String(answer), [
    wrong(leastIgnoringParity, "NUM-CP005-TRAP-IGNORED-PARITY", "This is the least unrestricted value but may violate the required parity."),
    wrong(nextValid, "NUM-CP005-TRAP-NOT-LEAST", "This satisfies the condition but is not the least valid integer."),
    wrong(singlePrimePattern, "NUM-CP005-TRAP-USED-ONLY-PRIME-POWER-PATTERN", "This uses only the single-prime exponent pattern and ignores a smaller composite pattern."),
    wrong(target, "NUM-CP005-TRAP-RETURNED-DIVISOR-COUNT", "This returns the divisor count rather than an integer having that count."),
    ...numericFallbacks(answer),
  ], source.correctIndex);

  const parityLabel = parity === "ANY" ? "" : `${parity.toLowerCase()} `;
  const factorState = primePowers(source.hiddenState);
  const choiceProduct = factorState.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ");

  return standardResult(source, {
    stem: `What is the least ${parityLabel}positive integer having exactly ${target} positive divisors?`,
    options,
    canonicalAnswer: String(answer),
    verifierAnswer: String(answer),
    explanation: explanation(
      "A least-integer inverse problem compares all exponent patterns whose choice products equal the target divisor count.",
      `List the factorisations of ${target} into exponent-choice factors, apply the ${parityLabel || "unrestricted "}condition, and place larger exponents on smaller primes.`,
      [
        `The selected exponent pattern is ${asString(source.hiddenState.exponentPattern, "exponentPattern")}.`,
        `This gives ${factorMath(factorState)} with ${math(`d(n)=${choiceProduct}=${target}`)}.`,
        `Therefore the least valid integer is ${math(`n=${answer}`)}.`,
      ],
      "Translate factorisations of d(n) into exponent patterns before comparing candidate integers.",
      [
        "Do not stop at the first prime-power pattern.",
        "Apply the parity restriction before declaring the minimum.",
        "For a fixed pattern, put the largest exponent on the smallest prime.",
      ],
      String(answer),
    ),
  });
}

export function ql059CalculationSafe(source) {
  const state = primePowers(source.hiddenState);
  const divisors = divisorsFromState(state);
  const index = asNumber(source.hiddenState.requestedIndex, "requestedIndex");
  const answer = divisors[index - 1];
  const previous = divisors[index - 2];
  const next = divisors[index];
  const integerValue = asNumber(source.hiddenState.integerValue, "integerValue");
  const complement = integerValue / answer;

  const options = buildOptions(String(answer), [
    ...(previous === undefined ? [] : [wrong(previous, "NUM-CP005-TRAP-ZERO-BASED-INDEX", "This selects the preceding divisor by treating the rank as zero-based.")]),
    ...(next === undefined ? [] : [wrong(next, "NUM-CP005-TRAP-NEXT-DIVISOR", "This selects the next divisor after the requested rank.")]),
    wrong(complement, "NUM-CP005-TRAP-USED-PAIRED-DIVISOR", "This returns the complementary paired divisor rather than the divisor at the requested rank."),
    wrong(index, "NUM-CP005-TRAP-RETURNED-RANK", "This returns the rank number itself instead of the divisor at that rank."),
    ...divisors.filter((value) => value !== answer).slice(0, 5).map((value) => wrong(value, "NUM-CP005-TRAP-WRONG-RANK", "This is a divisor of n, but it is not at the requested one-based rank.")),
  ], source.correctIndex);

  const localWindow = divisors.slice(Math.max(0, index - 3), Math.min(divisors.length, index + 2));
  return standardResult(source, {
    stem: `The positive divisors of ${math(`n=${factorExpression(state)}`)} are arranged in increasing order. What is the divisor at position ${index}?`,
    options,
    canonicalAnswer: String(answer),
    verifierAnswer: String(answer),
    difficulty: index === 1 || index === divisors.length ? "EASY" : source.difficulty,
    explanation: explanation(
      "Indexed-divisor questions use the fully ordered divisor list with one-based positions.",
      "Generate the divisors in increasing order and read the requested one-based position.",
      [
        `The ordered divisor count is ${math(`|D(n)|=${divisors.length}`)}.`,
        `Around position ${index}, the ordered values are ${localWindow.join(", ")}.`,
        `Hence ${math(`d_{${index}}=${answer}`)}.`,
      ],
      index === 1
        ? "The first positive divisor is always 1."
        : index === divisors.length
          ? "The last positive divisor is always n."
          : "Merge divisor pairs into one increasing list before applying the rank.",
      [
        "Positions are one-based, not zero-based.",
        "A complementary divisor is not automatically at the requested rank.",
        "Do not return the rank number as the divisor value.",
      ],
      String(answer),
    ),
  });
}

export function ql065CalculationSafe(source) {
  const maximum = asNumber(source.hiddenState.maximumExponent, "maximumExponent");
  const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
  const pairs = source.hiddenState.exponentPairs;
  const correct = pairSetText(pairs);
  const pairArray = Array.isArray(pairs) ? pairs : [];
  const missingReversed = pairSetText(pairArray.slice(0, Math.max(0, pairArray.length - 1)));
  const withInvalid = pairSetText([...pairArray, [maximum, maximum]]);
  const shifted = pairSetText(pairArray.map((pair, index) => index === 0 ? [Number(pair[0]) + 1, pair[1]] : pair));

  const options = buildOptions(correct, [
    wrong(missingReversed, "NUM-CP005-TRAP-OMITTED-REVERSED-PAIR", "This omits a valid reversed ordered pair."),
    wrong(withInvalid, "NUM-CP005-TRAP-ADDED-NON-SOLUTION", "This adds a bounded pair that does not satisfy the divisor-count equation."),
    wrong(shifted, "NUM-CP005-TRAP-FORGOT-SUBTRACT-ONE", "This mistranslates a factor pair into exponents."),
    wrong(EMPTY_SET, "NUM-CP005-TRAP-ASSUMED-NO-SOLUTION", "This rejects valid bounded factor pairs."),
  ], source.correctIndex);

  const factorPairs = pairArray
    .map((pair) => `(${Number(pair[0]) + 1},${Number(pair[1]) + 1})`)
    .join(", ") || "none";

  return standardResult(source, {
    stem: `For ${math("n=p^{x}q^{y}")}, where p and q are distinct primes and ${math(`0\\le x,y\\le${maximum}`)}, find the complete set of ordered pairs (x,y) for which n has exactly ${target} positive divisors.`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    explanation: explanation(
      "Every bounded ordered factor pair of the target divisor count produces one exponent pair.",
      `Solve ${math(`(x+1)(y+1)=${target}`)}, subtract 1 from both factor-pair entries, and apply the bounds.`,
      [
        `The governing equation is ${math(`(x+1)(y+1)=${target}`)}.`,
        `Its admissible ordered factor pairs for x+1 and y+1 are ${factorPairs}.`,
        `Subtracting 1 gives ${math(`(x,y)\\in${correct === EMPTY_SET ? "\\varnothing" : correct.replace(/[{}]/g, "\\{").replace(/,$/, "")}`)}.`,
      ],
      "List ordered factor pairs and translate each immediately to avoid missing a reversed pair.",
      [
        "Do not merge reversed ordered pairs.",
        "Subtract 1 from each factor-pair entry.",
        "Check both exponent bounds before including a pair.",
      ],
      correct,
    ),
  });
}

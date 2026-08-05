import {
  EMPTY_SET,
  asNumber,
  math,
  pairSetText,
  buildOptions,
  wrong,
  explanation,
  standardResult,
} from "./english-remediation-common";

export function ql065CalculationSafeFinal(source) {
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
        `Therefore the complete exponent-pair set is ${correct}.`,
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

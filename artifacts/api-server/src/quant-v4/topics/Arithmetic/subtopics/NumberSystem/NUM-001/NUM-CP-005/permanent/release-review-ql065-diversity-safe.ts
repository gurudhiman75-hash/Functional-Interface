import {
  EMPTY_SET,
  asNumber,
  buildOptions,
  math,
  pairSetText,
  wrong,
} from "./english-remediation-common";

function isPrime(value) {
  if (!Number.isInteger(value) || value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function factorPairs(value) {
  const pairs = [];
  for (let left = 1; left <= value; left += 1) {
    if (value % left === 0) pairs.push([left, value / left]);
  }
  return pairs;
}

export function applyNumCp005Ql065DiversitySafe(source, result) {
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
  };
}

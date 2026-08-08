import {
  EMPTY_SET,
  asNumber,
  asNumberArray,
  math,
  setText,
  buildOptions,
  wrong,
  explanation,
  standardResult,
} from "./english-remediation-common";

export function ql066RenderSafe(source) {
  const total = asNumber(source.hiddenState.totalDivisors, "totalDivisors");
  const odd = asNumber(source.hiddenState.oddDivisors, "oddDivisors");
  const primes = asNumberArray(source.hiddenState.oddPrimes, "oddPrimes");
  const possible = Array.isArray(source.hiddenState.possibleIntegers)
    ? source.hiddenState.possibleIntegers.map(String)
    : [];
  const correct = setText(possible);
  const b = odd - 1;
  const aPlusOne = total / odd;
  const aIsIntegral = Number.isInteger(aPlusOne);
  const a = aPlusOne - 1;
  const forcedInteger = aIsIntegral && a >= 0
    ? 2 ** a * primes[0] ** b
    : 2 ** Math.max(0, Math.floor(a)) * primes[0] ** b;
  const doubled = possible.length
    ? possible.map((value) => String(Number(value) * 2))
    : [String(forcedInteger)];
  const shifted = possible.length
    ? possible.map((value) => String(Number(value) + 1))
    : [String(forcedInteger + 1)];
  const singleton = possible.length ? [possible[0]] : [String(forcedInteger)];

  const options = buildOptions(correct, [
    wrong(setText(singleton), "NUM-CP005-TRAP-FORCED-NONINTEGER-EXPONENT", "This forces an exponent value even when total divided by odd does not produce an integer choice count."),
    wrong(setText(doubled), "NUM-CP005-TRAP-EXTRA-FACTOR-TWO", "This adds an extra factor 2 after reconstructing the candidate integers."),
    wrong(setText(shifted), "NUM-CP005-TRAP-ADDED-ONE-TO-INTEGERS", "This adds 1 to candidate integers instead of checking the exponent equations."),
    wrong(setText(primes.map((prime) => prime ** Math.max(1, b))), "NUM-CP005-TRAP-IGNORED-TWO-POWER", "This ignores the recovered power of 2."),
    wrong(EMPTY_SET, "NUM-CP005-TRAP-ASSUMED-NO-SOLUTION", "This rejects valid candidates without testing the recovered exponents."),
  ], source.correctIndex);

  const aLine = aIsIntegral
    ? `${math(`a+1=${total}/${odd}=${aPlusOne}`)}, so ${math(`a=${a}`)}.`
    : `${math(`a+1=${total}/${odd}`)} is not an integer, so no exponent a exists.`;

  return standardResult(source, {
    stem: `A number has the form ${math("n=2^{a}p^{b}")}, where ${math("0\\le a\\le5")}, ${math("0\\le b\\le4")} and ${math(`p\\in\\{${primes.join(",")}\\}`)}. If n has ${total} positive divisors and ${odd} odd positive ${odd === 1 ? "divisor" : "divisors"}, find the complete set of possible values of n.`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    explanation: explanation(
      `For ${math("n=2^{a}p^{b}")}, odd divisors equal ${math("b+1")} and total divisors equal ${math("(a+1)(b+1)")}.`,
      "Recover b from the odd-divisor count, recover a from total divided by odd, and only then substitute the allowed odd primes.",
      [
        `${math(`b+1=${odd}`)}, so ${math(`b=${b}`)}.`,
        aLine,
        possible.length
          ? `Substitution of the allowed primes gives ${correct}.`
          : `Because a+1 is not an integer, the possible-integer set is ${EMPTY_SET}.`,
      ],
      "Use total divisors divided by odd divisors to obtain a+1 immediately.",
      [
        "Do not force a fractional value of a into an integer exponent.",
        "Test every allowed odd prime when a and b are valid.",
        "Equivalent empty-set notations must not appear as separate answer options.",
      ],
      correct,
    ),
  });
}

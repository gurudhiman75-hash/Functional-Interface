import {
  primePowers,
  product,
  divisorCountFromState,
  oddDivisorCountFromState,
  math,
  factorExpression,
  factorMath,
  buildOptions,
  wrong,
  numericFallbacks,
  explanation,
  standardResult,
} from "./english-remediation-common";

export function ql047ZeroSafe(source) {
  const state = primePowers(source.hiddenState);
  const total = divisorCountFromState(state);
  const odd = oddDivisorCountFromState(state);
  const even = total - odd;
  const asksEven = /even/u.test(source.stem);
  const answer = asksEven ? even : odd;
  const other = asksEven ? odd : even;
  const noOffset = product(state.map(({ exponent }) => Math.max(1, exponent)));

  const options = buildOptions(String(answer), [
    wrong(total, "NUM-CP005-TRAP-USED-TOTAL", "This counts all divisors and ignores the odd/even restriction."),
    wrong(other, "NUM-CP005-TRAP-REVERSED-PARITY", `This computes the ${asksEven ? "odd" : "even"} divisor count instead.`),
    wrong(noOffset, "NUM-CP005-TRAP-FORGET-PLUS-ONE", "This omits the zero exponent choice."),
    wrong(answer + 1, "NUM-CP005-TRAP-COUNTED-FORBIDDEN-PARITY", "This introduces one divisor from the forbidden parity class."),
    wrong(answer + 2, "NUM-CP005-TRAP-ADDED-TWO-DIVISORS", "This adds two divisors without a valid exponent-choice calculation."),
    wrong(Math.max(3, total + 1), "NUM-CP005-TRAP-EXTRA-DIVISOR-CHOICE", "This adds an extra divisor choice that the prime exponents do not permit."),
    ...numericFallbacks(answer),
  ], source.correctIndex);

  const oddFactors = state
    .filter(({ prime }) => prime !== 2)
    .map(({ exponent }) => `(${exponent}+1)`);

  return standardResult(source, {
    stem: `For ${math(`n=${factorExpression(state)}`)}, how many positive divisors are ${asksEven ? "even" : "odd"}?`,
    options,
    canonicalAnswer: String(answer),
    verifierAnswer: String(answer),
    explanation: explanation(
      "Odd divisors use no factor 2; even divisors are obtained by subtracting odd divisors from all divisors.",
      `First compute the total divisor count and the odd-divisor count for ${factorMath(state)}.`,
      [
        `Total divisors ${math(`=${state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ")}=${total}`)}.`,
        `Odd divisors ${math(`=${oddFactors.length ? oddFactors.join(" \\times ") : "1"}=${odd}`)}.`,
        asksEven
          ? `Even divisors ${math(`=${total}-${odd}=${even}`)}.`
          : `Hence the required odd-divisor count is ${odd}.`,
      ],
      asksEven
        ? "Use total divisors minus odd divisors. This also handles the valid zero-even-divisor case."
        : "Fix the exponent of 2 at 0 and multiply the remaining choices.",
      [
        "Do not count every divisor when a parity restriction is given.",
        "For an odd divisor, the exponent of 2 must be 0.",
        "An odd integer can legitimately have zero even divisors.",
      ],
      String(answer),
    ),
  });
}

import { asNumber, math, buildOptions, wrong, explanation, standardResult } from "./english-remediation-common";

export function ql055RenderSafe(source) {
  const prime = asNumber(source.hiddenState.prime, "prime");
  const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
  const exponent = target - 1;
  const correct = math(exponent === 1 ? String(prime) : `${prime}^{${exponent}}`);
  const options = buildOptions(correct, [
    wrong(math(`${prime}^{${target}}`), "NUM-CP005-TRAP-USED-D-AS-EXPONENT", "This uses the divisor count itself as the exponent."),
    wrong(math(`${prime}\\times${exponent}`), "NUM-CP005-TRAP-MULTIPLIED-PRIME-AND-EXPONENT", "This multiplies the prime by the exponent instead of raising it to that exponent."),
    wrong(math(exponent - 1 === 0 ? "1" : `${prime}^{${exponent - 1}}`), "NUM-CP005-TRAP-SUBTRACTED-TWICE", "This subtracts one twice from the divisor count."),
  ], source.correctIndex);
  return standardResult(source, {
    stem: `A positive integer is a power of the prime ${prime} and has exactly ${target} positive divisors. Which prime-power expression is the integer?`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    difficulty: target <= 3 ? "EASY" : "MEDIUM",
    explanation: explanation(
      `A prime power ${math("p^{a}")} has exactly ${math("a+1")} positive divisors.`,
      "Set a+1 equal to the given divisor count and write the answer in prime-power form.",
      [`${math(`a+1=${target}`)}.`, `${math(`a=${target}-1=${exponent}`)}.`, `Therefore the integer is ${correct}.`],
      "For a prime power with d divisors, the exponent is d−1.",
      ["Do not use d itself as the exponent.", "Do not multiply the prime by the exponent.", "Keep large powers in exponential form unless expansion is explicitly required."],
      correct,
    ),
  });
}

import {
  asNumber,
  buildOptions,
  divisorsFromState,
  integerFromState,
  primePowers,
  wrong,
} from "./english-remediation-common";

export function applyNumCp005Ql058EdgeSafe(source, result) {
  const state = primePowers(source.hiddenState);
  const n = integerFromState(state);
  const bound = asNumber(source.hiddenState.bound, "bound");
  const divisors = divisorsFromState(state);
  const divisorSet = new Set(divisors);
  const allowed = divisors.filter((value) => value <= bound);
  const answer = allowed.at(-1);
  const previous = allowed.length > 1 ? allowed.at(-2) : null;
  const above = divisors.find((value) => value > bound);
  const wrongs = [];
  const used = new Set([String(answer)]);

  function addWrong(value, misconceptionId, analysis) {
    if (!Number.isFinite(Number(value))) return;
    const key = String(value);
    if (used.has(key)) return;
    used.add(key);
    wrongs.push(wrong(value, misconceptionId, analysis));
  }

  if (above !== undefined) {
    addWrong(
      above,
      "NUM-CP005-TRAP-IGNORED-BOUND",
      `${above} divides n but exceeds the bound ${bound}.`,
    );
  }
  if (previous !== null) {
    addWrong(
      previous,
      "NUM-CP005-TRAP-STOPPED-EARLY",
      `${previous} is allowed, but ${answer} is a larger allowed divisor.`,
    );
  }

  for (let value = bound; value >= 2 && wrongs.length < 6; value -= 1) {
    if (divisorSet.has(value)) continue;
    addWrong(
      value,
      "NUM-CP005-TRAP-ASSUMED-NEARBY-NUMBER-DIVIDES",
      `${value} is near the bound but does not divide ${n}.`,
    );
  }

  const complement = n / answer;
  if (Number.isInteger(complement) && complement !== answer) {
    addWrong(
      complement,
      complement > bound
        ? "NUM-CP005-TRAP-USED-OUT-OF-BOUND-PAIR"
        : "NUM-CP005-TRAP-USED-COMPLEMENTARY-DIVISOR",
      complement > bound
        ? `${complement} is paired with ${answer}, but it exceeds the bound ${bound}.`
        : `${complement} is a divisor, but it is not the greatest divisor allowed by the bound.`,
    );
  }

  for (let value = Math.max(2, bound + 1); wrongs.length < 6; value += 1) {
    addWrong(
      value,
      divisorSet.has(value)
        ? "NUM-CP005-TRAP-IGNORED-BOUND"
        : "NUM-CP005-TRAP-IGNORED-BOUND-AND-DIVISIBILITY",
      divisorSet.has(value)
        ? `${value} divides n, but it exceeds the bound ${bound}.`
        : `${value} exceeds the bound ${bound} and also does not divide ${n}.`,
    );
  }

  const options = buildOptions(String(answer), wrongs, result.correctIndex);
  const difficulty = answer === bound ? "EASY" : allowed.length <= 5 ? "EASY" : "MEDIUM";
  return { ...result, options, difficulty };
}

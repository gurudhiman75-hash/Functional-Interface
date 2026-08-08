import {
  asNumber,
  buildOptions,
  divisorsFromState,
  factorExpression,
  integerFromState,
  math,
  primePowers,
  wrong,
} from "./english-remediation-common";

export function applyNumCp005Ql059EdgeSafe(source, result) {
  const state = primePowers(source.hiddenState);
  const divisors = divisorsFromState(state);
  const originalIndex = asNumber(source.hiddenState.requestedIndex, "requestedIndex");
  let index = originalIndex;
  if (originalIndex === 1 && divisors.length >= 5) index = 4;
  if (originalIndex === divisors.length && divisors.length >= 8) index = Math.floor(divisors.length / 2);

  const answer = divisors[index - 1];
  const n = integerFromState(state);
  const wrongs = [];
  const used = new Set([String(answer)]);

  function addWrong(value, misconceptionId, analysis) {
    if (!Number.isFinite(Number(value))) return;
    const key = String(value);
    if (used.has(key)) return;
    used.add(key);
    wrongs.push(wrong(value, misconceptionId, analysis));
  }

  addWrong(
    divisors[index - 2],
    "NUM-CP005-TRAP-PREVIOUS-RANK",
    "This is the divisor immediately before the requested position.",
  );
  addWrong(
    divisors[index],
    "NUM-CP005-TRAP-NEXT-RANK",
    "This is the divisor immediately after the requested position.",
  );
  addWrong(
    n / answer,
    "NUM-CP005-TRAP-USED-PAIRED-DIVISOR",
    "This is the complementary divisor, not necessarily the divisor at the requested position.",
  );
  addWrong(
    index,
    "NUM-CP005-TRAP-RETURNED-RANK",
    "This returns the position number instead of the divisor at that position.",
  );

  for (let distance = 1; distance < divisors.length && wrongs.length < 8; distance += 1) {
    addWrong(
      divisors[index - 1 - distance],
      "NUM-CP005-TRAP-EARLIER-DIVISOR",
      "This is a genuine divisor, but it appears earlier in the ordered list.",
    );
    addWrong(
      divisors[index - 1 + distance],
      "NUM-CP005-TRAP-LATER-DIVISOR",
      "This is a genuine divisor, but it appears later in the ordered list.",
    );
  }

  for (let value = 1; wrongs.length < 8; value += 1) {
    addWrong(
      value,
      "NUM-CP005-TRAP-USED-NONDIVISOR-AS-RANKED-VALUE",
      `${value} is not the divisor at position ${index}.`,
    );
  }

  const options = buildOptions(String(answer), wrongs, result.correctIndex);
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

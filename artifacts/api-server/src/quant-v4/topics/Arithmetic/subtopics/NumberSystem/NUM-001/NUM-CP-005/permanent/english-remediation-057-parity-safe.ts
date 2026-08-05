import {
  asNumber,
  asString,
  primePowers,
  divisorCountOfInteger,
  factorMath,
  buildOptions,
  wrong,
  explanation,
  standardResult,
} from "./english-remediation-common";

function parityMatches(value, parity) {
  return parity === "ANY" || (parity === "ODD" ? value % 2 === 1 : value % 2 === 0);
}

export function ql057ParitySafe(source) {
  const bound = asNumber(source.hiddenState.bound, "bound");
  const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
  const parity = asString(source.hiddenState.parity, "parity");
  const answer = Number(source.canonicalAnswer);

  const admissibleWrongValues = [];
  for (let value = bound; value >= 1; value -= 1) {
    if (value !== answer && parityMatches(value, parity)) admissibleWrongValues.push(value);
  }

  if (admissibleWrongValues.length < 3) {
    throw new Error(`NUM-QL-057 cannot support four parity-safe numeric options for bound ${bound}`);
  }

  const misconceptionCandidates = admissibleWrongValues.map((value) => {
    const count = divisorCountOfInteger(value);
    if (count === target) {
      return wrong(
        value,
        "NUM-CP005-TRAP-STOPPED-BEFORE-MAXIMUM",
        `This value has ${target} divisors, but it is smaller than the greatest admissible value.`,
      );
    }
    return wrong(
      value,
      "NUM-CP005-TRAP-DID-NOT-VERIFY-DIVISOR-COUNT",
      `This satisfies the visible bound and parity conditions but has ${count} divisors, not ${target}.`,
    );
  });

  const options = buildOptions(String(answer), misconceptionCandidates, source.correctIndex);
  const parityLabel = parity === "ANY" ? "" : `${parity.toLowerCase()} `;

  return standardResult(source, {
    stem: `What is the greatest ${parityLabel}positive integer not exceeding ${bound} that has exactly ${target} positive divisors?`,
    options,
    canonicalAnswer: String(answer),
    verifierAnswer: String(answer),
    difficulty: bound === answer ? "EASY" : source.difficulty,
    explanation: explanation(
      "A bounded maximum must satisfy the bound, parity and exact divisor-count conditions simultaneously.",
      "Test admissible integers downward from the bound and verify the divisor count from prime exponents.",
      [
        `The required parity class is ${parity === "ANY" ? "unrestricted" : parity.toLowerCase()}.`,
        `${factorMath(primePowers(source.hiddenState))} has exactly ${target} positive divisors.`,
        `No larger admissible integer at or below ${bound} has exactly ${target} divisors, so the maximum is ${answer}.`,
      ],
      "Search downward only within the required parity class, checking d(n) exactly.",
      [
        "Every displayed numeric option obeys the visible parity and bound conditions.",
        "A candidate near the bound is not valid until its divisor count is checked.",
        "Do not stop at a smaller valid value when a larger one exists.",
      ],
      String(answer),
    ),
  });
}

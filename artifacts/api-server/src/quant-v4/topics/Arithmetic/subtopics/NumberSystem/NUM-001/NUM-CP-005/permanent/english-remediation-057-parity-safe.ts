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
  const sourceAnswer = String(source.canonicalAnswer);
  const noSolution = sourceAnswer === "No such integer";
  const numericAnswer = noSolution ? null : Number(sourceAnswer);

  if (!noSolution && !Number.isInteger(numericAnswer)) {
    throw new Error(`NUM-QL-057 received invalid governed answer: ${sourceAnswer}`);
  }

  const admissibleWrongValues = [];
  for (let value = bound; value >= 1; value -= 1) {
    if (value !== numericAnswer && parityMatches(value, parity)) admissibleWrongValues.push(value);
  }

  if (admissibleWrongValues.length < 3) {
    throw new Error(`NUM-QL-057 cannot support four parity-safe options for bound ${bound}`);
  }

  const misconceptionCandidates = admissibleWrongValues.map((value) => {
    const count = divisorCountOfInteger(value);
    if (!noSolution && count === target) {
      return wrong(
        value,
        "NUM-CP005-TRAP-STOPPED-BEFORE-MAXIMUM",
        `This value has ${target} divisors, but it is smaller than the greatest admissible value.`,
      );
    }
    return wrong(
      value,
      noSolution
        ? "NUM-CP005-TRAP-FORCED-NONEXISTENT-CANDIDATE"
        : "NUM-CP005-TRAP-DID-NOT-VERIFY-DIVISOR-COUNT",
      noSolution
        ? `This value satisfies the visible bound and parity conditions but has ${count} divisors, not ${target}; therefore it is not a solution.`
        : `This satisfies the visible bound and parity conditions but has ${count} divisors, not ${target}.`,
    );
  });

  const options = buildOptions(sourceAnswer, misconceptionCandidates, source.correctIndex);
  const parityLabel = parity === "ANY" ? "" : `${parity.toLowerCase()} `;

  return standardResult(source, {
    stem: `What is the greatest ${parityLabel}positive integer not exceeding ${bound} that has exactly ${target} positive divisors?`,
    options,
    canonicalAnswer: sourceAnswer,
    verifierAnswer: sourceAnswer,
    difficulty: !noSolution && bound === numericAnswer ? "EASY" : source.difficulty,
    explanation: noSolution
      ? explanation(
          "A bounded maximum exists only when at least one admissible integer satisfies the exact divisor-count condition.",
          "Check every integer in the permitted parity class up to the bound; if none has the target divisor count, the correct conclusion is non-existence.",
          [
            `The required parity class is ${parity === "ANY" ? "unrestricted" : parity.toLowerCase()}.`,
            `Every admissible integer not exceeding ${bound} has a divisor count different from ${target}.`,
            "Therefore no such integer exists within the stated bound.",
          ],
          "In a no-solution case, do not force the nearest bounded value into the answer.",
          [
            "Every numeric distractor obeys the visible parity and bound conditions but fails the exact divisor-count condition.",
            "A nearby integer is not a solution merely because it satisfies the bound.",
            "Preserve the governed textual answer instead of converting it to a number.",
          ],
          sourceAnswer,
        )
      : explanation(
          "A bounded maximum must satisfy the bound, parity and exact divisor-count conditions simultaneously.",
          "Test admissible integers downward from the bound and verify the divisor count from prime exponents.",
          [
            `The required parity class is ${parity === "ANY" ? "unrestricted" : parity.toLowerCase()}.`,
            `${factorMath(primePowers(source.hiddenState))} has exactly ${target} positive divisors.`,
            `No larger admissible integer at or below ${bound} has exactly ${target} divisors, so the maximum is ${numericAnswer}.`,
          ],
          "Search downward only within the required parity class, checking d(n) exactly.",
          [
            "Every displayed numeric option obeys the visible parity and bound conditions.",
            "A candidate near the bound is not valid until its divisor count is checked.",
            "Do not stop at a smaller valid value when a larger one exists.",
          ],
          sourceAnswer,
        ),
  });
}

import {
  buildOptions,
  divisorCountFromState,
  factorExpression,
  math,
  primePowers,
  wrong,
} from "./english-remediation-common";

function uniqueWrongOptions(correct, candidates) {
  const seen = new Set([correct]);
  return candidates.filter(({ value }) => {
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function optionSet(correct, candidates, correctIndex) {
  const unique = uniqueWrongOptions(correct, candidates);
  if (unique.length < 3) throw new Error(`Not enough distinct distractors for ${correct}`);
  return buildOptions(
    correct,
    unique.map(({ value, id, reason }) => wrong(value, id, reason)),
    correctIndex,
  );
}

function factorInteger(value) {
  let remaining = value;
  const state = [];
  for (let prime = 2; prime * prime <= remaining; prime += 1) {
    if (remaining % prime !== 0) continue;
    let exponent = 0;
    while (remaining % prime === 0) {
      exponent += 1;
      remaining /= prime;
    }
    state.push({ prime, exponent });
  }
  if (remaining > 1) state.push({ prime: remaining, exponent: 1 });
  return state;
}

function setText(values) {
  const distinct = [...new Set(values)].sort((a, b) => a - b);
  return distinct.length === 0 ? "∅" : `{${distinct.join(", ")}}`;
}

function ql046Difficulty(hidden) {
  const state = primePowers(hidden);
  if (state.length <= 2) return "EASY";
  if (state.length === 3) return "MEDIUM";
  return "HARD";
}

function ql049Difficulty(hidden) {
  const state = primePowers(hidden);
  const totalDivisors = divisorCountFromState(state);
  if (totalDivisors <= 6) return "EASY";
  if (state.length <= 3 && totalDivisors <= 30) return "MEDIUM";
  return "HARD";
}

const QL063_CASES = (() => {
  const cases = [];
  for (let left = 2; left <= 22; left += 1) {
    for (let right = left + 1; right <= 42; right += 1) {
      const number = left * right;
      if (number > 840) continue;
      cases.push({ number, left, right });
    }
  }
  cases.sort((a, b) => a.number - b.number || a.left - b.left);
  return cases.slice(0, 180);
})();

function ql063(source, result) {
  const selected = QL063_CASES[(source.seed - 1) % QL063_CASES.length];
  const visible = source.seed % 2 === 0 ? selected.right : selected.left;
  const answer = source.seed % 2 === 0 ? selected.left : selected.right;
  const correct = String(answer);
  const candidates = [
    {
      value: String(visible),
      id: "NUM-CP005-TRAP-COPIED-VISIBLE-FACTOR",
      reason: "The visible factor was copied instead of finding its partner.",
    },
    {
      value: String(answer + 1),
      id: "NUM-CP005-TRAP-QUOTIENT-ONE-HIGH",
      reason: "The quotient was taken one too high.",
    },
    {
      value: String(Math.max(1, answer - 1)),
      id: "NUM-CP005-TRAP-QUOTIENT-ONE-LOW",
      reason: "The quotient was taken one too low.",
    },
    {
      value: String(selected.number - visible),
      id: "NUM-CP005-TRAP-SUBTRACTED-FACTOR",
      reason: "The factor was subtracted from the number instead of dividing.",
    },
    {
      value: String(selected.left + selected.right),
      id: "NUM-CP005-TRAP-ADDED-FACTOR-PAIR",
      reason: "The two factors were added instead of multiplied.",
    },
  ];
  return {
    ...result,
    stem: `In the divisor-pair table for ${selected.number}, one row is ${math(`${visible}\\times ?=${selected.number}`)}. What number replaces ?`,
    options: optionSet(correct, candidates, result.correctIndex),
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...(source.hiddenState ?? {}),
      ...(result.hiddenState ?? {}),
      factorState: factorInteger(selected.number),
      factorisation: factorExpression(factorInteger(selected.number))
        .replaceAll("^{", "^")
        .replaceAll("}", "")
        .replaceAll(" \\times ", " × "),
      integerValue: String(selected.number),
      visiblePartner: String(visible),
      pairedFactor: String(answer),
      pairTable: [`${visible} × ? = ${selected.number}`],
      pairIndex: 0,
      blankSide: "RIGHT",
    },
    difficulty: "EASY",
    examUseTier: "GUIDED_LEARNING",
    mathematicalFingerprint: `NUM-QL-063|${selected.number}|${visible}|${answer}`,
  };
}

function safePrimePool(a, b, seed) {
  const all = [3, 5, 7, 11, 13];
  const eligible = all.filter((prime) => 2 ** Math.max(0, a) * prime ** Math.max(0, b) <= 6_000);
  const pool = eligible.length >= 2 ? eligible : [3, 5];
  const desired = Math.min(pool.length, 2 + ((seed - 1) % 3));
  const rotated = pool.map((_value, index) => pool[(index + seed - 1) % pool.length]);
  return rotated.slice(0, desired).sort((x, y) => x - y);
}

function valuesForExponents(a, b, primes) {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || a > 5 || b < 0 || b > 4) return [];
  return primes.map((prime) => 2 ** a * prime ** b);
}

function ql066(source, result) {
  const hidden = { ...(source.hiddenState ?? {}), ...(result.hiddenState ?? {}) };
  const total = Number(hidden.totalDivisors);
  const odd = Number(hidden.oddDivisors);
  const b = odd - 1;
  const ratio = odd > 0 ? total / odd : Number.NaN;
  const a = Number.isInteger(ratio) ? ratio - 1 : Number.NaN;
  const valid = Number.isInteger(a) && Number.isInteger(b) && a >= 0 && a <= 5 && b >= 0 && b <= 4;
  const primes = safePrimePool(valid ? a : 1, b >= 0 && b <= 4 ? b : 1, source.seed);
  const values = valid ? valuesForExponents(a, b, primes) : [];
  const correct = setText(values);

  const alternativeSets = [];
  const addAlternative = (candidateValues, id, reason) => {
    alternativeSets.push({ value: setText(candidateValues), id, reason });
  };
  addAlternative(valuesForExponents(Number.isFinite(a) ? a + 1 : 1, Number.isFinite(b) ? b : 1, primes),
    "NUM-CP005-TRAP-A-ONE-HIGH", "The exponent of 2 was taken one too high.");
  addAlternative(valuesForExponents(Number.isFinite(a) ? Math.max(0, a - 1) : 0, Number.isFinite(b) ? b : 1, primes),
    "NUM-CP005-TRAP-A-ONE-LOW", "The exponent of 2 was taken one too low.");
  addAlternative(valuesForExponents(Number.isFinite(a) ? a : 1, Number.isFinite(b) ? b + 1 : 2, primes),
    "NUM-CP005-TRAP-B-ONE-HIGH", "The odd-prime exponent was taken one too high.");
  addAlternative(valuesForExponents(Number.isFinite(a) ? a : 1, Number.isFinite(b) ? Math.max(0, b - 1) : 0, primes),
    "NUM-CP005-TRAP-B-ONE-LOW", "The odd-prime exponent was taken one too low.");
  if (values.length > 1) {
    addAlternative(values.slice(0, -1), "NUM-CP005-TRAP-OMITTED-ALLOWED-PRIME", "One allowed prime case was omitted.");
  } else {
    addAlternative([1], "NUM-CP005-TRAP-FORCED-UNIT", "The exponents do not both have to be zero.");
  }
  addAlternative([], "NUM-CP005-TRAP-FALSE-NO-SOLUTION", "The divisor-count equations were rejected without checking them.");
  addAlternative([2, 4], "NUM-CP005-TRAP-IGNORED-ODD-PRIME", "The permitted odd-prime choices were ignored.");

  const solutionClass = values.length === 0
    ? "No solution"
    : values.length === 1
      ? "Unique solution"
      : "Multiple solutions";
  const totalWord = total === 1 ? "divisor" : "divisors";
  const oddWord = odd === 1 ? "divisor" : "divisors";
  return {
    ...result,
    stem: `A number is ${math("n=2^{a}p^{b}")}, where ${math("0\\le a\\le5")}, ${math("0\\le b\\le4")} and ${math(`p\\in\\{${primes.join(",") }\\}`)}. It has ${total} positive ${totalWord} and ${odd} odd positive ${oddWord}. Which set contains all possible values of n?`,
    options: optionSet(correct, alternativeSets, result.correctIndex),
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...hidden,
      factorState: [],
      totalDivisors: total,
      oddDivisors: odd,
      oddPrimes: primes,
      possibleIntegers: values.map(String),
      solutionClass,
      solvedExponentA: valid ? a : null,
      solvedExponentB: valid ? b : null,
    },
    difficulty: values.length <= 1 ? "EASY" : values.length <= 3 ? "MEDIUM" : "HARD",
    examUseTier: "ADVANCED_PRACTICE",
    mathematicalFingerprint: `NUM-QL-066|${total}|${odd}|${primes.join("-")}|${correct}`,
  };
}

function deliveryPolicy(qlId, tier) {
  if (qlId === "NUM-QL-055") {
    return { maxPerMock: 1, maxPerPracticeSession: 2, minimumQuestionGap: 8 };
  }
  if (qlId === "NUM-QL-067") {
    return { maxPerMock: 1, maxPerPracticeSession: 1, minimumQuestionGap: 10 };
  }
  if (tier === "GUIDED_LEARNING") {
    return { maxPerMock: 0, maxPerPracticeSession: 2, minimumQuestionGap: 5 };
  }
  if (tier === "ADVANCED_PRACTICE") {
    return { maxPerMock: 1, maxPerPracticeSession: 2, minimumQuestionGap: 6 };
  }
  return { maxPerMock: 2, maxPerPracticeSession: 3, minimumQuestionGap: 4 };
}

export function applyNumCp005FinalEditorialFreezeQuestionCorrections(source, result) {
  let corrected = result;
  const hidden = { ...(source.hiddenState ?? {}), ...(result.hiddenState ?? {}) };

  switch (source.qlId) {
    case "NUM-QL-046":
      corrected = { ...result, difficulty: ql046Difficulty(hidden) };
      break;
    case "NUM-QL-049":
      corrected = { ...result, difficulty: ql049Difficulty(hidden) };
      break;
    case "NUM-QL-052": {
      const count = Number(hidden.divisorCount);
      corrected = {
        ...result,
        difficulty: count % 2 === 0 ? "EASY" : "MEDIUM",
        examUseTier: count % 2 === 0 ? "STANDARD_MOCK" : "ADVANCED_PRACTICE",
      };
      break;
    }
    case "NUM-QL-055":
      corrected = { ...result, difficulty: "EASY" };
      break;
    case "NUM-QL-063":
      corrected = ql063(source, result);
      break;
    case "NUM-QL-066":
      corrected = ql066(source, result);
      break;
    case "NUM-QL-067": {
      const total = Number(hidden.totalDivisors);
      corrected = {
        ...result,
        difficulty: total <= 12 ? "EASY" : total <= 30 ? "MEDIUM" : "HARD",
      };
      break;
    }
    default:
      break;
  }

  const tier = corrected.examUseTier ?? hidden.examUseTier ?? "STANDARD_MOCK";
  const policy = deliveryPolicy(source.qlId, tier);
  return {
    ...corrected,
    examUseTier: tier,
    deliveryPolicy: policy,
    hiddenState: {
      ...hidden,
      ...(corrected.hiddenState ?? {}),
      examUseTier: tier,
      deliveryPolicy: policy,
    },
  };
}

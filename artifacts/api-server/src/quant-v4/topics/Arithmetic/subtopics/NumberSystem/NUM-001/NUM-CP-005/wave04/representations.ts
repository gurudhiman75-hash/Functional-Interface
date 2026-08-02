import type { NumCp005PrimePower } from "../wave01/types";
import {
  LIFECYCLE,
  Rng,
  correctIndex,
  difficulty,
  divisorCountByPairs,
  divisorCountFormula,
  divisorSumFormula,
  explanation,
  factorInteger,
  factorText,
  integerDivisorsByPairs,
  makeOptions,
  numberFromFactors,
  oddDivisorCountFormula,
  squareDivisorCountFormula,
} from "./common";
import type {
  NumCp005Wave04Package,
  NumCp005Wave04PrototypeId,
} from "./types";

function candidateFactorStates(seed: number): readonly (readonly NumCp005PrimePower[])[] {
  const rng = new Rng(`factor-table:${seed}`);
  const correct = Object.freeze([
    Object.freeze({ prime: 2, exponent: rng.int(1, 5) }),
    Object.freeze({ prime: 3, exponent: rng.int(1, 5) }),
  ]);
  const states: Array<readonly NumCp005PrimePower[]> = [correct];
  while (states.length < 4) {
    const candidate = Object.freeze([
      Object.freeze({ prime: 2, exponent: rng.int(0, 6) }),
      Object.freeze({ prime: 3, exponent: rng.int(0, 6) }),
    ].filter((factor) => factor.exponent > 0));
    if (states.some((state) => factorText(state) === factorText(candidate))) continue;
    if (
      divisorCountFormula(candidate) === divisorCountFormula(correct)
      && squareDivisorCountFormula(candidate) === squareDivisorCountFormula(correct)
    ) continue;
    states.push(candidate);
  }
  return Object.freeze(states);
}

function isPerfectSquare(value: bigint): boolean {
  const root = BigInt(Math.floor(Math.sqrt(Number(value))));
  return root * root === value || (root + 1n) * (root + 1n) === value;
}

export function generateFactorTableMatch(
  prototypeId: NumCp005Wave04PrototypeId,
  seed: number,
): NumCp005Wave04Package {
  const states = candidateFactorStates(seed);
  const correctState = states[0]!;
  const totalDivisors = divisorCountFormula(correctState);
  const squareDivisors = squareDivisorCountFormula(correctState);
  const optionIndex = correctIndex(prototypeId, seed);
  const rotated = [...states.slice(1)];
  rotated.splice(optionIndex, 0, correctState);
  const options = Object.freeze(rotated.map((state, index) => Object.freeze({
    value: factorText(state),
    isCorrect: index === optionIndex,
    misconceptionId: index === optionIndex ? null : `NUM-CP005-TABLE-MISMATCH-${index + 1}`,
    analysis: index === optionIndex
      ? "This row matches both divisor-function totals."
      : "This row fails at least one of the total-divisor or square-divisor constraints.",
  })));
  const canonicalMatches = states.filter((state) =>
    divisorCountFormula(state) === totalDivisors
    && squareDivisorCountFormula(state) === squareDivisors);
  const verifierMatches = states.filter((state) => {
    const divisors = integerDivisorsByPairs(numberFromFactors(state));
    return divisors.length === totalDivisors
      && divisors.filter(isPerfectSquare).length === squareDivisors;
  });
  const canonicalAnswer = factorText(canonicalMatches[0]!);
  const verifierAnswer = factorText(verifierMatches[0]!);

  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: difficulty(seed),
    answerSemantic: "FACTORISATION",
    representation: "PRIME_EXPONENT_TABLE",
    stem: `A prime-exponent table lists four possible forms of n. Select the row for which n has exactly ${totalDivisors} positive divisors and exactly ${squareDivisors} perfect-square positive divisors.`,
    options,
    correctIndex: optionIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: Object.freeze({
      factorState: correctState,
      candidateStates: states.map(factorText),
      totalDivisors,
      squareDivisors,
      matchCount: canonicalMatches.length,
    }),
    mathematicalFingerprint: `${prototypeId}|T=${totalDivisors}|S=${squareDivisors}|rows=${states.map(factorText).join(";")}`,
    explanation: explanation(
      "A candidate row must satisfy both the total-divisor and perfect-square-divisor formulas.",
      "Evaluate (e+1) products and (floor(e/2)+1) products for every row; accept only the common match.",
      rotated.map((state) =>
        `${factorText(state)} gives τ=${divisorCountFormula(state)} and square-divisor count=${squareDivisorCountFormula(state)}.`),
      "Reject a row as soon as either of the two required counts fails.",
      canonicalAnswer,
    ),
    sourceAncestry: Object.freeze([
      "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
      "NUM-CP005-WAVES-01-03",
      "SSC-PRIME-EXPONENT-TABLE-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId, "NUM-CP005-WAVE04-PRIME-EXPONENT-TABLE"]),
    lifecycle: LIFECYCLE,
  });
}

function metricValue(
  kind: "TOTAL_DIVISORS" | "ODD_DIVISORS" | "SQUARE_DIVISORS" | "DIVISOR_SUM",
  factors: readonly NumCp005PrimePower[],
): bigint {
  if (kind === "TOTAL_DIVISORS") return BigInt(divisorCountFormula(factors));
  if (kind === "ODD_DIVISORS") return BigInt(oddDivisorCountFormula(factors));
  if (kind === "SQUARE_DIVISORS") return BigInt(squareDivisorCountFormula(factors));
  return divisorSumFormula(factors);
}

function smallFactorStates(): readonly (readonly NumCp005PrimePower[])[] {
  const states: Array<readonly NumCp005PrimePower[]> = [];
  for (let exponentOfTwo = 0; exponentOfTwo <= 4; exponentOfTwo += 1) {
    for (let exponentOfThree = 0; exponentOfThree <= 4; exponentOfThree += 1) {
      if (exponentOfTwo === 0 && exponentOfThree === 0) continue;
      states.push(Object.freeze([
        ...(exponentOfTwo > 0 ? [Object.freeze({ prime: 2, exponent: exponentOfTwo })] : []),
        ...(exponentOfThree > 0 ? [Object.freeze({ prime: 3, exponent: exponentOfThree })] : []),
      ]));
    }
  }
  return Object.freeze(states);
}

export function generateMiniCaselet(
  prototypeId: NumCp005Wave04PrototypeId,
  seed: number,
): NumCp005Wave04Package {
  const kinds = ["TOTAL_DIVISORS", "ODD_DIVISORS", "SQUARE_DIVISORS", "DIVISOR_SUM"] as const;
  const kind = kinds[(seed - 1) % kinds.length]!;
  const preferred = (["Number A", "Number B", "They are equal"] as const)[(seed - 1) % 3]!;
  const states = smallFactorStates();
  const grouped: Record<string, Array<readonly [readonly NumCp005PrimePower[], readonly NumCp005PrimePower[]]>> = {
    "Number A": [],
    "Number B": [],
    "They are equal": [],
  };
  for (const first of states) {
    for (const second of states) {
      if (factorText(first) === factorText(second)) continue;
      const firstValue = metricValue(kind, first);
      const secondValue = metricValue(kind, second);
      const result = firstValue > secondValue ? "Number A" : firstValue < secondValue ? "Number B" : "They are equal";
      grouped[result]!.push(Object.freeze([first, second] as const));
    }
  }
  const desired = grouped[preferred]!.length > 0
    ? preferred
    : (["Number A", "Number B", "They are equal"] as const).find((result) => grouped[result]!.length > 0)!;
  const pair = grouped[desired]![(seed * 13) % grouped[desired]!.length]!;
  const [first, second] = pair;
  const firstFormulaValue = metricValue(kind, first);
  const secondFormulaValue = metricValue(kind, second);
  const verifierMetric = (divisors: readonly bigint[]): bigint => {
    if (kind === "TOTAL_DIVISORS") return BigInt(divisors.length);
    if (kind === "ODD_DIVISORS") return BigInt(divisors.filter((value) => value % 2n === 1n).length);
    if (kind === "SQUARE_DIVISORS") return BigInt(divisors.filter(isPerfectSquare).length);
    return divisors.reduce((sum, value) => sum + value, 0n);
  };
  const firstVerifierValue = verifierMetric(integerDivisorsByPairs(numberFromFactors(first)));
  const secondVerifierValue = verifierMetric(integerDivisorsByPairs(numberFromFactors(second)));
  const canonicalAnswer = firstFormulaValue > secondFormulaValue
    ? "Number A"
    : firstFormulaValue < secondFormulaValue ? "Number B" : "They are equal";
  const verifierAnswer = firstVerifierValue > secondVerifierValue
    ? "Number A"
    : firstVerifierValue < secondVerifierValue ? "Number B" : "They are equal";
  const metricLabel: Record<typeof kind, string> = {
    TOTAL_DIVISORS: "total positive divisors",
    ODD_DIVISORS: "odd positive divisors",
    SQUARE_DIVISORS: "perfect-square positive divisors",
    DIVISOR_SUM: "sum of positive divisors",
  };
  const answerIndex = correctIndex(prototypeId, seed);

  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: difficulty(seed),
    answerSemantic: "COMPARISON",
    representation: "MINI_CASELET",
    stem: `A caselet defines Number A = ${factorText(first)} and Number B = ${factorText(second)}. Which has the greater ${metricLabel[kind]}?`,
    options: makeOptions(
      canonicalAnswer,
      ["Number A", "Number B", "They are equal", "Cannot be determined"],
      answerIndex,
      "NUM-CP005-CASELET",
    ),
    correctIndex: answerIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: Object.freeze({
      factorState: first,
      secondFactorState: second,
      metricKind: kind,
      firstValue: firstFormulaValue.toString(),
      secondValue: secondFormulaValue.toString(),
    }),
    mathematicalFingerprint: `${prototypeId}|kind=${kind}|A=${factorText(first)}|B=${factorText(second)}|result=${canonicalAnswer}`,
    explanation: explanation(
      "Compare the same divisor function for both numbers; do not compare the numbers themselves.",
      `Compute the ${metricLabel[kind]} for A and B from their separate prime-exponent states.`,
      [
        `Number A gives ${firstFormulaValue}.`,
        `Number B gives ${secondFormulaValue}.`,
        `The comparison result is ${canonicalAnswer}.`,
      ],
      "Place the two formula results side by side before comparing.",
      canonicalAnswer,
    ),
    sourceAncestry: Object.freeze([
      "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
      "NUM-CP005-WAVES-01-03",
      "SSC-DIVISOR-MINI-CASELET-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId, "NUM-CP005-WAVE04-MINI-CASELET"]),
    lifecycle: LIFECYCLE,
  });
}

function greatestBoundedFormula(
  bound: number,
  targetDivisorCount: number,
  parity: "ANY" | "ODD" | "EVEN",
): number | null {
  for (let candidate = bound; candidate >= 1; candidate -= 1) {
    if (parity === "ODD" && candidate % 2 === 0) continue;
    if (parity === "EVEN" && candidate % 2 !== 0) continue;
    if (divisorCountFormula(factorInteger(candidate)) === targetDivisorCount) return candidate;
  }
  return null;
}

function greatestBoundedVerifier(
  bound: number,
  targetDivisorCount: number,
  parity: "ANY" | "ODD" | "EVEN",
): number | null {
  const valid: number[] = [];
  for (let candidate = 1; candidate <= bound; candidate += 1) {
    if (parity === "ODD" && candidate % 2 === 0) continue;
    if (parity === "EVEN" && candidate % 2 !== 0) continue;
    if (divisorCountByPairs(candidate) === targetDivisorCount) valid.push(candidate);
  }
  return valid.length === 0 ? null : valid[valid.length - 1]!;
}

export function generateBoundedOptimisation(
  prototypeId: NumCp005Wave04PrototypeId,
  seed: number,
): NumCp005Wave04Package {
  const parity = (["ANY", "ODD", "EVEN"] as const)[(seed - 1) % 3]!;
  const forceNoSolution = seed % 5 === 0;
  const bound = 24 + ((seed * 17) % 97);
  let targetDivisorCount: number;
  if (forceNoSolution) {
    targetDivisorCount = 13;
  } else {
    const witnessPool = Array.from({ length: bound }, (_unused, index) => index + 1)
      .filter((value) => parity === "ANY" || (parity === "ODD" ? value % 2 === 1 : value % 2 === 0));
    const witness = witnessPool[(seed * 19) % witnessPool.length]!;
    targetDivisorCount = divisorCountByPairs(witness);
  }
  const canonicalValue = greatestBoundedFormula(bound, targetDivisorCount, parity);
  const verifierValue = greatestBoundedVerifier(bound, targetDivisorCount, parity);
  const canonicalAnswer = canonicalValue === null ? "No such integer" : String(canonicalValue);
  const verifierAnswer = verifierValue === null ? "No such integer" : String(verifierValue);
  const wrongs = canonicalValue === null
    ? [String(bound), String(Math.max(1, bound - 1)), "1", "Cannot be determined"]
    : [
      String(Math.max(1, canonicalValue - 1)),
      String(Math.min(bound, canonicalValue + 1)),
      String(Math.max(1, Math.floor(canonicalValue / 2))),
      "No such integer",
    ];
  const parityText = parity === "ANY" ? "integer" : `${parity.toLowerCase()} integer`;
  const answerIndex = correctIndex(prototypeId, seed);

  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: difficulty(seed),
    answerSemantic: "INTEGER",
    representation: "BOUNDED_OPTIMISATION",
    stem: `Find the greatest ${parityText} not exceeding ${bound} that has exactly ${targetDivisorCount} positive divisors.`,
    options: makeOptions(canonicalAnswer, wrongs, answerIndex, "NUM-CP005-BOUNDED-MAX"),
    correctIndex: answerIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: Object.freeze({
      factorState: canonicalValue === null ? Object.freeze([]) : factorInteger(canonicalValue),
      bound,
      parity,
      targetDivisorCount,
      existenceClass: canonicalValue === null ? "NO_SOLUTION" : "HAS_SOLUTION",
    }),
    mathematicalFingerprint: `${prototypeId}|bound=${bound}|parity=${parity}|target=${targetDivisorCount}|answer=${canonicalAnswer}`,
    explanation: explanation(
      "A bounded greatest-value task requires both the divisor-count condition and the parity condition.",
      "Search downward from the bound using factorisation; the independent verifier scans upward and takes the last valid state.",
      [
        `Bound = ${bound}, parity rule = ${parity}, divisor-count target = ${targetDivisorCount}.`,
        canonicalValue === null
          ? "No candidate in the bounded domain satisfies all conditions."
          : `${canonicalValue} is the highest candidate satisfying every condition.`,
      ],
      "Start at the upper bound and reject candidates immediately by parity before counting divisors.",
      canonicalAnswer,
    ),
    sourceAncestry: Object.freeze([
      "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
      "NUM-CP005-WAVES-01-03",
      "SSC-DIVISOR-BOUNDED-INVERSE-OPTIMISATION-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId, "NUM-CP005-WAVE04-BOUNDED-OPTIMISATION"]),
    lifecycle: LIFECYCLE,
  });
}

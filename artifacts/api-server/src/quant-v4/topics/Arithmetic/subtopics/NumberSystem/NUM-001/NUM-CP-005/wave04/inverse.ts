import {
  LIFECYCLE,
  correctIndex,
  difficulty,
  divisorCountFormula,
  explanation,
  makeOptions,
  numberFromFactors,
  oddDivisorCountFormula,
  pairSetText,
  setText,
} from "./common";
import type {
  NumCp005Wave04Package,
  NumCp005Wave04PrototypeId,
} from "./types";

function orderedExponentPairsByFactorisation(
  target: number,
  maximumExponent: number,
): readonly (readonly [number, number])[] {
  const pairs: Array<readonly [number, number]> = [];
  for (let firstFactor = 1; firstFactor <= maximumExponent + 1; firstFactor += 1) {
    if (target % firstFactor !== 0) continue;
    const secondFactor = target / firstFactor;
    if (secondFactor < 1 || secondFactor > maximumExponent + 1) continue;
    pairs.push(Object.freeze([firstFactor - 1, secondFactor - 1] as const));
  }
  return Object.freeze(pairs);
}

function orderedExponentPairsByEnumeration(
  target: number,
  maximumExponent: number,
): readonly (readonly [number, number])[] {
  const pairs: Array<readonly [number, number]> = [];
  for (let x = 0; x <= maximumExponent; x += 1) {
    for (let y = 0; y <= maximumExponent; y += 1) {
      if ((x + 1) * (y + 1) === target) pairs.push(Object.freeze([x, y] as const));
    }
  }
  return Object.freeze(pairs);
}

function solutionClass(count: number): "No solution" | "Unique solution" | "Multiple solutions" {
  if (count === 0) return "No solution";
  if (count === 1) return "Unique solution";
  return "Multiple solutions";
}

function targetsByClass(maximumExponent: number): Readonly<Record<string, readonly number[]>> {
  const result: Record<string, number[]> = {
    "No solution": [],
    "Unique solution": [],
    "Multiple solutions": [],
  };
  const maximumTarget = (maximumExponent + 1) ** 2 + 10;
  for (let target = 2; target <= maximumTarget; target += 1) {
    const count = orderedExponentPairsByEnumeration(target, maximumExponent).length;
    result[solutionClass(count)]!.push(target);
  }
  return Object.freeze({
    "No solution": Object.freeze(result["No solution"]!),
    "Unique solution": Object.freeze(result["Unique solution"]!),
    "Multiple solutions": Object.freeze(result["Multiple solutions"]!),
  });
}

export function generateSolutionClass(
  prototypeId: NumCp005Wave04PrototypeId,
  seed: number,
): NumCp005Wave04Package {
  const maximumExponent = 3 + (seed % 3);
  const desiredClass = (["No solution", "Unique solution", "Multiple solutions"] as const)[(seed - 1) % 3]!;
  const targets = targetsByClass(maximumExponent)[desiredClass];
  const target = targets[(seed * 7) % targets.length]!;
  const canonicalPairs = orderedExponentPairsByFactorisation(target, maximumExponent);
  const verifierPairs = orderedExponentPairsByEnumeration(target, maximumExponent);
  const canonicalAnswer = solutionClass(canonicalPairs.length);
  const verifierAnswer = solutionClass(verifierPairs.length);
  const answerIndex = correctIndex(prototypeId, seed);
  const primes = ([
    [2, 3],
    [2, 5],
    [3, 5],
    [3, 7],
    [5, 7],
  ] as const)[seed % 5]!;

  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: difficulty(seed),
    answerSemantic: "SOLUTION_CLASS",
    representation: "DIRECT_INVERSE",
    stem: `For n = ${primes[0]}^x × ${primes[1]}^y, where 0 ≤ x,y ≤ ${maximumExponent}, classify the number of ordered pairs (x,y) for which n has exactly ${target} positive divisors.`,
    options: makeOptions(
      canonicalAnswer,
      ["No solution", "Unique solution", "Multiple solutions", "Infinitely many solutions"],
      answerIndex,
      "NUM-CP005-SOLUTION-CLASS",
    ),
    correctIndex: answerIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: Object.freeze({
      factorState: Object.freeze([]),
      maximumExponent,
      targetDivisorCount: target,
      canonicalPairs,
      verifierPairs,
    }),
    mathematicalFingerprint: `${prototypeId}|primes=${primes.join("-")}|max=${maximumExponent}|target=${target}|pairs=${pairSetText(canonicalPairs)}`,
    explanation: explanation(
      "The divisor-count equation becomes (x+1)(y+1)=T, with both factors bounded.",
      "Factor the target divisor count and retain only ordered factor pairs whose exponents lie in range.",
      [
        `Solve (x+1)(y+1) = ${target}.`,
        `The valid ordered exponent pairs are ${pairSetText(canonicalPairs)}.`,
        `Therefore the solution class is ${canonicalAnswer}.`,
      ],
      "Work with factor pairs of the divisor count instead of testing powers of the original number.",
      canonicalAnswer,
    ),
    sourceAncestry: Object.freeze([
      "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
      "NUM-CP005-WAVES-01-03",
      "SSC-DIVISOR-INVERSE-SOLUTION-TOPOLOGY-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId, "NUM-CP005-WAVE04-SOLUTION-CLASS"]),
    lifecycle: LIFECYCLE,
  });
}

export function generateExponentPairSet(
  prototypeId: NumCp005Wave04PrototypeId,
  seed: number,
): NumCp005Wave04Package {
  const maximumExponent = 4 + (seed % 3);
  const multipleTargets = targetsByClass(maximumExponent)["Multiple solutions"];
  const target = multipleTargets[(seed * 11) % multipleTargets.length]!;
  const canonicalPairs = orderedExponentPairsByFactorisation(target, maximumExponent);
  const verifierPairs = orderedExponentPairsByEnumeration(target, maximumExponent);
  const canonicalAnswer = pairSetText(canonicalPairs);
  const verifierAnswer = pairSetText(verifierPairs);
  const omitted = pairSetText(canonicalPairs.slice(0, Math.max(0, canonicalPairs.length - 1)));
  const added = pairSetText([...canonicalPairs, Object.freeze([maximumExponent, maximumExponent] as const)]);
  const shifted = pairSetText(canonicalPairs.map(([x, y], index) =>
    index === 0 ? Object.freeze([Math.min(maximumExponent, x + 1), y] as const) : Object.freeze([x, y] as const)));
  const answerIndex = correctIndex(prototypeId, seed);

  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: difficulty(seed),
    answerSemantic: "EXPONENT_PAIR_SET",
    representation: "DIRECT_INVERSE",
    stem: `For n = 2^x × 5^y, where 0 ≤ x,y ≤ ${maximumExponent}, find the complete set of ordered pairs (x,y) for which n has exactly ${target} positive divisors.`,
    options: makeOptions(canonicalAnswer, [omitted, added, shifted, "∅"], answerIndex, "NUM-CP005-PAIR-SET"),
    correctIndex: answerIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: Object.freeze({
      factorState: Object.freeze([]),
      maximumExponent,
      targetDivisorCount: target,
      exponentPairs: canonicalPairs,
    }),
    mathematicalFingerprint: `${prototypeId}|max=${maximumExponent}|target=${target}|set=${canonicalAnswer}`,
    explanation: explanation(
      "A complete inverse answer must list every bounded ordered factor pair of the target divisor count.",
      "Translate each factor pair u·v=T into x=u−1 and y=v−1, then enforce both exponent bounds.",
      [
        `Factor-pair equation: (x+1)(y+1) = ${target}.`,
        `After applying 0 ≤ x,y ≤ ${maximumExponent}, the valid set is ${canonicalAnswer}.`,
      ],
      "List factor pairs in order and translate them immediately; this avoids missing the reversed pair.",
      canonicalAnswer,
    ),
    sourceAncestry: Object.freeze([
      "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
      "NUM-CP005-WAVES-01-03",
      "SSC-DIVISOR-COMPLETE-INVERSE-SET-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId, "NUM-CP005-WAVE04-COMPLETE-PAIR-SET"]),
    lifecycle: LIFECYCLE,
  });
}

function possibleIntegersFormula(
  totalDivisors: number,
  oddDivisors: number,
  oddPrimes: readonly number[],
): readonly bigint[] {
  if (oddDivisors <= 0 || totalDivisors <= 0 || totalDivisors % oddDivisors !== 0) return Object.freeze([]);
  const exponentOfTwo = totalDivisors / oddDivisors - 1;
  const oddExponent = oddDivisors - 1;
  if (exponentOfTwo < 0 || exponentOfTwo > 5 || oddExponent < 0 || oddExponent > 4) return Object.freeze([]);
  const values = new Set<bigint>();
  for (const prime of oddPrimes) {
    values.add(2n ** BigInt(exponentOfTwo) * BigInt(prime) ** BigInt(oddExponent));
  }
  return Object.freeze([...values].sort((left, right) => left < right ? -1 : left > right ? 1 : 0));
}

function possibleIntegersByEnumeration(
  totalDivisors: number,
  oddDivisors: number,
  oddPrimes: readonly number[],
): readonly bigint[] {
  const values = new Set<bigint>();
  for (let exponentOfTwo = 0; exponentOfTwo <= 5; exponentOfTwo += 1) {
    for (let oddExponent = 0; oddExponent <= 4; oddExponent += 1) {
      for (const prime of oddPrimes) {
        const factors = [
          Object.freeze({ prime: 2, exponent: exponentOfTwo }),
          Object.freeze({ prime, exponent: oddExponent }),
        ].filter((factor) => factor.exponent > 0);
        if (
          divisorCountFormula(factors) === totalDivisors
          && oddDivisorCountFormula(factors) === oddDivisors
        ) values.add(numberFromFactors(factors));
      }
    }
  }
  return Object.freeze([...values].sort((left, right) => left < right ? -1 : left > right ? 1 : 0));
}

export function generatePossibleIntegerSet(
  prototypeId: NumCp005Wave04PrototypeId,
  seed: number,
): NumCp005Wave04Package {
  const oddPrimes = Object.freeze(seed % 2 === 0 ? [3, 5] : [3, 5, 7]);
  const classIndex = (seed - 1) % 3;
  let totalDivisors: number;
  let oddDivisors: number;
  if (classIndex === 0) {
    const exponentOfTwo = 1 + (seed % 5);
    oddDivisors = 1;
    totalDivisors = exponentOfTwo + 1;
  } else if (classIndex === 1) {
    const exponentOfTwo = 1 + (seed % 4);
    const oddExponent = 1 + (seed % 4);
    oddDivisors = oddExponent + 1;
    totalDivisors = (exponentOfTwo + 1) * oddDivisors;
  } else {
    oddDivisors = 2 + (seed % 4);
    totalDivisors = oddDivisors * 7 + 1;
  }

  const canonicalValues = possibleIntegersFormula(totalDivisors, oddDivisors, oddPrimes);
  const verifierValues = possibleIntegersByEnumeration(totalDivisors, oddDivisors, oddPrimes);
  const canonicalAnswer = setText(canonicalValues.map(String));
  const verifierAnswer = setText(verifierValues.map(String));
  const omitted = setText(canonicalValues.slice(0, Math.max(0, canonicalValues.length - 1)).map(String));
  const doubled = setText(canonicalValues.map((value) => String(value * 2n)));
  const plusOne = setText(canonicalValues.map((value) => String(value + 1n)));
  const answerIndex = correctIndex(prototypeId, seed);

  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: difficulty(seed),
    answerSemantic: "INTEGER_SET",
    representation: "DIRECT_INVERSE",
    stem: `A number has the form n = 2^a × p^b, where 0 ≤ a ≤ 5, 0 ≤ b ≤ 4 and p is one of ${setText(oddPrimes.map(String))}. If n has ${totalDivisors} positive divisors and ${oddDivisors} odd positive divisors, find the complete set of possible values of n.`,
    options: makeOptions(canonicalAnswer, [omitted, doubled, plusOne, "∅"], answerIndex, "NUM-CP005-INTEGER-SET"),
    correctIndex: answerIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: Object.freeze({
      factorState: Object.freeze([]),
      totalDivisors,
      oddDivisors,
      oddPrimes,
      possibleIntegers: canonicalValues.map(String),
      solutionClass: solutionClass(canonicalValues.length),
    }),
    mathematicalFingerprint: `${prototypeId}|T=${totalDivisors}|O=${oddDivisors}|primes=${oddPrimes.join("-")}|set=${canonicalAnswer}`,
    explanation: explanation(
      "For n=2^a p^b, odd divisors equal b+1 and total divisors equal (a+1)(b+1).",
      "Recover b from the odd-divisor count, recover a from total ÷ odd, then test each allowed odd prime.",
      [
        `b + 1 = ${oddDivisors}.`,
        `(a + 1)(${oddDivisors}) = ${totalDivisors}.`,
        `The complete bounded integer set is ${canonicalAnswer}.`,
      ],
      "Use total ÷ odd to get a+1 immediately; then vary only the allowed odd prime.",
      canonicalAnswer,
    ),
    sourceAncestry: Object.freeze([
      "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
      "NUM-CP005-WAVES-01-03",
      "SSC-DIVISOR-ONE-MANY-NO-INTEGER-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId, "NUM-CP005-WAVE04-INTEGER-SET"]),
    lifecycle: LIFECYCLE,
  });
}

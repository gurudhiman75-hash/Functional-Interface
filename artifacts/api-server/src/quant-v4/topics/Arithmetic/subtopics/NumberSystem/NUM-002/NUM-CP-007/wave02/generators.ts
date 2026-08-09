import {
  base,
  cleanExplanation,
  createRng,
  difficulty,
  hidden,
  mod,
  numericOptions,
  rangeCount,
  sources,
  textOptions,
  tierForSeed,
  valuesInRange,
  type Rng,
} from "./core.ts";
import type { NumCp007Wave02Package } from "./types.ts";

function propagationState(seed: number, rng: Rng) {
  const tier = tierForSeed(seed);
  const divisor =
    tier === 0 ? rng.int(4, 12) : tier === 1 ? rng.int(13, 39) : rng.int(40, 97);
  const remainderA = seed % 11 === 0 ? 0 : rng.int(0, divisor - 1);
  const remainderB = seed % 7 === 0 ? divisor - 1 : rng.int(0, divisor - 1);
  return { tier, divisor, remainderA, remainderB };
}

export function differenceRemainder(seed: number, rng: Rng): NumCp007Wave02Package {
  const state = propagationState(seed, rng);
  const rawDifference = state.remainderA - state.remainderB;
  const answer = mod(rawDifference, state.divisor);
  const options = numericOptions(
    answer,
    [
      { value: Math.abs(rawDifference), misconceptionId: "USED_ABSOLUTE_DIFFERENCE" },
      { value: mod(state.remainderB - state.remainderA, state.divisor), misconceptionId: "REVERSED_SUBTRACTION" },
      { value: state.divisor - answer, misconceptionId: "USED_COMPLEMENT_WITHOUT_DIRECTION" },
      { value: mod(answer + 1, state.divisor), misconceptionId: "OFF_BY_ONE" },
    ],
    rng,
    { nonNegative: true },
  );
  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-009",
    seed,
    difficulty: difficulty(state.tier, rawDifference < 0 ? 2 : 1),
    answerSemantic: "REMAINDER",
    representation: "COMPONENT_REMAINDERS_PROSE",
    stem: `Two numbers A and B leave remainders ${state.remainderA} and ${state.remainderB}, respectively, when divided by ${state.divisor}. What remainder does A − B leave?`,
    ...options,
    verifierAnswer: String(mod(state.remainderA - state.remainderB, state.divisor)),
    hiddenState: hidden("DIFFERENCE_REMAINDER", { ...state, rawDifference }),
    mathematicalFingerprint: `DR|${state.divisor}|${state.remainderA}|${state.remainderB}|${answer}`,
    explanation: cleanExplanation(
      "Subtract the known remainders and express the result as the least non-negative remainder.",
      "Compute the remainder difference first; if it is negative, add the divisor.",
      [
        `${state.remainderA} − ${state.remainderB} = ${rawDifference}`,
        rawDifference < 0
          ? `${rawDifference} + ${state.divisor} = ${answer}`
          : `${rawDifference} already lies between 0 and ${state.divisor - 1}.`,
      ],
      String(answer),
    ),
    sourceAncestry: sources("SSC-REMAINDER-OF-DIFFERENCE"),
    prototypeAncestry: ["NUM-CP007-COMPATIBLE-REMAINDER-PROPAGATION"],
  });
}

export function scaledRemainder(seed: number, rng: Rng): NumCp007Wave02Package {
  const tier = tierForSeed(seed);
  const divisor =
    tier === 0 ? rng.int(4, 12) : tier === 1 ? rng.int(13, 39) : rng.int(40, 97);
  const remainder = seed % 10 === 0 ? 0 : rng.int(1, divisor - 1);
  const multiplier = tier === 0 ? rng.int(2, 6) : tier === 1 ? rng.int(4, 12) : rng.int(9, 25);
  const raw = multiplier * remainder;
  const answer = mod(raw, divisor);
  const options = numericOptions(
    answer,
    [
      { value: raw, misconceptionId: "DID_NOT_REDUCE_SCALED_REMAINDER" },
      { value: mod(remainder + multiplier, divisor), misconceptionId: "ADDED_INSTEAD_OF_MULTIPLIED" },
      { value: remainder, misconceptionId: "IGNORED_SCALE_FACTOR" },
      { value: divisor - answer, misconceptionId: "USED_COMPLEMENT" },
    ],
    rng,
    { nonNegative: true },
  );
  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-010",
    seed,
    difficulty: difficulty(tier, raw >= divisor ? 1 : 0),
    answerSemantic: "REMAINDER",
    representation: "SCALED_REMAINDER_PROSE",
    stem: `A number N leaves remainder ${remainder} when divided by ${divisor}. What remainder does ${multiplier}N leave when divided by ${divisor}?`,
    ...options,
    verifierAnswer: String(mod(multiplier * remainder, divisor)),
    hiddenState: hidden("SCALED_REMAINDER", { divisor, remainder, multiplier, tier }),
    mathematicalFingerprint: `SR|${divisor}|${remainder}|${multiplier}|${answer}`,
    explanation: cleanExplanation(
      "A multiple of a number has the same remainder as the corresponding multiple of its remainder.",
      "Multiply the known remainder by the scale factor, then reduce by the divisor.",
      [
        `${multiplier} × ${remainder} = ${raw}`,
        `${raw} ÷ ${divisor} leaves remainder ${answer}.`,
      ],
      String(answer),
    ),
    sourceAncestry: sources("SSC-SCALED-REMAINDER"),
    prototypeAncestry: ["NUM-CP007-COMPATIBLE-REMAINDER-PROPAGATION"],
  });
}

export function compatibleNestedRemainder(seed: number, rng: Rng): NumCp007Wave02Package {
  const tier = tierForSeed(seed);
  const smallDivisor =
    tier === 0 ? rng.int(2, 8) : tier === 1 ? rng.int(6, 15) : rng.int(11, 25);
  const factor = tier === 0 ? rng.int(2, 5) : tier === 1 ? rng.int(3, 8) : rng.int(5, 12);
  const largeDivisor = smallDivisor * factor;
  const knownRemainder =
    seed % 10 === 0 ? 0 : seed % 10 === 1 ? largeDivisor - 1 : rng.int(1, largeDivisor - 1);
  const answer = mod(knownRemainder, smallDivisor);
  const options = numericOptions(
    answer,
    [
      { value: knownRemainder, misconceptionId: "REUSED_LARGE_DIVISOR_REMAINDER" },
      { value: mod(largeDivisor - knownRemainder, smallDivisor), misconceptionId: "USED_COMPLEMENT" },
      { value: factor, misconceptionId: "USED_DIVISOR_RATIO" },
      { value: mod(answer + 1, smallDivisor), misconceptionId: "OFF_BY_ONE" },
    ],
    rng,
    { nonNegative: true },
  );
  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-011",
    seed,
    difficulty: difficulty(tier, knownRemainder >= smallDivisor ? 1 : 0),
    answerSemantic: "REMAINDER",
    representation: "COMPATIBLE_NESTED_DIVISOR_PROSE",
    stem: `A number leaves remainder ${knownRemainder} when divided by ${largeDivisor}. What remainder will it leave when divided by ${smallDivisor}?`,
    ...options,
    verifierAnswer: String(mod(knownRemainder, smallDivisor)),
    hiddenState: hidden("COMPATIBLE_NESTED_REMAINDER", {
      smallDivisor,
      largeDivisor,
      factor,
      knownRemainder,
      tier,
    }),
    mathematicalFingerprint: `NR|${smallDivisor}|${largeDivisor}|${knownRemainder}|${answer}`,
    explanation: cleanExplanation(
      `${largeDivisor} is a multiple of ${smallDivisor}, so only the known remainder needs to be divided again.`,
      "Reduce the known remainder by the smaller divisor.",
      [
        `${largeDivisor} = ${smallDivisor} × ${factor}`,
        `${knownRemainder} ÷ ${smallDivisor} leaves remainder ${answer}.`,
      ],
      String(answer),
    ),
    sourceAncestry: sources("SSC-COMPATIBLE-NESTED-REMAINDER"),
    prototypeAncestry: ["NUM-CP007-NESTED-REMAINDER-COMPATIBILITY"],
  });
}

export function polynomialRemainder(seed: number, rng: Rng): NumCp007Wave02Package {
  const tier = tierForSeed(seed);
  const divisor =
    tier === 0 ? rng.int(5, 12) : tier === 1 ? rng.int(13, 35) : rng.int(36, 79);
  const remainder = seed % 12 === 0 ? 0 : rng.int(1, divisor - 1);
  const coefficient = tier === 0 ? rng.int(2, 5) : tier === 1 ? rng.int(3, 9) : rng.int(7, 16);
  const constant = rng.int(1, Math.max(2, divisor - 1));
  const quadratic = seed % 2 === 0;
  const raw = quadratic
    ? remainder * remainder + coefficient * remainder + constant
    : coefficient * remainder + constant;
  const answer = mod(raw, divisor);
  const expression = quadratic
    ? `N² + ${coefficient}N + ${constant}`
    : `${coefficient}N + ${constant}`;
  const missedSquare = mod(coefficient * remainder + constant, divisor);
  const options = numericOptions(
    answer,
    [
      { value: raw, misconceptionId: "DID_NOT_REDUCE_EXPRESSION" },
      { value: missedSquare, misconceptionId: quadratic ? "OMITTED_SQUARE_TERM" : "REUSED_LINEAR_PART" },
      { value: mod(remainder + coefficient + constant, divisor), misconceptionId: "ADDED_COMPONENTS_ONLY" },
      { value: divisor - answer, misconceptionId: "USED_COMPLEMENT" },
    ],
    rng,
    { nonNegative: true },
  );
  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-012",
    seed,
    difficulty: difficulty(tier, quadratic ? 2 : 1),
    answerSemantic: "REMAINDER",
    representation: "POLYNOMIAL_REMAINDER_PROSE",
    stem: `A number N leaves remainder ${remainder} when divided by ${divisor}. What remainder does ${expression} leave when divided by ${divisor}?`,
    ...options,
    verifierAnswer: String(
      mod(
        quadratic
          ? remainder * remainder + coefficient * remainder + constant
          : coefficient * remainder + constant,
        divisor,
      ),
    ),
    hiddenState: hidden("POLYNOMIAL_REMAINDER", {
      divisor,
      remainder,
      coefficient,
      constant,
      quadratic,
      tier,
    }),
    mathematicalFingerprint: `PR|${divisor}|${remainder}|${coefficient}|${constant}|${quadratic ? 2 : 1}|${answer}`,
    explanation: cleanExplanation(
      "Replace N by its remainder in a sum, product or polynomial, then reduce the result.",
      `Substitute ${remainder} for N in the expression.`,
      [
        quadratic
          ? `${remainder}² + ${coefficient} × ${remainder} + ${constant} = ${raw}`
          : `${coefficient} × ${remainder} + ${constant} = ${raw}`,
        `${raw} ÷ ${divisor} leaves remainder ${answer}.`,
      ],
      String(answer),
    ),
    sourceAncestry: sources("SSC-BOUNDED-POLYNOMIAL-REMAINDER"),
    prototypeAncestry: ["NUM-CP007-POLYNOMIAL-REMAINDER-PROPAGATION"],
  });
}

export function linkedDivisorQuotient(seed: number, rng: Rng): NumCp007Wave02Package {
  const tier = tierForSeed(seed);
  const quotient =
    tier === 0 ? rng.int(3, 10) : tier === 1 ? rng.int(8, 25) : rng.int(20, 55);
  const gap = tier === 0 ? rng.int(2, 6) : tier === 1 ? rng.int(4, 12) : rng.int(8, 20);
  const divisor = quotient + gap;
  const remainder = seed % 10 === 0 ? 0 : rng.int(1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  const candidates: number[] = [];
  for (let d = 1; d <= dividend; d++) {
    const q = d - gap;
    if (q < 0 || remainder >= d) continue;
    if (dividend === d * q + remainder) candidates.push(d);
  }
  if (candidates.length !== 1 || candidates[0] !== divisor) {
    throw new Error(`Linked state is not unique: ${JSON.stringify(candidates)}`);
  }
  const options = numericOptions(
    divisor,
    [
      { value: quotient, misconceptionId: "RETURNED_QUOTIENT" },
      { value: Math.floor((dividend - remainder) / gap), misconceptionId: "DIVIDED_BY_GAP" },
      { value: divisor - gap, misconceptionId: "SUBTRACTED_GAP_TWICE" },
      { value: divisor + gap, misconceptionId: "ADDED_GAP_TWICE" },
    ],
    rng,
    { positive: true },
  );
  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-013",
    seed,
    difficulty: difficulty(tier, 2),
    answerSemantic: "DIVISOR",
    representation: "LINKED_DIVISION_RELATION",
    stem: `A number ${dividend} is divided by a divisor. The remainder is ${remainder}, and the divisor is ${gap} more than the quotient. Find the divisor.`,
    ...options,
    verifierAnswer: String(candidates[0]),
    hiddenState: hidden("LINKED_DIVISOR_QUOTIENT", {
      dividend,
      divisor,
      quotient,
      remainder,
      gap,
      tier,
    }),
    mathematicalFingerprint: `LQ|${dividend}|${gap}|${remainder}|${divisor}|${quotient}`,
    explanation: cleanExplanation(
      "Use the division algorithm together with the relation between divisor and quotient.",
      "Let the quotient be q; then the divisor is q plus the stated gap.",
      [
        `${dividend} = q(q + ${gap}) + ${remainder}`,
        `${dividend - remainder} = q(q + ${gap})`,
        `${quotient} × ${divisor} = ${dividend - remainder}, so q = ${quotient}.`,
        `Divisor = ${quotient} + ${gap} = ${divisor}.`,
      ],
      String(divisor),
    ),
    sourceAncestry: sources("SSC-LINKED-DIVISOR-QUOTIENT-RECONSTRUCTION"),
    prototypeAncestry: ["NUM-CP007-LINKED-INVERSE-DIVISION-STATE"],
  });
}

export function boundedDividendCount(seed: number, rng: Rng): NumCp007Wave02Package {
  const tier = tierForSeed(seed);
  const divisor =
    tier === 0 ? rng.int(4, 10) : tier === 1 ? rng.int(9, 20) : rng.int(17, 35);
  const remainder = seed % 10 === 0 ? 0 : rng.int(0, divisor - 1);
  const firstQ = tier === 0 ? rng.int(1, 6) : tier === 1 ? rng.int(4, 15) : rng.int(10, 35);
  const countTarget = tier === 0 ? rng.int(2, 5) : tier === 1 ? rng.int(4, 8) : rng.int(6, 12);
  const first = divisor * firstQ + remainder;
  const last = divisor * (firstQ + countTarget - 1) + remainder;
  const lower = first - rng.int(0, Math.max(0, divisor - 1));
  const upper = last + rng.int(0, Math.max(0, divisor - 1));
  const values = valuesInRange(lower, upper, divisor, remainder);
  const answer = values.length;
  const options = numericOptions(
    answer,
    [
      { value: Math.floor((upper - lower) / divisor), misconceptionId: "DROPPED_ENDPOINT_CORRECTION" },
      { value: answer + 1, misconceptionId: "COUNTED_ONE_EXTRA_TERM" },
      { value: Math.max(0, answer - 1), misconceptionId: "MISSED_ONE_ENDPOINT" },
      { value: Math.ceil((upper - lower + 1) / divisor), misconceptionId: "USED_RANGE_LENGTH_ONLY" },
    ],
    rng,
    { nonNegative: true },
  );
  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-014",
    seed,
    difficulty: difficulty(tier, 1),
    answerSemantic: "COUNT",
    representation: "BOUNDED_REMAINDER_RANGE",
    stem: `How many integers from ${lower} to ${upper}, both inclusive, leave remainder ${remainder} when divided by ${divisor}?`,
    ...options,
    verifierAnswer: String(rangeCount(lower, upper, divisor, remainder)),
    hiddenState: hidden("BOUNDED_DIVIDEND_COUNT", {
      lower,
      upper,
      divisor,
      remainder,
      tier,
      values,
    }),
    mathematicalFingerprint: `BC|${lower}|${upper}|${divisor}|${remainder}|${answer}`,
    explanation: cleanExplanation(
      "Numbers with a fixed remainder form an arithmetic sequence with common difference equal to the divisor.",
      "Find the first and last valid numbers in the interval, then count the terms.",
      [
        `Valid numbers in the interval are ${values.join(", ")}.`,
        `Therefore the count is ${answer}.`,
      ],
      String(answer),
    ),
    sourceAncestry: sources("SSC-BOUNDED-DIVIDEND-COUNT"),
    prototypeAncestry: ["NUM-CP007-BOUNDED-STATE-ENUMERATION"],
  });
}

type SolutionClass = "NO_SOLUTION" | "EXACTLY_ONE" | "MORE_THAN_ONE" | "INVALID_REMAINDER";

function solutionLabel(value: SolutionClass): string {
  switch (value) {
    case "NO_SOLUTION":
      return "No integer satisfies the condition";
    case "EXACTLY_ONE":
      return "Exactly one integer satisfies the condition";
    case "MORE_THAN_ONE":
      return "More than one integer satisfies the condition";
    case "INVALID_REMAINDER":
      return "The remainder condition itself is invalid";
  }
}

export function boundedSolutionClass(seed: number, rng: Rng): NumCp007Wave02Package {
  const tier = tierForSeed(seed);
  const divisor =
    tier === 0 ? rng.int(4, 10) : tier === 1 ? rng.int(9, 20) : rng.int(17, 35);
  const topology = (seed - 1) % 4;
  let remainder: number;
  let lower: number;
  let upper: number;
  let answerClass: SolutionClass;

  if (topology === 3) {
    remainder = divisor + rng.int(0, 4);
    lower = rng.int(1, 50);
    upper = lower + rng.int(5, 25);
    answerClass = "INVALID_REMAINDER";
  } else {
    remainder = rng.int(0, divisor - 1);
    const q = rng.int(2, 20);
    const anchor = divisor * q + remainder;
    if (topology === 0) {
      lower = anchor + 1;
      upper = Math.min(anchor + divisor - 1, lower + Math.max(0, divisor - 2));
      answerClass = "NO_SOLUTION";
    } else if (topology === 1) {
      lower = anchor - rng.int(0, Math.max(0, divisor - 1));
      upper = anchor + rng.int(0, Math.max(0, divisor - 1));
      answerClass = "EXACTLY_ONE";
    } else {
      lower = anchor - rng.int(0, Math.max(0, divisor - 1));
      upper = anchor + divisor * rng.int(1, 3) + rng.int(0, Math.max(0, divisor - 1));
      answerClass = "MORE_THAN_ONE";
    }
  }

  const actualValues =
    remainder >= divisor ? [] : valuesInRange(lower, upper, divisor, remainder);
  const derivedClass: SolutionClass =
    remainder >= divisor
      ? "INVALID_REMAINDER"
      : actualValues.length === 0
        ? "NO_SOLUTION"
        : actualValues.length === 1
          ? "EXACTLY_ONE"
          : "MORE_THAN_ONE";
  if (derivedClass !== answerClass) {
    throw new Error(`Topology generation failed: expected ${answerClass}, got ${derivedClass}`);
  }

  const labels = [
    "NO_SOLUTION",
    "EXACTLY_ONE",
    "MORE_THAN_ONE",
    "INVALID_REMAINDER",
  ] as const;
  const optionSet = textOptions(
    solutionLabel(answerClass),
    labels
      .filter((value) => value !== answerClass)
      .map((value) => ({
        value: solutionLabel(value),
        misconceptionId: `MISCLASSIFIED_AS_${value}`,
      })),
    rng,
  );

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-015",
    seed,
    difficulty: difficulty(tier, answerClass === "INVALID_REMAINDER" ? 1 : 2),
    answerSemantic: "SOLUTION_CLASS",
    representation: "BOUNDED_SOLUTION_TOPOLOGY",
    stem: `Consider integers from ${lower} to ${upper}, both inclusive, that leave remainder ${remainder} when divided by ${divisor}. Which statement is correct?`,
    ...optionSet,
    verifierAnswer: solutionLabel(derivedClass),
    hiddenState: hidden("BOUNDED_SOLUTION_CLASS", {
      lower,
      upper,
      divisor,
      remainder,
      answerClass,
      actualValues,
      tier,
    }),
    mathematicalFingerprint: `SC|${lower}|${upper}|${divisor}|${remainder}|${answerClass}`,
    explanation: cleanExplanation(
      "A valid ordinary remainder must be smaller than the divisor; otherwise enumerate the admissible values in the interval.",
      "Check the remainder bound first, then count the matching integers.",
      remainder >= divisor
        ? [
            `${remainder} is not less than ${divisor}.`,
            "Therefore the stated remainder condition is invalid.",
          ]
        : [
            actualValues.length
              ? `The matching integers are ${actualValues.join(", ")}.`
              : "No integer in the interval has the required remainder.",
            `Hence: ${solutionLabel(answerClass)}.`,
          ],
      solutionLabel(answerClass),
    ),
    sourceAncestry: sources("SSC-DIVISION-STATE-SOLUTION-TOPOLOGY"),
    prototypeAncestry: ["NUM-CP007-ONE-MANY-NO-SOLUTION-CLASSIFICATION"],
  });
}

type NearestClass = "LOWER" | "UPPER" | "TIE" | "EXACT";

function nearestLabel(value: NearestClass): string {
  switch (value) {
    case "LOWER":
      return "The lower multiple is nearer";
    case "UPPER":
      return "The upper multiple is nearer";
    case "TIE":
      return "The two neighbouring multiples are equally near";
    case "EXACT":
      return "The given number is already a multiple";
  }
}

export function nearestMultipleClass(seed: number, rng: Rng): NumCp007Wave02Package {
  const tier = tierForSeed(seed);
  let divisor =
    tier === 0 ? rng.int(4, 12) : tier === 1 ? rng.int(13, 40) : rng.int(41, 90);
  const requiredClass = (["LOWER", "UPPER", "TIE", "EXACT"] as const)[(seed - 1) % 4]!;
  if (requiredClass === "TIE" && divisor % 2 !== 0) divisor++;
  const quotient =
    tier === 0 ? rng.int(2, 12) : tier === 1 ? rng.int(8, 30) : rng.int(20, 80);
  const remainder =
    requiredClass === "EXACT"
      ? 0
      : requiredClass === "TIE"
        ? divisor / 2
        : requiredClass === "LOWER"
          ? rng.int(1, Math.max(1, Math.floor((divisor - 1) / 2)))
          : rng.int(Math.floor(divisor / 2) + 1, divisor - 1);
  const number = divisor * quotient + remainder;
  const lower = divisor * quotient;
  const upper = remainder === 0 ? lower : divisor * (quotient + 1);
  const lowerDistance = number - lower;
  const upperDistance = upper - number;
  const derived: NearestClass =
    remainder === 0
      ? "EXACT"
      : lowerDistance === upperDistance
        ? "TIE"
        : lowerDistance < upperDistance
          ? "LOWER"
          : "UPPER";
  if (derived !== requiredClass) {
    throw new Error(`Nearest class generation failed: ${requiredClass}, ${derived}`);
  }
  const allClasses = ["LOWER", "UPPER", "TIE", "EXACT"] as const;
  const optionSet = textOptions(
    nearestLabel(derived),
    allClasses
      .filter((value) => value !== derived)
      .map((value) => ({
        value: nearestLabel(value),
        misconceptionId: `MISCLASSIFIED_NEAREST_AS_${value}`,
      })),
    rng,
  );
  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-016",
    seed,
    difficulty: difficulty(tier, derived === "TIE" || derived === "EXACT" ? 1 : 0),
    answerSemantic: "NEAREST_MULTIPLE_CLASS",
    representation: "NEAREST_MULTIPLE_COMPARISON",
    stem: `For the number ${number} and divisor ${divisor}, which statement about the nearest multiple of ${divisor} is correct?`,
    ...optionSet,
    verifierAnswer: nearestLabel(derived),
    hiddenState: hidden("NEAREST_MULTIPLE_CLASS", {
      number,
      divisor,
      lower,
      upper,
      lowerDistance,
      upperDistance,
      derived,
      tier,
    }),
    mathematicalFingerprint: `NM|${number}|${divisor}|${lower}|${upper}|${derived}`,
    explanation: cleanExplanation(
      "Compare the distance to the neighbouring lower and upper multiples.",
      "Find both neighbouring multiples and compare their distances from the number.",
      [
        `Lower multiple = ${lower}; distance = ${lowerDistance}.`,
        `Upper multiple = ${upper}; distance = ${upperDistance}.`,
        nearestLabel(derived),
      ],
      nearestLabel(derived),
    ),
    sourceAncestry: sources("SSC-NEAREST-MULTIPLE-TIE-CLASSIFICATION"),
    prototypeAncestry: ["NUM-CP007-EXACT-DIVISIBILITY-ADJUSTMENT"],
  });
}

export const WAVE02_GENERATORS = {
  "NUM-CP007-PROT-009": differenceRemainder,
  "NUM-CP007-PROT-010": scaledRemainder,
  "NUM-CP007-PROT-011": compatibleNestedRemainder,
  "NUM-CP007-PROT-012": polynomialRemainder,
  "NUM-CP007-PROT-013": linkedDivisorQuotient,
  "NUM-CP007-PROT-014": boundedDividendCount,
  "NUM-CP007-PROT-015": boundedSolutionClass,
  "NUM-CP007-PROT-016": nearestMultipleClass,
} as const;

import {
  DS_CLASS_LABELS,
  STATE_CLASS_LABELS,
  base,
  classifyDivisionState,
  cleanExplanation,
  difficulty,
  formatNumberSet,
  hidden,
  mod,
  numericOptions,
  sources,
  textOptions,
  tierForSeed,
  valuesInRange,
  type DivisionStateClass,
  type DsClass,
  type Rng,
} from "./core.ts";
import type { NumCp007Wave03Package } from "./types.ts";

function divisorForTier(tier: 0 | 1 | 2, rng: Rng): number {
  return tier === 0 ? rng.int(4, 12) : tier === 1 ? rng.int(13, 39) : rng.int(40, 89);
}

function quotientForTier(tier: 0 | 1 | 2, rng: Rng): number {
  return tier === 0 ? rng.int(2, 14) : tier === 1 ? rng.int(15, 70) : rng.int(71, 240);
}

export function boundedDividendReconstruction(seed: number, rng: Rng): NumCp007Wave03Package {
  const tier = tierForSeed(seed);
  const divisor = divisorForTier(tier, rng);
  const quotient = quotientForTier(tier, rng);
  const remainder = seed % 9 === 0 ? 0 : seed % 11 === 0 ? divisor - 1 : rng.int(0, divisor - 1);
  const answer = divisor * quotient + remainder;

  const span = Math.min(divisor - 1, tier === 0 ? 4 : tier === 1 ? 8 : 12);
  const leftRoom = rng.int(0, span);
  const rightRoom = span - leftRoom;
  const lower = answer - leftRoom;
  const upper = answer + rightRoom;
  const candidates = valuesInRange(lower, upper, divisor, remainder);
  if (candidates.length !== 1 || candidates[0] !== answer) {
    throw new Error("Bounded reconstruction did not isolate one dividend.");
  }

  const boundedWrongs: { value: number; misconceptionId: string }[] = [];
  for (let delta = 1; boundedWrongs.length < 3 && delta <= span; delta++) {
    for (const value of [answer - delta, answer + delta]) {
      if (value < lower || value > upper || value === answer) continue;
      boundedWrongs.push({
        value,
        misconceptionId: value < answer ? "NEARBY_IN_RANGE_BELOW" : "NEARBY_IN_RANGE_ABOVE",
      });
      if (boundedWrongs.length === 3) break;
    }
  }
  if (boundedWrongs.length < 3) {
    for (let value = lower; value <= upper && boundedWrongs.length < 3; value++) {
      if (value === answer || boundedWrongs.some((item) => item.value === value)) continue;
      boundedWrongs.push({ value, misconceptionId: "IN_RANGE_WRONG_REMAINDER" });
    }
  }
  const optionSet = numericOptions(answer, boundedWrongs, rng, { nonNegative: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-017",
    seed,
    difficulty: difficulty(tier, 1),
    answerSemantic: "INTEGER",
    representation: "RANGE_BOUNDED_DIVIDEND",
    stem: `A number lies from ${lower} to ${upper}, inclusive. When divided by ${divisor}, it leaves remainder ${remainder}. What is the number?`,
    ...optionSet,
    verifierAnswer: String(candidates[0]),
    hiddenState: hidden("BOUNDED_DIVIDEND_RECONSTRUCTION", { lower, upper, divisor, remainder }),
    mathematicalFingerprint: `BR|${lower}|${upper}|${divisor}|${remainder}|${answer}`,
    explanation: cleanExplanation(
      "Numbers with a fixed remainder are spaced by the divisor.",
      "Check the declared interval for the one value that has the required remainder.",
      [
        `Required form: number = ${divisor} × k + ${remainder}.`,
        `Within ${lower} to ${upper}, the only matching value is ${answer}.`,
      ],
      String(answer),
    ),
    sourceAncestry: sources("SSC-RANGE-BOUNDED-DIVIDEND-RECONSTRUCTION"),
    prototypeAncestry: ["NUM-CP007-BOUNDED-STATE-RECONSTRUCTION"],
  });
}

export function boundedNumberSet(seed: number, rng: Rng): NumCp007Wave03Package {
  const tier = tierForSeed(seed);
  const divisor = divisorForTier(tier, rng);
  const remainder = seed % 10 === 0 ? 0 : rng.int(0, divisor - 1);
  const count = tier === 0 ? rng.int(3, 4) : tier === 1 ? rng.int(4, 5) : rng.int(5, 6);
  const startQ = quotientForTier(tier, rng);
  const first = divisor * startQ + remainder;
  const last = first + divisor * (count - 1);
  const lower = first - rng.int(0, Math.max(0, divisor - 1));
  const upper = last + rng.int(0, Math.max(0, divisor - 1));
  const answerValues = valuesInRange(lower, upper, divisor, remainder);
  const answer = formatNumberSet(answerValues);

  const omitFirst = formatNumberSet(answerValues.slice(1));
  const omitLast = formatNumberSet(answerValues.slice(0, -1));
  const shifted = formatNumberSet(answerValues.map((value) => value + 1));
  const extraNext = formatNumberSet([...answerValues, answerValues[answerValues.length - 1]! + divisor]);
  const optionSet = textOptions(answer, [
    { value: omitFirst, misconceptionId: "MISSED_LOWER_BOUND_MEMBER" },
    { value: omitLast, misconceptionId: "MISSED_UPPER_BOUND_MEMBER" },
    { value: shifted, misconceptionId: "SHIFTED_REMAINDER_CLASS" },
    { value: extraNext, misconceptionId: "INCLUDED_OUT_OF_RANGE_MEMBER" },
  ], rng);

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-018",
    seed,
    difficulty: difficulty(tier, 1),
    answerSemantic: "NUMBER_SET",
    representation: "BOUNDED_CANDIDATE_SET",
    stem: `Which set contains all integers from ${lower} to ${upper}, inclusive, that leave remainder ${remainder} when divided by ${divisor}?`,
    ...optionSet,
    verifierAnswer: answer,
    hiddenState: hidden("BOUNDED_NUMBER_SET", { lower, upper, divisor, remainder }),
    mathematicalFingerprint: `SET|${lower}|${upper}|${divisor}|${remainder}|${answerValues.join(".")}`,
    explanation: cleanExplanation(
      "All matching numbers lie in one arithmetic progression with common difference equal to the divisor.",
      "Start with the first matching value in the interval and keep adding the divisor.",
      [
        `Use numbers of the form ${divisor} × k + ${remainder}.`,
        `The matching values are ${answerValues.join(", ")}.`,
      ],
      answer,
    ),
    sourceAncestry: sources("SSC-BOUNDED-DIVISION-STATE-SET"),
    prototypeAncestry: ["NUM-CP007-BOUNDED-STATE-ENUMERATION"],
  });
}

export function divisionStateClassification(seed: number, rng: Rng): NumCp007Wave03Package {
  const tier = tierForSeed(seed);
  const divisor = divisorForTier(tier, rng);
  const quotient = quotientForTier(tier, rng);
  const validRemainder = rng.int(0, divisor - 1);
  const requestedClass = ([
    "VALID",
    "INVALID_IDENTITY",
    "INVALID_REMAINDER",
    "INVALID_BOTH",
  ] as const)[(seed - 1) % 4]!;

  let dividend = divisor * quotient + validRemainder;
  let remainder = validRemainder;
  if (requestedClass === "INVALID_IDENTITY") {
    dividend += 1;
  } else if (requestedClass === "INVALID_REMAINDER") {
    remainder = divisor;
    dividend = divisor * quotient + remainder;
  } else if (requestedClass === "INVALID_BOTH") {
    remainder = divisor;
    dividend = divisor * quotient + remainder + 1;
  }

  const answerClass = classifyDivisionState(dividend, divisor, quotient, remainder);
  if (answerClass !== requestedClass) throw new Error("State classification construction failed.");
  const answer = STATE_CLASS_LABELS[answerClass];
  const optionSet = textOptions(answer, (Object.keys(STATE_CLASS_LABELS) as DivisionStateClass[])
    .filter((key) => key !== answerClass)
    .map((key) => ({ value: STATE_CLASS_LABELS[key], misconceptionId: `MISCLASSIFIED_AS_${key}` })), rng);

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-019",
    seed,
    difficulty: difficulty(tier, requestedClass === "VALID" ? 1 : 2),
    answerSemantic: "SOLUTION_CLASS",
    representation: "DIVISION_STATE_CLASSIFICATION",
    stem: `A division record states: dividend ${dividend}, divisor ${divisor}, quotient ${quotient}, remainder ${remainder}. How should this record be classified?`,
    ...optionSet,
    verifierAnswer: STATE_CLASS_LABELS[classifyDivisionState(dividend, divisor, quotient, remainder)],
    hiddenState: hidden("DIVISION_STATE_CLASSIFICATION", { dividend, divisor, quotient, remainder }),
    mathematicalFingerprint: `CLS|${dividend}|${divisor}|${quotient}|${remainder}|${answerClass}`,
    explanation: cleanExplanation(
      "A valid division state must satisfy both N = dq + r and 0 ≤ r < d.",
      "Check the arithmetic identity and the remainder bound separately.",
      [
        `Identity check: ${divisor} × ${quotient} + ${remainder} = ${divisor * quotient + remainder}.`,
        `Remainder check: ${remainder} must be at least 0 and smaller than ${divisor}.`,
        `The correct classification is: ${answer}.`,
      ],
      answer,
    ),
    sourceAncestry: sources("SSC-DIVISION-STATE-POSSIBLE-IMPOSSIBLE"),
    prototypeAncestry: ["NUM-CP007-DIVISION-STATE-VALIDITY"],
  });
}

export function sameRemainderDivisorCandidate(seed: number, rng: Rng): NumCp007Wave03Package {
  const tier = tierForSeed(seed);
  const divisor = divisorForTier(tier, rng);
  const remainder = rng.int(0, Math.max(0, divisor - 1));
  const q1 = quotientForTier(tier, rng);
  const q2 = q1 + rng.int(2, 8);
  const first = divisor * q1 + remainder;
  const second = divisor * q2 + remainder;
  const difference = second - first;

  const wrongValues: number[] = [];
  for (let delta = 1; wrongValues.length < 3 && delta < 100; delta++) {
    for (const candidate of [divisor + delta, Math.max(2, divisor - delta)]) {
      if (candidate === divisor || wrongValues.includes(candidate)) continue;
      if (mod(first, candidate) === mod(second, candidate)) continue;
      wrongValues.push(candidate);
      if (wrongValues.length === 3) break;
    }
  }
  if (wrongValues.length !== 3) throw new Error("Could not build invalid same-remainder divisor candidates.");

  const optionSet = numericOptions(divisor, wrongValues.map((value, index) => ({
    value,
    misconceptionId: ["DOES_NOT_DIVIDE_DIFFERENCE", "UNVERIFIED_NEARBY_DIVISOR", "IGNORED_COMMON_REMAINDER_TEST"][index]!,
  })), rng, { positive: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-020",
    seed,
    difficulty: difficulty(tier, 2),
    answerSemantic: "DIVISOR",
    representation: "SAME_REMAINDER_CANDIDATE_OPTIONS",
    stem: `The numbers ${first} and ${second} leave the same remainder when divided by one of the following numbers. Which divisor can satisfy this condition?`,
    ...optionSet,
    verifierAnswer: String(divisor),
    hiddenState: hidden("SAME_REMAINDER_DIVISOR_CANDIDATE", { first, second }),
    mathematicalFingerprint: `SR|${first}|${second}|${difference}|${divisor}`,
    explanation: cleanExplanation(
      "If two numbers leave the same remainder on division by d, their difference is divisible by d.",
      "Test the options against the difference and then confirm the two remainders match.",
      [
        `${second} − ${first} = ${difference}.`,
        `${difference} is divisible by ${divisor}.`,
        `${first} and ${second} both leave remainder ${remainder} when divided by ${divisor}.`,
      ],
      String(divisor),
    ),
    sourceAncestry: sources("SSC-SAME-REMAINDER-DIVISOR-CANDIDATE"),
    prototypeAncestry: ["NUM-CP007-CANDIDATE-VERIFICATION-BEFORE-HCF"],
  });
}

export function quotientRemainderTable(seed: number, rng: Rng): NumCp007Wave03Package {
  const tier = tierForSeed(seed);
  const divisor = divisorForTier(tier, rng);
  const quotient = quotientForTier(tier, rng);
  const remainder = seed % 8 === 0 ? 0 : rng.int(0, divisor - 1);
  const dividend = divisor * quotient + remainder;
  const answer = `Quotient ${quotient}; remainder ${remainder}`;

  const optionSet = textOptions(answer, [
    { value: `Quotient ${quotient + 1}; remainder ${remainder}`, misconceptionId: "INCREASED_QUOTIENT" },
    { value: `Quotient ${quotient}; remainder ${remainder + 1}`, misconceptionId: "INCREASED_REMAINDER" },
    { value: `Quotient ${remainder}; remainder ${quotient}`, misconceptionId: "SWAPPED_QUOTIENT_REMAINDER" },
    { value: `Quotient ${Math.max(0, quotient - 1)}; remainder ${remainder}`, misconceptionId: "DECREASED_QUOTIENT" },
  ], rng);

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-021",
    seed,
    difficulty: difficulty(tier, 1),
    answerSemantic: "DIVISION_STATE",
    representation: "QUOTIENT_REMAINDER_TABLE",
    stem: `For the division ${dividend} ÷ ${divisor}, which row gives the correct quotient and remainder?`,
    ...optionSet,
    verifierAnswer: answer,
    hiddenState: hidden("QUOTIENT_REMAINDER_TABLE", { dividend, divisor }),
    mathematicalFingerprint: `TABLE|${dividend}|${divisor}|${quotient}|${remainder}`,
    explanation: cleanExplanation(
      "The quotient is the whole-number part of the division and the remainder is what is left.",
      "Use N = dq + r with 0 ≤ r < d.",
      [
        `${dividend} = ${divisor} × ${quotient} + ${remainder}.`,
        `Therefore the quotient is ${quotient} and the remainder is ${remainder}.`,
      ],
      answer,
    ),
    sourceAncestry: sources("SSC-QUOTIENT-REMAINDER-TABLE"),
    prototypeAncestry: ["NUM-CP007-TABLE-INTERPRETATION"],
  });
}

const STATEMENT_COMBOS = [
  "I and II only",
  "I and III only",
  "II and III only",
  "I, II and III",
] as const;

export function statementCombination(seed: number, rng: Rng): NumCp007Wave03Package {
  const tier = tierForSeed(seed);
  const divisor = divisorForTier(tier, rng);
  const quotient = quotientForTier(tier, rng);
  const remainder = rng.int(0, divisor - 1);
  const dividend = divisor * quotient + remainder;
  const combo = STATEMENT_COMBOS[(seed - 1) % STATEMENT_COMBOS.length]!;
  const truth = combo === "I and II only" ? [true, true, false]
    : combo === "I and III only" ? [true, false, true]
    : combo === "II and III only" ? [false, true, true]
    : [true, true, true];

  const statementI = truth[0]
    ? `I. ${dividend} = ${divisor} × ${quotient} + ${remainder}`
    : `I. ${dividend} = ${divisor} × ${quotient} + ${remainder + 1}`;
  const statementII = truth[1]
    ? `II. The remainder ${remainder} is smaller than the divisor ${divisor}.`
    : `II. The remainder ${remainder} is at least the divisor ${divisor}.`;
  const statementIII = truth[2]
    ? `III. ${dividend - remainder} is divisible by ${divisor}.`
    : `III. ${dividend - remainder + 1} is divisible by ${divisor}.`;

  const optionSet = textOptions(combo, STATEMENT_COMBOS
    .filter((value) => value !== combo)
    .map((value) => ({ value, misconceptionId: `WRONG_STATEMENT_COMBINATION_${value.replaceAll(" ", "_")}` })), rng);

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-022",
    seed,
    difficulty: difficulty(tier, 2),
    answerSemantic: "BOOLEAN_CLAIM",
    representation: "STATEMENT_SET",
    stem: `Consider the following statements about one division state:\n${statementI}\n${statementII}\n${statementIII}\nWhich statements are correct?`,
    ...optionSet,
    verifierAnswer: combo,
    hiddenState: hidden("STATEMENT_COMBINATION", {
      dividend,
      divisor,
      quotient,
      remainder,
      statementIAddedRemainder: truth[0] ? remainder : remainder + 1,
      statementIIClaim: truth[1] ? "LT" : "GE",
      statementIIIValue: truth[2] ? dividend - remainder : dividend - remainder + 1,
    }),
    mathematicalFingerprint: `ST|${dividend}|${divisor}|${quotient}|${remainder}|${combo}`,
    explanation: cleanExplanation(
      "Each division claim must be checked against N = dq + r and 0 ≤ r < d.",
      "Evaluate the three statements separately, then select the matching combination.",
      [
        `The identity value is ${divisor} × ${quotient} + ${remainder} = ${dividend}.`,
        `The valid remainder condition is 0 ≤ ${remainder} < ${divisor}.`,
        `${dividend} − ${remainder} = ${dividend - remainder}, which is divisible by ${divisor}.`,
      ],
      combo,
    ),
    sourceAncestry: sources("SSC-DIVISION-ALGORITHM-STATEMENT-COMBINATION"),
    prototypeAncestry: ["NUM-CP007-STATEMENT-FORM"],
  });
}

type BoundConstraint = Readonly<{ operator: "GT" | "LT"; value: number }>;

function applyConstraint(values: readonly number[], constraint: BoundConstraint): number[] {
  return values.filter((value) => constraint.operator === "GT" ? value > constraint.value : value < constraint.value);
}

function classifyDs(
  baseValues: readonly number[],
  statementI: BoundConstraint,
  statementII: BoundConstraint,
): DsClass {
  const afterI = applyConstraint(baseValues, statementI);
  const afterII = applyConstraint(baseValues, statementII);
  const afterBoth = applyConstraint(afterI, statementII);
  if (afterI.length === 1 && afterII.length !== 1) return "I_ALONE";
  if (afterII.length === 1 && afterI.length !== 1) return "II_ALONE";
  if (afterI.length !== 1 && afterII.length !== 1 && afterBoth.length === 1) return "BOTH_TOGETHER";
  return "NOT_SUFFICIENT";
}

function constraintText(label: "I" | "II", constraint: BoundConstraint): string {
  return `${label}. N ${constraint.operator === "GT" ? ">" : "<"} ${constraint.value}.`;
}

export function dataSufficiency(seed: number, rng: Rng): NumCp007Wave03Package {
  const tier = tierForSeed(seed);
  const divisor = divisorForTier(tier, rng);
  const remainder = rng.int(0, divisor - 1);
  const startQ = quotientForTier(tier, rng);
  const baseValues = Array.from({ length: 6 }, (_, index) => divisor * (startQ + index) + remainder);
  const lower = baseValues[0]!;
  const upper = baseValues[5]!;
  const requested = (["I_ALONE", "II_ALONE", "BOTH_TOGETHER", "NOT_SUFFICIENT"] as const)[(seed - 1) % 4]!;

  let statementI: BoundConstraint;
  let statementII: BoundConstraint;
  if (requested === "I_ALONE") {
    statementI = { operator: "GT", value: baseValues[4]! };
    statementII = { operator: "LT", value: upper + 1 };
  } else if (requested === "II_ALONE") {
    statementI = { operator: "GT", value: lower - 1 };
    statementII = { operator: "LT", value: baseValues[1]! };
  } else if (requested === "BOTH_TOGETHER") {
    statementI = { operator: "GT", value: baseValues[1]! };
    statementII = { operator: "LT", value: baseValues[3]! };
  } else {
    statementI = { operator: "GT", value: baseValues[0]! };
    statementII = { operator: "LT", value: baseValues[5]! };
  }

  const answerClass = classifyDs(baseValues, statementI, statementII);
  if (answerClass !== requested) throw new Error(`DS construction failed: wanted ${requested}, got ${answerClass}`);
  const answer = DS_CLASS_LABELS[answerClass];
  const optionSet = textOptions(answer, (Object.keys(DS_CLASS_LABELS) as DsClass[])
    .filter((key) => key !== answerClass)
    .map((key) => ({ value: DS_CLASS_LABELS[key], misconceptionId: `WRONG_DS_CLASS_${key}` })), rng);

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-023",
    seed,
    difficulty: difficulty(tier, answerClass === "NOT_SUFFICIENT" ? 2 : 1),
    answerSemantic: "SUFFICIENCY_CLASS",
    representation: "DATA_SUFFICIENCY",
    stem: `A number N lies from ${lower} to ${upper}, inclusive, and leaves remainder ${remainder} when divided by ${divisor}. Is the information below sufficient to determine N uniquely?\n${constraintText("I", statementI)}\n${constraintText("II", statementII)}`,
    ...optionSet,
    verifierAnswer: answer,
    hiddenState: hidden("DATA_SUFFICIENCY", {
      lower,
      upper,
      divisor,
      remainder,
      statementIOperator: statementI.operator,
      statementIValue: statementI.value,
      statementIIOperator: statementII.operator,
      statementIIValue: statementII.value,
    }),
    mathematicalFingerprint: `DS|${lower}|${upper}|${divisor}|${remainder}|${statementI.operator}${statementI.value}|${statementII.operator}${statementII.value}|${answerClass}`,
    explanation: cleanExplanation(
      "Data sufficiency asks whether the target is uniquely determined, not merely whether some values can be found.",
      "List the bounded residue-class candidates, then apply each statement alone and together.",
      [
        `Before the statements, the candidates are ${baseValues.join(", ")}.`,
        `Apply Statement I and Statement II as separate filters.`,
        `The resulting sufficiency class is: ${answer}.`,
      ],
      answer,
    ),
    sourceAncestry: sources("BANKING-DATA-SUFFICIENCY-DIVISION-STATE"),
    prototypeAncestry: ["NUM-CP007-DATA-SUFFICIENCY"],
  });
}

export function linkedStateMiniCaselet(seed: number, rng: Rng): NumCp007Wave03Package {
  const tier = tierForSeed(seed);
  const quotient = quotientForTier(tier, rng);
  const gap = tier === 0 ? rng.int(2, 6) : tier === 1 ? rng.int(4, 12) : rng.int(7, 20);
  const divisor = quotient + gap;
  const remainder = seed % 7 === 0 ? 0 : rng.int(0, divisor - 1);
  const dividend = divisor * quotient + remainder;

  const optionSet = numericOptions(quotient, [
    { value: divisor, misconceptionId: "RETURNED_DIVISOR" },
    { value: quotient + gap, misconceptionId: "ADDED_GAP_TO_QUOTIENT" },
    { value: Math.max(0, quotient - 1), misconceptionId: "OFF_BY_ONE_BELOW" },
    { value: quotient + 1, misconceptionId: "OFF_BY_ONE_ABOVE" },
  ], rng, { nonNegative: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-024",
    seed,
    difficulty: difficulty(tier, 2),
    answerSemantic: "QUOTIENT",
    representation: "MINI_CASELET_LINKED_DIVISION_STATE",
    stem: `Use the following information about a division: the number is ${dividend}, the remainder is ${remainder}, and the divisor is ${gap} more than the quotient. What is the quotient?`,
    ...optionSet,
    verifierAnswer: String(quotient),
    hiddenState: hidden("LINKED_STATE_MINI_CASELET", { dividend, remainder, gap }),
    mathematicalFingerprint: `CASE|${dividend}|${remainder}|${gap}|${quotient}|${divisor}`,
    explanation: cleanExplanation(
      "Use the division identity together with the stated relation between divisor and quotient.",
      "Let the quotient be q, so the divisor is q plus the given gap.",
      [
        `${dividend} = (q + ${gap})q + ${remainder}.`,
        `So ${dividend - remainder} = q(q + ${gap}).`,
        `The positive integer value satisfying this relation is q = ${quotient}.`,
      ],
      String(quotient),
    ),
    sourceAncestry: sources("SSC-MINI-CASELET-LINKED-DIVISION-STATE"),
    prototypeAncestry: ["NUM-CP007-MINI-CASELET", "NUM-CP007-LINKED-DIVISION-STATE"],
  });
}


export const WAVE03_GENERATORS = {
  "NUM-CP007-PROT-017": boundedDividendReconstruction,
  "NUM-CP007-PROT-018": boundedNumberSet,
  "NUM-CP007-PROT-019": divisionStateClassification,
  "NUM-CP007-PROT-020": sameRemainderDivisorCandidate,
  "NUM-CP007-PROT-021": quotientRemainderTable,
  "NUM-CP007-PROT-022": statementCombination,
  "NUM-CP007-PROT-023": dataSufficiency,
  "NUM-CP007-PROT-024": linkedStateMiniCaselet,
} as const;

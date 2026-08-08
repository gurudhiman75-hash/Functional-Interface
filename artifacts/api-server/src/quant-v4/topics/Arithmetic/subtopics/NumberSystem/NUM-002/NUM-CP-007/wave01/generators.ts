import {
  base,
  difficulty,
  explanation,
  isValidDivisionState,
  makeDivisionState,
  numericOptions,
  sources,
  stateText,
  textOptions,
  type DivisionState,
  type Rng,
} from "./core.ts";
import type { NumCp007Wave01Package } from "./types.ts";

const hidden = <T extends object>(task: string, values: T): Readonly<Record<string, unknown>> => ({ task, ...values });

export function remainderFromState(seed: number, rng: Rng): NumCp007Wave01Package {
  const state = makeDivisionState(seed, rng);
  const optionSet = numericOptions(state.remainder, [
    { value: state.divisor - state.remainder, misconceptionId: "USED_COMPLEMENT_TO_DIVISOR" },
    { value: state.quotient, misconceptionId: "CONFUSED_QUOTIENT_WITH_REMAINDER" },
    { value: state.dividend % Math.max(1, state.quotient), misconceptionId: "DIVIDED_BY_QUOTIENT" },
    { value: state.remainder + 1, misconceptionId: "OFF_BY_ONE" },
  ], rng, { nonNegative: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-001",
    seed,
    difficulty: difficulty(state.tier),
    answerSemantic: "REMAINDER",
    representation: "DIVISION_IDENTITY_PROSE",
    stem: `When ${state.dividend} is divided by ${state.divisor}, the quotient is ${state.quotient}. What is the remainder?`,
    ...optionSet,
    verifierAnswer: String(state.dividend - state.divisor * state.quotient),
    hiddenState: hidden("REMAINDER_FROM_STATE", state),
    mathematicalFingerprint: `R|${state.dividend}|${state.divisor}|${state.quotient}|${state.remainder}`,
    explanation: explanation(
      "Use the division algorithm: dividend = divisor × quotient + remainder.",
      "Substitute the three known values and isolate the remainder.",
      [
        `${state.dividend} = ${state.divisor} × ${state.quotient} + r`,
        `${state.divisor} × ${state.quotient} = ${state.divisor * state.quotient}`,
        `r = ${state.dividend} − ${state.divisor * state.quotient} = ${state.remainder}`,
      ],
      String(state.remainder),
    ),
    sourceAncestry: sources("SSC-DIVISION-LEMMA-MISSING-REMAINDER"),
    prototypeAncestry: ["NUM-CP007-DIRECT-DIVISION-LEMMA"],
  });
}

export function dividendFromState(seed: number, rng: Rng): NumCp007Wave01Package {
  const state = makeDivisionState(seed, rng);
  const optionSet = numericOptions(state.dividend, [
    { value: state.divisor * state.quotient, misconceptionId: "OMITTED_REMAINDER" },
    { value: state.divisor * (state.quotient + state.remainder), misconceptionId: "MULTIPLIED_REMAINDER" },
    { value: state.divisor + state.quotient + state.remainder, misconceptionId: "ADDED_ALL_VALUES" },
    { value: state.dividend + state.divisor, misconceptionId: "MOVED_TO_NEXT_QUOTIENT" },
  ], rng, { positive: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-002",
    seed,
    difficulty: difficulty(state.tier),
    answerSemantic: "DIVIDEND",
    representation: "DIVISION_IDENTITY_PROSE",
    stem: `When a number is divided by ${state.divisor}, the quotient is ${state.quotient} and the remainder is ${state.remainder}. Find the number.`,
    ...optionSet,
    verifierAnswer: String(state.divisor * state.quotient + state.remainder),
    hiddenState: hidden("DIVIDEND_FROM_STATE", state),
    mathematicalFingerprint: `N|${state.divisor}|${state.quotient}|${state.remainder}|${state.dividend}`,
    explanation: explanation(
      "The dividend equals divisor × quotient + remainder.",
      "Multiply the divisor and quotient, then add the remainder.",
      [
        `Number = ${state.divisor} × ${state.quotient} + ${state.remainder}`,
        `${state.divisor} × ${state.quotient} = ${state.divisor * state.quotient}`,
        `Number = ${state.divisor * state.quotient} + ${state.remainder} = ${state.dividend}`,
      ],
      String(state.dividend),
    ),
    sourceAncestry: sources("SSC-DIVISION-LEMMA-MISSING-DIVIDEND"),
    prototypeAncestry: ["NUM-CP007-DIRECT-DIVISION-LEMMA"],
  });
}

export function divisorFromState(seed: number, rng: Rng): NumCp007Wave01Package {
  const state = makeDivisionState(seed, rng);
  const optionSet = numericOptions(state.divisor, [
    { value: Math.floor(state.dividend / state.quotient), misconceptionId: "IGNORED_REMAINDER_BEFORE_DIVIDING" },
    { value: state.quotient, misconceptionId: "INTERCHANGED_DIVISOR_AND_QUOTIENT" },
    { value: Math.floor((state.dividend + state.remainder) / state.quotient), misconceptionId: "ADDED_REMAINDER" },
    { value: state.divisor + 1, misconceptionId: "OFF_BY_ONE" },
  ], rng, { positive: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-003",
    seed,
    difficulty: difficulty(state.tier, 1),
    answerSemantic: "DIVISOR",
    representation: "DIVISION_IDENTITY_PROSE",
    stem: `When ${state.dividend} is divided by a number, the quotient is ${state.quotient} and the remainder is ${state.remainder}. Find the divisor.`,
    ...optionSet,
    verifierAnswer: String((state.dividend - state.remainder) / state.quotient),
    hiddenState: hidden("DIVISOR_FROM_STATE", state),
    mathematicalFingerprint: `D|${state.dividend}|${state.quotient}|${state.remainder}|${state.divisor}`,
    explanation: explanation(
      "After removing the remainder, the remaining part equals divisor × quotient.",
      "Subtract the remainder from the dividend and divide by the quotient.",
      [
        `Divisor × ${state.quotient} = ${state.dividend} − ${state.remainder}`,
        `Divisor × ${state.quotient} = ${state.dividend - state.remainder}`,
        `Divisor = ${state.dividend - state.remainder} ÷ ${state.quotient} = ${state.divisor}`,
      ],
      String(state.divisor),
    ),
    sourceAncestry: sources("SSC-DIVISION-LEMMA-MISSING-DIVISOR"),
    prototypeAncestry: ["NUM-CP007-INVERSE-DIVISION-LEMMA"],
  });
}

export function quotientFromState(seed: number, rng: Rng): NumCp007Wave01Package {
  const state = makeDivisionState(seed, rng);
  const optionSet = numericOptions(state.quotient, [
    { value: Math.floor(state.dividend / state.divisor), misconceptionId: "USED_FLOOR_WITHOUT_CHECKING_GIVEN_REMAINDER" },
    { value: Math.floor((state.dividend + state.remainder) / state.divisor), misconceptionId: "ADDED_REMAINDER" },
    { value: state.divisor, misconceptionId: "INTERCHANGED_DIVISOR_AND_QUOTIENT" },
    { value: state.quotient + 1, misconceptionId: "OFF_BY_ONE" },
  ], rng, { nonNegative: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-004",
    seed,
    difficulty: difficulty(state.tier, 1),
    answerSemantic: "QUOTIENT",
    representation: "DIVISION_IDENTITY_PROSE",
    stem: `When ${state.dividend} is divided by ${state.divisor}, the remainder is ${state.remainder}. Find the quotient.`,
    ...optionSet,
    verifierAnswer: String((state.dividend - state.remainder) / state.divisor),
    hiddenState: hidden("QUOTIENT_FROM_STATE", state),
    mathematicalFingerprint: `Q|${state.dividend}|${state.divisor}|${state.remainder}|${state.quotient}`,
    explanation: explanation(
      "Remove the remainder before dividing by the divisor.",
      "Use quotient = (dividend − remainder) ÷ divisor.",
      [
        `Quotient = (${state.dividend} − ${state.remainder}) ÷ ${state.divisor}`,
        `Quotient = ${state.dividend - state.remainder} ÷ ${state.divisor}`,
        `Quotient = ${state.quotient}`,
      ],
      String(state.quotient),
    ),
    sourceAncestry: sources("SSC-DIVISION-LEMMA-MISSING-QUOTIENT"),
    prototypeAncestry: ["NUM-CP007-INVERSE-DIVISION-LEMMA"],
  });
}

function invalidStates(correct: DivisionState): DivisionState[] {
  const candidates: DivisionState[] = [
    { ...correct, remainder: correct.divisor },
    { ...correct, quotient: correct.quotient + 1 },
    { ...correct, divisor: correct.divisor + 1 },
    { ...correct, dividend: correct.dividend + 1 },
    { ...correct, remainder: correct.remainder === 0 ? 1 : correct.remainder - 1 },
  ];
  const seen = new Set<string>();
  return candidates.filter((state) => {
    const key = stateText(state);
    if (seen.has(key) || isValidDivisionState(state)) return false;
    seen.add(key);
    return true;
  });
}

export function selectValidState(seed: number, rng: Rng): NumCp007Wave01Package {
  const state = makeDivisionState(seed, rng);
  const wrong = invalidStates(state).slice(0, 3).map((candidate, index) => ({
    value: stateText(candidate),
    misconceptionId: ["INVALID_REMAINDER_BOUND", "BROKEN_DIVISION_IDENTITY", "UNVERIFIED_STATE"][index]!,
  }));
  const optionSet = textOptions(stateText(state), wrong, rng);

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-005",
    seed,
    difficulty: difficulty(state.tier, 2),
    answerSemantic: "DIVISION_STATE",
    representation: "DIVISION_STATE_OPTIONS",
    stem: "Which of the following division statements is correct?",
    ...optionSet,
    verifierAnswer: stateText(state),
    hiddenState: hidden("SELECT_VALID_STATE", state),
    mathematicalFingerprint: `V|${state.dividend}|${state.divisor}|${state.quotient}|${state.remainder}`,
    explanation: explanation(
      "In division, dividend = divisor × quotient + remainder, and the remainder must be smaller than the divisor.",
      "Check both the arithmetic identity and the remainder bound for each option.",
      [
        `${state.divisor} × ${state.quotient} + ${state.remainder} = ${state.dividend}`,
        `${state.remainder} is non-negative and less than ${state.divisor}`,
        `Therefore ${stateText(state)} is valid.`,
      ],
      stateText(state),
    ),
    sourceAncestry: sources("SSC-DIVISION-STATE-VALIDATION"),
    prototypeAncestry: ["NUM-CP007-VALIDITY-CLASSIFICATION"],
  });
}

function propagationState(seed: number, rng: Rng) {
  const tier = ((seed - 1) % 3) as 0 | 1 | 2;
  const divisor = tier === 0 ? rng.int(4, 12) : tier === 1 ? rng.int(13, 39) : rng.int(40, 97);
  const remainderA = seed % 11 === 0 ? 0 : rng.int(0, divisor - 1);
  const remainderB = seed % 13 === 0 ? divisor - 1 : rng.int(0, divisor - 1);
  return { tier, divisor, remainderA, remainderB };
}

export function sumRemainder(seed: number, rng: Rng): NumCp007Wave01Package {
  const state = propagationState(seed, rng);
  const raw = state.remainderA + state.remainderB;
  const answer = raw % state.divisor;
  const optionSet = numericOptions(answer, [
    { value: raw, misconceptionId: "DID_NOT_REDUCE_SUM" },
    { value: Math.abs(state.remainderA - state.remainderB), misconceptionId: "USED_DIFFERENCE" },
    { value: state.divisor - answer, misconceptionId: "USED_COMPLEMENT" },
    { value: (raw + 1) % state.divisor, misconceptionId: "OFF_BY_ONE" },
  ], rng, { nonNegative: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-006",
    seed,
    difficulty: difficulty(state.tier, 1),
    answerSemantic: "REMAINDER",
    representation: "COMPONENT_REMAINDERS_PROSE",
    stem: `Two numbers leave remainders ${state.remainderA} and ${state.remainderB} when divided by ${state.divisor}. What remainder does their sum leave?`,
    ...optionSet,
    verifierAnswer: String((state.remainderA + state.remainderB) % state.divisor),
    hiddenState: hidden("SUM_REMAINDER", state),
    mathematicalFingerprint: `S|${state.divisor}|${state.remainderA}|${state.remainderB}|${answer}`,
    explanation: explanation(
      "Remainders may be added and then reduced by the divisor.",
      "Add the two known remainders and take the remainder again.",
      [
        `${state.remainderA} + ${state.remainderB} = ${raw}`,
        `${raw} ÷ ${state.divisor} leaves remainder ${answer}`,
      ],
      String(answer),
    ),
    sourceAncestry: sources("SSC-REMAINDER-OF-SUM"),
    prototypeAncestry: ["NUM-CP007-COMPATIBLE-REMAINDER-PROPAGATION"],
  });
}

export function productRemainder(seed: number, rng: Rng): NumCp007Wave01Package {
  const state = propagationState(seed, rng);
  const raw = state.remainderA * state.remainderB;
  const answer = raw % state.divisor;
  const optionSet = numericOptions(answer, [
    { value: raw, misconceptionId: "DID_NOT_REDUCE_PRODUCT" },
    { value: (state.remainderA + state.remainderB) % state.divisor, misconceptionId: "USED_SUM_RULE" },
    { value: state.divisor - answer, misconceptionId: "USED_COMPLEMENT" },
    { value: (raw + 1) % state.divisor, misconceptionId: "OFF_BY_ONE" },
  ], rng, { nonNegative: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-007",
    seed,
    difficulty: difficulty(state.tier, 1),
    answerSemantic: "REMAINDER",
    representation: "COMPONENT_REMAINDERS_PROSE",
    stem: `Two numbers leave remainders ${state.remainderA} and ${state.remainderB} when divided by ${state.divisor}. What remainder does their product leave?`,
    ...optionSet,
    verifierAnswer: String((state.remainderA * state.remainderB) % state.divisor),
    hiddenState: hidden("PRODUCT_REMAINDER", state),
    mathematicalFingerprint: `P|${state.divisor}|${state.remainderA}|${state.remainderB}|${answer}`,
    explanation: explanation(
      "Remainders may be multiplied and then reduced by the divisor.",
      "Multiply the two known remainders and take the remainder of that product.",
      [
        `${state.remainderA} × ${state.remainderB} = ${raw}`,
        `${raw} ÷ ${state.divisor} leaves remainder ${answer}`,
      ],
      String(answer),
    ),
    sourceAncestry: sources("SSC-REMAINDER-OF-PRODUCT"),
    prototypeAncestry: ["NUM-CP007-COMPATIBLE-REMAINDER-PROPAGATION"],
  });
}

export function exactDivisibilityAdjustment(seed: number, rng: Rng): NumCp007Wave01Package {
  const state = makeDivisionState(seed, rng);
  const operation = seed % 2 === 0 ? "ADD" : "SUBTRACT";
  const answer = operation === "ADD"
    ? (state.remainder === 0 ? 0 : state.divisor - state.remainder)
    : state.remainder;
  const optionSet = numericOptions(answer, [
    { value: state.remainder, misconceptionId: "USED_CURRENT_REMAINDER" },
    { value: state.divisor - state.remainder, misconceptionId: "USED_OPPOSITE_ADJUSTMENT" },
    { value: state.divisor, misconceptionId: "USED_FULL_DIVISOR" },
    { value: answer + 1, misconceptionId: "OFF_BY_ONE" },
  ], rng, { nonNegative: true });
  const verb = operation === "ADD" ? "added to" : "subtracted from";

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-008",
    seed,
    difficulty: difficulty(state.tier, 1),
    answerSemantic: operation === "ADD" ? "ADDITION_AMOUNT" : "SUBTRACTION_AMOUNT",
    representation: "EXACT_DIVISIBILITY_ADJUSTMENT",
    stem: `What least non-negative integer must be ${verb} ${state.dividend} so that the result is exactly divisible by ${state.divisor}?`,
    ...optionSet,
    verifierAnswer: String(operation === "ADD"
      ? (state.divisor - (state.dividend % state.divisor)) % state.divisor
      : state.dividend % state.divisor),
    hiddenState: hidden("EXACT_DIVISIBILITY_ADJUSTMENT", { ...state, operation }),
    mathematicalFingerprint: `A|${operation}|${state.dividend}|${state.divisor}|${state.remainder}|${answer}`,
    explanation: explanation(
      operation === "ADD"
        ? "To reach the next multiple, add the complement of the current remainder."
        : "To reach the previous multiple, subtract the current remainder.",
      `First identify the remainder when ${state.dividend} is divided by ${state.divisor}.`,
      operation === "ADD"
        ? [
            `${state.dividend} leaves remainder ${state.remainder}.`,
            state.remainder === 0
              ? `${state.dividend} is already divisible by ${state.divisor}, so no addition is needed.`
              : `Required addition = ${state.divisor} − ${state.remainder} = ${answer}.`,
          ]
        : [
            `${state.dividend} leaves remainder ${state.remainder}.`,
            `Required subtraction = ${state.remainder}.`,
          ],
      String(answer),
    ),
    sourceAncestry: sources("SSC-MINIMUM-ADDITION-SUBTRACTION-DIVISIBILITY"),
    prototypeAncestry: ["NUM-CP007-EXACT-DIVISIBILITY-ADJUSTMENT"],
  });
}

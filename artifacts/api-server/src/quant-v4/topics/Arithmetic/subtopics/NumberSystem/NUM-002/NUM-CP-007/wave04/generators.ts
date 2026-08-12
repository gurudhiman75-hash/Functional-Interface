import {
  base,
  cleanExplanation,
  difficulty,
  divisorsInRange,
  formatDivisionResult,
  formatRemainderPair,
  hidden,
  longDivisionTrace,
  mod,
  numericOptions,
  sources,
  textOptions,
  tierForSeed,
  type Rng,
} from "./core.ts";
import type { NumCp007Wave04Package } from "./types.ts";

function qForTier(tier: 0 | 1 | 2, rng: Rng): number {
  return tier === 0 ? rng.int(3, 12) : tier === 1 ? rng.int(13, 30) : rng.int(31, 60);
}

function dForTier(tier: 0 | 1 | 2, rng: Rng): number {
  return tier === 0 ? rng.int(7, 19) : tier === 1 ? rng.int(20, 49) : rng.int(50, 97);
}

type LinkedMode = "D_MULTIPLE_Q_AND_R" | "D_MULTIPLE_Q_WITH_GAP" | "D_MULTIPLE_R_WITH_GAP";

function linkedCandidates(
  dividend: number,
  mode: LinkedMode,
  a: number,
  b: number,
  gap: number,
): number[] {
  const output: number[] = [];
  for (let divisor = 2; divisor <= dividend; divisor++) {
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend - divisor * quotient;
    if (remainder < 0 || remainder >= divisor) continue;
    const matches = mode === "D_MULTIPLE_Q_AND_R"
      ? divisor === a * quotient && divisor === b * remainder
      : mode === "D_MULTIPLE_Q_WITH_GAP"
        ? divisor === a * quotient && quotient - remainder === gap
        : divisor === b * remainder && quotient - remainder === gap;
    if (matches) output.push(divisor);
  }
  return output;
}

export function richerLinkedRelation(seed: number, rng: Rng): NumCp007Wave04Package {
  const tier = tierForSeed(seed);
  const mode = (["D_MULTIPLE_Q_AND_R", "D_MULTIPLE_Q_WITH_GAP", "D_MULTIPLE_R_WITH_GAP"] as const)[(seed - 1) % 3]!;

  for (let attempt = 0; attempt < 250; attempt++) {
    let quotient = qForTier(tier, rng);
    let remainder = rng.int(1, Math.max(1, quotient - 1));
    let divisor = 0;
    let a = rng.int(2, tier === 2 ? 7 : 5);
    let b = rng.int(2, tier === 2 ? 8 : 6);
    let gap = quotient - remainder;

    if (mode === "D_MULTIPLE_Q_AND_R") {
      divisor = a * quotient;
      if (divisor % b !== 0) continue;
      remainder = divisor / b;
      if (remainder <= 0 || remainder >= divisor) continue;
      gap = quotient - remainder;
    } else if (mode === "D_MULTIPLE_Q_WITH_GAP") {
      if (remainder >= quotient) continue;
      divisor = a * quotient;
      gap = quotient - remainder;
    } else {
      if (remainder >= quotient) continue;
      divisor = b * remainder;
      gap = quotient - remainder;
      a = 0;
    }

    if (remainder >= divisor) continue;
    const dividend = divisor * quotient + remainder;
    const candidates = linkedCandidates(dividend, mode, a, b, gap);
    if (candidates.length !== 1 || candidates[0] !== divisor) continue;

    const wrong = [
      { value: quotient, misconceptionId: "CONFUSED_QUOTIENT_WITH_DIVISOR" },
      { value: divisor - remainder, misconceptionId: "SUBTRACTED_REMAINDER_FROM_DIVISOR" },
      { value: divisor + remainder, misconceptionId: "ADDED_REMAINDER_TO_DIVISOR" },
      { value: mode === "D_MULTIPLE_Q_AND_R" ? b * quotient : divisor + gap, misconceptionId: "USED_WRONG_LINKED_RELATION" },
    ];
    const optionSet = numericOptions(divisor, wrong, rng, { positive: true });

    const relationText = mode === "D_MULTIPLE_Q_AND_R"
      ? `the divisor is ${a} times the quotient and ${b} times the remainder`
      : mode === "D_MULTIPLE_Q_WITH_GAP"
        ? `the divisor is ${a} times the quotient, and the quotient exceeds the remainder by ${gap}`
        : `the divisor is ${b} times the remainder, and the quotient exceeds the remainder by ${gap}`;

    return base({
      temporaryPrototypeId: "NUM-CP007-PROT-025",
      seed,
      difficulty: difficulty(tier, 2),
      answerSemantic: "DIVISOR",
      representation: `LINKED_DIVISION_RELATION_${mode}`,
      stem: `When ${dividend} is divided by a positive integer, ${relationText}. Find the divisor.`,
      ...optionSet,
      verifierAnswer: String(candidates[0]),
      hiddenState: hidden("RICHER_LINKED_RELATION", { dividend, mode, a, b, gap }),
      mathematicalFingerprint: `LR|${mode}|${dividend}|${divisor}|${quotient}|${remainder}|${a}|${b}|${gap}`,
      explanation: cleanExplanation(
        "The divisor, quotient and remainder must satisfy both the stated relation and N = dq + r.",
        "Use the relation to restrict the division state, then keep only the state that also obeys the remainder bound.",
        [
          `${dividend} = d × q + r, with 0 ≤ r < d.`,
          `The linked condition is: ${relationText}.`,
          `The unique admissible state is d = ${divisor}, q = ${quotient}, r = ${remainder}.`,
        ],
        String(divisor),
      ),
      sourceAncestry: sources("SSC-LINKED-DIVISOR-QUOTIENT-REMAINDER-RELATIONS"),
      prototypeAncestry: ["NUM-CP007-LINKED-RELATION-AUTHORITY", "NUM-CP007-PROT-013", "NUM-CP007-PROT-024"],
    });
  }
  throw new Error(`Could not construct unique linked relation for seed ${seed}.`);
}

type InversePropagationMode = "SUM_ONE_WRAP" | "SCALE_ONE_WRAP";

export function inverseRemainderPropagation(seed: number, rng: Rng): NumCp007Wave04Package {
  const tier = tierForSeed(seed);
  const mode: InversePropagationMode = seed % 2 === 0 ? "SUM_ONE_WRAP" : "SCALE_ONE_WRAP";
  let divisor = dForTier(tier, rng);
  let answer = divisor;
  let stem = "";
  let steps: string[] = [];
  let state: Record<string, unknown>;

  if (mode === "SUM_ONE_WRAP") {
    let r1 = rng.int(Math.ceil(divisor / 2), divisor - 1);
    let r2 = rng.int(Math.max(1, divisor - r1), divisor - 1);
    if (r1 + r2 >= 2 * divisor) r2 = divisor - 1;
    const raw = r1 + r2;
    if (raw < divisor || raw >= 2 * divisor) throw new Error("Sum inverse state is not one-wrap.");
    const r3 = raw - divisor;
    answer = raw - r3;
    stem = `A leaves remainder ${r1} and B leaves remainder ${r2} when each is divided by the same positive divisor. Their sum leaves remainder ${r3}. The sum of the two stated remainders crosses the divisor exactly once. Find the divisor.`;
    steps = [
      `Before reduction, the sum of the remainders is ${r1} + ${r2} = ${raw}.`,
      `One wrap means ${raw} − d = ${r3}.`,
      `So d = ${raw} − ${r3} = ${answer}.`,
    ];
    state = { mode, r1, r2, r3 };
  } else {
    const k = tier === 0 ? rng.int(2, 4) : tier === 1 ? rng.int(3, 6) : rng.int(4, 8);
    const minR = Math.ceil(divisor / k);
    const maxR = Math.min(divisor - 1, Math.floor((2 * divisor - 1) / k));
    if (minR > maxR) throw new Error("Scale inverse range collapsed.");
    const remainder = rng.int(minR, maxR);
    const raw = k * remainder;
    const scaledRemainder = raw - divisor;
    if (scaledRemainder < 0 || scaledRemainder >= divisor) throw new Error("Scale inverse state is not one-wrap.");
    answer = raw - scaledRemainder;
    stem = `A number leaves remainder ${remainder} when divided by a positive divisor d. ${k} times the number leaves remainder ${scaledRemainder} on division by the same d. The unreduced residue ${k} × ${remainder} crosses d exactly once. Find d.`;
    steps = [
      `The unreduced residue is ${k} × ${remainder} = ${raw}.`,
      `One wrap gives ${raw} − d = ${scaledRemainder}.`,
      `Therefore d = ${raw} − ${scaledRemainder} = ${answer}.`,
    ];
    state = { mode, k, remainder, scaledRemainder };
  }

  const optionSet = numericOptions(answer, [
    { value: answer + 1, misconceptionId: "MISCOUNTED_WRAP" },
    { value: Math.max(2, answer - 1), misconceptionId: "OFF_BY_ONE_DIVISOR" },
    { value: mode === "SUM_ONE_WRAP" ? answer * 2 : Math.floor(answer / 2), misconceptionId: "USED_WRONG_WRAP_COUNT" },
    { value: answer + (tier + 2), misconceptionId: "UNVERIFIED_DIVISOR" },
  ], rng, { positive: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-026",
    seed,
    difficulty: difficulty(tier, 2),
    answerSemantic: "DIVISOR",
    representation: `INVERSE_REMAINDER_PROPAGATION_${mode}`,
    stem,
    ...optionSet,
    verifierAnswer: String(answer),
    hiddenState: hidden("INVERSE_REMAINDER_PROPAGATION", state),
    mathematicalFingerprint: `IRP|${mode}|${JSON.stringify(state)}|${answer}`,
    explanation: cleanExplanation(
      "When a raw residue crosses the divisor once, subtracting the observed remainder reveals the divisor.",
      "Write the unreduced residue and use the stated one-wrap condition.",
      steps,
      String(answer),
    ),
    sourceAncestry: sources("SSC-INVERSE-REMAINDER-PROPAGATION"),
    prototypeAncestry: ["NUM-CP007-INVERSE-RESIDUE-PROPAGATION"],
  });
}

type ChainTarget = "ORIGINAL_NUMBER" | "PRODUCT_REMAINDER";

function chainState(tier: 0 | 1 | 2, rng: Rng) {
  const d1 = tier === 0 ? rng.int(3, 9) : tier === 1 ? rng.int(7, 17) : rng.int(11, 29);
  let d2 = tier === 0 ? rng.int(3, 9) : tier === 1 ? rng.int(7, 19) : rng.int(13, 31);
  if (d2 === d1) d2 += 1;
  const r1 = rng.int(0, d1 - 1);
  const r2 = rng.int(0, d2 - 1);
  const finalQ = tier === 0 ? rng.int(2, 9) : tier === 1 ? rng.int(10, 39) : rng.int(40, 99);
  const firstQuotient = d2 * finalQ + r2;
  const dividend = d1 * firstQuotient + r1;
  const productRemainder = d1 * r2 + r1;
  return { d1, d2, r1, r2, finalQ, firstQuotient, dividend, productRemainder };
}

export function successiveDivisionChain(seed: number, rng: Rng): NumCp007Wave04Package {
  const tier = tierForSeed(seed);
  const target: ChainTarget = seed % 2 === 0 ? "ORIGINAL_NUMBER" : "PRODUCT_REMAINDER";
  const state = chainState(tier, rng);
  const answer = target === "ORIGINAL_NUMBER" ? state.dividend : state.productRemainder;
  const stem = target === "ORIGINAL_NUMBER"
    ? `A number is divided by ${state.d1}, leaving remainder ${state.r1}. The quotient is then divided by ${state.d2}, leaving remainder ${state.r2} and quotient ${state.finalQ}. Find the original number.`
    : `A number is divided by ${state.d1}, leaving remainder ${state.r1}. The quotient is then divided by ${state.d2}, leaving remainder ${state.r2}. What remainder will the original number leave when divided by ${state.d1 * state.d2}?`;

  const optionSet = numericOptions(answer, [
    { value: target === "ORIGINAL_NUMBER" ? state.d1 * state.d2 * state.finalQ : state.r1 + state.r2, misconceptionId: "DROPPED_CHAIN_REMAINDER" },
    { value: target === "ORIGINAL_NUMBER" ? state.d1 * (state.d2 * state.finalQ + state.r1) + state.r2 : state.d2 * state.r1 + state.r2, misconceptionId: "REVERSED_REMAINDER_WEIGHTS" },
    { value: target === "ORIGINAL_NUMBER" ? state.firstQuotient : state.r2, misconceptionId: "STOPPED_AFTER_SECOND_DIVISION" },
    { value: answer + state.d1, misconceptionId: "ADDED_ONE_EXTRA_FIRST_DIVISOR" },
  ], rng, { nonNegative: true });

  const steps = target === "ORIGINAL_NUMBER"
    ? [
        `First quotient = ${state.d2} × ${state.finalQ} + ${state.r2} = ${state.firstQuotient}.`,
        `Original number = ${state.d1} × ${state.firstQuotient} + ${state.r1} = ${state.dividend}.`,
      ]
    : [
        `N = ${state.d1}(${state.d2}q + ${state.r2}) + ${state.r1}.`,
        `So N = ${state.d1 * state.d2}q + (${state.d1} × ${state.r2} + ${state.r1}).`,
        `The product-modulus remainder is ${state.productRemainder}.`,
      ];

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-027",
    seed,
    difficulty: difficulty(tier, target === "ORIGINAL_NUMBER" ? 2 : 3),
    answerSemantic: target === "ORIGINAL_NUMBER" ? "DIVIDEND" : "REMAINDER",
    representation: `SUCCESSIVE_DIVISION_CHAIN_${target}`,
    stem,
    ...optionSet,
    verifierAnswer: String(answer),
    hiddenState: hidden("SUCCESSIVE_DIVISION_CHAIN", { ...state, target }),
    mathematicalFingerprint: `CHAIN|${target}|${state.d1}|${state.d2}|${state.r1}|${state.r2}|${state.finalQ}|${answer}`,
    explanation: cleanExplanation(
      "Successive division is repeated use of N = dq + r, not a system of independent congruences.",
      "Work backwards from the later quotient, or expand the two division identities.",
      steps,
      String(answer),
    ),
    sourceAncestry: sources("SSC-RRB-SUCCESSIVE-QUOTIENT-DIVISION"),
    prototypeAncestry: ["NUM-CP007-SUCCESSIVE-DIVISION-CHAIN"],
  });
}

export function reverseSuccessiveDivision(seed: number, rng: Rng): NumCp007Wave04Package {
  const tier = tierForSeed(seed);
  const state = chainState(tier, rng);
  const firstQReversed = Math.floor(state.dividend / state.d2);
  const firstRReversed = mod(state.dividend, state.d2);
  const secondRReversed = mod(firstQReversed, state.d1);
  const answer = formatRemainderPair(firstRReversed, secondRReversed);

  const distractors = [
    { value: formatRemainderPair(state.r1, state.r2), misconceptionId: "ASSUMED_REMAINDERS_UNCHANGED" },
    { value: formatRemainderPair(state.r2, state.r1), misconceptionId: "ONLY_SWAPPED_OLD_REMAINDERS" },
    { value: formatRemainderPair(secondRReversed, firstRReversed), misconceptionId: "SWAPPED_NEW_REMAINDER_ORDER" },
    { value: formatRemainderPair(mod(firstRReversed + 1, state.d2), secondRReversed), misconceptionId: "OFF_BY_ONE_FIRST_REMAINDER" },
    { value: formatRemainderPair(firstRReversed, mod(secondRReversed + 1, state.d1)), misconceptionId: "OFF_BY_ONE_SECOND_REMAINDER" },
  ];
  const optionSet = textOptions(answer, distractors, rng);

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-028",
    seed,
    difficulty: difficulty(tier, 3),
    answerSemantic: "REMAINDER_SEQUENCE",
    representation: "SUCCESSIVE_DIVISION_REVERSED_ORDER",
    stem: `A number is divided successively by ${state.d1} and ${state.d2}; the remainders are ${state.r1} and ${state.r2}, and the final quotient is ${state.finalQ}. If the same number is instead divided successively by ${state.d2} and ${state.d1}, what are the new remainders in order?`,
    ...optionSet,
    verifierAnswer: answer,
    hiddenState: hidden("REVERSE_SUCCESSIVE_DIVISION", { d1: state.d1, d2: state.d2, r1: state.r1, r2: state.r2, finalQ: state.finalQ }),
    mathematicalFingerprint: `REVCHAIN|${state.d1}|${state.d2}|${state.r1}|${state.r2}|${state.finalQ}|${firstRReversed}|${secondRReversed}`,
    explanation: cleanExplanation(
      "Changing the order of successive divisors changes the intermediate quotient, so the old remainders cannot simply be swapped.",
      "First reconstruct the original number, then carry out the reversed divisions.",
      [
        `Original number = ${state.d1} × (${state.d2} × ${state.finalQ} + ${state.r2}) + ${state.r1} = ${state.dividend}.`,
        `${state.dividend} ÷ ${state.d2} gives quotient ${firstQReversed} and remainder ${firstRReversed}.`,
        `${firstQReversed} ÷ ${state.d1} leaves remainder ${secondRReversed}.`,
      ],
      answer,
    ),
    sourceAncestry: sources("SSC-RRB-REVERSED-SUCCESSIVE-DIVISION"),
    prototypeAncestry: ["NUM-CP007-SUCCESSIVE-DIVISION-CHAIN-REORDER"],
  });
}

export function wrongDivisorCorrection(seed: number, rng: Rng): NumCp007Wave04Package {
  const tier = tierForSeed(seed);
  const wrongDivisor = dForTier(tier, rng);
  const wrongQuotient = qForTier(tier, rng) + 2;
  const wrongRemainder = seed % 3 === 0 ? rng.int(1, wrongDivisor - 1) : 0;
  const dividend = wrongDivisor * wrongQuotient + wrongRemainder;
  let correctDivisor = wrongDivisor + (seed % 2 === 0 ? rng.int(2, 9) : -rng.int(2, Math.min(9, wrongDivisor - 2)));
  if (correctDivisor < 2) correctDivisor = wrongDivisor + 3;
  const correctQuotient = Math.floor(dividend / correctDivisor);
  const correctRemainder = mod(dividend, correctDivisor);
  const answer = formatDivisionResult(correctQuotient, correctRemainder);

  const optionSet = textOptions(answer, [
    { value: formatDivisionResult(wrongQuotient, wrongRemainder), misconceptionId: "KEPT_ERRONEOUS_DIVISION_RESULT" },
    { value: formatDivisionResult(Math.floor(wrongDivisor / correctDivisor), mod(wrongDivisor, correctDivisor)), misconceptionId: "REDIVIDED_WRONG_DIVISOR_NOT_DIVIDEND" },
    { value: formatDivisionResult(correctQuotient + 1, correctRemainder), misconceptionId: "OFF_BY_ONE_CORRECT_QUOTIENT" },
    { value: formatDivisionResult(correctQuotient, mod(correctRemainder + 1, correctDivisor)), misconceptionId: "OFF_BY_ONE_CORRECT_REMAINDER" },
    { value: formatDivisionResult(correctRemainder, correctQuotient), misconceptionId: "SWAPPED_QUOTIENT_REMAINDER" },
  ], rng);

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-029",
    seed,
    difficulty: difficulty(tier, 2),
    answerSemantic: "DIVISION_STATE",
    representation: "WRONG_DIVISOR_ERROR_CORRECTION",
    stem: `A student divided a number by ${wrongDivisor} instead of ${correctDivisor} and obtained quotient ${wrongQuotient} with remainder ${wrongRemainder}. What quotient and remainder should be obtained using the correct divisor ${correctDivisor}?`,
    ...optionSet,
    verifierAnswer: answer,
    hiddenState: hidden("WRONG_DIVISOR_CORRECTION", { wrongDivisor, wrongQuotient, wrongRemainder, correctDivisor }),
    mathematicalFingerprint: `ERR|${wrongDivisor}|${wrongQuotient}|${wrongRemainder}|${correctDivisor}|${correctQuotient}|${correctRemainder}`,
    explanation: cleanExplanation(
      "An incorrect division result still reveals the original dividend through N = dq + r.",
      "Recover the dividend from the wrong division, then divide that same dividend by the correct divisor.",
      [
        `Original number = ${wrongDivisor} × ${wrongQuotient} + ${wrongRemainder} = ${dividend}.`,
        `${dividend} = ${correctDivisor} × ${correctQuotient} + ${correctRemainder}.`,
      ],
      answer,
    ),
    sourceAncestry: sources("SSC-DIVISION-WRONG-DIVISOR-CORRECTION"),
    prototypeAncestry: ["NUM-CP007-TWO-STAGE-DIVISION-ERROR-CORRECTION"],
  });
}

function traceCandidates(dividend: number, remainders: readonly number[], maxDivisor = 99): number[] {
  const output: number[] = [];
  for (let divisor = 2; divisor <= maxDivisor; divisor++) {
    const trace = longDivisionTrace(dividend, divisor);
    if (trace.remainders.length !== remainders.length) continue;
    if (trace.remainders.every((value, index) => value === remainders[index])) output.push(divisor);
  }
  return output;
}

export function longDivisionIntermediateTrace(seed: number, rng: Rng): NumCp007Wave04Package {
  const tier = tierForSeed(seed);
  for (let attempt = 0; attempt < 400; attempt++) {
    const divisor = tier === 0 ? rng.int(11, 29) : tier === 1 ? rng.int(30, 59) : rng.int(60, 97);
    const quotient = tier === 0 ? rng.int(120, 499) : tier === 1 ? rng.int(500, 2999) : rng.int(3000, 9999);
    const remainder = rng.int(0, divisor - 1);
    const dividend = divisor * quotient + remainder;
    const trace = longDivisionTrace(dividend, divisor);
    const candidates = traceCandidates(dividend, trace.remainders);
    if (candidates.length !== 1 || candidates[0] !== divisor) continue;

    const wrongValues: { value: number; misconceptionId: string }[] = [];
    for (let delta = 1; wrongValues.length < 5 && delta < 25; delta++) {
      for (const candidate of [divisor - delta, divisor + delta]) {
        if (candidate < 2 || candidate > 99 || candidate === divisor) continue;
        if (traceCandidates(dividend, trace.remainders).includes(candidate)) continue;
        if (wrongValues.some((item) => item.value === candidate)) continue;
        wrongValues.push({ value: candidate, misconceptionId: "FAILS_INTERMEDIATE_REMAINDER_TRACE" });
      }
    }
    const optionSet = numericOptions(divisor, wrongValues, rng, { positive: true });
    const traceText = trace.prefixes
      .map((prefix, index) => `after prefix ${prefix}: remainder ${trace.remainders[index]}`)
      .join("; ");

    return base({
      temporaryPrototypeId: "NUM-CP007-PROT-030",
      seed,
      difficulty: difficulty(tier, 3),
      answerSemantic: "DIVISOR",
      representation: "LONG_DIVISION_INTERMEDIATE_REMAINDER_TRACE",
      stem: `In the long division of ${dividend} by an unknown integer divisor from 2 to 99, the running prefix remainders are recorded as follows: ${traceText}. Which divisor is consistent with the complete trace?`,
      ...optionSet,
      verifierAnswer: String(divisor),
      hiddenState: hidden("LONG_DIVISION_TRACE", { dividend, remainders: [...trace.remainders], maxDivisor: 99 }),
      mathematicalFingerprint: `TRACE|${dividend}|${divisor}|${trace.remainders.join(".")}`,
      explanation: cleanExplanation(
        "Each intermediate remainder in long division must equal the processed prefix modulo the same divisor.",
        "Test one divisor against the complete sequence rather than using only the final remainder.",
        [
          `The processed prefixes are ${trace.prefixes.join(", ")}.`,
          `For divisor ${divisor}, their remainders are ${trace.remainders.join(", ")}.`,
          `No other divisor from 2 to 99 reproduces the complete remainder trace.`,
        ],
        String(divisor),
      ),
      sourceAncestry: sources("SSC-LONG-DIVISION-INTERMEDIATE-REMAINDER-TRACE"),
      prototypeAncestry: ["NUM-CP007-LONG-DIVISION-TRACE"],
    });
  }
  throw new Error(`Could not isolate a long-division trace divisor for seed ${seed}.`);
}

type ExtremumMode = "LEAST_ABOVE" | "GREATEST_BELOW";

export function boundedNonZeroRemainderExtremum(seed: number, rng: Rng): NumCp007Wave04Package {
  const tier = tierForSeed(seed);
  const mode: ExtremumMode = seed % 2 === 0 ? "LEAST_ABOVE" : "GREATEST_BELOW";
  const divisor = dForTier(tier, rng);
  const remainder = rng.int(1, divisor - 1);
  const q = qForTier(tier, rng);
  const anchor = divisor * q + rng.int(0, divisor - 1);
  let answer: number;
  let bound: number;
  let stem: string;

  if (mode === "LEAST_ABOVE") {
    bound = anchor;
    const start = bound + 1;
    answer = start + mod(remainder - mod(start, divisor), divisor);
    stem = `What is the least integer greater than ${bound} that leaves remainder ${remainder} when divided by ${divisor}?`;
  } else {
    bound = Math.max(anchor, divisor + 2);
    const start = bound - 1;
    answer = start - mod(mod(start, divisor) - remainder, divisor);
    if (answer < 0) throw new Error("Greatest-below extremum became negative.");
    stem = `What is the greatest integer less than ${bound} that leaves remainder ${remainder} when divided by ${divisor}?`;
  }

  const optionSet = numericOptions(answer, [
    { value: mode === "LEAST_ABOVE" ? answer + divisor : Math.max(0, answer - divisor), misconceptionId: "MOVED_ONE_RESIDUE_STEP_TOO_FAR" },
    { value: mode === "LEAST_ABOVE" ? answer - divisor : answer + divisor, misconceptionId: "CHOSE_RESIDUE_MEMBER_ON_WRONG_SIDE_OF_BOUND" },
    { value: mode === "LEAST_ABOVE" ? bound + (divisor - mod(bound, divisor)) : bound - mod(bound, divisor), misconceptionId: "FORCED_ZERO_REMAINDER_MULTIPLE" },
    { value: answer + (divisor - remainder), misconceptionId: "USED_COMPLEMENT_AS_OFFSET" },
  ], rng, { nonNegative: true });

  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-031",
    seed,
    difficulty: difficulty(tier, 1),
    answerSemantic: "INTEGER_EXTREMUM",
    representation: `BOUNDED_NONZERO_REMAINDER_${mode}`,
    stem,
    ...optionSet,
    verifierAnswer: String(answer),
    hiddenState: hidden("BOUNDED_NONZERO_REMAINDER_EXTREMUM", { mode, divisor, remainder, bound }),
    mathematicalFingerprint: `EXT|${mode}|${divisor}|${remainder}|${bound}|${answer}`,
    explanation: cleanExplanation(
      "Numbers leaving remainder r modulo d form a progression with common difference d.",
      "Locate the first member just above the lower bound or the last member just below the upper bound.",
      [
        `Required numbers have the form ${divisor}k + ${remainder}.`,
        `${answer} is on the required side of ${bound} and ${answer} mod ${divisor} = ${remainder}.`,
        `The adjacent member of the same residue class is ${mode === "LEAST_ABOVE" ? answer - divisor : answer + divisor}, which lies on the other side of the bound or farther away.`,
      ],
      String(answer),
    ),
    sourceAncestry: sources("QUANT-V3-NS-REM-002-NONZERO-REMAINDER-EXTREMUM"),
    prototypeAncestry: ["NUM-CP007-BOUNDED-RESIDUE-EXTREMUM"],
  });
}

export function sameRemainderBoundedReconstruction(seed: number, rng: Rng): NumCp007Wave04Package {
  const tier = tierForSeed(seed);
  for (let attempt = 0; attempt < 300; attempt++) {
    const divisor = tier === 0 ? rng.int(101, 179) : tier === 1 ? rng.int(180, 299) : rng.int(300, 499);
    const multiplier = rng.int(2, tier === 2 ? 11 : 8);
    const commonRemainder = rng.int(0, divisor - 1);
    const q1 = rng.int(2, 15);
    const first = divisor * q1 + commonRemainder;
    const second = first + divisor * multiplier;
    const difference = second - first;
    const width = tier === 0 ? 6 : tier === 1 ? 10 : 14;
    const lower = divisor - width;
    const upper = divisor + width;
    const candidates = divisorsInRange(difference, lower, upper)
      .filter((candidate) => mod(first, candidate) === mod(second, candidate));
    if (candidates.length !== 1 || candidates[0] !== divisor) continue;

    const wrong: { value: number; misconceptionId: string }[] = [];
    for (let delta = 1; wrong.length < 5 && delta <= width; delta++) {
      for (const candidate of [divisor - delta, divisor + delta]) {
        if (candidate < lower || candidate > upper || candidate === divisor) continue;
        if (difference % candidate === 0) continue;
        wrong.push({ value: candidate, misconceptionId: "DOES_NOT_DIVIDE_NUMBER_DIFFERENCE" });
      }
    }
    if (wrong.length < 3) continue;
    const optionSet = numericOptions(divisor, wrong, rng, { positive: true });

    return base({
      temporaryPrototypeId: "NUM-CP007-PROT-032",
      seed,
      difficulty: difficulty(tier, 2),
      answerSemantic: "DIVISOR",
      representation: "SAME_REMAINDER_BOUNDED_DIRECT_RECONSTRUCTION",
      stem: `The numbers ${first} and ${second} leave the same remainder when divided by an integer d. It is known that ${lower} ≤ d ≤ ${upper}. Find d.`,
      ...optionSet,
      verifierAnswer: String(divisor),
      hiddenState: hidden("SAME_REMAINDER_BOUNDED_RECONSTRUCTION", { first, second, lower, upper }),
      mathematicalFingerprint: `SRB|${first}|${second}|${difference}|${lower}|${upper}|${divisor}`,
      explanation: cleanExplanation(
        "If two numbers leave the same remainder on division by d, then d divides their difference.",
        "Factor only the difference values inside the stated divisor interval and require the same-remainder condition.",
        [
          `${second} − ${first} = ${difference}.`,
          `Among integers from ${lower} to ${upper}, only ${divisor} divides ${difference}.`,
          `Direct check: both numbers leave remainder ${mod(first, divisor)} on division by ${divisor}.`,
        ],
        String(divisor),
      ),
      sourceAncestry: sources("SSC-SAME-REMAINDER-BOUNDED-DIVISOR-RECONSTRUCTION"),
      prototypeAncestry: ["NUM-CP007-PROT-020", "NUM-CP007-SAME-REMAINDER-BOUNDED-RECONSTRUCTION"],
    });
  }
  throw new Error(`Could not construct bounded same-remainder state for seed ${seed}.`);
}

export const WAVE04_GENERATORS = {
  "NUM-CP007-PROT-025": richerLinkedRelation,
  "NUM-CP007-PROT-026": inverseRemainderPropagation,
  "NUM-CP007-PROT-027": successiveDivisionChain,
  "NUM-CP007-PROT-028": reverseSuccessiveDivision,
  "NUM-CP007-PROT-029": wrongDivisorCorrection,
  "NUM-CP007-PROT-030": longDivisionIntermediateTrace,
  "NUM-CP007-PROT-031": boundedNonZeroRemainderExtremum,
  "NUM-CP007-PROT-032": sameRemainderBoundedReconstruction,
} as const;

import {
  add,
  div,
  mul,
  periodicRate,
  rat,
  type Cp004MathematicalState,
  type IntCp004QlId,
  type Rational,
} from "./cp004-frequency-math";
import {
  generateIntCp004EnglishFrozenQuestion,
  type IntCp004EnglishFrozenQuestion,
} from "./cp004-english-frozen-runtime";

export const INT_CP004_EXAM_FRIENDLY_SOURCE_V9_VERSION =
  "INT-CP-004-EXAM-FRIENDLY-SOURCE-v9" as const;

const DECIMAL_TOKEN = /\d+\.\d+/u;
const MAX_SEARCH_ATTEMPTS = 5_000;
const REVIEW_SEARCH_ATTEMPTS = 100_000;
const REVIEW_REPRESENTATIONS = Object.freeze([
  "TERMS_TABLE",
  "STANDARD_PROSE",
  "BALANCE_RECORD",
  "SCHEME_COMPARISON",
] as const);

function isInteger(value: Rational): boolean {
  return value.denominator === 1n;
}

function periodMultiplier(ratePercent: Rational): Rational {
  return add(rat(1), div(ratePercent, rat(100)));
}

function compoundSequence(
  principal: Rational,
  ratePercent: Rational,
  periods: number,
): readonly Rational[] {
  const multiplier = periodMultiplier(ratePercent);
  const values: Rational[] = [];
  let balance = principal;
  for (let index = 0; index < periods; index += 1) {
    balance = mul(balance, multiplier);
    values.push(balance);
  }
  return Object.freeze(values);
}

function allInteger(values: readonly Rational[]): boolean {
  return values.every(isInteger);
}

function noDisplayedDecimalsInProblem(question: IntCp004EnglishFrozenQuestion): boolean {
  // Wrong-option values are legacy diagnostic outputs and may be fractional even
  // when the actual exam problem has clean integer working. V9 remaps only their
  // learner-facing display; source selection is governed by the stem, verified
  // correct answer and complete canonical working.
  return !DECIMAL_TOKEN.test([
    question.stem,
    question.correctAnswer,
  ].join("\n"));
}

function simpleRatesAreInteger(state: Cp004MathematicalState): boolean {
  switch (state.qlId) {
    case "INT-QL-073":
    case "INT-QL-074":
      return isInteger(state.periodicRatePercent);
    case "INT-QL-075":
      return isInteger(periodicRate(state.nominalAnnualRatePercent, state.frequency))
        && isInteger(periodicRate(state.nominalAnnualRatePercent, state.comparisonFrequency));
    case "INT-QL-079":
    case "INT-QL-080":
    case "INT-QL-081":
    case "INT-QL-082":
    case "INT-QL-083":
      return isInteger(state.nominalAnnualRatePercent);
    case "INT-QL-084":
    case "INT-QL-085":
      return isInteger(periodicRate(state.nominalAnnualRatePercent, state.firstFrequency))
        && isInteger(periodicRate(state.nominalAnnualRatePercent, state.secondFrequency));
    default:
      return isInteger(periodicRate(state.nominalAnnualRatePercent, state.frequency));
  }
}

function calculationDepthIsFriendly(state: Cp004MathematicalState): boolean {
  switch (state.qlId) {
    case "INT-QL-067":
    case "INT-QL-068":
    case "INT-QL-069":
    case "INT-QL-070":
    case "INT-QL-071":
    case "INT-QL-072":
    case "INT-QL-073":
    case "INT-QL-074":
      return state.periods <= 6;
    case "INT-QL-075":
      return state.frequency * state.years <= 6
        && state.comparisonFrequency * state.years <= 6;
    case "INT-QL-076":
    case "INT-QL-077":
      return state.frequency <= 4;
    case "INT-QL-078":
      return state.frequency * state.years <= 6;
    case "INT-QL-079":
    case "INT-QL-080":
    case "INT-QL-081":
    case "INT-QL-082":
    case "INT-QL-083":
      return state.fullYears <= 3;
    case "INT-QL-084":
    case "INT-QL-085":
      return state.firstFrequency * state.firstYears
        + state.secondFrequency * state.secondYears <= 8;
  }
}

function moneyWorkingIsInteger(state: Cp004MathematicalState): boolean {
  const principal = state.principal;
  if (!isInteger(principal)) return false;

  switch (state.qlId) {
    case "INT-QL-067":
    case "INT-QL-068":
    case "INT-QL-069":
    case "INT-QL-070":
    case "INT-QL-071":
    case "INT-QL-072":
    case "INT-QL-078": {
      const rate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
      return allInteger(compoundSequence(principal, rate, state.periods));
    }

    case "INT-QL-073":
    case "INT-QL-074":
      return allInteger(compoundSequence(principal, state.periodicRatePercent, state.periods));

    case "INT-QL-075": {
      const firstRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
      const secondRate = periodicRate(state.nominalAnnualRatePercent, state.comparisonFrequency);
      const first = compoundSequence(principal, firstRate, state.frequency * state.years);
      const second = compoundSequence(principal, secondRate, state.comparisonFrequency * state.years);
      return allInteger(first) && allInteger(second);
    }

    case "INT-QL-076":
    case "INT-QL-077": {
      const rate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
      return allInteger(compoundSequence(rat(100), rate, state.frequency));
    }

    case "INT-QL-079":
    case "INT-QL-080":
    case "INT-QL-081":
    case "INT-QL-082":
    case "INT-QL-083": {
      const wholeYears = compoundSequence(principal, state.nominalAnnualRatePercent, state.fullYears);
      if (!allInteger(wholeYears) || wholeYears.length === 0) return false;
      const afterWholeYears = wholeYears.at(-1)!;
      const tailInterest = mul(
        afterWholeYears,
        mul(
          div(state.nominalAnnualRatePercent, rat(100)),
          rat(state.tailMonths, 12),
        ),
      );
      return isInteger(tailInterest) && isInteger(add(afterWholeYears, tailInterest));
    }

    case "INT-QL-084":
    case "INT-QL-085": {
      const firstRate = periodicRate(state.nominalAnnualRatePercent, state.firstFrequency);
      const secondRate = periodicRate(state.nominalAnnualRatePercent, state.secondFrequency);
      const first = compoundSequence(
        principal,
        firstRate,
        state.firstFrequency * state.firstYears,
      );
      if (!allInteger(first) || first.length === 0) return false;
      const second = compoundSequence(
        first.at(-1)!,
        secondRate,
        state.secondFrequency * state.secondYears,
      );
      return allInteger(second);
    }
  }
}

function reviewRequest(seed: string): Readonly<{
  prefix: string;
  startCandidate: number;
  frame: number;
}> | null {
  const match = seed.match(/^(.*:frame-(\d+):candidate-)(\d+)$/u);
  if (!match) return null;
  const frame = Number(match[2]);
  const startCandidate = Number(match[3]);
  if (
    !Number.isInteger(frame)
    || frame < 1
    || frame > 4
    || !Number.isInteger(startCandidate)
    || startCandidate < 0
  ) return null;
  return Object.freeze({ prefix: match[1]!, startCandidate, frame });
}

function matchesReviewShape(
  question: IntCp004EnglishFrozenQuestion,
  frame: number,
): boolean {
  return question.stemFamilyId === `${question.qlId}-FRAME-${frame}`
    && question.representation === REVIEW_REPRESENTATIONS[frame - 1]
    && question.correctIndex === frame % 4;
}

export function isIntCp004ExamFriendlyFrozenSourceV9(
  question: IntCp004EnglishFrozenQuestion,
): boolean {
  return noDisplayedDecimalsInProblem(question)
    && simpleRatesAreInteger(question.mathematicalState)
    && calculationDepthIsFriendly(question.mathematicalState)
    && moneyWorkingIsInteger(question.mathematicalState)
    && (question.answerSemantic === "DURATION"
      || question.answerSemantic === "FREQUENCY"
      || isInteger(question.solution));
}

export function selectIntCp004ExamFriendlyFrozenSourceV9(
  qlId: IntCp004QlId,
  seed: string,
): IntCp004EnglishFrozenQuestion {
  const review = reviewRequest(seed);
  if (review) {
    for (let offset = 0; offset < REVIEW_SEARCH_ATTEMPTS; offset += 1) {
      const candidate = generateIntCp004EnglishFrozenQuestion(
        qlId,
        `${review.prefix}${review.startCandidate + offset}`,
      );
      if (
        isIntCp004ExamFriendlyFrozenSourceV9(candidate)
        && matchesReviewShape(candidate, review.frame)
      ) return candidate;
    }
    throw new Error(
      `${qlId}/${seed}: unable to find an exam-friendly review source in ${REVIEW_SEARCH_ATTEMPTS} direct candidates.`,
    );
  }

  for (let attempt = 0; attempt < MAX_SEARCH_ATTEMPTS; attempt += 1) {
    const candidate = generateIntCp004EnglishFrozenQuestion(
      qlId,
      `${seed}:exam-friendly-v9:${attempt}`,
    );
    if (isIntCp004ExamFriendlyFrozenSourceV9(candidate)) return candidate;
  }
  throw new Error(
    `${qlId}/${seed}: unable to find an exam-friendly integer-working source in ${MAX_SEARCH_ATTEMPTS} attempts.`,
  );
}

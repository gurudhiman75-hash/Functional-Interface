import { deterministicIndex, rotate } from "../foundation/prng";
import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  isWholeRational,
  multiplyRational,
  rational,
  rationalKey,
  reciprocalRational,
  subtractRational,
} from "../foundation/rational";
import { formatIntCp001Wave2Answer } from "./presentation";
import type {
  IntCp001Wave2MisconceptionId,
  IntCp001Wave2OptionAudit,
  IntCp001Wave2PrototypeParameters,
  IntCp001Wave2SolveResult,
  Rational,
} from "./types";

interface Candidate {
  value: Rational;
  misconceptionId: IntCp001Wave2MisconceptionId;
}

function candidate(
  value: Rational,
  misconceptionId: IntCp001Wave2MisconceptionId,
): Candidate {
  return { value, misconceptionId };
}

function rateFromPercent(value: Rational): Rational {
  return divideRational(value, rational(100));
}

function isMoneySemantic(semantic: IntCp001Wave2SolveResult["semantic"]): boolean {
  return semantic === "TOTAL_AMOUNT"
    || semantic === "PRINCIPAL"
    || semantic === "ANNUAL_INTEREST";
}

function modeCandidates(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
): Candidate[] {
  const request = parameters.request;
  const state = parameters.hiddenState;
  const correct = solution.value;
  const amountGap = subtractRational(state.laterAmount, state.earlierAmount);
  const timeGap = subtractRational(state.laterTimeYears, state.earlierTimeYears);

  switch (request.mode) {
    case "AMOUNT_FROM_PRT": {
      const values = [
        candidate(state.laterInterest, "RETURNED_INTEREST_INSTEAD_OF_AMOUNT"),
        candidate(state.principal, "OMITTED_ONE_PLUS"),
        candidate(addRational(state.principal, state.annualInterest), "OMITTED_TIME_FACTOR"),
      ];
      if (parameters.display.displayedMonths !== undefined) {
        values.unshift(candidate(
          addRational(
            state.principal,
            multiplyRational(state.annualInterest, rational(parameters.display.displayedMonths)),
          ),
          "MONTHS_TREATED_AS_YEARS",
        ));
      }
      if (parameters.display.displayedDays !== undefined) {
        values.unshift(candidate(
          addRational(
            state.principal,
            multiplyRational(state.annualInterest, rational(parameters.display.displayedDays)),
          ),
          "DAYS_TREATED_AS_YEARS",
        ));
      }
      return values;
    }
    case "PRINCIPAL_FROM_INTEREST":
      return [
        candidate(state.laterInterest, "USED_INTEREST_AS_PRINCIPAL"),
        candidate(state.laterAmount, "USED_AMOUNT_AS_PRINCIPAL"),
        candidate(divideRational(state.laterInterest, state.annualRate), "OMITTED_TIME_FACTOR"),
        candidate(
          divideRational(
            state.laterAmount,
            multiplyRational(state.annualRate, state.laterTimeYears),
          ),
          "USED_AMOUNT_AS_PRINCIPAL",
        ),
      ];
    case "PRINCIPAL_FROM_AMOUNT":
      return [
        candidate(state.laterAmount, "USED_AMOUNT_AS_PRINCIPAL"),
        candidate(state.laterInterest, "USED_INTEREST_AS_PRINCIPAL"),
        candidate(
          divideRational(
            state.laterAmount,
            multiplyRational(state.annualRate, state.laterTimeYears),
          ),
          "OMITTED_ONE_PLUS",
        ),
        candidate(subtractRational(state.laterAmount, state.annualInterest), "OMITTED_TIME_FACTOR"),
      ];
    case "RATE_FROM_INTEREST":
      return [
        candidate(state.annualRate, "RATE_DECIMAL_REPORTED_AS_PERCENT"),
        candidate(
          multiplyRational(divideRational(state.laterInterest, state.principal), rational(100)),
          "OMITTED_TIME_IN_RATE",
        ),
        candidate(
          multiplyRational(
            divideRational(
              state.laterAmount,
              multiplyRational(state.principal, state.laterTimeYears),
            ),
            rational(100),
          ),
          "USED_AMOUNT_IN_RATE_NUMERATOR",
        ),
        candidate(reciprocalRational(correct), "PLAUSIBLE_SCALE_ERROR"),
      ];
    case "RATE_FROM_AMOUNT":
      return [
        candidate(state.annualRate, "RATE_DECIMAL_REPORTED_AS_PERCENT"),
        candidate(
          multiplyRational(divideRational(state.laterInterest, state.principal), rational(100)),
          "OMITTED_TIME_IN_RATE",
        ),
        candidate(
          multiplyRational(
            divideRational(
              state.laterAmount,
              multiplyRational(state.principal, state.laterTimeYears),
            ),
            rational(100),
          ),
          "USED_AMOUNT_IN_RATE_NUMERATOR",
        ),
        candidate(reciprocalRational(correct), "PLAUSIBLE_SCALE_ERROR"),
      ];
    case "TIME_MONTHS_FROM_INTEREST":
    case "TIME_MONTHS_FROM_AMOUNT":
      return [
        candidate(state.laterTimeYears, "YEARS_REPORTED_AS_MONTHS"),
        candidate(divideRational(correct, rational(12)), "MONTHS_DIVIDED_BY_12"),
        candidate(multiplyRational(correct, rational(12)), "MONTHS_MULTIPLIED_TWICE"),
        candidate(reciprocalRational(correct), "PLAUSIBLE_SCALE_ERROR"),
      ];
    case "ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
      return [
        candidate(amountGap, "TIME_GAP_IGNORED"),
        candidate(divideRational(amountGap, state.laterTimeYears), "LATER_TIME_USED_INSTEAD_OF_GAP"),
        candidate(multiplyRational(amountGap, timeGap), "AMOUNT_GAP_REPORTED"),
        candidate(state.laterInterest, "AMOUNT_GAP_REPORTED"),
      ];
    case "PRINCIPAL_FROM_TWO_AMOUNTS":
      return [
        candidate(state.earlierAmount, "EARLIER_AMOUNT_USED_AS_PRINCIPAL"),
        candidate(state.laterAmount, "LATER_AMOUNT_USED_AS_PRINCIPAL"),
        candidate(amountGap, "AMOUNT_GAP_REPORTED"),
        candidate(
          subtractRational(
            state.earlierAmount,
            multiplyRational(amountGap, state.earlierTimeYears),
          ),
          "TIME_GAP_IGNORED",
        ),
      ];
    case "RATE_FROM_TWO_AMOUNTS":
      return [
        candidate(state.annualRate, "RATE_DECIMAL_REPORTED_AS_PERCENT"),
        candidate(state.annualInterest, "ANNUAL_INTEREST_USED_AS_RATE"),
        candidate(
          multiplyRational(divideRational(amountGap, state.principal), rational(100)),
          "TIME_GAP_IGNORED",
        ),
        candidate(
          multiplyRational(correct, timeGap),
          "LATER_TIME_USED_INSTEAD_OF_GAP",
        ),
      ];
    case "RATE_FROM_TWO_AMOUNT_RATIO": {
      const ratio = request.laterToEarlierAmountRatio;
      return [
        candidate(state.annualRate, "RATE_DECIMAL_REPORTED_AS_PERCENT"),
        candidate(
          multiplyRational(
            divideRational(subtractRational(ratio, rational(1)), request.laterTimeYears),
            rational(100),
          ),
          "EARLIER_TIME_RATIO_TERM_OMITTED",
        ),
        candidate(
          multiplyRational(divideRational(ratio, request.laterTimeYears), rational(100)),
          "RATIO_MINUS_ONE_OMITTED",
        ),
        candidate(reciprocalRational(correct), "RECIPROCAL_RATIO"),
      ];
    }
    case "AMOUNT_MULTIPLE_FROM_RATE_TIME":
      return [
        candidate(
          multiplyRational(rateFromPercent(request.annualRatePercent), request.timeYears),
          "AMOUNT_MULTIPLE_REPORTED_AS_INTEREST_RATIO",
        ),
        candidate(
          addRational(
            rational(1),
            multiplyRational(request.annualRatePercent, request.timeYears),
          ),
          "OMITTED_DIVIDE_BY_100",
        ),
        candidate(reciprocalRational(correct), "RECIPROCAL_RATIO"),
        candidate(addRational(correct, rational(1)), "PLAUSIBLE_SCALE_ERROR"),
      ];
    case "INTEREST_RATIO_FROM_RATE_TIME":
      return [
        candidate(addRational(rational(1), correct), "INTEREST_RATIO_REPORTED_AS_AMOUNT_MULTIPLE"),
        candidate(
          multiplyRational(request.annualRatePercent, request.timeYears),
          "RATE_TIME_PRODUCT_REPORTED_AS_PERCENT",
        ),
        candidate(reciprocalRational(correct), "RECIPROCAL_RATIO"),
        candidate(divideRational(correct, rational(100)), "OMITTED_DIVIDE_BY_100"),
      ];
  }
}

function fallbackCandidates(solution: IntCp001Wave2SolveResult): Candidate[] {
  const correct = solution.value;
  if (isMoneySemantic(solution.semantic)) {
    return [
      candidate(addRational(correct, rational(100)), "PLAUSIBLE_SCALE_ERROR"),
      candidate(addRational(correct, rational(200)), "PLAUSIBLE_SCALE_ERROR"),
      candidate(addRational(correct, rational(500)), "PLAUSIBLE_SCALE_ERROR"),
      candidate(subtractRational(correct, rational(100)), "PLAUSIBLE_SCALE_ERROR"),
    ];
  }
  return [
    candidate(addRational(correct, rational(1)), "PLAUSIBLE_SCALE_ERROR"),
    candidate(multiplyRational(correct, rational(2)), "PLAUSIBLE_SCALE_ERROR"),
    candidate(divideRational(correct, rational(2)), "PLAUSIBLE_SCALE_ERROR"),
    candidate(addRational(correct, rational(5)), "PLAUSIBLE_SCALE_ERROR"),
  ];
}

export function buildIntCp001Wave2Options(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
): { options: string[]; optionAudit: IntCp001Wave2OptionAudit[]; correctIndex: number } {
  const candidates = [...modeCandidates(parameters, solution), ...fallbackCandidates(solution)];
  const seen = new Set<string>([rationalKey(solution.value)]);
  const wrong: Candidate[] = [];

  for (const item of candidates) {
    if (compareRational(item.value, rational(0)) <= 0) continue;
    if (isMoneySemantic(solution.semantic) && !isWholeRational(item.value)) continue;
    const key = rationalKey(item.value);
    if (seen.has(key)) continue;
    seen.add(key);
    wrong.push(item);
    if (wrong.length === 3) break;
  }

  if (wrong.length !== 3) {
    throw new Error(`Could not construct three distinct wave 02 options for ${parameters.prototypeId}.`);
  }

  const correctOption: IntCp001Wave2OptionAudit = {
    text: formatIntCp001Wave2Answer(solution),
    result: solution,
    misconceptionId: "CORRECT",
  };
  const wrongOptions: IntCp001Wave2OptionAudit[] = wrong.map((item) => {
    const result: IntCp001Wave2SolveResult = {
      semantic: solution.semantic,
      value: item.value,
    };
    return {
      text: formatIntCp001Wave2Answer(result),
      result,
      misconceptionId: item.misconceptionId,
    };
  });

  const correctIndex = deterministicIndex(
    `${parameters.prototypeId}:${parameters.seed}:wave2-correct-index`,
    4,
  );
  const orderedWrong = rotate(
    wrongOptions,
    deterministicIndex(`${parameters.prototypeId}:${parameters.seed}:wave2-wrong-order`, wrongOptions.length),
  );
  const optionAudit = [...orderedWrong];
  optionAudit.splice(correctIndex, 0, correctOption);
  return {
    options: optionAudit.map((item) => item.text),
    optionAudit,
    correctIndex,
  };
}

export function intCp001Wave2OptionMatchesSolution(
  option: IntCp001Wave2OptionAudit,
  solution: IntCp001Wave2SolveResult,
): boolean {
  return option.result.semantic === solution.semantic
    && equalsRational(option.result.value, solution.value);
}

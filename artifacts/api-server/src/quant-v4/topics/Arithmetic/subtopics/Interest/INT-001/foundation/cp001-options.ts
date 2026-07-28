import { deterministicIndex, rotate } from "./prng";
import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  rationalKey,
  reciprocalRational,
  subtractRational,
} from "./rational";
import { formatIntCp001Answer } from "./cp001-presentation";
import type {
  IntCp001MisconceptionId,
  IntCp001OptionAudit,
  IntCp001PrototypeParameters,
  IntCp001SolveResult,
  Rational,
} from "./types";

interface Candidate {
  value: Rational;
  misconceptionId: IntCp001MisconceptionId;
}

function rateFromPercent(value: Rational): Rational {
  return divideRational(value, rational(100));
}

function powerRational(base: Rational, exponent: bigint): Rational {
  if (exponent < 0n) return reciprocalRational(powerRational(base, -exponent));
  let result = rational(1);
  let factor = base;
  let remaining = exponent;
  while (remaining > 0n) {
    if (remaining % 2n === 1n) result = multiplyRational(result, factor);
    factor = multiplyRational(factor, factor);
    remaining /= 2n;
  }
  return result;
}

function candidate(value: Rational, misconceptionId: IntCp001MisconceptionId): Candidate {
  return { value, misconceptionId };
}

function modeCandidates(
  parameters: IntCp001PrototypeParameters,
  solution: IntCp001SolveResult,
): Candidate[] {
  const state = parameters.hiddenState;
  const oneYearInterest = multiplyRational(state.principal, state.annualRate);
  const rawRateProduct = multiplyRational(
    multiplyRational(state.principal, state.annualRatePercent),
    state.timeYears,
  );
  const correct = solution.value;

  switch (parameters.request.mode) {
    case "INTEREST_FROM_PRT": {
      const candidates = [
        candidate(state.amount, "RETURNED_AMOUNT_INSTEAD_OF_INTEREST"),
        candidate(oneYearInterest, "OMITTED_TIME_FACTOR"),
        candidate(rawRateProduct, "OMITTED_DIVIDE_BY_100"),
      ];
      if (parameters.display.displayedMonths !== undefined) {
        candidates.unshift(
          candidate(
            multiplyRational(oneYearInterest, rational(parameters.display.displayedMonths)),
            "MONTHS_TREATED_AS_YEARS",
          ),
        );
      }
      if (parameters.display.displayedDays !== undefined) {
        candidates.unshift(
          candidate(
            multiplyRational(oneYearInterest, rational(parameters.display.displayedDays)),
            "DAYS_TREATED_AS_YEARS",
          ),
        );
      }
      if (state.timeYears.denominator === 1n) {
        const compoundAmount = multiplyRational(
          state.principal,
          powerRational(addRational(rational(1), state.annualRate), state.timeYears.numerator),
        );
        candidates.push(
          candidate(subtractRational(compoundAmount, state.principal), "COMPOUND_MODEL_USED"),
        );
      }
      return candidates;
    }
    case "AMOUNT_FROM_PRT": {
      const candidates = [
        candidate(state.simpleInterest, "RETURNED_INTEREST_INSTEAD_OF_AMOUNT"),
        candidate(addRational(state.principal, oneYearInterest), "OMITTED_TIME_FACTOR"),
        candidate(addRational(state.principal, rawRateProduct), "OMITTED_DIVIDE_BY_100"),
      ];
      if (state.timeYears.denominator === 1n) {
        candidates.push(
          candidate(
            multiplyRational(
              state.principal,
              powerRational(addRational(rational(1), state.annualRate), state.timeYears.numerator),
            ),
            "COMPOUND_MODEL_USED",
          ),
        );
      }
      return candidates;
    }
    case "PRINCIPAL_FROM_INTEREST":
      return [
        candidate(state.simpleInterest, "USED_INTEREST_AS_PRINCIPAL"),
        candidate(state.amount, "USED_AMOUNT_AS_PRINCIPAL"),
        candidate(divideRational(state.simpleInterest, state.annualRate), "OMITTED_TIME_FACTOR"),
        candidate(
          divideRational(
            state.amount,
            multiplyRational(state.annualRate, state.timeYears),
          ),
          "USED_AMOUNT_AS_PRINCIPAL",
        ),
      ];
    case "PRINCIPAL_FROM_AMOUNT":
      return [
        candidate(state.amount, "USED_AMOUNT_AS_PRINCIPAL"),
        candidate(state.simpleInterest, "USED_INTEREST_AS_PRINCIPAL"),
        candidate(
          divideRational(
            state.amount,
            multiplyRational(state.annualRate, state.timeYears),
          ),
          "OMITTED_ONE_PLUS",
        ),
        candidate(subtractRational(state.amount, oneYearInterest), "OMITTED_TIME_FACTOR"),
      ];
    case "RATE_FROM_INTEREST":
      return [
        candidate(state.annualRate, "RATE_DECIMAL_REPORTED_AS_PERCENT"),
        candidate(
          multiplyRational(divideRational(state.simpleInterest, state.principal), rational(100)),
          "OMITTED_TIME_IN_RATE",
        ),
        candidate(
          multiplyRational(
            divideRational(state.amount, multiplyRational(state.principal, state.timeYears)),
            rational(100),
          ),
          "USED_AMOUNT_IN_RATE_NUMERATOR",
        ),
        candidate(reciprocalRational(correct), "RATE_TIME_PRODUCT_INVERTED"),
      ];
    case "RATE_FROM_AMOUNT":
      return [
        candidate(state.annualRate, "RATE_DECIMAL_REPORTED_AS_PERCENT"),
        candidate(
          multiplyRational(divideRational(state.simpleInterest, state.principal), rational(100)),
          "OMITTED_TIME_IN_RATE",
        ),
        candidate(
          multiplyRational(
            divideRational(state.amount, multiplyRational(state.principal, state.timeYears)),
            rational(100),
          ),
          "USED_AMOUNT_IN_RATE_NUMERATOR",
        ),
        candidate(reciprocalRational(correct), "RATE_TIME_PRODUCT_INVERTED"),
      ];
    case "TIME_FROM_INTEREST":
      return [
        candidate(divideRational(state.simpleInterest, state.principal), "OMITTED_RATE_IN_TIME"),
        candidate(
          divideRational(state.amount, multiplyRational(state.principal, state.annualRate)),
          "USED_AMOUNT_IN_TIME_NUMERATOR",
        ),
        candidate(reciprocalRational(correct), "TIME_RECIPROCAL"),
        candidate(divideRational(correct, rational(100)), "OMITTED_DIVIDE_BY_100"),
      ];
    case "TIME_FROM_AMOUNT":
      return [
        candidate(divideRational(state.simpleInterest, state.principal), "OMITTED_RATE_IN_TIME"),
        candidate(
          divideRational(state.amount, multiplyRational(state.principal, state.annualRate)),
          "USED_AMOUNT_IN_TIME_NUMERATOR",
        ),
        candidate(reciprocalRational(correct), "TIME_RECIPROCAL"),
        candidate(divideRational(correct, rational(100)), "OMITTED_DIVIDE_BY_100"),
      ];
    case "ANNUAL_INTEREST_FROM_TOTAL":
      return [
        candidate(state.simpleInterest, "TOTAL_INTEREST_REPORTED"),
        candidate(state.principal, "USED_INTEREST_AS_PRINCIPAL"),
        candidate(state.amount, "RETURNED_AMOUNT_INSTEAD_OF_INTEREST"),
        candidate(multiplyRational(state.simpleInterest, state.timeYears), "TARGET_DURATION_INVERTED"),
      ];
    case "INTEREST_FOR_SUBDURATION": {
      const oneYear = divideRational(
        parameters.request.totalInterest,
        parameters.request.knownTimeYears,
      );
      return [
        candidate(parameters.request.totalInterest, "SUBDURATION_IGNORED"),
        candidate(oneYear, "ANNUAL_INTEREST_REPORTED"),
        candidate(
          multiplyRational(
            parameters.request.totalInterest,
            divideRational(parameters.request.knownTimeYears, parameters.request.targetTimeYears),
          ),
          "TARGET_DURATION_INVERTED",
        ),
        candidate(state.amount, "RETURNED_AMOUNT_INSTEAD_OF_INTEREST"),
      ];
    }
    case "RATE_FROM_AMOUNT_MULTIPLE": {
      const request = parameters.request;
      return [
        candidate(
          multiplyRational(divideRational(request.amountMultiple, request.timeYears), rational(100)),
          "MULTIPLE_USED_WITHOUT_SUBTRACTING_ONE",
        ),
        candidate(state.annualRate, "RATE_DECIMAL_REPORTED_AS_PERCENT"),
        candidate(
          multiplyRational(subtractRational(request.amountMultiple, rational(1)), rational(100)),
          "OMITTED_TIME_IN_RATE",
        ),
        candidate(reciprocalRational(correct), "RATE_TIME_PRODUCT_INVERTED"),
      ];
    }
    case "TIME_FROM_AMOUNT_MULTIPLE": {
      const request = parameters.request;
      return [
        candidate(
          divideRational(request.amountMultiple, rateFromPercent(request.annualRatePercent)),
          "MULTIPLE_USED_WITHOUT_SUBTRACTING_ONE",
        ),
        candidate(
          divideRational(
            subtractRational(request.amountMultiple, rational(1)),
            request.annualRatePercent,
          ),
          "OMITTED_DIVIDE_BY_100",
        ),
        candidate(reciprocalRational(correct), "TIME_RECIPROCAL"),
        candidate(request.amountMultiple, "INTEREST_RATIO_TREATED_AS_AMOUNT_MULTIPLE"),
      ];
    }
    case "TIME_FROM_INTEREST_MULTIPLE": {
      const request = parameters.request;
      const candidates = [
        candidate(
          divideRational(request.interestToPrincipalRatio, request.annualRatePercent),
          "OMITTED_DIVIDE_BY_100",
        ),
        candidate(reciprocalRational(correct), "TIME_RECIPROCAL"),
        candidate(request.interestToPrincipalRatio, "OMITTED_RATE_IN_TIME"),
      ];
      if (compareRational(request.interestToPrincipalRatio, rational(1)) > 0) {
        candidates.push(
          candidate(
            divideRational(
              subtractRational(request.interestToPrincipalRatio, rational(1)),
              rateFromPercent(request.annualRatePercent),
            ),
            "INTEREST_RATIO_TREATED_AS_AMOUNT_MULTIPLE",
          ),
        );
      } else {
        candidates.push(candidate(addRational(correct, rational(1)), "INTEREST_RATIO_TREATED_AS_AMOUNT_MULTIPLE"));
      }
      return candidates;
    }
    case "RATE_FROM_INTEREST_PRINCIPAL_RATIO": {
      const request = parameters.request;
      return [
        candidate(
          divideRational(request.interestToPrincipalRatio, request.timeYears),
          "RATE_DECIMAL_REPORTED_AS_PERCENT",
        ),
        candidate(
          multiplyRational(request.interestToPrincipalRatio, rational(100)),
          "OMITTED_TIME_IN_RATE",
        ),
        candidate(reciprocalRational(correct), "RATE_TIME_PRODUCT_INVERTED"),
        candidate(request.interestToPrincipalRatio, "INTEREST_RATIO_TREATED_AS_AMOUNT_MULTIPLE"),
      ];
    }
  }
}

function fallbackCandidates(
  parameters: IntCp001PrototypeParameters,
  solution: IntCp001SolveResult,
): Candidate[] {
  const state = parameters.hiddenState;
  switch (solution.semantic) {
    case "SIMPLE_INTEREST":
    case "TOTAL_AMOUNT":
    case "PRINCIPAL":
    case "ANNUAL_INTEREST":
      return [
        candidate(state.principal, "USED_INTEREST_AS_PRINCIPAL"),
        candidate(state.simpleInterest, "TOTAL_INTEREST_REPORTED"),
        candidate(state.amount, "RETURNED_AMOUNT_INSTEAD_OF_INTEREST"),
        candidate(multiplyRational(solution.value, rational(2)), "TARGET_DURATION_INVERTED"),
        candidate(divideRational(solution.value, rational(2)), "OMITTED_TIME_FACTOR"),
      ];
    case "ANNUAL_RATE_PERCENT":
      return [
        candidate(state.annualRate, "RATE_DECIMAL_REPORTED_AS_PERCENT"),
        candidate(multiplyRational(solution.value, state.timeYears), "OMITTED_TIME_IN_RATE"),
        candidate(divideRational(solution.value, rational(100)), "OMITTED_DIVIDE_BY_100"),
        candidate(reciprocalRational(solution.value), "RATE_TIME_PRODUCT_INVERTED"),
      ];
    case "TIME_YEARS":
      return [
        candidate(state.annualRate, "OMITTED_RATE_IN_TIME"),
        candidate(state.annualRatePercent, "USED_AMOUNT_IN_TIME_NUMERATOR"),
        candidate(divideRational(solution.value, rational(100)), "OMITTED_DIVIDE_BY_100"),
        candidate(reciprocalRational(solution.value), "TIME_RECIPROCAL"),
      ];
  }
}

export function buildIntCp001Options(
  parameters: IntCp001PrototypeParameters,
  solution: IntCp001SolveResult,
): { options: string[]; optionAudit: IntCp001OptionAudit[]; correctIndex: number } {
  const candidates = [...modeCandidates(parameters, solution), ...fallbackCandidates(parameters, solution)];
  const uniqueWrong: Candidate[] = [];
  const seen = new Set<string>([rationalKey(solution.value)]);
  for (const item of candidates) {
    if (compareRational(item.value, rational(0)) <= 0) continue;
    const key = rationalKey(item.value);
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueWrong.push(item);
    if (uniqueWrong.length === 3) break;
  }
  if (uniqueWrong.length !== 3) {
    throw new Error(`Could not construct three distinct misconception options for ${parameters.prototypeId}.`);
  }

  const correct: IntCp001OptionAudit = {
    text: formatIntCp001Answer(solution),
    result: solution,
    misconceptionId: "CORRECT",
  };
  const wrong: IntCp001OptionAudit[] = uniqueWrong.map((item) => {
    const result: IntCp001SolveResult = { semantic: solution.semantic, value: item.value };
    return {
      text: formatIntCp001Answer(result),
      result,
      misconceptionId: item.misconceptionId,
    };
  });
  const correctIndex = deterministicIndex(
    `${parameters.prototypeId}:${parameters.seed}:correct-index`,
    4,
  );
  const orderedWrong = rotate(wrong, deterministicIndex(`${parameters.seed}:wrong-order`, wrong.length));
  const optionAudit = [...orderedWrong];
  optionAudit.splice(correctIndex, 0, correct);
  return {
    options: optionAudit.map((item) => item.text),
    optionAudit,
    correctIndex,
  };
}

export function optionMatchesSolution(
  option: IntCp001OptionAudit,
  solution: IntCp001SolveResult,
): boolean {
  return option.result.semantic === solution.semantic && equalsRational(option.result.value, solution.value);
}

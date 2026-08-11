import {
  addRational,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "../foundation/rational";
import type {
  IntCp001Wave2SolveRequest,
  IntCp001Wave2SolveResult,
  Rational,
} from "./types";

function percentToRate(value: Rational): Rational {
  return divideRational(value, rational(100));
}

function annualInterestFromTwoAmounts(
  earlierAmount: Rational,
  laterAmount: Rational,
  earlierTimeYears: Rational,
  laterTimeYears: Rational,
): Rational {
  return divideRational(
    subtractRational(laterAmount, earlierAmount),
    subtractRational(laterTimeYears, earlierTimeYears),
  );
}

export function solveIntCp001Wave2(
  request: IntCp001Wave2SolveRequest,
): IntCp001Wave2SolveResult {
  switch (request.mode) {
    case "AMOUNT_FROM_PRT": {
      const interest = multiplyRational(
        multiplyRational(request.principal, percentToRate(request.annualRatePercent)),
        request.timeYears,
      );
      return { semantic: "TOTAL_AMOUNT", value: addRational(request.principal, interest) };
    }
    case "PRINCIPAL_FROM_INTEREST":
      return {
        semantic: "PRINCIPAL",
        value: divideRational(
          request.simpleInterest,
          multiplyRational(percentToRate(request.annualRatePercent), request.timeYears),
        ),
      };
    case "PRINCIPAL_FROM_AMOUNT":
      return {
        semantic: "PRINCIPAL",
        value: divideRational(
          request.amount,
          addRational(
            rational(1),
            multiplyRational(percentToRate(request.annualRatePercent), request.timeYears),
          ),
        ),
      };
    case "RATE_FROM_INTEREST":
      return {
        semantic: "ANNUAL_RATE_PERCENT",
        value: multiplyRational(
          divideRational(
            request.simpleInterest,
            multiplyRational(request.principal, request.timeYears),
          ),
          rational(100),
        ),
      };
    case "RATE_FROM_AMOUNT":
      return {
        semantic: "ANNUAL_RATE_PERCENT",
        value: multiplyRational(
          divideRational(
            subtractRational(request.amount, request.principal),
            multiplyRational(request.principal, request.timeYears),
          ),
          rational(100),
        ),
      };
    case "TIME_MONTHS_FROM_INTEREST": {
      const timeYears = divideRational(
        request.simpleInterest,
        multiplyRational(request.principal, percentToRate(request.annualRatePercent)),
      );
      return { semantic: "TIME_MONTHS", value: multiplyRational(timeYears, rational(12)) };
    }
    case "TIME_MONTHS_FROM_AMOUNT": {
      const timeYears = divideRational(
        subtractRational(request.amount, request.principal),
        multiplyRational(request.principal, percentToRate(request.annualRatePercent)),
      );
      return { semantic: "TIME_MONTHS", value: multiplyRational(timeYears, rational(12)) };
    }
    case "ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
      return {
        semantic: "ANNUAL_INTEREST",
        value: annualInterestFromTwoAmounts(
          request.earlierAmount,
          request.laterAmount,
          request.earlierTimeYears,
          request.laterTimeYears,
        ),
      };
    case "PRINCIPAL_FROM_TWO_AMOUNTS": {
      const annualInterest = annualInterestFromTwoAmounts(
        request.earlierAmount,
        request.laterAmount,
        request.earlierTimeYears,
        request.laterTimeYears,
      );
      return {
        semantic: "PRINCIPAL",
        value: subtractRational(
          request.earlierAmount,
          multiplyRational(annualInterest, request.earlierTimeYears),
        ),
      };
    }
    case "RATE_FROM_TWO_AMOUNTS": {
      const annualInterest = annualInterestFromTwoAmounts(
        request.earlierAmount,
        request.laterAmount,
        request.earlierTimeYears,
        request.laterTimeYears,
      );
      const principal = subtractRational(
        request.earlierAmount,
        multiplyRational(annualInterest, request.earlierTimeYears),
      );
      return {
        semantic: "ANNUAL_RATE_PERCENT",
        value: multiplyRational(divideRational(annualInterest, principal), rational(100)),
      };
    }
    case "RATE_FROM_TWO_AMOUNT_RATIO": {
      const numerator = subtractRational(request.laterToEarlierAmountRatio, rational(1));
      const denominator = subtractRational(
        request.laterTimeYears,
        multiplyRational(request.laterToEarlierAmountRatio, request.earlierTimeYears),
      );
      return {
        semantic: "ANNUAL_RATE_PERCENT",
        value: multiplyRational(divideRational(numerator, denominator), rational(100)),
      };
    }
    case "AMOUNT_MULTIPLE_FROM_RATE_TIME":
      return {
        semantic: "AMOUNT_MULTIPLE",
        value: addRational(
          rational(1),
          multiplyRational(percentToRate(request.annualRatePercent), request.timeYears),
        ),
      };
    case "INTEREST_RATIO_FROM_RATE_TIME":
      return {
        semantic: "INTEREST_TO_PRINCIPAL_RATIO",
        value: multiplyRational(percentToRate(request.annualRatePercent), request.timeYears),
      };
  }
}

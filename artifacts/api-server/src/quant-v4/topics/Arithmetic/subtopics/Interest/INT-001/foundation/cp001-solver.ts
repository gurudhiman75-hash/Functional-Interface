import {
  addRational,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import type { IntCp001SolveRequest, IntCp001SolveResult } from "./types";

function percentToRate(percent: Parameters<typeof divideRational>[0]) {
  return divideRational(percent, rational(100));
}

export function solveIntCp001(request: IntCp001SolveRequest): IntCp001SolveResult {
  switch (request.mode) {
    case "INTEREST_FROM_PRT": {
      const annualRate = percentToRate(request.annualRatePercent);
      return {
        semantic: "SIMPLE_INTEREST",
        value: multiplyRational(multiplyRational(request.principal, annualRate), request.timeYears),
      };
    }
    case "AMOUNT_FROM_PRT": {
      const annualRate = percentToRate(request.annualRatePercent);
      const interest = multiplyRational(multiplyRational(request.principal, annualRate), request.timeYears);
      return {
        semantic: "TOTAL_AMOUNT",
        value: addRational(request.principal, interest),
      };
    }
    case "PRINCIPAL_FROM_INTEREST": {
      const annualRate = percentToRate(request.annualRatePercent);
      return {
        semantic: "PRINCIPAL",
        value: divideRational(request.simpleInterest, multiplyRational(annualRate, request.timeYears)),
      };
    }
    case "PRINCIPAL_FROM_AMOUNT": {
      const annualRate = percentToRate(request.annualRatePercent);
      const multiplier = addRational(rational(1), multiplyRational(annualRate, request.timeYears));
      return {
        semantic: "PRINCIPAL",
        value: divideRational(request.amount, multiplier),
      };
    }
    case "RATE_FROM_INTEREST": {
      const decimalRate = divideRational(
        request.simpleInterest,
        multiplyRational(request.principal, request.timeYears),
      );
      return {
        semantic: "ANNUAL_RATE_PERCENT",
        value: multiplyRational(decimalRate, rational(100)),
      };
    }
    case "RATE_FROM_AMOUNT": {
      const interest = subtractRational(request.amount, request.principal);
      const decimalRate = divideRational(
        interest,
        multiplyRational(request.principal, request.timeYears),
      );
      return {
        semantic: "ANNUAL_RATE_PERCENT",
        value: multiplyRational(decimalRate, rational(100)),
      };
    }
    case "TIME_FROM_INTEREST": {
      const annualRate = percentToRate(request.annualRatePercent);
      return {
        semantic: "TIME_YEARS",
        value: divideRational(request.simpleInterest, multiplyRational(request.principal, annualRate)),
      };
    }
    case "TIME_FROM_AMOUNT": {
      const annualRate = percentToRate(request.annualRatePercent);
      return {
        semantic: "TIME_YEARS",
        value: divideRational(
          subtractRational(request.amount, request.principal),
          multiplyRational(request.principal, annualRate),
        ),
      };
    }
    case "ANNUAL_INTEREST_FROM_TOTAL":
      return {
        semantic: "ANNUAL_INTEREST",
        value: divideRational(request.totalInterest, request.timeYears),
      };
    case "INTEREST_FOR_SUBDURATION":
      return {
        semantic: "SIMPLE_INTEREST",
        value: multiplyRational(
          divideRational(request.totalInterest, request.knownTimeYears),
          request.targetTimeYears,
        ),
      };
    case "RATE_FROM_AMOUNT_MULTIPLE": {
      const interestRatio = subtractRational(request.amountMultiple, rational(1));
      return {
        semantic: "ANNUAL_RATE_PERCENT",
        value: multiplyRational(divideRational(interestRatio, request.timeYears), rational(100)),
      };
    }
    case "TIME_FROM_AMOUNT_MULTIPLE": {
      const annualRate = percentToRate(request.annualRatePercent);
      return {
        semantic: "TIME_YEARS",
        value: divideRational(subtractRational(request.amountMultiple, rational(1)), annualRate),
      };
    }
    case "TIME_FROM_INTEREST_MULTIPLE": {
      const annualRate = percentToRate(request.annualRatePercent);
      return {
        semantic: "TIME_YEARS",
        value: divideRational(request.interestToPrincipalRatio, annualRate),
      };
    }
    case "RATE_FROM_INTEREST_PRINCIPAL_RATIO":
      return {
        semantic: "ANNUAL_RATE_PERCENT",
        value: multiplyRational(
          divideRational(request.interestToPrincipalRatio, request.timeYears),
          rational(100),
        ),
      };
  }
}

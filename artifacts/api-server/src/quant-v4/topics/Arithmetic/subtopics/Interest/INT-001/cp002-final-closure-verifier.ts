import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";
import type { IntCp002FinalClosureQuestion } from "./cp002-final-closure-types";

const ONE_HUNDRED = rational(100);
const ONE = rational(1);

function readRational(question: IntCp002FinalClosureQuestion, key: string): Rational {
  const value = question.state.values[key] as Rational | undefined;
  if (!value || typeof value.numerator !== "bigint" || typeof value.denominator !== "bigint") {
    throw new Error(`CP-002 final verifier missing rational '${key}'.`);
  }
  return value;
}

function simpleInterest(principal: Rational, rate: Rational, time: Rational): Rational {
  return divideRational(
    multiplyRational(principal, multiplyRational(rate, time)),
    ONE_HUNDRED,
  );
}

export function verifyIntCp002FinalClosureCandidate(
  question: IntCp002FinalClosureQuestion,
  candidate: Rational,
): boolean {
  switch (question.prototypeId) {
    case "INT-CP002-CLOSE-PIECEWISE-AMOUNT": {
      const principal = readRational(question, "principal");
      const firstRate = readRational(question, "firstRate");
      const firstTime = readRational(question, "firstTime");
      const secondRate = readRational(question, "secondRate");
      const secondTime = readRational(question, "secondTime");
      const interest = addRational(
        simpleInterest(principal, firstRate, firstTime),
        simpleInterest(principal, secondRate, secondTime),
      );
      return equalsRational(candidate, addRational(principal, interest));
    }

    case "INT-CP002-CLOSE-PIECEWISE-MISSING-PRINCIPAL": {
      const firstRate = readRational(question, "firstRate");
      const firstTime = readRational(question, "firstTime");
      const secondRate = readRational(question, "secondRate");
      const secondTime = readRational(question, "secondTime");
      const totalInterest = readRational(question, "totalInterest");
      const reconstructed = addRational(
        simpleInterest(candidate, firstRate, firstTime),
        simpleInterest(candidate, secondRate, secondTime),
      );
      return equalsRational(reconstructed, totalInterest);
    }

    case "INT-CP002-CLOSE-LEDGER-COMPARISON": {
      const principal = readRational(question, "principal");
      const firstRate = readRational(question, "firstRate");
      const firstTime = readRational(question, "firstTime");
      const secondRate = readRational(question, "secondRate");
      const secondTime = readRational(question, "secondTime");
      const comparisonRate = readRational(question, "comparisonRate");
      const comparisonTime = readRational(question, "comparisonTime");
      const left = addRational(
        simpleInterest(principal, firstRate, firstTime),
        simpleInterest(principal, secondRate, secondTime),
      );
      const right = simpleInterest(principal, comparisonRate, comparisonTime);
      return equalsRational(candidate, subtractRational(left, right));
    }

    case "INT-CP002-CLOSE-SPLIT-PRINCIPAL-RATIO": {
      if (candidate.numerator <= 0n) return false;
      const totalPrincipal = readRational(question, "totalPrincipal");
      const firstRate = readRational(question, "firstRate");
      const secondRate = readRational(question, "secondRate");
      const time = readRational(question, "time");
      const totalInterest = readRational(question, "totalInterest");
      const secondPart = divideRational(totalPrincipal, addRational(candidate, ONE));
      const firstPart = subtractRational(totalPrincipal, secondPart);
      if (firstPart.numerator <= 0n || secondPart.numerator <= 0n) return false;
      const reconstructed = addRational(
        simpleInterest(firstPart, firstRate, time),
        simpleInterest(secondPart, secondRate, time),
      );
      return equalsRational(reconstructed, totalInterest);
    }

    case "INT-CP002-CLOSE-EQUAL-INTEREST-PRINCIPAL-RATIO": {
      const firstRate = readRational(question, "firstRate");
      const firstTime = readRational(question, "firstTime");
      const secondRate = readRational(question, "secondRate");
      const secondTime = readRational(question, "secondTime");
      const expected = divideRational(
        multiplyRational(secondRate, secondTime),
        multiplyRational(firstRate, firstTime),
      );
      return equalsRational(candidate, expected);
    }

    case "INT-CP002-CLOSE-COUNTERFACTUAL-ORIGINAL-DURATION": {
      const principal = readRational(question, "principal");
      const rate = readRational(question, "rate");
      const revisedDuration = readRational(question, "revisedDuration");
      const additionalInterest = readRational(question, "additionalInterest");
      if (candidate.numerator <= 0n) return false;
      const revisedInterest = simpleInterest(principal, rate, revisedDuration);
      const candidateInterest = simpleInterest(principal, rate, candidate);
      return equalsRational(subtractRational(revisedInterest, candidateInterest), additionalInterest);
    }

    case "INT-CP002-CLOSE-PARTIAL-REPAYMENT-COMPARISON": {
      const repayment = readRational(question, "repayment");
      const rate = readRational(question, "rate");
      const earlyTime = readRational(question, "earlyTime");
      const lateTime = readRational(question, "lateTime");
      const expected = simpleInterest(
        repayment,
        rate,
        subtractRational(lateTime, earlyTime),
      );
      return equalsRational(candidate, expected);
    }

    case "INT-CP002-CLOSE-BORROW-LEND-MISSING-PRINCIPAL": {
      const borrowRate = readRational(question, "borrowRate");
      const lendRate = readRational(question, "lendRate");
      const time = readRational(question, "time");
      const netGain = readRational(question, "netGain");
      const spread = subtractRational(lendRate, borrowRate);
      return equalsRational(simpleInterest(candidate, spread, time), netGain);
    }

    case "INT-CP002-CLOSE-BORROW-LEND-MISSING-DURATION": {
      const principal = readRational(question, "principal");
      const borrowRate = readRational(question, "borrowRate");
      const lendRate = readRational(question, "lendRate");
      const netGain = readRational(question, "netGain");
      const spread = subtractRational(lendRate, borrowRate);
      return equalsRational(simpleInterest(principal, spread, candidate), netGain);
    }

    case "INT-CP002-CLOSE-DAY-COUNT-BASIS-COMPARISON": {
      const principal = readRational(question, "principal");
      const rate = readRational(question, "rate");
      const days = readRational(question, "days");
      const commercial = simpleInterest(principal, rate, divideRational(days, rational(360)));
      const actual = simpleInterest(principal, rate, divideRational(days, rational(365)));
      return equalsRational(candidate, subtractRational(commercial, actual));
    }
  }
}

import { addRational, divideRational, multiplyRational, normalizeRatio, rational, subtractRational } from "./math";
import { formatPrt001Money } from "./parameter-generator";
import type { Prt001IndependentVerification, Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer, Rational } from "./types";

const moneyAnswer = (exact: Rational): Prt001TaskAnswer => ({ kind: "RATIONAL", exact, display: formatPrt001Money(exact) });
const ratioAnswer = (ratio: readonly bigint[]): Prt001TaskAnswer => ({ kind: "RATIO", ratio, display: ratio.join(":") });
const n = (parameters: Prt001PilotParameters, key: string): number => {
  const value = parameters.renderVariables[key];
  if (typeof value !== "number") throw new Error(`E13 numeric variable ${key} is missing`);
  return value;
};

export function solvePrt001E13Task(parameters: Prt001PilotParameters, solution: Prt001Solution): Prt001TaskAnswer {
  switch (parameters.questionLanguageId) {
    case "PRT-QL-106":
    case "PRT-QL-109":
    case "PRT-QL-110":
      return moneyAnswer(solution.distributedShares[parameters.targetPartnerId!]!);
    case "PRT-QL-108":
    case "PRT-QL-111":
      return moneyAnswer(solution.finalPartnerReceipts[parameters.targetPartnerId!]!);
    case "PRT-QL-107":
    case "PRT-QL-112":
      return ratioAnswer(solution.normalizedRatio);
    default:
      throw new Error(`E13 task solver does not support ${parameters.questionLanguageId}`);
  }
}

export function independentlySolvePrt001E13Task(parameters: Prt001PilotParameters, verification: Prt001IndependentVerification): Prt001TaskAnswer {
  switch (parameters.questionLanguageId) {
    case "PRT-QL-106":
    case "PRT-QL-109":
    case "PRT-QL-110":
      return moneyAnswer(verification.distributedShares[parameters.targetPartnerId!]!);
    case "PRT-QL-108":
    case "PRT-QL-111":
      return moneyAnswer(verification.finalPartnerReceipts[parameters.targetPartnerId!]!);
    case "PRT-QL-107": {
      const initialA = rational(n(parameters, "initialCapitalANumeric"));
      const initialB = rational(n(parameters, "initialCapitalBNumeric"));
      const firstProfit = rational(n(parameters, "firstYearProfitNumeric"));
      const totalCapital = addRational(initialA, initialB);
      const shareA = multiplyRational(firstProfit, divideRational(initialA, totalCapital));
      const shareB = multiplyRational(firstProfit, divideRational(initialB, totalCapital));
      const reinvestPartner = parameters.renderVariables.reinvestPartner;
      const nextA = reinvestPartner === parameters.partnerA ? addRational(initialA, shareA) : initialA;
      const nextB = reinvestPartner === parameters.partnerB ? addRational(initialB, shareB) : initialB;
      return ratioAnswer(normalizeRatio([nextA, nextB]));
    }
    case "PRT-QL-112": {
      const oldA = rational(n(parameters, "oldRatioANumeric"));
      const oldB = rational(n(parameters, "oldRatioBNumeric"));
      const oldTotal = addRational(oldA, oldB);
      const acquired = rational(n(parameters, "acquiredNumerator"), n(parameters, "acquiredDenominator"));
      const sacrificeA = rational(n(parameters, "sacrificeANumeric"));
      const sacrificeB = rational(n(parameters, "sacrificeBNumeric"));
      const sacrificeTotal = addRational(sacrificeA, sacrificeB);
      const finalA = subtractRational(divideRational(oldA, oldTotal), multiplyRational(acquired, divideRational(sacrificeA, sacrificeTotal)));
      const finalB = subtractRational(divideRational(oldB, oldTotal), multiplyRational(acquired, divideRational(sacrificeB, sacrificeTotal)));
      return ratioAnswer(normalizeRatio([finalA, finalB, acquired]));
    }
    default:
      throw new Error(`E13 independent task solver does not support ${parameters.questionLanguageId}`);
  }
}

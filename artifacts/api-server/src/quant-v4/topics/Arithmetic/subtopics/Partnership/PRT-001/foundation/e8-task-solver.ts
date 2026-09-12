import {
  ZERO,
  addRational,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./math";
import { formatPrt001Money } from "./parameter-generator";
import type {
  Prt001IndependentVerification,
  Prt001PilotParameters,
  Prt001Solution,
  Prt001TaskAnswer,
  Rational,
} from "./types";

function abs(value: Rational): Rational {
  return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value;
}

function moneyAnswer(exact: Rational): Prt001TaskAnswer {
  return { kind: "RATIONAL", exact, display: formatPrt001Money(exact) };
}

export function solvePrt001E8Task(
  parameters: Prt001PilotParameters,
  solution: Prt001Solution,
): Prt001TaskAnswer {
  switch (parameters.questionLanguageId) {
    case "PRT-QL-104":
      return moneyAnswer(parameters.state.grossProfitOrLoss);
    case "PRT-QL-105":
      return moneyAnswer(solution.distributedShares[parameters.targetPartnerId!]!);
    default:
      throw new Error(`E8 task solver does not support ${parameters.questionLanguageId}`);
  }
}

export function independentlySolvePrt001E8Task(
  parameters: Prt001PilotParameters,
  verification: Prt001IndependentVerification,
): Prt001TaskAnswer {
  switch (parameters.questionLanguageId) {
    case "PRT-QL-104": {
      const [partnerA, partnerB] = parameters.state.partners;
      const [weightA, weightB] = verification.weights.map((item) => item.effectiveCapital);
      const totalWeight = addRational(weightA!, weightB!);
      const weightDifference = abs(subtractRational(weightA!, weightB!));
      const finalDifference = abs(subtractRational(
        verification.finalPartnerReceipts[partnerA!.partnerId]!,
        verification.finalPartnerReceipts[partnerB!.partnerId]!,
      ));
      const distributablePool = divideRational(
        multiplyRational(finalDifference, totalWeight),
        weightDifference,
      );
      const allocatedPercent = parameters.state.allocations
        .map((allocation) => allocation.value)
        .reduce(addRational, ZERO);
      const residualPercent = subtractRational(rational(100), allocatedPercent);
      const gross = divideRational(
        multiplyRational(distributablePool, rational(100)),
        residualPercent,
      );
      return moneyAnswer(gross);
    }
    case "PRT-QL-105":
      return moneyAnswer(verification.distributedShares[parameters.targetPartnerId!]!);
    default:
      throw new Error(`E8 independent task solver does not support ${parameters.questionLanguageId}`);
  }
}

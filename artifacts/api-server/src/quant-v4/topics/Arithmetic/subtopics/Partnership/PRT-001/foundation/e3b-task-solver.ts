import { ZERO, addRational, divideRational, multiplyRational, normalizeRatio, rational, subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import type { Prt001IndependentVerification, Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer, Rational } from "./types";

function abs(value: Rational): Rational { return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value; }
function answer(parameters: Prt001PilotParameters, exact: Rational): Prt001TaskAnswer {
  return { kind: "RATIONAL", exact, display: parameters.entry.answerType === "DURATION" ? formatPrt001Duration(exact, parameters.language) : formatPrt001Money(exact) };
}
function ratioAnswer(values: readonly Rational[]): Prt001TaskAnswer { const ratio = normalizeRatio(values); return { kind: "RATIO", ratio, display: ratio.join(":") }; }

export function solvePrt001E3BTask(parameters: Prt001PilotParameters, _solution: Prt001Solution): Prt001TaskAnswer {
  const [a, b] = parameters.state.partners;
  switch (parameters.entry.solveMode) {
    case "findEqualFinalReceiptsConditionWithRemuneration": return answer(parameters, parameters.state.allocations.find((item) => item.kind === "SALARY")!.value);
    case "findReverseContributionFromMixedPartnerRelations": return answer(parameters, b!.capitalSegments[0]!.capital);
    case "findUnknownCapitalFromProfitRatio": return answer(parameters, a!.capitalSegments[0]!.capital);
    case "findTotalProfitFromPartnerShareCapitalDuration": return answer(parameters, parameters.state.grossProfitOrLoss);
    case "findUnknownJoinTimeFromPartnerShare": return answer(parameters, b!.capitalSegments[0]!.start);
    case "findUnknownWithdrawnCapitalFromProfitRatio": return answer(parameters, subtractRational(a!.capitalSegments[0]!.capital, a!.capitalSegments[1]!.capital));
    case "findTotalProfitFromDifferenceBetweenTwoShares": return answer(parameters, parameters.state.grossProfitOrLoss);
    default: throw new Error(`E3B task solver does not support ${parameters.entry.solveMode}`);
  }
}

export function independentlySolvePrt001E3BTask(parameters: Prt001PilotParameters, verification: Prt001IndependentVerification): Prt001TaskAnswer {
  const partners = parameters.state.partners;
  const weights = verification.weights.map((item) => item.effectiveCapital);
  const totalWeight = weights.reduce(addRational, ZERO);
  switch (parameters.entry.solveMode) {
    case "findEqualFinalReceiptsConditionWithRemuneration": {
      const difference = subtractRational(weights[1]!, weights[0]!);
      const denominator = addRational(totalWeight, difference);
      return answer(parameters, divideRational(multiplyRational(parameters.state.grossProfitOrLoss, difference), denominator));
    }
    case "findReverseContributionFromMixedPartnerRelations": {
      const salary = parameters.state.allocations.find((item) => item.kind === "SALARY")!.value;
      const distributedA = subtractRational(verification.finalPartnerReceipts[partners[0]!.partnerId]!, salary);
      const distributedB = verification.finalPartnerReceipts[partners[1]!.partnerId]!;
      const requiredBWeight = divideRational(multiplyRational(weights[0]!, distributedB), distributedA);
      const bSegment = partners[1]!.capitalSegments[0]!;
      const activeDuration = subtractRational(bSegment.end, bSegment.start);
      return answer(parameters, divideRational(requiredBWeight, activeDuration));
    }
    case "findUnknownCapitalFromProfitRatio": {
      const bCapital = partners[1]!.capitalSegments[0]!.capital;
      return answer(parameters, divideRational(multiplyRational(bCapital, weights[0]!), weights[1]!));
    }
    case "findTotalProfitFromPartnerShareCapitalDuration": {
      const knownShare = verification.distributedShares[partners[0]!.partnerId]!;
      return answer(parameters, divideRational(multiplyRational(knownShare, totalWeight), weights[0]!));
    }
    case "findUnknownJoinTimeFromPartnerShare": {
      const bCapital = partners[1]!.capitalSegments[0]!.capital;
      const activeDuration = divideRational(weights[1]!, bCapital);
      return answer(parameters, subtractRational(parameters.state.totalDuration, activeDuration));
    }
    case "findUnknownWithdrawnCapitalFromProfitRatio": {
      const [first, second] = partners[0]!.capitalSegments;
      const before = subtractRational(first!.end, first!.start);
      const after = subtractRational(parameters.state.totalDuration, second!.start);
      const finalCapital = divideRational(subtractRational(weights[0]!, multiplyRational(first!.capital, before)), after);
      return answer(parameters, subtractRational(first!.capital, finalCapital));
    }
    case "findTotalProfitFromDifferenceBetweenTwoShares": {
      const diffShare = abs(subtractRational(verification.distributedShares[partners[0]!.partnerId]!, verification.distributedShares[partners[1]!.partnerId]!));
      const diffWeight = abs(subtractRational(weights[0]!, weights[1]!));
      return answer(parameters, divideRational(multiplyRational(diffShare, totalWeight), diffWeight));
    }
    default: throw new Error(`E3B independent solver does not support ${parameters.entry.solveMode}`);
  }
}

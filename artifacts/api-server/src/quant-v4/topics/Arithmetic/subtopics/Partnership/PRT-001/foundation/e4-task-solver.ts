import { ZERO, addRational, divideRational, multiplyRational, normalizeRatio, rational, subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import type { Prt001IndependentVerification, Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer, Rational } from "./types";

function abs(value: Rational): Rational { return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value; }
function scalarAnswer(parameters: Prt001PilotParameters, exact: Rational): Prt001TaskAnswer {
  return { kind: "RATIONAL", exact, display: parameters.entry.answerType === "DURATION" ? formatPrt001Duration(exact, parameters.language) : formatPrt001Money(exact) };
}
function ratioAnswer(values: readonly Rational[]): Prt001TaskAnswer { const ratio = normalizeRatio(values); return { kind: "RATIO", ratio, display: ratio.join(":") }; }

export function solvePrt001E4Task(parameters: Prt001PilotParameters, solution: Prt001Solution): Prt001TaskAnswer {
  const [a,b] = parameters.state.partners;
  switch (parameters.entry.solveMode) {
    case "findOtherPartnerShareFromKnownShareAndCapitals": return scalarAnswer(parameters, solution.distributedShares[b!.partnerId]!);
    case "findCapitalRatioFromProfitShares": return ratioAnswer([a!.capitalSegments[0]!.capital, b!.capitalSegments[0]!.capital]);
    case "findLossShareFromCapitals": return scalarAnswer(parameters, abs(solution.distributedShares[parameters.targetPartnerId!]!));
    case "findIndividualCapitalsFromTotalCapitalAndProfitRatio": return scalarAnswer(parameters, a!.capitalSegments[0]!.capital);
    case "findCapitalForEqualProfitGivenDurations": return scalarAnswer(parameters, a!.capitalSegments[0]!.capital);
    case "findDurationForEqualProfitGivenCapitals": return scalarAnswer(parameters, subtractRational(a!.capitalSegments[0]!.end, a!.capitalSegments[0]!.start));
    case "findProfitDifferenceFromCapitalDurationWeights": return scalarAnswer(parameters, abs(subtractRational(solution.distributedShares[a!.partnerId]!, solution.distributedShares[b!.partnerId]!)));
    case "findProfitRatioWhenPartnerLeavesEarly": return ratioAnswer(solution.timeline.weights.map((item) => item.effectiveCapital));
    case "findShareWhenPartnerJoinsLater": return scalarAnswer(parameters, solution.distributedShares[parameters.targetPartnerId!]!);
    case "findUnknownCapitalOfEarlyLeavingPartner": return scalarAnswer(parameters, a!.capitalSegments[0]!.capital);
    case "findTotalProfitFromStaggeredPartnerShare": return scalarAnswer(parameters, parameters.state.grossProfitOrLoss);
    case "findProfitRatioAfterPercentageCapitalDecrease":
    case "findProfitRatioAfterFractionalCapitalChange": return ratioAnswer(solution.timeline.weights.map((item) => item.effectiveCapital));
    case "findUnknownCapitalChangeTimeFromPartnerShare": return scalarAnswer(parameters, a!.capitalSegments[1]!.start);
    default: throw new Error(`E4 task solver does not support ${parameters.entry.solveMode}`);
  }
}

export function independentlySolvePrt001E4Task(parameters: Prt001PilotParameters, verification: Prt001IndependentVerification): Prt001TaskAnswer {
  const partners = parameters.state.partners;
  const [a,b] = partners;
  const weights = verification.weights.map((item) => item.effectiveCapital);
  const totalWeight = weights.reduce(addRational, ZERO);
  switch (parameters.entry.solveMode) {
    case "findOtherPartnerShareFromKnownShareAndCapitals": return scalarAnswer(parameters, verification.distributedShares[b!.partnerId]!);
    case "findCapitalRatioFromProfitShares": return ratioAnswer(weights);
    case "findLossShareFromCapitals": return scalarAnswer(parameters, abs(verification.distributedShares[parameters.targetPartnerId!]!));
    case "findIndividualCapitalsFromTotalCapitalAndProfitRatio": {
      const totalCapital = addRational(a!.capitalSegments[0]!.capital, b!.capitalSegments[0]!.capital);
      return scalarAnswer(parameters, divideRational(multiplyRational(totalCapital, weights[0]!), totalWeight));
    }
    case "findCapitalForEqualProfitGivenDurations": {
      const duration = subtractRational(a!.capitalSegments[0]!.end, a!.capitalSegments[0]!.start);
      return scalarAnswer(parameters, divideRational(weights[0]!, duration));
    }
    case "findDurationForEqualProfitGivenCapitals": return scalarAnswer(parameters, divideRational(weights[0]!, a!.capitalSegments[0]!.capital));
    case "findProfitDifferenceFromCapitalDurationWeights": return scalarAnswer(parameters, abs(subtractRational(verification.distributedShares[a!.partnerId]!, verification.distributedShares[b!.partnerId]!)));
    case "findProfitRatioWhenPartnerLeavesEarly": return ratioAnswer(weights);
    case "findShareWhenPartnerJoinsLater": return scalarAnswer(parameters, verification.distributedShares[parameters.targetPartnerId!]!);
    case "findUnknownCapitalOfEarlyLeavingPartner": {
      const active = subtractRational(a!.capitalSegments[0]!.end, a!.capitalSegments[0]!.start);
      return scalarAnswer(parameters, divideRational(weights[0]!, active));
    }
    case "findTotalProfitFromStaggeredPartnerShare": {
      const target = parameters.targetPartnerId!;
      const targetIndex = partners.findIndex((item) => item.partnerId === target);
      const knownShare = verification.distributedShares[target]!;
      return scalarAnswer(parameters, divideRational(multiplyRational(knownShare, totalWeight), weights[targetIndex]!));
    }
    case "findProfitRatioAfterPercentageCapitalDecrease":
    case "findProfitRatioAfterFractionalCapitalChange": return ratioAnswer(weights);
    case "findUnknownCapitalChangeTimeFromPartnerShare": {
      const [first, second] = a!.capitalSegments;
      const c0 = first!.capital;
      const c1 = second!.capital;
      const numerator = subtractRational(weights[0]!, multiplyRational(c1, parameters.state.totalDuration));
      const denominator = subtractRational(c0, c1);
      return scalarAnswer(parameters, divideRational(numerator, denominator));
    }
    default: throw new Error(`E4 independent solver does not support ${parameters.entry.solveMode}`);
  }
}

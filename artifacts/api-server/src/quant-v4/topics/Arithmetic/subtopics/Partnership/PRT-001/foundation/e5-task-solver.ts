import { ZERO, addRational, divideRational, multiplyRational, normalizeRatio, rational, subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import type { Prt001IndependentVerification, Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer, Rational } from "./types";

function abs(value: Rational): Rational { return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value; }
function scalarAnswer(parameters: Prt001PilotParameters, exact: Rational): Prt001TaskAnswer {
  return { kind: "RATIONAL", exact, display: parameters.entry.answerType === "DURATION" ? formatPrt001Duration(exact, parameters.language) : formatPrt001Money(exact) };
}
function ratioAnswer(values: readonly Rational[]): Prt001TaskAnswer { const ratio = normalizeRatio(values); return { kind: "RATIO", ratio, display: ratio.join(":") }; }

export function solvePrt001E5Task(parameters: Prt001PilotParameters, solution: Prt001Solution): Prt001TaskAnswer {
  const [a,b,c] = parameters.state.partners;
  switch (parameters.entry.solveMode) {
    case "findUnknownCapitalFromPartnerShares": return scalarAnswer(parameters, a!.capitalSegments[0]!.capital);
    case "findMissingPartnerShareFromKnownShareAndWeights": return scalarAnswer(parameters, solution.distributedShares[b!.partnerId]!);
    case "findUnknownLeaveTimeFromPartnerShare": return scalarAnswer(parameters, b!.capitalSegments[0]!.end);
    case "findJoinTimeForEqualProfitShares": return scalarAnswer(parameters, b!.capitalSegments[0]!.start);
    case "findLeaveTimeForEqualProfitShares": return scalarAnswer(parameters, a!.capitalSegments[0]!.end);
    case "findShareDifferenceWithStaggeredParticipation": return scalarAnswer(parameters, abs(subtractRational(solution.distributedShares[a!.partnerId]!, solution.distributedShares[b!.partnerId]!)));
    case "findProfitRatioAfterCapitalWithdrawal": return ratioAnswer(solution.timeline.weights.map((item) => item.effectiveCapital));
    case "findShareAfterCapitalAddition": return scalarAnswer(parameters, solution.distributedShares[a!.partnerId]!);
    case "findCapitalChangeForEqualProfitShares": return scalarAnswer(parameters, a!.capitalSegments[1]!.capital);
    case "compareEffectiveCapitalsAfterDifferentChanges": return ratioAnswer(solution.timeline.weights.map((item) => item.effectiveCapital));
    case "findSharesFromTimeMultiplesAndCapitals": return scalarAnswer(parameters, solution.distributedShares[parameters.targetPartnerId!]!);
    case "findPartnerShareWhenOneWeightIsSumOfOthers": return scalarAnswer(parameters, solution.distributedShares[c!.partnerId]!);
    case "findUnknownCapitalFromEqualShareConditionInMultiPartnerSystem": return scalarAnswer(parameters, c!.capitalSegments[0]!.capital);
    case "findUnknownDurationFromEqualShareConditionInMultiPartnerSystem": return scalarAnswer(parameters, subtractRational(c!.capitalSegments[0]!.end, c!.capitalSegments[0]!.start));
    case "findSleepingPartnerShareWithActivePartnerSalary":
    case "findPartnerSharesAfterFixedManagementAllowance": return scalarAnswer(parameters, solution.distributedShares[b!.partnerId]!);
    case "findActivePartnerReceiptWithPercentOfGrossProfitCommission": return scalarAnswer(parameters, solution.finalPartnerReceipts[a!.partnerId]!);
    case "findSharesAfterReserveDeduction":
    case "findSharesAfterExplicitBusinessExpenseDeduction": return scalarAnswer(parameters, solution.distributedShares[parameters.targetPartnerId!]!);
    default: throw new Error(`E5 task solver does not support ${parameters.entry.solveMode}`);
  }
}

export function independentlySolvePrt001E5Task(parameters: Prt001PilotParameters, verification: Prt001IndependentVerification): Prt001TaskAnswer {
  const [a,b,c] = parameters.state.partners;
  const weights = verification.weights.map((item) => item.effectiveCapital);
  const totalWeight = weights.reduce(addRational, ZERO);
  switch (parameters.entry.solveMode) {
    case "findUnknownCapitalFromPartnerShares": {
      const shareA = verification.distributedShares[a!.partnerId]!;
      const shareB = verification.distributedShares[b!.partnerId]!;
      return scalarAnswer(parameters, divideRational(multiplyRational(b!.capitalSegments[0]!.capital, shareA), shareB));
    }
    case "findMissingPartnerShareFromKnownShareAndWeights": return scalarAnswer(parameters, verification.distributedShares[b!.partnerId]!);
    case "findUnknownLeaveTimeFromPartnerShare": return scalarAnswer(parameters, divideRational(weights[1]!, b!.capitalSegments[0]!.capital));
    case "findJoinTimeForEqualProfitShares": {
      const active = divideRational(weights[1]!, b!.capitalSegments[0]!.capital);
      return scalarAnswer(parameters, subtractRational(parameters.state.totalDuration, active));
    }
    case "findLeaveTimeForEqualProfitShares": return scalarAnswer(parameters, divideRational(weights[0]!, a!.capitalSegments[0]!.capital));
    case "findShareDifferenceWithStaggeredParticipation": return scalarAnswer(parameters, abs(subtractRational(verification.distributedShares[a!.partnerId]!, verification.distributedShares[b!.partnerId]!)));
    case "findProfitRatioAfterCapitalWithdrawal":
    case "compareEffectiveCapitalsAfterDifferentChanges": return ratioAnswer(weights);
    case "findShareAfterCapitalAddition": return scalarAnswer(parameters, verification.distributedShares[a!.partnerId]!);
    case "findCapitalChangeForEqualProfitShares": {
      const [first, second] = a!.capitalSegments;
      const before = subtractRational(first!.end, first!.start);
      const after = subtractRational(parameters.state.totalDuration, second!.start);
      const requiredWeight = weights[1]!;
      return scalarAnswer(parameters, divideRational(subtractRational(requiredWeight, multiplyRational(first!.capital, before)), after));
    }
    case "findSharesFromTimeMultiplesAndCapitals": return scalarAnswer(parameters, verification.distributedShares[parameters.targetPartnerId!]!);
    case "findPartnerShareWhenOneWeightIsSumOfOthers": return scalarAnswer(parameters, verification.distributedShares[c!.partnerId]!);
    case "findUnknownCapitalFromEqualShareConditionInMultiPartnerSystem": {
      const segment = c!.capitalSegments[0]!;
      const duration = subtractRational(segment.end, segment.start);
      return scalarAnswer(parameters, divideRational(weights[2]!, duration));
    }
    case "findUnknownDurationFromEqualShareConditionInMultiPartnerSystem": return scalarAnswer(parameters, divideRational(weights[2]!, c!.capitalSegments[0]!.capital));
    case "findSleepingPartnerShareWithActivePartnerSalary":
    case "findPartnerSharesAfterFixedManagementAllowance": return scalarAnswer(parameters, verification.distributedShares[b!.partnerId]!);
    case "findActivePartnerReceiptWithPercentOfGrossProfitCommission": return scalarAnswer(parameters, verification.finalPartnerReceipts[a!.partnerId]!);
    case "findSharesAfterReserveDeduction":
    case "findSharesAfterExplicitBusinessExpenseDeduction": return scalarAnswer(parameters, verification.distributedShares[parameters.targetPartnerId!]!);
    default: throw new Error(`E5 independent solver does not support ${parameters.entry.solveMode}`);
  }
}

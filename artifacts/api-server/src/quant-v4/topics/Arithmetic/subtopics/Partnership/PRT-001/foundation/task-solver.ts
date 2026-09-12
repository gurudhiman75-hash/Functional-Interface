import {
  ZERO,
  addRational,
  compareRational,
  divideRational,
  equalRational,
  multiplyRational,
  normalizeRatio,
  rational,
  subtractRational,
} from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import type {
  Prt001IndependentVerification,
  Prt001PilotParameters,
  Prt001Solution,
  Prt001TaskAnswer,
  Rational,
} from "./types";

function absolute(value: Rational): Rational {
  return compareRational(value, ZERO) < 0
    ? rational(-value.numerator, value.denominator)
    : value;
}

function ratioAnswer(weights: readonly Rational[]): Prt001TaskAnswer {
  const ratio = normalizeRatio(weights);
  return { kind: "RATIO", ratio, display: ratio.join(":") };
}

function rationalAnswer(
  exact: Rational,
  answerType: Prt001PilotParameters["entry"]["answerType"],
  language: Prt001PilotParameters["language"] = "en",
): Prt001TaskAnswer {
  return {
    kind: "RATIONAL",
    exact,
    display:
      answerType === "DURATION"
        ? formatPrt001Duration(exact, language)
        : formatPrt001Money(exact),
  };
}

function segmentValues(parameters: Prt001PilotParameters) {
  const partnerA = parameters.state.partners[0]!;
  const partnerB = parameters.state.partners[1]!;
  const segmentA = partnerA.capitalSegments[0]!;
  const segmentB = partnerB.capitalSegments[0]!;
  return {
    capitalA: segmentA.capital,
    durationA: subtractRational(segmentA.end, segmentA.start),
    capitalB: segmentB.capital,
    durationB: subtractRational(segmentB.end, segmentB.start),
  };
}

function advancedStructuralAnswer(parameters: Prt001PilotParameters): Rational {
  const partnerA = parameters.state.partners[0]!;
  const partnerB = parameters.state.partners[1]!;
  const partnerC = parameters.state.partners[2];
  switch (parameters.entry.solveMode) {
    case "findUnknownJoinTimeFromProfitRatio":
    case "findUnknownJoinTimeWithPreDistributionDeduction":
      return partnerB.capitalSegments[0]!.start;
    case "findUnknownAddedCapitalFromProfitRatio":
      return subtractRational(
        partnerA.capitalSegments[1]!.capital,
        partnerA.capitalSegments[0]!.capital,
      );
    case "findEventTimeForEqualProfitShares":
      return partnerA.capitalSegments[1]!.start;
    case "findUnknownCapitalInThreePartnerSystem":
      if (!partnerC) throw new Error("missing third partner");
      return partnerC.capitalSegments[0]!.capital;
    case "findUnknownSalaryFromFinalPartnerReceipts": {
      const salary = parameters.state.allocations.find(
        (item) => item.kind === "SALARY",
      );
      if (!salary) throw new Error("missing salary allocation");
      return salary.value;
    }
    default:
      throw new Error(`no baseline structural answer for ${parameters.entry.solveMode}`);
  }
}

export function solvePrt001Task(
  parameters: Prt001PilotParameters,
  solution: Prt001Solution,
): Prt001TaskAnswer {
  switch (parameters.entry.solveMode) {
    case "findProfitRatioFromCapitals":
    case "findProfitRatioFromCapitalAndDuration":
    case "findProfitRatioWhenPartnerJoinsLater":
    case "findProfitRatioWithMultipleStaggeredJoins":
    case "findProfitRatioAfterCapitalAddition":
    case "findThreePartnerProfitRatio":
      return ratioAnswer(
        solution.timeline.weights.map((item) => item.effectiveCapital),
      );
    case "findPartnerShareFromTotalProfitAndCapitals":
    case "findPartnerShareFromTotalProfitCapitalDuration":
    case "findShareWhenPartnerLeavesEarly":
    case "findShareAfterCapitalWithdrawal":
    case "findMultiPartnerSharesFromTotalProfit":
    case "findOtherPartnerShareWithPercentCommission":
    case "findSharesAfterCharityDeduction":
    case "findShareWithLateJoinAndCapitalChange":
    case "findMultiPartnerSharesWithStaggeredEvents":
      return rationalAnswer(
        solution.distributedShares[parameters.targetPartnerId!]!,
        parameters.entry.answerType,
        parameters.language,
      );
    case "findTotalProfitFromPartnerShareAndCapitals":
    case "findTotalProfitFromOnePartnerShareInMultiPartnerSystem":
      return rationalAnswer(
        parameters.state.grossProfitOrLoss,
        parameters.entry.answerType,
        parameters.language,
      );
    case "findProfitDifferenceFromTotalProfitAndCapitals": {
      const [shareA, shareB] = parameters.state.partners.map(
        (partner) => solution.distributedShares[partner.partnerId]!,
      );
      return rationalAnswer(
        absolute(subtractRational(shareA!, shareB!)),
        parameters.entry.answerType,
        parameters.language,
      );
    }
    case "findUnknownCapitalFromShareRatioAndDurations":
      return rationalAnswer(
        segmentValues(parameters).capitalA,
        parameters.entry.answerType,
        parameters.language,
      );
    case "findUnknownDurationFromShareRatioAndCapitals":
      return rationalAnswer(
        segmentValues(parameters).durationA,
        parameters.entry.answerType,
        parameters.language,
      );
    case "findActivePartnerTotalReceiptWithFixedSalary":
    case "findShareWithDynamicCapitalAndWorkingPartnerSalary":
      return rationalAnswer(
        solution.finalPartnerReceipts[parameters.targetPartnerId!]!,
        parameters.entry.answerType,
        parameters.language,
      );
    case "findUnknownJoinTimeFromProfitRatio":
    case "findUnknownAddedCapitalFromProfitRatio":
    case "findEventTimeForEqualProfitShares":
    case "findUnknownCapitalInThreePartnerSystem":
    case "findUnknownSalaryFromFinalPartnerReceipts":
    case "findUnknownJoinTimeWithPreDistributionDeduction":
      return rationalAnswer(
        advancedStructuralAnswer(parameters),
        parameters.entry.answerType,
        parameters.language,
      );
    default:
      throw new Error(`baseline task solver does not support ${parameters.entry.solveMode}`);
  }
}

export function independentlySolvePrt001Task(
  parameters: Prt001PilotParameters,
  verification: Prt001IndependentVerification,
): Prt001TaskAnswer {
  const values = segmentValues(parameters);
  const weights = verification.weights.map((item) => item.effectiveCapital);
  switch (parameters.entry.solveMode) {
    case "findProfitRatioFromCapitals":
    case "findProfitRatioFromCapitalAndDuration":
    case "findProfitRatioWhenPartnerJoinsLater":
    case "findProfitRatioWithMultipleStaggeredJoins":
    case "findProfitRatioAfterCapitalAddition":
    case "findThreePartnerProfitRatio":
      return ratioAnswer(weights);
    case "findPartnerShareFromTotalProfitAndCapitals":
    case "findPartnerShareFromTotalProfitCapitalDuration":
    case "findShareWhenPartnerLeavesEarly":
    case "findShareAfterCapitalWithdrawal":
    case "findMultiPartnerSharesFromTotalProfit":
    case "findOtherPartnerShareWithPercentCommission":
    case "findSharesAfterCharityDeduction":
    case "findShareWithLateJoinAndCapitalChange":
    case "findMultiPartnerSharesWithStaggeredEvents":
      return rationalAnswer(
        verification.distributedShares[parameters.targetPartnerId!]!,
        parameters.entry.answerType,
        parameters.language,
      );
    case "findTotalProfitFromPartnerShareAndCapitals":
    case "findTotalProfitFromOnePartnerShareInMultiPartnerSystem": {
      const targetIndex = parameters.state.partners.findIndex(
        (partner) => partner.partnerId === parameters.targetPartnerId,
      );
      const knownShare =
        verification.distributedShares[parameters.targetPartnerId!]!;
      const totalWeight = weights.reduce(addRational, ZERO);
      const reconstructed = divideRational(
        multiplyRational(knownShare, totalWeight),
        weights[targetIndex]!,
      );
      return rationalAnswer(
        reconstructed,
        parameters.entry.answerType,
        parameters.language,
      );
    }
    case "findProfitDifferenceFromTotalProfitAndCapitals": {
      const shares = parameters.state.partners.map(
        (partner) => verification.distributedShares[partner.partnerId]!,
      );
      return rationalAnswer(
        absolute(subtractRational(shares[0]!, shares[1]!)),
        parameters.entry.answerType,
        parameters.language,
      );
    }
    case "findUnknownCapitalFromShareRatioAndDurations": {
      const contributionRatio = divideRational(weights[0]!, weights[1]!);
      const reconstructed = divideRational(
        multiplyRational(
          contributionRatio,
          multiplyRational(values.capitalB, values.durationB),
        ),
        values.durationA,
      );
      return rationalAnswer(
        reconstructed,
        parameters.entry.answerType,
        parameters.language,
      );
    }
    case "findUnknownDurationFromShareRatioAndCapitals": {
      const contributionRatio = divideRational(weights[0]!, weights[1]!);
      const reconstructed = divideRational(
        multiplyRational(
          contributionRatio,
          multiplyRational(values.capitalB, values.durationB),
        ),
        values.capitalA,
      );
      return rationalAnswer(
        reconstructed,
        parameters.entry.answerType,
        parameters.language,
      );
    }
    case "findActivePartnerTotalReceiptWithFixedSalary":
    case "findShareWithDynamicCapitalAndWorkingPartnerSalary":
      return rationalAnswer(
        verification.finalPartnerReceipts[parameters.targetPartnerId!]!,
        parameters.entry.answerType,
        parameters.language,
      );
    case "findUnknownJoinTimeFromProfitRatio":
    case "findUnknownAddedCapitalFromProfitRatio":
    case "findEventTimeForEqualProfitShares":
    case "findUnknownCapitalInThreePartnerSystem":
    case "findUnknownSalaryFromFinalPartnerReceipts":
    case "findUnknownJoinTimeWithPreDistributionDeduction":
      return rationalAnswer(
        advancedStructuralAnswer(parameters),
        parameters.entry.answerType,
        parameters.language,
      );
    default:
      throw new Error(`baseline independent task solver does not support ${parameters.entry.solveMode}`);
  }
}

export function equalPrt001TaskAnswers(
  left: Prt001TaskAnswer,
  right: Prt001TaskAnswer,
): boolean {
  if (left.kind !== right.kind) return false;
  if (left.kind === "RATIO" && right.kind === "RATIO") {
    return (
      left.ratio.length === right.ratio.length &&
      left.ratio.every((value, index) => value === right.ratio[index])
    );
  }
  return (
    left.kind === "RATIONAL" &&
    right.kind === "RATIONAL" &&
    equalRational(left.exact, right.exact)
  );
}

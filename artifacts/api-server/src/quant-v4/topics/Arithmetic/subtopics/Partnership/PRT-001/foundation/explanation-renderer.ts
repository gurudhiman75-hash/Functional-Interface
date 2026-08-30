import { subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import type {
  Prt001PilotParameters,
  Prt001Solution,
  Prt001TaskAnswer,
} from "./types";

function formatWhole(value: bigint): string {
  return new Intl.NumberFormat("en-IN").format(Number(value));
}

function renderLocalizedExplanation(
  parameters: Prt001PilotParameters,
  solution: Prt001Solution,
  answer: Prt001TaskAnswer,
): string[] {
  const contributions = solution.timeline.weights
    .map(
      (item) =>
        `${item.partnerId}: ${formatWhole(item.effectiveCapital.numerator)}`,
    )
    .join(", ");
  const ratio = solution.normalizedRatio.join(":");
  const allocation = solution.pool.executions
    .map((item) => `${item.kind} ${formatPrt001Money(item.amount)}`)
    .join(", ");
  if (parameters.language === "hi") {
    return [
      `पूंजी × समय से प्रभावी योगदान ${contributions} हैं; इसलिए लाभ अनुपात ${ratio} है।`,
      allocation
        ? `पहले ${allocation} लागू करने पर वितरण योग्य राशि ${formatPrt001Money(solution.pool.distributablePool)} है।`
        : "लाभ को इसी प्रभावी योगदान अनुपात में बाँटा जाता है।",
      `प्रश्न में दी गई शर्त लागू करने पर आवश्यक उत्तर ${answer.display} है।`,
    ];
  }
  return [
    `ਪੂੰਜੀ × ਸਮੇਂ ਤੋਂ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨ ${contributions} ਹਨ; ਇਸ ਲਈ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ${ratio} ਹੈ।`,
    allocation
      ? `ਪਹਿਲਾਂ ${allocation} ਲਾਗੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਵੰਡਣ ਯੋਗ ਰਕਮ ${formatPrt001Money(solution.pool.distributablePool)} ਹੈ।`
      : "ਮੁਨਾਫ਼ਾ ਇਸੇ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।",
    `ਸਵਾਲ ਦੀ ਦਿੱਤੀ ਸ਼ਰਤ ਲਾਗੂ ਕਰਨ ਤੇ ਲੋੜੀਂਦਾ ਜਵਾਬ ${answer.display} ਹੈ।`,
  ];
}

export function renderPrt001Explanation(input: {
  parameters: Prt001PilotParameters;
  solution: Prt001Solution;
  answer: Prt001TaskAnswer;
}): string[] {
  const { parameters, solution, answer } = input;
  const [partnerA, partnerB] = parameters.state.partners;
  const [segmentA, segmentB] = parameters.state.partners.map(
    (partner) => partner.capitalSegments[0]!,
  );
  const durationA = subtractRational(segmentA!.end, segmentA!.start);
  const durationB = subtractRational(segmentB!.end, segmentB!.start);
  const [weightA, weightB] = solution.timeline.weights.map(
    (item) => item.effectiveCapital,
  );
  const ratio = solution.normalizedRatio.join(":");
  const contributionLine = `${partnerA!.partnerId}'s effective contribution is ${formatPrt001Money(segmentA!.capital)} × ${formatPrt001Duration(durationA)} = ${formatWhole(weightA!.numerator)}, while ${partnerB!.partnerId}'s is ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(durationB)} = ${formatWhole(weightB!.numerator)}.`;
  if (parameters.language !== "en") {
    return renderLocalizedExplanation(parameters, solution, answer);
  }

  switch (parameters.entry.solveMode) {
    case "findProfitRatioFromCapitals":
      return [
        "Both partners invested for the same period, so the common time factor cancels.",
        `Their profit ratio is therefore ${parameters.renderVariables.capitalA}:${parameters.renderVariables.capitalB} = ${ratio}.`,
        `Hence, the required ratio is ${answer.display}.`,
      ];
    case "findProfitRatioFromCapitalAndDuration":
      return [
        contributionLine,
        `Reducing the two effective contributions gives ${ratio}.`,
        `Hence, the required ratio is ${answer.display}.`,
      ];
    case "findPartnerShareFromTotalProfitAndCapitals":
    case "findPartnerShareFromTotalProfitCapitalDuration": {
      const targetIndex =
        parameters.targetPartnerId === partnerB!.partnerId ? 1 : 0;
      const targetPart = solution.normalizedRatio[targetIndex]!;
      const totalParts =
        solution.normalizedRatio[0]! + solution.normalizedRatio[1]!;
      return [
        parameters.entry.cpId === "PRT-CP-001"
          ? `Equal investment periods make the profit ratio ${ratio}.`
          : `${contributionLine} Thus the profit ratio is ${ratio}.`,
        `${parameters.targetPartnerId} receives ${targetPart}/${totalParts} of ${parameters.renderVariables.totalProfit}, which is ${answer.display}.`,
        `Therefore, ${parameters.targetPartnerId}'s share is ${answer.display}.`,
      ];
    }
    case "findTotalProfitFromPartnerShareAndCapitals": {
      const targetIndex =
        parameters.targetPartnerId === partnerB!.partnerId ? 1 : 0;
      const targetPart = solution.normalizedRatio[targetIndex]!;
      const totalParts =
        solution.normalizedRatio[0]! + solution.normalizedRatio[1]!;
      return [
        `Because the periods are equal, the profit ratio is ${ratio}.`,
        `${parameters.targetPartnerId}'s ${targetPart} parts equal ${parameters.renderVariables.knownShare}, so all ${totalParts} parts equal ${answer.display}.`,
        `Therefore, the total profit was ${answer.display}.`,
      ];
    }
    case "findProfitDifferenceFromTotalProfitAndCapitals": {
      const differenceParts =
        solution.normalizedRatio[0]! > solution.normalizedRatio[1]!
          ? solution.normalizedRatio[0]! - solution.normalizedRatio[1]!
          : solution.normalizedRatio[1]! - solution.normalizedRatio[0]!;
      const totalParts =
        solution.normalizedRatio[0]! + solution.normalizedRatio[1]!;
      return [
        `Equal periods make the profit ratio ${ratio}.`,
        `The difference is ${differenceParts} out of ${totalParts} ratio parts of ${parameters.renderVariables.totalProfit}, which equals ${answer.display}.`,
        `Therefore, the difference between their shares is ${answer.display}.`,
      ];
    }
    case "findUnknownCapitalFromShareRatioAndDurations":
      return [
        `Profit ratio equals capital × time, so ${partnerA!.partnerId}'s capital × ${formatPrt001Duration(durationA)} must be in the ratio ${ratio} to ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(durationB)}.`,
        `Solving this contribution equation gives ${partnerA!.partnerId}'s capital as ${answer.display}.`,
        `Therefore, the required capital is ${answer.display}.`,
      ];
    case "findUnknownDurationFromShareRatioAndCapitals":
      return [
        `Profit ratio equals capital × time, so ${formatPrt001Money(segmentA!.capital)} × the unknown time must be in the ratio ${ratio} to ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(durationB)}.`,
        `Solving this contribution equation gives ${partnerA!.partnerId}'s investment period as ${answer.display}.`,
        `Therefore, the required duration is ${answer.display}.`,
      ];
    case "findProfitRatioWhenPartnerJoinsLater":
    case "findProfitRatioWithMultipleStaggeredJoins":
    case "findProfitRatioAfterCapitalAddition":
    case "findThreePartnerProfitRatio":
      return [
        `The effective capital-time contributions are ${solution.timeline.weights.map((item) => `${item.partnerId}: ${formatWhole(item.effectiveCapital.numerator)}`).join(", ")}.`,
        `Reducing these contributions gives the profit ratio ${ratio}.`,
        `Hence, the required ratio is ${answer.display}.`,
      ];
    case "findShareWhenPartnerLeavesEarly":
    case "findShareAfterCapitalWithdrawal":
    case "findMultiPartnerSharesFromTotalProfit":
    case "findOtherPartnerShareWithPercentCommission":
    case "findSharesAfterCharityDeduction":
    case "findShareWithLateJoinAndCapitalChange":
    case "findMultiPartnerSharesWithStaggeredEvents": {
      const allocationText = solution.pool.executions.length
        ? ` After the stated allocation, ${formatPrt001Money(solution.pool.distributablePool)} remains for ratio distribution.`
        : "";
      return [
        `The capital-time contributions reduce to ${ratio}.${allocationText}`,
        `${parameters.targetPartnerId}'s share from the distributable pool is ${answer.display}.`,
        `Therefore, the required share is ${answer.display}.`,
      ];
    }
    case "findTotalProfitFromOnePartnerShareInMultiPartnerSystem":
      return [
        `The three effective contributions reduce to ${ratio}.`,
        `${parameters.targetPartnerId}'s known share represents its ratio parts, so scaling to all parts gives ${answer.display}.`,
        `Therefore, the total profit is ${answer.display}.`,
      ];
    case "findActivePartnerTotalReceiptWithFixedSalary":
    case "findShareWithDynamicCapitalAndWorkingPartnerSalary": {
      const allocation = solution.pool.executions[0]!;
      return [
        `${formatPrt001Money(allocation.amount)} is paid first, leaving ${formatPrt001Money(solution.pool.distributablePool)} for distribution in the ${ratio} contribution ratio.`,
        `${parameters.targetPartnerId}'s ratio share is then added to the prior payment.`,
        `Therefore, the total receipt is ${answer.display}.`,
      ];
    }
    case "findUnknownJoinTimeFromProfitRatio":
    case "findUnknownAddedCapitalFromProfitRatio":
    case "findEventTimeForEqualProfitShares":
    case "findUnknownCapitalInThreePartnerSystem":
    case "findUnknownSalaryFromFinalPartnerReceipts":
    case "findUnknownJoinTimeWithPreDistributionDeduction":
      return [
        `Translate the stated profit or final-receipt condition into the effective-contribution ratio ${ratio}.`,
        "Substituting the known capitals, active periods, and any prior allocation leaves one linear unknown.",
        `Solving and substituting back gives ${answer.display}.`,
      ];
    default:
      throw new Error(`baseline explanation renderer does not support ${parameters.entry.solveMode}`);
  }
}

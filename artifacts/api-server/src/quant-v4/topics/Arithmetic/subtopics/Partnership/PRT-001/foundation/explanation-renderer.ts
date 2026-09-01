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
    case "findUnknownJoinTimeFromProfitRatio": {
      const totalDuration = parameters.state.totalDuration;
      return [
        `${partnerA!.partnerId} contributes ${formatPrt001Money(segmentA!.capital)} × ${formatPrt001Duration(totalDuration)}. If ${partnerB!.partnerId} joins after x months, its active time is ${formatPrt001Duration(totalDuration)} − x.`,
        `So ${formatPrt001Money(segmentA!.capital)} × ${formatPrt001Duration(totalDuration)} : ${formatPrt001Money(segmentB!.capital)} × (${formatPrt001Duration(totalDuration)} − x) = ${ratio}. Solving gives x = ${answer.display}.`,
        `Therefore, ${partnerB!.partnerId} joined after ${answer.display}.`,
      ];
    }
    case "findUnknownAddedCapitalFromProfitRatio": {
      const [firstA, secondA] = partnerA!.capitalSegments;
      const changeTime = firstA!.end;
      const remainingTime = subtractRational(parameters.state.totalDuration, changeTime);
      return [
        `${partnerA!.partnerId}'s weight is ${formatPrt001Money(firstA!.capital)} × ${formatPrt001Duration(changeTime)} + (${formatPrt001Money(firstA!.capital)} + x) × ${formatPrt001Duration(remainingTime)}.`,
        `${partnerB!.partnerId}'s full-period weight is ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(parameters.state.totalDuration)}; setting the two weights in profit ratio ${ratio} gives x = ${answer.display}.`,
        `Therefore, ${partnerA!.partnerId} added ${answer.display}.`,
      ];
    }
    case "findEventTimeForEqualProfitShares": {
      const [firstA, secondA] = partnerA!.capitalSegments;
      const totalDuration = parameters.state.totalDuration;
      return [
        `Equal profit shares require equal capital-time weights. If the change occurs after x months, ${partnerA!.partnerId}'s weight is ${formatPrt001Money(firstA!.capital)} × x + ${formatPrt001Money(secondA!.capital)} × (${formatPrt001Duration(totalDuration)} − x).`,
        `${partnerB!.partnerId}'s weight is ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(totalDuration)}. Equating the two gives x = ${answer.display}.`,
        `Therefore, the capital change occurred after ${answer.display}.`,
      ];
    }
    case "findUnknownCapitalInThreePartnerSystem": {
      const partnerC = parameters.state.partners[2]!;
      const segmentC = partnerC.capitalSegments[0]!;
      const durationC = subtractRational(segmentC.end, segmentC.start);
      const ratioA = solution.normalizedRatio[0]!;
      const ratioC = solution.normalizedRatio[2]!;
      return [
        `${partnerA!.partnerId}'s known contribution is ${formatPrt001Money(segmentA!.capital)} × ${formatPrt001Duration(durationA)} = ${formatWhole(solution.timeline.weights[0]!.effectiveCapital.numerator)}.`,
        `Since ${partnerA!.partnerId}:${partnerC.partnerId} profit parts are ${ratioA}:${ratioC}, x × ${formatPrt001Duration(durationC)} must have the same ratio to that known contribution. Solving gives x = ${answer.display}.`,
        `Therefore, ${partnerC.partnerId}'s capital is ${answer.display}.`,
      ];
    }
    case "findUnknownSalaryFromFinalPartnerReceipts": {
      const partA = solution.normalizedRatio[0]!;
      const totalParts = solution.normalizedRatio.reduce((sum, part) => sum + part, 0n);
      return [
        `Equal investment periods make the residual-profit ratio ${ratio}. Let the working-partner salary be s; then ${partnerA!.partnerId}'s final receipt is s + ${partA}/${totalParts} × (${parameters.renderVariables.totalProfit} − s).`,
        `This final receipt is given as ${parameters.renderVariables.finalReceipt}. Solving the equation gives s = ${answer.display}.`,
        `Therefore, the salary is ${answer.display}.`,
      ];
    }
    case "findUnknownJoinTimeWithPreDistributionDeduction": {
      const totalDuration = parameters.state.totalDuration;
      const deduction = solution.pool.executions[0]?.amount;
      return [
        `First deduct ${deduction ? formatPrt001Money(deduction) : String(parameters.renderVariables.deduction)} from ${parameters.renderVariables.totalProfit}; ${formatPrt001Money(solution.pool.distributablePool)} remains for profit sharing.`,
        `${partnerB!.partnerId}'s known share ${parameters.renderVariables.knownShare} fixes its fraction of that pool. With ${partnerA!.partnerId} invested for ${formatPrt001Duration(totalDuration)} and ${partnerB!.partnerId} contributing ${formatPrt001Money(segmentB!.capital)} × (${formatPrt001Duration(totalDuration)} − x), the capital-time equation gives x = ${answer.display}.`,
        `Therefore, ${partnerB!.partnerId} joined after ${answer.display}.`,
      ];
    }
    default:
      throw new Error(`baseline explanation renderer does not support ${parameters.entry.solveMode}`);
  }
}

import { formatPrt001Money } from "./parameter-generator";
import type { Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer } from "./types";

function weightLine(solution: Prt001Solution): string {
  return solution.timeline.weights
    .map((item) => `${item.partnerId}: ${item.effectiveCapital.numerator.toString()}`)
    .join(", ");
}

export function renderPrt001E1Explanation(input: {
  parameters: Prt001PilotParameters;
  solution: Prt001Solution;
  answer: Prt001TaskAnswer;
}): string[] {
  const { parameters, solution, answer } = input;
  const ratio = solution.normalizedRatio.join(":");
  const weights = weightLine(solution);

  if (parameters.language === "hi") {
    return [
      `हर साझेदार की वास्तविक सक्रिय अवधि और उस अवधि की पूंजी से पूंजी-माह निकालते हैं: ${weights}।`,
      solution.pool.executions.length
        ? `दिए गए भुगतान/कटौती क्रम से लागू करने के बाद बाँटने योग्य लाभ ${formatPrt001Money(solution.pool.distributablePool)} है और प्रभावी अनुपात ${ratio} है।`
        : `इन प्रभावी योगदानों का अनुपात ${ratio} है; प्रश्न की अज्ञात राशि या समय इसी संबंध से निकाला जाता है।`,
      `अतः आवश्यक उत्तर ${answer.display} है।`,
    ];
  }
  if (parameters.language === "pa") {
    return [
      `ਹਰ ਸਾਥੀ ਦੀ ਅਸਲ ਸਰਗਰਮ ਮਿਆਦ ਅਤੇ ਉਸ ਮਿਆਦ ਦੀ ਪੂੰਜੀ ਤੋਂ ਪੂੰਜੀ-ਮਹੀਨੇ ਕੱਢਦੇ ਹਾਂ: ${weights}।`,
      solution.pool.executions.length
        ? `ਦਿੱਤੇ ਭੁਗਤਾਨ/ਕਟੌਤੀ ਕ੍ਰਮ ਅਨੁਸਾਰ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਵੰਡਣ ਯੋਗ ਮੁਨਾਫ਼ਾ ${formatPrt001Money(solution.pool.distributablePool)} ਹੈ ਅਤੇ ਪ੍ਰਭਾਵੀ ਅਨੁਪਾਤ ${ratio} ਹੈ।`
        : `ਇਨ੍ਹਾਂ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨਾਂ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ; ਸਵਾਲ ਦੀ ਅਣਜਾਣ ਰਕਮ ਜਾਂ ਸਮਾਂ ਇਸੇ ਸੰਬੰਧ ਤੋਂ ਨਿਕਲਦਾ ਹੈ।`,
      `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${answer.display} ਹੈ।`,
    ];
  }

  switch (parameters.entry.solveMode) {
    case "findProfitRatioWithJoinAndLeaveEvents":
      return [
        "Use only the months for which each partner actually had capital in the business: the early leaver stops contributing at the leave month and the late entrant starts at the join month.",
        `The resulting capital-month contributions are ${weights}, which reduce to ${ratio}.`,
        `Therefore, the profit-sharing ratio is ${answer.display}.`,
      ];
    case "findUnknownLeaveTimeFromProfitRatio":
      return [
        `Let ${parameters.partnerA}'s active period be x months. Profit ratio = capital × time, while ${parameters.partnerB} remains invested for the full year.`,
        `Matching the stated profit ratio to the capital-time weights gives x = ${answer.display}.`,
        `So ${parameters.partnerA} left after ${answer.display}.`,
      ];
    case "findUnknownCapitalOfLateJoiningPartner":
      return [
        `${parameters.partnerB} contributes only from the stated joining month to year-end, so its unknown capital is multiplied by that remaining duration.`,
        `Equating this weight with the stated profit ratio against ${parameters.partnerA}'s full-year weight gives the required capital ${answer.display}.`,
        `Therefore, ${parameters.partnerB} invested ${answer.display}.`,
      ];
    case "findProfitRatioAfterPercentageCapitalIncrease":
      return [
        `Split ${parameters.partnerA}'s investment at the percentage-change month: old capital before the change and increased capital afterwards.`,
        `Adding the two capital-month segments and comparing with ${parameters.partnerB}'s full-period contribution gives ${weights} → ${ratio}.`,
        `Hence, the profit ratio is ${answer.display}.`,
      ];
    case "findProfitRatioWithChangesForMultiplePartners":
      return [
        "Both partners have piecewise capital histories, so calculate each segment separately rather than applying either changed capital to the whole year.",
        `The summed effective contributions are ${weights}, reducing to ${ratio}.`,
        `Therefore, the required ratio is ${answer.display}.`,
      ];
    case "findSharesFromCapitalMultiplesAndDurations":
      return [
        "First convert the stated capital multiples into actual capitals, then multiply each by its own investment duration.",
        `The three effective contributions reduce to ${ratio}; ${parameters.targetPartnerId} receives its ratio fraction of ${parameters.renderVariables.totalProfit}.`,
        `Thus ${parameters.targetPartnerId}'s share is ${answer.display}.`,
      ];
    case "findTotalProfitFromActivePartnerFinalReceipt":
      return [
        `The working partner's salary is paid first. The remainder is divided in the ${ratio} capital ratio, and ${parameters.partnerA}'s ratio share is added back to the salary.`,
        `Working backwards from the stated final receipt reconstructs the gross profit before salary.`,
        `Therefore, the gross profit was ${answer.display}.`,
      ];
    case "findPartnerReceiptsWithMultipleOrderedAllocations":
      return [
        `Apply the reserve first and then compute the commission on the post-reserve pool; the order matters. This leaves ${formatPrt001Money(solution.pool.distributablePool)} for ratio distribution.`,
        `${parameters.targetPartnerId}'s distributed share is combined with any commission already credited to that partner.`,
        `Hence, the final receipt is ${answer.display}.`,
      ];
    case "findProfitRatioWithJoinLeaveAndCapitalChange":
      return [
        "Build the timeline in three pieces: capital before the change, changed capital until the leaving event, and the other partner's late-join interval.",
        `The valid capital-month totals are ${weights}; reducing them gives ${ratio}.`,
        `Therefore, the profit ratio is ${answer.display}.`,
      ];
    case "findUnknownCapitalWithStaggeredParticipation":
      return [
        `Use the known start/join times to form the first two capital-time weights. ${parameters.partnerC}'s unknown capital is multiplied only by the months remaining after that partner joins.`,
        `Matching all three weights to the stated profit ratio gives ${parameters.partnerC}'s capital as ${answer.display}.`,
        `Therefore, the required capital is ${answer.display}.`,
      ];
    default:
      throw new Error(`E1 explanation renderer does not support ${parameters.entry.solveMode}`);
  }
}

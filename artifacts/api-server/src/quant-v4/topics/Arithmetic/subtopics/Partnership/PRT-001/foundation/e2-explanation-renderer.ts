import { subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import type {
  Prt001PilotParameters,
  Prt001Solution,
  Prt001TaskAnswer,
} from "./types";

function contributions(solution: Prt001Solution): string {
  return solution.timeline.weights
    .map((item) => `${item.partnerId}: ${item.effectiveCapital.numerator}`)
    .join(", ");
}

function localizedFinal(
  parameters: Prt001PilotParameters,
  answer: Prt001TaskAnswer,
): string {
  if (parameters.language === "hi") return `अतः आवश्यक उत्तर ${answer.display} है।`;
  if (parameters.language === "pa") return `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${answer.display} ਹੈ।`;
  return `Therefore, the required answer is ${answer.display}.`;
}

export function renderPrt001E2Explanation(input: {
  parameters: Prt001PilotParameters;
  solution: Prt001Solution;
  answer: Prt001TaskAnswer;
}): string[] {
  const { parameters, solution, answer } = input;
  const ratio = solution.normalizedRatio.join(":");
  const final = localizedFinal(parameters, answer);

  if (parameters.language === "hi") {
    switch (parameters.entry.solveMode) {
      case "findTotalProfitFromShareDifferenceAndCapitals":
        return [
          `समान अवधि के कारण लाभ अनुपात पूंजी अनुपात के बराबर है, अर्थात ${ratio}।`,
          `लाभांशों का अंतर अनुपात के अंतर वाले भागों के बराबर है; उसी अनुपात से सभी भागों का मूल्य निकालने पर कुल लाभ ${answer.display} मिलता है।`,
          final,
        ];
      case "findCapitalRatioFromProfitRatioAndTimeRatio":
        return [
          "लाभ अनुपात = पूंजी अनुपात × समय अनुपात।",
          "इसलिए प्रत्येक भागीदार के लाभ-भाग को उसके समय-भाग से विभाजित करके पूंजी अनुपात मिलता है।",
          final,
        ];
      case "findTimeRatioFromProfitRatioAndCapitalRatio":
        return [
          "लाभ अनुपात = पूंजी अनुपात × समय अनुपात।",
          "इसलिए प्रत्येक लाभ-भाग को संबंधित पूंजी-भाग से विभाजित करने पर समय अनुपात मिलता है।",
          final,
        ];
      case "findUnknownCapitalChangeTimeFromProfitRatio":
        return [
          `दिए गए लाभ अनुपात से ${parameters.partnerA} का आवश्यक कुल पूंजी-समय योगदान तय होता है।`,
          "पहली पूंजी × अज्ञात महीनों + बदली हुई पूंजी × शेष महीनों का समीकरण बनाकर परिवर्तन का समय निकाला जाता है।",
          final,
        ];
      case "findUnknownDurationInThreePartnerSystem":
        return [
          `तीनों प्रभावी योगदान ${contributions(solution)} हैं और उनका अनुपात ${ratio} है।`,
          `${parameters.partnerC} के आवश्यक योगदान को उसकी पूंजी से विभाजित करने पर निवेश अवधि ${answer.display} मिलती है।`,
          final,
        ];
      case "findTotalProfitFromSleepingPartnerReceipt":
        return [
          `पहले कार्यकारी भागीदार का वेतन घटता है; बची राशि ${ratio} के पूंजी अनुपात में बाँटी जाती है।`,
          "निष्क्रिय भागीदार की दी हुई प्राप्ति से वितरण योग्य राशि वापस निकालकर वेतन जोड़ने पर सकल लाभ मिलता है।",
          final,
        ];
      case "findTotalProfitFromMixedTimelineFinalReceipt":
        return [
          `पूंजी बदलने के कारण प्रभावी योगदान अनुपात ${ratio} है।`,
          "कार्यकारी भागीदार की अंतिम प्राप्ति में से वेतन हटाकर उसका अनुपातिक लाभांश मिलता है; उससे पूरा वितरण योग्य लाभ और फिर सकल लाभ निकाला जाता है।",
          final,
        ];
      default:
        return [
          `पूंजी × समय के प्रभावी योगदान ${contributions(solution)} हैं; इनसे अनुपात ${ratio} मिलता है।`,
          solution.pool.executions.length
            ? `निर्धारित वेतन/कमीशन/कटौती को क्रम से लागू करने के बाद वितरण योग्य राशि ${formatPrt001Money(solution.pool.distributablePool)} है।`
            : "प्रश्न की घटना-रेखा के अनुसार प्रत्येक पूंजी खंड को उसकी सक्रिय अवधि से गुणा किया जाता है।",
          final,
        ];
    }
  }

  if (parameters.language === "pa") {
    switch (parameters.entry.solveMode) {
      case "findTotalProfitFromShareDifferenceAndCapitals":
        return [
          `ਇੱਕੋ ਸਮੇਂ ਕਰਕੇ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਪੂੰਜੀ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੈ, ਅਰਥਾਤ ${ratio}।`,
          `ਹਿੱਸਿਆਂ ਦਾ ਫਰਕ ਅਨੁਪਾਤ ਦੇ ਫਰਕ ਵਾਲੇ ਭਾਗਾਂ ਦੇ ਬਰਾਬਰ ਹੈ; ਸਾਰੇ ਭਾਗਾਂ ਦੀ ਕੀਮਤ ਕੱਢਣ ਤੇ ਕੁੱਲ ਮੁਨਾਫ਼ਾ ${answer.display} ਮਿਲਦਾ ਹੈ।`,
          final,
        ];
      case "findCapitalRatioFromProfitRatioAndTimeRatio":
        return [
          "ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ = ਪੂੰਜੀ ਅਨੁਪਾਤ × ਸਮਾਂ ਅਨੁਪਾਤ।",
          "ਹਰ ਮੁਨਾਫ਼ਾ-ਭਾਗ ਨੂੰ ਉਸਦੇ ਸਮਾਂ-ਭਾਗ ਨਾਲ ਵੰਡਣ ਤੇ ਪੂੰਜੀ ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ।",
          final,
        ];
      case "findTimeRatioFromProfitRatioAndCapitalRatio":
        return [
          "ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ = ਪੂੰਜੀ ਅਨੁਪਾਤ × ਸਮਾਂ ਅਨੁਪਾਤ।",
          "ਹਰ ਮੁਨਾਫ਼ਾ-ਭਾਗ ਨੂੰ ਸੰਬੰਧਿਤ ਪੂੰਜੀ-ਭਾਗ ਨਾਲ ਵੰਡਣ ਤੇ ਸਮਾਂ ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ।",
          final,
        ];
      case "findUnknownCapitalChangeTimeFromProfitRatio":
        return [
          `ਦਿੱਤੇ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਤੋਂ ${parameters.partnerA} ਦਾ ਲੋੜੀਂਦਾ ਕੁੱਲ ਪੂੰਜੀ-ਸਮਾਂ ਯੋਗਦਾਨ ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ।`,
          "ਪਹਿਲੀ ਪੂੰਜੀ × ਅਣਜਾਣ ਮਹੀਨੇ + ਬਦਲੀ ਪੂੰਜੀ × ਬਾਕੀ ਮਹੀਨੇ ਦਾ ਸਮੀਕਰਨ ਹੱਲ ਕਰਕੇ ਬਦਲਾਅ ਦਾ ਸਮਾਂ ਮਿਲਦਾ ਹੈ।",
          final,
        ];
      case "findUnknownDurationInThreePartnerSystem":
        return [
          `ਤਿੰਨਾਂ ਦੇ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨ ${contributions(solution)} ਹਨ ਅਤੇ ਅਨੁਪਾਤ ${ratio} ਹੈ।`,
          `${parameters.partnerC} ਦੇ ਲੋੜੀਂਦੇ ਯੋਗਦਾਨ ਨੂੰ ਉਸਦੀ ਪੂੰਜੀ ਨਾਲ ਵੰਡਣ ਤੇ ਨਿਵੇਸ਼ ਸਮਾਂ ${answer.display} ਮਿਲਦਾ ਹੈ।`,
          final,
        ];
      case "findTotalProfitFromSleepingPartnerReceipt":
        return [
          `ਪਹਿਲਾਂ ਕੰਮਕਾਜੀ ਭਾਗੀਦਾਰ ਦੀ ਤਨਖਾਹ ਘਟਦੀ ਹੈ; ਬਾਕੀ ਰਕਮ ${ratio} ਦੇ ਪੂੰਜੀ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਦੀ ਹੈ।`,
          "ਸੁੱਤੇ ਭਾਗੀਦਾਰ ਦੀ ਦਿੱਤੀ ਪ੍ਰਾਪਤੀ ਤੋਂ ਵੰਡਣ ਯੋਗ ਰਕਮ ਵਾਪਸ ਕੱਢ ਕੇ ਤਨਖਾਹ ਜੋੜਣ ਤੇ ਸਕਲ ਮੁਨਾਫ਼ਾ ਮਿਲਦਾ ਹੈ।",
          final,
        ];
      case "findTotalProfitFromMixedTimelineFinalReceipt":
        return [
          `ਪੂੰਜੀ ਬਦਲਣ ਕਰਕੇ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ${ratio} ਹੈ।`,
          "ਅੰਤਿਮ ਪ੍ਰਾਪਤੀ ਵਿੱਚੋਂ ਤਨਖਾਹ ਹਟਾ ਕੇ ਅਨੁਪਾਤਿਕ ਮੁਨਾਫ਼ਾ-ਹਿੱਸਾ ਮਿਲਦਾ ਹੈ; ਉਸ ਤੋਂ ਪੂਲ ਅਤੇ ਫਿਰ ਸਕਲ ਮੁਨਾਫ਼ਾ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ।",
          final,
        ];
      default:
        return [
          `ਪੂੰਜੀ × ਸਮੇਂ ਦੇ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨ ${contributions(solution)} ਹਨ; ਅਨੁਪਾਤ ${ratio} ਬਣਦਾ ਹੈ।`,
          solution.pool.executions.length
            ? `ਤਨਖਾਹ/ਕਮਿਸ਼ਨ/ਕਟੌਤੀ ਕ੍ਰਮ ਨਾਲ ਲਾਗੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਵੰਡਣ ਯੋਗ ਰਕਮ ${formatPrt001Money(solution.pool.distributablePool)} ਹੈ।`
            : "ਘਟਨਾ-ਰੇਖਾ ਅਨੁਸਾਰ ਹਰ ਪੂੰਜੀ ਖੰਡ ਨੂੰ ਉਸਦੀ ਸਰਗਰਮ ਮਿਆਦ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
          final,
        ];
    }
  }

  switch (parameters.entry.solveMode) {
    case "findTotalProfitFromShareDifferenceAndCapitals":
      return [
        `Equal periods make the profit ratio the capital ratio, ${ratio}.`,
        `The stated share difference represents the difference in ratio parts; scaling from those parts to all parts gives total profit ${answer.display}.`,
        final,
      ];
    case "findCapitalRatioFromProfitRatioAndTimeRatio":
      return [
        "Profit ratio equals capital ratio multiplied by time ratio.",
        "Divide each profit-ratio part by its corresponding time-ratio part and reduce the results.",
        final,
      ];
    case "findTimeRatioFromProfitRatioAndCapitalRatio":
      return [
        "Profit ratio equals capital ratio multiplied by time ratio.",
        "Divide each profit-ratio part by its corresponding capital-ratio part and reduce the results.",
        final,
      ];
    case "findProfitRatioWithMultipleChangesForOnePartner":
      return [
        `${parameters.partnerA}'s capital must be split into all three stated time segments; ${parameters.partnerB}'s capital stays unchanged.`,
        `The resulting effective contributions are ${contributions(solution)}, which reduce to ${ratio}.`,
        final,
      ];
    case "findUnknownCapitalChangeTimeFromProfitRatio":
      return [
        `The stated profit ratio fixes ${parameters.partnerA}'s required total capital-time contribution relative to ${parameters.partnerB}.`,
        `If the change occurred after x months, first capital × x + changed capital × (12 − x) must equal that required contribution; solving gives ${answer.display}.`,
        final,
      ];
    case "findFourPartnerProfitRatio":
      return [
        `Compute capital × time for all four partners: ${contributions(solution)}.`,
        `Reducing the four effective contributions gives ${ratio}.`,
        final,
      ];
    case "findUnknownDurationInThreePartnerSystem":
      return [
        `The three effective contributions are ${contributions(solution)} and reduce to ${ratio}.`,
        `${parameters.partnerC}'s required contribution divided by ${parameters.partnerC}'s capital gives the missing investment period ${answer.display}.`,
        final,
      ];
    case "findCapitalRatioFromPartnerShareRelations":
      return [
        "Each profit-ratio part represents capital × time for that partner.",
        "Divide each profit part by its stated duration and reduce the three results to recover the capital ratio.",
        final,
      ];
    case "findTotalProfitFromSleepingPartnerReceipt":
      return [
        `The working partner's salary is paid first; the remainder is divided in the ${ratio} capital ratio.`,
        `Use the sleeping partner's known receipt to reconstruct the whole distributable pool, then add the salary back to obtain gross profit ${answer.display}.`,
        final,
      ];
    case "findPartnerReceiptWithSalaryAndDeduction":
      return [
        `Apply the stated salary and deduction first, leaving ${formatPrt001Money(solution.pool.distributablePool)} for ratio distribution.`,
        `Divide that pool in the ${ratio} ratio and add any salary already paid to the target partner.`,
        final,
      ];
    case "findShareWithDynamicCapitalAndPercentCommission":
      return [
        `The capital change produces effective contributions ${contributions(solution)}, giving ratio ${ratio}.`,
        `Pay the gross-profit commission first; divide the remaining ${formatPrt001Money(solution.pool.distributablePool)} by the capital-time ratio and include commission in the recipient's final receipt.`,
        final,
      ];
    case "findUnknownJoinTimeWithCapitalChangeHistory":
      return [
        `${parameters.partnerA}'s changing capital fixes a known reference contribution across the year.`,
        `Use the stated profit ratio to obtain ${parameters.partnerB}'s required capital-time contribution; dividing by ${parameters.renderVariables.capitalB} gives active months, so joining time is the remaining part of the year: ${answer.display}.`,
        final,
      ];
    case "findTotalProfitFromMixedTimelineFinalReceipt":
      return [
        `The capital history gives contribution ratio ${ratio}.`,
        `Remove the fixed salary from ${parameters.partnerA}'s final receipt, scale that distributed share to the full profit pool using ${ratio}, then add salary back; gross profit is ${answer.display}.`,
        final,
      ];
    case "findDifferenceBetweenFinalReceiptsInMixedSystem":
      return [
        `Capital changes and the later join give effective contributions ${contributions(solution)}, reducing to ${ratio}.`,
        `After paying salary first, split the remainder by ${ratio}; compare the two final receipts after salary is restored to ${parameters.partnerA}.`,
        final,
      ];
    default:
      throw new Error(`E2 explanation does not support ${parameters.entry.solveMode}`);
  }
}

import { formatRatio, formatRational } from "./math";
import type { Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer } from "./types";

export function renderPrt001E8Explanation(input: {
  parameters: Prt001PilotParameters;
  solution: Prt001Solution;
  answer: Prt001TaskAnswer;
}): string[] {
  const { parameters, solution, answer } = input;
  if (parameters.questionLanguageId === "PRT-QL-104") {
    const ratio = formatRatio(solution.timeline.weights.map((item) => item.effectiveCapital));
    const equalSplitPercent = parameters.renderVariables.equalSplitPercent;
    const capitalSplitPercent = parameters.renderVariables.capitalSplitPercent;
    const shareDifference = parameters.renderVariables.shareDifference;
    if (parameters.language === "hi") {
      return [
        `${equalSplitPercent}% लाभ बराबर बाँटने से दोनों की उस हिस्से की प्राप्ति समान है, इसलिए अंतिम अंतर केवल शेष ${capitalSplitPercent}% से बनता है।`,
        `समान अवधि के कारण उस शेष लाभ का अनुपात पूंजी अनुपात ${ratio} है। इस अनुपात के भाग-अंतर को ${shareDifference} के बराबर रखकर शेष लाभ और फिर पूरा लाभ निकाला जाता है।`,
        `अतः कुल लाभ ${answer.display} है।`,
      ];
    }
    if (parameters.language === "pa") {
      return [
        `${equalSplitPercent}% ਮੁਨਾਫ਼ਾ ਬਰਾਬਰ ਵੰਡਣ ਨਾਲ ਦੋਵਾਂ ਦੀ ਉਸ ਹਿੱਸੇ ਦੀ ਪ੍ਰਾਪਤੀ ਇੱਕੋ ਹੈ, ਇਸ ਲਈ ਅੰਤਿਮ ਫਰਕ ਸਿਰਫ਼ ਬਾਕੀ ${capitalSplitPercent}% ਤੋਂ ਬਣਦਾ ਹੈ।`,
        `ਮਿਆਦ ਇੱਕੋ ਹੋਣ ਕਰਕੇ ਉਸ ਬਾਕੀ ਮੁਨਾਫ਼ੇ ਦਾ ਅਨੁਪਾਤ ਪੂੰਜੀ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਇਸ ਅਨੁਪਾਤ ਦੇ ਭਾਗ-ਫਰਕ ਨੂੰ ${shareDifference} ਦੇ ਬਰਾਬਰ ਰੱਖ ਕੇ ਬਾਕੀ ਮੁਨਾਫ਼ਾ ਅਤੇ ਫਿਰ ਪੂਰਾ ਮੁਨਾਫ਼ਾ ਕੱਢਦੇ ਹਾਂ।`,
        `ਇਸ ਲਈ ਕੁੱਲ ਮੁਨਾਫ਼ਾ ${answer.display} ਹੈ।`,
      ];
    }
    return [
      `${equalSplitPercent}% of the profit is shared equally, so that part contributes nothing to the difference in final receipts; the difference comes only from the remaining ${capitalSplitPercent}%.`,
      `Equal investment periods make the remaining-profit ratio the capital ratio ${ratio}. Match its ratio-part difference to ${shareDifference}, recover that residual pool, then scale back to 100% of profit.`,
      `Therefore, the total profit is ${answer.display}.`,
    ];
  }

  const target = parameters.targetPartnerId!;
  const ratio = formatRatio(solution.timeline.weights.map((item) => item.effectiveCapital));
  const weights = solution.timeline.weights.map((item) => `${item.partnerId}: ${formatRational(item.effectiveCapital)} capital-months`).join(", ");
  if (parameters.language === "hi") {
    return [
      `पूरे बहु-वर्षीय समय को पूंजी-खंडों में बाँटने पर प्रभावी पूंजी-माह योगदान मिलते हैं: ${weights}।`,
      `इन योगदानों का अनुपात ${ratio} है; कुल लाभ को इसी अनुपात में बाँटने पर ${target} का हिस्सा मिलता है।`,
      `अतः आवश्यक उत्तर ${answer.display} है।`,
    ];
  }
  if (parameters.language === "pa") {
    return [
      `ਪੂਰੇ ਬਹੁ-ਸਾਲੀ ਸਮੇਂ ਨੂੰ ਪੂੰਜੀ-ਖੰਡਾਂ ਵਿੱਚ ਵੰਡਣ ਨਾਲ ਪ੍ਰਭਾਵੀ ਪੂੰਜੀ-ਮਹੀਨਾ ਯੋਗਦਾਨ ਮਿਲਦੇ ਹਨ: ${weights}।`,
      `ਇਨ੍ਹਾਂ ਯੋਗਦਾਨਾਂ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ; ਕੁੱਲ ਮੁਨਾਫ਼ਾ ਇਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਣ ਤੇ ${target} ਦਾ ਹਿੱਸਾ ਮਿਲਦਾ ਹੈ।`,
      `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${answer.display} ਹੈ।`,
    ];
  }
  return [
    `Split the full multi-year period into capital segments; the effective capital-month contributions are ${weights}.`,
    `These reduce to ${ratio}. Divide the total profit in this ratio to obtain ${target}'s share.`,
    `Therefore, the required share is ${answer.display}.`,
  ];
}

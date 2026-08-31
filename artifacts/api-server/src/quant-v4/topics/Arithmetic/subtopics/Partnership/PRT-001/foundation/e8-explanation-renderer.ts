import { formatPrt001Money } from "./parameter-generator";
import { formatRatio } from "./math";
import type { Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer } from "./types";

export function renderPrt001E8Explanation(input: {
  parameters: Prt001PilotParameters;
  solution: Prt001Solution;
  answer: Prt001TaskAnswer;
}): string[] {
  const { parameters, solution, answer } = input;
  const target = parameters.targetPartnerId!;
  if (parameters.questionLanguageId === "PRT-QL-104") {
    const [first, second] = solution.pool.executions;
    const remainder = formatPrt001Money(solution.pool.distributablePool);
    const ratio = formatRatio(solution.timeline.weights.map((item) => item.effectiveCapital));
    if (parameters.language === "hi") {
      return [
        `पहले दोनों सकल-लाभ भत्ते दिए जाते हैं: ${formatPrt001Money(first!.amount)} और ${formatPrt001Money(second!.amount)}; इसके बाद बाँटने के लिए ${remainder} बचता है।`,
        `समान अवधि होने से बचा लाभ पूंजी अनुपात ${ratio} में बाँटा जाता है; ${target} की अंतिम प्राप्ति में उसका पहले मिला भत्ता भी जुड़ता है।`,
        `अतः आवश्यक उत्तर ${answer.display} है।`,
      ];
    }
    if (parameters.language === "pa") {
      return [
        `ਪਹਿਲਾਂ ਦੋਵੇਂ ਸਕਲ-ਮੁਨਾਫ਼ਾ ਭੱਤੇ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ: ${formatPrt001Money(first!.amount)} ਅਤੇ ${formatPrt001Money(second!.amount)}; ਫਿਰ ਵੰਡ ਲਈ ${remainder} ਬਚਦਾ ਹੈ।`,
        `ਮਿਆਦ ਇੱਕੋ ਹੋਣ ਕਰਕੇ ਬਾਕੀ ਮੁਨਾਫ਼ਾ ਪੂੰਜੀ ਅਨੁਪਾਤ ${ratio} ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ; ${target} ਦੀ ਅੰਤਿਮ ਪ੍ਰਾਪਤੀ ਵਿੱਚ ਉਸਦਾ ਪਹਿਲਾਂ ਮਿਲਿਆ ਭੱਤਾ ਵੀ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।`,
        `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${answer.display} ਹੈ।`,
      ];
    }
    return [
      `Apply the two gross-profit allowances first: ${formatPrt001Money(first!.amount)} and ${formatPrt001Money(second!.amount)}, leaving ${remainder} for ratio sharing.`,
      `Because the investment periods are equal, divide that remainder in the capital ratio ${ratio}, then add ${target}'s own prior allowance.`,
      `Therefore, the required final receipt is ${answer.display}.`,
    ];
  }

  const ratio = formatRatio(solution.timeline.weights.map((item) => item.effectiveCapital));
  const weights = solution.timeline.weights.map((item) => `${item.partnerId}: ${formatPrt001Money(item.effectiveCapital)}`).join(", ");
  if (parameters.language === "hi") {
    return [
      `पूरे बहु-वर्षीय समय को पूंजी-खंडों में बाँटकर प्रभावी योगदान मिलते हैं: ${weights}।`,
      `इन योगदानों का अनुपात ${ratio} है; कुल लाभ को इसी अनुपात में बाँटने पर ${target} का हिस्सा मिलता है।`,
      `अतः आवश्यक उत्तर ${answer.display} है।`,
    ];
  }
  if (parameters.language === "pa") {
    return [
      `ਪੂਰੇ ਬਹੁ-ਸਾਲੀ ਸਮੇਂ ਨੂੰ ਪੂੰਜੀ-ਖੰਡਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨ ਮਿਲਦੇ ਹਨ: ${weights}।`,
      `ਇਨ੍ਹਾਂ ਯੋਗਦਾਨਾਂ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ; ਕੁੱਲ ਮੁਨਾਫ਼ਾ ਇਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਣ ਤੇ ${target} ਦਾ ਹਿੱਸਾ ਮਿਲਦਾ ਹੈ।`,
      `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${answer.display} ਹੈ।`,
    ];
  }
  return [
    `Split the full multi-year period into capital segments; the resulting effective contributions are ${weights}.`,
    `These reduce to ${ratio}. Divide the total profit in this ratio to obtain ${target}'s share.`,
    `Therefore, the required share is ${answer.display}.`,
  ];
}

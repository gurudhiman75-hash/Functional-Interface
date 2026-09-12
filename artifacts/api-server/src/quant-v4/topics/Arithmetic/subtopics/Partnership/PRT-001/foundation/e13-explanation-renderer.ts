import { formatPrt001Money } from "./parameter-generator";
import type { Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer } from "./types";
import { rational } from "./math";

const v = (p: Prt001PilotParameters, key: string): string => String(p.renderVariables[key]);
const moneyFromNumber = (value: unknown): string => formatPrt001Money(rational(Number(value)));

export function renderPrt001E13Explanation(input: { parameters: Prt001PilotParameters; solution: Prt001Solution; answer: Prt001TaskAnswer }): string[] {
  const { parameters: p, solution, answer } = input;
  const ratio = solution.normalizedRatio.join(":");
  const en = p.language === "en";
  const hi = p.language === "hi";

  switch (p.questionLanguageId) {
    case "PRT-QL-106":
      if (en) return [
        `${v(p, "sleepingPartner")} has only ${v(p, "entitlementFraction")} of the ordinary capital-based profit entitlement, so that partner's profit weight is reduced before division.`,
        `${v(p, "retainedPercent")}% of the gross profit is retained first; only the balance is distributed.`,
        `After the entitlement adjustment, the effective profit ratio is ${ratio}.`,
        `Therefore ${v(p, "targetPartner")}'s share is ${answer.display}.`,
      ];
      if (hi) return [
        `${v(p, "sleepingPartner")} को सामान्य पूंजी-आधारित लाभ-अधिकार का केवल ${v(p, "entitlementFraction")} मिलता है, इसलिए लाभ-विभाजन से पहले उसका प्रभावी भार घटाया जाता है।`,
        `सकल लाभ का ${v(p, "retainedPercent")}% पहले व्यवसाय में रोक लिया जाता है; केवल शेष राशि बांटी जाती है।`,
        `समायोजन के बाद प्रभावी लाभ अनुपात ${ratio} है।`,
        `अतः ${v(p, "targetPartner")} का हिस्सा ${answer.display} है।`,
      ];
      return [
        `${v(p, "sleepingPartner")} ਨੂੰ ਆਮ ਪੂੰਜੀ-ਅਧਾਰਿਤ ਲਾਭ-ਹੱਕ ਦਾ ਕੇਵਲ ${v(p, "entitlementFraction")} ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਵੰਡ ਤੋਂ ਪਹਿਲਾਂ ਉਸਦਾ ਪ੍ਰਭਾਵੀ ਭਾਰ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ।`,
        `ਕੁੱਲ ਲਾਭ ਦਾ ${v(p, "retainedPercent")}% ਪਹਿਲਾਂ ਕਾਰੋਬਾਰ ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ; ਕੇਵਲ ਬਾਕੀ ਰਕਮ ਵੰਡੀ ਜਾਂਦੀ ਹੈ।`,
        `ਸਮਾਂਜਸਤਾ ਤੋਂ ਬਾਅਦ ਪ੍ਰਭਾਵੀ ਲਾਭ ਅਨੁਪਾਤ ${ratio} ਹੈ।`,
        `ਇਸ ਲਈ ${v(p, "targetPartner")} ਦਾ ਹਿੱਸਾ ${answer.display} ਹੈ।`,
      ];
    case "PRT-QL-107": {
      const reinvested = moneyFromNumber(p.renderVariables.reinvestedProfitShareNumeric);
      if (en) return [
        `First-year profit is divided in the opening-capital ratio ₹${v(p, "initialCapitalA")}:₹${v(p, "initialCapitalB")}.`,
        `${v(p, "reinvestPartner")}'s first-year share is ${reinvested}; that exact amount becomes additional capital for year two.`,
        `Using the new second-year capitals gives the ratio ${ratio}.`,
        `Hence the required second-year profit ratio is ${answer.display}.`,
      ];
      if (hi) return [
        `पहले वर्ष का लाभ आरंभिक पूंजी ₹${v(p, "initialCapitalA")}:₹${v(p, "initialCapitalB")} के अनुपात में बांटा जाता है।`,
        `${v(p, "reinvestPartner")} का पहले वर्ष का हिस्सा ${reinvested} है; यही राशि दूसरे वर्ष की अतिरिक्त पूंजी बनती है।`,
        `नई पूंजियों से दूसरे वर्ष का अनुपात ${ratio} मिलता है।`,
        `अतः आवश्यक अनुपात ${answer.display} है।`,
      ];
      return [
        `ਪਹਿਲੇ ਸਾਲ ਦਾ ਲਾਭ ਸ਼ੁਰੂਆਤੀ ਪੂੰਜੀ ₹${v(p, "initialCapitalA")}:₹${v(p, "initialCapitalB")} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।`,
        `${v(p, "reinvestPartner")} ਦਾ ਪਹਿਲੇ ਸਾਲ ਦਾ ਹਿੱਸਾ ${reinvested} ਹੈ; ਇਹੀ ਰਕਮ ਦੂਜੇ ਸਾਲ ਦੀ ਵਾਧੂ ਪੂੰਜੀ ਬਣਦੀ ਹੈ।`,
        `ਨਵੀਂ ਪੂੰਜੀ ਨਾਲ ਦੂਜੇ ਸਾਲ ਦਾ ਅਨੁਪਾਤ ${ratio} ਮਿਲਦਾ ਹੈ।`,
        `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ${answer.display} ਹੈ।`,
      ];
    }
    case "PRT-QL-108":
      if (en) return [
        `${v(p, "partnerA")} first receives ${v(p, "grossPercentA")}% of gross profit and ${v(p, "partnerB")} receives ${v(p, "grossPercentB")}% of gross profit.`,
        `Only the remaining pool is divided by the capital ratio ${ratio}.`,
        `${v(p, "targetPartner")}'s final receipt is that partner's gross allocation plus the share from the residual pool.`,
        `So the total receipt is ${answer.display}.`,
      ];
      if (hi) return [
        `पहले ${v(p, "partnerA")} को सकल लाभ का ${v(p, "grossPercentA")}% और ${v(p, "partnerB")} को ${v(p, "grossPercentB")}% मिलता है।`,
        `केवल बचा हुआ लाभ पूंजी अनुपात ${ratio} में बांटा जाता है।`,
        `${v(p, "targetPartner")} की अंतिम प्राप्ति = प्रारंभिक सकल-लाभ आवंटन + शेष लाभ में उसका हिस्सा।`,
        `अतः कुल प्राप्ति ${answer.display} है।`,
      ];
      return [
        `ਪਹਿਲਾਂ ${v(p, "partnerA")} ਨੂੰ ਕੁੱਲ ਲਾਭ ਦਾ ${v(p, "grossPercentA")}% ਅਤੇ ${v(p, "partnerB")} ਨੂੰ ${v(p, "grossPercentB")}% ਮਿਲਦਾ ਹੈ।`,
        `ਕੇਵਲ ਬਾਕੀ ਲਾਭ ਪੂੰਜੀ ਅਨੁਪਾਤ ${ratio} ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।`,
        `${v(p, "targetPartner")} ਦੀ ਅੰਤਿਮ ਪ੍ਰਾਪਤੀ = ਪਹਿਲਾ ਕੁੱਲ-ਲਾਭ ਆਵੰਟਨ + ਬਾਕੀ ਲਾਭ ਵਿੱਚ ਹਿੱਸਾ।`,
        `ਇਸ ਲਈ ਕੁੱਲ ਪ੍ਰਾਪਤੀ ${answer.display} ਹੈ।`,
      ];
    case "PRT-QL-109":
      if (en) return [
        `${v(p, "partnerA")} uses ${v(p, "capitalFractionA")} of total capital for ${v(p, "durationFractionA")} of the term; ${v(p, "partnerB")} uses ${v(p, "capitalFractionB")} for ${v(p, "durationFractionB")}.`,
        `${v(p, "partnerC")} supplies the remaining capital for the whole term, so the three capital×time weights reduce to ${ratio}.`,
        `The total profit is then divided in this effective ratio.`,
        `${v(p, "targetPartner")}'s share is ${answer.display}.`,
      ];
      if (hi) return [
        `${v(p, "partnerA")} कुल पूंजी का ${v(p, "capitalFractionA")} भाग ${v(p, "durationFractionA")} अवधि तक और ${v(p, "partnerB")} ${v(p, "capitalFractionB")} भाग ${v(p, "durationFractionB")} अवधि तक लगाता है।`,
        `${v(p, "partnerC")} शेष पूंजी पूरी अवधि के लिए लगाता है; पूंजी×समय भारों का अनुपात ${ratio} बनता है।`,
        `कुल लाभ इसी प्रभावी अनुपात में बांटा जाता है।`,
        `${v(p, "targetPartner")} का हिस्सा ${answer.display} है।`,
      ];
      return [
        `${v(p, "partnerA")} ਕੁੱਲ ਪੂੰਜੀ ਦਾ ${v(p, "capitalFractionA")} ਹਿੱਸਾ ${v(p, "durationFractionA")} ਮਿਆਦ ਲਈ ਅਤੇ ${v(p, "partnerB")} ${v(p, "capitalFractionB")} ਹਿੱਸਾ ${v(p, "durationFractionB")} ਮਿਆਦ ਲਈ ਲਗਾਉਂਦਾ ਹੈ।`,
        `${v(p, "partnerC")} ਬਾਕੀ ਪੂੰਜੀ ਪੂਰੀ ਮਿਆਦ ਲਈ ਲਗਾਉਂਦਾ ਹੈ; ਪੂੰਜੀ×ਸਮਾਂ ਭਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ${ratio} ਬਣਦਾ ਹੈ।`,
        `ਕੁੱਲ ਲਾਭ ਇਸੇ ਪ੍ਰਭਾਵੀ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।`,
        `${v(p, "targetPartner")} ਦਾ ਹਿੱਸਾ ${answer.display} ਹੈ।`,
      ];
    case "PRT-QL-110":
      if (en) return [
        `All three partners remain for equal time, so only the capital relation matters.`,
        `${v(p, "relationStatement")} collapses the aggregate capital relation without needing separate trial values.`,
        `The resulting profit ratio is ${ratio}.`,
        `Therefore ${v(p, "targetPartner")}'s share is ${answer.display}.`,
      ];
      if (hi) return [
        `तीनों साझेदार समान समय तक रहते हैं, इसलिए केवल पूंजी संबंध निर्णायक है।`,
        `${v(p, "relationStatement")} से बिना अनावश्यक अलग-अलग मान निकाले संयुक्त पूंजी संबंध मिल जाता है।`,
        `लाभ अनुपात ${ratio} बनता है।`,
        `अतः ${v(p, "targetPartner")} का हिस्सा ${answer.display} है।`,
      ];
      return [
        `ਤਿੰਨੇ ਭਾਗੀਦਾਰ ਇੱਕੋ ਸਮੇਂ ਲਈ ਰਹਿੰਦੇ ਹਨ, ਇਸ ਲਈ ਕੇਵਲ ਪੂੰਜੀ ਦਾ ਸੰਬੰਧ ਮਹੱਤਵਪੂਰਨ ਹੈ।`,
        `${v(p, "relationStatement")} ਨਾਲ ਵੱਖ-ਵੱਖ ਅਨੁਮਾਨ ਲਗਾਏ ਬਿਨਾਂ ਜੋੜੀ ਪੂੰਜੀ ਦਾ ਸੰਬੰਧ ਮਿਲ ਜਾਂਦਾ ਹੈ।`,
        `ਲਾਭ ਅਨੁਪਾਤ ${ratio} ਬਣਦਾ ਹੈ।`,
        `ਇਸ ਲਈ ${v(p, "targetPartner")} ਦਾ ਹਿੱਸਾ ${answer.display} ਹੈ।`,
      ];
    case "PRT-QL-111": {
      const ia = moneyFromNumber(p.renderVariables.interestANumeric);
      const ib = moneyFromNumber(p.renderVariables.interestBNumeric);
      if (en) return [
        `Interest on capital is credited first: ${v(p, "partnerA")} gets ${ia} and ${v(p, "partnerB")} gets ${ib}.`,
        `After these credits, the remaining business profit is divided in the capital ratio ${ratio}.`,
        `${v(p, "targetPartner")}'s total receipt combines the capital-interest credit and the residual profit share.`,
        `Hence the answer is ${answer.display}.`,
      ];
      if (hi) return [
        `पूंजी पर ब्याज पहले दिया जाता है: ${v(p, "partnerA")} को ${ia} और ${v(p, "partnerB")} को ${ib}।`,
        `इन राशियों के बाद बचा व्यवसायिक लाभ पूंजी अनुपात ${ratio} में बांटा जाता है।`,
        `${v(p, "targetPartner")} की कुल प्राप्ति में पूंजी-ब्याज और शेष लाभांश दोनों शामिल हैं।`,
        `अतः उत्तर ${answer.display} है।`,
      ];
      return [
        `ਪੂੰਜੀ 'ਤੇ ਬਿਆਜ ਪਹਿਲਾਂ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ: ${v(p, "partnerA")} ਨੂੰ ${ia} ਅਤੇ ${v(p, "partnerB")} ਨੂੰ ${ib}।`,
        `ਇਨ੍ਹਾਂ ਰਕਮਾਂ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਕਾਰੋਬਾਰੀ ਲਾਭ ਪੂੰਜੀ ਅਨੁਪਾਤ ${ratio} ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।`,
        `${v(p, "targetPartner")} ਦੀ ਕੁੱਲ ਪ੍ਰਾਪਤੀ ਵਿੱਚ ਪੂੰਜੀ-ਬਿਆਜ ਅਤੇ ਬਾਕੀ ਲਾਭ-ਹਿੱਸਾ ਦੋਵੇਂ ਸ਼ਾਮਲ ਹਨ।`,
        `ਇਸ ਲਈ ਉੱਤਰ ${answer.display} ਹੈ।`,
      ];
    }
    case "PRT-QL-112":
      if (en) return [
        `Convert the old ratio ${v(p, "oldRatio")} into fractions of the whole profit.`,
        `${v(p, "partnerC")} receives ${v(p, "acquiredFraction")} of the whole; that acquired share is deducted from ${v(p, "partnerA")} and ${v(p, "partnerB")} in sacrifice ratio ${v(p, "sacrificeRatio")}.`,
        `The three remaining/acquired fractions reduce to ${ratio}.`,
        `So the new profit-sharing ratio is ${answer.display}.`,
      ];
      if (hi) return [
        `पुराने अनुपात ${v(p, "oldRatio")} को कुल लाभ के अंशों में बदलिए।`,
        `${v(p, "partnerC")} कुल लाभ का ${v(p, "acquiredFraction")} प्राप्त करता है; यह हिस्सा ${v(p, "partnerA")} और ${v(p, "partnerB")} से ${v(p, "sacrificeRatio")} त्याग-अनुपात में घटाया जाता है।`,
        `तीनों के नए अंश सरल होकर ${ratio} बनते हैं।`,
        `अतः नया लाभ-विभाजन अनुपात ${answer.display} है।`,
      ];
      return [
        `ਪੁਰਾਣੇ ਅਨੁਪਾਤ ${v(p, "oldRatio")} ਨੂੰ ਕੁੱਲ ਲਾਭ ਦੇ ਹਿੱਸਿਆਂ ਵਿੱਚ ਬਦਲੋ।`,
        `${v(p, "partnerC")} ਕੁੱਲ ਲਾਭ ਦਾ ${v(p, "acquiredFraction")} ਲੈਂਦਾ ਹੈ; ਇਹ ਹਿੱਸਾ ${v(p, "partnerA")} ਅਤੇ ${v(p, "partnerB")} ਤੋਂ ${v(p, "sacrificeRatio")} ਤਿਆਗ ਅਨੁਪਾਤ ਵਿੱਚ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ।`,
        `ਤਿੰਨਾਂ ਦੇ ਨਵੇਂ ਹਿੱਸੇ ਸਰਲ ਹੋ ਕੇ ${ratio} ਬਣਦੇ ਹਨ।`,
        `ਇਸ ਲਈ ਨਵਾਂ ਲਾਭ-ਵੰਡ ਅਨੁਪਾਤ ${answer.display} ਹੈ।`,
      ];
    default:
      throw new Error(`E13 explanation renderer does not support ${p.questionLanguageId}`);
  }
}

import type { Rap003Parameters } from "./types";

type Language = "hi" | "pa";
function v(p: Rap003Parameters, key: string) { return p.variables[key]; }

function replacement(p: Rap003Parameters, language: Language) {
  const hi = language === "hi";
  const task = p.taskKind;
  if (["replacementFinalRatio", "replacementFinalQuantity", "replacementAddedLiquidQuantity", "replacementOriginalPercentRemaining"].includes(task)) {
    const ask = task === "replacementFinalRatio"
      ? (hi ? "अंत में मूल द्रव और नए द्रव का अनुपात ज्ञात करें।" : "ਅੰਤ ਵਿੱਚ ਮੂਲ ਤਰਲ ਅਤੇ ਨਵੇਂ ਤਰਲ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।")
      : task === "replacementFinalQuantity"
        ? (hi ? "अंत में मूल द्रव की बची मात्रा ज्ञात करें।" : "ਅੰਤ ਵਿੱਚ ਮੂਲ ਤਰਲ ਦੀ ਬਚੀ ਮਾਤਰਾ ਲੱਭੋ।")
        : task === "replacementAddedLiquidQuantity"
          ? (hi ? "अंत में नए द्रव की मात्रा ज्ञात करें।" : "ਅੰਤ ਵਿੱਚ ਨਵੇਂ ਤਰਲ ਦੀ ਮਾਤਰਾ ਲੱਭੋ।")
          : (hi ? "मूल द्रव का बचा प्रतिशत ज्ञात करें।" : "ਮੂਲ ਤਰਲ ਦਾ ਬਚਿਆ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭੋ।");
    return hi
      ? `पात्र में ${v(p, "initialVolume")} लीटर मूल द्रव है। हर बार ${v(p, "removedVolume")} लीटर निकालकर उतना ही नया द्रव भरा जाता है। यह प्रक्रिया ${v(p, "replacementCount")} बार होती है। ${ask}`
      : `ਭਾਂਡੇ ਵਿੱਚ ${v(p, "initialVolume")} ਲੀਟਰ ਮੂਲ ਤਰਲ ਹੈ। ਹਰ ਵਾਰ ${v(p, "removedVolume")} ਲੀਟਰ ਕੱਢ ਕੇ ਉਤਨਾ ਹੀ ਨਵਾਂ ਤਰਲ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਇਹ ਪ੍ਰਕਿਰਿਆ ${v(p, "replacementCount")} ਵਾਰ ਹੁੰਦੀ ਹੈ। ${ask}`;
  }
  if (task === "replacementIterationsFromFinalRatio") {
    return hi
      ? `पात्र में ${v(p, "initialVolume")} लीटर मूल द्रव है। हर चरण में ${v(p, "removedVolume")} लीटर निकालकर नया द्रव भरा जाता है। मूल और नए द्रव का अंतिम अनुपात ${v(p, "finalRatioA")}:${v(p, "finalRatioB")} होने के लिए कितने चरण चाहिए?`
      : `ਭਾਂਡੇ ਵਿੱਚ ${v(p, "initialVolume")} ਲੀਟਰ ਮੂਲ ਤਰਲ ਹੈ। ਹਰ ਪੜਾਅ ਵਿੱਚ ${v(p, "removedVolume")} ਲੀਟਰ ਕੱਢ ਕੇ ਨਵਾਂ ਤਰਲ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਮੂਲ ਅਤੇ ਨਵੇਂ ਤਰਲ ਦਾ ਅੰਤਿਮ ਅਨੁਪਾਤ ${v(p, "finalRatioA")}:${v(p, "finalRatioB")} ਹੋਣ ਲਈ ਕਿੰਨੇ ਪੜਾਅ ਚਾਹੀਦੇ ਹਨ?`;
  }
  if (task === "replacementRemovedVolumeFromFinalRatio") {
    return hi
      ? `${v(p, "initialVolume")} लीटर मूल द्रव वाले पात्र में हर बार समान मात्रा निकालकर नया द्रव भरा जाता है। यह ${v(p, "replacementCount")} बार होता है और अंतिम अनुपात ${v(p, "finalRatioA")}:${v(p, "finalRatioB")} है। हर बार निकाली गई मात्रा ज्ञात करें।`
      : `${v(p, "initialVolume")} ਲੀਟਰ ਮੂਲ ਤਰਲ ਵਾਲੇ ਭਾਂਡੇ ਵਿੱਚ ਹਰ ਵਾਰ ਇੱਕੋ ਮਾਤਰਾ ਕੱਢ ਕੇ ਨਵਾਂ ਤਰਲ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਇਹ ${v(p, "replacementCount")} ਵਾਰ ਹੁੰਦਾ ਹੈ ਅਤੇ ਅੰਤਿਮ ਅਨੁਪਾਤ ${v(p, "finalRatioA")}:${v(p, "finalRatioB")} ਹੈ। ਹਰ ਵਾਰ ਕੱਢੀ ਮਾਤਰਾ ਲੱਭੋ।`;
  }
  if (task === "replacementDifferentRounds") {
    return hi
      ? `${v(p, "initialVolume")} लीटर मूल द्रव में पहले ${v(p, "removedVolumeA")} लीटर और फिर ${v(p, "removedVolumeB")} लीटर मिश्रण निकालकर नया द्रव भरा जाता है। अंत में मूल द्रव की मात्रा ज्ञात करें।`
      : `${v(p, "initialVolume")} ਲੀਟਰ ਮੂਲ ਤਰਲ ਵਿੱਚ ਪਹਿਲਾਂ ${v(p, "removedVolumeA")} ਲੀਟਰ ਅਤੇ ਫਿਰ ${v(p, "removedVolumeB")} ਲੀਟਰ ਮਿਸ਼ਰਣ ਕੱਢ ਕੇ ਨਵਾਂ ਤਰਲ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ ਮੂਲ ਤਰਲ ਦੀ ਮਾਤਰਾ ਲੱਭੋ।`;
  }
  if (task === "replacementTankSolution" || task === "replacementStrengthAfterRounds") {
    return hi
      ? `${v(p, "initialVolume")} लीटर घोल की शुरुआती सांद्रता ${v(p, "initialPercent")}% है। हर बार ${v(p, "removedVolume")} लीटर निकालकर ${v(p, "addLiquidPercent")}% वाला घोल भरा जाता है। ${v(p, "replacementCount")} चरणों बाद अंतिम सांद्रता ज्ञात करें।`
      : `${v(p, "initialVolume")} ਲੀਟਰ ਘੋਲ ਦੀ ਸ਼ੁਰੂਆਤੀ ਸਾਂਦ੍ਰਤਾ ${v(p, "initialPercent")}% ਹੈ। ਹਰ ਵਾਰ ${v(p, "removedVolume")} ਲੀਟਰ ਕੱਢ ਕੇ ${v(p, "addLiquidPercent")}% ਵਾਲਾ ਘੋਲ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ${v(p, "replacementCount")} ਪੜਾਅ ਬਾਅਦ ਅੰਤਿਮ ਸਾਂਦ੍ਰਤਾ ਲੱਭੋ।`;
  }
  if (task === "replacementInventoryAnalogy") {
    return hi
      ? `भंडार में ${v(p, "initialStock")} मूल इकाइयां हैं। हर चरण में ${v(p, "soldEachRound")} इकाइयां बेचकर उतनी नई इकाइयां रखी जाती हैं। ${v(p, "replacementCount")} चरणों बाद मूल इकाइयां कितनी बचेंगी?`
      : `ਭੰਡਾਰ ਵਿੱਚ ${v(p, "initialStock")} ਮੂਲ ਇਕਾਈਆਂ ਹਨ। ਹਰ ਪੜਾਅ ਵਿੱਚ ${v(p, "soldEachRound")} ਇਕਾਈਆਂ ਵੇਚ ਕੇ ਉਤਨੀਆਂ ਨਵੀਆਂ ਇਕਾਈਆਂ ਰੱਖੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ${v(p, "replacementCount")} ਪੜਾਅ ਬਾਅਦ ਮੂਲ ਇਕਾਈਆਂ ਕਿੰਨੀਆਂ ਬਚਣਗੀਆਂ?`;
  }
  if (task === "replacementInitialFromFinalQuantity") {
    return hi
      ? `हर चरण में पात्र का ${v(p, "removedFractionNumerator")}/${v(p, "removedFractionDenominator")} भाग निकालकर भरा जाता है। ${v(p, "replacementCount")} चरणों बाद मूल द्रव ${v(p, "finalQuantity")} लीटर बचता है। शुरुआती मात्रा ज्ञात करें।`
      : `ਹਰ ਪੜਾਅ ਵਿੱਚ ਭਾਂਡੇ ਦਾ ${v(p, "removedFractionNumerator")}/${v(p, "removedFractionDenominator")} ਹਿੱਸਾ ਕੱਢ ਕੇ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ${v(p, "replacementCount")} ਪੜਾਅ ਬਾਅਦ ਮੂਲ ਤਰਲ ${v(p, "finalQuantity")} ਲੀਟਰ ਬਚਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਮਾਤਰਾ ਲੱਭੋ।`;
  }
  if (task === "replacementFinalAfterFractionRemoval") {
    return hi
      ? `पात्र में शुरू में केवल मूल द्रव है। हर चरण में मिश्रण का ${v(p, "removedFractionNumerator")}/${v(p, "removedFractionDenominator")} भाग निकालकर नया द्रव भरा जाता है। ${v(p, "replacementCount")} चरणों बाद अंतिम अनुपात ज्ञात करें।`
      : `ਭਾਂਡੇ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ਕੇਵਲ ਮੂਲ ਤਰਲ ਹੈ। ਹਰ ਪੜਾਅ ਵਿੱਚ ਮਿਸ਼ਰਣ ਦਾ ${v(p, "removedFractionNumerator")}/${v(p, "removedFractionDenominator")} ਹਿੱਸਾ ਕੱਢ ਕੇ ਨਵਾਂ ਤਰਲ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ${v(p, "replacementCount")} ਪੜਾਅ ਬਾਅਦ ਅੰਤਿਮ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  return undefined;
}

function ratioText(p: Rap003Parameters) {
  return v(p, "ratioD") === undefined
    ? `${v(p, "ratioA")}:${v(p, "ratioB")}:${v(p, "ratioC")}`
    : `${v(p, "ratioA")}:${v(p, "ratioB")}:${v(p, "ratioC")}:${v(p, "ratioD")}`;
}

function denominationText(p: Rap003Parameters, language: Language) {
  const join = language === "hi" ? "और" : "ਅਤੇ";
  const parts = [`₹${v(p, "denominationA")}`, `₹${v(p, "denominationB")}`, `₹${v(p, "denominationC")}`];
  if (v(p, "denominationD") !== undefined) parts.push(`₹${v(p, "denominationD")}`);
  return parts.slice(0, -1).join(", ") + ` ${join} ${parts.at(-1)}`;
}

function denomination(p: Rap003Parameters, language: Language) {
  const hi = language === "hi";
  const task = p.taskKind;
  const denoms = denominationText(p, language);
  const ratio = ratioText(p);
  if (task === "denominationTotalValue" || task === "ticketValueSystem" || task === "marksPerQuestionType") {
    return hi
      ? `${denoms} मूल्य वाली वस्तुओं की संख्या का अनुपात ${ratio} है और समान गुणक ${v(p, "commonUnit")} है। कुल मूल्य ज्ञात करें।`
      : `${denoms} ਮੁੱਲ ਵਾਲੀਆਂ ਵਸਤਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ ਅਤੇ ਸਾਂਝਾ ਗੁਣਕ ${v(p, "commonUnit")} ਹੈ। ਕੁੱਲ ਮੁੱਲ ਲੱਭੋ।`;
  }
  if (task === "denominationCountsFromValue") {
    return hi
      ? `${denoms} मूल्य वाली वस्तुओं की संख्या का अनुपात ${ratio} है और कुल मूल्य ₹${v(p, "totalValue")} है। ₹${v(p, "targetDenomination")} मूल्य वाली वस्तुओं की संख्या ज्ञात करें।`
      : `${denoms} ਮੁੱਲ ਵਾਲੀਆਂ ਵਸਤਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ ਅਤੇ ਕੁੱਲ ਮੁੱਲ ₹${v(p, "totalValue")} ਹੈ। ₹${v(p, "targetDenomination")} ਮੁੱਲ ਵਾਲੀਆਂ ਵਸਤਾਂ ਦੀ ਗਿਣਤੀ ਲੱਭੋ।`;
  }
  if (task === "denominationTargetCount") {
    return hi
      ? `${denoms} मूल्य वाली वस्तुओं की संख्या का अनुपात ${ratio} है और समान गुणक ${v(p, "commonUnit")} है। ₹${v(p, "targetDenomination")} वाली वस्तुओं की संख्या ज्ञात करें।`
      : `${denoms} ਮੁੱਲ ਵਾਲੀਆਂ ਵਸਤਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ ਅਤੇ ਸਾਂਝਾ ਗੁਣਕ ${v(p, "commonUnit")} ਹੈ। ₹${v(p, "targetDenomination")} ਵਾਲੀਆਂ ਵਸਤਾਂ ਦੀ ਗਿਣਤੀ ਲੱਭੋ।`;
  }
  if (task === "denominationSwapValue") {
    return hi
      ? `${denoms} मूल्य वाली वस्तुओं की संख्या का अनुपात ${ratio} और समान गुणक ${v(p, "commonUnit")} है। ₹${v(p, "fromDenomination")} वाली ${v(p, "swapCount")} वस्तुओं को ₹${v(p, "toDenomination")} वाली वस्तुओं से बदलने पर नया कुल मूल्य ज्ञात करें।`
      : `${denoms} ਮੁੱਲ ਵਾਲੀਆਂ ਵਸਤਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਅਤੇ ਸਾਂਝਾ ਗੁਣਕ ${v(p, "commonUnit")} ਹੈ। ₹${v(p, "fromDenomination")} ਵਾਲੀਆਂ ${v(p, "swapCount")} ਵਸਤਾਂ ਨੂੰ ₹${v(p, "toDenomination")} ਵਾਲੀਆਂ ਵਸਤਾਂ ਨਾਲ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਨਵਾਂ ਕੁੱਲ ਮੁੱਲ ਲੱਭੋ।`;
  }
  if (task === "denominationTotalCountFromValue" || task === "denominationFourTypeTotalCount") {
    return hi
      ? `${denoms} मूल्य वाली वस्तुओं की संख्या का अनुपात ${ratio} और कुल मूल्य ₹${v(p, "totalValue")} है। वस्तुओं की कुल संख्या ज्ञात करें।`
      : `${denoms} ਮੁੱਲ ਵਾਲੀਆਂ ਵਸਤਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਅਤੇ ਕੁੱਲ ਮੁੱਲ ₹${v(p, "totalValue")} ਹੈ। ਵਸਤਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਲੱਭੋ।`;
  }
  if (task === "denominationTotalValueFromTotalCount") {
    return hi
      ? `${denoms} मूल्य वाली कुल ${v(p, "totalCount")} वस्तुएं ${ratio} के अनुपात में हैं। उनका कुल मूल्य ज्ञात करें।`
      : `${denoms} ਮੁੱਲ ਵਾਲੀਆਂ ਕੁੱਲ ${v(p, "totalCount")} ਵਸਤਾਂ ${ratio} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ। ਉਨ੍ਹਾਂ ਦਾ ਕੁੱਲ ਮੁੱਲ ਲੱਭੋ।`;
  }
  if (task === "denominationValueRatio") {
    return hi
      ? `${denoms} मूल्य वाली वस्तुओं की संख्या का अनुपात ${ratio} है। तीनों प्रकारों द्वारा दिए गए कुल मूल्यों का अनुपात ज्ञात करें।`
      : `${denoms} ਮੁੱਲ ਵਾਲੀਆਂ ਵਸਤਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਤਿੰਨਾਂ ਕਿਸਮਾਂ ਵੱਲੋਂ ਦਿੱਤੇ ਕੁੱਲ ਮੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (task === "denominationAverageValue") {
    return hi
      ? `${denoms} मूल्य वाली वस्तुओं की संख्या का अनुपात ${ratio} है। प्रति वस्तु औसत मूल्य ज्ञात करें।`
      : `${denoms} ਮੁੱਲ ਵਾਲੀਆਂ ਵਸਤਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਪ੍ਰਤੀ ਵਸਤੂ ਔਸਤ ਮੁੱਲ ਲੱਭੋ।`;
  }
  if (task === "denominationMissingRatioPart") {
    return hi
      ? `₹${v(p, "denominationA")}, ₹${v(p, "denominationB")} और ₹${v(p, "denominationC")} वाली वस्तुओं की संख्या का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")}:x है। समान गुणक ${v(p, "commonUnit")} और कुल मूल्य ₹${v(p, "totalValue")} है। x ज्ञात करें।`
      : `₹${v(p, "denominationA")}, ₹${v(p, "denominationB")} ਅਤੇ ₹${v(p, "denominationC")} ਵਾਲੀਆਂ ਵਸਤਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")}:x ਹੈ। ਸਾਂਝਾ ਗੁਣਕ ${v(p, "commonUnit")} ਅਤੇ ਕੁੱਲ ਮੁੱਲ ₹${v(p, "totalValue")} ਹੈ। x ਲੱਭੋ।`;
  }
  return undefined;
}

export function renderLocalizedRap003ReplacementDenominationStem(p: Rap003Parameters) {
  if (p.language === "en") return undefined;
  const language = p.language as Language;
  if (p.canonicalProblemId === "RAP-CP-017") return replacement(p, language);
  if (p.canonicalProblemId === "RAP-CP-018") return denomination(p, language);
  return undefined;
}

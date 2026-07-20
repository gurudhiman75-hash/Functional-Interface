import type { Rap002Parameters } from "./types";

type Language = "hi" | "pa";

function n(parameters: Rap002Parameters, key: string) {
  return parameters.variables[key];
}

function has(parameters: Rap002Parameters, key: string) {
  return parameters.variables[key] !== undefined;
}

function chain3(p: Rap002Parameters) {
  return `A:B = ${n(p, "ratioA1")}:${n(p, "ratioB1")} और B:C = ${n(p, "ratioB2")}:${n(p, "ratioC2")}`;
}

function chain3Pa(p: Rap002Parameters) {
  return `A:B = ${n(p, "ratioA1")}:${n(p, "ratioB1")} ਅਤੇ B:C = ${n(p, "ratioB2")}:${n(p, "ratioC2")}`;
}

function chain4(p: Rap002Parameters, language: Language) {
  const join = language === "hi" ? "और" : "ਅਤੇ";
  return `A:B = ${n(p, "ratioA1")}:${n(p, "ratioB1")}, B:C = ${n(p, "ratioB2")}:${n(p, "ratioC2")} ${join} C:D = ${n(p, "ratioC3")}:${n(p, "ratioD3")}`;
}

function changeText(p: Rap002Parameters, language: Language) {
  const hi = language === "hi";
  if (has(p, "commonAdd")) return hi ? `दोनों में ${n(p, "commonAdd")} जोड़ दिए जाते हैं` : `ਦੋਵਾਂ ਵਿੱਚ ${n(p, "commonAdd")} ਜੋੜੇ ਜਾਂਦੇ ਹਨ`;
  if (has(p, "commonRemove")) return hi ? `दोनों में से ${n(p, "commonRemove")} घटा दिए जाते हैं` : `ਦੋਵਾਂ ਵਿੱਚੋਂ ${n(p, "commonRemove")} ਘਟਾਏ ਜਾਂਦੇ ਹਨ`;
  const parts: string[] = [];
  if (has(p, "valueAddA")) parts.push(hi ? `A में ${n(p, "valueAddA")} जोड़े जाते हैं` : `A ਵਿੱਚ ${n(p, "valueAddA")} ਜੋੜੇ ਜਾਂਦੇ ਹਨ`);
  if (has(p, "valueAddB")) parts.push(hi ? `B में ${n(p, "valueAddB")} जोड़े जाते हैं` : `B ਵਿੱਚ ${n(p, "valueAddB")} ਜੋੜੇ ਜਾਂਦੇ ਹਨ`);
  if (has(p, "valueRemoveA")) parts.push(hi ? `A में से ${n(p, "valueRemoveA")} घटाए जाते हैं` : `A ਵਿੱਚੋਂ ${n(p, "valueRemoveA")} ਘਟਾਏ ਜਾਂਦੇ ਹਨ`);
  if (has(p, "valueRemoveB")) parts.push(hi ? `B में से ${n(p, "valueRemoveB")} घटाए जाते हैं` : `B ਵਿੱਚੋਂ ${n(p, "valueRemoveB")} ਘਟਾਏ ਜਾਂਦੇ ਹਨ`);
  return parts.join(hi ? " और " : " ਅਤੇ ");
}

function targetPart(p: Rap002Parameters) {
  const branch = String(n(p, "branchPart") ?? "A");
  const sub = String(n(p, "targetSubPart") ?? "C");
  return { branch, sub };
}

export function renderLocalizedRap002Stem(parameters: Rap002Parameters) {
  if (parameters.language === "en") return undefined;
  const language = parameters.language as Language;
  const hi = language === "hi";
  const task = parameters.taskKind;

  if (task === "chainAlignment" || task === "extendedChainAlignment") {
    const relation = has(parameters, "ratioC3") ? chain4(parameters, language) : (hi ? chain3(parameters) : chain3Pa(parameters));
    return hi
      ? `${relation} हैं। साझा पद बराबर करके मांगा गया संयुक्त अनुपात ज्ञात करें।`
      : `${relation} ਹਨ। ਸਾਂਝੇ ਪਦ ਬਰਾਬਰ ਕਰਕੇ ਮੰਗਿਆ ਸਾਂਝਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }

  if (task === "missingChainRatio") {
    const relation = hi ? chain3(parameters) : chain3Pa(parameters);
    return hi
      ? `${relation} हैं। यदि A = ${n(parameters, "endpointA")} और C = ${n(parameters, "endpointC")} हैं, तो B का मान ज्ञात करें।`
      : `${relation} ਹਨ। ਜੇ A = ${n(parameters, "endpointA")} ਅਤੇ C = ${n(parameters, "endpointC")} ਹਨ, ਤਾਂ B ਦਾ ਮੁੱਲ ਲੱਭੋ।`;
  }

  if (task === "reverseMiddleFinding") {
    const relation = hi ? chain3(parameters) : chain3Pa(parameters);
    const known = has(parameters, "valueA") ? `A = ${n(parameters, "valueA")}` : `C = ${n(parameters, "valueC")}`;
    return hi ? `${relation} हैं और ${known} है। B का मान ज्ञात करें।` : `${relation} ਹਨ ਅਤੇ ${known} ਹੈ। B ਦਾ ਮੁੱਲ ਲੱਭੋ।`;
  }

  if (task === "reverseEndpointFinding") {
    const relation = hi ? chain3(parameters) : chain3Pa(parameters);
    const target = String(n(parameters, "targetEndpoint") ?? "A");
    return hi ? `${relation} हैं और B = ${n(parameters, "valueB")} है। ${target} का मान ज्ञात करें।` : `${relation} ਹਨ ਅਤੇ B = ${n(parameters, "valueB")} ਹੈ। ${target} ਦਾ ਮੁੱਲ ਲੱਭੋ।`;
  }

  if (task === "constrainedReverseChain") {
    const relation = hi ? chain3(parameters) : chain3Pa(parameters);
    if (has(parameters, "totalValue")) {
      return hi ? `${relation} हैं और A + B + C = ${n(parameters, "totalValue")} है। B का मान ज्ञात करें।` : `${relation} ਹਨ ਅਤੇ A + B + C = ${n(parameters, "totalValue")} ਹੈ। B ਦਾ ਮੁੱਲ ਲੱਭੋ।`;
    }
    return hi ? `${relation} हैं और अंतिम राशियों का अंतर ${n(parameters, "valueDifference")} है। B का मान ज्ञात करें।` : `${relation} ਹਨ ਅਤੇ ਅੰਤਿਮ ਰਾਸ਼ੀਆਂ ਦਾ ਅੰਤਰ ${n(parameters, "valueDifference")} ਹੈ। B ਦਾ ਮੁੱਲ ਲੱਭੋ।`;
  }

  if (task === "successiveRatioChange") {
    return hi
      ? `A:B = ${n(parameters, "ratioA")}:${n(parameters, "ratioB")} है और A + B = ${n(parameters, "totalValue")} है। ${changeText(parameters, language)}। नया अनुपात ज्ञात करें।`
      : `A:B = ${n(parameters, "ratioA")}:${n(parameters, "ratioB")} ਹੈ ਅਤੇ A + B = ${n(parameters, "totalValue")} ਹੈ। ${changeText(parameters, language)}। ਨਵਾਂ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }

  if (task === "transferTracking") {
    const direction = String(n(parameters, "transferDirection") ?? "A_TO_B");
    const from = direction.includes("B_TO_A") ? "B" : "A";
    const to = from === "A" ? "B" : "A";
    return hi
      ? `A:B = ${n(parameters, "ratioA")}:${n(parameters, "ratioB")} है और कुल ${n(parameters, "totalValue")} है। ${from} से ${to} को ${n(parameters, "transferValue")} देने पर नया अनुपात ज्ञात करें।`
      : `A:B = ${n(parameters, "ratioA")}:${n(parameters, "ratioB")} ਹੈ ਅਤੇ ਕੁੱਲ ${n(parameters, "totalValue")} ਹੈ। ${from} ਤੋਂ ${to} ਨੂੰ ${n(parameters, "transferValue")} ਦੇਣ ਤੋਂ ਬਾਅਦ ਨਵਾਂ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }

  if (task === "reconstructOriginalRatio") {
    const finalRatio = `${n(parameters, "finalRatioA")}:${n(parameters, "finalRatioB")}`;
    return hi
      ? `बदलाव के बाद A:B = ${finalRatio} है। दिए गए बदलाव और कुल राशि की सहायता से शुरुआती अनुपात ज्ञात करें।`
      : `ਤਬਦੀਲੀ ਤੋਂ ਬਾਅਦ A:B = ${finalRatio} ਹੈ। ਦਿੱਤੀ ਤਬਦੀਲੀ ਅਤੇ ਕੁੱਲ ਰਾਸ਼ੀ ਨਾਲ ਸ਼ੁਰੂਆਤੀ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }

  if (["nestedPartition", "conditionalDistribution", "weightedNestedPartition"].includes(task)) {
    const { branch, sub } = targetPart(parameters);
    const condition = task === "conditionalDistribution"
      ? (hi ? ` चुने हिस्से की शर्त ${n(parameters, "thresholdValue")} भी पूरी होती है।` : ` ਚੁਣੇ ਹਿੱਸੇ ਦੀ ਸ਼ਰਤ ${n(parameters, "thresholdValue")} ਵੀ ਪੂਰੀ ਹੁੰਦੀ ਹੈ।`)
      : "";
    const weights = task === "weightedNestedPartition"
      ? (hi ? ` C और D के भार ${n(parameters, "weightC")} और ${n(parameters, "weightD")} हैं।` : ` C ਅਤੇ D ਦੇ ਭਾਰ ${n(parameters, "weightC")} ਅਤੇ ${n(parameters, "weightD")} ਹਨ।`)
      : "";
    return hi
      ? `कुल ${n(parameters, "totalValue")} को A:B = ${n(parameters, "ratioA")}:${n(parameters, "ratioB")} में बांटा गया है। ${branch} वाला हिस्सा C:D = ${n(parameters, "subRatioC")}:${n(parameters, "subRatioD")} में बांटा जाता है।${condition}${weights} ${sub} का मान ज्ञात करें।`
      : `ਕੁੱਲ ${n(parameters, "totalValue")} ਨੂੰ A:B = ${n(parameters, "ratioA")}:${n(parameters, "ratioB")} ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ। ${branch} ਵਾਲਾ ਹਿੱਸਾ C:D = ${n(parameters, "subRatioC")}:${n(parameters, "subRatioD")} ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।${condition}${weights} ${sub} ਦਾ ਮੁੱਲ ਲੱਭੋ।`;
  }

  if (task === "inverseChainWork" || task === "inverseChainSpeed") {
    const relation = has(parameters, "ratioA1") ? (hi ? chain3(parameters) : chain3Pa(parameters)) : `A:B = ${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`;
    const known = has(parameters, "valueA") ? `A = ${n(parameters, "valueA")}` : `C = ${n(parameters, "valueC")}`;
    return hi ? `${relation} है और ${known} है। उल्टे अनुपात से मांगा गया समय ज्ञात करें।` : `${relation} ਹੈ ਅਤੇ ${known} ਹੈ। ਉਲਟ ਅਨੁਪਾਤ ਨਾਲ ਮੰਗਿਆ ਸਮਾਂ ਲੱਭੋ।`;
  }

  if (task === "combinedInverseChain") {
    return hi
      ? `A:B की दर का अनुपात ${n(parameters, "ratioA")}:${n(parameters, "ratioB")} और समय का अनुपात ${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")} है। काम या उत्पादन का अनुपात ज्ञात करें।`
      : `A:B ਦੀ ਦਰ ਦਾ ਅਨੁਪਾਤ ${n(parameters, "ratioA")}:${n(parameters, "ratioB")} ਅਤੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")} ਹੈ। ਕੰਮ ਜਾਂ ਉਤਪਾਦਨ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }

  if (task === "sdtTimeRatioFromSpeedDistance") {
    return hi
      ? `A और B की गति का अनुपात ${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")} तथा दूरी का अनुपात ${n(parameters, "distanceRatioA")}:${n(parameters, "distanceRatioB")} है। समय का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")} ਅਤੇ ਦੂਰੀ ਦਾ ਅਨੁਪਾਤ ${n(parameters, "distanceRatioA")}:${n(parameters, "distanceRatioB")} ਹੈ। ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }

  if (task === "chainOrdering" || task === "chainInequality") {
    const relation = has(parameters, "ratioC3") ? chain4(parameters, language) : (hi ? chain3(parameters) : chain3Pa(parameters));
    return hi ? `${relation} हैं। अनुपात बराबर करके राशियों की सही तुलना करें।` : `${relation} ਹਨ। ਅਨੁਪਾਤ ਬਰਾਬਰ ਕਰਕੇ ਰਾਸ਼ੀਆਂ ਦੀ ਸਹੀ ਤੁਲਨਾ ਕਰੋ।`;
  }

  if (task === "chainEquivalence") {
    if (has(parameters, "equivalentA")) {
      return hi ? `जांचें कि ${n(parameters, "ratioA")}:${n(parameters, "ratioB")} और ${n(parameters, "equivalentA")}:${n(parameters, "equivalentB")} बराबर अनुपात हैं या नहीं।` : `ਜਾਂਚੋ ਕਿ ${n(parameters, "ratioA")}:${n(parameters, "ratioB")} ਅਤੇ ${n(parameters, "equivalentA")}:${n(parameters, "equivalentB")} ਬਰਾਬਰ ਅਨੁਪਾਤ ਹਨ ਜਾਂ ਨਹੀਂ।`;
    }
    const relation = hi ? chain3(parameters) : chain3Pa(parameters);
    return hi ? `${relation} हैं। दिए गए अंतिम अनुपात की सत्यता जांचें।` : `${relation} ਹਨ। ਦਿੱਤੇ ਅੰਤਿਮ ਅਨੁਪਾਤ ਦੀ ਸਹੀਤਾ ਜਾਂਚੋ।`;
  }

  return hi ? "दिए गए अनुपातों से मांगा गया मान ज्ञात करें।" : "ਦਿੱਤੇ ਅਨੁਪਾਤਾਂ ਤੋਂ ਮੰਗਿਆ ਮੁੱਲ ਲੱਭੋ।";
}

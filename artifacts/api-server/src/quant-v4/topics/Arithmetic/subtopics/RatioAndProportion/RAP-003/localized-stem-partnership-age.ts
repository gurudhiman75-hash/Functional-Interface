import type { Rap003Parameters } from "./types";

type Language = "hi" | "pa";

function v(p: Rap003Parameters, key: string) {
  return p.variables[key];
}

function label(p: Rap003Parameters, valueKey: string) {
  const value = String(v(p, valueKey) ?? "");
  if (value === String(v(p, "personB") ?? "")) return "B";
  if (value === String(v(p, "personC") ?? "")) return "C";
  return "A";
}

function partnership(p: Rap003Parameters, language: Language) {
  const hi = language === "hi";
  const task = p.taskKind;
  const target = label(p, "targetPartner");

  if (["partnershipProfitShare", "partnershipJoiningPartnerProfit", "partnershipLeavingPartnerProfit"].includes(task)) {
    return hi
      ? `A ₹${v(p, "investmentA")} को ${v(p, "timeA")} महीने और B ₹${v(p, "investmentB")} को ${v(p, "timeB")} महीने निवेश करता है। कुल लाभ ₹${v(p, "totalProfit")} है। ${target} का लाभांश ज्ञात करें।`
      : `A ₹${v(p, "investmentA")} ਨੂੰ ${v(p, "timeA")} ਮਹੀਨੇ ਅਤੇ B ₹${v(p, "investmentB")} ਨੂੰ ${v(p, "timeB")} ਮਹੀਨੇ ਨਿਵੇਸ਼ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਲਾਭ ₹${v(p, "totalProfit")} ਹੈ। ${target} ਦਾ ਲਾਭ-ਹਿੱਸਾ ਲੱਭੋ।`;
  }
  if (task === "partnershipLossShare") {
    return hi
      ? `A ₹${v(p, "investmentA")} को ${v(p, "timeA")} महीने और B ₹${v(p, "investmentB")} को ${v(p, "timeB")} महीने निवेश करता है। कुल हानि ₹${v(p, "totalLoss")} है। ${target} की हानि ज्ञात करें।`
      : `A ₹${v(p, "investmentA")} ਨੂੰ ${v(p, "timeA")} ਮਹੀਨੇ ਅਤੇ B ₹${v(p, "investmentB")} ਨੂੰ ${v(p, "timeB")} ਮਹੀਨੇ ਨਿਵੇਸ਼ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਘਾਟਾ ₹${v(p, "totalLoss")} ਹੈ। ${target} ਦਾ ਘਾਟਾ ਲੱਭੋ।`;
  }
  if (task === "partnershipMidPeriodChange") {
    return hi
      ? `A पहले ${v(p, "firstPeriod")} महीने ₹${v(p, "initialInvestmentA")} और अगले ${v(p, "secondPeriod")} महीने ₹${v(p, "changedInvestmentA")} निवेश करता है। B ₹${v(p, "investmentB")} को ${v(p, "timeB")} महीने निवेश करता है। ₹${v(p, "totalProfit")} के लाभ में ${target} का हिस्सा ज्ञात करें।`
      : `A ਪਹਿਲੇ ${v(p, "firstPeriod")} ਮਹੀਨੇ ₹${v(p, "initialInvestmentA")} ਅਤੇ ਅਗਲੇ ${v(p, "secondPeriod")} ਮਹੀਨੇ ₹${v(p, "changedInvestmentA")} ਨਿਵੇਸ਼ ਕਰਦਾ ਹੈ। B ₹${v(p, "investmentB")} ਨੂੰ ${v(p, "timeB")} ਮਹੀਨੇ ਨਿਵੇਸ਼ ਕਰਦਾ ਹੈ। ₹${v(p, "totalProfit")} ਦੇ ਲਾਭ ਵਿੱਚ ${target} ਦਾ ਹਿੱਸਾ ਲੱਭੋ।`;
  }
  if (task === "partnershipMidPeriodChangeBoth") {
    return hi
      ? `पहले ${v(p, "firstPeriod")} महीनों में A और B क्रमशः ₹${v(p, "initialInvestmentA")} तथा ₹${v(p, "initialInvestmentB")} निवेश करते हैं। अगले ${v(p, "secondPeriod")} महीनों में निवेश ₹${v(p, "changedInvestmentA")} तथा ₹${v(p, "changedInvestmentB")} हो जाता है। ₹${v(p, "totalProfit")} के लाभ में ${target} का हिस्सा ज्ञात करें।`
      : `ਪਹਿਲੇ ${v(p, "firstPeriod")} ਮਹੀਨਿਆਂ ਵਿੱਚ A ਅਤੇ B ਕ੍ਰਮਵਾਰ ₹${v(p, "initialInvestmentA")} ਅਤੇ ₹${v(p, "initialInvestmentB")} ਨਿਵੇਸ਼ ਕਰਦੇ ਹਨ। ਅਗਲੇ ${v(p, "secondPeriod")} ਮਹੀਨਿਆਂ ਵਿੱਚ ਨਿਵੇਸ਼ ₹${v(p, "changedInvestmentA")} ਅਤੇ ₹${v(p, "changedInvestmentB")} ਹੋ ਜਾਂਦਾ ਹੈ। ₹${v(p, "totalProfit")} ਦੇ ਲਾਭ ਵਿੱਚ ${target} ਦਾ ਹਿੱਸਾ ਲੱਭੋ।`;
  }
  if (task === "partnershipSalaryThenProfitShare") {
    const salary = label(p, "salaryPartner");
    return hi
      ? `${salary} को प्रबंधन के लिए ₹${v(p, "salaryAmount")} वेतन मिलता है। A और B क्रमशः ₹${v(p, "investmentA")} तथा ₹${v(p, "investmentB")} को ${v(p, "timeA")} तथा ${v(p, "timeB")} महीने निवेश करते हैं। कुल लाभ ₹${v(p, "totalProfit")} में ${target} का अंतिम हिस्सा ज्ञात करें।`
      : `${salary} ਨੂੰ ਪ੍ਰਬੰਧਨ ਲਈ ₹${v(p, "salaryAmount")} ਤਨਖਾਹ ਮਿਲਦੀ ਹੈ। A ਅਤੇ B ਕ੍ਰਮਵਾਰ ₹${v(p, "investmentA")} ਅਤੇ ₹${v(p, "investmentB")} ਨੂੰ ${v(p, "timeA")} ਅਤੇ ${v(p, "timeB")} ਮਹੀਨੇ ਨਿਵੇਸ਼ ਕਰਦੇ ਹਨ। ਕੁੱਲ ਲਾਭ ₹${v(p, "totalProfit")} ਵਿੱਚ ${target} ਦਾ ਅੰਤਿਮ ਹਿੱਸਾ ਲੱਭੋ।`;
  }
  if (task === "partnershipProfitFromKnownShare") {
    const known = label(p, "knownPartner");
    return hi
      ? `A और B क्रमशः ₹${v(p, "investmentA")} तथा ₹${v(p, "investmentB")} को ${v(p, "timeA")} तथा ${v(p, "timeB")} महीने निवेश करते हैं। ${known} का लाभांश ₹${v(p, "knownShare")} है। कुल लाभ ज्ञात करें।`
      : `A ਅਤੇ B ਕ੍ਰਮਵਾਰ ₹${v(p, "investmentA")} ਅਤੇ ₹${v(p, "investmentB")} ਨੂੰ ${v(p, "timeA")} ਅਤੇ ${v(p, "timeB")} ਮਹੀਨੇ ਨਿਵੇਸ਼ ਕਰਦੇ ਹਨ। ${known} ਦਾ ਲਾਭ-ਹਿੱਸਾ ₹${v(p, "knownShare")} ਹੈ। ਕੁੱਲ ਲਾਭ ਲੱਭੋ।`;
  }
  if (task === "partnershipCapitalRatioTimeRatio") {
    return hi
      ? `A और B की पूंजी का अनुपात ${v(p, "capitalRatioA")}:${v(p, "capitalRatioB")} तथा निवेश समय का अनुपात ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} है। लाभ-विभाजन अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਪੂੰਜੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "capitalRatioA")}:${v(p, "capitalRatioB")} ਅਤੇ ਨਿਵੇਸ਼ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} ਹੈ। ਲਾਭ-ਵੰਡ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (task === "workContributionShare") {
    return hi
      ? `A और B की कार्यक्षमता का अनुपात ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} है। वे क्रमशः ${v(p, "daysA")} और ${v(p, "daysB")} दिन काम करते हैं। काम के योगदान का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} ਹੈ। ਉਹ ਕ੍ਰਮਵਾਰ ${v(p, "daysA")} ਅਤੇ ${v(p, "daysB")} ਦਿਨ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੰਮ ਦੇ ਯੋਗਦਾਨ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (task === "partnershipNewPartnerCapital") {
    return hi
      ? `A ₹${v(p, "investmentA")} को ${v(p, "timeA")} महीने निवेश करता है। B ${v(p, "timeB")} महीने निवेश करता है। लाभ अनुपात ${v(p, "profitRatioA")}:${v(p, "profitRatioB")} रखने के लिए B को कितनी राशि निवेश करनी चाहिए?`
      : `A ₹${v(p, "investmentA")} ਨੂੰ ${v(p, "timeA")} ਮਹੀਨੇ ਨਿਵੇਸ਼ ਕਰਦਾ ਹੈ। B ${v(p, "timeB")} ਮਹੀਨੇ ਨਿਵੇਸ਼ ਕਰਦਾ ਹੈ। ਲਾਭ ਅਨੁਪਾਤ ${v(p, "profitRatioA")}:${v(p, "profitRatioB")} ਰੱਖਣ ਲਈ B ਨੂੰ ਕਿੰਨੀ ਰਕਮ ਨਿਵੇਸ਼ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?`;
  }
  if (task === "partnershipTimeFromProfitRatio") {
    return hi
      ? `A ₹${v(p, "investmentA")} को ${v(p, "timeA")} महीने और B ₹${v(p, "investmentB")} निवेश करता है। लाभ अनुपात ${v(p, "profitRatioA")}:${v(p, "profitRatioB")} है। B ने कितने महीने निवेश किया?`
      : `A ₹${v(p, "investmentA")} ਨੂੰ ${v(p, "timeA")} ਮਹੀਨੇ ਅਤੇ B ₹${v(p, "investmentB")} ਨਿਵੇਸ਼ ਕਰਦਾ ਹੈ। ਲਾਭ ਅਨੁਪਾਤ ${v(p, "profitRatioA")}:${v(p, "profitRatioB")} ਹੈ। B ਨੇ ਕਿੰਨੇ ਮਹੀਨੇ ਨਿਵੇਸ਼ ਕੀਤਾ?`;
  }
  if (task === "partnershipTargetPartnerShareFromRatio") {
    return hi
      ? `A और B की प्रभावी पूंजी का अनुपात ${v(p, "effectiveRatioA")}:${v(p, "effectiveRatioB")} है। कुल लाभ ₹${v(p, "totalProfit")} में ${target} का हिस्सा ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਪ੍ਰਭਾਵੀ ਪੂੰਜੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "effectiveRatioA")}:${v(p, "effectiveRatioB")} ਹੈ। ਕੁੱਲ ਲਾਭ ₹${v(p, "totalProfit")} ਵਿੱਚ ${target} ਦਾ ਹਿੱਸਾ ਲੱਭੋ।`;
  }
  if (task === "partnershipRemainingProfitAfterCommission") {
    return hi
      ? `कुल लाभ ₹${v(p, "totalProfit")} में से ₹${v(p, "commission")} कमीशन घटाया जाता है। A और B क्रमशः ₹${v(p, "investmentA")} तथा ₹${v(p, "investmentB")} को ${v(p, "timeA")} तथा ${v(p, "timeB")} महीने निवेश करते हैं। बची राशि में ${target} का हिस्सा ज्ञात करें।`
      : `ਕੁੱਲ ਲਾਭ ₹${v(p, "totalProfit")} ਵਿੱਚੋਂ ₹${v(p, "commission")} ਕਮਿਸ਼ਨ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ। A ਅਤੇ B ਕ੍ਰਮਵਾਰ ₹${v(p, "investmentA")} ਅਤੇ ₹${v(p, "investmentB")} ਨੂੰ ${v(p, "timeA")} ਅਤੇ ${v(p, "timeB")} ਮਹੀਨੇ ਨਿਵੇਸ਼ ਕਰਦੇ ਹਨ। ਬਚੀ ਰਕਮ ਵਿੱਚ ${target} ਦਾ ਹਿੱਸਾ ਲੱਭੋ।`;
  }
  return undefined;
}

function age(p: Rap003Parameters, language: Language) {
  const hi = language === "hi";
  const task = p.taskKind;
  const target = label(p, "targetPerson");
  if (task === "agePresentFromFutureRatio" || task === "ageDoubleHalfWording") {
    const futureA = v(p, "futureRatioA") ?? v(p, "relationFactor");
    const futureB = v(p, "futureRatioB") ?? 1;
    return hi
      ? `A और B की वर्तमान आयु का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} है। ${v(p, "shiftYears")} वर्ष बाद अनुपात ${futureA}:${futureB} होगा। ${target} की वर्तमान आयु ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਹੈ। ${v(p, "shiftYears")} ਸਾਲ ਬਾਅਦ ਅਨੁਪਾਤ ${futureA}:${futureB} ਹੋਵੇਗਾ। ${target} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਲੱਭੋ।`;
  }
  if (task === "agePresentFromPastRatio") {
    return hi
      ? `A और B की वर्तमान आयु का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} है। ${v(p, "shiftYears")} वर्ष पहले अनुपात ${v(p, "pastRatioA")}:${v(p, "pastRatioB")} था। ${target} की वर्तमान आयु ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਹੈ। ${v(p, "shiftYears")} ਸਾਲ ਪਹਿਲਾਂ ਅਨੁਪਾਤ ${v(p, "pastRatioA")}:${v(p, "pastRatioB")} ਸੀ। ${target} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਲੱਭੋ।`;
  }
  if (task === "ageYearsToReachRatio") {
    return hi
      ? `A और B की वर्तमान आयु ${v(p, "presentAgeA")} तथा ${v(p, "presentAgeB")} वर्ष है। कितने वर्ष बाद आयु अनुपात ${v(p, "futureRatioA")}:${v(p, "futureRatioB")} होगा?`
      : `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ${v(p, "presentAgeA")} ਅਤੇ ${v(p, "presentAgeB")} ਸਾਲ ਹੈ। ਕਿੰਨੇ ਸਾਲ ਬਾਅਦ ਉਮਰ ਅਨੁਪਾਤ ${v(p, "futureRatioA")}:${v(p, "futureRatioB")} ਹੋਵੇਗਾ?`;
  }
  if (task === "ageYearsToReachPastRatio") {
    return hi
      ? `A और B की वर्तमान आयु ${v(p, "presentAgeA")} तथा ${v(p, "presentAgeB")} वर्ष है। कितने वर्ष पहले आयु अनुपात ${v(p, "pastRatioA")}:${v(p, "pastRatioB")} था?`
      : `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ${v(p, "presentAgeA")} ਅਤੇ ${v(p, "presentAgeB")} ਸਾਲ ਹੈ। ਕਿੰਨੇ ਸਾਲ ਪਹਿਲਾਂ ਉਮਰ ਅਨੁਪਾਤ ${v(p, "pastRatioA")}:${v(p, "pastRatioB")} ਸੀ?`;
  }
  if (task === "ageFromDifferenceAndRatio") {
    return hi
      ? `A और B की आयु का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} तथा अंतर ${v(p, "ageDifference")} वर्ष है। ${target} की आयु ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਅਤੇ ਅੰਤਰ ${v(p, "ageDifference")} ਸਾਲ ਹੈ। ${target} ਦੀ ਉਮਰ ਲੱਭੋ।`;
  }
  if (task === "ageFromSumAndRatio") {
    return hi
      ? `A और B की आयु का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} और कुल आयु ${v(p, "ageSum")} वर्ष है। ${target} की आयु ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਅਤੇ ਕੁੱਲ ਉਮਰ ${v(p, "ageSum")} ਸਾਲ ਹੈ। ${target} ਦੀ ਉਮਰ ਲੱਭੋ।`;
  }
  if (task === "ageFutureRatioFromPresent") {
    return hi
      ? `A और B की वर्तमान आयु ${v(p, "presentAgeA")} तथा ${v(p, "presentAgeB")} वर्ष है। ${v(p, "shiftYears")} वर्ष बाद उनकी आयु का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ${v(p, "presentAgeA")} ਅਤੇ ${v(p, "presentAgeB")} ਸਾਲ ਹੈ। ${v(p, "shiftYears")} ਸਾਲ ਬਾਅਦ ਉਨ੍ਹਾਂ ਦੀ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (task === "agePastRatioFromPresent") {
    return hi
      ? `A और B की वर्तमान आयु ${v(p, "presentAgeA")} तथा ${v(p, "presentAgeB")} वर्ष है। ${v(p, "shiftYears")} वर्ष पहले उनकी आयु का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ${v(p, "presentAgeA")} ਅਤੇ ${v(p, "presentAgeB")} ਸਾਲ ਹੈ। ${v(p, "shiftYears")} ਸਾਲ ਪਹਿਲਾਂ ਉਨ੍ਹਾਂ ਦੀ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (task === "ageThreePersonSumRatio") {
    return hi
      ? `A, B और C की आयु का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")}:${v(p, "ratioC")} और कुल आयु ${v(p, "ageSum")} वर्ष है। ${target} की आयु ज्ञात करें।`
      : `A, B ਅਤੇ C ਦੀ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")}:${v(p, "ratioC")} ਅਤੇ ਕੁੱਲ ਉਮਰ ${v(p, "ageSum")} ਸਾਲ ਹੈ। ${target} ਦੀ ਉਮਰ ਲੱਭੋ।`;
  }
  if (task === "ageThreePersonKnownAge") {
    const known = label(p, "knownPerson");
    return hi
      ? `A, B और C की आयु का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")}:${v(p, "ratioC")} है। ${known} की आयु ${v(p, "knownAge")} वर्ष है। ${target} की आयु ज्ञात करें।`
      : `A, B ਅਤੇ C ਦੀ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")}:${v(p, "ratioC")} ਹੈ। ${known} ਦੀ ਉਮਰ ${v(p, "knownAge")} ਸਾਲ ਹੈ। ${target} ਦੀ ਉਮਰ ਲੱਭੋ।`;
  }
  if (task === "ageAverageAndRatio" || task === "ageAverageThreePersonRatio") {
    const three = v(p, "ratioC") !== undefined;
    const ratio = three ? `${v(p, "ratioA")}:${v(p, "ratioB")}:${v(p, "ratioC")}` : `${v(p, "ratioA")}:${v(p, "ratioB")}`;
    return hi
      ? `${three ? "A, B और C" : "A और B"} की औसत आयु ${v(p, "averageAge")} वर्ष तथा आयु अनुपात ${ratio} है। ${target} की आयु ज्ञात करें।`
      : `${three ? "A, B ਅਤੇ C" : "A ਅਤੇ B"} ਦੀ ਔਸਤ ਉਮਰ ${v(p, "averageAge")} ਸਾਲ ਅਤੇ ਉਮਰ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${target} ਦੀ ਉਮਰ ਲੱਭੋ।`;
  }
  if (task === "ageFutureSumAndPresentRatio") {
    return hi
      ? `A और B की वर्तमान आयु का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} है। ${v(p, "shiftYears")} वर्ष बाद कुल आयु ${v(p, "futureSum")} वर्ष होगी। ${target} की वर्तमान आयु ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਹੈ। ${v(p, "shiftYears")} ਸਾਲ ਬਾਅਦ ਕੁੱਲ ਉਮਰ ${v(p, "futureSum")} ਸਾਲ ਹੋਵੇਗੀ। ${target} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਲੱਭੋ।`;
  }
  if (task === "agePastSumAndPresentRatio") {
    return hi
      ? `A और B की वर्तमान आयु का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} है। ${v(p, "shiftYears")} वर्ष पहले कुल आयु ${v(p, "pastSum")} वर्ष थी। ${target} की वर्तमान आयु ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਹੈ। ${v(p, "shiftYears")} ਸਾਲ ਪਹਿਲਾਂ ਕੁੱਲ ਉਮਰ ${v(p, "pastSum")} ਸਾਲ ਸੀ। ${target} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਲੱਭੋ।`;
  }
  return undefined;
}

export function renderLocalizedRap003PartnershipAgeStem(p: Rap003Parameters) {
  if (p.language === "en") return undefined;
  const language = p.language as Language;
  if (p.canonicalProblemId === "RAP-CP-013") return partnership(p, language);
  if (p.canonicalProblemId === "RAP-CP-014") return age(p, language);
  return undefined;
}

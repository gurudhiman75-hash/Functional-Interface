import type { Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer } from "./types";

function finalLine(parameters: Prt001PilotParameters, answer: Prt001TaskAnswer): string {
  if (parameters.language === "hi") return `अतः आवश्यक उत्तर ${answer.display} है।`;
  if (parameters.language === "pa") return `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${answer.display} ਹੈ।`;
  return `Therefore, the required answer is ${answer.display}.`;
}

export function renderPrt001E3BExplanation(input: { parameters: Prt001PilotParameters; solution: Prt001Solution; answer: Prt001TaskAnswer; }): string[] {
  const { parameters, solution, answer } = input;
  const ratio = solution.normalizedRatio.join(":");
  const final = finalLine(parameters, answer);
  const mode = parameters.entry.solveMode;

  if (parameters.language === "hi") {
    if (mode === "findEqualFinalReceiptsConditionWithRemuneration") return [`बिना वेतन के लाभ-वितरण अनुपात ${ratio} है।`, "वेतन पहले दिया जाता है और शेष लाभ इसी अनुपात में बाँटा जाता है; दोनों अंतिम प्राप्तियों को बराबर रखकर वेतन का समीकरण हल करते हैं।", final];
    if (mode === "findReverseContributionFromMixedPartnerRelations") return ["पहले कार्यकारी भागीदार की अंतिम प्राप्ति में से वेतन हटाकर दोनों के वास्तविक लाभांशों का अनुपात निकालते हैं।", `${parameters.partnerA} की बदलती पूंजी से उसका पूंजी-माह योगदान मिलता है; उसी अनुपात से देर से जुड़े ${parameters.partnerB} का आवश्यक योगदान और फिर उसकी पूंजी मिलती है।`, final];
    if (mode === "findUnknownCapitalFromProfitRatio") return ["समान निवेश अवधि में लाभ अनुपात सीधे पूंजी अनुपात के बराबर होता है।", `इसलिए ${parameters.partnerB} की ज्ञात पूंजी को दिए गए लाभ अनुपात में स्केल करके ${parameters.partnerA} की पूंजी मिलती है।`, final];
    if (mode === "findTotalProfitFromPartnerShareCapitalDuration") return [`पूंजी × समय से लाभ अनुपात ${ratio} मिलता है।`, "दिए गए भागीदार का लाभांश उसके अनुपातिक भागों के बराबर है; उसी से एक भाग और फिर कुल लाभ निकालते हैं।", final];
    if (mode === "findUnknownJoinTimeFromPartnerShare") return ["दिए गए हिस्से और कुल लाभ से देर से जुड़े भागीदार का अनुपातिक योगदान तय होता है।", "उस योगदान को उसकी पूंजी से विभाजित करने पर सक्रिय अवधि मिलती है; 12 महीनों से घटाने पर शामिल होने का समय मिलता है।", final];
    if (mode === "findUnknownWithdrawnCapitalFromProfitRatio") return [`दिए गए लाभ अनुपात से ${parameters.partnerA} का आवश्यक कुल पूंजी-माह योगदान तय होता है।`, "पहले और बाद के समय-खंडों का समीकरण हल करके निकासी के बाद की पूंजी मिलती है; प्रारंभिक पूंजी से घटाने पर निकाली गई राशि मिलती है।", final];
    return [`तीनों भागीदारों का प्रभावी पूंजी-समय अनुपात ${ratio} है।`, "पहले दो भागीदारों के हिस्सों का अंतर अनुपात के अंतर वाले भागों से मेल खाता है; तीसरे भागीदार सहित सभी भागों पर स्केल करने से कुल लाभ मिलता है।", final];
  }

  if (parameters.language === "pa") {
    if (mode === "findEqualFinalReceiptsConditionWithRemuneration") return [`ਤਨਖਾਹ ਤੋਂ ਬਿਨਾਂ ਮੁਨਾਫ਼ਾ ਵੰਡ ਅਨੁਪਾਤ ${ratio} ਹੈ।`, "ਤਨਖਾਹ ਪਹਿਲਾਂ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਬਾਕੀ ਮੁਨਾਫ਼ਾ ਇਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਦਾ ਹੈ; ਦੋਹਾਂ ਅੰਤਿਮ ਪ੍ਰਾਪਤੀਆਂ ਨੂੰ ਬਰਾਬਰ ਰੱਖ ਕੇ ਤਨਖਾਹ ਦਾ ਸਮੀਕਰਨ ਹੱਲ ਕਰਦੇ ਹਾਂ।", final];
    if (mode === "findReverseContributionFromMixedPartnerRelations") return ["ਪਹਿਲਾਂ ਕੰਮਕਾਜੀ ਭਾਗੀਦਾਰ ਦੀ ਅੰਤਿਮ ਪ੍ਰਾਪਤੀ ਵਿੱਚੋਂ ਤਨਖਾਹ ਹਟਾ ਕੇ ਅਸਲ ਵੰਡੇ ਹਿੱਸਿਆਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢਦੇ ਹਾਂ।", `${parameters.partnerA} ਦੀ ਬਦਲਦੀ ਪੂੰਜੀ ਤੋਂ ਉਸਦਾ ਪੂੰਜੀ-ਮਹੀਨਾ ਯੋਗਦਾਨ ਮਿਲਦਾ ਹੈ; ਉਸੇ ਅਨੁਪਾਤ ਤੋਂ ਦੇਰ ਨਾਲ ਜੁੜੇ ${parameters.partnerB} ਦਾ ਲੋੜੀਂਦਾ ਯੋਗਦਾਨ ਅਤੇ ਫਿਰ ਪੂੰਜੀ ਮਿਲਦੀ ਹੈ।`, final];
    if (mode === "findUnknownCapitalFromProfitRatio") return ["ਇੱਕੋ ਨਿਵੇਸ਼ ਮਿਆਦ ਵਿੱਚ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਸਿੱਧਾ ਪੂੰਜੀ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।", `ਇਸ ਲਈ ${parameters.partnerB} ਦੀ ਦਿੱਤੀ ਪੂੰਜੀ ਨੂੰ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਅਨੁਸਾਰ ਸਕੇਲ ਕਰਕੇ ${parameters.partnerA} ਦੀ ਪੂੰਜੀ ਮਿਲਦੀ ਹੈ।`, final];
    if (mode === "findTotalProfitFromPartnerShareCapitalDuration") return [`ਪੂੰਜੀ × ਸਮੇਂ ਤੋਂ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ${ratio} ਮਿਲਦਾ ਹੈ।`, "ਦਿੱਤਾ ਹਿੱਸਾ ਉਸਦੇ ਅਨੁਪਾਤੀ ਭਾਗਾਂ ਦੀ ਕੀਮਤ ਦਿੰਦਾ ਹੈ; ਉਸ ਤੋਂ ਇੱਕ ਭਾਗ ਅਤੇ ਫਿਰ ਕੁੱਲ ਮੁਨਾਫ਼ਾ ਕੱਢਦੇ ਹਾਂ।", final];
    if (mode === "findUnknownJoinTimeFromPartnerShare") return ["ਦਿੱਤੇ ਹਿੱਸੇ ਅਤੇ ਕੁੱਲ ਮੁਨਾਫ਼ੇ ਤੋਂ ਦੇਰ ਨਾਲ ਜੁੜੇ ਭਾਗੀਦਾਰ ਦਾ ਅਨੁਪਾਤੀ ਯੋਗਦਾਨ ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ।", "ਉਸ ਯੋਗਦਾਨ ਨੂੰ ਪੂੰਜੀ ਨਾਲ ਵੰਡ ਕੇ ਸਰਗਰਮ ਮਿਆਦ ਮਿਲਦੀ ਹੈ; 12 ਮਹੀਨਿਆਂ ਵਿੱਚੋਂ ਘਟਾ ਕੇ ਸ਼ਾਮਲ ਹੋਣ ਦਾ ਸਮਾਂ ਮਿਲਦਾ ਹੈ।", final];
    if (mode === "findUnknownWithdrawnCapitalFromProfitRatio") return [`ਦਿੱਤੇ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਤੋਂ ${parameters.partnerA} ਦਾ ਲੋੜੀਂਦਾ ਕੁੱਲ ਪੂੰਜੀ-ਮਹੀਨਾ ਯੋਗਦਾਨ ਮਿਲਦਾ ਹੈ।`, "ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦੇ ਸਮਾਂ-ਖੰਡਾਂ ਦਾ ਸਮੀਕਰਨ ਹੱਲ ਕਰਕੇ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਦੀ ਪੂੰਜੀ ਮਿਲਦੀ ਹੈ; ਸ਼ੁਰੂਆਤੀ ਪੂੰਜੀ ਤੋਂ ਘਟਾ ਕੇ ਕੱਢੀ ਰਕਮ ਮਿਲਦੀ ਹੈ।", final];
    return [`ਤਿੰਨਾਂ ਭਾਗੀਦਾਰਾਂ ਦਾ ਪ੍ਰਭਾਵੀ ਪੂੰਜੀ-ਸਮਾਂ ਅਨੁਪਾਤ ${ratio} ਹੈ।`, "ਪਹਿਲੇ ਦੋ ਹਿੱਸਿਆਂ ਦਾ ਫਰਕ ਅਨੁਪਾਤ ਦੇ ਫਰਕ ਵਾਲੇ ਭਾਗਾਂ ਨਾਲ ਮਿਲਦਾ ਹੈ; ਤੀਜੇ ਭਾਗੀਦਾਰ ਸਮੇਤ ਸਾਰੇ ਭਾਗਾਂ ਉੱਤੇ ਸਕੇਲ ਕਰਕੇ ਕੁੱਲ ਮੁਨਾਫ਼ਾ ਮਿਲਦਾ ਹੈ।", final];
  }

  if (mode === "findEqualFinalReceiptsConditionWithRemuneration") return [`Without salary, the distributable profit follows the capital ratio ${ratio}.`, "Pay salary first, split the remainder in that ratio, and set the two final receipts equal to solve for the required salary.", final];
  if (mode === "findReverseContributionFromMixedPartnerRelations") return ["Remove salary from the working partner's final receipt to recover the ratio of actual distributed shares.", `${parameters.partnerA}'s changing capital gives its capital-month weight; use the receipt ratio to recover ${parameters.partnerB}'s required weight, then divide by the late-join duration to get the capital.`, final];
  if (mode === "findUnknownCapitalFromProfitRatio") return ["With equal investment periods, the profit ratio is exactly the capital ratio.", `Scale ${parameters.partnerB}'s known capital by the stated profit ratio to obtain ${parameters.partnerA}'s capital.`, final];
  if (mode === "findTotalProfitFromPartnerShareCapitalDuration") return [`Capital × time gives the profit ratio ${ratio}.`, "The known partner share represents its ratio parts; find one part and scale to all parts for total profit.", final];
  if (mode === "findUnknownJoinTimeFromPartnerShare") return ["The known share and total profit determine the late-joining partner's proportional contribution.", "Divide that effective contribution by the partner's capital to get active duration, then subtract from 12 months to get the joining time.", final];
  if (mode === "findUnknownWithdrawnCapitalFromProfitRatio") return [`The stated profit ratio fixes ${parameters.partnerA}'s required total capital-month contribution.`, "Solve the before-and-after capital equation for the post-withdrawal capital, then subtract it from the initial capital to get the amount withdrawn.", final];
  return [`The three effective capital-time contributions reduce to ${ratio}.`, "The difference between the first two shares corresponds to the difference in their ratio parts; scale that value across all three partners to recover total profit.", final];
}

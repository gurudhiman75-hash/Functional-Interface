import type { Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer } from "./types";

function finalLine(parameters: Prt001PilotParameters, answer: Prt001TaskAnswer): string {
  if (parameters.language === "hi") return `अतः आवश्यक उत्तर ${answer.display} है।`;
  if (parameters.language === "pa") return `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${answer.display} ਹੈ।`;
  return `Therefore, the required answer is ${answer.display}.`;
}

export function renderPrt001E3AExplanation(input: { parameters: Prt001PilotParameters; solution: Prt001Solution; answer: Prt001TaskAnswer; }): string[] {
  const { parameters, solution, answer } = input;
  const ratio = solution.normalizedRatio.join(":");
  const final = finalLine(parameters, answer);
  const mode = parameters.entry.solveMode;

  if (parameters.language === "hi") {
    if (mode === "findTotalProfitFromShareDifferenceAndWeights") return [`पूंजी × समय से लाभ अनुपात ${ratio} मिलता है।`, "दिए गए लाभांश-अंतर को अनुपात के अंतर वाले भागों से मिलाकर एक भाग का मूल्य और फिर सभी भागों का कुल लाभ निकालते हैं।", final];
    if (mode === "findUnknownPercentageCapitalChange") return [`दिए गए लाभ अनुपात से ${parameters.partnerA} का आवश्यक कुल पूंजी-माह योगदान तय होता है।`, "पहले बदली हुई पूंजी निकालते हैं; फिर वृद्धि को प्रारंभिक पूंजी से तुलना करके प्रतिशत वृद्धि मिलती है।", final];
    if (mode === "findInitialCapitalFromFinalShareAndChangeHistory") return [`दिए गए हिस्से और कुल लाभ से ${parameters.partnerA} का आवश्यक प्रभावी योगदान तय होता है।`, "पूंजी बढ़ने के बाद वाले अतिरिक्त योगदान को अलग करके शेष 12 महीनों के आधार योगदान से प्रारंभिक पूंजी मिलती है।", final];
    if (mode === "findDurationRatioFromPartnerShareRelations") return ["लाभ अनुपात प्रभावी पूंजी-माह अनुपात है।", "हर भागीदार के लाभ-भाग को उसकी पूंजी से विभाजित करके निवेश अवधि के अनुपाती मान मिलते हैं; उन्हें सरल अनुपात में लिखते हैं।", final];
    if (mode === "findUnknownCommissionPercentFromFinalReceipt") return [`पहले बिना कमीशन वाला पूंजी-अनुपात हिस्सा ${ratio} से तय होता है।`, "अंतिम प्राप्ति में अतिरिक्त कमीशन का प्रभाव अलग करके उसे सकल लाभ के प्रतिशत में बदलते हैं।", final];
    if (mode === "findUnknownDeductionFromPartnerShare") return [`पूंजी अनुपात ${ratio} से दिए गए हिस्से के आधार पर वास्तविक वितरण योग्य लाभ निकालते हैं।`, "सकल लाभ और वितरण योग्य लाभ का अंतर ही वितरण से पहले की कटौती है।", final];
    return ["कार्यकारी भागीदार की अंतिम प्राप्ति में वेतन भी शामिल है।", "उसकी अंतिम प्राप्ति में से वेतन हटाकर शुद्ध लाभांश लेते हैं और दूसरे भागीदार के लाभांश से तुलना करके वितरण अनुपात मिलता है।", final];
  }

  if (parameters.language === "pa") {
    if (mode === "findTotalProfitFromShareDifferenceAndWeights") return [`ਪੂੰਜੀ × ਸਮੇਂ ਤੋਂ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ${ratio} ਮਿਲਦਾ ਹੈ।`, "ਦਿੱਤੇ ਹਿੱਸਾ-ਫਰਕ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਫਰਕ ਵਾਲੇ ਭਾਗਾਂ ਨਾਲ ਮਿਲਾ ਕੇ ਇੱਕ ਭਾਗ ਦੀ ਕੀਮਤ ਅਤੇ ਫਿਰ ਸਾਰੇ ਭਾਗਾਂ ਦਾ ਕੁੱਲ ਮੁਨਾਫ਼ਾ ਕੱਢਦੇ ਹਾਂ।", final];
    if (mode === "findUnknownPercentageCapitalChange") return [`ਦਿੱਤੇ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਤੋਂ ${parameters.partnerA} ਦਾ ਲੋੜੀਂਦਾ ਕੁੱਲ ਪੂੰਜੀ-ਮਹੀਨਾ ਯੋਗਦਾਨ ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ।`, "ਪਹਿਲਾਂ ਬਦਲੀ ਪੂੰਜੀ ਕੱਢਦੇ ਹਾਂ; ਫਿਰ ਵਾਧੇ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਪੂੰਜੀ ਨਾਲ ਤੁਲਨਾ ਕਰਕੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਮਿਲਦਾ ਹੈ।", final];
    if (mode === "findInitialCapitalFromFinalShareAndChangeHistory") return [`ਦਿੱਤੇ ਹਿੱਸੇ ਅਤੇ ਕੁੱਲ ਮੁਨਾਫ਼ੇ ਤੋਂ ${parameters.partnerA} ਦਾ ਲੋੜੀਂਦਾ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨ ਮਿਲਦਾ ਹੈ।`, "ਵਾਧੂ ਪੂੰਜੀ ਦੇ ਬਾਅਦ ਵਾਲੇ ਵਾਧੂ ਯੋਗਦਾਨ ਨੂੰ ਹਟਾ ਕੇ ਬਾਕੀ 12 ਮਹੀਨਿਆਂ ਦੇ ਆਧਾਰ ਯੋਗਦਾਨ ਤੋਂ ਸ਼ੁਰੂਆਤੀ ਪੂੰਜੀ ਮਿਲਦੀ ਹੈ।", final];
    if (mode === "findDurationRatioFromPartnerShareRelations") return ["ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਪ੍ਰਭਾਵੀ ਪੂੰਜੀ-ਮਹੀਨਾ ਅਨੁਪਾਤ ਹੈ।", "ਹਰ ਮੁਨਾਫ਼ਾ-ਭਾਗ ਨੂੰ ਸੰਬੰਧਿਤ ਪੂੰਜੀ ਨਾਲ ਵੰਡ ਕੇ ਨਿਵੇਸ਼ ਮਿਆਦਾਂ ਦੇ ਅਨੁਪਾਤੀ ਮੁੱਲ ਮਿਲਦੇ ਹਨ।", final];
    if (mode === "findUnknownCommissionPercentFromFinalReceipt") return [`ਕਮਿਸ਼ਨ ਤੋਂ ਬਿਨਾਂ ਪੂੰਜੀ-ਅਨੁਪਾਤ ਵਾਲਾ ਹਿੱਸਾ ${ratio} ਤੋਂ ਮਿਲਦਾ ਹੈ।`, "ਅੰਤਿਮ ਪ੍ਰਾਪਤੀ ਵਿੱਚੋਂ ਇਸ ਅਨੁਪਾਤੀ ਹਿੱਸੇ ਦਾ ਅਸਰ ਵੱਖ ਕਰਕੇ ਬਾਕੀ ਵਾਧੇ ਨੂੰ ਸਕਲ ਮੁਨਾਫ਼ੇ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲਦੇ ਹਾਂ।", final];
    if (mode === "findUnknownDeductionFromPartnerShare") return [`ਪੂੰਜੀ ਅਨੁਪਾਤ ${ratio} ਅਤੇ ਦਿੱਤੇ ਹਿੱਸੇ ਤੋਂ ਅਸਲ ਵੰਡਣ ਯੋਗ ਮੁਨਾਫ਼ਾ ਮਿਲਦਾ ਹੈ।`, "ਸਕਲ ਮੁਨਾਫ਼ੇ ਅਤੇ ਵੰਡਣ ਯੋਗ ਮੁਨਾਫ਼ੇ ਦਾ ਫਰਕ ਹੀ ਪਹਿਲਾਂ ਕੀਤੀ ਕਟੌਤੀ ਹੈ।", final];
    return ["ਕੰਮਕਾਜੀ ਭਾਗੀਦਾਰ ਦੀ ਅੰਤਿਮ ਪ੍ਰਾਪਤੀ ਵਿੱਚ ਤਨਖਾਹ ਵੀ ਸ਼ਾਮਲ ਹੈ।", "ਉਸਦੀ ਅੰਤਿਮ ਪ੍ਰਾਪਤੀ ਵਿੱਚੋਂ ਤਨਖਾਹ ਹਟਾ ਕੇ ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ-ਹਿੱਸਾ ਲੈਂਦੇ ਹਾਂ ਅਤੇ ਦੂਜੇ ਭਾਗੀਦਾਰ ਦੇ ਹਿੱਸੇ ਨਾਲ ਤੁਲਨਾ ਕਰਕੇ ਵੰਡ ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ।", final];
  }

  if (mode === "findTotalProfitFromShareDifferenceAndWeights") return [`Capital × time gives the profit ratio ${ratio}.`, "Match the stated share difference to the difference in ratio parts, find the value of one part, then scale to all parts for total profit.", final];
  if (mode === "findUnknownPercentageCapitalChange") return [`The stated profit ratio fixes ${parameters.partnerA}'s required total capital-month contribution.`, "Use the two time segments to recover the changed capital, then compare the increase with the initial capital to obtain the percentage increase.", final];
  if (mode === "findInitialCapitalFromFinalShareAndChangeHistory") return [`The known share and total profit fix ${parameters.partnerA}'s required effective contribution.`, "Remove the extra contribution created by the later capital addition; the remaining twelve-month base contribution gives the initial capital.", final];
  if (mode === "findDurationRatioFromPartnerShareRelations") return ["Profit ratio is the ratio of effective capital-time contributions.", "Divide each profit-ratio part by the corresponding capital to get proportional investment periods, then reduce them.", final];
  if (mode === "findUnknownCommissionPercentFromFinalReceipt") return [`The ordinary ratio share is determined by the capital ratio ${ratio}.`, "Separate the extra amount caused by the gross-profit commission from the final receipt and express it as a percentage of gross profit.", final];
  if (mode === "findUnknownDeductionFromPartnerShare") return [`Use the capital ratio ${ratio} and the known partner share to recover the actual distributable pool.`, "The difference between gross profit and that pool is the fixed deduction made before distribution.", final];
  return ["The working partner's final receipt contains both salary and a share of the remaining profit.", "Remove the salary from that receipt, then compare the two distributed shares to recover the underlying profit-sharing ratio.", final];
}

import { formatRational } from "./math";
import type { Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer } from "./types";

export function renderPrt001E4Explanation(input: { parameters: Prt001PilotParameters; solution: Prt001Solution; answer: Prt001TaskAnswer }): string[] {
  const { parameters, solution, answer } = input;
  const names = solution.timeline.weights.map((item) => item.partnerId);
  const weights = solution.timeline.weights.map((item) => formatRational(item.effectiveCapital));
  const ratio = solution.normalizedRatio.join(":");
  const pairWeights = names.map((name, index) => `${name}: ${weights[index]}`).join(", ");
  const mode = parameters.entry.solveMode;

  if (parameters.language === "hi") {
    switch (mode) {
      case "findOtherPartnerShareFromKnownShareAndCapitals": return [`समान अवधि में लाभ अनुपात पूंजी अनुपात के बराबर है, अर्थात ${ratio}।`, "दिए गए भागीदार के लाभांश से एक अनुपात-भाग का मूल्य निकालकर दूसरे भागीदार के भागों पर लागू करते हैं।", `अतः दूसरे भागीदार का लाभांश ${answer.display} है।`];
      case "findCapitalRatioFromProfitShares": return ["निवेश अवधि समान होने से पूंजी और लाभांश का अनुपात एक ही होता है।", `दिए गए लाभांशों को सरल करने पर अनुपात ${ratio} मिलता है।`, `अतः पूंजी अनुपात ${answer.display} है।`];
      case "findLossShareFromCapitals": return [`समान अवधि में हानि भी पूंजी अनुपात ${ratio} में बाँटी जाती है।`, "कुल हानि को कुल अनुपात-भागों में बाँटकर पूछे गए भागीदार के हिस्से के अनुसार राशि लेते हैं।", `अतः वह ${answer.display} की हानि वहन करेगा।`];
      case "findIndividualCapitalsFromTotalCapitalAndProfitRatio": return [`समान अवधि के कारण दिया गया लाभ अनुपात ${ratio} ही पूंजी अनुपात है।`, "कुल पूंजी को अनुपात के कुल भागों में बाँटकर पहले भागीदार के भाग लिए जाते हैं।", `अतः आवश्यक पूंजी ${answer.display} है।`];
      case "findCapitalForEqualProfitGivenDurations": return ["बराबर लाभ के लिए दोनों का पूंजी × समय योगदान बराबर होना चाहिए।", `वास्तविक योगदान ${pairWeights} हैं; ज्ञात पूंजी और दोनों अवधियों से अज्ञात पूंजी निकलती है।`, `अतः आवश्यक पूंजी ${answer.display} है।`];
      case "findDurationForEqualProfitGivenCapitals": return ["बराबर लाभ का अर्थ दोनों पूंजी-समय योगदानों का बराबर होना है।", `वास्तविक योगदान ${pairWeights} हैं; ज्ञात पूंजियों से अज्ञात निवेश अवधि निकाली जाती है।`, `अतः आवश्यक अवधि ${answer.display} है।`];
      case "findProfitDifferenceFromCapitalDurationWeights": return [`पूंजी × समय से प्रभावी योगदान ${pairWeights} और लाभ अनुपात ${ratio} मिलता है।`, "कुल लाभ को इसी अनुपात में बाँटकर दोनों लाभांशों का अंतर लेते हैं।", `अतः अंतर ${answer.display} है।`];
      case "findProfitRatioWhenPartnerLeavesEarly": return [`जल्दी बाहर होने वाले भागीदार की पूंजी केवल उसकी वास्तविक सक्रिय अवधि तक गिनी जाती है: ${pairWeights}।`, `इन योगदानों को सरल करने पर लाभ अनुपात ${ratio} मिलता है।`, `अतः लाभ-विभाजन अनुपात ${answer.display} है।`];
      case "findShareWhenPartnerJoinsLater": return [`देर से जुड़ा भागीदार केवल शामिल होने के बाद की अवधि के लिए योगदान देता है: ${pairWeights}।`, `प्रभावी योगदान अनुपात ${ratio} में कुल लाभ बाँटा जाता है।`, `अतः पूछे गए भागीदार का हिस्सा ${answer.display} है।`];
      case "findUnknownCapitalOfEarlyLeavingPartner": return ["जल्दी बाहर होने वाले भागीदार का योगदान = उसकी अज्ञात पूंजी × बाहर होने तक की अवधि।", `दिए गए लाभ अनुपात से उसका आवश्यक प्रभावी योगदान तय होता है; सत्यापन योगदान ${pairWeights} हैं।`, `अतः उसकी पूंजी ${answer.display} है।`];
      case "findTotalProfitFromStaggeredPartnerShare": return [`हर भागीदार की अलग शामिल होने की तारीख से प्रभावी योगदान ${pairWeights} और अनुपात ${ratio} मिलता है।`, "ज्ञात लाभांश जिस अनुपात-भाग को दर्शाता है, उससे एक भाग का मूल्य निकालकर सभी भागों पर स्केल करते हैं।", `अतः कुल लाभ ${answer.display} है।`];
      case "findProfitRatioAfterPercentageCapitalDecrease": return ["पूंजी घटने के महीने पर निवेश को दो समय-खंडों में बाँटते हैं—पहले पुरानी पूंजी, फिर घटी हुई पूंजी।", `दोनों भागीदारों के कुल पूंजी-माह ${pairWeights} हैं, जो ${ratio} में सरल होते हैं।`, `अतः लाभ अनुपात ${answer.display} है।`];
      case "findProfitRatioAfterFractionalCapitalChange": return ["भिन्नात्मक पूंजी परिवर्तन केवल परिवर्तन के बाद वाले समय-खंड पर लागू होता है।", `खंडवार पूंजी-माह जोड़ने पर ${pairWeights}, अर्थात अनुपात ${ratio} मिलता है।`, `अतः लाभ अनुपात ${answer.display} है।`];
      case "findUnknownCapitalChangeTimeFromPartnerShare": return ["दिए गए लाभांश और कुल लाभ से पहले आवश्यक लाभ अनुपात और फिर पहले भागीदार का कुल पूंजी-माह योगदान तय होता है।", "पुरानी पूंजी × अज्ञात महीने + नई पूंजी × शेष महीने का समीकरण बनाकर परिवर्तन का समय निकालते हैं।", `अतः पूंजी ${answer.display} बाद बदली गई।`];
    }
  }

  if (parameters.language === "pa") {
    switch (mode) {
      case "findOtherPartnerShareFromKnownShareAndCapitals": return [`ਇੱਕੋ ਮਿਆਦ ਵਿੱਚ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਪੂੰਜੀ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੈ, ਅਰਥਾਤ ${ratio}।`, "ਦਿੱਤੇ ਸਾਥੀ ਦੇ ਹਿੱਸੇ ਤੋਂ ਇੱਕ ਅਨੁਪਾਤੀ ਭਾਗ ਦੀ ਕੀਮਤ ਕੱਢ ਕੇ ਦੂਜੇ ਸਾਥੀ ਦੇ ਭਾਗਾਂ ਉੱਤੇ ਲਗਾਉਂਦੇ ਹਾਂ।", `ਇਸ ਲਈ ਦੂਜੇ ਸਾਥੀ ਦਾ ਹਿੱਸਾ ${answer.display} ਹੈ।`];
      case "findCapitalRatioFromProfitShares": return ["ਨਿਵੇਸ਼ ਦੀ ਮਿਆਦ ਇੱਕੋ ਹੋਣ ਕਰਕੇ ਪੂੰਜੀ ਅਤੇ ਮੁਨਾਫ਼ੇ ਦੇ ਹਿੱਸਿਆਂ ਦਾ ਅਨੁਪਾਤ ਇੱਕੋ ਹੁੰਦਾ ਹੈ।", `ਦਿੱਤੇ ਹਿੱਸਿਆਂ ਨੂੰ ਸਰਲ ਕਰਨ ਤੇ ਅਨੁਪਾਤ ${ratio} ਮਿਲਦਾ ਹੈ।`, `ਇਸ ਲਈ ਪੂੰਜੀ ਅਨੁਪਾਤ ${answer.display} ਹੈ।`];
      case "findLossShareFromCapitals": return [`ਇੱਕੋ ਮਿਆਦ ਵਿੱਚ ਨੁਕਸਾਨ ਵੀ ਪੂੰਜੀ ਅਨੁਪਾਤ ${ratio} ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।`, "ਕੁੱਲ ਨੁਕਸਾਨ ਨੂੰ ਕੁੱਲ ਅਨੁਪਾਤੀ ਭਾਗਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਪੁੱਛੇ ਸਾਥੀ ਦੇ ਭਾਗ ਲੈਂਦੇ ਹਾਂ।", `ਇਸ ਲਈ ਉਸਦਾ ਨੁਕਸਾਨ ${answer.display} ਹੈ।`];
      case "findIndividualCapitalsFromTotalCapitalAndProfitRatio": return [`ਇੱਕੋ ਮਿਆਦ ਕਰਕੇ ਦਿੱਤਾ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ${ratio} ਹੀ ਪੂੰਜੀ ਅਨੁਪਾਤ ਹੈ।`, "ਕੁੱਲ ਪੂੰਜੀ ਨੂੰ ਕੁੱਲ ਅਨੁਪਾਤੀ ਭਾਗਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਪਹਿਲੇ ਸਾਥੀ ਦੇ ਭਾਗ ਲੈਂਦੇ ਹਾਂ।", `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਪੂੰਜੀ ${answer.display} ਹੈ।`];
      case "findCapitalForEqualProfitGivenDurations": return ["ਬਰਾਬਰ ਮੁਨਾਫ਼ੇ ਲਈ ਦੋਵਾਂ ਦਾ ਪੂੰਜੀ × ਸਮਾਂ ਯੋਗਦਾਨ ਬਰਾਬਰ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।", `ਅਸਲ ਯੋਗਦਾਨ ${pairWeights} ਹਨ; ਦਿੱਤੀ ਪੂੰਜੀ ਅਤੇ ਮਿਆਦਾਂ ਤੋਂ ਅਣਜਾਣ ਪੂੰਜੀ ਮਿਲਦੀ ਹੈ।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਪੂੰਜੀ ${answer.display} ਹੈ।`];
      case "findDurationForEqualProfitGivenCapitals": return ["ਬਰਾਬਰ ਮੁਨਾਫ਼ਾ ਦੋਵਾਂ ਦੇ ਪੂੰਜੀ-ਸਮਾਂ ਯੋਗਦਾਨ ਬਰਾਬਰ ਹੋਣ ਦੀ ਸ਼ਰਤ ਦਿੰਦਾ ਹੈ।", `ਅਸਲ ਯੋਗਦਾਨ ${pairWeights} ਹਨ; ਦਿੱਤੀਆਂ ਪੂੰਜੀਆਂ ਤੋਂ ਅਣਜਾਣ ਮਿਆਦ ਮਿਲਦੀ ਹੈ।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਮਿਆਦ ${answer.display} ਹੈ।`];
      case "findProfitDifferenceFromCapitalDurationWeights": return [`ਪੂੰਜੀ × ਸਮੇਂ ਤੋਂ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨ ${pairWeights} ਅਤੇ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ${ratio} ਮਿਲਦਾ ਹੈ।`, "ਕੁੱਲ ਮੁਨਾਫ਼ਾ ਇਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡ ਕੇ ਦੋ ਹਿੱਸਿਆਂ ਦਾ ਫਰਕ ਲੈਂਦੇ ਹਾਂ।", `ਇਸ ਲਈ ਫਰਕ ${answer.display} ਹੈ।`];
      case "findProfitRatioWhenPartnerLeavesEarly": return [`ਜਲਦੀ ਕਾਰੋਬਾਰ ਛੱਡਣ ਵਾਲੇ ਸਾਥੀ ਦੀ ਪੂੰਜੀ ਸਿਰਫ਼ ਉਸਦੀ ਅਸਲ ਸਰਗਰਮ ਮਿਆਦ ਤੱਕ ਗਿਣੀ ਜਾਂਦੀ ਹੈ: ${pairWeights}।`, `ਇਨ੍ਹਾਂ ਯੋਗਦਾਨਾਂ ਨੂੰ ਸਰਲ ਕਰਨ ਤੇ ਅਨੁਪਾਤ ${ratio} ਬਣਦਾ ਹੈ।`, `ਇਸ ਲਈ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ${answer.display} ਹੈ।`];
      case "findShareWhenPartnerJoinsLater": return [`ਦੇਰ ਨਾਲ ਜੁੜਿਆ ਸਾਥੀ ਸਿਰਫ਼ ਸ਼ਾਮਲ ਹੋਣ ਤੋਂ ਬਾਅਦ ਵਾਲੀ ਮਿਆਦ ਲਈ ਯੋਗਦਾਨ ਦਿੰਦਾ ਹੈ: ${pairWeights}।`, `ਪ੍ਰਭਾਵੀ ਅਨੁਪਾਤ ${ratio} ਵਿੱਚ ਕੁੱਲ ਮੁਨਾਫ਼ਾ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।`, `ਇਸ ਲਈ ਪੁੱਛਿਆ ਹਿੱਸਾ ${answer.display} ਹੈ।`];
      case "findUnknownCapitalOfEarlyLeavingPartner": return ["ਜਲਦੀ ਛੱਡਣ ਵਾਲੇ ਸਾਥੀ ਦਾ ਯੋਗਦਾਨ = ਅਣਜਾਣ ਪੂੰਜੀ × ਛੱਡਣ ਤੱਕ ਦੀ ਮਿਆਦ।", `ਦਿੱਤੇ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਤੋਂ ਲੋੜੀਂਦਾ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨ ਮਿਲਦਾ ਹੈ; ਜਾਂਚ ਯੋਗਦਾਨ ${pairWeights} ਹਨ।`, `ਇਸ ਲਈ ਉਸਦੀ ਪੂੰਜੀ ${answer.display} ਹੈ।`];
      case "findTotalProfitFromStaggeredPartnerShare": return [`ਵੱਖ-ਵੱਖ ਸ਼ਾਮਲ ਹੋਣ ਦੇ ਸਮਿਆਂ ਤੋਂ ਪ੍ਰਭਾਵੀ ਯੋਗਦਾਨ ${pairWeights} ਅਤੇ ਅਨੁਪਾਤ ${ratio} ਮਿਲਦਾ ਹੈ।`, "ਦਿੱਤਾ ਹਿੱਸਾ ਜਿੰਨੇ ਅਨੁਪਾਤੀ ਭਾਗਾਂ ਦੇ ਬਰਾਬਰ ਹੈ, ਉਸ ਤੋਂ ਇੱਕ ਭਾਗ ਦੀ ਕੀਮਤ ਅਤੇ ਫਿਰ ਕੁੱਲ ਮੁਨਾਫ਼ਾ ਕੱਢਦੇ ਹਾਂ।", `ਇਸ ਲਈ ਕੁੱਲ ਮੁਨਾਫ਼ਾ ${answer.display} ਹੈ।`];
      case "findProfitRatioAfterPercentageCapitalDecrease": return ["ਪੂੰਜੀ ਘਟਣ ਵਾਲੇ ਮਹੀਨੇ ਉੱਤੇ ਨਿਵੇਸ਼ ਨੂੰ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡਦੇ ਹਾਂ—ਪਹਿਲਾਂ ਪੁਰਾਣੀ ਅਤੇ ਫਿਰ ਘਟੀ ਪੂੰਜੀ।", `ਕੁੱਲ ਪੂੰਜੀ-ਮਹੀਨੇ ${pairWeights} ਹਨ, ਜੋ ${ratio} ਵਿੱਚ ਸਰਲ ਹੁੰਦੇ ਹਨ।`, `ਇਸ ਲਈ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ${answer.display} ਹੈ।`];
      case "findProfitRatioAfterFractionalCapitalChange": return ["ਭਿੰਨ ਵਾਲਾ ਪੂੰਜੀ ਬਦਲਾਅ ਸਿਰਫ਼ ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਵਾਲੀ ਮਿਆਦ ਉੱਤੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।", `ਹਰ ਖੰਡ ਦੇ ਪੂੰਜੀ-ਮਹੀਨੇ ਜੋੜਨ ਤੇ ${pairWeights}, ਅਰਥਾਤ ${ratio} ਮਿਲਦਾ ਹੈ।`, `ਇਸ ਲਈ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ${answer.display} ਹੈ।`];
      case "findUnknownCapitalChangeTimeFromPartnerShare": return ["ਦਿੱਤੇ ਹਿੱਸੇ ਅਤੇ ਕੁੱਲ ਮੁਨਾਫ਼ੇ ਤੋਂ ਪਹਿਲਾਂ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਅਤੇ ਫਿਰ ਪਹਿਲੇ ਸਾਥੀ ਦਾ ਕੁੱਲ ਪੂੰਜੀ-ਮਹੀਨਾ ਯੋਗਦਾਨ ਮਿਲਦਾ ਹੈ।", "ਪੁਰਾਣੀ ਪੂੰਜੀ × ਅਣਜਾਣ ਮਹੀਨੇ + ਨਵੀਂ ਪੂੰਜੀ × ਬਾਕੀ ਮਹੀਨੇ ਦਾ ਸਮੀਕਰਨ ਹੱਲ ਕਰਦੇ ਹਾਂ।", `ਇਸ ਲਈ ਪੂੰਜੀ ${answer.display} ਬਾਅਦ ਬਦਲੀ ਗਈ।`];
    }
  }

  switch (mode) {
    case "findOtherPartnerShareFromKnownShareAndCapitals": return [`Equal periods make the profit ratio the capital ratio, ${ratio}.`, "Use the known partner's share to find the value of one ratio part, then scale to the other partner's parts.", `Therefore, the other partner received ${answer.display}.`];
    case "findCapitalRatioFromProfitShares": return ["Because both investments ran for the same period, capital ratio and profit-share ratio are identical.", `Reducing the stated shares gives ${ratio}.`, `Therefore, the capital ratio is ${answer.display}.`];
    case "findLossShareFromCapitals": return [`With equal periods, the loss is borne in the capital ratio ${ratio}.`, "Divide the total loss into the ratio parts and take the requested partner's parts.", `Therefore, the required loss share is ${answer.display}.`];
    case "findIndividualCapitalsFromTotalCapitalAndProfitRatio": return [`Equal periods mean the stated profit ratio ${ratio} is also the capital ratio.`, "Split the total capital into all ratio parts and take the first partner's parts.", `Therefore, the required capital is ${answer.display}.`];
    case "findCapitalForEqualProfitGivenDurations": return ["Equal profit requires equal capital × time contributions.", `The verified contributions are ${pairWeights}; use the known capital and both durations to recover the unknown capital.`, `Therefore, the required capital is ${answer.display}.`];
    case "findDurationForEqualProfitGivenCapitals": return ["Equal profit means the two capital-time contributions must be equal.", `The verified contributions are ${pairWeights}; divide the required contribution by the known capital to recover the duration.`, `Therefore, the required duration is ${answer.display}.`];
    case "findProfitDifferenceFromCapitalDurationWeights": return [`Capital × time gives effective contributions ${pairWeights}, reducing to ${ratio}.`, "Split the total profit by this ratio and subtract the smaller share from the larger.", `Therefore, the difference is ${answer.display}.`];
    case "findProfitRatioWhenPartnerLeavesEarly": return [`The leaving partner's capital counts only until the stated exit: ${pairWeights}.`, `Reducing these effective contributions gives ${ratio}.`, `Therefore, the profit ratio is ${answer.display}.`];
    case "findShareWhenPartnerJoinsLater": return [`The late joiner's capital counts only from the joining month to year-end: ${pairWeights}.`, `Split total profit in the resulting ${ratio} ratio.`, `Therefore, the requested share is ${answer.display}.`];
    case "findUnknownCapitalOfEarlyLeavingPartner": return ["For the early leaver, effective contribution equals unknown capital × the months actually invested.", `The stated profit ratio fixes the required contribution; the verified weights are ${pairWeights}.`, `Therefore, the unknown capital is ${answer.display}.`];
    case "findTotalProfitFromStaggeredPartnerShare": return [`The staggered joining times give effective contributions ${pairWeights}, reducing to ${ratio}.`, "The known share represents its ratio parts; find one part and scale to all partners' parts.", `Therefore, total profit is ${answer.display}.`];
    case "findProfitRatioAfterPercentageCapitalDecrease": return ["Split the investment at the decrease month: old capital before the change and reduced capital afterwards.", `The resulting capital-month totals are ${pairWeights}, reducing to ${ratio}.`, `Therefore, the profit ratio is ${answer.display}.`];
    case "findProfitRatioAfterFractionalCapitalChange": return ["Apply the stated fractional capital change only to the period after the change date.", `Adding the segment-wise capital-month contributions gives ${pairWeights}, or ${ratio}.`, `Therefore, the profit ratio is ${answer.display}.`];
    case "findUnknownCapitalChangeTimeFromPartnerShare": return ["Use the known share and total profit to recover the required profit ratio and hence the first partner's effective capital-time contribution.", "Set old capital × unknown months + new capital × remaining months equal to that contribution and solve.", `Therefore, the capital was changed after ${answer.display}.`];
    default: throw new Error(`E4 explanation renderer does not support ${mode}`);
  }
}

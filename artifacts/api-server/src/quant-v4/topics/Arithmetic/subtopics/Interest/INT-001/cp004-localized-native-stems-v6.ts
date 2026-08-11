import {
  brokenAmountForState,
  completeAmountForState,
  effectiveAnnualRate,
  mixedAmountForState,
  periodicAmountForState,
  sub,
  type Cp004Frequency,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import { assertCp004LocalizedText } from "./cp004-localization-language-pack";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";

export const INT_CP004_LOCALIZED_NATIVE_STEMS_V6_VERSION =
  "INT-CP-004-HI-PA-NATIVE-STEMS-v6" as const;

function frameIndex(source: IntCp004EnglishFrozenQuestion): number {
  const match = /-FRAME-(\d+)$/u.exec(source.stemFamilyId);
  const value = Number(match?.[1] ?? "1") - 1;
  return value >= 0 && value <= 3 ? value : 0;
}

function choose(source: IntCp004EnglishFrozenQuestion, variants: readonly string[]): string {
  return variants[frameIndex(source)] ?? variants[0] ?? "";
}

function years(locale: IntCp004LocalizedLocale, value: number): string {
  return locale === "hi-IN" ? `${value} वर्ष` : `${value} ਸਾਲ`;
}

function months(locale: IntCp004LocalizedLocale, value: number): string {
  if (locale === "hi-IN") return `${value} ${value === 1 ? "महीना" : "महीने"}`;
  return `${value} ${value === 1 ? "ਮਹੀਨਾ" : "ਮਹੀਨੇ"}`;
}

function duration(locale: IntCp004LocalizedLocale, periods: number, frequency: Cp004Frequency): string {
  const totalMonths = periods * (12 / frequency);
  return totalMonths % 12 === 0
    ? years(locale, totalMonths / 12)
    : months(locale, totalMonths);
}

function interval(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "हर वर्ष";
      case 2: return "हर छमाही";
      case 4: return "हर तिमाही";
      case 12: return "हर महीने";
    }
  }
  switch (frequency) {
    case 1: return "ਹਰ ਸਾਲ";
    case 2: return "ਹਰ ਛਿਮਾਹੀ";
    case 4: return "ਹਰ ਤਿਮਾਹੀ";
    case 12: return "ਹਰ ਮਹੀਨੇ";
  }
}

function frequencyName(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वार्षिक";
      case 2: return "छमाही";
      case 4: return "तिमाही";
      case 12: return "मासिक";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲਾਨਾ";
    case 2: return "ਛਿਮਾਹੀ";
    case 4: return "ਤਿਮਾਹੀ";
    case 12: return "ਮਾਸਿਕ";
  }
}

function renderHindi(source: IntCp004EnglishFrozenQuestion): string {
  const s = source.mathematicalState;
  const principal = moneyText(s.principal);
  const annualRate = percentText(s.nominalAnnualRatePercent);
  const periodic = percentText(s.periodicRatePercent);
  const time = duration("hi-IN", s.periods, s.frequency);
  const credit = interval("hi-IN", s.frequency);
  const amount = moneyText(completeAmountForState(s));
  const compoundInterest = moneyText(sub(completeAmountForState(s), s.principal));
  const periodicAmount = moneyText(periodicAmountForState(s));
  const brokenAmount = moneyText(brokenAmountForState(s));
  const mixedAmount = moneyText(mixedAmountForState(s));
  const effective = percentText(effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency));

  switch (source.qlId) {
    case "INT-QL-067": return choose(source, [
      `${principal} पर ${annualRate} वार्षिक ब्याज लगता है और ब्याज ${credit} मूलधन में जोड़ दिया जाता है। ${time} बाद कुल राशि कितनी होगी?`,
      `एक राशि ${principal} है। उस पर ${annualRate} प्रति वर्ष की दर से ${credit} ब्याज जोड़ा जाता है। ${time} के अंत में राशि ज्ञात कीजिए।`,
      `${principal} का निवेश ${time} के लिए किया गया। ब्याज की वार्षिक दर ${annualRate} है और ब्याज ${credit} जुड़ता है। परिपक्वता राशि कितनी होगी?`,
      `यदि ${principal} पर ${annualRate} वार्षिक दर से ब्याज ${credit} मूलधन में मिलाया जाए, तो ${time} बाद खाते में कितनी राशि होगी?`,
    ]);
    case "INT-QL-068": return choose(source, [
      `${principal} पर ${annualRate} वार्षिक दर से ब्याज ${credit} जोड़ा जाता है। ${time} में प्राप्त चक्रवृद्धि ब्याज ज्ञात कीजिए।`,
      `एक व्यक्ति ${principal} का निवेश करता है। दर ${annualRate} प्रति वर्ष है और ब्याज ${credit} मूलधन में जुड़ता है। ${time} बाद केवल चक्रवृद्धि ब्याज कितना होगा?`,
      `${principal} की राशि ${time} में ${annualRate} वार्षिक दर से बढ़ती है। ब्याज ${credit} जोड़ा जाता है। अर्जित चक्रवृद्धि ब्याज ज्ञात कीजिए।`,
      `${principal} पर ${credit} ब्याज जोड़ते हुए वार्षिक दर ${annualRate} रखी गई। ${time} के अंत में मूलधन से अधिक प्राप्त राशि कितनी है?`,
    ]);
    case "INT-QL-069": return choose(source, [
      `किसी राशि पर ${annualRate} वार्षिक दर से ब्याज ${credit} जोड़ा गया और ${time} बाद राशि ${amount} हो गई। प्रारंभिक मूलधन ज्ञात कीजिए।`,
      `${time} बाद प्राप्त कुल राशि ${amount} है। ब्याज की दर ${annualRate} प्रति वर्ष है और ब्याज ${credit} जुड़ता है। निवेश की गई राशि कितनी थी?`,
      `एक निवेश ${annualRate} वार्षिक दर और ${credit} ब्याज-योग के साथ ${time} में बढ़कर ${amount} हो गया। मूलधन ज्ञात कीजिए।`,
      `${amount} वह राशि है जो ${time} बाद मिली। यदि वार्षिक दर ${annualRate} और ब्याज जोड़ने का अंतराल ${credit} था, तो आरंभिक राशि कितनी थी?`,
    ]);
    case "INT-QL-070": return choose(source, [
      `${annualRate} वार्षिक दर से ब्याज ${credit} जोड़ने पर ${time} में चक्रवृद्धि ब्याज ${compoundInterest} मिला। मूलधन ज्ञात कीजिए।`,
      `किसी राशि पर ${time} में ${compoundInterest} चक्रवृद्धि ब्याज प्राप्त हुआ। दर ${annualRate} प्रति वर्ष थी और ब्याज ${credit} जुड़ा। निवेश कितना था?`,
      `एक निवेश से ${time} बाद ${compoundInterest} चक्रवृद्धि ब्याज मिला। यदि वार्षिक दर ${annualRate} तथा ब्याज-योग ${credit} था, तो प्रारंभिक राशि ज्ञात कीजिए।`,
      `${annualRate} वार्षिक दर और ${credit} ब्याज जोड़ने की शर्त पर अर्जित ब्याज ${compoundInterest} है। ${time} के लिए लगाया गया मूलधन कितना था?`,
    ]);
    case "INT-QL-071": return choose(source, [
      `${principal} की राशि ${time} में बढ़कर ${amount} हो गई। ब्याज ${credit} मूलधन में जोड़ा जाता है। वार्षिक ब्याज दर ज्ञात कीजिए।`,
      `एक निवेश ${principal} से ${amount} हो गया। समय ${time} है और ब्याज ${credit} जुड़ता है। प्रति वर्ष की दर कितनी थी?`,
      `${principal} पर ${credit} ब्याज जोड़ने से ${time} बाद कुल राशि ${amount} प्राप्त हुई। वार्षिक दर ज्ञात कीजिए।`,
      `${time} के लिए लगाए गए ${principal} की परिपक्वता राशि ${amount} है। यदि ब्याज ${credit} जोड़ा गया, तो वार्षिक ब्याज दर कितनी है?`,
    ]);
    case "INT-QL-072": return choose(source, [
      `${principal} की राशि ${annualRate} वार्षिक दर से बढ़कर ${amount} हो गई। ब्याज ${credit} जुड़ता है। निवेश कितने समय के लिए किया गया था?`,
      `किसी निवेश का मूलधन ${principal} और अंतिम राशि ${amount} है। दर ${annualRate} प्रति वर्ष है तथा ब्याज ${credit} जोड़ा जाता है। समय ज्ञात कीजिए।`,
      `${principal} पर ${annualRate} वार्षिक दर से ${credit} ब्याज जोड़ने पर राशि ${amount} बनी। यह राशि प्राप्त होने में कितना समय लगा?`,
      `एक राशि ${principal} से बढ़कर ${amount} हो गई। यदि वार्षिक दर ${annualRate} और ब्याज जोड़ने का नियम ${credit} था, तो निवेश की अवधि कितनी थी?`,
    ]);
    case "INT-QL-073": return choose(source, [
      `${principal} पर ${credit} ${periodic} ब्याज लगाया जाता है। ${time} बाद कुल राशि कितनी होगी?`,
      `हर बार ब्याज जुड़ने पर दर ${periodic} है। यदि मूलधन ${principal} और समय ${time} हो, तो अंतिम राशि ज्ञात कीजिए।`,
      `${principal} का निवेश ${time} के लिए किया गया और प्रत्येक ब्याज-अंतराल की दर ${periodic} रही। परिपक्वता राशि कितनी होगी?`,
      `यदि ${principal} में ${credit} ${periodic} की दर से ब्याज जोड़ा जाए, तो ${time} के अंत में राशि कितनी बनेगी?`,
    ]);
    case "INT-QL-074": return choose(source, [
      `${principal} पर ${credit} ${periodic} की दर से ब्याज जुड़ता है। ${time} में प्राप्त चक्रवृद्धि ब्याज ज्ञात कीजिए।`,
      `प्रत्येक ब्याज-अंतराल की दर ${periodic} है। ${principal} के निवेश पर ${time} बाद केवल चक्रवृद्धि ब्याज कितना होगा?`,
      `${principal} को ${time} के लिए लगाया गया और हर बार ${periodic} ब्याज मूलधन में जोड़ा गया। अर्जित चक्रवृद्धि ब्याज ज्ञात कीजिए।`,
      `${credit} ${periodic} ब्याज जोड़ने पर ${principal} की राशि ${time} में बढ़ती है। मूलधन से अधिक प्राप्त राशि कितनी है?`,
    ]);
    case "INT-QL-075": return choose(source, [
      `${principal} पर ${annualRate} वार्षिक दर से ${years("hi-IN", s.years)} के लिए ब्याज लगाया गया। पहली योजना में ब्याज ${interval("hi-IN", s.frequency)} और दूसरी में ${interval("hi-IN", s.comparisonFrequency)} जुड़ता है। दोनों अंतिम राशियों का अंतर ज्ञात कीजिए।`,
      `एक ही ${principal} राशि और ${annualRate} वार्षिक दर के लिए दो योजनाएँ हैं—${frequencyName("hi-IN", s.frequency)} तथा ${frequencyName("hi-IN", s.comparisonFrequency)} ब्याज-योग। ${years("hi-IN", s.years)} बाद राशि में कितना अंतर होगा?`,
      `${principal} को ${years("hi-IN", s.years)} के लिए ${annualRate} वार्षिक दर पर लगाया गया। ब्याज पहले ${interval("hi-IN", s.frequency)} और फिर अलग योजना में ${interval("hi-IN", s.comparisonFrequency)} जोड़ा जाता है। अधिक राशि कितनी अधिक होगी?`,
      `दो निवेश योजनाओं में मूलधन ${principal}, दर ${annualRate} और समय ${years("hi-IN", s.years)} समान हैं। केवल ब्याज जोड़ने का अंतराल क्रमशः ${interval("hi-IN", s.frequency)} और ${interval("hi-IN", s.comparisonFrequency)} है। अंतिम राशियों का अंतर ज्ञात कीजिए।`,
    ]);
    case "INT-QL-076": return choose(source, [
      `घोषित वार्षिक दर ${annualRate} है और ब्याज ${credit} मूलधन में जोड़ा जाता है। प्रभावी वार्षिक ब्याज दर ज्ञात कीजिए।`,
      `किसी योजना में वार्षिक दर ${annualRate} लिखी है, पर ब्याज ${credit} जुड़ता है। एक वर्ष की वास्तविक प्रतिशत वृद्धि कितनी होगी?`,
      `${annualRate} की घोषित वार्षिक दर पर ${frequencyName("hi-IN", s.frequency)} ब्याज-योग होता है। प्रभावी वार्षिक दर ज्ञात कीजिए।`,
      `यदि वार्षिक दर ${annualRate} हो और ब्याज ${credit} मूलधन में मिलाया जाए, तो एक वर्ष में वास्तविक ब्याज दर कितनी बनती है?`,
    ]);
    case "INT-QL-077": return choose(source, [
      `ब्याज ${credit} जोड़ा जाता है और प्रभावी वार्षिक दर ${effective} है। घोषित वार्षिक ब्याज दर ज्ञात कीजिए।`,
      `एक योजना की वास्तविक वार्षिक वृद्धि ${effective} है। यदि ब्याज ${credit} मूलधन में जुड़ता है, तो लिखी हुई वार्षिक दर कितनी होगी?`,
      `${frequencyName("hi-IN", s.frequency)} ब्याज-योग वाली योजना की प्रभावी वार्षिक दर ${effective} है। घोषित दर ज्ञात कीजिए।`,
      `किस वार्षिक दर पर ${credit} ब्याज जोड़ने से एक वर्ष की प्रभावी दर ${effective} प्राप्त होगी?`,
    ]);
    case "INT-QL-078": return choose(source, [
      `${principal} पर ${annualRate} वार्षिक दर से ${years("hi-IN", s.years)} बाद राशि ${amount} हुई। बताइए, ब्याज वर्ष में कितनी बार मूलधन में जोड़ा गया था।`,
      `एक निवेश ${principal} से बढ़कर ${amount} हो गया। समय ${years("hi-IN", s.years)} और वार्षिक दर ${annualRate} है। ब्याज जोड़ने की आवृत्ति पहचानिए।`,
      `${annualRate} वार्षिक दर पर ${principal} की ${years("hi-IN", s.years)} बाद राशि ${amount} है। ब्याज वार्षिक, छमाही, तिमाही या मासिक—किस अंतराल पर जोड़ा गया?`,
      `मूलधन ${principal}, अंतिम राशि ${amount}, समय ${years("hi-IN", s.years)} और वार्षिक दर ${annualRate} है। वर्ष में ब्याज कितनी बार जोड़ा गया था?`,
    ]);
    case "INT-QL-079": return choose(source, [
      `${principal} पर ${annualRate} वार्षिक दर है। पहले ${years("hi-IN", s.fullYears)} का ब्याज चक्रवृद्धि रूप से और अगले ${months("hi-IN", s.tailMonths)} का साधारण ब्याज लगाया जाता है। अंतिम राशि ज्ञात कीजिए।`,
      `एक राशि ${principal} को ${years("hi-IN", s.fullYears)} तक वार्षिक चक्रवृद्धि ब्याज पर रखा गया। इसके बाद ${months("hi-IN", s.tailMonths)} के लिए उसी दर से साधारण ब्याज लगा। कुल राशि कितनी होगी?`,
      `${principal} पर ${annualRate} प्रति वर्ष की दर से पूरे ${years("hi-IN", s.fullYears)} तक चक्रवृद्धि ब्याज और शेष ${months("hi-IN", s.tailMonths)} के लिए साधारण ब्याज मिलता है। परिपक्वता राशि ज्ञात कीजिए।`,
      `निवेश ${principal} है। ${years("hi-IN", s.fullYears)} बाद बनी राशि पर अगले ${months("hi-IN", s.tailMonths)} का साधारण ब्याज ${annualRate} वार्षिक दर से लगाया जाता है। अंत में कितनी राशि मिलेगी?`,
    ]);
    case "INT-QL-080": return choose(source, [
      `${principal} पर ${annualRate} वार्षिक दर से ${years("hi-IN", s.fullYears)} तक चक्रवृद्धि ब्याज और अगले ${months("hi-IN", s.tailMonths)} के लिए साधारण ब्याज लगता है। कुल अर्जित ब्याज ज्ञात कीजिए।`,
      `एक निवेश ${principal} है। पहले ${years("hi-IN", s.fullYears)} तक वार्षिक चक्रवृद्धि ब्याज जोड़ा गया और फिर ${months("hi-IN", s.tailMonths)} का साधारण ब्याज लगाया गया। कुल ब्याज कितना है?`,
      `${principal} पर पूरे वर्षों में चक्रवृद्धि और शेष ${months("hi-IN", s.tailMonths)} में साधारण ब्याज मिलता है। दर ${annualRate} प्रति वर्ष तथा पूरे वर्षों की संख्या ${s.fullYears} है। अर्जित ब्याज ज्ञात कीजिए।`,
      `${annualRate} वार्षिक दर पर ${principal} को ${years("hi-IN", s.fullYears)} और अतिरिक्त ${months("hi-IN", s.tailMonths)} के लिए लगाया गया। अतिरिक्त महीनों में साधारण ब्याज लगता है। मूलधन से अधिक प्राप्त राशि कितनी है?`,
    ]);
    case "INT-QL-081": return choose(source, [
      `किसी मूलधन पर ${annualRate} वार्षिक दर से ${years("hi-IN", s.fullYears)} तक चक्रवृद्धि ब्याज और अगले ${months("hi-IN", s.tailMonths)} का साधारण ब्याज लगाने पर राशि ${brokenAmount} हुई। मूलधन ज्ञात कीजिए।`,
      `${years("hi-IN", s.fullYears)} पूरे वर्षों और ${months("hi-IN", s.tailMonths)} अतिरिक्त समय के बाद कुल राशि ${brokenAmount} है। दर ${annualRate} प्रति वर्ष है; अतिरिक्त समय में साधारण ब्याज लगता है। प्रारंभिक राशि कितनी थी?`,
      `एक निवेश वार्षिक चक्रवृद्धि से ${years("hi-IN", s.fullYears)} तक बढ़ा और फिर ${months("hi-IN", s.tailMonths)} के लिए साधारण ब्याज लगा। अंतिम राशि ${brokenAmount} तथा दर ${annualRate} है। निवेश ज्ञात कीजिए।`,
      `${brokenAmount} की परिपक्वता राशि में ${years("hi-IN", s.fullYears)} का चक्रवृद्धि और ${months("hi-IN", s.tailMonths)} का साधारण ब्याज शामिल है। वार्षिक दर ${annualRate} है। मूलधन कितना था?`,
    ]);
    case "INT-QL-082": return choose(source, [
      `${principal} की राशि ${years("hi-IN", s.fullYears)} तक वार्षिक चक्रवृद्धि और अगले ${months("hi-IN", s.tailMonths)} के साधारण ब्याज के बाद ${brokenAmount} हो गई। वार्षिक ब्याज दर ज्ञात कीजिए।`,
      `मूलधन ${principal} और अंतिम राशि ${brokenAmount} है। पहले ${years("hi-IN", s.fullYears)} चक्रवृद्धि ब्याज तथा फिर ${months("hi-IN", s.tailMonths)} साधारण ब्याज लगा। प्रति वर्ष की दर कितनी है?`,
      `${principal} का निवेश पूरे ${years("hi-IN", s.fullYears)} तक चक्रवृद्धि से बढ़ा और शेष ${months("hi-IN", s.tailMonths)} में साधारण ब्याज मिला। यदि राशि ${brokenAmount} बनी, तो वार्षिक दर ज्ञात कीजिए।`,
      `किस वार्षिक दर पर ${principal}, ${years("hi-IN", s.fullYears)} के चक्रवृद्धि ब्याज और ${months("hi-IN", s.tailMonths)} के साधारण ब्याज के बाद ${brokenAmount} बनेगा?`,
    ]);
    case "INT-QL-083": return choose(source, [
      `${principal} पर ${annualRate} वार्षिक दर से कुछ पूरे वर्षों तक चक्रवृद्धि ब्याज और फिर ${months("hi-IN", s.tailMonths)} का साधारण ब्याज लगाया गया। अंतिम राशि ${brokenAmount} है। पूरे वर्षों की संख्या ज्ञात कीजिए।`,
      `एक निवेश ${principal} से बढ़कर ${brokenAmount} हुआ। दर ${annualRate} प्रति वर्ष है और अंतिम ${months("hi-IN", s.tailMonths)} में साधारण ब्याज लगा। इससे पहले कितने पूरे वर्षों तक चक्रवृद्धि ब्याज मिला था?`,
      `${principal} पर पहले पूरे वर्षों का वार्षिक चक्रवृद्धि ब्याज और अंत में ${months("hi-IN", s.tailMonths)} का साधारण ब्याज मिला। राशि ${brokenAmount} बनी। पूरे वर्षों की संख्या कितनी है?`,
      `अंतिम राशि ${brokenAmount}, मूलधन ${principal} और दर ${annualRate} है। अंतिम ${months("hi-IN", s.tailMonths)} साधारण ब्याज के हैं। उससे पहले के पूरे चक्रवृद्धि वर्षों की संख्या ज्ञात कीजिए।`,
    ]);
    case "INT-QL-084": return choose(source, [
      `${principal} पर ${annualRate} वार्षिक दर है। पहले ${years("hi-IN", s.firstYears)} तक ब्याज ${interval("hi-IN", s.firstFrequency)} और अगले ${years("hi-IN", s.secondYears)} तक ${interval("hi-IN", s.secondFrequency)} जोड़ा गया। अंतिम राशि ज्ञात कीजिए।`,
      `एक निवेश ${principal} है। शुरुआती ${years("hi-IN", s.firstYears)} में ${frequencyName("hi-IN", s.firstFrequency)} तथा बाद के ${years("hi-IN", s.secondYears)} में ${frequencyName("hi-IN", s.secondFrequency)} ब्याज-योग हुआ। दर ${annualRate} प्रति वर्ष है। राशि कितनी बनेगी?`,
      `${principal} पर ${annualRate} वार्षिक दर से पहले ${years("hi-IN", s.firstYears)} के लिए ब्याज ${interval("hi-IN", s.firstFrequency)} जोड़ा गया। फिर अगले ${years("hi-IN", s.secondYears)} के लिए अंतराल बदलकर ${interval("hi-IN", s.secondFrequency)} कर दिया गया। अंतिम राशि ज्ञात कीजिए।`,
      `ब्याज जोड़ने का अंतराल बीच में बदलता है: ${years("hi-IN", s.firstYears)} तक ${interval("hi-IN", s.firstFrequency)} और उसके बाद ${years("hi-IN", s.secondYears)} तक ${interval("hi-IN", s.secondFrequency)}। ${principal} पर ${annualRate} वार्षिक दर से कुल राशि कितनी होगी?`,
    ]);
    case "INT-QL-085": return choose(source, [
      `${principal} पर ${annualRate} वार्षिक दर से पहले ${years("hi-IN", s.firstYears)} तक ब्याज ${interval("hi-IN", s.firstFrequency)} और अगले ${years("hi-IN", s.secondYears)} तक ${interval("hi-IN", s.secondFrequency)} जोड़ा गया। कुल चक्रवृद्धि ब्याज ज्ञात कीजिए।`,
      `एक निवेश ${principal} है। पहले चरण में ${frequencyName("hi-IN", s.firstFrequency)} और दूसरे चरण में ${frequencyName("hi-IN", s.secondFrequency)} ब्याज-योग हुआ। दोनों चरण क्रमशः ${years("hi-IN", s.firstYears)} और ${years("hi-IN", s.secondYears)} के हैं तथा दर ${annualRate} है। अर्जित ब्याज कितना है?`,
      `${principal} पर ब्याज जोड़ने का अंतराल ${years("hi-IN", s.firstYears)} बाद बदल दिया गया—पहले ${interval("hi-IN", s.firstFrequency)}, फिर ${interval("hi-IN", s.secondFrequency)}। दूसरा चरण ${years("hi-IN", s.secondYears)} का है। ${annualRate} वार्षिक दर से कुल ब्याज ज्ञात कीजिए।`,
      `${annualRate} वार्षिक दर पर ${principal} को दो चरणों में लगाया गया। ${years("hi-IN", s.firstYears)} तक ब्याज ${interval("hi-IN", s.firstFrequency)} और अगले ${years("hi-IN", s.secondYears)} तक ${interval("hi-IN", s.secondFrequency)} जुड़ा। मूलधन से अधिक प्राप्त राशि कितनी है?`,
    ]);
  }
}

function renderPunjabi(source: IntCp004EnglishFrozenQuestion): string {
  const s = source.mathematicalState;
  const principal = moneyText(s.principal);
  const annualRate = percentText(s.nominalAnnualRatePercent);
  const periodic = percentText(s.periodicRatePercent);
  const time = duration("pa-IN", s.periods, s.frequency);
  const credit = interval("pa-IN", s.frequency);
  const amount = moneyText(completeAmountForState(s));
  const compoundInterest = moneyText(sub(completeAmountForState(s), s.principal));
  const brokenAmount = moneyText(brokenAmountForState(s));
  const effective = percentText(effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency));

  switch (source.qlId) {
    case "INT-QL-067": return choose(source, [
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਵਿਆਜ ਲੱਗਦਾ ਹੈ ਅਤੇ ਵਿਆਜ ${credit} ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ${time} ਬਾਅਦ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
      `ਇੱਕ ਰਕਮ ${principal} ਹੈ। ਇਸ ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਵਿਆਜ ${credit} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ${time} ਦੇ ਅੰਤ ਵਿੱਚ ਰਕਮ ਪਤਾ ਲਗਾਓ।`,
      `${principal} ਦਾ ਨਿਵੇਸ਼ ${time} ਲਈ ਕੀਤਾ ਗਿਆ। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ${annualRate} ਹੈ ਅਤੇ ਵਿਆਜ ${credit} ਮੂਲਧਨ ਵਿੱਚ ਮਿਲਦਾ ਹੈ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਉੱਤੇ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
      `ਜੇ ${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਵਿਆਜ ${credit} ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਜਾਵੇ, ਤਾਂ ${time} ਬਾਅਦ ਕਿੰਨੀ ਰਕਮ ਹੋਵੇਗੀ?`,
    ]);
    case "INT-QL-068": return choose(source, [
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਵਿਆਜ ${credit} ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ${time} ਵਿੱਚ ਮਿਲਣ ਵਾਲਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`,
      `ਇੱਕ ਵਿਅਕਤੀ ${principal} ਦਾ ਨਿਵੇਸ਼ ਕਰਦਾ ਹੈ। ਦਰ ਸਾਲਾਨਾ ${annualRate} ਹੈ ਅਤੇ ਵਿਆਜ ${credit} ਮੂਲਧਨ ਵਿੱਚ ਜੁੜਦਾ ਹੈ। ${time} ਬਾਅਦ ਕੇਵਲ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      `${principal} ਦੀ ਰਕਮ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ${time} ਤੱਕ ਵਧਦੀ ਹੈ ਅਤੇ ਵਿਆਜ ${credit} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਕਮਾਇਆ ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`,
      `${principal} ਉੱਤੇ ${credit} ਵਿਆਜ ਜੋੜਦੇ ਹੋਏ ਸਾਲਾਨਾ ਦਰ ${annualRate} ਰੱਖੀ ਗਈ। ${time} ਦੇ ਅੰਤ ਵਿੱਚ ਮੂਲਧਨ ਤੋਂ ਵੱਧ ਮਿਲੀ ਰਕਮ ਕਿੰਨੀ ਹੈ?`,
    ]);
    case "INT-QL-069": return choose(source, [
      `ਕਿਸੇ ਰਕਮ ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਵਿਆਜ ${credit} ਜੋੜਿਆ ਗਿਆ ਅਤੇ ${time} ਬਾਅਦ ਰਕਮ ${amount} ਹੋ ਗਈ। ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।`,
      `${time} ਬਾਅਦ ਮਿਲੀ ਕੁੱਲ ਰਕਮ ${amount} ਹੈ। ਵਿਆਜ ਦਰ ਸਾਲਾਨਾ ${annualRate} ਹੈ ਅਤੇ ਵਿਆਜ ${credit} ਮੂਲਧਨ ਵਿੱਚ ਜੁੜਦਾ ਹੈ। ਨਿਵੇਸ਼ ਕੀਤੀ ਰਕਮ ਕਿੰਨੀ ਸੀ?`,
      `ਇੱਕ ਨਿਵੇਸ਼ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਅਤੇ ${credit} ਵਿਆਜ ਜੋੜਨ ਨਾਲ ${time} ਵਿੱਚ ਵਧ ਕੇ ${amount} ਹੋ ਗਿਆ। ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।`,
      `${amount} ਉਹ ਰਕਮ ਹੈ ਜੋ ${time} ਬਾਅਦ ਮਿਲੀ। ਜੇ ਸਾਲਾਨਾ ਦਰ ${annualRate} ਅਤੇ ਵਿਆਜ ਜੋੜਨ ਦਾ ਅੰਤਰਾਲ ${credit} ਸੀ, ਤਾਂ ਮੁੱਢਲੀ ਰਕਮ ਕਿੰਨੀ ਸੀ?`,
    ]);
    case "INT-QL-070": return choose(source, [
      `ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਵਿਆਜ ${credit} ਜੋੜਨ ਉੱਤੇ ${time} ਵਿੱਚ ਮਿਸ਼ਰਤ ਵਿਆਜ ${compoundInterest} ਮਿਲਿਆ। ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।`,
      `ਕਿਸੇ ਰਕਮ ਉੱਤੇ ${time} ਵਿੱਚ ${compoundInterest} ਮਿਸ਼ਰਤ ਵਿਆਜ ਮਿਲਿਆ। ਦਰ ਸਾਲਾਨਾ ${annualRate} ਸੀ ਅਤੇ ਵਿਆਜ ${credit} ਜੁੜਿਆ। ਨਿਵੇਸ਼ ਕਿੰਨਾ ਸੀ?`,
      `ਇੱਕ ਨਿਵੇਸ਼ ਤੋਂ ${time} ਬਾਅਦ ${compoundInterest} ਮਿਸ਼ਰਤ ਵਿਆਜ ਮਿਲਿਆ। ਜੇ ਸਾਲਾਨਾ ਦਰ ${annualRate} ਅਤੇ ਵਿਆਜ ${credit} ਜੋੜਿਆ ਗਿਆ ਸੀ, ਤਾਂ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਪਤਾ ਲਗਾਓ।`,
      `ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਅਤੇ ${credit} ਵਿਆਜ ਜੋੜਨ ਦੀ ਸ਼ਰਤ ਉੱਤੇ ਕਮਾਇਆ ਵਿਆਜ ${compoundInterest} ਹੈ। ${time} ਲਈ ਲਾਇਆ ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`,
    ]);
    case "INT-QL-071": return choose(source, [
      `${principal} ਦੀ ਰਕਮ ${time} ਵਿੱਚ ਵਧ ਕੇ ${amount} ਹੋ ਗਈ। ਵਿਆਜ ${credit} ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।`,
      `ਇੱਕ ਨਿਵੇਸ਼ ${principal} ਤੋਂ ${amount} ਹੋ ਗਿਆ। ਸਮਾਂ ${time} ਹੈ ਅਤੇ ਵਿਆਜ ${credit} ਜੁੜਦਾ ਹੈ। ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਸੀ?`,
      `${principal} ਉੱਤੇ ਵਿਆਜ ${credit} ਜੋੜਨ ਨਾਲ ${time} ਬਾਅਦ ਕੁੱਲ ਰਕਮ ${amount} ਮਿਲੀ। ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਲਗਾਓ।`,
      `${time} ਲਈ ਲਾਏ ${principal} ਦੀ ਅੰਤਿਮ ਰਕਮ ${amount} ਹੈ। ਜੇ ਵਿਆਜ ${credit} ਜੋੜਿਆ ਗਿਆ, ਤਾਂ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਹੈ?`,
    ]);
    case "INT-QL-072": return choose(source, [
      `${principal} ਦੀ ਰਕਮ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਵਧ ਕੇ ${amount} ਹੋ ਗਈ। ਵਿਆਜ ${credit} ਜੁੜਦਾ ਹੈ। ਨਿਵੇਸ਼ ਕਿੰਨੇ ਸਮੇਂ ਲਈ ਕੀਤਾ ਗਿਆ ਸੀ?`,
      `ਕਿਸੇ ਨਿਵੇਸ਼ ਦਾ ਮੂਲਧਨ ${principal} ਅਤੇ ਅੰਤਿਮ ਰਕਮ ${amount} ਹੈ। ਦਰ ਸਾਲਾਨਾ ${annualRate} ਹੈ ਅਤੇ ਵਿਆਜ ${credit} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਸਮਾਂ ਪਤਾ ਲਗਾਓ।`,
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਵਿਆਜ ${credit} ਜੋੜਨ ਉੱਤੇ ਰਕਮ ${amount} ਬਣੀ। ਇਹ ਰਕਮ ਬਣਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਿਆ?`,
      `ਇੱਕ ਰਕਮ ${principal} ਤੋਂ ਵਧ ਕੇ ${amount} ਹੋ ਗਈ। ਜੇ ਸਾਲਾਨਾ ਦਰ ${annualRate} ਅਤੇ ਵਿਆਜ ਜੋੜਨ ਦਾ ਅੰਤਰਾਲ ${credit} ਸੀ, ਤਾਂ ਨਿਵੇਸ਼ ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਸੀ?`,
    ]);
    case "INT-QL-073": return choose(source, [
      `${principal} ਉੱਤੇ ${credit} ${periodic} ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ${time} ਬਾਅਦ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
      `ਹਰ ਵਾਰ ਵਿਆਜ ਜੁੜਨ ਸਮੇਂ ਦਰ ${periodic} ਹੈ। ਜੇ ਮੂਲਧਨ ${principal} ਅਤੇ ਸਮਾਂ ${time} ਹੋਵੇ, ਤਾਂ ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਲਗਾਓ।`,
      `${principal} ਦਾ ਨਿਵੇਸ਼ ${time} ਲਈ ਕੀਤਾ ਗਿਆ ਅਤੇ ਹਰ ਵਿਆਜ ਅੰਤਰਾਲ ਦੀ ਦਰ ${periodic} ਰਹੀ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਉੱਤੇ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
      `ਜੇ ${principal} ਵਿੱਚ ${credit} ${periodic} ਦੀ ਦਰ ਨਾਲ ਵਿਆਜ ਜੋੜਿਆ ਜਾਵੇ, ਤਾਂ ${time} ਦੇ ਅੰਤ ਵਿੱਚ ਰਕਮ ਕਿੰਨੀ ਬਣੇਗੀ?`,
    ]);
    case "INT-QL-074": return choose(source, [
      `${principal} ਉੱਤੇ ${credit} ${periodic} ਦੀ ਦਰ ਨਾਲ ਵਿਆਜ ਮੂਲਧਨ ਵਿੱਚ ਜੁੜਦਾ ਹੈ। ${time} ਵਿੱਚ ਮਿਲਣ ਵਾਲਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`,
      `ਹਰ ਵਿਆਜ ਅੰਤਰਾਲ ਦੀ ਦਰ ${periodic} ਹੈ। ${principal} ਦੇ ਨਿਵੇਸ਼ ਉੱਤੇ ${time} ਬਾਅਦ ਕੇਵਲ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      `${principal} ਨੂੰ ${time} ਲਈ ਲਾਇਆ ਗਿਆ ਅਤੇ ਹਰ ਵਾਰ ${periodic} ਵਿਆਜ ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਗਿਆ। ਕਮਾਇਆ ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`,
      `${credit} ${periodic} ਵਿਆਜ ਜੋੜਨ ਨਾਲ ${principal} ਦੀ ਰਕਮ ${time} ਵਿੱਚ ਵਧਦੀ ਹੈ। ਮੂਲਧਨ ਤੋਂ ਵੱਧ ਮਿਲੀ ਰਕਮ ਕਿੰਨੀ ਹੈ?`,
    ]);
    case "INT-QL-075": return choose(source, [
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ${years("pa-IN", s.years)} ਲਈ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਪਹਿਲੀ ਯੋਜਨਾ ਵਿੱਚ ਵਿਆਜ ${interval("pa-IN", s.frequency)} ਅਤੇ ਦੂਜੀ ਵਿੱਚ ${interval("pa-IN", s.comparisonFrequency)} ਜੁੜਦਾ ਹੈ। ਦੋਵੇਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਲਗਾਓ।`,
      `ਇੱਕੋ ${principal} ਰਕਮ ਅਤੇ ਸਾਲਾਨਾ ${annualRate} ਦਰ ਲਈ ਦੋ ਯੋਜਨਾਵਾਂ ਹਨ—${frequencyName("pa-IN", s.frequency)} ਅਤੇ ${frequencyName("pa-IN", s.comparisonFrequency)} ਵਿਆਜ ਜੋੜਨਾ। ${years("pa-IN", s.years)} ਬਾਅਦ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?`,
      `${principal} ਨੂੰ ${years("pa-IN", s.years)} ਲਈ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਉੱਤੇ ਲਾਇਆ ਗਿਆ। ਇੱਕ ਯੋਜਨਾ ਵਿੱਚ ਵਿਆਜ ${interval("pa-IN", s.frequency)} ਅਤੇ ਦੂਜੀ ਵਿੱਚ ${interval("pa-IN", s.comparisonFrequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਵੱਧ ਰਕਮ ਕਿੰਨੀ ਵੱਧ ਹੋਵੇਗੀ?`,
      `ਦੋ ਨਿਵੇਸ਼ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਮੂਲਧਨ ${principal}, ਦਰ ${annualRate} ਅਤੇ ਸਮਾਂ ${years("pa-IN", s.years)} ਇੱਕੋ ਹਨ। ਵਿਆਜ ਜੋੜਨ ਦਾ ਅੰਤਰਾਲ ਕ੍ਰਮਵਾਰ ${interval("pa-IN", s.frequency)} ਅਤੇ ${interval("pa-IN", s.comparisonFrequency)} ਹੈ। ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਲਗਾਓ।`,
    ]);
    case "INT-QL-076": return choose(source, [
      `ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਦਰ ${annualRate} ਹੈ ਅਤੇ ਵਿਆਜ ${credit} ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।`,
      `ਕਿਸੇ ਯੋਜਨਾ ਵਿੱਚ ਸਾਲਾਨਾ ਦਰ ${annualRate} ਲਿਖੀ ਹੈ, ਪਰ ਵਿਆਜ ${credit} ਜੁੜਦਾ ਹੈ। ਇੱਕ ਸਾਲ ਦੀ ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      `${annualRate} ਦੀ ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ${frequencyName("pa-IN", s.frequency)} ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਲਗਾਓ।`,
      `ਜੇ ਸਾਲਾਨਾ ਦਰ ${annualRate} ਹੋਵੇ ਅਤੇ ਵਿਆਜ ${credit} ਮੂਲਧਨ ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਵੇ, ਤਾਂ ਇੱਕ ਸਾਲ ਵਿੱਚ ਅਸਲ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਬਣਦੀ ਹੈ?`,
    ]);
    case "INT-QL-077": return choose(source, [
      `ਵਿਆਜ ${credit} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${effective} ਹੈ। ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।`,
      `ਇੱਕ ਯੋਜਨਾ ਦੀ ਅਸਲ ਸਾਲਾਨਾ ਵਾਧਾ ${effective} ਹੈ। ਜੇ ਵਿਆਜ ${credit} ਮੂਲਧਨ ਵਿੱਚ ਜੁੜਦਾ ਹੈ, ਤਾਂ ਲਿਖੀ ਹੋਈ ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
      `${frequencyName("pa-IN", s.frequency)} ਵਿਆਜ ਜੋੜਨ ਵਾਲੀ ਯੋਜਨਾ ਦੀ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${effective} ਹੈ। ਘੋਸ਼ਿਤ ਦਰ ਪਤਾ ਲਗਾਓ।`,
      `ਕਿਹੜੀ ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ਵਿਆਜ ${credit} ਜੋੜਨ ਨਾਲ ਇੱਕ ਸਾਲ ਦੀ ਪ੍ਰਭਾਵੀ ਦਰ ${effective} ਮਿਲੇਗੀ?`,
    ]);
    case "INT-QL-078": return choose(source, [
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ${years("pa-IN", s.years)} ਬਾਅਦ ਰਕਮ ${amount} ਹੋ ਗਈ। ਦੱਸੋ, ਵਿਆਜ ਸਾਲ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਗਿਆ ਸੀ।`,
      `ਇੱਕ ਨਿਵੇਸ਼ ${principal} ਤੋਂ ਵਧ ਕੇ ${amount} ਹੋ ਗਿਆ। ਸਮਾਂ ${years("pa-IN", s.years)} ਅਤੇ ਸਾਲਾਨਾ ਦਰ ${annualRate} ਹੈ। ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਪਛਾਣੋ।`,
      `ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਉੱਤੇ ${principal} ਦੀ ${years("pa-IN", s.years)} ਬਾਅਦ ਰਕਮ ${amount} ਹੈ। ਵਿਆਜ ਸਾਲਾਨਾ, ਛਿਮਾਹੀ, ਤਿਮਾਹੀ ਜਾਂ ਮਾਸਿਕ—ਕਿਹੜੇ ਅੰਤਰਾਲ ਉੱਤੇ ਜੋੜਿਆ ਗਿਆ?`,
      `ਮੂਲਧਨ ${principal}, ਅੰਤਿਮ ਰਕਮ ${amount}, ਸਮਾਂ ${years("pa-IN", s.years)} ਅਤੇ ਸਾਲਾਨਾ ਦਰ ${annualRate} ਹੈ। ਸਾਲ ਵਿੱਚ ਵਿਆਜ ਕਿੰਨੀ ਵਾਰ ਜੋੜਿਆ ਗਿਆ ਸੀ?`,
    ]);
    case "INT-QL-079": return choose(source, [
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਹੈ। ਪਹਿਲੇ ${years("pa-IN", s.fullYears)} ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਅਗਲੇ ${months("pa-IN", s.tailMonths)} ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਲਗਾਓ।`,
      `ਇੱਕ ਰਕਮ ${principal} ਨੂੰ ${years("pa-IN", s.fullYears)} ਤੱਕ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਉੱਤੇ ਰੱਖਿਆ ਗਿਆ। ਇਸ ਤੋਂ ਬਾਅਦ ${months("pa-IN", s.tailMonths)} ਲਈ ਉਸੇ ਦਰ ਨਾਲ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਾ। ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਪੂਰੇ ${years("pa-IN", s.fullYears)} ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਬਾਕੀ ${months("pa-IN", s.tailMonths)} ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਉੱਤੇ ਰਕਮ ਪਤਾ ਲਗਾਓ।`,
      `ਨਿਵੇਸ਼ ${principal} ਹੈ। ${years("pa-IN", s.fullYears)} ਬਾਅਦ ਬਣੀ ਰਕਮ ਉੱਤੇ ਅਗਲੇ ${months("pa-IN", s.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਲੱਗਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਮਿਲੇਗੀ?`,
    ]);
    case "INT-QL-080": return choose(source, [
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ${years("pa-IN", s.fullYears)} ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਅਗਲੇ ${months("pa-IN", s.tailMonths)} ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਕੁੱਲ ਕਮਾਇਆ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`,
      `ਇੱਕ ਨਿਵੇਸ਼ ${principal} ਹੈ। ਪਹਿਲਾਂ ${years("pa-IN", s.fullYears)} ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ ਜੋੜਿਆ ਗਿਆ ਅਤੇ ਫਿਰ ${months("pa-IN", s.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਲਾਇਆ ਗਿਆ। ਕੁੱਲ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?`,
      `${principal} ਉੱਤੇ ਪੂਰੇ ਸਾਲਾਂ ਵਿੱਚ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਬਾਕੀ ${months("pa-IN", s.tailMonths)} ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਦਰ ਸਾਲਾਨਾ ${annualRate} ਅਤੇ ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ${s.fullYears} ਹੈ। ਕਮਾਇਆ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`,
      `ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਉੱਤੇ ${principal} ਨੂੰ ${years("pa-IN", s.fullYears)} ਅਤੇ ਵਾਧੂ ${months("pa-IN", s.tailMonths)} ਲਈ ਲਾਇਆ ਗਿਆ। ਵਾਧੂ ਮਹੀਨਿਆਂ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਮੂਲਧਨ ਤੋਂ ਵੱਧ ਮਿਲੀ ਰਕਮ ਕਿੰਨੀ ਹੈ?`,
    ]);
    case "INT-QL-081": return choose(source, [
      `ਕਿਸੇ ਮੂਲਧਨ ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ${years("pa-IN", s.fullYears)} ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਅਗਲੇ ${months("pa-IN", s.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਲਾਉਣ ਉੱਤੇ ਰਕਮ ${brokenAmount} ਹੋਈ। ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।`,
      `${years("pa-IN", s.fullYears)} ਪੂਰੇ ਸਾਲ ਅਤੇ ${months("pa-IN", s.tailMonths)} ਵਾਧੂ ਸਮੇਂ ਬਾਅਦ ਕੁੱਲ ਰਕਮ ${brokenAmount} ਹੈ। ਦਰ ਸਾਲਾਨਾ ${annualRate} ਹੈ ਅਤੇ ਵਾਧੂ ਸਮੇਂ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਕਿੰਨੀ ਸੀ?`,
      `ਇੱਕ ਨਿਵੇਸ਼ ${years("pa-IN", s.fullYears)} ਤੱਕ ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਾਲ ਵਧਿਆ ਅਤੇ ਫਿਰ ${months("pa-IN", s.tailMonths)} ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਾ। ਅੰਤਿਮ ਰਕਮ ${brokenAmount} ਅਤੇ ਦਰ ${annualRate} ਹੈ। ਨਿਵੇਸ਼ ਪਤਾ ਲਗਾਓ।`,
      `${brokenAmount} ਦੀ ਅੰਤਿਮ ਰਕਮ ਵਿੱਚ ${years("pa-IN", s.fullYears)} ਦਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ${months("pa-IN", s.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਸ਼ਾਮਲ ਹੈ। ਸਾਲਾਨਾ ਦਰ ${annualRate} ਹੈ। ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`,
    ]);
    case "INT-QL-082": return choose(source, [
      `${principal} ਦੀ ਰਕਮ ${years("pa-IN", s.fullYears)} ਲਈ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਅਗਲੇ ${months("pa-IN", s.tailMonths)} ਦੇ ਸਧਾਰਣ ਵਿਆਜ ਬਾਅਦ ${brokenAmount} ਹੋ ਗਈ। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।`,
      `ਮੂਲਧਨ ${principal} ਅਤੇ ਅੰਤਿਮ ਰਕਮ ${brokenAmount} ਹੈ। ਪਹਿਲਾਂ ${years("pa-IN", s.fullYears)} ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਫਿਰ ${months("pa-IN", s.tailMonths)} ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਾ। ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੈ?`,
      `${principal} ਦਾ ਨਿਵੇਸ਼ ਪੂਰੇ ${years("pa-IN", s.fullYears)} ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਾਲ ਵਧਿਆ ਅਤੇ ਬਾਕੀ ${months("pa-IN", s.tailMonths)} ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਿਆ। ਜੇ ਰਕਮ ${brokenAmount} ਬਣੀ, ਤਾਂ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਲਗਾਓ।`,
      `ਕਿਹੜੀ ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ${principal}, ${years("pa-IN", s.fullYears)} ਦੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ${months("pa-IN", s.tailMonths)} ਦੇ ਸਧਾਰਣ ਵਿਆਜ ਬਾਅਦ ${brokenAmount} ਬਣੇਗਾ?`,
    ]);
    case "INT-QL-083": return choose(source, [
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਕੁਝ ਪੂਰੇ ਸਾਲਾਂ ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਫਿਰ ${months("pa-IN", s.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਲਾਇਆ ਗਿਆ। ਅੰਤਿਮ ਰਕਮ ${brokenAmount} ਹੈ। ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਲਗਾਓ।`,
      `ਇੱਕ ਨਿਵੇਸ਼ ${principal} ਤੋਂ ਵਧ ਕੇ ${brokenAmount} ਹੋਇਆ। ਦਰ ਸਾਲਾਨਾ ${annualRate} ਹੈ ਅਤੇ ਅੰਤਿਮ ${months("pa-IN", s.tailMonths)} ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਾ। ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਕਿੰਨੇ ਪੂਰੇ ਸਾਲ ਮਿਸ਼ਰਤ ਵਿਆਜ ਮਿਲਿਆ ਸੀ?`,
      `${principal} ਉੱਤੇ ਪਹਿਲਾਂ ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਅੰਤ ਵਿੱਚ ${months("pa-IN", s.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਿਆ। ਰਕਮ ${brokenAmount} ਬਣੀ। ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`,
      `ਅੰਤਿਮ ਰਕਮ ${brokenAmount}, ਮੂਲਧਨ ${principal} ਅਤੇ ਦਰ ${annualRate} ਹੈ। ਅੰਤਿਮ ${months("pa-IN", s.tailMonths)} ਸਧਾਰਣ ਵਿਆਜ ਦੇ ਹਨ। ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਪੂਰੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਵਾਲੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਲਗਾਓ।`,
    ]);
    case "INT-QL-084": return choose(source, [
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਹੈ। ਪਹਿਲੇ ${years("pa-IN", s.firstYears)} ਲਈ ਵਿਆਜ ${interval("pa-IN", s.firstFrequency)} ਅਤੇ ਅਗਲੇ ${years("pa-IN", s.secondYears)} ਲਈ ${interval("pa-IN", s.secondFrequency)} ਜੋੜਿਆ ਗਿਆ। ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਲਗਾਓ।`,
      `ਇੱਕ ਨਿਵੇਸ਼ ${principal} ਹੈ। ਸ਼ੁਰੂਆਤੀ ${years("pa-IN", s.firstYears)} ਵਿੱਚ ${frequencyName("pa-IN", s.firstFrequency)} ਅਤੇ ਬਾਅਦ ਦੇ ${years("pa-IN", s.secondYears)} ਵਿੱਚ ${frequencyName("pa-IN", s.secondFrequency)} ਵਿਆਜ ਜੋੜਿਆ ਗਿਆ। ਦਰ ਸਾਲਾਨਾ ${annualRate} ਹੈ। ਰਕਮ ਕਿੰਨੀ ਬਣੇਗੀ?`,
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਪਹਿਲੇ ${years("pa-IN", s.firstYears)} ਲਈ ਵਿਆਜ ${interval("pa-IN", s.firstFrequency)} ਜੋੜਿਆ ਗਿਆ। ਫਿਰ ਅਗਲੇ ${years("pa-IN", s.secondYears)} ਲਈ ਅੰਤਰਾਲ ਬਦਲ ਕੇ ${interval("pa-IN", s.secondFrequency)} ਕਰ ਦਿੱਤਾ ਗਿਆ। ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਲਗਾਓ।`,
      `ਵਿਆਜ ਜੋੜਨ ਦਾ ਅੰਤਰਾਲ ਵਿਚਕਾਰ ਬਦਲਦਾ ਹੈ: ${years("pa-IN", s.firstYears)} ਤੱਕ ${interval("pa-IN", s.firstFrequency)} ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ${years("pa-IN", s.secondYears)} ਤੱਕ ${interval("pa-IN", s.secondFrequency)}। ${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
    ]);
    case "INT-QL-085": return choose(source, [
      `${principal} ਉੱਤੇ ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਪਹਿਲੇ ${years("pa-IN", s.firstYears)} ਲਈ ਵਿਆਜ ${interval("pa-IN", s.firstFrequency)} ਅਤੇ ਅਗਲੇ ${years("pa-IN", s.secondYears)} ਲਈ ${interval("pa-IN", s.secondFrequency)} ਜੋੜਿਆ ਗਿਆ। ਕੁੱਲ ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`,
      `ਇੱਕ ਨਿਵੇਸ਼ ${principal} ਹੈ। ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ${frequencyName("pa-IN", s.firstFrequency)} ਅਤੇ ਦੂਜੇ ਪੜਾਅ ਵਿੱਚ ${frequencyName("pa-IN", s.secondFrequency)} ਵਿਆਜ ਜੋੜਿਆ ਗਿਆ। ਦੋਵੇਂ ਪੜਾਅ ਕ੍ਰਮਵਾਰ ${years("pa-IN", s.firstYears)} ਅਤੇ ${years("pa-IN", s.secondYears)} ਦੇ ਹਨ ਅਤੇ ਦਰ ${annualRate} ਹੈ। ਕਮਾਇਆ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?`,
      `${principal} ਉੱਤੇ ਵਿਆਜ ਜੋੜਨ ਦਾ ਅੰਤਰਾਲ ${years("pa-IN", s.firstYears)} ਬਾਅਦ ਬਦਲ ਦਿੱਤਾ ਗਿਆ—ਪਹਿਲਾਂ ${interval("pa-IN", s.firstFrequency)}, ਫਿਰ ${interval("pa-IN", s.secondFrequency)}। ਦੂਜਾ ਪੜਾਅ ${years("pa-IN", s.secondYears)} ਦਾ ਹੈ। ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਨਾਲ ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`,
      `ਸਾਲਾਨਾ ${annualRate} ਦੀ ਦਰ ਉੱਤੇ ${principal} ਨੂੰ ਦੋ ਪੜਾਵਾਂ ਵਿੱਚ ਲਾਇਆ ਗਿਆ। ${years("pa-IN", s.firstYears)} ਤੱਕ ਵਿਆਜ ${interval("pa-IN", s.firstFrequency)} ਅਤੇ ਅਗਲੇ ${years("pa-IN", s.secondYears)} ਤੱਕ ${interval("pa-IN", s.secondFrequency)} ਜੁੜਿਆ। ਮੂਲਧਨ ਤੋਂ ਵੱਧ ਮਿਲੀ ਰਕਮ ਕਿੰਨੀ ਹੈ?`,
    ]);
  }
}

export function renderCp004LocalizedNativeStemV6(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  const stem = locale === "hi-IN" ? renderHindi(source) : renderPunjabi(source);
  assertCp004LocalizedText(locale, stem, `${source.qlId}/${source.seed}/${locale}/native-stem-v6`);
  return stem;
}

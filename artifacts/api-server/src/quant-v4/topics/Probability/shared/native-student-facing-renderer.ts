import { rational, rationalText } from "./rational";
import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import type { ProbabilityQuestion } from "./types";

const num = (source: ProbabilityQuestion, key: string, fallback = 0): number => {
  const value = source.parameters[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

const text = (source: ProbabilityQuestion, key: string, fallback = ""): string => {
  const value = source.parameters[key];
  return typeof value === "string" ? value : fallback;
};

const frac = (a: number | bigint, b: number | bigint): string => rationalText(rational(a, b));
const tidy = (value: string): string => value.replace(/\s+/gu, " ").replace(/\s+([?.!,।])/gu, "$1").trim();

const ballWord = (language: ProbabilityNativeLanguage, count: number): string => language === "hi" ? "गेंद" : "ਗੇਂਦ";
const bagWord = (language: ProbabilityNativeLanguage): string => language === "hi" ? "बैग" : "ਬੈਗ";
const probabilityWord = (language: ProbabilityNativeLanguage): string => language === "hi" ? "प्रायिकता" : "ਸੰਭਾਵਨਾ";

function colour(value: string, language: ProbabilityNativeLanguage): string {
  const key = value.toLowerCase();
  const hi: Record<string, string> = { red: "लाल", blue: "नीली", green: "हरी", black: "काली" };
  const pa: Record<string, string> = { red: "ਲਾਲ", blue: "ਨੀਲੀ", green: "ਹਰੀ", black: "ਕਾਲੀ" };
  return (language === "hi" ? hi : pa)[key] ?? value;
}

function propertyPhrase(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const property = text(source, "property");
  if (language === "hi") {
    if (property === "EVEN") return "सम";
    if (property === "PRIME") return "अभाज्य";
    if (property === "COMPOSITE") return "संयोज्य";
    if (property === "GREATER_THAN") return `${num(source, "threshold")} से बड़ी`;
    if (property === "LESS_THAN") return `${num(source, "threshold")} से छोटी`;
    if (property === "DIVISIBLE") return `${num(source, "divisor")} से विभाज्य`;
  } else {
    if (property === "EVEN") return "ਜੋੜੀ";
    if (property === "PRIME") return "ਅਭਾਜ";
    if (property === "COMPOSITE") return "ਸੰਯੁਕਤ";
    if (property === "GREATER_THAN") return `${num(source, "threshold")} ਤੋਂ ਵੱਡੀ`;
    if (property === "LESS_THAN") return `${num(source, "threshold")} ਤੋਂ ਛੋਟੀ`;
    if (property === "DIVISIBLE") return `${num(source, "divisor")} ਨਾਲ ਭਾਗਯੋਗ`;
  }
  return property.replace(/_/gu, " ").toLowerCase();
}

function eventLabel(value: string, language: ProbabilityNativeLanguage): string {
  const normalized = value.trim().toLowerCase();
  const greater = normalized.match(/^an integer greater than (\d+)$/u);
  const less = normalized.match(/^an integer less than (\d+)$/u);
  const notExceeding = normalized.match(/^an integer not exceeding (\d+)$/u);
  const divisible = normalized.match(/^an integer divisible by (\d+)$/u);
  if (greater) return language === "hi" ? `${greater[1]} से बड़ा पूर्णांक` : `${greater[1]} ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ`;
  if (less) return language === "hi" ? `${less[1]} से छोटा पूर्णांक` : `${less[1]} ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ`;
  if (notExceeding) return language === "hi" ? `${notExceeding[1]} से अधिक न होने वाला पूर्णांक` : `${notExceeding[1]} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ ਪੂਰਨ ਅੰਕ`;
  if (divisible) return language === "hi" ? `${divisible[1]} से विभाज्य पूर्णांक` : `${divisible[1]} ਨਾਲ ਭਾਗਯੋਗ ਪੂਰਨ ਅੰਕ`;
  if (/^an? even integer$/u.test(normalized)) return language === "hi" ? "सम पूर्णांक" : "ਜੋੜੀ ਪੂਰਨ ਅੰਕ";
  if (/^an? odd integer$/u.test(normalized)) return language === "hi" ? "विषम पूर्णांक" : "ਬੇਜੋੜ ਪੂਰਨ ਅੰਕ";
  if (/^an? prime integer$/u.test(normalized)) return language === "hi" ? "अभाज्य पूर्णांक" : "ਅਭਾਜ ਪੂਰਨ ਅੰਕ";
  if (/^an? composite integer$/u.test(normalized)) return language === "hi" ? "संयोज्य पूर्णांक" : "ਸੰਯੁਕਤ ਪੂਰਨ ਅੰਕ";
  const hi: Record<string, string> = {
    "a candidate qualifies": "एक अभ्यर्थी के उत्तीर्ण होने",
    "a train arrives on time": "ट्रेन के समय पर पहुँचने",
    "a machine passes inspection": "मशीन के निरीक्षण में पास होने",
    "an integer not exceeding 8": "8 से अधिक न होने वाले पूर्णांक",
  };
  const pa: Record<string, string> = {
    "a candidate qualifies": "ਕਿਸੇ ਉਮੀਦਵਾਰ ਦੇ ਯੋਗ ਹੋਣ",
    "a train arrives on time": "ਰੇਲਗੱਡੀ ਦੇ ਸਮੇਂ ਸਿਰ ਪਹੁੰਚਣ",
    "a machine passes inspection": "ਮਸ਼ੀਨ ਦੇ ਜਾਂਚ ਵਿੱਚ ਪਾਸ ਹੋਣ",
    "an integer not exceeding 8": "8 ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲੇ ਪੂਰਨ ਅੰਕ",
  };
  return (language === "hi" ? hi : pa)[normalized] ?? value;
}

function oppositeEvent(value: string, language: ProbabilityNativeLanguage): string {
  const normalized = value.trim().toLowerCase();
  if (language === "hi") {
    if (normalized === "a candidate qualifies") return "अभ्यर्थी के उत्तीर्ण न होने";
    if (normalized === "a train arrives on time") return "ट्रेन के समय पर न पहुँचने";
    if (normalized === "a machine passes inspection") return "मशीन के निरीक्षण में पास न होने";
    return "घटना के न होने";
  }
  if (normalized === "a candidate qualifies") return "ਉਮੀਦਵਾਰ ਦੇ ਯੋਗ ਨਾ ਹੋਣ";
  if (normalized === "a train arrives on time") return "ਰੇਲਗੱਡੀ ਦੇ ਸਮੇਂ ਸਿਰ ਨਾ ਪਹੁੰਚਣ";
  if (normalized === "a machine passes inspection") return "ਮਸ਼ੀਨ ਦੇ ਜਾਂਚ ਵਿੱਚ ਪਾਸ ਨਾ ਹੋਣ";
  return "ਘਟਨਾ ਦੇ ਨਾ ਹੋਣ";
}

function directProbabilityStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const total = num(source, "total");
  const favourable = num(source, "favourable");
  const scenario = text(source, "scenario", "LOTTERY_TICKETS");
  if (language === "hi") {
    if (scenario === "DEFECTIVE_BULBS") return `एक बैच में ${total} बल्ब हैं, जिनमें से ${favourable} खराब हैं। एक बल्ब यादृच्छिक रूप से चुना जाता है। उसके खराब होने की प्रायिकता क्या है?`;
    if (scenario === "RED_BALLS") return `एक ${bagWord(language)} में ${total} गेंदें हैं, जिनमें से ${favourable} लाल हैं। एक गेंद यादृच्छिक रूप से निकाली जाती है। उसके लाल होने की प्रायिकता क्या है?`;
    if (scenario === "MATHEMATICS_BOOKS") return `एक शेल्फ पर ${total} पुस्तकें हैं, जिनमें से ${favourable} गणित की पुस्तकें हैं। एक पुस्तक यादृच्छिक रूप से चुनी जाती है। उसके गणित की पुस्तक होने की प्रायिकता क्या है?`;
    return `एक बॉक्स में ${total} लॉटरी टिकट हैं, जिनमें से ${favourable} इनाम वाले हैं। एक टिकट यादृच्छिक रूप से निकाला जाता है। उसके इनाम वाला टिकट होने की प्रायिकता क्या है?`;
  }
  if (scenario === "DEFECTIVE_BULBS") return `ਇੱਕ ਬੈਚ ਵਿੱਚ ${total} ਬਲਬ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${favourable} ਖਰਾਬ ਹਨ। ਇੱਕ ਬਲਬ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ਖਰਾਬ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  if (scenario === "RED_BALLS") return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${total} ਗੇਂਦਾਂ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${favourable} ਲਾਲ ਹਨ। ਇੱਕ ਗੇਂਦ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢੀ ਜਾਂਦੀ ਹੈ। ਉਸ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  if (scenario === "MATHEMATICS_BOOKS") return `ਇੱਕ ਸ਼ੈਲਫ਼ ਉੱਤੇ ${total} ਕਿਤਾਬਾਂ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${favourable} ਗਣਿਤ ਦੀਆਂ ਕਿਤਾਬਾਂ ਹਨ। ਇੱਕ ਕਿਤਾਬ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੀ ਜਾਂਦੀ ਹੈ। ਉਸ ਦੇ ਗਣਿਤ ਦੀ ਕਿਤਾਬ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  return `ਇੱਕ ਬਾਕਸ ਵਿੱਚ ${total} ਲਾਟਰੀ ਟਿਕਟ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${favourable} ਇਨਾਮ ਵਾਲੇ ਹਨ। ਇੱਕ ਟਿਕਟ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ਇਨਾਮ ਵਾਲਾ ਟਿਕਟ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
}

function reverseFavourableStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const total = num(source, "total");
  const probability = frac(num(source, "probabilityNumerator"), num(source, "probabilityDenominator", 1));
  const context = text(source, "context", "winning tickets");
  if (language === "hi") {
    if (/winning tickets?/iu.test(context)) return `एक बॉक्स में ${total} लॉटरी टिकट हैं। इनाम वाला टिकट निकलने की प्रायिकता ${probability} है। बॉक्स में कितने इनाम वाले टिकट हैं?`;
    if (/defective bulbs?/iu.test(context)) return `एक बैच में ${total} बल्ब हैं। एक बल्ब यादृच्छिक रूप से चुनने पर उसके खराब होने की प्रायिकता ${probability} है। खराब बल्बों की संख्या कितनी है?`;
    if (/qualified candidates?/iu.test(context)) return `${total} अभ्यर्थियों में से एक अभ्यर्थी यादृच्छिक रूप से चुना जाता है। उसके उत्तीर्ण होने की प्रायिकता ${probability} है। कितने अभ्यर्थी उत्तीर्ण हैं?`;
    if (/female employees?/iu.test(context)) return `एक कंपनी में ${total} कर्मचारी हैं। एक कर्मचारी यादृच्छिक रूप से चुनने पर उसके महिला होने की प्रायिकता ${probability} है। कंपनी में कितनी महिलाएँ कार्यरत हैं?`;
    return `एक समूह में ${total} व्यक्ति हैं। यादृच्छिक रूप से चुने गए व्यक्ति के दी गई शर्त पूरी करने की प्रायिकता ${probability} है। कितने व्यक्ति यह शर्त पूरी करते हैं?`;
  }
  if (/winning tickets?/iu.test(context)) return `ਇੱਕ ਬਾਕਸ ਵਿੱਚ ${total} ਲਾਟਰੀ ਟਿਕਟ ਹਨ। ਇਨਾਮ ਵਾਲਾ ਟਿਕਟ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ। ਬਾਕਸ ਵਿੱਚ ਕਿੰਨੇ ਇਨਾਮ ਵਾਲੇ ਟਿਕਟ ਹਨ?`;
  if (/defective bulbs?/iu.test(context)) return `ਇੱਕ ਬੈਚ ਵਿੱਚ ${total} ਬਲਬ ਹਨ। ਇੱਕ ਬਲਬ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਨ ਤੇ ਉਸ ਦੇ ਖਰਾਬ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ। ਖਰਾਬ ਬਲਬਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`;
  if (/qualified candidates?/iu.test(context)) return `${total} ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਇੱਕ ਉਮੀਦਵਾਰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ਯੋਗ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ। ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਯੋਗ ਹਨ?`;
  if (/female employees?/iu.test(context)) return `ਇੱਕ ਕੰਪਨੀ ਵਿੱਚ ${total} ਕਰਮਚਾਰੀ ਹਨ। ਇੱਕ ਕਰਮਚਾਰੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਨ ਤੇ ਉਸ ਦੇ ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ। ਕੰਪਨੀ ਵਿੱਚ ਕਿੰਨੀਆਂ ਔਰਤਾਂ ਕੰਮ ਕਰਦੀਆਂ ਹਨ?`;
  return `ਇੱਕ ਸਮੂਹ ਵਿੱਚ ${total} ਵਿਅਕਤੀ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਅਕਤੀ ਵੱਲੋਂ ਦਿੱਤੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ। ਕਿੰਨੇ ਵਿਅਕਤੀ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ?`;
}

function reverseTotalStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const favourable = num(source, "favourable");
  const probability = frac(num(source, "probabilityNumerator"), num(source, "probabilityDenominator", 1));
  const context = text(source, "context", "winning tickets");
  if (language === "hi") {
    if (/winning tickets?/iu.test(context)) return `एक बॉक्स में ${favourable} इनाम वाले लॉटरी टिकट हैं। यदि इनाम वाला टिकट निकलने की प्रायिकता ${probability} है, तो बॉक्स में कुल कितने लॉटरी टिकट हैं?`;
    if (/red balls?/iu.test(context)) return `एक ${bagWord(language)} में ${favourable} लाल गेंदें हैं। यदि यादृच्छिक रूप से निकाली गई गेंद के लाल होने की प्रायिकता ${probability} है, तो ${bagWord(language)} में कुल कितनी गेंदें हैं?`;
    if (/approved loan applications?/iu.test(context)) return `एक बैंक ने ${favourable} ऋण आवेदन स्वीकृत किए। यदि यादृच्छिक रूप से चुने गए आवेदन के स्वीकृत होने की प्रायिकता ${probability} है, तो कुल कितने ऋण आवेदन प्राप्त हुए थे?`;
    if (/successful candidates?/iu.test(context)) return `${favourable} अभ्यर्थी एक परीक्षा में उत्तीर्ण हुए। यदि यादृच्छिक रूप से चुने गए अभ्यर्थी के उत्तीर्ण होने की प्रायिकता ${probability} है, तो परीक्षा में कुल कितने अभ्यर्थी शामिल हुए थे?`;
    return `${favourable} व्यक्ति एक शर्त पूरी करते हैं। यदि यादृच्छिक रूप से चुने गए व्यक्ति के यह शर्त पूरी करने की प्रायिकता ${probability} है, तो समूह में कुल कितने व्यक्ति हैं?`;
  }
  if (/winning tickets?/iu.test(context)) return `ਇੱਕ ਬਾਕਸ ਵਿੱਚ ${favourable} ਇਨਾਮ ਵਾਲੇ ਲਾਟਰੀ ਟਿਕਟ ਹਨ। ਜੇ ਇਨਾਮ ਵਾਲਾ ਟਿਕਟ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ, ਤਾਂ ਬਾਕਸ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਲਾਟਰੀ ਟਿਕਟ ਹਨ?`;
  if (/red balls?/iu.test(context)) return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${favourable} ਲਾਲ ਗੇਂਦਾਂ ਹਨ। ਜੇ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢੀ ਗੇਂਦ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ, ਤਾਂ ${bagWord(language)} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ਗੇਂਦਾਂ ਹਨ?`;
  if (/approved loan applications?/iu.test(context)) return `ਇੱਕ ਬੈਂਕ ਨੇ ${favourable} ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ ਮਨਜ਼ੂਰ ਕੀਤੀਆਂ। ਜੇ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੀ ਅਰਜ਼ੀ ਦੇ ਮਨਜ਼ੂਰ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ, ਤਾਂ ਕੁੱਲ ਕਿੰਨੀਆਂ ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ ਪ੍ਰਾਪਤ ਹੋਈਆਂ ਸਨ?`;
  if (/successful candidates?/iu.test(context)) return `${favourable} ਉਮੀਦਵਾਰ ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਪਾਸ ਹੋਏ। ਜੇ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ, ਤਾਂ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਬੈਠੇ ਸਨ?`;
  return `${favourable} ਵਿਅਕਤੀ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ। ਜੇ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਅਕਤੀ ਵੱਲੋਂ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ, ਤਾਂ ਸਮੂਹ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਵਿਅਕਤੀ ਹਨ?`;
}

function cardRank(value: string, language: ProbabilityNativeLanguage): string {
  const key = value.toLowerCase();
  const hi: Record<string, string> = { ace: "इक्का", king: "बादशाह", queen: "बेगम", jack: "गुलाम" };
  const pa: Record<string, string> = { ace: "ਇੱਕਾ", king: "ਬਾਦਸ਼ਾਹ", queen: "ਬੇਗਮ", jack: "ਗੁਲਾਮ" };
  return (language === "hi" ? hi : pa)[key] ?? value;
}

function cardSuit(value: string, language: ProbabilityNativeLanguage): string {
  const key = value.replace(/s$/iu, "").toLowerCase();
  const hi: Record<string, string> = { spade: "स्पेड", heart: "हार्ट", diamond: "डायमंड", club: "क्लब" };
  const pa: Record<string, string> = { spade: "ਸਪੇਡ", heart: "ਹਾਰਟ", diamond: "ਡਾਇਮੰਡ", club: "ਕਲੱਬ" };
  return (language === "hi" ? hi : pa)[key] ?? value;
}

function cardCondition(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const mode = source.solveMode;
  const rank = cardRank(text(source, "rank", "king"), language);
  const suit = cardSuit(text(source, "suit", "spades"), language);
  const cardColour = colour(text(source, "colour", "red"), language);
  if (language === "hi") {
    if (mode === "findSuitProbability") return `${suit} का पत्ता`;
    if (mode === "findColourProbability") return `${cardColour} रंग का पत्ता`;
    if (mode === "findFaceCardProbability") return "फेस कार्ड";
    if (mode === "findUnionCardEventProbability") return `${rank} या ${suit} का पत्ता`;
    if (mode === "findComplementCardProbability") return `${suit} का न होने वाला पत्ता`;
    if (mode === "findCardPropertyIntersection") return `${suit} का ${rank}`;
    return `${rank}`;
  }
  if (mode === "findSuitProbability") return `${suit} ਦਾ ਪੱਤਾ`;
  if (mode === "findColourProbability") return `${cardColour} ਰੰਗ ਦਾ ਪੱਤਾ`;
  if (mode === "findFaceCardProbability") return "ਫੇਸ ਕਾਰਡ";
  if (mode === "findUnionCardEventProbability") return `${rank} ਜਾਂ ${suit} ਦਾ ਪੱਤਾ`;
  if (mode === "findComplementCardProbability") return `${suit} ਦਾ ਨਾ ਹੋਣ ਵਾਲਾ ਪੱਤਾ`;
  if (mode === "findCardPropertyIntersection") return `${suit} ਦਾ ${rank}`;
  return `${rank}`;
}

function committeeStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const men = num(source, "men");
  const women = num(source, "women");
  const size = num(source, "committeeSize");
  const required = num(source, "requiredWomen", 1);
  const mode = source.solveMode;
  const favourable = BigInt(String((source.solver.evidence as Record<string, unknown> | undefined)?.favourableOutcomeCount ?? 0));
  const total = BigInt(String((source.solver.evidence as Record<string, unknown> | undefined)?.totalOutcomeCount ?? 1));
  if (language === "hi") {
    if (mode === "findRestrictedSelectionProbability") return `${men} पुरुषों और ${women} महिलाओं में से ${size} सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में कम-से-कम एक महिला होने की प्रायिकता क्या है?`;
    if (mode === "findReverseCountFromProbability") return `${men} पुरुषों और ${women} महिलाओं में से ${size} सदस्यों की एक समिति बनाई जाती है। समिति में ठीक ${required} महिला होने की प्रायिकता ${frac(favourable, total)} है। ऐसी कितनी समितियाँ बनाई जा सकती हैं?`;
    return `${men} पुरुषों और ${women} महिलाओं में से ${size} सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में ठीक ${required} महिला होने की प्रायिकता क्या है?`;
  }
  if (mode === "findRestrictedSelectionProbability") return `${men} ਮਰਦਾਂ ਅਤੇ ${women} ਔਰਤਾਂ ਵਿੱਚੋਂ ${size} ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  if (mode === "findReverseCountFromProbability") return `${men} ਮਰਦਾਂ ਅਤੇ ${women} ਔਰਤਾਂ ਵਿੱਚੋਂ ${size} ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ ${required} ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${frac(favourable, total)} ਹੈ। ਅਜਿਹੀਆਂ ਕਿੰਨੀਆਂ ਕਮੇਟੀਆਂ ਬਣਾਈਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ?`;
  return `${men} ਮਰਦਾਂ ਅਤੇ ${women} ਔਰਤਾਂ ਵਿੱਚੋਂ ${size} ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ ${required} ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
}

function eventGroupStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const total = num(source, "total");
  const maths = num(source, "aCount");
  const english = num(source, "bCount");
  const both = num(source, "overlap");
  const mode = source.solveMode;
  const union = maths + english - both;
  if (language === "hi") {
    if (mode === "findUnionProbability") return `${total} विद्यार्थियों के एक समूह में ${maths} गणित में, ${english} अंग्रेज़ी में और ${both} दोनों विषयों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के कम-से-कम एक विषय में उत्तीर्ण होने की प्रायिकता क्या है?`;
    if (mode === "findIntersectionProbability") return `${total} विद्यार्थियों के एक समूह में ${both} विद्यार्थी गणित और अंग्रेज़ी दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के दोनों विषयों में उत्तीर्ण होने की प्रायिकता क्या है?`;
    if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) return `${total} विद्यार्थियों के एक समूह में ${maths} गणित में, ${english} अंग्रेज़ी में और ${both} दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के ठीक एक विषय में उत्तीर्ण होने की प्रायिकता क्या है?`;
    if (mode === "findNeitherEventProbability") return `${total} विद्यार्थियों के एक समूह में ${maths} गणित में, ${english} अंग्रेज़ी में और ${both} दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के किसी भी विषय में उत्तीर्ण न होने की प्रायिकता क्या है?`;
    return `${total} विद्यार्थियों के एक समूह के लिए P(गणित) = ${frac(maths, total)}, P(अंग्रेज़ी) = ${frac(english, total)} और P(गणित या अंग्रेज़ी) = ${frac(union, total)} है। P(गणित और अंग्रेज़ी) ज्ञात करें।`;
  }
  if (mode === "findUnionProbability") return `${total} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ${maths} ਗਣਿਤ ਵਿੱਚ, ${english} ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਅਤੇ ${both} ਦੋਵੇਂ ਵਿਸ਼ਿਆਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਿਸ਼ੇ ਵਿੱਚ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  if (mode === "findIntersectionProbability") return `${total} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ${both} ਵਿਦਿਆਰਥੀ ਗਣਿਤ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਦੋਵੇਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਦੋਵੇਂ ਵਿਸ਼ਿਆਂ ਵਿੱਚ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) return `${total} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ${maths} ਗਣਿਤ ਵਿੱਚ, ${english} ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਅਤੇ ${both} ਦੋਵੇਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਠੀਕ ਇੱਕ ਵਿਸ਼ੇ ਵਿੱਚ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  if (mode === "findNeitherEventProbability") return `${total} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ${maths} ਗਣਿਤ ਵਿੱਚ, ${english} ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਅਤੇ ${both} ਦੋਵੇਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਕਿਸੇ ਵੀ ਵਿਸ਼ੇ ਵਿੱਚ ਪਾਸ ਨਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  return `${total} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਲਈ P(ਗਣਿਤ) = ${frac(maths, total)}, P(ਅੰਗਰੇਜ਼ੀ) = ${frac(english, total)} ਅਤੇ P(ਗਣਿਤ ਜਾਂ ਅੰਗਰੇਜ਼ੀ) = ${frac(union, total)} ਹੈ। P(ਗਣਿਤ ਅਤੇ ਅੰਗਰੇਜ਼ੀ) ਕੱਢੋ।`;
}

export function renderNativeStudentFacingStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const mode = source.solveMode;
  const red = num(source, "red");
  const blue = num(source, "blue");
  const draw = num(source, "draw", 1);
  const trials = num(source, "trials", num(source, "tosses"));
  const P = probabilityWord(language);

  if (source.canonicalProblemId === "PRB-CP-008" && ["findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findReverseCountFromProbability"].includes(mode)) {
    return tidy(committeeStem(source, language));
  }

  if (mode === "findDirectProbability") return tidy(directProbabilityStem(source, language));
  if (["findFavourableOutcomeCount", "findMissingEventCountFromProbability"].includes(mode)) return tidy(reverseFavourableStem(source, language));
  if (mode === "findTotalOutcomeCount") return tidy(reverseTotalStem(source, language));

  if (language === "hi") {
    switch (mode) {
      case "identifyImpossibleCertainOrPossibleEvent": return tidy(`1 से ${num(source, "n")} तक के पूर्णांकों में से एक पूर्णांक यादृच्छिक रूप से चुना जाता है। उसके ${eventLabel(text(source, "eventLabel"), language)} की प्रायिकता क्या है?`);
      case "findProbabilityFromSimpleFrequencyTable": return tidy(`एक ${bagWord(language)} में ${red} लाल, ${blue} नीली और ${num(source, "green")} हरी गेंदें हैं। एक गेंद यादृच्छिक रूप से निकाली जाती है। ${colour(text(source, "target", "red"), language)} गेंद निकलने की प्रायिकता क्या है?`);
      case "findComplementProbability": { const label = text(source, "eventLabel", "the event occurs"); return tidy(`${eventLabel(label, language)} की प्रायिकता ${frac(num(source, "givenNumerator"), num(source, "givenDenominator", 1))} है। ${oppositeEvent(label, language)} की प्रायिकता क्या है?`); }
      case "findAtLeastOneUsingComplement": return `एक निष्पक्ष सिक्के को ${trials} बार उछाला जाता है। कम-से-कम एक चित आने की प्रायिकता क्या है?`;
      case "findNoneProbability": return `एक निष्पक्ष सिक्के को ${trials} बार उछाला जाता है। एक भी चित न आने की प्रायिकता क्या है?`;
      case "findExactlyOneSuccess": return `एक निष्पक्ष सिक्के को ${trials} बार उछाला जाता है। ठीक एक चित आने की प्रायिकता क्या है?`;
      case "findExactlyKSuccessSmallCase": return `एक निष्पक्ष सिक्के को ${trials} बार उछाला जाता है। ठीक ${num(source, "k")} चित आने की प्रायिकता क्या है?`;
      case "findAtMostKSuccessSmallCase": return `एक निष्पक्ष सिक्के को ${trials} बार उछाला जाता है। अधिकतम ${num(source, "k")} चित आने की प्रायिकता क्या है?`;
      case "findAllSuccessOrNotAll": return `एक निष्पक्ष सिक्के को ${trials} बार उछाला जाता है। सभी उछालों में एक ही पक्ष आने की प्रायिकता क्या है?`;
      case "findCoinPatternProbability": { const pattern = [...text(source, "pattern")].map((token) => token === "H" ? "चित" : "पट").join("-"); return `एक निष्पक्ष सिक्के को ${num(source, "tosses")} बार उछाला जाता है। क्रम ${pattern} प्राप्त होने की प्रायिकता क्या है?`; }
      case "findCoinHeadCountProbability": return `एक निष्पक्ष सिक्के को ${num(source, "tosses")} बार उछाला जाता है। ठीक ${num(source, "heads")} चित आने की प्रायिकता क्या है?`;
      case "findSingleDieEventProbability": return `एक निष्पक्ष पासा एक बार फेंका जाता है। ${propertyPhrase(source, language)} संख्या आने की प्रायिकता क्या है?`;
      case "findTwoDiceSumProbability": return `दो निष्पक्ष पासे फेंके जाते हैं। प्राप्त संख्याओं का योग ${num(source, "targetSum")} होने की प्रायिकता क्या है?`;
      case "findTwoDiceProductOrParityProbability": { const kind = text(source, "eventType"); if (kind === "PRODUCT") return `दो निष्पक्ष पासे फेंके जाते हैं। प्राप्त संख्याओं का गुणनफल ${num(source, "targetProduct")} होने की प्रायिकता क्या है?`; return kind === "SAME_PARITY" ? "दो निष्पक्ष पासे फेंके जाते हैं। दोनों संख्याओं के सम या दोनों के विषम होने की प्रायिकता क्या है?" : "दो निष्पक्ष पासे फेंके जाते हैं। एक संख्या सम और दूसरी विषम होने की प्रायिकता क्या है?"; }
      case "findSpinnerEventProbability": return `एक स्पिनर में ${num(source, "sectors")} समान भाग हैं, जिनमें से ${num(source, "favourableSectors")} रंगे हुए हैं। स्पिनर को एक बार घुमाने पर उसके रंगे हुए भाग पर रुकने की प्रायिकता क्या है?`;
      case "findReverseDiceOrSpinnerEventCount": return `एक स्पिनर में ${num(source, "sectors")} समान भाग हैं। उसके चिन्हित भाग पर रुकने की प्रायिकता ${frac(num(source, "favourableSectors"), num(source, "sectors", 1))} है। कितने भाग चिन्हित हैं?`;
      case "findNumberRangePropertyProbability": return `${num(source, "lower", 1)} से ${num(source, "upper")} तक के पूर्णांकों में से एक पूर्णांक यादृच्छिक रूप से चुना जाता है। उसके ${propertyPhrase(source, language)} होने की प्रायिकता क्या है?`;
      case "findRankProbability": case "findSuitProbability": case "findColourProbability": case "findFaceCardProbability": case "findUnionCardEventProbability": case "findComplementCardProbability": case "findCardPropertyIntersection": return `52 पत्तों की एक मानक ताश की गड्डी से एक पत्ता यादृच्छिक रूप से निकाला जाता है। ${cardCondition(source, language)} निकलने की प्रायिकता क्या है?`;
      case "findMissingDeckCountOrEventCount": { const evidence = source.solver.evidence as Record<string, unknown> | undefined; const fav = BigInt(String(evidence?.favourableOutcomeCount ?? 0)); return `52 पत्तों की मानक ताश की गड्डी में ${cardCondition(source, language)} निकलने की प्रायिकता ${frac(fav, 52n)} है। इस शर्त को पूरा करने वाले कितने पत्ते हैं?`; }
      case "findSingleDrawColourProbability": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। एक गेंद यादृच्छिक रूप से निकाली जाती है। उसके लाल होने की प्रायिकता क्या है?`;
      case "findMissingObjectCountFromProbability": return `एक ${bagWord(language)} में कुल ${red + blue} गेंदें हैं। लाल गेंद निकलने की प्रायिकता ${frac(red, red + blue)} है। ${bagWord(language)} में कितनी लाल गेंदें हैं?`;
      case "findSimultaneousSameTypeProbability": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। ${draw} गेंदें एक साथ बिना वापस रखे निकाली जाती हैं। सभी निकाली गई गेंदों के एक ही रंग की होने की प्रायिकता क्या है?`;
      case "findSimultaneousDifferentTypeProbability": return draw === 2 ? `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। दो गेंदें एक साथ बिना वापस रखे निकाली जाती हैं। एक लाल और एक नीली गेंद निकलने की प्रायिकता क्या है?` : `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। ${draw} गेंदें एक साथ बिना वापस रखे निकाली जाती हैं। दोनों रंगों में से कम-से-कम एक-एक गेंद निकलने की प्रायिकता क्या है?`;
      case "findExactCompositionProbability": case "findSelectionProbabilityUsingCombination": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। ${draw} गेंदें एक साथ बिना वापस रखे निकाली जाती हैं। निकाली गई गेंदों में ठीक ${num(source, "exactRed", 1)} लाल गेंद होने की प्रायिकता क्या है?`;
      case "findNoObjectOfTypeProbability": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। ${draw} गेंदें एक साथ बिना वापस रखे निकाली जाती हैं। सभी निकाली गई गेंदों के नीली होने की प्रायिकता क्या है?`;
      case "findAtLeastOneObjectOfType": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। ${draw} गेंदें एक साथ बिना वापस रखे निकाली जाती हैं। कम-से-कम एक लाल गेंद निकलने की प्रायिकता क्या है?`;
      case "findSuccessiveIndependentProbability": case "findWithReplacementProbability": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। एक गेंद निकालकर वापस रख दी जाती है, फिर दूसरी गेंद निकाली जाती है। दोनों गेंदों के लाल होने की प्रायिकता क्या है?`;
      case "findSuccessiveDependentProbability": case "findWithoutReplacementProbability": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। दो गेंदें क्रमशः बिना वापस रखे निकाली जाती हैं। दोनों गेंदों के लाल होने की प्रायिकता क्या है?`;
      case "findOrderedDrawSequenceProbability": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। दो गेंदें क्रमशः बिना वापस रखे निकाली जाती हैं। पहले लाल और फिर नीली गेंद निकलने की प्रायिकता क्या है?`;
      case "findSameTypeInSuccessiveDraws": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। दो गेंदें क्रमशः बिना वापस रखे निकाली जाती हैं। दोनों गेंदों के एक ही रंग की होने की प्रायिकता क्या है?`;
      case "findDifferentTypesInSuccessiveDraws": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। दो गेंदें क्रमशः बिना वापस रखे निकाली जाती हैं। दोनों गेंदों के अलग-अलग रंग की होने की प्रायिकता क्या है?`;
      case "findAtLeastOneAcrossIndependentStages": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। दो गेंदें वापस रखकर निकाली जाती हैं। कम-से-कम एक लाल गेंद निकलने की प्रायिकता क्या है?`;
      case "findConditionalProbabilityByCounting": case "findConditionalFromTwoWayTable": return `गणित में उत्तीर्ण ${num(source, "mathTotal")} विद्यार्थियों में से ${num(source, "both")} अंग्रेज़ी में भी उत्तीर्ण हैं। गणित में उत्तीर्ण विद्यार्थियों में से एक विद्यार्थी यादृच्छिक रूप से चुना जाता है। उसके अंग्रेज़ी में भी उत्तीर्ण होने की प्रायिकता क्या है?`;
      case "findConditionalCardProbability": return "मानक 52 पत्तों की गड्डी से निकला पत्ता फेस कार्ड है। उसके बादशाह होने की प्रायिकता क्या है?";
      case "findConditionalNumberProbability": return `1 से ${num(source, "upper")} तक चुना गया एक पूर्णांक ${num(source, "conditionDivisor")} से विभाज्य है। उसके ${num(source, "targetDivisor")} से भी विभाज्य होने की प्रायिकता क्या है?`;
      case "findConditionalUrnProbability": return `एक ${bagWord(language)} में ${red} लाल और ${blue} नीली गेंदें हैं। दो गेंदें बिना वापस रखे निकाली जाती हैं। यदि पहली गेंद लाल है, तो दूसरी गेंद के भी लाल होने की प्रायिकता क्या है?`;
      case "findReverseConditionalCount": { const status = text(source, "targetLabel", "certified") === "certified" ? "प्रमाणित" : "शॉर्टलिस्ट"; return `${num(source, "restrictedTotal")} शॉर्टलिस्ट किए गए अभ्यर्थियों में से यादृच्छिक रूप से चुने गए अभ्यर्थी के ${status} होने की प्रायिकता ${frac(num(source, "favourable"), num(source, "restrictedTotal", 1))} है। ऐसे कितने अभ्यर्थी हैं?`; }
      case "findRandomArrangementPropertyProbability": return `${num(source, "people")} व्यक्ति यादृच्छिक क्रम में खड़े होते हैं। किसी एक निश्चित व्यक्ति के पहले स्थान पर होने की प्रायिकता क्या है?`;
      case "findTogetherOrApartProbability": return `${num(source, "people")} व्यक्ति यादृच्छिक क्रम में खड़े होते हैं। दो निश्चित व्यक्तियों के ${text(source, "relation", "TOGETHER") === "APART" ? "एक-दूसरे के पास न होने" : "एक-दूसरे के पास होने"} की प्रायिकता क्या है?`;
      case "findPositionRestrictionProbability": return `${num(source, "positions")} अलग-अलग पद ${num(source, "men")} पुरुषों और ${num(source, "women")} महिलाओं में यादृच्छिक रूप से बाँटे जाते हैं। पहला पद किसी महिला को मिलने की प्रायिकता क्या है?`;
      case "findNumberFormationProbability": return `${num(source, "minDigit", 1)} से ${num(source, "maxDigit")} तक के अंकों का बिना पुनरावृत्ति उपयोग करके ${num(source, "length")} अंकों की एक संख्या बनाई जाती है। संख्या के सम होने की प्रायिकता क्या है?`;
      case "findUnionProbability": case "findIntersectionProbability": case "findExactlyOneOfTwoEvents": case "findMixedEventExpressionProbability": case "findNeitherEventProbability": case "findMissingIntersectionOrUnionProbability": return eventGroupStem(source, language);
      case "findMutuallyExclusiveUnion": return `किसी अभ्यर्थी को पुरस्कार A या पुरस्कार B मिल सकता है, लेकिन दोनों नहीं। यदि P(A) = ${frac(num(source, "aNumerator"), num(source, "aDenominator", 1))} और P(B) = ${frac(num(source, "bNumerator"), num(source, "bDenominator", 1))} है, तो किसी एक पुरस्कार के मिलने की प्रायिकता क्या है?`;
      case "findIndependentIntersection": return `किसी अभ्यर्थी के सेक्शन A और सेक्शन B उत्तीर्ण करने की प्रायिकताएँ क्रमशः ${frac(num(source, "aNumerator"), num(source, "aDenominator", 1))} और ${frac(num(source, "bNumerator"), num(source, "bDenominator", 1))} हैं। दोनों परिणाम स्वतंत्र हैं। अभ्यर्थी के दोनों सेक्शन उत्तीर्ण करने की प्रायिकता क्या है?`;
    }
  } else {
    switch (mode) {
      case "identifyImpossibleCertainOrPossibleEvent": return tidy(`1 ਤੋਂ ${num(source, "n")} ਤੱਕ ਦੇ ਪੂਰਨ ਅੰਕਾਂ ਵਿੱਚੋਂ ਇੱਕ ਪੂਰਨ ਅੰਕ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ${eventLabel(text(source, "eventLabel"), language)} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`);
      case "findProbabilityFromSimpleFrequencyTable": return tidy(`ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ, ${blue} ਨੀਲੀਆਂ ਅਤੇ ${num(source, "green")} ਹਰੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਇੱਕ ਗੇਂਦ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢੀ ਜਾਂਦੀ ਹੈ। ${colour(text(source, "target", "red"), language)} ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`);
      case "findComplementProbability": { const label = text(source, "eventLabel", "the event occurs"); return tidy(`${eventLabel(label, language)} ਦੀ ਸੰਭਾਵਨਾ ${frac(num(source, "givenNumerator"), num(source, "givenDenominator", 1))} ਹੈ। ${oppositeEvent(label, language)} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`); }
      case "findAtLeastOneUsingComplement": return `ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕੇ ਨੂੰ ${trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਚਿੱਤ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findNoneProbability": return `ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕੇ ਨੂੰ ${trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਇੱਕ ਵੀ ਚਿੱਤ ਨਾ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findExactlyOneSuccess": return `ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕੇ ਨੂੰ ${trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਠੀਕ ਇੱਕ ਚਿੱਤ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findExactlyKSuccessSmallCase": return `ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕੇ ਨੂੰ ${trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਠੀਕ ${num(source, "k")} ਚਿੱਤ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findAtMostKSuccessSmallCase": return `ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕੇ ਨੂੰ ${trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਵੱਧ ਤੋਂ ਵੱਧ ${num(source, "k")} ਚਿੱਤ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findAllSuccessOrNotAll": return `ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕੇ ਨੂੰ ${trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਸਾਰੇ ਉਛਾਲਾਂ ਵਿੱਚ ਇੱਕੋ ਪਾਸਾ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findCoinPatternProbability": { const pattern = [...text(source, "pattern")].map((token) => token === "H" ? "ਚਿੱਤ" : "ਪੱਟ").join("-"); return `ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕੇ ਨੂੰ ${num(source, "tosses")} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਕ੍ਰਮ ${pattern} ਪ੍ਰਾਪਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`; }
      case "findCoinHeadCountProbability": return `ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕੇ ਨੂੰ ${num(source, "tosses")} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਠੀਕ ${num(source, "heads")} ਚਿੱਤ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findSingleDieEventProbability": return `ਇੱਕ ਨਿਰਪੱਖ ਪਾਸਾ ਇੱਕ ਵਾਰ ਸੁੱਟਿਆ ਜਾਂਦਾ ਹੈ। ${propertyPhrase(source, language)} ਸੰਖਿਆ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findTwoDiceSumProbability": return `ਦੋ ਨਿਰਪੱਖ ਪਾਸੇ ਸੁੱਟੇ ਜਾਂਦੇ ਹਨ। ਪ੍ਰਾਪਤ ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ ${num(source, "targetSum")} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findTwoDiceProductOrParityProbability": { const kind = text(source, "eventType"); if (kind === "PRODUCT") return `ਦੋ ਨਿਰਪੱਖ ਪਾਸੇ ਸੁੱਟੇ ਜਾਂਦੇ ਹਨ। ਪ੍ਰਾਪਤ ਸੰਖਿਆਵਾਂ ਦਾ ਗੁਣਨਫਲ ${num(source, "targetProduct")} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`; return kind === "SAME_PARITY" ? "ਦੋ ਨਿਰਪੱਖ ਪਾਸੇ ਸੁੱਟੇ ਜਾਂਦੇ ਹਨ। ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਦੇ ਜੋੜੀ ਜਾਂ ਦੋਵੇਂ ਦੇ ਬੇਜੋੜ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?" : "ਦੋ ਨਿਰਪੱਖ ਪਾਸੇ ਸੁੱਟੇ ਜਾਂਦੇ ਹਨ। ਇੱਕ ਸੰਖਿਆ ਜੋੜੀ ਅਤੇ ਦੂਜੀ ਬੇਜੋੜ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?"; }
      case "findSpinnerEventProbability": return `ਇੱਕ ਸਪਿਨਰ ਵਿੱਚ ${num(source, "sectors")} ਬਰਾਬਰ ਭਾਗ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${num(source, "favourableSectors")} ਰੰਗੇ ਹੋਏ ਹਨ। ਸਪਿਨਰ ਨੂੰ ਇੱਕ ਵਾਰ ਘੁਮਾਉਣ ਤੇ ਉਸ ਦੇ ਰੰਗੇ ਭਾਗ ਉੱਤੇ ਰੁਕਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findReverseDiceOrSpinnerEventCount": return `ਇੱਕ ਸਪਿਨਰ ਵਿੱਚ ${num(source, "sectors")} ਬਰਾਬਰ ਭਾਗ ਹਨ। ਉਸ ਦੇ ਨਿਸ਼ਾਨ ਲੱਗੇ ਭਾਗ ਉੱਤੇ ਰੁਕਣ ਦੀ ਸੰਭਾਵਨਾ ${frac(num(source, "favourableSectors"), num(source, "sectors", 1))} ਹੈ। ਕਿੰਨੇ ਭਾਗਾਂ ਉੱਤੇ ਨਿਸ਼ਾਨ ਲੱਗੇ ਹਨ?`;
      case "findNumberRangePropertyProbability": return `${num(source, "lower", 1)} ਤੋਂ ${num(source, "upper")} ਤੱਕ ਦੇ ਪੂਰਨ ਅੰਕਾਂ ਵਿੱਚੋਂ ਇੱਕ ਪੂਰਨ ਅੰਕ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ${propertyPhrase(source, language)} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findRankProbability": case "findSuitProbability": case "findColourProbability": case "findFaceCardProbability": case "findUnionCardEventProbability": case "findComplementCardProbability": case "findCardPropertyIntersection": return `52 ਪੱਤਿਆਂ ਦੀ ਮਿਆਰੀ ਤਾਸ਼ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਇੱਕ ਪੱਤਾ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ${cardCondition(source, language)} ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findMissingDeckCountOrEventCount": { const evidence = source.solver.evidence as Record<string, unknown> | undefined; const fav = BigInt(String(evidence?.favourableOutcomeCount ?? 0)); return `52 ਪੱਤਿਆਂ ਦੀ ਮਿਆਰੀ ਤਾਸ਼ ਦੀ ਗੱਡੀ ਵਿੱਚ ${cardCondition(source, language)} ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ${frac(fav, 52n)} ਹੈ। ਇਸ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਕਿੰਨੇ ਪੱਤੇ ਹਨ?`; }
      case "findSingleDrawColourProbability": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਇੱਕ ਗੇਂਦ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢੀ ਜਾਂਦੀ ਹੈ। ਉਸ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findMissingObjectCountFromProbability": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ਕੁੱਲ ${red + blue} ਗੇਂਦਾਂ ਹਨ। ਲਾਲ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ${frac(red, red + blue)} ਹੈ। ${bagWord(language)} ਵਿੱਚ ਕਿੰਨੀਆਂ ਲਾਲ ਗੇਂਦਾਂ ਹਨ?`;
      case "findSimultaneousSameTypeProbability": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ${draw} ਗੇਂਦਾਂ ਇਕੱਠੀਆਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਸਾਰੀਆਂ ਕੱਢੀਆਂ ਗੇਂਦਾਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੀਆਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findSimultaneousDifferentTypeProbability": return draw === 2 ? `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਇਕੱਠੀਆਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਇੱਕ ਲਾਲ ਅਤੇ ਇੱਕ ਨੀਲੀ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?` : `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ${draw} ਗੇਂਦਾਂ ਇਕੱਠੀਆਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਰੰਗਾਂ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ-ਇੱਕ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findExactCompositionProbability": case "findSelectionProbabilityUsingCombination": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ${draw} ਗੇਂਦਾਂ ਇਕੱਠੀਆਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਕੱਢੀਆਂ ਗੇਂਦਾਂ ਵਿੱਚ ਠੀਕ ${num(source, "exactRed", 1)} ਲਾਲ ਗੇਂਦ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findNoObjectOfTypeProbability": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ${draw} ਗੇਂਦਾਂ ਇਕੱਠੀਆਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਸਾਰੀਆਂ ਕੱਢੀਆਂ ਗੇਂਦਾਂ ਦੇ ਨੀਲੀਆਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findAtLeastOneObjectOfType": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ${draw} ਗੇਂਦਾਂ ਇਕੱਠੀਆਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findSuccessiveIndependentProbability": case "findWithReplacementProbability": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਇੱਕ ਗੇਂਦ ਕੱਢ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ, ਫਿਰ ਦੂਜੀ ਗੇਂਦ ਕੱਢੀ ਜਾਂਦੀ ਹੈ। ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findSuccessiveDependentProbability": case "findWithoutReplacementProbability": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਲਗਾਤਾਰ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findOrderedDrawSequenceProbability": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਲਗਾਤਾਰ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਪਹਿਲਾਂ ਲਾਲ ਅਤੇ ਫਿਰ ਨੀਲੀ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findSameTypeInSuccessiveDraws": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਲਗਾਤਾਰ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੀਆਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findDifferentTypesInSuccessiveDraws": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਲਗਾਤਾਰ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਰੰਗ ਦੀਆਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findAtLeastOneAcrossIndependentStages": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਵਾਪਸ ਰੱਖ ਕੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findConditionalProbabilityByCounting": case "findConditionalFromTwoWayTable": return `ਗਣਿਤ ਵਿੱਚ ਪਾਸ ${num(source, "mathTotal")} ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ ${num(source, "both")} ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਗਣਿਤ ਵਿੱਚ ਪਾਸ ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ ਇੱਕ ਵਿਦਿਆਰਥੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findConditionalCardProbability": return "ਮਿਆਰੀ 52 ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਕੱਢਿਆ ਪੱਤਾ ਫੇਸ ਕਾਰਡ ਹੈ। ਉਸ ਦੇ ਬਾਦਸ਼ਾਹ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?";
      case "findConditionalNumberProbability": return `1 ਤੋਂ ${num(source, "upper")} ਤੱਕ ਚੁਣਿਆ ਗਿਆ ਇੱਕ ਪੂਰਨ ਅੰਕ ${num(source, "conditionDivisor")} ਨਾਲ ਭਾਗਯੋਗ ਹੈ। ਉਸ ਦੇ ${num(source, "targetDivisor")} ਨਾਲ ਵੀ ਭਾਗਯੋਗ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findConditionalUrnProbability": return `ਇੱਕ ${bagWord(language)} ਵਿੱਚ ${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਜੇ ਪਹਿਲੀ ਗੇਂਦ ਲਾਲ ਹੈ, ਤਾਂ ਦੂਜੀ ਗੇਂਦ ਦੇ ਵੀ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findReverseConditionalCount": { const status = text(source, "targetLabel", "certified") === "certified" ? "ਪ੍ਰਮਾਣਿਤ" : "ਸ਼ਾਰਟਲਿਸਟ"; return `${num(source, "restrictedTotal")} ਸ਼ਾਰਟਲਿਸਟ ਕੀਤੇ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ${status} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${frac(num(source, "favourable"), num(source, "restrictedTotal", 1))} ਹੈ। ਅਜਿਹੇ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਹਨ?`; }
      case "findRandomArrangementPropertyProbability": return `${num(source, "people")} ਵਿਅਕਤੀ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਵਿੱਚ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਨ। ਕਿਸੇ ਇੱਕ ਨਿਸ਼ਚਿਤ ਵਿਅਕਤੀ ਦੇ ਪਹਿਲੇ ਸਥਾਨ ਉੱਤੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findTogetherOrApartProbability": return `${num(source, "people")} ਵਿਅਕਤੀ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਵਿੱਚ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਨ। ਦੋ ਨਿਸ਼ਚਿਤ ਵਿਅਕਤੀਆਂ ਦੇ ${text(source, "relation", "TOGETHER") === "APART" ? "ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਨਾ ਖੜ੍ਹੇ ਹੋਣ" : "ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਖੜ੍ਹੇ ਹੋਣ"} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findPositionRestrictionProbability": return `${num(source, "positions")} ਵੱਖ-ਵੱਖ ਅਹੁਦੇ ${num(source, "men")} ਮਰਦਾਂ ਅਤੇ ${num(source, "women")} ਔਰਤਾਂ ਵਿੱਚ ਬੇਤਰਤੀਬੀ ਨਾਲ ਵੰਡੇ ਜਾਂਦੇ ਹਨ। ਪਹਿਲਾ ਅਹੁਦਾ ਕਿਸੇ ਔਰਤ ਨੂੰ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findNumberFormationProbability": return `${num(source, "minDigit", 1)} ਤੋਂ ${num(source, "maxDigit")} ਤੱਕ ਦੇ ਅੰਕਾਂ ਨੂੰ ਬਿਨਾਂ ਦੁਹਰਾਏ ਵਰਤ ਕੇ ${num(source, "length")} ਅੰਕਾਂ ਦੀ ਇੱਕ ਸੰਖਿਆ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਸੰਖਿਆ ਦੇ ਜੋੜੀ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findUnionProbability": case "findIntersectionProbability": case "findExactlyOneOfTwoEvents": case "findMixedEventExpressionProbability": case "findNeitherEventProbability": case "findMissingIntersectionOrUnionProbability": return eventGroupStem(source, language);
      case "findMutuallyExclusiveUnion": return `ਕਿਸੇ ਉਮੀਦਵਾਰ ਨੂੰ ਇਨਾਮ A ਜਾਂ ਇਨਾਮ B ਮਿਲ ਸਕਦਾ ਹੈ, ਪਰ ਦੋਵੇਂ ਨਹੀਂ। ਜੇ P(A) = ${frac(num(source, "aNumerator"), num(source, "aDenominator", 1))} ਅਤੇ P(B) = ${frac(num(source, "bNumerator"), num(source, "bDenominator", 1))} ਹੈ, ਤਾਂ ਕਿਸੇ ਇੱਕ ਇਨਾਮ ਦੇ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
      case "findIndependentIntersection": return `ਕਿਸੇ ਉਮੀਦਵਾਰ ਦੇ ਸੈਕਸ਼ਨ A ਅਤੇ ਸੈਕਸ਼ਨ B ਪਾਸ ਕਰਨ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਕ੍ਰਮਵਾਰ ${frac(num(source, "aNumerator"), num(source, "aDenominator", 1))} ਅਤੇ ${frac(num(source, "bNumerator"), num(source, "bDenominator", 1))} ਹਨ। ਦੋਵੇਂ ਨਤੀਜੇ ਸੁਤੰਤਰ ਹਨ। ਉਮੀਦਵਾਰ ਦੇ ਦੋਵੇਂ ਸੈਕਸ਼ਨ ਪਾਸ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
    }
  }

  throw new Error(`No native student-facing stem renderer for ${source.packageId}/${source.questionLanguageId}/${mode}/${language}.`);
}

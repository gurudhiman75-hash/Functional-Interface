import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import type { ProbabilityQuestion } from "./types";
import { rational, rationalText } from "./rational";

const num = (source: ProbabilityQuestion, key: string, fallback = 0): number => {
  const value = source.parameters[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

const text = (source: ProbabilityQuestion, key: string, fallback = ""): string => {
  const value = source.parameters[key];
  return typeof value === "string" ? value : fallback;
};

const probabilityFraction = (source: ProbabilityQuestion): string => rationalText(rational(
  num(source, "probabilityNumerator"),
  num(source, "probabilityDenominator", 1),
));

function renderDirectProbabilityStem(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
): string | null {
  const total = num(source, "total");
  const favourable = num(source, "favourable");
  const scenario = text(source, "scenario");

  if (scenario === "DEFECTIVE_BULBS") {
    return language === "hi"
      ? `एक बैच में ${total} बल्ब हैं, जिनमें से ${favourable} खराब हैं। एक बल्ब यादृच्छिक रूप से चुना जाता है। उसके खराब होने की प्रायिकता क्या है?`
      : `ਇੱਕ ਬੈਚ ਵਿੱਚ ${total} ਬਲਬ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${favourable} ਖਰਾਬ ਹਨ। ਇੱਕ ਬਲਬ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ਖਰਾਬ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  if (scenario === "RED_BALLS") {
    return language === "hi"
      ? `एक बैग में ${total} गेंदें हैं, जिनमें से ${favourable} लाल हैं। एक गेंद यादृच्छिक रूप से निकाली जाती है। लाल गेंद निकलने की प्रायिकता क्या है?`
      : `ਇੱਕ ਬੈਗ ਵਿੱਚ ${total} ਗੇਂਦਾਂ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${favourable} ਲਾਲ ਹਨ। ਇੱਕ ਗੇਂਦ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢੀ ਜਾਂਦੀ ਹੈ। ਲਾਲ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  if (scenario === "MATHEMATICS_BOOKS") {
    return language === "hi"
      ? `एक शेल्फ पर ${total} किताबें हैं, जिनमें से ${favourable} गणित की किताबें हैं। एक किताब यादृच्छिक रूप से चुनी जाती है। गणित की किताब चुने जाने की प्रायिकता क्या है?`
      : `ਇੱਕ ਸ਼ੈਲਫ਼ ਉੱਤੇ ${total} ਕਿਤਾਬਾਂ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${favourable} ਗਣਿਤ ਦੀਆਂ ਕਿਤਾਬਾਂ ਹਨ। ਇੱਕ ਕਿਤਾਬ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੀ ਜਾਂਦੀ ਹੈ। ਗਣਿਤ ਦੀ ਕਿਤਾਬ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  return null;
}

function renderReverseFavourableStem(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
): string | null {
  const total = num(source, "total");
  const probability = probabilityFraction(source);
  const context = text(source, "context").toLowerCase();

  if (/defective bulbs?/u.test(context)) {
    return language === "hi"
      ? `एक बैच में ${total} बल्ब हैं। एक बल्ब यादृच्छिक रूप से चुनने पर उसके खराब होने की प्रायिकता ${probability} है। कितने बल्ब खराब हैं?`
      : `ਇੱਕ ਬੈਚ ਵਿੱਚ ${total} ਬਲਬ ਹਨ। ਇੱਕ ਬਲਬ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਨ ਉੱਤੇ ਉਸ ਦੇ ਖਰਾਬ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ। ਕਿੰਨੇ ਬਲਬ ਖਰਾਬ ਹਨ?`;
  }
  if (/qualified candidates?/u.test(context)) {
    return language === "hi"
      ? `${total} अभ्यर्थियों में से एक अभ्यर्थी यादृच्छिक रूप से चुना जाता है। उसके योग्य होने की प्रायिकता ${probability} है। कितने अभ्यर्थी योग्य हैं?`
      : `${total} ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਇੱਕ ਉਮੀਦਵਾਰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ਯੋਗ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ। ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਯੋਗ ਹਨ?`;
  }
  if (/female employees?/u.test(context)) {
    return language === "hi"
      ? `एक कंपनी में ${total} कर्मचारी हैं। एक कर्मचारी यादृच्छिक रूप से चुनने पर उसके महिला होने की प्रायिकता ${probability} है। कंपनी में महिला कर्मचारियों की संख्या कितनी है?`
      : `ਇੱਕ ਕੰਪਨੀ ਵਿੱਚ ${total} ਕਰਮਚਾਰੀ ਹਨ। ਇੱਕ ਕਰਮਚਾਰੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਨ ਉੱਤੇ ਉਸ ਦੇ ਮਹਿਲਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ। ਕੰਪਨੀ ਵਿੱਚ ਮਹਿਲਾ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`;
  }
  return null;
}

function renderReverseTotalStem(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
): string | null {
  const favourable = num(source, "favourable");
  const probability = probabilityFraction(source);
  const context = text(source, "context").toLowerCase();

  if (/red balls?/u.test(context)) {
    return language === "hi"
      ? `एक बैग में ${favourable} लाल गेंदें हैं। यदि यादृच्छिक रूप से निकाली गई गेंद के लाल होने की प्रायिकता ${probability} है, तो बैग में कुल कितनी गेंदें हैं?`
      : `ਇੱਕ ਬੈਗ ਵਿੱਚ ${favourable} ਲਾਲ ਗੇਂਦਾਂ ਹਨ। ਜੇ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢੀ ਗਈ ਗੇਂਦ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ, ਤਾਂ ਬੈਗ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ਗੇਂਦਾਂ ਹਨ?`;
  }
  if (/approved loan applications?/u.test(context)) {
    return language === "hi"
      ? `एक बैंक ने ${favourable} ऋण आवेदन मंजूर किए। यदि यादृच्छिक रूप से चुने गए आवेदन के मंजूर होने की प्रायिकता ${probability} है, तो बैंक को कुल कितने ऋण आवेदन मिले थे?`
      : `ਇੱਕ ਬੈਂਕ ਨੇ ${favourable} ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ ਮਨਜ਼ੂਰ ਕੀਤੀਆਂ। ਜੇ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੀ ਅਰਜ਼ੀ ਦੇ ਮਨਜ਼ੂਰ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ, ਤਾਂ ਬੈਂਕ ਨੂੰ ਕੁੱਲ ਕਿੰਨੀਆਂ ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ ਮਿਲੀਆਂ ਸਨ?`;
  }
  if (/successful candidates?/u.test(context)) {
    return language === "hi"
      ? `${favourable} अभ्यर्थी एक परीक्षा में उत्तीर्ण हुए। यदि यादृच्छिक रूप से चुने गए अभ्यर्थी के उत्तीर्ण होने की प्रायिकता ${probability} है, तो परीक्षा में कुल कितने अभ्यर्थी शामिल हुए थे?`
      : `${favourable} ਉਮੀਦਵਾਰ ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਪਾਸ ਹੋਏ। ਜੇ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${probability} ਹੈ, ਤਾਂ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਸ਼ਾਮਲ ਹੋਏ ਸਨ?`;
  }
  return null;
}

export function renderNativeClassicalContextStem(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  current: string,
): string {
  let rendered: string | null = null;
  if (source.solveMode === "findDirectProbability") rendered = renderDirectProbabilityStem(source, language);
  else if (["findFavourableOutcomeCount", "findMissingEventCountFromProbability"].includes(source.solveMode)) rendered = renderReverseFavourableStem(source, language);
  else if (source.solveMode === "findTotalOutcomeCount") rendered = renderReverseTotalStem(source, language);
  return rendered ?? current;
}

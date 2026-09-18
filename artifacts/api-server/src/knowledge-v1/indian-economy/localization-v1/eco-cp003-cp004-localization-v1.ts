import { ECO_CP003_REVIEW_V2 } from "../national-income-aggregates/eco-cp003-review-generator-v2";
import { ECO_CP004_REVIEW_V2 } from "../national-income-measurement-india/eco-cp004-review-generator-v2";
import {
  ECO_LOCALIZATION_V1,
  type EcoLocaleV1,
  type EcoLocalizedQuestionV1,
} from "./eco-localization-types-v1";

type NativeLocale = Exclude<EcoLocaleV1, "en">;
type EnglishQuestion = (typeof ECO_CP003_REVIEW_V2)[number] | (typeof ECO_CP004_REVIEW_V2)[number];
type LocalePair = { hi: string; pa: string };

const lp = (hi: string, pa: string): LocalePair => ({ hi, pa });
const pick = (value: LocalePair, locale: NativeLocale) => value[locale];

function localizedBase(
  question: EnglishQuestion,
  locale: EcoLocaleV1,
  stem: string,
  options: string[],
  explanation: string,
): EcoLocalizedQuestionV1 {
  return {
    ...question,
    questionId: locale === "en" ? question.questionId : `${question.questionId}-${locale.toUpperCase()}`,
    stem,
    options,
    canonicalAnswer: options[question.correctIndex],
    explanation,
    locale,
    localizationV1: {
      version: ECO_LOCALIZATION_V1,
      englishQuestionId: question.questionId,
      semanticInvariant: true,
      cpInvariant: true,
      qlInvariant: true,
      difficultyInvariant: true,
      sourceInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
      reviewOnly: true,
    },
  };
}

const CP3_MEANING: Readonly<Record<string, LocalePair>> = Object.freeze({
  "value of final goods and services produced within the domestic territory during a period": lp(
    "एक अवधि में घरेलू सीमा के भीतर उत्पादित अंतिम वस्तुओं और सेवाओं का मूल्य",
    "ਇੱਕ ਅਵਧੀ ਦੌਰਾਨ ਘਰੇਲੂ ਸੀਮਾ ਅੰਦਰ ਉਤਪਾਦਿਤ ਅੰਤਿਮ ਵਸਤੂਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਦਾ ਮੁੱਲ",
  ),
  "GDP adjusted by net factor income from abroad": lp(
    "विदेश से शुद्ध कारक आय को जोड़कर समायोजित GDP",
    "ਵਿਦੇਸ਼ ਤੋਂ ਸ਼ੁੱਧ ਕਾਰਕ ਆਮਦਨ ਜੋੜ ਕੇ ਸਮਾਇਤ GDP",
  ),
  "GDP after deducting depreciation": lp(
    "मूल्यह्रास घटाने के बाद GDP",
    "ਮੁੱਲ ਘਟਾਅ ਘਟਾਉਣ ਤੋਂ ਬਾਅਦ GDP",
  ),
  "GNP after deducting depreciation": lp(
    "मूल्यह्रास घटाने के बाद GNP",
    "ਮੁੱਲ ਘਟਾਅ ਘਟਾਉਣ ਤੋਂ ਬਾਅਦ GNP",
  ),
});

const CP3_OPTION: Readonly<Record<string, LocalePair>> = Object.freeze({
  "Depreciation": lp("मूल्यह्रास", "ਮੁੱਲ ਘਟਾਅ"),
  "Population": lp("जनसंख्या", "ਆਬਾਦੀ"),
  "Subsidies": lp("सब्सिडी", "ਸਬਸਿਡੀਆਂ"),
  "Net factor income from abroad": lp("विदेश से शुद्ध कारक आय", "ਵਿਦੇਸ਼ ਤੋਂ ਸ਼ੁੱਧ ਕਾਰਕ ਆਮਦਨ"),
  "Depreciation only": lp("केवल मूल्यह्रास", "ਸਿਰਫ਼ ਮੁੱਲ ਘਟਾਅ"),
  "Subsidies only": lp("केवल सब्सिडी", "ਸਿਰਫ਼ ਸਬਸਿਡੀਆਂ"),
  "Nominal GDP": lp("नाममात्र GDP", "ਨਾਮਮਾਤਰ GDP"),
  "Real GDP": lp("वास्तविक GDP", "ਵਾਸਤਵਿਕ GDP"),
  "I only": lp("केवल I", "ਸਿਰਫ਼ I"),
  "II only": lp("केवल II", "ਸਿਰਫ਼ II"),
  "Both I and II": lp("I और II दोनों", "I ਅਤੇ II ਦੋਵੇਂ"),
  "Neither I nor II": lp("न तो I, न II", "ਨਾ I, ਨਾ II"),

  "Gross measures include depreciation; net measures exclude depreciation.": lp(
    "सकल मापों में मूल्यह्रास शामिल होता है; शुद्ध मापों में मूल्यह्रास घटा दिया जाता है।",
    "ਕੁੱਲ ਮਾਪਾਂ ਵਿੱਚ ਮੁੱਲ ਘਟਾਅ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ; ਸ਼ੁੱਧ ਮਾਪਾਂ ਵਿੱਚ ਮੁੱਲ ਘਟਾਅ ਘਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।",
  ),
  "Net measures include depreciation twice.": lp(
    "शुद्ध मापों में मूल्यह्रास दो बार शामिल होता है।",
    "ਸ਼ੁੱਧ ਮਾਪਾਂ ਵਿੱਚ ਮੁੱਲ ਘਟਾਅ ਦੋ ਵਾਰ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ।",
  ),
  "Gross and net differ only because of population.": lp(
    "सकल और शुद्ध माप केवल जनसंख्या के कारण अलग होते हैं।",
    "ਕੁੱਲ ਅਤੇ ਸ਼ੁੱਧ ਮਾਪ ਸਿਰਫ਼ ਆਬਾਦੀ ਕਰਕੇ ਵੱਖ ਹੁੰਦੇ ਹਨ।",
  ),
  "Gross and net mean the same thing.": lp(
    "सकल और शुद्ध का अर्थ एक ही है।",
    "ਕੁੱਲ ਅਤੇ ਸ਼ੁੱਧ ਦਾ ਅਰਥ ਇੱਕੋ ਹੈ।",
  ),
  "Domestic refers to production within domestic territory; national adjusts for net factor income from abroad.": lp(
    "घरेलू माप घरेलू सीमा के भीतर उत्पादन को दर्शाता है; राष्ट्रीय माप में विदेश से शुद्ध कारक आय का समायोजन होता है।",
    "ਘਰੇਲੂ ਮਾਪ ਘਰੇਲੂ ਸੀਮਾ ਅੰਦਰ ਉਤਪਾਦਨ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ; ਰਾਸ਼ਟਰੀ ਮਾਪ ਵਿੱਚ ਵਿਦੇਸ਼ ਤੋਂ ਸ਼ੁੱਧ ਕਾਰਕ ਆਮਦਨ ਦਾ ਸਮਾਯੋਜਨ ਹੁੰਦਾ ਹੈ।",
  ),
  "Domestic and national differ only because of depreciation.": lp(
    "घरेलू और राष्ट्रीय माप केवल मूल्यह्रास के कारण अलग होते हैं।",
    "ਘਰੇਲੂ ਅਤੇ ਰਾਸ਼ਟਰੀ ਮਾਪ ਸਿਰਫ਼ ਮੁੱਲ ਘਟਾਅ ਕਰਕੇ ਵੱਖ ਹੁੰਦੇ ਹਨ।",
  ),
  "National always means current prices.": lp(
    "राष्ट्रीय माप का अर्थ हमेशा चालू कीमतें होता है।",
    "ਰਾਸ਼ਟਰੀ ਮਾਪ ਦਾ ਅਰਥ ਹਮੇਸ਼ਾ ਮੌਜੂਦਾ ਕੀਮਤਾਂ ਹੁੰਦਾ ਹੈ।",
  ),
  "Domestic always means constant prices.": lp(
    "घरेलू माप का अर्थ हमेशा स्थिर कीमतें होता है।",
    "ਘਰੇਲੂ ਮਾਪ ਦਾ ਅਰਥ ਹਮੇਸ਼ਾ ਸਥਿਰ ਕੀਮਤਾਂ ਹੁੰਦਾ ਹੈ।",
  ),
  "Nominal GDP uses current prices; real GDP uses constant prices.": lp(
    "नाममात्र GDP चालू कीमतों का उपयोग करता है; वास्तविक GDP स्थिर कीमतों का।",
    "ਨਾਮਮਾਤਰ GDP ਮੌਜੂਦਾ ਕੀਮਤਾਂ ਵਰਤਦਾ ਹੈ; ਵਾਸਤਵਿਕ GDP ਸਥਿਰ ਕੀਮਤਾਂ ਵਰਤਦਾ ਹੈ।",
  ),
  "Nominal GDP excludes depreciation; real GDP includes it.": lp(
    "नाममात्र GDP में मूल्यह्रास शामिल नहीं होता; वास्तविक GDP में होता है।",
    "ਨਾਮਮਾਤਰ GDP ਵਿੱਚ ਮੁੱਲ ਘਟਾਅ ਸ਼ਾਮਲ ਨਹੀਂ ਹੁੰਦਾ; ਵਾਸਤਵਿਕ GDP ਵਿੱਚ ਹੁੰਦਾ ਹੈ।",
  ),
  "Real GDP is GDP plus NFIA.": lp(
    "वास्तविक GDP, GDP में NFIA जोड़ने से मिलता है।",
    "ਵਾਸਤਵਿਕ GDP, GDP ਵਿੱਚ NFIA ਜੋੜਨ ਨਾਲ ਮਿਲਦਾ ਹੈ।",
  ),
  "Nominal and real GDP always have the same value.": lp(
    "नाममात्र और वास्तविक GDP का मूल्य हमेशा समान होता है।",
    "ਨਾਮਮਾਤਰ ਅਤੇ ਵਾਸਤਵਿਕ GDP ਦਾ ਮੁੱਲ ਹਮੇਸ਼ਾ ਇੱਕੋ ਹੁੰਦਾ ਹੈ।",
  ),
});

function cp3Formula(text: string, locale: NativeLocale): string {
  const replacements: readonly [RegExp, LocalePair][] = [
    [/Net factor income from abroad/gu, lp("विदेश से शुद्ध कारक आय", "ਵਿਦੇਸ਼ ਤੋਂ ਸ਼ੁੱਧ ਕਾਰਕ ਆਮਦਨ")],
    [/net factor income from abroad/gu, lp("विदेश से शुद्ध कारक आय", "ਵਿਦੇਸ਼ ਤੋਂ ਸ਼ੁੱਧ ਕਾਰਕ ਆਮਦਨ")],
    [/Net indirect taxes/gu, lp("शुद्ध अप्रत्यक्ष कर", "ਸ਼ੁੱਧ ਅਪਰੋਖ ਕਰ")],
    [/net indirect taxes/gu, lp("शुद्ध अप्रत्यक्ष कर", "ਸ਼ੁੱਧ ਅਪਰੋਖ ਕਰ")],
    [/Indirect taxes/gu, lp("अप्रत्यक्ष कर", "ਅਪਰੋਖ ਕਰ")],
    [/indirect taxes/gu, lp("अप्रत्यक्ष कर", "ਅਪਰੋਖ ਕਰ")],
    [/Factor cost/gu, lp("कारक लागत", "ਕਾਰਕ ਲਾਗਤ")],
    [/factor cost/gu, lp("कारक लागत", "ਕਾਰਕ ਲਾਗਤ")],
    [/Market price/gu, lp("बाज़ार मूल्य", "ਬਾਜ਼ਾਰ ਮੁੱਲ")],
    [/market price/gu, lp("बाज़ार मूल्य", "ਬਾਜ਼ਾਰ ਮੁੱਲ")],
    [/Depreciation/gu, lp("मूल्यह्रास", "ਮੁੱਲ ਘਟਾਅ")],
    [/depreciation/gu, lp("मूल्यह्रास", "ਮੁੱਲ ਘਟਾਅ")],
    [/Population/gu, lp("जनसंख्या", "ਆਬਾਦੀ")],
    [/population/gu, lp("जनसंख्या", "ਆਬਾਦੀ")],
    [/Subsidies/gu, lp("सब्सिडी", "ਸਬਸਿਡੀਆਂ")],
    [/subsidies/gu, lp("सब्सिडी", "ਸਬਸਿਡੀਆਂ")],
    [/Taxes/gu, lp("कर", "ਕਰ")],
    [/taxes/gu, lp("कर", "ਕਰ")],
    [/Nominal GDP/gu, lp("नाममात्र GDP", "ਨਾਮਮਾਤਰ GDP")],
    [/Real GDP/gu, lp("वास्तविक GDP", "ਵਾਸਤਵਿਕ GDP")],
    [/Per-capita income/gu, lp("प्रति व्यक्ति आय", "ਪ੍ਰਤੀ ਵਿਅਕਤੀ ਆਮਦਨ")],
    [/per-capita income/gu, lp("प्रति व्यक्ति आय", "ਪ੍ਰਤੀ ਵਿਅਕਤੀ ਆਮਦਨ")],
    [/National income/gu, lp("राष्ट्रीय आय", "ਰਾਸ਼ਟਰੀ ਆਮਦਨ")],
    [/national income/gu, lp("राष्ट्रीय आय", "ਰਾਸ਼ਟਰੀ ਆਮਦਨ")],
    [/Value added/gu, lp("मूल्य वर्धित", "ਮੁੱਲ ਵਾਧਾ")],
    [/value added/gu, lp("मूल्य वर्धित", "ਮੁੱਲ ਵਾਧਾ")],
    [/Intermediate consumption/gu, lp("मध्यवर्ती उपभोग", "ਮੱਧਵਰਤੀ ਖਪਤ")],
    [/intermediate consumption/gu, lp("मध्यवर्ती उपभोग", "ਮੱਧਵਰਤੀ ਖਪਤ")],
    [/Output/gu, lp("उत्पादन मूल्य", "ਉਤਪਾਦਨ ਮੁੱਲ")],
    [/output/gu, lp("उत्पादन मूल्य", "ਉਤਪਾਦਨ ਮੁੱਲ")],
    [/current prices/gu, lp("चालू कीमतें", "ਮੌਜੂਦਾ ਕੀਮਤਾਂ")],
    [/constant prices/gu, lp("स्थिर कीमतें", "ਸਥਿਰ ਕੀਮਤਾਂ")],
  ];
  return replacements.reduce((value, [pattern, pair]) => value.replace(pattern, pick(pair, locale)), text);
}

function cp3Option(text: string, locale: NativeLocale): string {
  if (/^-?[\d,]+$/u.test(text)) return text;
  const exact = CP3_OPTION[text];
  if (exact) return pick(exact, locale);
  if (text.includes(" — ")) {
    const [left, right] = text.split(" — ", 2);
    return `${left} — ${cp3Formula(right, locale)}`;
  }
  return cp3Formula(text, locale);
}

function cp3Statement(text: string, locale: NativeLocale): string {
  const exact: Readonly<Record<string, LocalePair>> = {
    "NDP = GDP - Depreciation.": lp("NDP = GDP - मूल्यह्रास।", "NDP = GDP - ਮੁੱਲ ਘਟਾਅ।"),
    "GNP = GDP + NFIA.": lp("GNP = GDP + NFIA।", "GNP = GDP + NFIA।"),
    "NNP = GNP - Depreciation.": lp("NNP = GNP - मूल्यह्रास।", "NNP = GNP - ਮੁੱਲ ਘਟਾਅ।"),
    "Real GDP is measured at current prices.": lp("वास्तविक GDP को चालू कीमतों पर मापा जाता है।", "ਵਾਸਤਵਿਕ GDP ਨੂੰ ਮੌਜੂਦਾ ਕੀਮਤਾਂ ਤੇ ਮਾਪਿਆ ਜਾਂਦਾ ਹੈ।"),
    "Nominal GDP uses current prices.": lp("नाममात्र GDP में चालू कीमतों का उपयोग होता है।", "ਨਾਮਮਾਤਰ GDP ਵਿੱਚ ਮੌਜੂਦਾ ਕੀਮਤਾਂ ਵਰਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।"),
    "Per-capita income equals national income divided by population.": lp("प्रति व्यक्ति आय = राष्ट्रीय आय ÷ जनसंख्या।", "ਪ੍ਰਤੀ ਵਿਅਕਤੀ ਆਮਦਨ = ਰਾਸ਼ਟਰੀ ਆਮਦਨ ÷ ਆਬਾਦੀ।"),
  };
  return exact[text] ? pick(exact[text], locale) : cp3Formula(text, locale);
}

function cp3Stem(question: (typeof ECO_CP003_REVIEW_V2)[number], locale: NativeLocale): string {
  const ql = Number(question.qlId.slice(-3));

  if (ql === 1) {
    const meaning = question.stem.match(/^Which aggregate means (.+)\?$/u)?.[1] ?? "";
    const localized = CP3_MEANING[meaning] ? pick(CP3_MEANING[meaning], locale) : cp3Formula(meaning, locale);
    return locale === "hi"
      ? `कौन-सा राष्ट्रीय आय समष्टि माप ${localized} को दर्शाता है?`
      : `ਕਿਹੜਾ ਰਾਸ਼ਟਰੀ ਆਮਦਨ ਸਮੂਹਕ ਮਾਪ ${localized} ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`;
  }

  if (ql === 2) {
    const aggregate = question.stem.match(/^Which formula is correct for (GDP|GNP|NDP|NNP)\?$/u)?.[1] ?? question.canonicalAnswer;
    return locale === "hi" ? `${aggregate} का सही सूत्र कौन-सा है?` : `${aggregate} ਦਾ ਸਹੀ ਸੂਤਰ ਕਿਹੜਾ ਹੈ?`;
  }

  if (ql === 3) {
    let match = question.stem.match(/^To change (GDP|GNP) into (NDP|NNP), what is deducted\?$/u);
    if (match) return locale === "hi" ? `${match[1]} को ${match[2]} में बदलने के लिए क्या घटाया जाता है?` : `${match[1]} ਨੂੰ ${match[2]} ਵਿੱਚ ਬਦਲਣ ਲਈ ਕੀ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ?`;
    match = question.stem.match(/^Which aggregate is obtained after deducting depreciation from (GDP|GNP)\?$/u);
    if (match) return locale === "hi" ? `${match[1]} से मूल्यह्रास घटाने पर कौन-सा समष्टि माप मिलता है?` : `${match[1]} ਵਿੱਚੋਂ ਮੁੱਲ ਘਟਾਅ ਘਟਾਉਣ ਤੇ ਕਿਹੜਾ ਸਮੂਹਕ ਮਾਪ ਮਿਲਦਾ ਹੈ?`;
  }

  if (ql === 4) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "Which aggregate is obtained by adding net factor income from abroad to GDP?": lp(
        "GDP में विदेश से शुद्ध कारक आय जोड़ने पर कौन-सा समष्टि माप मिलता है?",
        "GDP ਵਿੱਚ ਵਿਦੇਸ਼ ਤੋਂ ਸ਼ੁੱਧ ਕਾਰਕ ਆਮਦਨ ਜੋੜਨ ਤੇ ਕਿਹੜਾ ਸਮੂਹਕ ਮਾਪ ਮਿਲਦਾ ਹੈ?",
      ),
      "Which item converts GDP into GNP?": lp("GDP को GNP में बदलने के लिए कौन-सा समायोजन किया जाता है?", "GDP ਨੂੰ GNP ਵਿੱਚ ਬਦਲਣ ਲਈ ਕਿਹੜਾ ਸਮਾਯੋਜਨ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?"),
      "Adding NFIA to GDP gives which national aggregate?": lp("GDP में NFIA जोड़ने पर कौन-सा राष्ट्रीय समष्टि माप मिलता है?", "GDP ਵਿੱਚ NFIA ਜੋੜਨ ਤੇ ਕਿਹੜਾ ਰਾਸ਼ਟਰੀ ਸਮੂਹਕ ਮਾਪ ਮਿਲਦਾ ਹੈ?"),
      "Which adjustment makes GNP differ from GDP?": lp("कौन-सा समायोजन GNP को GDP से अलग बनाता है?", "ਕਿਹੜਾ ਸਮਾਯੋਜਨ GNP ਨੂੰ GDP ਤੋਂ ਵੱਖ ਕਰਦਾ ਹੈ?"),
    };
    if (exact[question.stem]) return pick(exact[question.stem], locale);
  }

  if (ql === 5) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "What is GDP measured at current prices called?": lp("चालू कीमतों पर मापी गई GDP को क्या कहा जाता है?", "ਮੌਜੂਦਾ ਕੀਮਤਾਂ ਤੇ ਮਾਪੀ GDP ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"),
      "What is GDP measured at constant prices called?": lp("स्थिर कीमतों पर मापी गई GDP को क्या कहा जाता है?", "ਸਥਿਰ ਕੀਮਤਾਂ ਤੇ ਮਾਪੀ GDP ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"),
      "Which GDP measure uses current-year prices?": lp("कौन-सा GDP माप चालू वर्ष की कीमतों का उपयोग करता है?", "ਕਿਹੜਾ GDP ਮਾਪ ਮੌਜੂਦਾ ਸਾਲ ਦੀਆਂ ਕੀਮਤਾਂ ਵਰਤਦਾ ਹੈ?"),
      "Which GDP measure uses constant prices?": lp("कौन-सा GDP माप स्थिर कीमतों का उपयोग करता है?", "ਕਿਹੜਾ GDP ਮਾਪ ਸਥਿਰ ਕੀਮਤਾਂ ਵਰਤਦਾ ਹੈ?"),
    };
    if (exact[question.stem]) return pick(exact[question.stem], locale);
  }

  if (ql === 6) {
    const match = question.stem.match(/^If national income is ([\d,]+) and population is ([\d,]+), what is per-capita income\?$/u);
    if (match) return locale === "hi"
      ? `यदि राष्ट्रीय आय ${match[1]} और जनसंख्या ${match[2]} है, तो प्रति व्यक्ति आय कितनी होगी?`
      : `ਜੇ ਰਾਸ਼ਟਰੀ ਆਮਦਨ ${match[1]} ਅਤੇ ਆਬਾਦੀ ${match[2]} ਹੈ, ਤਾਂ ਪ੍ਰਤੀ ਵਿਅਕਤੀ ਆਮਦਨ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
  }

  if (ql === 7) {
    const match = question.stem.match(/^If output is ([\d,]+) and intermediate inputs (?:are|cost) ([\d,]+), what is value added\?$/u);
    if (match) return locale === "hi"
      ? `यदि उत्पादन मूल्य ${match[1]} और मध्यवर्ती इनपुट ${match[2]} हैं, तो मूल्य वर्धित कितना है?`
      : `ਜੇ ਉਤਪਾਦਨ ਮੁੱਲ ${match[1]} ਅਤੇ ਮੱਧਵਰਤੀ ਇਨਪੁੱਟ ${match[2]} ਹਨ, ਤਾਂ ਮੁੱਲ ਵਾਧਾ ਕਿੰਨਾ ਹੈ?`;
  }

  if (ql === 8) {
    let match = question.stem.match(/^If GDP is ([\d,]+) and depreciation is ([\d,]+), what is NDP\?$/u);
    if (match) return locale === "hi" ? `यदि GDP ${match[1]} और मूल्यह्रास ${match[2]} है, तो NDP कितना है?` : `ਜੇ GDP ${match[1]} ਅਤੇ ਮੁੱਲ ਘਟਾਅ ${match[2]} ਹੈ, ਤਾਂ NDP ਕਿੰਨਾ ਹੈ?`;
    match = question.stem.match(/^If GDP is ([\d,]+) and NFIA is ([\d,]+), what is GNP\?$/u);
    if (match) return locale === "hi" ? `यदि GDP ${match[1]} और NFIA ${match[2]} है, तो GNP कितना है?` : `ਜੇ GDP ${match[1]} ਅਤੇ NFIA ${match[2]} ਹੈ, ਤਾਂ GNP ਕਿੰਨਾ ਹੈ?`;
    match = question.stem.match(/^If GNP is ([\d,]+) and depreciation is ([\d,]+), what is NNP\?$/u);
    if (match) return locale === "hi" ? `यदि GNP ${match[1]} और मूल्यह्रास ${match[2]} है, तो NNP कितना है?` : `ਜੇ GNP ${match[1]} ਅਤੇ ਮੁੱਲ ਘਟਾਅ ${match[2]} ਹੈ, ਤਾਂ NNP ਕਿੰਨਾ ਹੈ?`;
    match = question.stem.match(/^If national income is ([\d,]+) and population is ([\d,]+), what is per-capita income\?$/u);
    if (match) return locale === "hi" ? `यदि राष्ट्रीय आय ${match[1]} और जनसंख्या ${match[2]} है, तो प्रति व्यक्ति आय कितनी है?` : `ਜੇ ਰਾਸ਼ਟਰੀ ਆਮਦਨ ${match[1]} ਅਤੇ ਆਬਾਦੀ ${match[2]} ਹੈ, ਤਾਂ ਪ੍ਰਤੀ ਵਿਅਕਤੀ ਆਮਦਨ ਕਿੰਨੀ ਹੈ?`;
    match = question.stem.match(/^If output is worth ([\d,]+) and intermediate inputs cost ([\d,]+), what is value added\?$/u);
    if (match) return locale === "hi" ? `यदि उत्पादन का मूल्य ${match[1]} और मध्यवर्ती इनपुट की लागत ${match[2]} है, तो मूल्य वर्धित कितना है?` : `ਜੇ ਉਤਪਾਦਨ ਦਾ ਮੁੱਲ ${match[1]} ਅਤੇ ਮੱਧਵਰਤੀ ਇਨਪੁੱਟ ਦੀ ਲਾਗਤ ${match[2]} ਹੈ, ਤਾਂ ਮੁੱਲ ਵਾਧਾ ਕਿੰਨਾ ਹੈ?`;
  }

  if (ql === 9) return locale === "hi" ? "कौन-सा युग्म सही सुमेलित है?" : "ਕਿਹੜਾ ਜੋੜ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";

  if (ql === 10) {
    const lines = question.stem.split("\n");
    const first = lines[1]?.replace(/^I\.\s*/u, "") ?? "";
    const second = lines[2]?.replace(/^II\.\s*/u, "") ?? "";
    return locale === "hi"
      ? `निम्न कथनों पर विचार कीजिए:\nI. ${cp3Statement(first, locale)}\nII. ${cp3Statement(second, locale)}\nसही विकल्प चुनिए।`
      : `ਹੇਠਲੇ ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:\nI. ${cp3Statement(first, locale)}\nII. ${cp3Statement(second, locale)}\nਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।`;
  }

  if (ql === 11) return locale === "hi" ? "निम्न में से कौन-सा कथन सही है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?";

  if (ql === 12) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "In the traditional exam relationship, how is market price obtained from factor cost?": lp(
        "पारंपरिक परीक्षा-संबंध में कारक लागत से बाज़ार मूल्य कैसे प्राप्त किया जाता है?",
        "ਰਵਾਇਤੀ ਪਰੀਖਿਆ-ਸੰਬੰਧ ਵਿੱਚ ਕਾਰਕ ਲਾਗਤ ਤੋਂ ਬਾਜ਼ਾਰ ਮੁੱਲ ਕਿਵੇਂ ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ?",
      ),
      "How are net indirect taxes calculated?": lp("शुद्ध अप्रत्यक्ष कर कैसे निकाले जाते हैं?", "ਸ਼ੁੱਧ ਅਪਰੋਖ ਕਰ ਕਿਵੇਂ ਕੱਢੇ ਜਾਂਦੇ ਹਨ?"),
      "If factor cost is 400 and net indirect taxes are 30, what is market price?": lp(
        "यदि कारक लागत 400 और शुद्ध अप्रत्यक्ष कर 30 हैं, तो बाज़ार मूल्य कितना है?",
        "ਜੇ ਕਾਰਕ ਲਾਗਤ 400 ਅਤੇ ਸ਼ੁੱਧ ਅਪਰੋਖ ਕਰ 30 ਹਨ, ਤਾਂ ਬਾਜ਼ਾਰ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?",
      ),
    };
    if (exact[question.stem]) return pick(exact[question.stem], locale);
  }

  throw new Error(`${question.questionId}: unsupported CP003 stem for ${locale}: ${question.stem}`);
}

function cp3Explanation(question: (typeof ECO_CP003_REVIEW_V2)[number], locale: NativeLocale): string {
  const ql = Number(question.qlId.slice(-3));
  if (ql === 1) {
    const meaning = question.stem.match(/^Which aggregate means (.+)\?$/u)?.[1] ?? "";
    const localized = CP3_MEANING[meaning] ? pick(CP3_MEANING[meaning], locale) : cp3Formula(meaning, locale);
    return locale === "hi" ? `${question.canonicalAnswer} का अर्थ ${localized} है।` : `${question.canonicalAnswer} ਦਾ ਅਰਥ ${localized} ਹੈ।`;
  }
  if (ql === 2) return locale === "hi" ? `सही संबंध है: ${cp3Formula(question.canonicalAnswer, locale)}।` : `ਸਹੀ ਸੰਬੰਧ ਹੈ: ${cp3Formula(question.canonicalAnswer, locale)}।`;
  if (ql === 3) return locale === "hi"
    ? `शुद्ध माप प्राप्त करने के लिए संबंधित सकल माप से मूल्यह्रास घटाया जाता है। इसलिए ${cp3Formula(question.explanation.replace(/\.$/u, ""), locale)}।`
    : `ਸ਼ੁੱਧ ਮਾਪ ਲਈ ਸੰਬੰਧਿਤ ਕੁੱਲ ਮਾਪ ਵਿੱਚੋਂ ਮੁੱਲ ਘਟਾਅ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ${cp3Formula(question.explanation.replace(/\.$/u, ""), locale)}।`;
  if (ql === 4) return locale === "hi"
    ? "NFIA घरेलू समष्टि माप को संबंधित राष्ट्रीय समष्टि माप में समायोजित करता है। इसलिए GNP = GDP + NFIA।"
    : "NFIA ਘਰੇਲੂ ਸਮੂਹਕ ਮਾਪ ਨੂੰ ਸੰਬੰਧਿਤ ਰਾਸ਼ਟਰੀ ਸਮੂਹਕ ਮਾਪ ਵਿੱਚ ਸਮਾਇਤ ਕਰਦਾ ਹੈ। ਇਸ ਲਈ GNP = GDP + NFIA।";
  if (ql === 5) return question.canonicalAnswer === "Nominal GDP"
    ? (locale === "hi" ? "नाममात्र GDP में उत्पादन का मूल्य चालू कीमतों पर मापा जाता है।" : "ਨਾਮਮਾਤਰ GDP ਵਿੱਚ ਉਤਪਾਦਨ ਦਾ ਮੁੱਲ ਮੌਜੂਦਾ ਕੀਮਤਾਂ ਤੇ ਮਾਪਿਆ ਜਾਂਦਾ ਹੈ।")
    : (locale === "hi" ? "वास्तविक GDP में उत्पादन का मूल्य स्थिर कीमतों पर मापा जाता है, जिससे कीमतों के बदलाव का प्रभाव कम होता है।" : "ਵਾਸਤਵਿਕ GDP ਵਿੱਚ ਉਤਪਾਦਨ ਦਾ ਮੁੱਲ ਸਥਿਰ ਕੀਮਤਾਂ ਤੇ ਮਾਪਿਆ ਜਾਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਕੀਮਤਾਂ ਦੇ ਬਦਲਾਅ ਦਾ ਪ੍ਰਭਾਵ ਘਟਦਾ ਹੈ।");
  if (ql === 6) return locale === "hi" ? `प्रति व्यक्ति आय = राष्ट्रीय आय ÷ जनसंख्या। ${question.explanation.replace("/", "÷")}` : `ਪ੍ਰਤੀ ਵਿਅਕਤੀ ਆਮਦਨ = ਰਾਸ਼ਟਰੀ ਆਮਦਨ ÷ ਆਬਾਦੀ। ${question.explanation.replace("/", "÷")}`;
  if (ql === 7) return locale === "hi" ? `मूल्य वर्धित = उत्पादन मूल्य - मध्यवर्ती इनपुट। ${question.explanation}` : `ਮੁੱਲ ਵਾਧਾ = ਉਤਪਾਦਨ ਮੁੱਲ - ਮੱਧਵਰਤੀ ਇਨਪੁੱਟ। ${question.explanation}`;
  if (ql === 8) return cp3Formula(question.explanation, locale).replace(/\.$/u, "।");
  if (ql === 9) return locale === "hi" ? `${cp3Option(question.canonicalAnswer, locale)} सही सुमेलित युग्म है।` : `${cp3Option(question.canonicalAnswer, locale)} ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਜੋੜ ਹੈ।`;
  if (ql === 10) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "NDP = GDP - Depreciation. GNP = GDP + NFIA.": lp("NDP = GDP - मूल्यह्रास और GNP = GDP + NFIA।", "NDP = GDP - ਮੁੱਲ ਘਟਾਅ ਅਤੇ GNP = GDP + NFIA।"),
      "NNP = GNP - depreciation. Real GDP uses constant prices.": lp("NNP = GNP - मूल्यह्रास। वास्तविक GDP स्थिर कीमतों का उपयोग करता है।", "NNP = GNP - ਮੁੱਲ ਘਟਾਅ। ਵਾਸਤਵਿਕ GDP ਸਥਿਰ ਕੀਮਤਾਂ ਵਰਤਦਾ ਹੈ।"),
      "Nominal GDP uses current prices. Per-capita income equals national income divided by population.": lp("नाममात्र GDP चालू कीमतों का उपयोग करता है। प्रति व्यक्ति आय = राष्ट्रीय आय ÷ जनसंख्या।", "ਨਾਮਮਾਤਰ GDP ਮੌਜੂਦਾ ਕੀਮਤਾਂ ਵਰਤਦਾ ਹੈ। ਪ੍ਰਤੀ ਵਿਅਕਤੀ ਆਮਦਨ = ਰਾਸ਼ਟਰੀ ਆਮਦਨ ÷ ਆਬਾਦੀ।"),
    };
    return exact[question.explanation] ? pick(exact[question.explanation], locale) : cp3Formula(question.explanation, locale);
  }
  if (ql === 11) return locale === "hi"
    ? `${cp3Option(question.canonicalAnswer, locale)} सही है। यही विकल्प संबंधित राष्ट्रीय आय अवधारणाओं के बीच सही अंतर बताता है।`
    : `${cp3Option(question.canonicalAnswer, locale)} ਸਹੀ ਹੈ। ਇਹੀ ਵਿਕਲਪ ਸੰਬੰਧਿਤ ਰਾਸ਼ਟਰੀ ਆਮਦਨ ਧਾਰਣਾਵਾਂ ਵਿਚਲਾ ਸਹੀ ਅੰਤਰ ਦੱਸਦਾ ਹੈ।`;
  if (question.canonicalAnswer === "430") return locale === "hi" ? "बाज़ार मूल्य = कारक लागत + शुद्ध अप्रत्यक्ष कर। इसलिए 400 + 30 = 430।" : "ਬਾਜ਼ਾਰ ਮੁੱਲ = ਕਾਰਕ ਲਾਗਤ + ਸ਼ੁੱਧ ਅਪਰੋਖ ਕਰ। ਇਸ ਲਈ 400 + 30 = 430।";
  if (question.canonicalAnswer.includes("Indirect taxes")) return locale === "hi" ? "शुद्ध अप्रत्यक्ष कर = अप्रत्यक्ष कर - सब्सिडी।" : "ਸ਼ੁੱਧ ਅਪਰੋਖ ਕਰ = ਅਪਰੋਖ ਕਰ - ਸਬਸਿਡੀਆਂ।";
  return locale === "hi" ? "पारंपरिक परीक्षा-संबंध में बाज़ार मूल्य = कारक लागत + शुद्ध अप्रत्यक्ष कर।" : "ਰਵਾਇਤੀ ਪਰੀਖਿਆ-ਸੰਬੰਧ ਵਿੱਚ ਬਾਜ਼ਾਰ ਮੁੱਲ = ਕਾਰਕ ਲਾਗਤ + ਸ਼ੁੱਧ ਅਪਰੋਖ ਕਰ।";
}

function localizeCp003(question: (typeof ECO_CP003_REVIEW_V2)[number], locale: EcoLocaleV1): EcoLocalizedQuestionV1 {
  if (locale === "en") return localizedBase(question, locale, question.stem, [...question.options], question.explanation);
  const options = question.options.map((option) => cp3Option(option, locale));
  return localizedBase(question, locale, cp3Stem(question, locale), options, cp3Explanation(question, locale));
}

const CP4_DESC: Readonly<Record<string, LocalePair>> = Object.freeze({
  "flour bought by a bakery to make bread": lp("ब्रेड बनाने के लिए बेकरी द्वारा खरीदा गया आटा", "ਰੋਟੀ ਬਣਾਉਣ ਲਈ ਬੇਕਰੀ ਵੱਲੋਂ ਖਰੀਦਿਆ ਆਟਾ"),
  "bread bought by a household for consumption": lp("घरेलू उपभोग के लिए परिवार द्वारा खरीदी गई ब्रेड", "ਘਰੇਲੂ ਖਪਤ ਲਈ ਪਰਿਵਾਰ ਵੱਲੋਂ ਖਰੀਦੀ ਰੋਟੀ"),
  "steel bought by a car manufacturer": lp("कार निर्माता द्वारा खरीदा गया इस्पात", "ਕਾਰ ਨਿਰਮਾਤਾ ਵੱਲੋਂ ਖਰੀਦਿਆ ਸਟੀਲ"),
  "a new machine bought by a factory for production": lp("उत्पादन के लिए कारखाने द्वारा खरीदी गई नई मशीन", "ਉਤਪਾਦਨ ਲਈ ਫੈਕਟਰੀ ਵੱਲੋਂ ਖਰੀਦੀ ਨਵੀਂ ਮਸ਼ੀਨ"),
  "milk bought by a household for drinking": lp("पीने के लिए परिवार द्वारा खरीदा गया दूध", "ਪੀਣ ਲਈ ਪਰਿਵਾਰ ਵੱਲੋਂ ਖਰੀਦਿਆ ਦੁੱਧ"),
  "household spending on final goods and services": lp("अंतिम वस्तुओं और सेवाओं पर परिवार का व्यय", "ਅੰਤਿਮ ਵਸਤੂਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਉੱਤੇ ਪਰਿਵਾਰ ਦਾ ਖਰਚ"),
  "government spending on final consumption services": lp("अंतिम उपभोग सेवाओं पर सरकारी व्यय", "ਅੰਤਿਮ ਖਪਤ ਸੇਵਾਵਾਂ ਉੱਤੇ ਸਰਕਾਰੀ ਖਰਚ"),
  "purchase or creation of fixed capital for production": lp("उत्पादन के लिए स्थिर पूंजी की खरीद या निर्माण", "ਉਤਪਾਦਨ ਲਈ ਸਥਿਰ ਪੂੰਜੀ ਦੀ ਖਰੀਦ ਜਾਂ ਸਿਰਜਣਾ"),
  "exports minus imports": lp("निर्यात में से आयात घटाना", "ਨਿਰਯਾਤ ਵਿੱਚੋਂ ਆਯਾਤ ਘਟਾਉਣਾ"),
});

const CP4_OPTION: Readonly<Record<string, LocalePair>> = Object.freeze({
  "Value added method": lp("मूल्य वर्धित विधि", "ਮੁੱਲ ਵਾਧਾ ਵਿਧੀ"),
  "Income method": lp("आय विधि", "ਆਮਦਨ ਵਿਧੀ"),
  "Expenditure method": lp("व्यय विधि", "ਖਰਚ ਵਿਧੀ"),
  "Price index method": lp("मूल्य सूचकांक विधि", "ਕੀਮਤ ਸੂਚਕਾਂਕ ਵਿਧੀ"),
  "Final": lp("अंतिम", "ਅੰਤਿਮ"),
  "Intermediate": lp("मध्यवर्ती", "ਮੱਧਵਰਤੀ"),
  "Depends on its use": lp("इसके उपयोग पर निर्भर करता है", "ਇਸਦੀ ਵਰਤੋਂ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ"),
  "Cannot be classified from the information given": lp("दी गई जानकारी से वर्गीकृत नहीं किया जा सकता", "ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਵਰਗੀਕਰਨ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
  "Double counting": lp("दोहरी गणना", "ਦੋਹਰੀ ਗਿਣਤੀ"),
  "Under-counting final output": lp("अंतिम उत्पादन की कम गणना", "ਅੰਤਿਮ ਉਤਪਾਦਨ ਦੀ ਘੱਟ ਗਿਣਤੀ"),
  "Depreciation adjustment": lp("मूल्यह्रास समायोजन", "ਮੁੱਲ ਘਟਾਅ ਸਮਾਯੋਜਨ"),
  "Price-base adjustment": lp("मूल्य-आधार समायोजन", "ਕੀਮਤ-ਆਧਾਰ ਸਮਾਯੋਜਨ"),
  "Count final goods or value added": lp("अंतिम वस्तुओं या मूल्य वर्धित को गिनें", "ਅੰਤਿਮ ਵਸਤੂਆਂ ਜਾਂ ਮੁੱਲ ਵਾਧੇ ਨੂੰ ਗਿਣੋ"),
  "Add every sale at every production stage": lp("हर उत्पादन चरण की हर बिक्री को जोड़ें", "ਹਰ ਉਤਪਾਦਨ ਪੜਾਅ ਦੀ ਹਰ ਵਿਕਰੀ ਜੋੜੋ"),
  "Count only intermediate goods": lp("केवल मध्यवर्ती वस्तुओं को गिनें", "ਸਿਰਫ਼ ਮੱਧਵਰਤੀ ਵਸਤੂਆਂ ਨੂੰ ਗਿਣੋ"),
  "Add intermediate and final values in full": lp("मध्यवर्ती और अंतिम दोनों मूल्यों को पूरा जोड़ें", "ਮੱਧਵਰਤੀ ਅਤੇ ਅੰਤਿਮ ਦੋਵੇਂ ਮੁੱਲ ਪੂਰੇ ਜੋੜੋ"),
  "Count intermediate output more than once": lp("मध्यवर्ती उत्पादन को एक से अधिक बार गिनें", "ਮੱਧਵਰਤੀ ਉਤਪਾਦਨ ਨੂੰ ਇੱਕ ਤੋਂ ਵੱਧ ਵਾਰ ਗਿਣੋ"),
  "Count only the final product": lp("केवल अंतिम उत्पाद को गिनें", "ਸਿਰਫ਼ ਅੰਤਿਮ ਉਤਪਾਦ ਨੂੰ ਗਿਣੋ"),
  "Count only value added at each stage": lp("हर चरण पर केवल मूल्य वर्धित को गिनें", "ਹਰ ਪੜਾਅ ਤੇ ਸਿਰਫ਼ ਮੁੱਲ ਵਾਧੇ ਨੂੰ ਗਿਣੋ"),
  "Exclude repeated intermediate values": lp("दोहराए गए मध्यवर्ती मूल्यों को बाहर रखें", "ਦੁਹਰਾਏ ਮੱਧਵਰਤੀ ਮੁੱਲਾਂ ਨੂੰ ਬਾਹਰ ਰੱਖੋ"),
  "Private final consumption expenditure": lp("निजी अंतिम उपभोग व्यय", "ਨਿੱਜੀ ਅੰਤਿਮ ਖਪਤ ਖਰਚ"),
  "Government final consumption expenditure": lp("सरकारी अंतिम उपभोग व्यय", "ਸਰਕਾਰੀ ਅੰਤਿਮ ਖਪਤ ਖਰਚ"),
  "Capital formation / investment": lp("पूंजी निर्माण / निवेश", "ਪੂੰਜੀ ਨਿਰਮਾਣ / ਨਿਵੇਸ਼"),
  "Net exports": lp("शुद्ध निर्यात", "ਸ਼ੁੱਧ ਨਿਰਯਾਤ"),
  "Compensation of employees": lp("कर्मचारियों का पारिश्रमिक", "ਕਰਮਚਾਰੀਆਂ ਦਾ ਮੁਆਵਜ਼ਾ"),
  "Operating surplus": lp("परिचालन अधिशेष", "ਚਾਲੂ ਅਧਿਸ਼ੇਸ਼"),
  "Mixed income": lp("मिश्रित आय", "ਮਿਸ਼ਰਤ ਆਮਦਨ"),
  "Taxes less subsidies on products": lp("उत्पादों पर कर घटा सब्सिडी", "ਉਤਪਾਦਾਂ ਉੱਤੇ ਕਰ ਘਟਾ ਸਬਸਿਡੀਆਂ"),
  "A reference year for constant-price comparison": lp("स्थिर कीमतों की तुलना के लिए संदर्भ वर्ष", "ਸਥਿਰ ਕੀਮਤਾਂ ਦੀ ਤੁਲਨਾ ਲਈ ਸੰਦਰਭ ਸਾਲ"),
  "The latest Budget year": lp("नवीनतम बजट वर्ष", "ਸਭ ਤੋਂ ਨਵਾਂ ਬਜਟ ਸਾਲ"),
  "A year with the highest GDP": lp("सबसे अधिक GDP वाला वर्ष", "ਸਭ ਤੋਂ ਵੱਧ GDP ਵਾਲਾ ਸਾਲ"),
  "A year used only for tax rates": lp("केवल कर दरों के लिए उपयोग होने वाला वर्ष", "ਸਿਰਫ਼ ਕਰ ਦਰਾਂ ਲਈ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਸਾਲ"),
  "To reflect structural change and update data and methods": lp("संरचनात्मक बदलाव को दर्शाने और डेटा व विधियों को अद्यतन करने के लिए", "ਸੰਰਚਨਾਤਮਕ ਬਦਲਾਅ ਦਰਸਾਉਣ ਅਤੇ ਡਾਟਾ ਤੇ ਵਿਧੀਆਂ ਅਪਡੇਟ ਕਰਨ ਲਈ"),
  "To increase GDP automatically": lp("GDP को अपने-आप बढ़ाने के लिए", "GDP ਨੂੰ ਆਪਣੇ ਆਪ ਵਧਾਉਣ ਲਈ"),
  "To change tax rates": lp("कर दरें बदलने के लिए", "ਕਰ ਦਰਾਂ ਬਦਲਣ ਲਈ"),
  "To remove all price data": lp("सभी मूल्य डेटा हटाने के लिए", "ਸਾਰਾ ਕੀਮਤ ਡਾਟਾ ਹਟਾਉਣ ਲਈ"),
  "A common reference or base year": lp("एक समान संदर्भ या आधार वर्ष", "ਇੱਕੋ ਸੰਦਰਭ ਜਾਂ ਆਧਾਰ ਸਾਲ"),
  "A different price base every month": lp("हर महीने अलग मूल्य आधार", "ਹਰ ਮਹੀਨੇ ਵੱਖ ਕੀਮਤ ਆਧਾਰ"),
  "Only current prices": lp("केवल चालू कीमतें", "ਸਿਰਫ਼ ਮੌਜੂਦਾ ਕੀਮਤਾਂ"),
  "Only export prices": lp("केवल निर्यात कीमतें", "ਸਿਰਫ਼ ਨਿਰਯਾਤ ਕੀਮਤਾਂ"),
  "Ministry of Statistics and Programme Implementation (MoSPI)": lp("सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)", "ਅੰਕੜਾ ਅਤੇ ਕਾਰਜਕ੍ਰਮ ਲਾਗੂਕਰਨ ਮੰਤਰਾਲਾ (MoSPI)"),
  "Ministry of Finance": lp("वित्त मंत्रालय", "ਵਿੱਤ ਮੰਤਰਾਲਾ"),
  "Reserve Bank of India": lp("भारतीय रिज़र्व बैंक", "ਭਾਰਤੀ ਰਿਜ਼ਰਵ ਬੈਂਕ"),
  "NITI Aayog": lp("नीति आयोग", "ਨੀਤੀ ਆਯੋਗ"),
  "Ministry of Commerce and Industry": lp("वाणिज्य और उद्योग मंत्रालय", "ਵਪਾਰ ਅਤੇ ਉਦਯੋਗ ਮੰਤਰਾਲਾ"),
  "Ministry of Labour and Employment": lp("श्रम और रोजगार मंत्रालय", "ਕਿਰਤ ਅਤੇ ਰੋਜ਼ਗਾਰ ਮੰਤਰਾਲਾ"),
  "Ministry of Corporate Affairs": lp("कॉरपोरेट कार्य मंत्रालय", "ਕਾਰਪੋਰੇਟ ਮਾਮਲੇ ਮੰਤਰਾਲਾ"),
  "I only": lp("केवल I", "ਸਿਰਫ਼ I"),
  "II only": lp("केवल II", "ਸਿਰਫ਼ II"),
  "Both I and II": lp("I और II दोनों", "I ਅਤੇ II ਦੋਵੇਂ"),
  "Neither I nor II": lp("न तो I, न II", "ਨਾ I, ਨਾ II"),
  "Final or intermediate status depends on how the good is used.": lp("अंतिम या मध्यवर्ती वर्गीकरण वस्तु के उपयोग पर निर्भर करता है।", "ਅੰਤਿਮ ਜਾਂ ਮੱਧਵਰਤੀ ਵਰਗੀਕਰਨ ਵਸਤੂ ਦੀ ਵਰਤੋਂ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।"),
  "Every machine is an intermediate good.": lp("हर मशीन मध्यवर्ती वस्तु होती है।", "ਹਰ ਮਸ਼ੀਨ ਮੱਧਵਰਤੀ ਵਸਤੂ ਹੁੰਦੀ ਹੈ।"),
  "Every food item is a final good.": lp("हर खाद्य वस्तु अंतिम वस्तु होती है।", "ਹਰ ਖਾਦ ਵਸਤੂ ਅੰਤਿਮ ਵਸਤੂ ਹੁੰਦੀ ਹੈ।"),
  "Only services can be final output.": lp("केवल सेवाएँ ही अंतिम उत्पादन हो सकती हैं।", "ਸਿਰਫ਼ ਸੇਵਾਵਾਂ ਹੀ ਅੰਤਿਮ ਉਤਪਾਦਨ ਹੋ ਸਕਦੀਆਂ ਹਨ।"),
  "Income method counts incomes generated; expenditure method counts final spending.": lp("आय विधि उत्पन्न आय को गिनती है; व्यय विधि अंतिम खर्च को।", "ਆਮਦਨ ਵਿਧੀ ਬਣੀ ਆਮਦਨ ਨੂੰ ਗਿਣਦੀ ਹੈ; ਖਰਚ ਵਿਧੀ ਅੰਤਿਮ ਖਰਚ ਨੂੰ।"),
  "Both methods count only imports.": lp("दोनों विधियाँ केवल आयात को गिनती हैं।", "ਦੋਵੇਂ ਵਿਧੀਆਂ ਸਿਰਫ਼ ਆਯਾਤ ਨੂੰ ਗਿਣਦੀਆਂ ਹਨ।"),
  "Income method counts only taxes; expenditure method counts only wages.": lp("आय विधि केवल कर और व्यय विधि केवल मजदूरी को गिनती है।", "ਆਮਦਨ ਵਿਧੀ ਸਿਰਫ਼ ਕਰ ਅਤੇ ਖਰਚ ਵਿਧੀ ਸਿਰਫ਼ ਮਜ਼ਦੂਰੀ ਨੂੰ ਗਿਣਦੀ ਹੈ।"),
  "There is no difference between them.": lp("दोनों में कोई अंतर नहीं है।", "ਦੋਹਾਂ ਵਿੱਚ ਕੋਈ ਫਰਕ ਨਹੀਂ ਹੈ।"),
  "GDP adds taxes less subsidies on products to the sum of GVA.": lp("GDP में GVA के योग में उत्पादों पर कर घटा सब्सिडी जोड़ी जाती है।", "GDP ਵਿੱਚ GVA ਦੇ ਜੋੜ ਵਿੱਚ ਉਤਪਾਦਾਂ ਉੱਤੇ ਕਰ ਘਟਾ ਸਬਸਿਡੀਆਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।"),
  "GDP is always lower than GVA by depreciation.": lp("GDP हमेशा मूल्यह्रास जितना GVA से कम होता है।", "GDP ਹਮੇਸ਼ਾ ਮੁੱਲ ਘਟਾਅ ਜਿੰਨਾ GVA ਤੋਂ ਘੱਟ ਹੁੰਦਾ ਹੈ।"),
  "GVA equals exports minus imports.": lp("GVA = निर्यात - आयात।", "GVA = ਨਿਰਯਾਤ - ਆਯਾਤ।"),
  "GDP and GVA differ only because of population.": lp("GDP और GVA केवल जनसंख्या के कारण अलग होते हैं।", "GDP ਅਤੇ GVA ਸਿਰਫ਼ ਆਬਾਦੀ ਕਰਕੇ ਵੱਖ ਹੁੰਦੇ ਹਨ।"),
});

function cp4Option(text: string, locale: NativeLocale): string {
  if (/^-?[\d,]+$/u.test(text)) return text;
  const exact = CP4_OPTION[text];
  if (exact) return pick(exact, locale);
  throw new Error(`Unsupported CP004 option for ${locale}: ${text}`);
}

function cp4Stem(question: (typeof ECO_CP004_REVIEW_V2)[number], locale: NativeLocale): string {
  const ql = Number(question.qlId.slice(-3));
  const exact12: Readonly<Record<string, LocalePair>> = {
    "Which statement is correct?": lp("निम्न में से कौन-सा कथन सही है?", "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?"),
    "Which statement correctly separates the income and expenditure methods?": lp("आय विधि और व्यय विधि के बीच सही अंतर कौन-सा कथन बताता है?", "ਆਮਦਨ ਵਿਧੀ ਅਤੇ ਖਰਚ ਵਿਧੀ ਵਿਚਲਾ ਸਹੀ ਅੰਤਰ ਕਿਹੜਾ ਬਿਆਨ ਦੱਸਦਾ ਹੈ?"),
    "Which statement correctly separates GVA from GDP?": lp("GVA और GDP के बीच सही अंतर कौन-सा कथन बताता है?", "GVA ਅਤੇ GDP ਵਿਚਲਾ ਸਹੀ ਅੰਤਰ ਕਿਹੜਾ ਬਿਆਨ ਦੱਸਦਾ ਹੈ?"),
  };

  if (ql === 1) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "Which method adds the value created at each stage of production?": lp("कौन-सी विधि उत्पादन के हर चरण पर जोड़े गए मूल्य को जोड़ती है?", "ਕਿਹੜੀ ਵਿਧੀ ਉਤਪਾਦਨ ਦੇ ਹਰ ਪੜਾਅ ਤੇ ਜੋੜੇ ਮੁੱਲ ਨੂੰ ਜੋੜਦੀ ਹੈ?"),
      "Which method adds incomes generated from production?": lp("कौन-सी विधि उत्पादन से उत्पन्न आय को जोड़ती है?", "ਕਿਹੜੀ ਵਿਧੀ ਉਤਪਾਦਨ ਤੋਂ ਬਣੀ ਆਮਦਨ ਨੂੰ ਜੋੜਦੀ ਹੈ?"),
      "Which method adds final spending on goods and services?": lp("कौन-सी विधि वस्तुओं और सेवाओं पर अंतिम व्यय को जोड़ती है?", "ਕਿਹੜੀ ਵਿਧੀ ਵਸਤੂਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਉੱਤੇ ਅੰਤਿਮ ਖਰਚ ਨੂੰ ਜੋੜਦੀ ਹੈ?"),
      "Which method measures output by adding value created instead of adding every sale?": lp("हर बिक्री को जोड़ने के बजाय जोड़े गए मूल्य को जोड़कर उत्पादन मापने वाली विधि कौन-सी है?", "ਹਰ ਵਿਕਰੀ ਜੋੜਨ ਦੀ ਥਾਂ ਜੋੜੇ ਮੁੱਲ ਨੂੰ ਜੋੜ ਕੇ ਉਤਪਾਦਨ ਮਾਪਣ ਵਾਲੀ ਵਿਧੀ ਕਿਹੜੀ ਹੈ?"),
    };
    if (exact[question.stem]) return pick(exact[question.stem], locale);
  }

  if (ql === 2) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "An estimate adds output minus intermediate inputs for producers. Which method is used?": lp("एक अनुमान में उत्पादकों के उत्पादन मूल्य में से मध्यवर्ती इनपुट घटाकर जोड़ा जाता है। कौन-सी विधि प्रयोग हो रही है?", "ਇੱਕ ਅੰਦਾਜ਼ੇ ਵਿੱਚ ਉਤਪਾਦਕਾਂ ਦੇ ਉਤਪਾਦਨ ਮੁੱਲ ਵਿੱਚੋਂ ਮੱਧਵਰਤੀ ਇਨਪੁੱਟ ਘਟਾ ਕੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਕਿਹੜੀ ਵਿਧੀ ਵਰਤੀ ਜਾ ਰਹੀ ਹੈ?"),
      "An estimate adds wages, operating surplus and mixed income. Which method is used?": lp("एक अनुमान में मजदूरी, परिचालन अधिशेष और मिश्रित आय जोड़ी जाती है। कौन-सी विधि प्रयोग हो रही है?", "ਇੱਕ ਅੰਦਾਜ਼ੇ ਵਿੱਚ ਮਜ਼ਦੂਰੀ, ਚਾਲੂ ਅਧਿਸ਼ੇਸ਼ ਅਤੇ ਮਿਸ਼ਰਤ ਆਮਦਨ ਜੋੜੀ ਜਾਂਦੀ ਹੈ। ਕਿਹੜੀ ਵਿਧੀ ਵਰਤੀ ਜਾ ਰਹੀ ਹੈ?"),
      "An estimate adds household consumption, government consumption, investment and net exports. Which method is used?": lp("एक अनुमान में घरेलू उपभोग, सरकारी उपभोग, निवेश और शुद्ध निर्यात जोड़े जाते हैं। कौन-सी विधि प्रयोग हो रही है?", "ਇੱਕ ਅੰਦਾਜ਼ੇ ਵਿੱਚ ਘਰੇਲੂ ਖਪਤ, ਸਰਕਾਰੀ ਖਪਤ, ਨਿਵੇਸ਼ ਅਤੇ ਸ਼ੁੱਧ ਨਿਰਯਾਤ ਜੋੜੇ ਜਾਂਦੇ ਹਨ। ਕਿਹੜੀ ਵਿਧੀ ਵਰਤੀ ਜਾ ਰਹੀ ਹੈ?"),
      "Data show sales at several production stages. To avoid counting the same input twice, which method is most suitable?": lp("कई उत्पादन चरणों की बिक्री दी गई है। एक ही इनपुट की दोहरी गणना से बचने के लिए कौन-सी विधि सबसे उपयुक्त है?", "ਕਈ ਉਤਪਾਦਨ ਪੜਾਵਾਂ ਦੀ ਵਿਕਰੀ ਦਿੱਤੀ ਹੈ। ਇੱਕੋ ਇਨਪੁੱਟ ਦੀ ਦੋਹਰੀ ਗਿਣਤੀ ਤੋਂ ਬਚਣ ਲਈ ਕਿਹੜੀ ਵਿਧੀ ਸਭ ਤੋਂ ਢੁੱਕਵੀਂ ਹੈ?"),
    };
    if (exact[question.stem]) return pick(exact[question.stem], locale);
  }

  if (ql === 3) {
    const match = question.stem.match(/^How is (.+) classified in national-income measurement\?$/u);
    if (match) {
      const description = CP4_DESC[match[1]] ? pick(CP4_DESC[match[1]], locale) : match[1];
      return locale === "hi" ? `राष्ट्रीय आय मापन में ${description} को कैसे वर्गीकृत किया जाएगा?` : `ਰਾਸ਼ਟਰੀ ਆਮਦਨ ਮਾਪ ਵਿੱਚ ${description} ਨੂੰ ਕਿਵੇਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਵੇਗਾ?`;
    }
  }

  if (ql === 4) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "What problem arises if the full value of both flour and the bread made from it is counted?": lp("यदि आटे और उससे बनी ब्रेड दोनों का पूरा मूल्य गिना जाए, तो कौन-सी समस्या उत्पन्न होगी?", "ਜੇ ਆਟੇ ਅਤੇ ਉਸ ਤੋਂ ਬਣੀ ਰੋਟੀ ਦੋਹਾਂ ਦਾ ਪੂਰਾ ਮੁੱਲ ਗਿਣਿਆ ਜਾਵੇ, ਤਾਂ ਕਿਹੜੀ ਸਮੱਸਿਆ ਪੈਦਾ ਹੋਵੇਗੀ?"),
      "Which practice helps avoid double counting?": lp("दोहरी गणना से बचने में कौन-सा तरीका मदद करता है?", "ਦੋਹਰੀ ਗਿਣਤੀ ਤੋਂ ਬਚਣ ਵਿੱਚ ਕਿਹੜਾ ਤਰੀਕਾ ਮਦਦ ਕਰਦਾ ਹੈ?"),
      "What happens if the full values of cotton, yarn and cloth are all added as final output?": lp("यदि कपास, सूत और कपड़े के पूरे मूल्यों को अंतिम उत्पादन के रूप में जोड़ दिया जाए, तो क्या होगा?", "ਜੇ ਕਪਾਹ, ਧਾਗੇ ਅਤੇ ਕੱਪੜੇ ਦੇ ਪੂਰੇ ਮੁੱਲ ਅੰਤਿਮ ਉਤਪਾਦਨ ਵਜੋਂ ਜੋੜ ਦਿੱਤੇ ਜਾਣ, ਤਾਂ ਕੀ ਹੋਵੇਗਾ?"),
      "Which problem is mainly avoided by measuring value added separately at each production stage?": lp("हर उत्पादन चरण पर मूल्य वर्धित को अलग मापने से मुख्यतः कौन-सी समस्या से बचा जाता है?", "ਹਰ ਉਤਪਾਦਨ ਪੜਾਅ ਤੇ ਮੁੱਲ ਵਾਧਾ ਵੱਖ ਮਾਪਣ ਨਾਲ ਮੁੱਖ ਤੌਰ ਤੇ ਕਿਹੜੀ ਸਮੱਸਿਆ ਤੋਂ ਬਚਿਆ ਜਾਂਦਾ ਹੈ?"),
    };
    if (exact[question.stem]) return pick(exact[question.stem], locale);
  }

  if (ql === 5) {
    let match = question.stem.match(/^Output is ([\d,]+) and intermediate consumption is ([\d,]+)\. What is the value added\?$/u);
    if (match) return locale === "hi" ? `उत्पादन मूल्य ${match[1]} और मध्यवर्ती उपभोग ${match[2]} है। मूल्य वर्धित कितना है?` : `ਉਤਪਾਦਨ ਮੁੱਲ ${match[1]} ਅਤੇ ਮੱਧਵਰਤੀ ਖਪਤ ${match[2]} ਹੈ। ਮੁੱਲ ਵਾਧਾ ਕਿੰਨਾ ਹੈ?`;
    match = question.stem.match(/^Output is ([\d,]+) and value added is ([\d,]+)\. What is the intermediate consumption\?$/u);
    if (match) return locale === "hi" ? `उत्पादन मूल्य ${match[1]} और मूल्य वर्धित ${match[2]} है। मध्यवर्ती उपभोग कितना है?` : `ਉਤਪਾਦਨ ਮੁੱਲ ${match[1]} ਅਤੇ ਮੁੱਲ ਵਾਧਾ ${match[2]} ਹੈ। ਮੱਧਵਰਤੀ ਖਪਤ ਕਿੰਨੀ ਹੈ?`;
    match = question.stem.match(/^Value added is ([\d,]+) and intermediate consumption is ([\d,]+)\. What is the output\?$/u);
    if (match) return locale === "hi" ? `मूल्य वर्धित ${match[1]} और मध्यवर्ती उपभोग ${match[2]} है। उत्पादन मूल्य कितना है?` : `ਮੁੱਲ ਵਾਧਾ ${match[1]} ਅਤੇ ਮੱਧਵਰਤੀ ਖਪਤ ${match[2]} ਹੈ। ਉਤਪਾਦਨ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`;
  }

  if (ql === 6) {
    const match = question.stem.match(/^Under the expenditure method, how is (.+) recorded\?$/u);
    if (match) {
      const description = CP4_DESC[match[1]] ? pick(CP4_DESC[match[1]], locale) : match[1];
      return locale === "hi" ? `व्यय विधि में ${description} को किस मद में दर्ज किया जाता है?` : `ਖਰਚ ਵਿਧੀ ਵਿੱਚ ${description} ਨੂੰ ਕਿਹੜੀ ਮਦ ਵਿੱਚ ਦਰਜ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?`;
    }
  }

  if (ql === 7) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "Wages and salaries belong to which income-method component?": lp("मजदूरी और वेतन आय विधि के किस घटक में आते हैं?", "ਮਜ਼ਦੂਰੀ ਅਤੇ ਤਨਖਾਹ ਆਮਦਨ ਵਿਧੀ ਦੇ ਕਿਹੜੇ ਘਟਕ ਵਿੱਚ ਆਉਂਦੇ ਹਨ?"),
      "Under the income method, how is profit-like surplus from production recorded?": lp("आय विधि में उत्पादन से प्राप्त लाभ-जैसे अधिशेष को किस रूप में दर्ज किया जाता है?", "ਆਮਦਨ ਵਿਧੀ ਵਿੱਚ ਉਤਪਾਦਨ ਤੋਂ ਮਿਲੇ ਲਾਭ-ਜਿਹੇ ਅਧਿਸ਼ੇਸ਼ ਨੂੰ ਕਿਹੜੇ ਰੂਪ ਵਿੱਚ ਦਰਜ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?"),
      "Under the income method, how is income classified when a self-employed unit's labour and capital returns cannot be separated?": lp("आय विधि में, जब स्व-रोजगार इकाई की श्रम और पूंजी आय अलग न की जा सके, तो उसे कैसे वर्गीकृत किया जाता है?", "ਆਮਦਨ ਵਿਧੀ ਵਿੱਚ, ਜਦੋਂ ਸਵੈ-ਰੋਜ਼ਗਾਰ ਇਕਾਈ ਦੀ ਕਿਰਤ ਅਤੇ ਪੂੰਜੀ ਆਮਦਨ ਵੱਖ ਨਾ ਕੀਤੀ ਜਾ ਸਕੇ, ਤਾਂ ਉਸਨੂੰ ਕਿਵੇਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?"),
      "Under the income method, how is the combined return of a family-run shop using the owner's labour and capital classified?": lp("आय विधि में, मालिक के श्रम और पूंजी दोनों का उपयोग करने वाली पारिवारिक दुकान की संयुक्त आय को कैसे वर्गीकृत किया जाता है?", "ਆਮਦਨ ਵਿਧੀ ਵਿੱਚ, ਮਾਲਕ ਦੀ ਕਿਰਤ ਅਤੇ ਪੂੰਜੀ ਦੋਵੇਂ ਵਰਤਣ ਵਾਲੀ ਪਰਿਵਾਰਕ ਦੁਕਾਨ ਦੀ ਸੰਯੁਕਤ ਆਮਦਨ ਨੂੰ ਕਿਵੇਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?"),
    };
    if (exact[question.stem]) return pick(exact[question.stem], locale);
  }

  if (ql === 8) {
    let match = question.stem.match(/^Sum of GVA is ([\d,]+) and taxes less subsidies on products are ([\d,]+)\. What is GDP\?$/u);
    if (match) return locale === "hi" ? `GVA का योग ${match[1]} और उत्पादों पर कर घटा सब्सिडी ${match[2]} है। GDP कितना है?` : `GVA ਦਾ ਜੋੜ ${match[1]} ਅਤੇ ਉਤਪਾਦਾਂ ਉੱਤੇ ਕਰ ਘਟਾ ਸਬਸਿਡੀਆਂ ${match[2]} ਹੈ। GDP ਕਿੰਨਾ ਹੈ?`;
    match = question.stem.match(/^Sum of GVA is ([\d,]+), product taxes are ([\d,]+) and product subsidies are ([\d,]+)\. What is GDP\?$/u);
    if (match) return locale === "hi" ? `GVA का योग ${match[1]}, उत्पाद कर ${match[2]} और उत्पाद सब्सिडी ${match[3]} है। GDP कितना है?` : `GVA ਦਾ ਜੋੜ ${match[1]}, ਉਤਪਾਦ ਕਰ ${match[2]} ਅਤੇ ਉਤਪਾਦ ਸਬਸਿਡੀਆਂ ${match[3]} ਹਨ। GDP ਕਿੰਨਾ ਹੈ?`;
  }

  if (ql === 9) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "What is the main purpose of a base year in constant-price estimates?": lp("स्थिर कीमतों के अनुमानों में आधार वर्ष का मुख्य उद्देश्य क्या है?", "ਸਥਿਰ ਕੀਮਤਾਂ ਵਾਲੇ ਅੰਦਾਜ਼ਿਆਂ ਵਿੱਚ ਆਧਾਰ ਸਾਲ ਦਾ ਮੁੱਖ ਉਦੇਸ਼ ਕੀ ਹੈ?"),
      "Why is a statistical base year revised from time to time?": lp("सांख्यिकीय आधार वर्ष को समय-समय पर क्यों बदला जाता है?", "ਅੰਕੜਾ ਆਧਾਰ ਸਾਲ ਨੂੰ ਸਮੇਂ-ਸਮੇਂ ਤੇ ਕਿਉਂ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ?"),
      "For a meaningful constant-price comparison across years, estimates should use:": lp("वर्षों के बीच स्थिर कीमतों की सार्थक तुलना के लिए अनुमानों में क्या उपयोग होना चाहिए?", "ਸਾਲਾਂ ਵਿਚਕਾਰ ਸਥਿਰ ਕੀਮਤਾਂ ਦੀ ਅਰਥਪੂਰਨ ਤੁਲਨਾ ਲਈ ਅੰਦਾਜ਼ਿਆਂ ਵਿੱਚ ਕੀ ਵਰਤਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?"),
    };
    if (exact[question.stem]) return pick(exact[question.stem], locale);
  }

  if (ql === 10) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "Which ministry publishes India's National Accounts Statistics?": lp("भारत के राष्ट्रीय लेखा सांख्यिकी किस मंत्रालय द्वारा प्रकाशित की जाती है?", "ਭਾਰਤ ਦੇ ਰਾਸ਼ਟਰੀ ਲੇਖਾ ਅੰਕੜੇ ਕਿਹੜਾ ਮੰਤਰਾਲਾ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰਦਾ ਹੈ?"),
      "For official Indian national-accounts estimates, which ministry is the main statistical source?": lp("भारत के आधिकारिक राष्ट्रीय लेखा अनुमानों के लिए मुख्य सांख्यिकीय मंत्रालय कौन-सा है?", "ਭਾਰਤ ਦੇ ਅਧਿਕਾਰਕ ਰਾਸ਼ਟਰੀ ਲੇਖਾ ਅੰਦਾਜ਼ਿਆਂ ਲਈ ਮੁੱਖ ਅੰਕੜਾ ਮੰਤਰਾਲਾ ਕਿਹੜਾ ਹੈ?"),
    };
    if (exact[question.stem]) return pick(exact[question.stem], locale);
  }

  if (ql === 11) {
    const lines = question.stem.split("\n");
    const first = lines[1]?.replace(/^I\.\s*/u, "") ?? "";
    const second = lines[2]?.replace(/^II\.\s*/u, "") ?? "";
    const statements: Readonly<Record<string, LocalePair>> = {
      "The value added method can avoid double counting.": lp("मूल्य वर्धित विधि दोहरी गणना से बचा सकती है।", "ਮੁੱਲ ਵਾਧਾ ਵਿਧੀ ਦੋਹਰੀ ਗਿਣਤੀ ਤੋਂ ਬਚਾ ਸਕਦੀ ਹੈ।"),
      "Intermediate goods should always be added again at full value after final goods are counted.": lp("अंतिम वस्तुओं को गिनने के बाद मध्यवर्ती वस्तुओं का पूरा मूल्य हमेशा फिर से जोड़ना चाहिए।", "ਅੰਤਿਮ ਵਸਤੂਆਂ ਨੂੰ ਗਿਣਨ ਤੋਂ ਬਾਅਦ ਮੱਧਵਰਤੀ ਵਸਤੂਆਂ ਦਾ ਪੂਰਾ ਮੁੱਲ ਹਮੇਸ਼ਾ ਮੁੜ ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ।"),
      "The income method adds incomes generated in production.": lp("आय विधि उत्पादन से उत्पन्न आय को जोड़ती है।", "ਆਮਦਨ ਵਿਧੀ ਉਤਪਾਦਨ ਤੋਂ ਬਣੀ ਆਮਦਨ ਨੂੰ ਜੋੜਦੀ ਹੈ।"),
      "The expenditure method adds final expenditure on goods and services.": lp("व्यय विधि वस्तुओं और सेवाओं पर अंतिम व्यय को जोड़ती है।", "ਖਰਚ ਵਿਧੀ ਵਸਤੂਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਉੱਤੇ ਅੰਤਿਮ ਖਰਚ ਨੂੰ ਜੋੜਦੀ ਹੈ।"),
      "GDP can be obtained from GVA by adding taxes on products and subtracting subsidies on products.": lp("GVA में उत्पादों पर कर जोड़कर और उत्पादों पर सब्सिडी घटाकर GDP प्राप्त की जा सकती है।", "GVA ਵਿੱਚ ਉਤਪਾਦਾਂ ਉੱਤੇ ਕਰ ਜੋੜ ਕੇ ਅਤੇ ਉਤਪਾਦਾਂ ਉੱਤੇ ਸਬਸਿਡੀਆਂ ਘਟਾ ਕੇ GDP ਪ੍ਰਾਪਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।"),
      "A capital good bought for final investment must always be treated as intermediate consumption.": lp("अंतिम निवेश के लिए खरीदी गई पूंजीगत वस्तु को हमेशा मध्यवर्ती उपभोग मानना चाहिए।", "ਅੰਤਿਮ ਨਿਵੇਸ਼ ਲਈ ਖਰੀਦੀ ਪੂੰਜੀ ਵਸਤੂ ਨੂੰ ਹਮੇਸ਼ਾ ਮੱਧਵਰਤੀ ਖਪਤ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ।"),
    };
    return locale === "hi"
      ? `निम्न कथनों पर विचार कीजिए:\nI. ${pick(statements[first], locale)}\nII. ${pick(statements[second], locale)}\nसही विकल्प चुनिए।`
      : `ਹੇਠਲੇ ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:\nI. ${pick(statements[first], locale)}\nII. ${pick(statements[second], locale)}\nਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।`;
  }

  if (ql === 12 && exact12[question.stem]) return pick(exact12[question.stem], locale);
  throw new Error(`${question.questionId}: unsupported CP004 stem for ${locale}: ${question.stem}`);
}

function cp4Explanation(question: (typeof ECO_CP004_REVIEW_V2)[number], locale: NativeLocale): string {
  const ql = Number(question.qlId.slice(-3));
  const answer = cp4Option(question.canonicalAnswer, locale);
  if (ql === 1) {
    if (question.canonicalAnswer === "Value added method") return locale === "hi" ? "मूल्य वर्धित विधि हर उत्पादन चरण पर जोड़े गए नए मूल्य को जोड़ती है और मध्यवर्ती मूल्य की दोहरी गणना से बचाती है।" : "ਮੁੱਲ ਵਾਧਾ ਵਿਧੀ ਹਰ ਉਤਪਾਦਨ ਪੜਾਅ ਤੇ ਜੋੜੇ ਨਵੇਂ ਮੁੱਲ ਨੂੰ ਜੋੜਦੀ ਹੈ ਅਤੇ ਮੱਧਵਰਤੀ ਮੁੱਲ ਦੀ ਦੋਹਰੀ ਗਿਣਤੀ ਤੋਂ ਬਚਾਉਂਦੀ ਹੈ।";
    if (question.canonicalAnswer === "Income method") return locale === "hi" ? "आय विधि उत्पादन से उत्पन्न आय के घटकों को जोड़ती है।" : "ਆਮਦਨ ਵਿਧੀ ਉਤਪਾਦਨ ਤੋਂ ਬਣੇ ਆਮਦਨ ਘਟਕਾਂ ਨੂੰ ਜੋੜਦੀ ਹੈ।";
    return locale === "hi" ? "व्यय विधि वस्तुओं और सेवाओं पर अंतिम व्यय को जोड़ती है।" : "ਖਰਚ ਵਿਧੀ ਵਸਤੂਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਉੱਤੇ ਅੰਤਿਮ ਖਰਚ ਨੂੰ ਜੋੜਦੀ ਹੈ।";
  }
  if (ql === 2) return locale === "hi" ? `${answer} सही है, क्योंकि दिए गए घटक इसी मापन-पद्धति से संबंधित हैं।` : `${answer} ਸਹੀ ਹੈ, ਕਿਉਂਕਿ ਦਿੱਤੇ ਘਟਕ ਇਸੇ ਮਾਪਣ-ਵਿਧੀ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ।`;
  if (ql === 3) return question.canonicalAnswer === "Intermediate"
    ? (locale === "hi" ? "यह आगे उत्पादन में इनपुट के रूप में उपयोग होता है, इसलिए इसे मध्यवर्ती माना जाता है।" : "ਇਹ ਅੱਗੇ ਉਤਪਾਦਨ ਵਿੱਚ ਇਨਪੁੱਟ ਵਜੋਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਸਨੂੰ ਮੱਧਵਰਤੀ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।")
    : (locale === "hi" ? "यह अंतिम उपयोग या अंतिम निवेश के लिए है, इसलिए इसे अंतिम माना जाता है।" : "ਇਹ ਅੰਤਿਮ ਵਰਤੋਂ ਜਾਂ ਅੰਤਿਮ ਨਿਵੇਸ਼ ਲਈ ਹੈ, ਇਸ ਲਈ ਇਸਨੂੰ ਅੰਤਿਮ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।");
  if (ql === 4) return locale === "hi" ? `${answer} सही है। राष्ट्रीय आय में एक ही मध्यवर्ती मूल्य को दोबारा नहीं गिनना चाहिए।` : `${answer} ਸਹੀ ਹੈ। ਰਾਸ਼ਟਰੀ ਆਮਦਨ ਵਿੱਚ ਇੱਕੋ ਮੱਧਵਰਤੀ ਮੁੱਲ ਨੂੰ ਮੁੜ ਨਹੀਂ ਗਿਣਣਾ ਚਾਹੀਦਾ।`;
  if (ql === 5) return locale === "hi" ? `मूल्य वर्धित = उत्पादन मूल्य - मध्यवर्ती उपभोग। दिए गए आंकड़ों से ${question.explanation}` : `ਮੁੱਲ ਵਾਧਾ = ਉਤਪਾਦਨ ਮੁੱਲ - ਮੱਧਵਰਤੀ ਖਪਤ। ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਤੋਂ ${question.explanation}`;
  if (ql === 6) return locale === "hi" ? `${answer} व्यय विधि का सही घटक है। प्रश्न में दिए व्यय के प्रकार को उसी अंतिम व्यय-मद से मिलाया जाता है।` : `${answer} ਖਰਚ ਵਿਧੀ ਦਾ ਸਹੀ ਘਟਕ ਹੈ। ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਖਰਚ ਦੀ ਕਿਸਮ ਨੂੰ ਉਸੇ ਅੰਤਿਮ ਖਰਚ-ਮਦ ਨਾਲ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ।`;
  if (ql === 7) return locale === "hi" ? `${answer} आय विधि का सही घटक है। आय को उसके उत्पादन-संबंधी स्रोत के अनुसार वर्गीकृत किया जाता है।` : `${answer} ਆਮਦਨ ਵਿਧੀ ਦਾ ਸਹੀ ਘਟਕ ਹੈ। ਆਮਦਨ ਨੂੰ ਉਸਦੇ ਉਤਪਾਦਨ-ਸੰਬੰਧੀ ਸਰੋਤ ਅਨੁਸਾਰ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
  if (ql === 8) {
    const translated = question.explanation
      .replace(/Net product taxes/gu, locale === "hi" ? "शुद्ध उत्पाद कर" : "ਸ਼ੁੱਧ ਉਤਪਾਦ ਕਰ")
      .replace(/GDP/gu, "GDP")
      .replace(/GVA/gu, "GVA");
    return locale === "hi" ? `GDP = GVA का योग + उत्पादों पर कर - उत्पादों पर सब्सिडी। ${translated}` : `GDP = GVA ਦਾ ਜੋੜ + ਉਤਪਾਦਾਂ ਉੱਤੇ ਕਰ - ਉਤਪਾਦਾਂ ਉੱਤੇ ਸਬਸਿਡੀਆਂ। ${translated}`;
  }
  if (ql === 9) return locale === "hi" ? `${answer} सही है। आधार वर्ष स्थिर कीमतों पर समय के साथ तुलना के लिए एक समान संदर्भ देता है।` : `${answer} ਸਹੀ ਹੈ। ਆਧਾਰ ਸਾਲ ਸਥਿਰ ਕੀਮਤਾਂ ਤੇ ਸਮੇਂ ਨਾਲ ਤੁਲਨਾ ਲਈ ਇੱਕੋ ਸੰਦਰਭ ਦਿੰਦਾ ਹੈ।`;
  if (ql === 10) return locale === "hi" ? "MoSPI भारत की आधिकारिक राष्ट्रीय लेखा सांख्यिकी प्रकाशित करने वाला मंत्रालय है।" : "MoSPI ਭਾਰਤ ਦੇ ਅਧਿਕਾਰਕ ਰਾਸ਼ਟਰੀ ਲੇਖਾ ਅੰਕੜੇ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰਨ ਵਾਲਾ ਮੰਤਰਾਲਾ ਹੈ।";
  if (ql === 11) {
    const exact: Readonly<Record<string, LocalePair>> = {
      "Value added avoids double counting. Intermediate inputs should not be counted again inside final output.": lp("मूल्य वर्धित विधि दोहरी गणना से बचाती है। अंतिम उत्पादन में शामिल मध्यवर्ती इनपुट को फिर से नहीं गिनना चाहिए।", "ਮੁੱਲ ਵਾਧਾ ਵਿਧੀ ਦੋਹਰੀ ਗਿਣਤੀ ਤੋਂ ਬਚਾਉਂਦੀ ਹੈ। ਅੰਤਿਮ ਉਤਪਾਦਨ ਵਿੱਚ ਸ਼ਾਮਲ ਮੱਧਵਰਤੀ ਇਨਪੁੱਟ ਨੂੰ ਮੁੜ ਨਹੀਂ ਗਿਣਣਾ ਚਾਹੀਦਾ।"),
      "Both statements correctly describe the two methods.": lp("दोनों कथन दोनों विधियों का सही वर्णन करते हैं।", "ਦੋਵੇਂ ਬਿਆਨ ਦੋਹਾਂ ਵਿਧੀਆਂ ਦਾ ਸਹੀ ਵਰਣਨ ਕਰਦੇ ਹਨ।"),
      "The GDP-GVA relation is correct. A capital good bought for investment is a final use.": lp("GDP-GVA संबंध सही है। निवेश के लिए खरीदी गई पूंजीगत वस्तु अंतिम उपयोग मानी जाती है।", "GDP-GVA ਸੰਬੰਧ ਸਹੀ ਹੈ। ਨਿਵੇਸ਼ ਲਈ ਖਰੀਦੀ ਪੂੰਜੀ ਵਸਤੂ ਅੰਤਿਮ ਵਰਤੋਂ ਮੰਨੀ ਜਾਂਦੀ ਹੈ।"),
    };
    return pick(exact[question.explanation], locale);
  }
  return locale === "hi" ? `${answer} सही है। यह विकल्प संबंधित मापन अवधारणाओं के बीच सही अंतर बताता है।` : `${answer} ਸਹੀ ਹੈ। ਇਹ ਵਿਕਲਪ ਸੰਬੰਧਿਤ ਮਾਪਣ ਧਾਰਣਾਵਾਂ ਵਿਚਲਾ ਸਹੀ ਅੰਤਰ ਦੱਸਦਾ ਹੈ।`;
}

function localizeCp004(question: (typeof ECO_CP004_REVIEW_V2)[number], locale: EcoLocaleV1): EcoLocalizedQuestionV1 {
  if (locale === "en") return localizedBase(question, locale, question.stem, [...question.options], question.explanation);
  const options = question.options.map((option) => cp4Option(option, locale));
  return localizedBase(question, locale, cp4Stem(question, locale), options, cp4Explanation(question, locale));
}

export function generateEcoCp003LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return ECO_CP003_REVIEW_V2.map((question) => localizeCp003(question, locale));
}

export function generateEcoCp004LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return ECO_CP004_REVIEW_V2.map((question) => localizeCp004(question, locale));
}

export function generateEcoCp003Cp004LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [...generateEcoCp003LocalizedReviewV1(locale), ...generateEcoCp004LocalizedReviewV1(locale)];
}

export const ECO_MULTILINGUAL_CP003_CP004_V1 = Object.freeze({
  en: generateEcoCp003Cp004LocalizedReviewV1("en"),
  hi: generateEcoCp003Cp004LocalizedReviewV1("hi"),
  pa: generateEcoCp003Cp004LocalizedReviewV1("pa"),
});

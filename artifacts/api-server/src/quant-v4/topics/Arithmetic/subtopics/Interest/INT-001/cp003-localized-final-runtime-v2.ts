import {
  amount,
  div,
  factor,
  mul,
  pow,
  rat,
  sub,
  yearlyInterest,
  type IntCp003QlId,
  type Rational,
} from "./cp003-exam-model";
import {
  ANSWER_SEMANTICS,
  decimal,
  fractionLatex,
  indianInteger,
  resolve,
  tableMarkdown,
} from "./cp003-exam-support";
import { generateIntCp003EnglishFrozenQuestion, type IntCp003EnglishFrozenQuestion } from "./cp003-english-frozen-runtime";
import {
  INT_CP003_LOCALIZATION_VERSION,
  assertCp003LocalizedText,
  cp003Term,
  languageForLocale,
} from "./cp003-localization-language-pack";
import { renderCp003LocalizedPresentationWave1 } from "./cp003-localized-presentation-wave1";
import { renderCp003LocalizedPresentationWave2 } from "./cp003-localized-presentation-wave2";
import type {
  IntCp003LocalizedExplanation,
  IntCp003LocalizedLocale,
  IntCp003LocalizedOption,
  IntCp003LocalizedPresentation,
  IntCp003LocalizedQuestion,
} from "./cp003-localization-types";

export const INT_CP003_HI_PA_FINAL_RUNTIME_V2 = "INT-CP-003-HI-PA-FINAL-RUNTIME-v2" as const;

function localized(locale: IntCp003LocalizedLocale, hindi: string, punjabi: string): string {
  return locale === "hi-IN" ? hindi : punjabi;
}

function math(body: string): string {
  return `\\(${body}\\)`;
}

function convertLegacyMath(text: string): string {
  return text
    .replace(/\$\$([^$\n]+)\$\$/gu, (_match, body: string) => `\\[${body}\\]`)
    .replace(/\$([^$\n]+)\$/gu, (_match, body: string) => `\\(${body}\\)`)
    .replace(/\\\(₹([^)]*)\\\)/gu, "₹$1");
}

function moneyText(value: Rational): string {
  const scaledNumerator = value.numerator * 100n;
  if (scaledNumerator % value.denominator !== 0n) {
    throw new Error(`CP003 learner money is not exact to paise: ${value.numerator}/${value.denominator}`);
  }
  const scaled = scaledNumerator / value.denominator;
  const negative = scaled < 0n;
  const absolute = negative ? -scaled : scaled;
  const whole = absolute / 100n;
  const paise = absolute % 100n;
  const sign = negative ? "-" : "";
  return paise === 0n
    ? `₹${sign}${indianInteger(whole)}`
    : `₹${sign}${indianInteger(whole)}.${paise.toString().padStart(2, "0")}`;
}

function moneyNumberLatex(value: Rational): string {
  return moneyText(value)
    .replace(/^₹/u, "")
    .replace(/,/gu, "{,}");
}

function rateLatex(value: Rational): string {
  const known = new Map<string, string>([
    ["25/3", "8\\frac{1}{3}"],
    ["50/3", "16\\frac{2}{3}"],
    ["100/3", "33\\frac{1}{3}"],
    ["100/7", "14\\frac{2}{7}"],
  ]);
  const exact = known.get(`${value.numerator}/${value.denominator}`);
  if (exact) return `${exact}\\%`;
  if (value.denominator === 1n) return `${value.numerator}\\%`;
  const rendered = decimal(value, 2);
  const scaled = value.numerator * 100n;
  if (scaled % value.denominator === 0n) return `${rendered}\\%`;
  return `\\frac{${value.numerator}}{${value.denominator}}\\%`;
}

function rationalLatex(value: Rational): string {
  return fractionLatex(value);
}

function localizedAnswer(
  source: IntCp003EnglishFrozenQuestion,
  value: Rational,
  locale: IntCp003LocalizedLocale,
): string {
  const semantic = ANSWER_SEMANTICS[source.qlId];
  if (semantic === "RATE_PERCENT") return math(rateLatex(value));
  if (semantic === "TIME_YEARS") {
    if (value.denominator !== 1n) throw new Error(`${source.qlId}: non-integer time option reached localized runtime.`);
    return locale === "hi-IN" ? `${math(value.numerator.toString())} वर्ष` : `${math(value.numerator.toString())} ਸਾਲ`;
  }
  return moneyText(value);
}

function naturalStructuredPrompt(qlId: IntCp003QlId, locale: IntCp003LocalizedLocale): string {
  const hi: Record<IntCp003QlId, string> = {
    "INT-QL-053": "अवधि के अंत में कुल राशि कितनी होगी?",
    "INT-QL-054": "कुल चक्रवृद्धि ब्याज कितना होगा?",
    "INT-QL-055": "प्रारंभिक मूल राशि कितनी थी?",
    "INT-QL-056": "प्रारंभिक मूलधन कितना था?",
    "INT-QL-057": "वार्षिक ब्याज दर कितनी थी?",
    "INT-QL-058": "निवेश की अवधि कितनी थी?",
    "INT-QL-059": "दिए गए वर्ष में प्राप्त ब्याज कितना होगा?",
    "INT-QL-060": "प्रारंभिक मूलधन कितना था?",
    "INT-QL-061": "वार्षिक ब्याज दर कितनी थी?",
    "INT-QL-062": "एक वर्ष पहले की शेष राशि कितनी थी?",
    "INT-QL-063": "इस एक वर्ष की वार्षिक ब्याज दर कितनी थी?",
    "INT-QL-064": "प्रारंभिक मूल राशि कितनी थी?",
    "INT-QL-065": "दोनों दी गई अवधियों की राशियों का अंतर कितना होगा?",
    "INT-QL-066": "बाद वाले दिए गए वर्ष का ब्याज कितना होगा?",
  };
  const pa: Record<IntCp003QlId, string> = {
    "INT-QL-053": "ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?",
    "INT-QL-054": "ਕੁੱਲ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?",
    "INT-QL-055": "ਸ਼ੁਰੂਆਤੀ ਮੂਲ ਰਕਮ ਕਿੰਨੀ ਸੀ?",
    "INT-QL-056": "ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?",
    "INT-QL-057": "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਸੀ?",
    "INT-QL-058": "ਨਿਵੇਸ਼ ਦੀ ਮਿਆਦ ਕਿੰਨੀ ਸੀ?",
    "INT-QL-059": "ਦਿੱਤੇ ਸਾਲ ਵਿੱਚ ਮਿਲਣ ਵਾਲਾ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?",
    "INT-QL-060": "ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?",
    "INT-QL-061": "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਸੀ?",
    "INT-QL-062": "ਇੱਕ ਸਾਲ ਪਹਿਲਾਂ ਦੀ ਬਕਾਇਆ ਰਕਮ ਕਿੰਨੀ ਸੀ?",
    "INT-QL-063": "ਇਸ ਇੱਕ ਸਾਲ ਦੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਸੀ?",
    "INT-QL-064": "ਸ਼ੁਰੂਆਤੀ ਮੂਲ ਰਕਮ ਕਿੰਨੀ ਸੀ?",
    "INT-QL-065": "ਦੋਵੇਂ ਦਿੱਤੀਆਂ ਮਿਆਦਾਂ ਦੀਆਂ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?",
    "INT-QL-066": "ਬਾਅਦ ਵਾਲੇ ਦਿੱਤੇ ਸਾਲ ਦਾ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?",
  };
  return locale === "hi-IN" ? hi[qlId] : pa[qlId];
}

function polishProse(text: string, locale: IntCp003LocalizedLocale): string {
  let result = convertLegacyMath(text).replace(/ਚੱਕਰਵੱਧੀ ਵਿਆਜ/gu, "ਮਿਸ਼ਰਤ ਵਿਆਜ");
  if (locale === "hi-IN") {
    result = result
      .replace(/प्राप्त राशि ज्ञात कीजिए।/gu, "कुल राशि कितनी होगी?")
      .replace(/चक्रवृद्धि ब्याज ज्ञात कीजिए।/gu, "कुल चक्रवृद्धि ब्याज कितना होगा?")
      .replace(/मूल राशि ज्ञात कीजिए।/gu, "शुरुआती मूल राशि कितनी थी?")
      .replace(/मूलधन ज्ञात कीजिए।/gu, "शुरुआती मूलधन कितना था?")
      .replace(/वार्षिक ब्याज दर ज्ञात कीजिए।/gu, "वार्षिक ब्याज दर कितनी थी?")
      .replace(/समय ज्ञात कीजिए।/gu, "निवेश की अवधि कितनी थी?")
      .replace(/ब्याज ज्ञात कीजिए।/gu, "ब्याज कितना होगा?")
      .replace(/शेष राशि ज्ञात कीजिए।/gu, "शेष राशि कितनी थी?")
      .replace(/राशियों का अंतर ज्ञात कीजिए।/gu, "दोनों राशियों का अंतर कितना होगा?");
  } else {
    result = result
      .replace(/ਮਿਲਣ ਵਾਲੀ ਰਕਮ ਪਤਾ ਕਰੋ।/gu, "ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?")
      .replace(/ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਕਰੋ।/gu, "ਕੁੱਲ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?")
      .replace(/ਮੂਲ ਰਕਮ ਪਤਾ ਕਰੋ।/gu, "ਸ਼ੁਰੂਆਤੀ ਮੂਲ ਰਕਮ ਕਿੰਨੀ ਸੀ?")
      .replace(/ਮੂਲਧਨ ਪਤਾ ਕਰੋ।/gu, "ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?")
      .replace(/ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।/gu, "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਸੀ?")
      .replace(/ਸਮਾਂ ਪਤਾ ਕਰੋ।/gu, "ਨਿਵੇਸ਼ ਦੀ ਮਿਆਦ ਕਿੰਨੀ ਸੀ?")
      .replace(/ਵਿਆਜ ਪਤਾ ਕਰੋ।/gu, "ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?")
      .replace(/ਬਕਾਇਆ ਰਕਮ ਪਤਾ ਕਰੋ।/gu, "ਬਕਾਇਆ ਰਕਮ ਕਿੰਨੀ ਸੀ?")
      .replace(/ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।/gu, "ਦੋਵੇਂ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?");
  }
  return result;
}

function renderFinalPresentation(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): IntCp003LocalizedPresentation {
  const base = source.qlId <= "INT-QL-058"
    ? renderCp003LocalizedPresentationWave1(source, locale)
    : renderCp003LocalizedPresentationWave2(source, locale);

  if (base.representation === "STANDARD_PROSE") {
    const prompt = polishProse(base.prompt, locale);
    assertCp003LocalizedText(locale, prompt, `${source.qlId}/${source.seed}/${locale}/final-prose`);
    return Object.freeze({ ...base, prompt, markdown: prompt });
  }

  const prompt = naturalStructuredPrompt(source.qlId, locale);
  const table = base.table
    ? Object.freeze({
        headers: Object.freeze(base.table.headers.map((item) => polishProse(item, locale))),
        rows: Object.freeze(base.table.rows.map((row) => Object.freeze(row.map((item) => polishProse(item, locale))))),
      })
    : undefined;
  const leadText = base.leadText ? polishProse(base.leadText, locale) : undefined;
  const markdown = table
    ? [leadText ?? "", "", convertLegacyMath(tableMarkdown(table)), "", prompt]
        .filter((part, index) => index !== 0 || part.length > 0)
        .join("\n")
    : prompt;
  assertCp003LocalizedText(locale, markdown, `${source.qlId}/${source.seed}/${locale}/final-structured`);
  return Object.freeze({
    representation: base.representation,
    stemFamilyId: base.stemFamilyId,
    ...(leadText ? { leadText } : {}),
    ...(table ? { table } : {}),
    prompt,
    markdown,
  });
}

function feedbackForMisconception(locale: IntCp003LocalizedLocale, misconceptionId: string): string {
  if (misconceptionId === "CORRECT") {
    return localized(locale, "यह विकल्प दिए गए चक्रवृद्धि-ब्याज संबंध को सही रूप से पूरा करता है।", "ਇਹ ਵਿਕਲਪ ਦਿੱਤੇ ਮਿਸ਼ਰਤ-ਵਿਆਜ ਸੰਬੰਧ ਨੂੰ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਪੂਰਾ ਕਰਦਾ ਹੈ।");
  }
  const id = misconceptionId.toUpperCase();
  if (id.includes("SIMPLE")) return localized(locale, "यह विकल्प चक्रवृद्धि ब्याज की जगह साधारण ब्याज का संबंध लगा देता है।", "ਇਹ ਵਿਕਲਪ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀ ਥਾਂ ਸਧਾਰਣ ਵਿਆਜ ਵਾਲਾ ਸੰਬੰਧ ਲਗਾ ਦਿੰਦਾ ਹੈ।");
  if (id.includes("EXTRA") || id.includes("OVERCOUNT") || id.includes("NEXT_YEAR")) return localized(locale, "इस विकल्प में एक अतिरिक्त वर्ष या वृद्धि-चरण जोड़ दिया गया है।", "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਇੱਕ ਵਾਧੂ ਸਾਲ ਜਾਂ ਵਾਧੇ ਦਾ ਕਦਮ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
  if (id.includes("FEWER") || id.includes("UNDERCOUNT") || id.includes("PREVIOUS_YEAR") || id.includes("EARLIER_YEAR")) return localized(locale, "इस विकल्प में आवश्यक वृद्धि-चरणों में से एक कम लिया गया है या पहले वर्ष का मान चुन लिया गया है।", "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਲੋੜੀਂਦੇ ਵਾਧੇ ਦੇ ਕਦਮਾਂ ਵਿੱਚੋਂ ਇੱਕ ਘੱਟ ਲਿਆ ਗਿਆ ਹੈ ਜਾਂ ਪਹਿਲੇ ਸਾਲ ਦਾ ਮੁੱਲ ਚੁਣ ਲਿਆ ਗਿਆ ਹੈ।");
  if (id.includes("CLOSING") && id.includes("BASE")) return localized(locale, "प्रतिशत निकालते समय सही प्रारंभिक शेष राशि की जगह अंतिम शेष राशि को आधार बनाया गया है।", "ਪ੍ਰਤੀਸ਼ਤ ਕੱਢਦੇ ਸਮੇਂ ਸਹੀ ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਦੀ ਥਾਂ ਅੰਤਿਮ ਬਕਾਇਆ ਨੂੰ ਆਧਾਰ ਬਣਾਇਆ ਗਿਆ ਹੈ।");
  if (id.includes("AVERAGE") && id.includes("BASE")) return localized(locale, "इस विकल्प में ब्याज के सही आरंभिक आधार की जगह औसत शेष राशि ली गई है।", "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਵਿਆਜ ਦੇ ਸਹੀ ਸ਼ੁਰੂਆਤੀ ਆਧਾਰ ਦੀ ਥਾਂ ਔਸਤ ਬਕਾਇਆ ਰਕਮ ਲਈ ਗਈ ਹੈ।");
  if (id.includes("AMOUNT") && id.includes("INTEREST")) return localized(locale, "इस विकल्प में कुल राशि और केवल ब्याज को आपस में मिला दिया गया है।", "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਕੁੱਲ ਰਕਮ ਅਤੇ ਸਿਰਫ਼ ਵਿਆਜ ਨੂੰ ਆਪਸ ਵਿੱਚ ਗੁੰਝਲਿਆ ਗਿਆ ਹੈ।");
  if (id.includes("INTEREST") && id.includes("PRINCIPAL")) return localized(locale, "इस विकल्प में ब्याज की राशि को मूलधन मान लिया गया है।", "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਵਿਆਜ ਦੀ ਰਕਮ ਨੂੰ ਮੂਲਧਨ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
  if (id.includes("RATE") || id.includes("GROWTH")) return localized(locale, "इस विकल्प में वार्षिक वृद्धि को रैखिक मान लिया गया है या वृद्धि-गुणक को गलत पढ़ा गया है।", "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਸਾਲਾਨਾ ਵਾਧੇ ਨੂੰ ਰੇਖੀ ਮੰਨਿਆ ਗਿਆ ਹੈ ਜਾਂ ਵਾਧੇ ਦੇ ਗੁਣਕ ਨੂੰ ਗਲਤ ਪੜ੍ਹਿਆ ਗਿਆ ਹੈ।");
  if (id.includes("COPIED") || id.includes("REPORTED")) return localized(locale, "इस विकल्प में प्रश्न में दी गई किसी दूसरी राशि को ही मांगा गया उत्तर मान लिया गया है।", "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਕਿਸੇ ਹੋਰ ਰਕਮ ਨੂੰ ਹੀ ਮੰਗਿਆ ਗਿਆ ਜਵਾਬ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
  return localized(locale, "यह विकल्प वार्षिक चक्रवृद्धि की सही क्रमिक गणना का पालन नहीं करता।", "ਇਹ ਵਿਕਲਪ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀ ਸਹੀ ਕ੍ਰਮਵਾਰ ਗਿਣਤੀ ਦਾ ਪਾਲਣ ਨਹੀਂ ਕਰਦਾ।");
}

function renderLocalizedOptions(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): readonly IntCp003LocalizedOption[] {
  return Object.freeze(source.options.map((option) => Object.freeze({
    text: localizedAnswer(source, option.value, locale),
    value: option.value,
    misconceptionId: option.misconceptionId,
    calculation: feedbackForMisconception(locale, option.misconceptionId),
    studentFeedback: feedbackForMisconception(locale, option.misconceptionId),
    isCorrect: option.isCorrect,
  })));
}

function formulaFor(qlId: IntCp003QlId): string {
  switch (qlId) {
    case "INT-QL-053": return "A=P\\left(1+\\frac{r}{100}\\right)^n";
    case "INT-QL-054": return "CI=P\\left[\\left(1+\\frac{r}{100}\\right)^n-1\\right]";
    case "INT-QL-055": return "P=\\frac{A}{\\left(1+\\frac{r}{100}\\right)^n}";
    case "INT-QL-056": return "P=\\frac{CI}{\\left(1+\\frac{r}{100}\\right)^n-1}";
    case "INT-QL-057": return "\\frac{A}{P}=\\left(1+\\frac{r}{100}\\right)^n";
    case "INT-QL-058": return "\\frac{A}{P}=\\left(1+\\frac{r}{100}\\right)^n";
    case "INT-QL-059": return "I_k=P\\left(1+\\frac{r}{100}\\right)^{k-1}\\frac{r}{100}";
    case "INT-QL-060": return "P=\\frac{I_k}{\\left(1+\\frac{r}{100}\\right)^{k-1}\\frac{r}{100}}";
    case "INT-QL-061": return "I_k=P\\left(1+\\frac{r}{100}\\right)^{k-1}\\frac{r}{100}";
    case "INT-QL-062": return "A_{t-1}=\\frac{A_t}{1+\\frac{r}{100}}";
    case "INT-QL-063": return "r=\\frac{A_t-A_{t-1}}{A_{t-1}}\\times100";
    case "INT-QL-064": return "r=\\frac{A_{t+1}-A_t}{A_t}\\times100,\\quad P=\\frac{A_t}{\\left(1+\\frac{r}{100}\\right)^t}";
    case "INT-QL-065": return "\\Delta A=P\\left[\\left(1+\\frac{r}{100}\\right)^b-\\left(1+\\frac{r}{100}\\right)^a\\right]";
    case "INT-QL-066": return "I_b=I_a\\left(1+\\frac{r}{100}\\right)^{b-a}";
  }
}

function keyIdeaFor(qlId: IntCp003QlId, locale: IntCp003LocalizedLocale): string {
  const compound = cp003Term(locale, "COMPOUND_INTEREST");
  const hindi: Record<IntCp003QlId, string> = {
    "INT-QL-053": "हर वर्ष का ब्याज बढ़ी हुई शेष राशि पर जुड़ता है, इसलिए अंतिम राशि के लिए वार्षिक वृद्धि-गुणक का उपयोग करें।",
    "INT-QL-054": "पहले चक्रवृद्धि राशि का संबंध बनाएं; केवल ब्याज चाहिए तो मूलधन घटाएं।",
    "INT-QL-055": "अंतिम राशि से मूलधन पाने के लिए पूरे वार्षिक वृद्धि-गुणक को उल्टा करें।",
    "INT-QL-056": "दिया गया मान केवल चक्रवृद्धि ब्याज है, इसलिए पहले प्रति रुपये कुल ब्याज-गुणक बनाएं।",
    "INT-QL-057": "अंतिम और प्रारंभिक राशि का अनुपात कई वर्षों के संयुक्त वृद्धि-गुणक के बराबर होता है।",
    "INT-QL-058": "राशि का अनुपात निकालकर देखें कि वार्षिक वृद्धि-गुणक की कौन-सी घात उस अनुपात के बराबर है।",
    "INT-QL-059": "किसी वर्ष का ब्याज उस वर्ष की शुरुआत में मौजूद शेष राशि पर लगता है।",
    "INT-QL-060": "दिए गए वर्ष के ब्याज में उस वर्ष से पहले की सभी वार्षिक वृद्धियां शामिल होती हैं; इन्हें उल्टा करके मूलधन निकालें।",
    "INT-QL-061": "दिए गए वर्ष का ब्याज मूलधन पर सीधे नहीं, उस वर्ष की शुरुआती बढ़ी हुई शेष राशि पर लगता है।",
    "INT-QL-062": "एक वर्ष पीछे जाने के लिए बाद वाली शेष राशि को एक वार्षिक वृद्धि-गुणक से भाग दें।",
    "INT-QL-063": "लगातार दो वर्षांत राशियों का अंतर उस एक वर्ष का ब्याज है और उसका आधार पहले वर्ष की राशि है।",
    "INT-QL-064": "लगातार दो राशियों से पहले एक-वर्ष की दर निकालें, फिर पहले दिए गए वर्ष की राशि से मूलधन तक पीछे जाएं।",
    "INT-QL-065": "दो अवधियों की राशियों का अंतर निकालने के लिए दोनों चक्रवृद्धि राशियां बनाकर घटाएं।",
    "INT-QL-066": "साल-दर-साल ब्याज भी उसी वार्षिक वृद्धि-गुणक से बढ़ता है जिससे शेष राशि बढ़ती है।",
  };
  const punjabi: Record<IntCp003QlId, string> = {
    "INT-QL-053": "ਹਰ ਸਾਲ ਦਾ ਵਿਆਜ ਵਧੀ ਹੋਈ ਬਕਾਇਆ ਰਕਮ ਉੱਤੇ ਜੁੜਦਾ ਹੈ, ਇਸ ਲਈ ਅੰਤਿਮ ਰਕਮ ਲਈ ਸਾਲਾਨਾ ਵਾਧਾ-ਗੁਣਕ ਵਰਤੋ।",
    "INT-QL-054": `ਪਹਿਲਾਂ ${compound} ਵਾਲੀ ਕੁੱਲ ਰਕਮ ਦਾ ਸੰਬੰਧ ਬਣਾਓ; ਸਿਰਫ਼ ਵਿਆਜ ਚਾਹੀਦਾ ਹੋਵੇ ਤਾਂ ਮੂਲਧਨ ਘਟਾਓ।`,
    "INT-QL-055": "ਅੰਤਿਮ ਰਕਮ ਤੋਂ ਮੂਲਧਨ ਲੱਭਣ ਲਈ ਪੂਰੇ ਸਾਲਾਨਾ ਵਾਧਾ-ਗੁਣਕ ਨੂੰ ਉਲਟ ਵਰਤੋ।",
    "INT-QL-056": `ਦਿੱਤਾ ਮੁੱਲ ਸਿਰਫ਼ ${compound} ਹੈ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਪ੍ਰਤੀ ਰੁਪਇਆ ਕੁੱਲ ਵਿਆਜ-ਗੁਣਕ ਬਣਾਓ।`,
    "INT-QL-057": "ਅੰਤਿਮ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਦਾ ਅਨੁਪਾਤ ਕਈ ਸਾਲਾਂ ਦੇ ਮਿਲੇ-ਜੁਲੇ ਵਾਧਾ-ਗੁਣਕ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।",
    "INT-QL-058": "ਰਕਮਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢ ਕੇ ਵੇਖੋ ਕਿ ਸਾਲਾਨਾ ਵਾਧਾ-ਗੁਣਕ ਦੀ ਕਿਹੜੀ ਘਾਤ ਉਸ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੈ।",
    "INT-QL-059": "ਕਿਸੇ ਸਾਲ ਦਾ ਵਿਆਜ ਉਸ ਸਾਲ ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਮੌਜੂਦ ਬਕਾਇਆ ਰਕਮ ਉੱਤੇ ਲੱਗਦਾ ਹੈ।",
    "INT-QL-060": "ਦਿੱਤੇ ਸਾਲ ਦੇ ਵਿਆਜ ਵਿੱਚ ਉਸ ਸਾਲ ਤੋਂ ਪਹਿਲਾਂ ਦੀਆਂ ਸਾਰੀਆਂ ਸਾਲਾਨਾ ਵਾਧੀਆਂ ਸ਼ਾਮਲ ਹੁੰਦੀਆਂ ਹਨ; ਇਨ੍ਹਾਂ ਨੂੰ ਉਲਟ ਕੇ ਮੂਲਧਨ ਕੱਢੋ।",
    "INT-QL-061": "ਦਿੱਤੇ ਸਾਲ ਦਾ ਵਿਆਜ ਮੂਲਧਨ ਉੱਤੇ ਸਿੱਧਾ ਨਹੀਂ, ਉਸ ਸਾਲ ਦੀ ਸ਼ੁਰੂਆਤੀ ਵਧੀ ਹੋਈ ਬਕਾਇਆ ਰਕਮ ਉੱਤੇ ਲੱਗਦਾ ਹੈ।",
    "INT-QL-062": "ਇੱਕ ਸਾਲ ਪਿੱਛੇ ਜਾਣ ਲਈ ਬਾਅਦ ਵਾਲੀ ਬਕਾਇਆ ਰਕਮ ਨੂੰ ਇੱਕ ਸਾਲਾਨਾ ਵਾਧਾ-ਗੁਣਕ ਨਾਲ ਭਾਗ ਦਿਓ।",
    "INT-QL-063": "ਲਗਾਤਾਰ ਦੋ ਸਾਲ-ਅੰਤ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਉਸ ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ ਹੈ ਅਤੇ ਉਸ ਦਾ ਆਧਾਰ ਪਹਿਲੀ ਰਕਮ ਹੈ।",
    "INT-QL-064": "ਲਗਾਤਾਰ ਦੋ ਰਕਮਾਂ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਸਾਲ ਦੀ ਦਰ ਕੱਢੋ, ਫਿਰ ਪਹਿਲੇ ਦਿੱਤੇ ਸਾਲ ਦੀ ਰਕਮ ਤੋਂ ਮੂਲਧਨ ਤੱਕ ਪਿੱਛੇ ਜਾਓ।",
    "INT-QL-065": "ਦੋ ਮਿਆਦਾਂ ਦੀਆਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਕੱਢਣ ਲਈ ਦੋਵੇਂ ਮਿਸ਼ਰਤ ਰਕਮਾਂ ਬਣਾਕੇ ਘਟਾਓ।",
    "INT-QL-066": "ਸਾਲ-ਦਰ-ਸਾਲ ਵਿਆਜ ਵੀ ਉਸੇ ਸਾਲਾਨਾ ਵਾਧਾ-ਗੁਣਕ ਨਾਲ ਵਧਦਾ ਹੈ ਜਿਸ ਨਾਲ ਬਕਾਇਆ ਰਕਮ ਵਧਦੀ ਹੈ।",
  };
  return locale === "hi-IN" ? hindi[qlId] : punjabi[qlId];
}

function workedSteps(source: IntCp003EnglishFrozenQuestion, locale: IntCp003LocalizedLocale): readonly string[] {
  const r = resolve(source.mathematicalState);
  const f = factor(r.ratePercent);
  const qlId = source.qlId;
  const formula = localized(locale, `सूत्र: ${math(formulaFor(qlId))}`, `ਸੂਤਰ: ${math(formulaFor(qlId))}`);
  const factorStep = localized(
    locale,
    `वार्षिक वृद्धि-गुणक: ${math(`1+\\frac{${rateLatex(r.ratePercent).replace(/\\%$/u, "")}}{100}=${rationalLatex(f)}`)}`,
    `ਸਾਲਾਨਾ ਵਾਧਾ-ਗੁਣਕ: ${math(`1+\\frac{${rateLatex(r.ratePercent).replace(/\\%$/u, "")}}{100}=${rationalLatex(f)}`)}`,
  );
  const final = localizedAnswer(source, source.solution, locale);

  switch (qlId) {
    case "INT-QL-053":
      return Object.freeze([formula, factorStep, localized(locale,
        `मान रखने पर ${math(`A=${moneyNumberLatex(r.principal)}\\times\\left(${rationalLatex(f)}\\right)^{${r.years}}=${moneyNumberLatex(r.amount)}`)}।`,
        `ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ ${math(`A=${moneyNumberLatex(r.principal)}\\times\\left(${rationalLatex(f)}\\right)^{${r.years}}=${moneyNumberLatex(r.amount)}`)}।`), localized(locale, `अतः उत्तर ${final} है।`, `ਇਸ ਲਈ ਜਵਾਬ ${final} ਹੈ।`)]);
    case "INT-QL-054":
      return Object.freeze([formula, factorStep, localized(locale,
        `मान रखने पर ${math(`CI=${moneyNumberLatex(r.principal)}\\left[\\left(${rationalLatex(f)}\\right)^{${r.years}}-1\\right]=${moneyNumberLatex(r.compoundInterest)}`)}।`,
        `ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ ${math(`CI=${moneyNumberLatex(r.principal)}\\left[\\left(${rationalLatex(f)}\\right)^{${r.years}}-1\\right]=${moneyNumberLatex(r.compoundInterest)}`)}।`), localized(locale, `अतः उत्तर ${final} है।`, `ਇਸ ਲਈ ਜਵਾਬ ${final} ਹੈ।`)]);
    case "INT-QL-055":
      return Object.freeze([formula, factorStep, localized(locale,
        `पीछे जाने पर ${math(`P=\\frac{${moneyNumberLatex(r.amount)}}{\\left(${rationalLatex(f)}\\right)^{${r.years}}}=${moneyNumberLatex(r.principal)}`)}।`,
        `ਪਿੱਛੇ ਜਾਣ ਉੱਤੇ ${math(`P=\\frac{${moneyNumberLatex(r.amount)}}{\\left(${rationalLatex(f)}\\right)^{${r.years}}}=${moneyNumberLatex(r.principal)}`)}।`), localized(locale, `अतः शुरुआती राशि ${final} थी।`, `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ${final} ਸੀ।`)]);
    case "INT-QL-056": {
      const ciFactor = sub(pow(f, r.years), rat(1));
      return Object.freeze([formula, factorStep, localized(locale,
        `कुल ब्याज-गुणक ${math(`\\left(${rationalLatex(f)}\\right)^{${r.years}}-1=${rationalLatex(ciFactor)}`)} है।`,
        `ਕੁੱਲ ਵਿਆਜ-ਗੁਣਕ ${math(`\\left(${rationalLatex(f)}\\right)^{${r.years}}-1=${rationalLatex(ciFactor)}`)} ਹੈ।`), localized(locale,
        `इसलिए ${math(`P=\\frac{${moneyNumberLatex(r.compoundInterest)}}{${rationalLatex(ciFactor)}}=${moneyNumberLatex(r.principal)}`)}।`,
        `ਇਸ ਲਈ ${math(`P=\\frac{${moneyNumberLatex(r.compoundInterest)}}{${rationalLatex(ciFactor)}}=${moneyNumberLatex(r.principal)}`)}।`), localized(locale, `अतः उत्तर ${final} है।`, `ਇਸ ਲਈ ਜਵਾਬ ${final} ਹੈ।`)]);
    }
    case "INT-QL-057": {
      const ratio = div(r.amount, r.principal);
      return Object.freeze([formula, localized(locale,
        `राशियों का अनुपात ${math(`\\frac{A}{P}=\\frac{${moneyNumberLatex(r.amount)}}{${moneyNumberLatex(r.principal)}}=${rationalLatex(ratio)}`)} है।`,
        `ਰਕਮਾਂ ਦਾ ਅਨੁਪਾਤ ${math(`\\frac{A}{P}=\\frac{${moneyNumberLatex(r.amount)}}{${moneyNumberLatex(r.principal)}}=${rationalLatex(ratio)}`)} ਹੈ।`), localized(locale,
        `दिए गए वर्षों के लिए ${math(`\\left(1+\\frac{${rateLatex(r.ratePercent).replace(/\\%$/u, "")}}{100}\\right)^{${r.years}}=${rationalLatex(ratio)}`)} मिलता है।`,
        `ਦਿੱਤੇ ਸਾਲਾਂ ਲਈ ${math(`\\left(1+\\frac{${rateLatex(r.ratePercent).replace(/\\%$/u, "")}}{100}\\right)^{${r.years}}=${rationalLatex(ratio)}`)} ਮਿਲਦਾ ਹੈ।`), localized(locale, `अतः वार्षिक दर ${final} है।`, `ਇਸ ਲਈ ਸਾਲਾਨਾ ਦਰ ${final} ਹੈ।`)]);
    }
    case "INT-QL-058": {
      const ratio = div(r.amount, r.principal);
      return Object.freeze([formula, factorStep, localized(locale,
        `राशियों से ${math(`\\frac{A}{P}=\\frac{${moneyNumberLatex(r.amount)}}{${moneyNumberLatex(r.principal)}}=${rationalLatex(ratio)}`)} मिलता है।`,
        `ਰਕਮਾਂ ਤੋਂ ${math(`\\frac{A}{P}=\\frac{${moneyNumberLatex(r.amount)}}{${moneyNumberLatex(r.principal)}}=${rationalLatex(ratio)}`)} ਮਿਲਦਾ ਹੈ।`), localized(locale,
        `अब ${math(`\\left(${rationalLatex(f)}\\right)^{${r.years}}=${rationalLatex(ratio)}`)}, इसलिए समय ${final} है।`,
        `ਹੁਣ ${math(`\\left(${rationalLatex(f)}\\right)^{${r.years}}=${rationalLatex(ratio)}`)}, ਇਸ ਲਈ ਸਮਾਂ ${final} ਹੈ।`)]);
    }
    case "INT-QL-059": {
      const opening = amount(r.principal, r.ratePercent, r.targetYear - 1);
      return Object.freeze([formula, factorStep, localized(locale,
        `उस वर्ष की शुरुआती शेष राशि ${math(`${moneyNumberLatex(r.principal)}\\times\\left(${rationalLatex(f)}\\right)^{${r.targetYear - 1}}=${moneyNumberLatex(opening)}`)} है।`,
        `ਉਸ ਸਾਲ ਦੀ ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਰਕਮ ${math(`${moneyNumberLatex(r.principal)}\\times\\left(${rationalLatex(f)}\\right)^{${r.targetYear - 1}}=${moneyNumberLatex(opening)}`)} ਹੈ।`), localized(locale,
        `उस वर्ष का ब्याज ${math(`${moneyNumberLatex(opening)}\\times\\frac{${rateLatex(r.ratePercent).replace(/\\%$/u, "")}}{100}=${moneyNumberLatex(r.nthYearInterest)}`)} है।`,
        `ਉਸ ਸਾਲ ਦਾ ਵਿਆਜ ${math(`${moneyNumberLatex(opening)}\\times\\frac{${rateLatex(r.ratePercent).replace(/\\%$/u, "")}}{100}=${moneyNumberLatex(r.nthYearInterest)}`)} ਹੈ।`), localized(locale, `अतः उत्तर ${final} है।`, `ਇਸ ਲਈ ਜਵਾਬ ${final} ਹੈ।`)]);
    }
    case "INT-QL-060": {
      const divisor = mul(pow(f, r.targetYear - 1), div(r.ratePercent, rat(100)));
      return Object.freeze([formula, factorStep, localized(locale,
        `दिए गए वर्ष का प्रति-रुपया ब्याज-गुणक ${math(`\\left(${rationalLatex(f)}\\right)^{${r.targetYear - 1}}\\times\\frac{${rateLatex(r.ratePercent).replace(/\\%$/u, "")}}{100}=${rationalLatex(divisor)}`)} है।`,
        `ਦਿੱਤੇ ਸਾਲ ਦਾ ਪ੍ਰਤੀ-ਰੁਪਇਆ ਵਿਆਜ-ਗੁਣਕ ${math(`\\left(${rationalLatex(f)}\\right)^{${r.targetYear - 1}}\\times\\frac{${rateLatex(r.ratePercent).replace(/\\%$/u, "")}}{100}=${rationalLatex(divisor)}`)} ਹੈ।`), localized(locale,
        `इसलिए ${math(`P=\\frac{${moneyNumberLatex(r.nthYearInterest)}}{${rationalLatex(divisor)}}=${moneyNumberLatex(r.principal)}`)}।`,
        `ਇਸ ਲਈ ${math(`P=\\frac{${moneyNumberLatex(r.nthYearInterest)}}{${rationalLatex(divisor)}}=${moneyNumberLatex(r.principal)}`)}।`), localized(locale, `अतः उत्तर ${final} है।`, `ਇਸ ਲਈ ਜਵਾਬ ${final} ਹੈ।`)]);
    }
    case "INT-QL-061": {
      const opening = amount(r.principal, r.ratePercent, r.targetYear - 1);
      return Object.freeze([formula, localized(locale,
        `सही दर रखने पर दिए गए वर्ष की शुरुआती शेष राशि ${math(`${moneyNumberLatex(r.principal)}\\times\\left(${rationalLatex(f)}\\right)^{${r.targetYear - 1}}=${moneyNumberLatex(opening)}`)} बनती है।`,
        `ਸਹੀ ਦਰ ਰੱਖਣ ਉੱਤੇ ਦਿੱਤੇ ਸਾਲ ਦੀ ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਰਕਮ ${math(`${moneyNumberLatex(r.principal)}\\times\\left(${rationalLatex(f)}\\right)^{${r.targetYear - 1}}=${moneyNumberLatex(opening)}`)} ਬਣਦੀ ਹੈ।`), localized(locale,
        `फिर ${math(`${moneyNumberLatex(opening)}\\times\\frac{${rateLatex(r.ratePercent).replace(/\\%$/u, "")}}{100}=${moneyNumberLatex(r.nthYearInterest)}`)}, जो दिए गए ब्याज से मेल खाता है।`,
        `ਫਿਰ ${math(`${moneyNumberLatex(opening)}\\times\\frac{${rateLatex(r.ratePercent).replace(/\\%$/u, "")}}{100}=${moneyNumberLatex(r.nthYearInterest)}`)}, ਜੋ ਦਿੱਤੇ ਵਿਆਜ ਨਾਲ ਮਿਲਦਾ ਹੈ।`), localized(locale, `अतः वार्षिक दर ${final} है।`, `ਇਸ ਲਈ ਸਾਲਾਨਾ ਦਰ ${final} ਹੈ।`)]);
    }
    case "INT-QL-062": {
      const previous = div(r.currentAmount, f);
      return Object.freeze([formula, factorStep, localized(locale,
        `एक वर्ष पीछे जाने पर ${math(`A_{t-1}=\\frac{${moneyNumberLatex(r.currentAmount)}}{${rationalLatex(f)}}=${moneyNumberLatex(previous)}`)}।`,
        `ਇੱਕ ਸਾਲ ਪਿੱਛੇ ਜਾਣ ਉੱਤੇ ${math(`A_{t-1}=\\frac{${moneyNumberLatex(r.currentAmount)}}{${rationalLatex(f)}}=${moneyNumberLatex(previous)}`)}।`), localized(locale, `अतः पिछली शेष राशि ${final} थी।`, `ਇਸ ਲਈ ਪਿਛਲੀ ਬਕਾਇਆ ਰਕਮ ${final} ਸੀ।`)]);
    }
    case "INT-QL-063": {
      const opening = amount(r.principal, r.ratePercent, r.currentYear - 1);
      const increase = sub(r.currentAmount, opening);
      return Object.freeze([formula, localized(locale,
        `एक वर्ष में बढ़ी राशि ${math(`${moneyNumberLatex(r.currentAmount)}-${moneyNumberLatex(opening)}=${moneyNumberLatex(increase)}`)} है।`,
        `ਇੱਕ ਸਾਲ ਵਿੱਚ ਵਧੀ ਰਕਮ ${math(`${moneyNumberLatex(r.currentAmount)}-${moneyNumberLatex(opening)}=${moneyNumberLatex(increase)}`)} ਹੈ।`), localized(locale,
        `इसलिए ${math(`r=\\frac{${moneyNumberLatex(increase)}}{${moneyNumberLatex(opening)}}\\times100=${rateLatex(r.ratePercent)}`)}।`,
        `ਇਸ ਲਈ ${math(`r=\\frac{${moneyNumberLatex(increase)}}{${moneyNumberLatex(opening)}}\\times100=${rateLatex(r.ratePercent)}`)}।`), localized(locale, `अतः वार्षिक दर ${final} है।`, `ਇਸ ਲਈ ਸਾਲਾਨਾ ਦਰ ${final} ਹੈ।`)]);
    }
    case "INT-QL-064": {
      const increase = sub(r.nextAmount, r.currentAmount);
      return Object.freeze([formula, localized(locale,
        `लगातार दो राशियों से ${math(`r=\\frac{${moneyNumberLatex(increase)}}{${moneyNumberLatex(r.currentAmount)}}\\times100=${rateLatex(r.ratePercent)}`)}।`,
        `ਲਗਾਤਾਰ ਦੋ ਰਕਮਾਂ ਤੋਂ ${math(`r=\\frac{${moneyNumberLatex(increase)}}{${moneyNumberLatex(r.currentAmount)}}\\times100=${rateLatex(r.ratePercent)}`)}।`), localized(locale,
        `अब ${math(`P=\\frac{${moneyNumberLatex(r.currentAmount)}}{\\left(${rationalLatex(f)}\\right)^{${r.currentYear}}}=${moneyNumberLatex(r.principal)}`)}।`,
        `ਹੁਣ ${math(`P=\\frac{${moneyNumberLatex(r.currentAmount)}}{\\left(${rationalLatex(f)}\\right)^{${r.currentYear}}}=${moneyNumberLatex(r.principal)}`)}।`), localized(locale, `अतः शुरुआती राशि ${final} थी।`, `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ${final} ਸੀ।`)]);
    }
    case "INT-QL-065":
      return Object.freeze([formula, factorStep, localized(locale,
        `पहली राशि ${math(`A_a=${moneyNumberLatex(r.principal)}\\left(${rationalLatex(f)}\\right)^{${r.earlierYear}}=${moneyNumberLatex(r.earlierAmount)}`)} और दूसरी राशि ${math(`A_b=${moneyNumberLatex(r.principal)}\\left(${rationalLatex(f)}\\right)^{${r.laterYear}}=${moneyNumberLatex(r.laterAmount)}`)} है।`,
        `ਪਹਿਲੀ ਰਕਮ ${math(`A_a=${moneyNumberLatex(r.principal)}\\left(${rationalLatex(f)}\\right)^{${r.earlierYear}}=${moneyNumberLatex(r.earlierAmount)}`)} ਅਤੇ ਦੂਜੀ ਰਕਮ ${math(`A_b=${moneyNumberLatex(r.principal)}\\left(${rationalLatex(f)}\\right)^{${r.laterYear}}=${moneyNumberLatex(r.laterAmount)}`)} ਹੈ।`), localized(locale,
        `अंतर ${math(`${moneyNumberLatex(r.laterAmount)}-${moneyNumberLatex(r.earlierAmount)}=${moneyNumberLatex(sub(r.laterAmount, r.earlierAmount))}`)} है।`,
        `ਅੰਤਰ ${math(`${moneyNumberLatex(r.laterAmount)}-${moneyNumberLatex(r.earlierAmount)}=${moneyNumberLatex(sub(r.laterAmount, r.earlierAmount))}`)} ਹੈ।`), localized(locale, `अतः उत्तर ${final} है।`, `ਇਸ ਲਈ ਜਵਾਬ ${final} ਹੈ।`)]);
    case "INT-QL-066": {
      const steps = r.laterYear - r.earlierYear;
      return Object.freeze([formula, factorStep, localized(locale,
        `दोनों वर्षों के बीच ${steps} वार्षिक वृद्धि-चरण हैं, इसलिए ${math(`I_b=${moneyNumberLatex(r.earlierInterest)}\\left(${rationalLatex(f)}\\right)^{${steps}}=${moneyNumberLatex(r.laterInterest)}`)}।`,
        `ਦੋਵੇਂ ਸਾਲਾਂ ਵਿਚਕਾਰ ${steps} ਸਾਲਾਨਾ ਵਾਧੇ ਦੇ ਕਦਮ ਹਨ, ਇਸ ਲਈ ${math(`I_b=${moneyNumberLatex(r.earlierInterest)}\\left(${rationalLatex(f)}\\right)^{${steps}}=${moneyNumberLatex(r.laterInterest)}`)}।`), localized(locale, `अतः बाद वाले वर्ष का ब्याज ${final} है।`, `ਇਸ ਲਈ ਬਾਅਦ ਵਾਲੇ ਸਾਲ ਦਾ ਵਿਆਜ ${final} ਹੈ।`)]);
    }
  }
}

function localizedExplanation(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): IntCp003LocalizedExplanation {
  const steps = workedSteps(source, locale);
  const keyIdea = keyIdeaFor(source.qlId, locale);
  const finalAnswer = localized(locale, `अंतिम उत्तर: ${localizedAnswer(source, source.solution, locale)}`, `ਅੰਤਿਮ ਜਵਾਬ: ${localizedAnswer(source, source.solution, locale)}`);
  [keyIdea, ...steps, finalAnswer].forEach((text, index) => assertCp003LocalizedText(locale, text, `${source.qlId}/${source.seed}/${locale}/explanation-${index}`));

  const examSteps = Object.freeze([steps[0]!, ...steps.slice(Math.max(1, steps.length - 2))]);
  const studentSteps = steps;
  const foundationSteps = steps;
  const shortcut = source.explanation.shortcut
    ? Object.freeze({
        title: localized(locale, "त्वरित विधि", "ਤੇਜ਼ ਤਰੀਕਾ"),
        steps: Object.freeze([localized(locale, "पहले वार्षिक वृद्धि-गुणक पहचानें और फिर केवल आवश्यक घात या उलटी घात का उपयोग करें।", "ਪਹਿਲਾਂ ਸਾਲਾਨਾ ਵਾਧਾ-ਗੁਣਕ ਪਛਾਣੋ ਅਤੇ ਫਿਰ ਸਿਰਫ਼ ਲੋੜੀਂਦੀ ਘਾਤ ਜਾਂ ਉਲਟੀ ਘਾਤ ਵਰਤੋ।")]),
        sourceStepIds: source.explanation.shortcut.sourceStepIds,
      })
    : undefined;
  const commonMistake = source.solutionTrace.commonMistakeKey
    ? feedbackForMisconception(locale, source.solutionTrace.commonMistakeKey)
    : undefined;
  const verification = source.explanation.verification
    ? Object.freeze({
        method: localized(locale, "उत्तर को मूल संबंध में वापस रखकर जाँच", "ਜਵਾਬ ਨੂੰ ਮੂਲ ਸੰਬੰਧ ਵਿੱਚ ਵਾਪਸ ਰੱਖ ਕੇ ਜਾਂਚ"),
        steps: Object.freeze([localized(locale, "प्राप्त मान को मूल चक्रवृद्धि संबंध में रखने पर प्रश्न में दिए गए आंकड़े दोबारा मिलते हैं।", "ਮਿਲਿਆ ਮੁੱਲ ਮੂਲ ਮਿਸ਼ਰਤ-ਵਿਆਜ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖਣ ਉੱਤੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਅੰਕੜੇ ਮੁੜ ਮਿਲਦੇ ਹਨ।")]),
        sourceStepIds: source.explanation.verification.sourceStepIds,
      })
    : undefined;

  return Object.freeze({
    traceVersion: source.explanation.traceVersion,
    methodId: source.explanation.methodId,
    keyIdea,
    steps,
    sourceStepIds: source.explanation.sourceStepIds,
    finalAnswer,
    ...(shortcut ? { shortcut } : {}),
    ...(commonMistake ? { commonMistake } : {}),
    ...(verification ? { verification } : {}),
    depths: Object.freeze({
      exam: Object.freeze({ steps: examSteps, sourceStepIds: source.explanation.depths.exam.sourceStepIds }),
      student: Object.freeze({ steps: studentSteps, sourceStepIds: source.explanation.depths.student.sourceStepIds }),
      foundation: Object.freeze({ steps: foundationSteps, sourceStepIds: source.explanation.depths.foundation.sourceStepIds }),
    }),
  });
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateIntCp003FinalLocalizedQuestionV2(
  qlId: IntCp003QlId,
  seed: string,
  locale: IntCp003LocalizedLocale,
): IntCp003LocalizedQuestion {
  const source = generateIntCp003EnglishFrozenQuestion(qlId, seed);
  const presentation = renderFinalPresentation(source, locale);
  const options = renderLocalizedOptions(source, locale);
  const explanation = localizedExplanation(source, locale);
  const correctAnswer = options[source.correctIndex]!.text;
  const lifecycle = Object.freeze({
    permanentQlId: qlId,
    maturity: "MULTILINGUAL_LOCALISATION_REVIEW" as const,
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED" as const,
    enabled: false as const,
    stagingStatus: "NOT_STAGED" as const,
    registrationStatus: "NOT_REGISTERED" as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  });

  const question: IntCp003LocalizedQuestion = {
    ...source,
    locale,
    language: languageForLocale(locale),
    presentation,
    options,
    correctAnswer,
    explanation,
    editorialStatus: "MULTILINGUAL_LOCALISATION_REVIEW",
    approvalStatus: "LOCALIZED_REVIEW_REQUIRED",
    allocationStatus: "INACTIVE_LOCALISATION_REVIEW",
    lifecycle,
    localization: Object.freeze({
      localizationVersion: INT_CP003_LOCALIZATION_VERSION,
      canonicalLocale: "en-IN",
      canonicalLanguage: "en",
      canonicalFreezeId: source.freezeId,
      canonicalSeed: seed,
      canonicalQlId: qlId,
      locale,
      language: languageForLocale(locale),
      status: "EXECUTABLE_REVIEW_REQUIRED",
      mathematicalStatePreserved: true,
      solutionPreserved: true,
      optionValuesPreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      sourceStepIdsPreserved: true,
      lifecycleLocked: true,
    }),
  };
  return deepFreeze(question);
}

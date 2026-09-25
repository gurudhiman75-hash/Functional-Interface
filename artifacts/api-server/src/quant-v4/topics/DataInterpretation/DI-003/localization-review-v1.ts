import { generateDi003PermanentQuestion } from "./permanent-question-generator";
import type { Di003V2ExamProfile, Di003V2Question, Di003V2Stimulus, Di003V2TaskKind } from "./grouped-bar-v2-types";

export type Di003LocalizationLocale = "hi-IN" | "pa-IN";

export const DI003_LOCALIZATION_REVIEW_ID = "DI-003-HI-PA-REVIEW-V1" as const;

type LocalizedContext = Readonly<{
  hi: Readonly<{ title: string; categories: readonly string[]; seriesA: string; seriesB: string; yAxisLabel: string; unit: string }>;
  pa: Readonly<{ title: string; categories: readonly string[]; seriesA: string; seriesB: string; yAxisLabel: string; unit: string }>;
}>;

const CONTEXTS: Readonly<Record<string, LocalizedContext>> = Object.freeze({
  ANNUAL_SALES: {
    hi: { title: "उत्पाद 1 और उत्पाद 2 की वार्षिक बिक्री", categories: ["2021","2022","2023","2024","2025"], seriesA: "उत्पाद 1", seriesB: "उत्पाद 2", yAxisLabel: "बिक्री (इकाइयाँ)", unit: "इकाइयाँ" },
    pa: { title: "ਉਤਪਾਦ 1 ਅਤੇ ਉਤਪਾਦ 2 ਦੀ ਸਾਲਾਨਾ ਵਿਕਰੀ", categories: ["2021","2022","2023","2024","2025"], seriesA: "ਉਤਪਾਦ 1", seriesB: "ਉਤਪਾਦ 2", yAxisLabel: "ਵਿਕਰੀ (ਇਕਾਈਆਂ)", unit: "ਇਕਾਈਆਂ" },
  },
  MONTHLY_PRODUCTION: {
    hi: { title: "कारखाना 1 और कारखाना 2 का मासिक उत्पादन", categories: ["जनवरी","फरवरी","मार्च","अप्रैल","मई"], seriesA: "कारखाना 1", seriesB: "कारखाना 2", yAxisLabel: "उत्पादन (इकाइयाँ)", unit: "इकाइयाँ" },
    pa: { title: "ਫੈਕਟਰੀ 1 ਅਤੇ ਫੈਕਟਰੀ 2 ਦਾ ਮਹੀਨਾਵਾਰ ਉਤਪਾਦਨ", categories: ["ਜਨਵਰੀ","ਫਰਵਰੀ","ਮਾਰਚ","ਅਪ੍ਰੈਲ","ਮਈ"], seriesA: "ਫੈਕਟਰੀ 1", seriesB: "ਫੈਕਟਰੀ 2", yAxisLabel: "ਉਤਪਾਦਨ (ਇਕਾਈਆਂ)", unit: "ਇਕਾਈਆਂ" },
  },
  TEST_SELECTIONS: {
    hi: { title: "परीक्षा 1 और परीक्षा 2 में चयनित अभ्यर्थी", categories: ["केंद्र 1","केंद्र 2","केंद्र 3","केंद्र 4","केंद्र 5"], seriesA: "परीक्षा 1", seriesB: "परीक्षा 2", yAxisLabel: "चयनित अभ्यर्थी", unit: "अभ्यर्थी" },
    pa: { title: "ਪ੍ਰੀਖਿਆ 1 ਅਤੇ ਪ੍ਰੀਖਿਆ 2 ਵਿੱਚ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰ", categories: ["ਕੇਂਦਰ 1","ਕੇਂਦਰ 2","ਕੇਂਦਰ 3","ਕੇਂਦਰ 4","ਕੇਂਦਰ 5"], seriesA: "ਪ੍ਰੀਖਿਆ 1", seriesB: "ਪ੍ਰੀਖਿਆ 2", yAxisLabel: "ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰ", unit: "ਉਮੀਦਵਾਰ" },
  },
  LIBRARY_ISSUES: {
    hi: { title: "अनुभाग 1 और अनुभाग 2 द्वारा जारी पुस्तकें", categories: ["सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार"], seriesA: "अनुभाग 1", seriesB: "अनुभाग 2", yAxisLabel: "जारी पुस्तकें", unit: "पुस्तकें" },
    pa: { title: "ਭਾਗ 1 ਅਤੇ ਭਾਗ 2 ਵੱਲੋਂ ਜਾਰੀ ਕੀਤੀਆਂ ਕਿਤਾਬਾਂ", categories: ["ਸੋਮਵਾਰ","ਮੰਗਲਵਾਰ","ਬੁੱਧਵਾਰ","ਵੀਰਵਾਰ","ਸ਼ੁੱਕਰਵਾਰ"], seriesA: "ਭਾਗ 1", seriesB: "ਭਾਗ 2", yAxisLabel: "ਜਾਰੀ ਕੀਤੀਆਂ ਕਿਤਾਬਾਂ", unit: "ਕਿਤਾਬਾਂ" },
  },
  TICKET_SALES: {
    hi: { title: "काउंटर 1 और काउंटर 2 द्वारा बेचे गए टिकट", categories: ["दिन 1","दिन 2","दिन 3","दिन 4","दिन 5"], seriesA: "काउंटर 1", seriesB: "काउंटर 2", yAxisLabel: "बेचे गए टिकट", unit: "टिकट" },
    pa: { title: "ਕਾਊਂਟਰ 1 ਅਤੇ ਕਾਊਂਟਰ 2 ਵੱਲੋਂ ਵੇਚੀਆਂ ਟਿਕਟਾਂ", categories: ["ਦਿਨ 1","ਦਿਨ 2","ਦਿਨ 3","ਦਿਨ 4","ਦਿਨ 5"], seriesA: "ਕਾਊਂਟਰ 1", seriesB: "ਕਾਊਂਟਰ 2", yAxisLabel: "ਵੇਚੀਆਂ ਟਿਕਟਾਂ", unit: "ਟਿਕਟਾਂ" },
  },
  PACKAGE_DISPATCH: {
    hi: { title: "गोदाम 1 और गोदाम 2 से भेजे गए पार्सल", categories: ["सप्ताह 1","सप्ताह 2","सप्ताह 3","सप्ताह 4","सप्ताह 5"], seriesA: "गोदाम 1", seriesB: "गोदाम 2", yAxisLabel: "भेजे गए पार्सल", unit: "पार्सल" },
    pa: { title: "ਗੋਦਾਮ 1 ਅਤੇ ਗੋਦਾਮ 2 ਤੋਂ ਭੇਜੇ ਗਏ ਪਾਰਸਲ", categories: ["ਹਫ਼ਤਾ 1","ਹਫ਼ਤਾ 2","ਹਫ਼ਤਾ 3","ਹਫ਼ਤਾ 4","ਹਫ਼ਤਾ 5"], seriesA: "ਗੋਦਾਮ 1", seriesB: "ਗੋਦਾਮ 2", yAxisLabel: "ਭੇਜੇ ਗਏ ਪਾਰਸਲ", unit: "ਪਾਰਸਲ" },
  },
});

function isHindi(locale: Di003LocalizationLocale) {
  return locale === "hi-IN";
}

function contextFor(stimulus: Di003V2Stimulus, locale: Di003LocalizationLocale) {
  const context = CONTEXTS[stimulus.contextId];
  if (!context) throw new Error(`DI-003 localization is missing context '${stimulus.contextId}'.`);
  return isHindi(locale) ? context.hi : context.pa;
}

function surfaceIndex(question: Di003V2Question) {
  const value = Number(question.stemSurfaceId.replace(/^S/u, ""));
  return Number.isInteger(value) && value >= 1 && value <= 3 ? value - 1 : 0;
}

function categoryAt(stimulus: Di003V2Stimulus, locale: Di003LocalizationLocale, index: number) {
  return contextFor(stimulus, locale).categories[index]!;
}

function seriesLabel(stimulus: Di003V2Stimulus, locale: Di003LocalizationLocale, seriesId: unknown) {
  const context = contextFor(stimulus, locale);
  if (seriesId === "SERIES_A") return context.seriesA;
  if (seriesId === "SERIES_B") return context.seriesB;
  throw new Error(`DI-003 localization received unknown series '${String(seriesId)}'.`);
}

function seriesValue(stimulus: Di003V2Stimulus, seriesId: unknown, index: number) {
  const point = stimulus.points[index]!;
  if (seriesId === "SERIES_A") return point.seriesA;
  if (seriesId === "SERIES_B") return point.seriesB;
  throw new Error(`DI-003 localization received unknown series '${String(seriesId)}'.`);
}

function totalForSeries(stimulus: Di003V2Stimulus, seriesId: unknown) {
  return stimulus.points.reduce((sum, point) => sum + (seriesId === "SERIES_A" ? point.seriesA : point.seriesB), 0);
}

function localizeCategoryValue(stimulus: Di003V2Stimulus, locale: Di003LocalizationLocale, value: string) {
  const index = stimulus.categories.indexOf(value);
  return index >= 0 ? categoryAt(stimulus, locale, index) : value;
}

export function localizeDi003Stimulus(stimulus: Di003V2Stimulus, locale: Di003LocalizationLocale) {
  const context = contextFor(stimulus, locale);
  const description = isHindi(locale)
    ? `पाँच श्रेणियों में ${context.seriesA} और ${context.seriesB} के मान दर्शाने वाला समूहित बार ग्राफ; मान स्तंभों की ऊँचाई से दिखाए गए हैं।`
    : `ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ${context.seriesA} ਅਤੇ ${context.seriesB} ਦੇ ਮੁੱਲ ਦਰਸਾਉਂਦਾ ਸਮੂਹਿਤ ਬਾਰ ਗ੍ਰਾਫ਼; ਮੁੱਲ ਸਤੰਭਾਂ ਦੀ ਉਚਾਈ ਨਾਲ ਦਰਸਾਏ ਗਏ ਹਨ।`;
  return {
    ...stimulus,
    title: context.title,
    instruction: isHindi(locale)
      ? "समूहित बार ग्राफ का अध्ययन कीजिए और दिए गए प्रश्नों के उत्तर दीजिए।"
      : "ਸਮੂਹਿਤ ਬਾਰ ਗ੍ਰਾਫ਼ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਦਿੱਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।",
    categories: context.categories,
    series: [
      { id: "SERIES_A" as const, label: context.seriesA },
      { id: "SERIES_B" as const, label: context.seriesB },
    ] as const,
    points: stimulus.points.map((point, index) => ({ ...point, category: context.categories[index]! })),
    yAxisLabel: context.yAxisLabel,
    unit: context.unit,
    description,
  };
}

function localizeOptions(question: Di003V2Question, stimulus: Di003V2Stimulus, locale: Di003LocalizationLocale) {
  if (question.kind === "HIGHEST_CATEGORY_FOR_SERIES" || question.kind === "LOWEST_CATEGORY_FOR_SERIES") {
    return question.options.map((option) => localizeCategoryValue(stimulus, locale, option));
  }
  return [...question.options];
}

function localizedStem(question: Di003V2Question, stimulus: Di003V2Stimulus, locale: Di003LocalizationLocale) {
  const e = question.evidence;
  const hi = isHindi(locale);
  const s = surfaceIndex(question);
  const unit = contextFor(stimulus, locale).unit;

  switch (question.kind) {
    case "DIRECT_BAR_VALUE": {
      const index = Number(e.categoryIndex), label = seriesLabel(stimulus, locale, e.seriesId), category = categoryAt(stimulus, locale, index);
      const h = [`${category} में ${label} का मान कितना है?`, `ग्राफ के अनुसार ${category} में ${label} का मान कितना है?`, `${category} के लिए ${label} का स्तंभ कितना मान दिखाता है?`];
      const p = [`${category} ਵਿੱਚ ${label} ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`, `ਗ੍ਰਾਫ਼ ਅਨੁਸਾਰ ${category} ਵਿੱਚ ${label} ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`, `${category} ਲਈ ${label} ਦਾ ਸਤੰਭ ਕਿੰਨਾ ਮੁੱਲ ਦਰਸਾਉਂਦਾ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "HIGHEST_CATEGORY_FOR_SERIES": {
      const label = seriesLabel(stimulus, locale, e.seriesId);
      const h = [`${label} का मान किस श्रेणी में सबसे अधिक है?`, `${label} के लिए अधिकतम मान किस श्रेणी में है?`, `${label} का सबसे ऊँचा स्तंभ किस श्रेणी का है?`];
      const p = [`${label} ਦਾ ਮੁੱਲ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਹੈ?`, `${label} ਲਈ ਸਭ ਤੋਂ ਵੱਧ ਮੁੱਲ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਹੈ?`, `${label} ਦਾ ਸਭ ਤੋਂ ਉੱਚਾ ਸਤੰਭ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਦਾ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "LOWEST_CATEGORY_FOR_SERIES": {
      const label = seriesLabel(stimulus, locale, e.seriesId);
      const h = [`${label} का मान किस श्रेणी में सबसे कम है?`, `${label} के लिए न्यूनतम मान किस श्रेणी में है?`, `${label} का सबसे छोटा स्तंभ किस श्रेणी का है?`];
      const p = [`${label} ਦਾ ਮੁੱਲ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਸਭ ਤੋਂ ਘੱਟ ਹੈ?`, `${label} ਲਈ ਸਭ ਤੋਂ ਘੱਟ ਮੁੱਲ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਹੈ?`, `${label} ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਸਤੰਭ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਦਾ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "CROSS_SERIES_DIFFERENCE": {
      const category = categoryAt(stimulus, locale, Number(e.categoryIndex)), a = seriesLabel(stimulus, locale, "SERIES_A"), b = seriesLabel(stimulus, locale, "SERIES_B");
      const h = [`${category} में ${a} और ${b} के मानों का अंतर कितना है?`, `${category} में दोनों स्तंभों के मानों में कितना अंतर है?`, `${category} के लिए ${a} और ${b} का निरपेक्ष अंतर ज्ञात कीजिए।`];
      const p = [`${category} ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`, `${category} ਵਿੱਚ ਦੋਵੇਂ ਸਤੰਭਾਂ ਦੇ ਮੁੱਲਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`, `${category} ਲਈ ${a} ਅਤੇ ${b} ਦਾ ਨਿਰਪੇਖ ਅੰਤਰ ਕੱਢੋ।`];
      return (hi ? h : p)[s]!;
    }
    case "COMBINED_CATEGORY_TOTAL": {
      const category = categoryAt(stimulus, locale, Number(e.categoryIndex)), a = seriesLabel(stimulus, locale, "SERIES_A"), b = seriesLabel(stimulus, locale, "SERIES_B");
      const h = [`${category} में ${a} और ${b} का संयुक्त मान कितना है?`, `${category} के दोनों स्तंभों का कुल योग ज्ञात कीजिए।`, `${category} में ${a} और ${b} को मिलाकर कुल मान कितना है?`];
      const p = [`${category} ਵਿੱਚ ${a} ਅਤੇ ${b} ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`, `${category} ਦੇ ਦੋਵੇਂ ਸਤੰਭਾਂ ਦਾ ਕੁੱਲ ਜੋੜ ਕੱਢੋ।`, `${category} ਵਿੱਚ ${a} ਅਤੇ ${b} ਨੂੰ ਮਿਲਾ ਕੇ ਕੁੱਲ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "WITHIN_SERIES_DIFFERENCE": {
      const first = Number(e.firstIndex), second = Number(e.secondIndex), label = seriesLabel(stimulus, locale, e.seriesId), c1 = categoryAt(stimulus, locale, first), c2 = categoryAt(stimulus, locale, second);
      const h = [`${label} के ${c1} और ${c2} के मानों में कितना अंतर है?`, `${label} के लिए ${c1} और ${c2} के मान कितने अलग हैं?`, `${label} के ${c1} और ${c2} स्तंभों का निरपेक्ष अंतर ज्ञात कीजिए।`];
      const p = [`${label} ਦੇ ${c1} ਅਤੇ ${c2} ਦੇ ਮੁੱਲਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`, `${label} ਲਈ ${c1} ਅਤੇ ${c2} ਦੇ ਮੁੱਲ ਕਿੰਨੇ ਵੱਖਰੇ ਹਨ?`, `${label} ਦੇ ${c1} ਅਤੇ ${c2} ਸਤੰਭਾਂ ਦਾ ਨਿਰਪੇਖ ਅੰਤਰ ਕੱਢੋ।`];
      return (hi ? h : p)[s]!;
    }
    case "CATEGORY_RATIO_WITHIN_SERIES": {
      const first = Number(e.firstIndex), second = Number(e.secondIndex), label = seriesLabel(stimulus, locale, e.seriesId), c1 = categoryAt(stimulus, locale, first), c2 = categoryAt(stimulus, locale, second);
      const h = [`${label} में ${c1} और ${c2} के मानों का अनुपात क्या है?`, `${label} के लिए ${c1} : ${c2} के क्रम में सरल अनुपात ज्ञात कीजिए।`, `${label} के ${c1} और ${c2} के मान किस अनुपात में हैं?`];
      const p = [`${label} ਵਿੱਚ ${c1} ਅਤੇ ${c2} ਦੇ ਮੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${label} ਲਈ ${c1} : ${c2} ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਸਰਲ ਅਨੁਪਾਤ ਕੱਢੋ।`, `${label} ਦੇ ${c1} ਅਤੇ ${c2} ਦੇ ਮੁੱਲ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ?`];
      return (hi ? h : p)[s]!;
    }
    case "SERIES_AVERAGE": {
      const label = seriesLabel(stimulus, locale, e.seriesId);
      const h = [`सभी पाँच श्रेणियों में ${label} का औसत मान कितना है?`, `${label} के पाँचों स्तंभों का औसत ज्ञात कीजिए।`, `प्रति श्रेणी ${label} का औसत मान कितना है?`];
      const p = [`ਸਾਰੀਆਂ ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ${label} ਦਾ ਔਸਤ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`, `${label} ਦੇ ਪੰਜਾਂ ਸਤੰਭਾਂ ਦੀ ਔਸਤ ਕੱਢੋ।`, `ਪ੍ਰਤੀ ਸ਼੍ਰੇਣੀ ${label} ਦਾ ਔਸਤ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "COMBINED_CATEGORY_RATIO": {
      const first = Number(e.firstIndex), second = Number(e.secondIndex), c1 = categoryAt(stimulus, locale, first), c2 = categoryAt(stimulus, locale, second);
      const h = [`${c1} और ${c2} के संयुक्त मानों का अनुपात क्या है?`, `दोनों स्तंभ जोड़ने के बाद ${c1} : ${c2} का सरल अनुपात ज्ञात कीजिए।`, `${c1} और ${c2} के संयुक्त कुल किस अनुपात में हैं?`];
      const p = [`${c1} ਅਤੇ ${c2} ਦੇ ਮਿਲੇ ਹੋਏ ਮੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `ਦੋਵੇਂ ਸਤੰਭ ਜੋੜਣ ਤੋਂ ਬਾਅਦ ${c1} : ${c2} ਦਾ ਸਰਲ ਅਨੁਪਾਤ ਕੱਢੋ।`, `${c1} ਅਤੇ ${c2} ਦੇ ਮਿਲੇ ਹੋਏ ਕੁੱਲ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ?`];
      return (hi ? h : p)[s]!;
    }
    case "PERCENT_CHANGE_WITHIN_SERIES": {
      const lower = Number(e.lowerIndex), higher = Number(e.higherIndex), label = seriesLabel(stimulus, locale, "SERIES_A"), c1 = categoryAt(stimulus, locale, lower), c2 = categoryAt(stimulus, locale, higher);
      const h = [`निकटतम पूर्ण प्रतिशत में, ${c2} में ${label} का मान ${c1} की तुलना में कितने प्रतिशत अधिक है?`, `${c1} से ${c2} तक ${label} में लगभग कितने पूर्ण प्रतिशत की वृद्धि हुई?`, `${c2} में ${label} का मान ${c1} की तुलना में कितने प्रतिशत अधिक है? निकटतम पूर्ण प्रतिशत दीजिए।`];
      const p = [`ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ, ${c2} ਵਿੱਚ ${label} ਦਾ ਮੁੱਲ ${c1} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${c1} ਤੋਂ ${c2} ਤੱਕ ${label} ਵਿੱਚ ਲਗਭਗ ਕਿੰਨੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਵਾਧਾ ਹੋਇਆ?`, `${c2} ਵਿੱਚ ${label} ਦਾ ਮੁੱਲ ${c1} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ? ਨਜ਼ਦੀਕੀ ਪੂਰਾ ਪ੍ਰਤੀਸ਼ਤ ਦਿਓ।`];
      return (hi ? h : p)[s]!;
    }
    case "CATEGORY_SHARE_OF_SERIES_TOTAL": {
      const index = Number(e.categoryIndex), label = seriesLabel(stimulus, locale, e.seriesId), category = categoryAt(stimulus, locale, index);
      const h = [`निकटतम पूर्ण प्रतिशत में, ${category} में ${label} का मान ${label} के पाँच-श्रेणी कुल का कितने प्रतिशत है?`, `${label} के कुल में ${category} की हिस्सेदारी लगभग कितने पूर्ण प्रतिशत है?`, `${label} के कुल में ${category} का प्रतिशत हिस्सा निकटतम पूर्ण प्रतिशत में ज्ञात कीजिए।`];
      const p = [`ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ, ${category} ਵਿੱਚ ${label} ਦਾ ਮੁੱਲ ${label} ਦੇ ਪੰਜ-ਸ਼੍ਰੇਣੀ ਕੁੱਲ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `${label} ਦੇ ਕੁੱਲ ਵਿੱਚ ${category} ਦੀ ਹਿੱਸੇਦਾਰੀ ਲਗਭਗ ਕਿੰਨੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `${label} ਦੇ ਕੁੱਲ ਵਿੱਚ ${category} ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਕੱਢੋ।`];
      return (hi ? h : p)[s]!;
    }
    case "TOTAL_SERIES_PERCENT_EXCESS": {
      const a = seriesLabel(stimulus, locale, "SERIES_A"), b = seriesLabel(stimulus, locale, "SERIES_B");
      const h = [`निकटतम पूर्ण प्रतिशत में, ${a} का कुल ${b} के कुल से कितने प्रतिशत अधिक है?`, `${a} का पाँच-श्रेणी कुल, ${b} के कुल से लगभग कितने पूर्ण प्रतिशत अधिक है?`, `${a} का समग्र कुल ${b} के कुल से कितने प्रतिशत अधिक है? निकटतम पूर्ण प्रतिशत दीजिए।`];
      const p = [`ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ, ${a} ਦਾ ਕੁੱਲ ${b} ਦੇ ਕੁੱਲ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${a} ਦਾ ਪੰਜ-ਸ਼੍ਰੇਣੀ ਕੁੱਲ, ${b} ਦੇ ਕੁੱਲ ਨਾਲੋਂ ਲਗਭਗ ਕਿੰਨੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${a} ਦਾ ਸਮੁੱਚਾ ਕੁੱਲ ${b} ਦੇ ਕੁੱਲ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ? ਨਜ਼ਦੀਕੀ ਪੂਰਾ ਪ੍ਰਤੀਸ਼ਤ ਦਿਓ।`];
      return (hi ? h : p)[s]!;
    }
  }
}

function localizedExplanation(question: Di003V2Question, stimulus: Di003V2Stimulus, locale: Di003LocalizationLocale) {
  const e = question.evidence;
  const hi = isHindi(locale);
  const aLabel = seriesLabel(stimulus, locale, "SERIES_A");
  const bLabel = seriesLabel(stimulus, locale, "SERIES_B");
  const pack = (keyHi: string, keyPa: string, stepsHi: string[], stepsPa: string[], workingTable?: { headers: string[]; rows: string[][] }) => ({
    keyIdea: hi ? keyHi : keyPa,
    steps: hi ? stepsHi : stepsPa,
    ...(workingTable ? { workingTable } : {}),
  });

  switch (question.kind) {
    case "DIRECT_BAR_VALUE": {
      const index = Number(e.categoryIndex), label = seriesLabel(stimulus, locale, e.seriesId), category = categoryAt(stimulus, locale, index), value = seriesValue(stimulus, e.seriesId, index);
      return pack("दिए गए श्रेणी में संबंधित शृंखला के स्तंभ की ऊँचाई पढ़ें।","ਦਿੱਤੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਸੰਬੰਧਿਤ ਲੜੀ ਦੇ ਸਤੰਭ ਦੀ ਉਚਾਈ ਪੜ੍ਹੋ।",[`${category} में ${label} का स्तंभ ${value} दिखाता है।`,`अतः उत्तर ${value} है।`],[`${category} ਵਿੱਚ ${label} ਦਾ ਸਤੰਭ ${value} ਦਰਸਾਉਂਦਾ ਹੈ।`,`ਇਸ ਲਈ ਉੱਤਰ ${value} ਹੈ।`]);
    }
    case "HIGHEST_CATEGORY_FOR_SERIES":
    case "LOWEST_CATEGORY_FOR_SERIES": {
      const label = seriesLabel(stimulus, locale, e.seriesId), target = Number(e.categoryIndex), values = stimulus.points.map((_,i)=>`${categoryAt(stimulus,locale,i)}: ${seriesValue(stimulus,e.seriesId,i)}`).join(", "), category = categoryAt(stimulus,locale,target);
      const highest = question.kind === "HIGHEST_CATEGORY_FOR_SERIES";
      return pack(highest?"सभी पाँच स्तंभों की तुलना करके सबसे बड़ा मान चुनें।":"सभी पाँच स्तंभों की तुलना करके सबसे छोटा मान चुनें।",highest?"ਸਾਰੇ ਪੰਜ ਸਤੰਭਾਂ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ ਚੁਣੋ।":"ਸਾਰੇ ਪੰਜ ਸਤੰਭਾਂ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ ਚੁਣੋ।",[`${label} के मान: ${values}।`,`${highest?"सबसे बड़ा":"सबसे छोटा"} मान ${seriesValue(stimulus,e.seriesId,target)} है, इसलिए उत्तर ${category} है।`],[`${label} ਦੇ ਮੁੱਲ: ${values}।`,`${highest?"ਸਭ ਤੋਂ ਵੱਡਾ":"ਸਭ ਤੋਂ ਛੋਟਾ"} ਮੁੱਲ ${seriesValue(stimulus,e.seriesId,target)} ਹੈ, ਇਸ ਲਈ ਉੱਤਰ ${category} ਹੈ।`]);
    }
    case "CROSS_SERIES_DIFFERENCE": {
      const index=Number(e.categoryIndex), p=stimulus.points[index]!, category=categoryAt(stimulus,locale,index), diff=Math.abs(p.seriesA-p.seriesB);
      return pack("एक ही श्रेणी के दोनों स्तंभों के मान पढ़ें और छोटे को बड़े से घटाएँ।","ਇੱਕੋ ਸ਼੍ਰੇਣੀ ਦੇ ਦੋਵੇਂ ਸਤੰਭਾਂ ਦੇ ਮੁੱਲ ਪੜ੍ਹੋ ਅਤੇ ਛੋਟੇ ਨੂੰ ਵੱਡੇ ਵਿੱਚੋਂ ਘਟਾਓ।",[`${category}: ${aLabel} = ${p.seriesA}, ${bLabel} = ${p.seriesB}।`,`अंतर = |${p.seriesA} − ${p.seriesB}| = ${diff}।`],[`${category}: ${aLabel} = ${p.seriesA}, ${bLabel} = ${p.seriesB}।`,`ਅੰਤਰ = |${p.seriesA} − ${p.seriesB}| = ${diff}।`]);
    }
    case "COMBINED_CATEGORY_TOTAL": {
      const index=Number(e.categoryIndex), p=stimulus.points[index]!, category=categoryAt(stimulus,locale,index), total=p.seriesA+p.seriesB;
      return pack("दिए गए श्रेणी के दोनों स्तंभों के मान जोड़ें।","ਦਿੱਤੀ ਸ਼੍ਰੇਣੀ ਦੇ ਦੋਵੇਂ ਸਤੰਭਾਂ ਦੇ ਮੁੱਲ ਜੋੜੋ।",[`${category}: ${p.seriesA} + ${p.seriesB} = ${total}।`,`अतः संयुक्त मान ${total} है।`],[`${category}: ${p.seriesA} + ${p.seriesB} = ${total}।`,`ਇਸ ਲਈ ਮਿਲਿਆ ਹੋਇਆ ਮੁੱਲ ${total} ਹੈ।`]);
    }
    case "WITHIN_SERIES_DIFFERENCE": {
      const i=Number(e.firstIndex),j=Number(e.secondIndex),v1=seriesValue(stimulus,e.seriesId,i),v2=seriesValue(stimulus,e.seriesId,j),label=seriesLabel(stimulus,locale,e.seriesId);
      return pack("एक ही शृंखला के दोनों श्रेणी मान पढ़ें और उनका निरपेक्ष अंतर लें।","ਇੱਕੋ ਲੜੀ ਦੇ ਦੋਵੇਂ ਸ਼੍ਰੇਣੀ ਮੁੱਲ ਪੜ੍ਹੋ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਨਿਰਪੇਖ ਅੰਤਰ ਲਓ।",[`${label}: ${categoryAt(stimulus,locale,i)} = ${v1}, ${categoryAt(stimulus,locale,j)} = ${v2}।`,`अंतर = |${v1} − ${v2}| = ${Math.abs(v1-v2)}।`],[`${label}: ${categoryAt(stimulus,locale,i)} = ${v1}, ${categoryAt(stimulus,locale,j)} = ${v2}।`,`ਅੰਤਰ = |${v1} − ${v2}| = ${Math.abs(v1-v2)}।`]);
    }
    case "CATEGORY_RATIO_WITHIN_SERIES": {
      const i=Number(e.firstIndex),j=Number(e.secondIndex),v1=seriesValue(stimulus,e.seriesId,i),v2=seriesValue(stimulus,e.seriesId,j),label=seriesLabel(stimulus,locale,e.seriesId);
      return pack("प्रश्न में दिए क्रम में दोनों मान लेकर अनुपात सरल करें।","ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਦੋਵੇਂ ਮੁੱਲ ਲੈ ਕੇ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",[`${label}: ${categoryAt(stimulus,locale,i)} = ${v1}, ${categoryAt(stimulus,locale,j)} = ${v2}।`,`${v1}:${v2} = ${question.answer}।`],[`${label}: ${categoryAt(stimulus,locale,i)} = ${v1}, ${categoryAt(stimulus,locale,j)} = ${v2}।`,`${v1}:${v2} = ${question.answer}।`]);
    }
    case "SERIES_AVERAGE": {
      const label=seriesLabel(stimulus,locale,e.seriesId), values=stimulus.points.map((_,i)=>seriesValue(stimulus,e.seriesId,i)), total=values.reduce((x,y)=>x+y,0);
      const headers=hi?["शृंखला कुल","श्रेणियों की संख्या","औसत"]:["ਲੜੀ ਦਾ ਕੁੱਲ","ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਗਿਣਤੀ","ਔਸਤ"];
      return pack("पाँचों मान जोड़ें और पाँच से भाग दें।","ਪੰਜਾਂ ਮੁੱਲ ਜੋੜੋ ਅਤੇ ਪੰਜ ਨਾਲ ਭਾਗ ਦਿਓ।",[`${label}: ${values.join(" + ")} = ${total}।`,`${total} ÷ 5 = ${question.answer}।`],[`${label}: ${values.join(" + ")} = ${total}।`,`${total} ÷ 5 = ${question.answer}।`],{headers,rows:[[String(total),"5",question.answer]]});
    }
    case "COMBINED_CATEGORY_RATIO": {
      const i=Number(e.firstIndex),j=Number(e.secondIndex),p1=stimulus.points[i]!,p2=stimulus.points[j]!,t1=p1.seriesA+p1.seriesB,t2=p2.seriesA+p2.seriesB;
      const headers=hi?["श्रेणी",aLabel,bLabel,"संयुक्त"]:["ਸ਼੍ਰੇਣੀ",aLabel,bLabel,"ਮਿਲਿਆ ਕੁੱਲ"];
      return pack("पहले प्रत्येक श्रेणी में दोनों स्तंभ जोड़ें, फिर दिए क्रम में अनुपात सरल करें।","ਪਹਿਲਾਂ ਹਰ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਦੋਵੇਂ ਸਤੰਭ ਜੋੜੋ, ਫਿਰ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",[`${categoryAt(stimulus,locale,i)}: ${p1.seriesA} + ${p1.seriesB} = ${t1}।`,`${categoryAt(stimulus,locale,j)}: ${p2.seriesA} + ${p2.seriesB} = ${t2}।`,`${t1}:${t2} = ${question.answer}।`],[`${categoryAt(stimulus,locale,i)}: ${p1.seriesA} + ${p1.seriesB} = ${t1}।`,`${categoryAt(stimulus,locale,j)}: ${p2.seriesA} + ${p2.seriesB} = ${t2}।`,`${t1}:${t2} = ${question.answer}।`],{headers,rows:[[categoryAt(stimulus,locale,i),String(p1.seriesA),String(p1.seriesB),String(t1)],[categoryAt(stimulus,locale,j),String(p2.seriesA),String(p2.seriesB),String(t2)]]});
    }
    case "PERCENT_CHANGE_WITHIN_SERIES": {
      const i=Number(e.lowerIndex),j=Number(e.higherIndex),lower=stimulus.points[i]!.seriesA,higher=stimulus.points[j]!.seriesA,diff=higher-lower,label=seriesLabel(stimulus,locale,"SERIES_A");
      const headers=hi?["कम मान","अधिक मान","वृद्धि","वृद्धि प्रतिशत"]:["ਘੱਟ ਮੁੱਲ","ਵੱਧ ਮੁੱਲ","ਵਾਧਾ","ਵਾਧਾ ਪ੍ਰਤੀਸ਼ਤ"];
      return pack("प्रतिशत वृद्धि के लिए वृद्धि को शुरुआती कम मान से भाग दें और 100 से गुणा करें। अंतिम उत्तर निकटतम पूर्ण प्रतिशत में लें।","ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੇ ਲਈ ਵਾਧੇ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਘੱਟ ਮੁੱਲ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ। ਅੰਤਿਮ ਉੱਤਰ ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਲਓ।",[`${label}: वृद्धि = ${higher} − ${lower} = ${diff}।`,`${diff}/${lower} × 100 ≈ ${question.answer}।`],[`${label}: ਵਾਧਾ = ${higher} − ${lower} = ${diff}।`,`${diff}/${lower} × 100 ≈ ${question.answer}।`],{headers,rows:[[String(lower),String(higher),String(diff),question.answer]]});
    }
    case "CATEGORY_SHARE_OF_SERIES_TOTAL": {
      const index=Number(e.categoryIndex),label=seriesLabel(stimulus,locale,e.seriesId),value=seriesValue(stimulus,e.seriesId,index),total=totalForSeries(stimulus,e.seriesId);
      const headers=hi?["श्रेणी मान","शृंखला कुल","हिस्सेदारी"]:["ਸ਼੍ਰੇਣੀ ਮੁੱਲ","ਲੜੀ ਦਾ ਕੁੱਲ","ਹਿੱਸੇਦਾਰੀ"];
      return pack("श्रेणी का मान भाग है और उसी शृंखला का पाँच-श्रेणी कुल पूर्ण है। भाग को पूर्ण से भाग देकर 100 से गुणा करें।","ਸ਼੍ਰੇਣੀ ਦਾ ਮੁੱਲ ਭਾਗ ਹੈ ਅਤੇ ਉਸੇ ਲੜੀ ਦਾ ਪੰਜ-ਸ਼੍ਰੇਣੀ ਕੁੱਲ ਪੂਰਾ ਹੈ। ਭਾਗ ਨੂੰ ਪੂਰੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।",[`${label} कुल = ${stimulus.points.map((_,i)=>seriesValue(stimulus,e.seriesId,i)).join(" + ")} = ${total}।`,`${value}/${total} × 100 ≈ ${question.answer} निकटतम पूर्ण प्रतिशत में।`],[`${label} ਕੁੱਲ = ${stimulus.points.map((_,i)=>seriesValue(stimulus,e.seriesId,i)).join(" + ")} = ${total}।`,`${value}/${total} × 100 ≈ ${question.answer} ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ।`],{headers,rows:[[String(value),String(total),question.answer]]});
    }
    case "TOTAL_SERIES_PERCENT_EXCESS": {
      const totalA=stimulus.points.reduce((s,p)=>s+p.seriesA,0),totalB=stimulus.points.reduce((s,p)=>s+p.seriesB,0),diff=totalA-totalB;
      const headers=hi?[aLabel,bLabel,"अंतर","अधिक प्रतिशत"]:[aLabel,bLabel,"ਅੰਤਰ","ਵੱਧ ਪ੍ਰਤੀਸ਼ਤ"];
      return pack("दोनों शृंखलाओं के कुल निकालें। बड़े और छोटे कुल का अंतर छोटे कुल का प्रतिशत होता है।","ਦੋਵੇਂ ਲੜੀਆਂ ਦੇ ਕੁੱਲ ਕੱਢੋ। ਵੱਡੇ ਅਤੇ ਛੋਟੇ ਕੁੱਲ ਦਾ ਅੰਤਰ ਛੋਟੇ ਕੁੱਲ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਹੁੰਦਾ ਹੈ।",[`${aLabel} कुल = ${totalA}; ${bLabel} कुल = ${totalB}।`,`अंतर = ${totalA} − ${totalB} = ${diff}।`,`${diff}/${totalB} × 100 ≈ ${question.answer} निकटतम पूर्ण प्रतिशत में।`],[`${aLabel} ਕੁੱਲ = ${totalA}; ${bLabel} ਕੁੱਲ = ${totalB}।`,`ਅੰਤਰ = ${totalA} − ${totalB} = ${diff}।`,`${diff}/${totalB} × 100 ≈ ${question.answer} ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ।`],{headers,rows:[[String(totalA),String(totalB),String(diff),question.answer]]});
    }
  }
}

export function localizeDi003Question(source: ReturnType<typeof generateDi003PermanentQuestion>, locale: Di003LocalizationLocale) {
  const localizedOptions = localizeOptions(source.question, source.stimulus, locale);
  const answer = localizedOptions[source.question.correctIndex]!;
  return {
    packageId: "DI-003" as const,
    requestedSeed: source.requestedSeed,
    sourceSeed: source.sourceSeed,
    examProfile: source.examProfile,
    language: locale === "hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationReviewId: DI003_LOCALIZATION_REVIEW_ID,
    localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
    sourceEnglishStatus: "ENGLISH_REVIEW_APPROVED" as const,
    stimulus: localizeDi003Stimulus(source.stimulus, locale),
    question: {
      ...source.question,
      stem: localizedStem(source.question, source.stimulus, locale),
      options: localizedOptions,
      optionMetadata: source.question.optionMetadata.map((option, index) => ({ ...option, text: localizedOptions[index]! })),
      answer,
      explanation: localizedExplanation(source.question, source.stimulus, locale),
    },
    traceability: {
      ...source.traceability,
      reviewStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
      localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
    },
  };
}

export function generateDi003LocalizedReviewQuestion(input: { seed: string; examProfile: Di003V2ExamProfile; taskKind: Di003V2TaskKind; locale: Di003LocalizationLocale }) {
  return localizeDi003Question(
    generateDi003PermanentQuestion({ seed: input.seed, examProfile: input.examProfile, taskKind: input.taskKind }),
    input.locale,
  );
}

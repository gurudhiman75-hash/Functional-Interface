import { generateDi004PermanentQuestion } from "./permanent-question-generator";
import type {
  Di004V2ExamProfile,
  Di004V2Question,
  Di004V2Stimulus,
  Di004V2TaskKind,
} from "./line-v2-types";

export type Di004LocalizationLocale = "hi-IN" | "pa-IN";

export const DI004_LOCALIZATION_REVIEW_ID = "DI-004-HI-PA-REVIEW-V1" as const;

const MONTHS: Readonly<Record<string, Readonly<{ hi: string; pa: string }>>> = Object.freeze({
  Jan: { hi: "जनवरी", pa: "ਜਨਵਰੀ" },
  Feb: { hi: "फरवरी", pa: "ਫ਼ਰਵਰੀ" },
  Mar: { hi: "मार्च", pa: "ਮਾਰਚ" },
  Apr: { hi: "अप्रैल", pa: "ਅਪ੍ਰੈਲ" },
  May: { hi: "मई", pa: "ਮਈ" },
  Jun: { hi: "जून", pa: "ਜੂਨ" },
  Jul: { hi: "जुलाई", pa: "ਜੁਲਾਈ" },
  Aug: { hi: "अगस्त", pa: "ਅਗਸਤ" },
  Sep: { hi: "सितंबर", pa: "ਸਤੰਬਰ" },
  Oct: { hi: "अक्टूबर", pa: "ਅਕਤੂਬਰ" },
  Nov: { hi: "नवंबर", pa: "ਨਵੰਬਰ" },
  Dec: { hi: "दिसंबर", pa: "ਦਸੰਬਰ" },
});

const SERIES_NOUNS: Readonly<Record<string, Readonly<{ hi: string; pa: string }>>> = Object.freeze({
  Company: { hi: "कंपनी", pa: "ਕੰਪਨੀ" },
  Firm: { hi: "फर्म", pa: "ਫਰਮ" },
  Brand: { hi: "ब्रांड", pa: "ਬ੍ਰਾਂਡ" },
  Store: { hi: "स्टोर", pa: "ਸਟੋਰ" },
  Division: { hi: "प्रभाग", pa: "ਡਿਵੀਜ਼ਨ" },
  Enterprise: { hi: "उद्यम", pa: "ਇੰਟਰਪ੍ਰਾਈਜ਼" },
  Factory: { hi: "कारखाना", pa: "ਫੈਕਟਰੀ" },
  Plant: { hi: "संयंत्र", pa: "ਪਲਾਂਟ" },
  Unit: { hi: "इकाई", pa: "ਇਕਾਈ" },
  Workshop: { hi: "कार्यशाला", pa: "ਵਰਕਸ਼ਾਪ" },
  "Production Unit": { hi: "उत्पादन इकाई", pa: "ਉਤਪਾਦਨ ਇਕਾਈ" },
  Seller: { hi: "विक्रेता", pa: "ਵਿਕਰੇਤਾ" },
  Portal: { hi: "पोर्टल", pa: "ਪੋਰਟਲ" },
  Outlet: { hi: "विक्रय केंद्र", pa: "ਵਿਕਰੀ ਕੇਂਦਰ" },
  Platform: { hi: "मंच", pa: "ਪਲੇਟਫਾਰਮ" },
  Website: { hi: "वेबसाइट", pa: "ਵੈੱਬਸਾਈਟ" },
  Institute: { hi: "संस्थान", pa: "ਸੰਸਥਾ" },
  College: { hi: "महाविद्यालय", pa: "ਕਾਲਜ" },
  Academy: { hi: "अकादमी", pa: "ਅਕੈਡਮੀ" },
  Centre: { hi: "केंद्र", pa: "ਕੇਂਦਰ" },
  Campus: { hi: "परिसर", pa: "ਕੈਂਪਸ" },
  School: { hi: "विद्यालय", pa: "ਸਕੂਲ" },
  Exporter: { hi: "निर्यातक", pa: "ਨਿਰਯਾਤਕ" },
  Group: { hi: "समूह", pa: "ਸਮੂਹ" },
  Business: { hi: "व्यवसाय", pa: "ਕਾਰੋਬਾਰ" },
  Service: { hi: "सेवा", pa: "ਸੇਵਾ" },
  Route: { hi: "मार्ग", pa: "ਰੂਟ" },
  Operator: { hi: "संचालक", pa: "ਆਪਰੇਟਰ" },
  Line: { hi: "लाइन", pa: "ਲਾਈਨ" },
  Network: { hi: "नेटवर्क", pa: "ਨੈੱਟਵਰਕ" },
  Carrier: { hi: "वाहक", pa: "ਵਾਹਕ" },
});

type ContextCopy = Readonly<{
  hi: Readonly<{ title: string; yAxis: string; unit: string }>;
  pa: Readonly<{ title: string; yAxis: string; unit: string }>;
}>;

export const DI004_LOCALIZATION_CONTEXTS: Readonly<Record<string, ContextCopy>> = Object.freeze({
  ANNUAL_SALES: {
    hi: { title: "दो इकाइयों की वार्षिक बिक्री", yAxis: "बिक्री", unit: "इकाइयाँ" },
    pa: { title: "ਦੋ ਇਕਾਈਆਂ ਦੀ ਸਾਲਾਨਾ ਵਿਕਰੀ", yAxis: "ਵਿਕਰੀ", unit: "ਇਕਾਈਆਂ" },
  },
  ANNUAL_PRODUCTION: {
    hi: { title: "दो उत्पादन इकाइयों का वार्षिक उत्पादन", yAxis: "उत्पादन", unit: "इकाइयाँ" },
    pa: { title: "ਦੋ ਉਤਪਾਦਨ ਇਕਾਈਆਂ ਦਾ ਸਾਲਾਨਾ ਉਤਪਾਦਨ", yAxis: "ਉਤਪਾਦਨ", unit: "ਇਕਾਈਆਂ" },
  },
  MONTHLY_ORDERS: {
    hi: { title: "दो विक्रेताओं को प्राप्त मासिक ऑर्डर", yAxis: "ऑर्डर", unit: "ऑर्डर" },
    pa: { title: "ਦੋ ਵਿਕਰੇਤਾਵਾਂ ਨੂੰ ਪ੍ਰਾਪਤ ਮਾਸਿਕ ਆਰਡਰ", yAxis: "ਆਰਡਰ", unit: "ਆਰਡਰ" },
  },
  ANNUAL_ENROLMENT: {
    hi: { title: "दो संस्थानों में वार्षिक नामांकन", yAxis: "नामांकित छात्र", unit: "छात्र" },
    pa: { title: "ਦੋ ਸੰਸਥਾਵਾਂ ਵਿੱਚ ਸਾਲਾਨਾ ਦਾਖ਼ਲਾ", yAxis: "ਦਾਖ਼ਲ ਵਿਦਿਆਰਥੀ", unit: "ਵਿਦਿਆਰਥੀ" },
  },
  ANNUAL_EXPORTS: {
    hi: { title: "दो संस्थाओं का वार्षिक निर्यात", yAxis: "निर्यात", unit: "टन" },
    pa: { title: "ਦੋ ਸੰਸਥਾਵਾਂ ਦਾ ਸਾਲਾਨਾ ਨਿਰਯਾਤ", yAxis: "ਨਿਰਯਾਤ", unit: "ਟਨ" },
  },
  MONTHLY_PASSENGERS: {
    hi: { title: "दो सेवाओं में मासिक यात्रियों की संख्या", yAxis: "यात्री", unit: "यात्री" },
    pa: { title: "ਦੋ ਸੇਵਾਵਾਂ ਵਿੱਚ ਮਾਸਿਕ ਯਾਤਰੀਆਂ ਦੀ ਗਿਣਤੀ", yAxis: "ਯਾਤਰੀ", unit: "ਯਾਤਰੀ" },
  },
});

function isHindi(locale: Di004LocalizationLocale) {
  return locale === "hi-IN";
}

function localizePeriod(period: string, locale: Di004LocalizationLocale) {
  const month = MONTHS[period];
  if (!month) return period;
  return isHindi(locale) ? month.hi : month.pa;
}

function stripSeriesSuffix(label: string) {
  return label.replace(/\s+[ABPQXY]$/u, "");
}

function localizeSeriesLabel(label: string, locale: Di004LocalizationLocale, position: 1 | 2) {
  const base = stripSeriesSuffix(label);
  const noun = SERIES_NOUNS[base];
  if (!noun) throw new Error(`DI-004 localization is missing series noun '${base}' from '${label}'.`);
  return `${isHindi(locale) ? noun.hi : noun.pa} ${position}`;
}

function nativeContext(stimulus: Di004V2Stimulus, locale: Di004LocalizationLocale) {
  const item = DI004_LOCALIZATION_CONTEXTS[stimulus.contextId];
  if (!item) throw new Error(`DI-004 localization is missing context '${stimulus.contextId}'.`);
  return isHindi(locale) ? item.hi : item.pa;
}

function labels(stimulus: Di004V2Stimulus, locale: Di004LocalizationLocale) {
  return [
    localizeSeriesLabel(stimulus.series[0].label, locale, 1),
    localizeSeriesLabel(stimulus.series[1].label, locale, 2),
  ] as const;
}

export function localizeDi004Stimulus(stimulus: Di004V2Stimulus, locale: Di004LocalizationLocale) {
  const c = nativeContext(stimulus, locale);
  const [a, b] = labels(stimulus, locale);
  const joiner = isHindi(locale) ? " और " : " ਅਤੇ ";
  return {
    ...stimulus,
    title: `${c.title}: ${a}${joiner}${b}`,
    instruction: isHindi(locale)
      ? "रेखा-ग्राफ का अध्ययन कीजिए और निम्नलिखित प्रश्नों के उत्तर दीजिए।"
      : "ਰੇਖਾ-ਗ੍ਰਾਫ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਹੇਠਾਂ ਦਿੱਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।",
    categories: stimulus.categories.map((period) => localizePeriod(period, locale)),
    series: [
      { id: "SERIES_A" as const, label: a },
      { id: "SERIES_B" as const, label: b },
    ] as const,
    points: stimulus.points.map((point) => ({ ...point, period: localizePeriod(point.period, locale) })),
    yAxisLabel: c.yAxis,
    unitLabel: c.unit,
  };
}

function surfaceIndex(question: Di004V2Question) {
  const n = Number(question.stemSurfaceId.replace(/^S/u, ""));
  return Number.isInteger(n) && n >= 1 && n <= 3 ? n - 1 : 0;
}

function period(stimulus: Di004V2Stimulus, locale: Di004LocalizationLocale, index: number) {
  return localizePeriod(stimulus.points[index]!.period, locale);
}

function series(stimulus: Di004V2Stimulus, locale: Di004LocalizationLocale, code: string) {
  const [a, b] = labels(stimulus, locale);
  return code === "A" ? a : b;
}

function stem(question: Di004V2Question, stimulus: Di004V2Stimulus, locale: Di004LocalizationLocale) {
  const h = isHindi(locale);
  const s = surfaceIndex(question);
  const e = question.evidence;
  const [a, b] = labels(stimulus, locale);

  switch (question.kind) {
    case "CROSS_SERIES_DIFFERENCE": {
      const p = period(stimulus, locale, Number(e.targetIndex));
      const H = [`${p} में ${a} और ${b} के मानों में कितना अंतर है?`, `${p} में ${a} और ${b} के मान कितने अलग हैं?`, `${p} में दोनों रेखाओं के मानों का निरपेक्ष अंतर ज्ञात कीजिए।`];
      const P = [`${p} ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`, `${p} ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲ ਕਿੰਨੇ ਵੱਖਰੇ ਹਨ?`, `${p} ਵਿੱਚ ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਦੇ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`];
      return (h ? H : P)[s]!;
    }
    case "COMBINED_PERIOD_TOTAL": {
      const p = period(stimulus, locale, Number(e.targetIndex));
      const H = [`${p} में ${a} और ${b} का संयुक्त मान कितना है?`, `${p} में दोनों श्रेणियों का कुल ज्ञात कीजिए।`, `${p} में ${a} और ${b} के मानों का योग कितना है?`];
      const P = [`${p} ਵਿੱਚ ${a} ਅਤੇ ${b} ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`, `${p} ਵਿੱਚ ਦੋਵੇਂ ਲੜੀਆਂ ਦਾ ਕੁੱਲ ਕੱਢੋ।`, `${p} ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`];
      return (h ? H : P)[s]!;
    }
    case "FIRST_OVERTAKE_PERIOD": {
      const H = [`शुरुआत में ${b} का मान अधिक था। ${a} पहली बार किस अवधि में ${b} से अधिक हुआ?`, `बाएँ से दाएँ देखते हुए, ${a} ने ${b} को पहली बार किस अवधि में पार किया?`, `उस पहली अवधि की पहचान कीजिए जिसमें पिछली अवधि में कम रहने के बाद ${a} का मान ${b} से अधिक हो गया।`];
      const P = [`ਸ਼ੁਰੂ ਵਿੱਚ ${b} ਦਾ ਮੁੱਲ ਵੱਧ ਸੀ। ${a} ਪਹਿਲੀ ਵਾਰ ਕਿਹੜੀ ਮਿਆਦ ਵਿੱਚ ${b} ਨਾਲੋਂ ਵੱਧ ਹੋਇਆ?`, `ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਵੇਖਦੇ ਹੋਏ, ${a} ਨੇ ${b} ਨੂੰ ਪਹਿਲੀ ਵਾਰ ਕਿਹੜੀ ਮਿਆਦ ਵਿੱਚ ਪਾਰ ਕੀਤਾ?`, `ਉਸ ਪਹਿਲੀ ਮਿਆਦ ਦੀ ਪਛਾਣ ਕਰੋ ਜਿਸ ਵਿੱਚ ਪਿਛਲੀ ਮਿਆਦ ਵਿੱਚ ਘੱਟ ਰਹਿਣ ਤੋਂ ਬਾਅਦ ${a} ਦਾ ਮੁੱਲ ${b} ਨਾਲੋਂ ਵੱਧ ਹੋ ਗਿਆ।`];
      return (h ? H : P)[s]!;
    }
    case "CLOSEST_LINES_PERIOD": {
      const H = [`किस अवधि में ${a} और ${b} के मान एक-दूसरे के सबसे निकट थे?`, `किस अवधि में दोनों श्रेणियों के बीच अंतर सबसे कम था?`, `रेखा-ग्राफ में किस अवधि पर ${a} और ${b} के मानों का निरपेक्ष अंतर न्यूनतम है?`];
      const P = [`ਕਿਹੜੀ ਮਿਆਦ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲ ਇਕ-ਦੂਜੇ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਸਨ?`, `ਕਿਹੜੀ ਮਿਆਦ ਵਿੱਚ ਦੋਵੇਂ ਲੜੀਆਂ ਵਿਚਕਾਰ ਅੰਤਰ ਸਭ ਤੋਂ ਘੱਟ ਸੀ?`, `ਰੇਖਾ-ਗ੍ਰਾਫ ਵਿੱਚ ਕਿਹੜੀ ਮਿਆਦ 'ਤੇ ${a} ਅਤੇ ${b} ਦੇ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਸਭ ਤੋਂ ਘੱਟ ਹੈ?`];
      return (h ? H : P)[s]!;
    }
    case "THREE_PERIOD_AVERAGE": {
      const start = Number(e.startIndex);
      const name = series(stimulus, locale, String(e.seriesCode));
      const p1 = period(stimulus, locale, start), p2 = period(stimulus, locale, start + 1), p3 = period(stimulus, locale, start + 2);
      const H = [`${p1} से ${p3} तक ${name} का लगभग औसत मान कितना है?`, `${p1}, ${p2} और ${p3} में ${name} का लगभग औसत ज्ञात कीजिए।`, `${p1} से ${p3} तक तीन अवधियों में ${name} के मानों का लगभग माध्य कितना है?`];
      const P = [`${p1} ਤੋਂ ${p3} ਤੱਕ ${name} ਦਾ ਲਗਭਗ ਔਸਤ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`, `${p1}, ${p2} ਅਤੇ ${p3} ਵਿੱਚ ${name} ਦਾ ਲਗਭਗ ਔਸਤ ਕੱਢੋ।`, `${p1} ਤੋਂ ${p3} ਤੱਕ ਤਿੰਨ ਮਿਆਦਾਂ ਵਿੱਚ ${name} ਦੇ ਮੁੱਲਾਂ ਦਾ ਲਗਭਗ ਔਸਤ ਕਿੰਨਾ ਹੈ?`];
      return (h ? H : P)[s]!;
    }
    case "CONSECUTIVE_PERCENT_INCREASE": {
      const from = Number(e.fromIndex), to = Number(e.toIndex);
      const name = series(stimulus, locale, String(e.seriesCode));
      const p1 = period(stimulus, locale, from), p2 = period(stimulus, locale, to);
      const H = [`${p1} से ${p2} तक ${name} में लगभग कितने प्रतिशत वृद्धि हुई?`, `${p1} और ${p2} के बीच ${name} का मान बढ़ा। यह वृद्धि लगभग कितने प्रतिशत थी?`, `${p1} के मान को आधार मानकर, ${p2} में ${name} लगभग कितने प्रतिशत बढ़ा?`];
      const P = [`${p1} ਤੋਂ ${p2} ਤੱਕ ${name} ਵਿੱਚ ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਹੋਇਆ?`, `${p1} ਅਤੇ ${p2} ਵਿਚਕਾਰ ${name} ਦਾ ਮੁੱਲ ਵਧਿਆ। ਇਹ ਵਾਧਾ ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਸੀ?`, `${p1} ਦੇ ਮੁੱਲ ਨੂੰ ਆਧਾਰ ਮੰਨ ਕੇ, ${p2} ਵਿੱਚ ${name} ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਧਿਆ?`];
      return (h ? H : P)[s]!;
    }
    case "TWO_PERIOD_SERIES_RATIO": {
      const i = Number(e.firstIndex), j = Number(e.secondIndex), p1 = period(stimulus, locale, i), p2 = period(stimulus, locale, j);
      const H = [`${p1} और ${p2} में ${a} के संयुक्त मान का, इन्हीं अवधियों में ${b} के संयुक्त मान से अनुपात क्या है?`, `${p1} और ${p2} में पहले ${a} के मान जोड़ें और फिर ${b} के। दोनों योगों का अनुपात क्या है?`, `${p1} और ${p2} को साथ लेकर ${a} : ${b} ज्ञात कीजिए।`];
      const P = [`${p1} ਅਤੇ ${p2} ਵਿੱਚ ${a} ਦੇ ਮਿਲੇ ਮੁੱਲ ਦਾ, ਇਨ੍ਹਾਂ ਹੀ ਮਿਆਦਾਂ ਵਿੱਚ ${b} ਦੇ ਮਿਲੇ ਮੁੱਲ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${p1} ਅਤੇ ${p2} ਵਿੱਚ ਪਹਿਲਾਂ ${a} ਦੇ ਮੁੱਲ ਜੋੜੋ ਅਤੇ ਫਿਰ ${b} ਦੇ। ਦੋਵੇਂ ਜੋੜਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${p1} ਅਤੇ ${p2} ਨੂੰ ਇਕੱਠੇ ਲੈ ਕੇ ${a} : ${b} ਕੱਢੋ।`];
      return (h ? H : P)[s]!;
    }
    case "TWO_PERIOD_COMBINED_TOTAL": {
      const i = Number(e.firstIndex), j = Number(e.secondIndex), p1 = period(stimulus, locale, i), p2 = period(stimulus, locale, j);
      const H = [`${p1} और ${p2} में दोनों श्रेणियों का कुल कितना है?`, `${p1} और ${p2} में ${a} तथा ${b} के सभी मानों का संयुक्त कुल ज्ञात कीजिए।`, `${p1} और ${p2} के चारों प्रदर्शित मानों को जोड़ने पर कुल कितना होगा?`];
      const P = [`${p1} ਅਤੇ ${p2} ਵਿੱਚ ਦੋਵੇਂ ਲੜੀਆਂ ਦਾ ਕੁੱਲ ਕਿੰਨਾ ਹੈ?`, `${p1} ਅਤੇ ${p2} ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੇ ਸਾਰੇ ਮੁੱਲਾਂ ਦਾ ਮਿਲਿਆ ਕੁੱਲ ਕੱਢੋ।`, `${p1} ਅਤੇ ${p2} ਦੇ ਚਾਰੇ ਦਿਖਾਏ ਮੁੱਲ ਜੋੜਨ 'ਤੇ ਕੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`];
      return (h ? H : P)[s]!;
    }
    case "TOTAL_SERIES_RATIO": {
      const H = [`सभी छह अवधियों में ${a} के कुल का ${b} के कुल से अनुपात क्या है?`, `दोनों श्रेणियों की छहों अवधियों के मान अलग-अलग जोड़कर ${a} : ${b} ज्ञात कीजिए।`, `पूरे ग्राफ में ${a} और ${b} के कुल किस अनुपात में हैं?`];
      const P = [`ਸਾਰੀਆਂ ਛੇ ਮਿਆਦਾਂ ਵਿੱਚ ${a} ਦੇ ਕੁੱਲ ਦਾ ${b} ਦੇ ਕੁੱਲ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `ਦੋਵੇਂ ਲੜੀਆਂ ਦੀਆਂ ਛੇ ਮਿਆਦਾਂ ਦੇ ਮੁੱਲ ਵੱਖ-ਵੱਖ ਜੋੜ ਕੇ ${a} : ${b} ਕੱਢੋ।`, `ਪੂਰੇ ਗ੍ਰਾਫ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੇ ਕੁੱਲ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ?`];
      return (h ? H : P)[s]!;
    }
    case "COMBINED_PERIOD_PERCENT_EXCESS": {
      const large = Number(e.largerIndex), small = Number(e.smallerIndex), pL = period(stimulus, locale, large), pS = period(stimulus, locale, small);
      const H = [`${pL} में दोनों श्रेणियों का संयुक्त मान, ${pS} के संयुक्त मान से लगभग कितने प्रतिशत अधिक है?`, `${pL} का दोनों श्रेणियों का कुल, ${pS} के कुल से लगभग कितने प्रतिशत अधिक है?`, `${pS} के संयुक्त मान को आधार मानकर, ${pL} का संयुक्त मान लगभग कितने प्रतिशत अधिक है?`];
      const P = [`${pL} ਵਿੱਚ ਦੋਵੇਂ ਲੜੀਆਂ ਦਾ ਮਿਲਿਆ ਮੁੱਲ, ${pS} ਦੇ ਮਿਲੇ ਮੁੱਲ ਨਾਲੋਂ ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${pL} ਵਿੱਚ ਦੋਵੇਂ ਲੜੀਆਂ ਦਾ ਕੁੱਲ, ${pS} ਦੇ ਕੁੱਲ ਨਾਲੋਂ ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${pS} ਦੇ ਮਿਲੇ ਮੁੱਲ ਨੂੰ ਆਧਾਰ ਮੰਨ ਕੇ, ${pL} ਦਾ ਮਿਲਿਆ ਮੁੱਲ ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`];
      return (h ? H : P)[s]!;
    }
    case "TOTAL_SERIES_PERCENT_EXCESS": {
      const totalA = Number(e.totalA), totalB = Number(e.totalB);
      const larger = totalA > totalB ? a : b, smaller = totalA > totalB ? b : a;
      const H = [`सभी छह अवधियों में ${larger} का कुल, ${smaller} के कुल से लगभग कितने प्रतिशत अधिक है?`, `${larger} की छह-अवधि का कुल, ${smaller} की छह-अवधि के कुल से लगभग कितने प्रतिशत अधिक है?`, `${smaller} के छह-अवधि कुल को आधार मानकर, ${larger} के कुल की लगभग प्रतिशत अधिकता ज्ञात कीजिए।`];
      const P = [`ਸਾਰੀਆਂ ਛੇ ਮਿਆਦਾਂ ਵਿੱਚ ${larger} ਦਾ ਕੁੱਲ, ${smaller} ਦੇ ਕੁੱਲ ਨਾਲੋਂ ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${larger} ਦੀਆਂ ਛੇ ਮਿਆਦਾਂ ਦਾ ਕੁੱਲ, ${smaller} ਦੀਆਂ ਛੇ ਮਿਆਦਾਂ ਦੇ ਕੁੱਲ ਨਾਲੋਂ ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${smaller} ਦੇ ਛੇ-ਮਿਆਦੀ ਕੁੱਲ ਨੂੰ ਆਧਾਰ ਮੰਨ ਕੇ, ${larger} ਦੇ ਕੁੱਲ ਦੀ ਲਗਭਗ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੂਤਾ ਕੱਢੋ।`];
      return (h ? H : P)[s]!;
    }
    case "THREE_VS_THREE_RATIO": {
      const aIdx = [Number(e.a1), Number(e.a2), Number(e.a3)];
      const bIdx = [Number(e.b1), Number(e.b2), Number(e.b3)];
      const ap = aIdx.map((i) => period(stimulus, locale, i)).join(", ");
      const bp = bIdx.map((i) => period(stimulus, locale, i)).join(", ");
      const H = [`${ap} में ${a} के कुल का, ${bp} में ${b} के कुल से अनुपात क्या है?`, `${ap} में ${a} के मान जोड़ें और ${bp} में ${b} के मान जोड़ें। इन दोनों योगों का अनुपात ज्ञात कीजिए।`, `${a} के ${ap} के योग का ${b} के ${bp} के योग से अनुपात क्या है?`];
      const P = [`${ap} ਵਿੱਚ ${a} ਦੇ ਕੁੱਲ ਦਾ, ${bp} ਵਿੱਚ ${b} ਦੇ ਕੁੱਲ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${ap} ਵਿੱਚ ${a} ਦੇ ਮੁੱਲ ਜੋੜੋ ਅਤੇ ${bp} ਵਿੱਚ ${b} ਦੇ ਮੁੱਲ ਜੋੜੋ। ਇਨ੍ਹਾਂ ਦੋਵੇਂ ਜੋੜਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`, `${a} ਦੇ ${ap} ਦੇ ਜੋੜ ਦਾ ${b} ਦੇ ${bp} ਦੇ ਜੋੜ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`];
      return (h ? H : P)[s]!;
    }
  }
}

function localizeCategorical(text: string, locale: Di004LocalizationLocale) {
  return localizePeriod(text, locale);
}

function explanation(question: Di004V2Question, stimulus: Di004V2Stimulus, locale: Di004LocalizationLocale) {
  const h = isHindi(locale);
  const e = question.evidence;
  const [a, b] = labels(stimulus, locale);
  const A = stimulus.points.map((p) => p.seriesA);
  const B = stimulus.points.map((p) => p.seriesB);
  const totalA = A.reduce((sum, n) => sum + n, 0);
  const totalB = B.reduce((sum, n) => sum + n, 0);

  switch (question.kind) {
    case "CROSS_SERIES_DIFFERENCE": {
      const i = Number(e.targetIndex), d = Math.abs(A[i]! - B[i]!), p = period(stimulus, locale, i);
      return { keyIdea: h ? "एक ही अवधि में दोनों रेखाओं के मान पढ़कर बड़े मान में से छोटा मान घटाएँ।" : "ਇੱਕੋ ਮਿਆਦ ਵਿੱਚ ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਦੇ ਮੁੱਲ ਪੜ੍ਹ ਕੇ ਵੱਡੇ ਮੁੱਲ ਵਿਚੋਂ ਛੋਟਾ ਮੁੱਲ ਘਟਾਓ।", steps: [`${p}: ${a} = ${A[i]}, ${b} = ${B[i]}।`, h ? `अंतर = |${A[i]} - ${B[i]}| = ${d}।` : `ਅੰਤਰ = |${A[i]} - ${B[i]}| = ${d}।`] };
    }
    case "COMBINED_PERIOD_TOTAL": {
      const i = Number(e.targetIndex), n = A[i]! + B[i]!, p = period(stimulus, locale, i);
      return { keyIdea: h ? "मांगी गई अवधि में दोनों रेखाओं के मान जोड़ें।" : "ਪੁੱਛੀ ਗਈ ਮਿਆਦ ਵਿੱਚ ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਦੇ ਮੁੱਲ ਜੋੜੋ।", steps: [`${p}: ${a} = ${A[i]}, ${b} = ${B[i]}।`, h ? `संयुक्त मान = ${A[i]} + ${B[i]} = ${n}।` : `ਮਿਲਿਆ ਮੁੱਲ = ${A[i]} + ${B[i]} = ${n}।`] };
    }
    case "FIRST_OVERTAKE_PERIOD": {
      const i = Number(e.overtakeIndex), prev = i - 1, p0 = period(stimulus, locale, prev), p1 = period(stimulus, locale, i);
      return { keyIdea: h ? "वह पहली अवधि देखें जहाँ पहली रेखा पिछली अवधि में नीचे होने के बाद दूसरी रेखा से ऊपर हो जाती है।" : "ਉਹ ਪਹਿਲੀ ਮਿਆਦ ਵੇਖੋ ਜਿੱਥੇ ਪਹਿਲੀ ਰੇਖਾ ਪਿਛਲੀ ਮਿਆਦ ਵਿੱਚ ਹੇਠਾਂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਦੂਜੀ ਰੇਖਾ ਤੋਂ ਉੱਪਰ ਹੋ ਜਾਂਦੀ ਹੈ।", steps: [`${p0}: ${a} = ${A[prev]}, ${b} = ${B[prev]}, इसलिए ${a} कम है।`, h ? `${p1}: ${a} = ${A[i]}, ${b} = ${B[i]}, इसलिए पहली बार ${a} अधिक हो गया।` : `${p1}: ${a} = ${A[i]}, ${b} = ${B[i]}, ਇਸ ਲਈ ਪਹਿਲੀ ਵਾਰ ${a} ਵੱਧ ਹੋ ਗਿਆ।`] };
    }
    case "CLOSEST_LINES_PERIOD": {
      const gaps = A.map((v, i) => Math.abs(v - B[i]!)), i = Number(e.closestIndex), min = gaps[i]!;
      return { keyIdea: h ? "हर अवधि में दोनों रेखाओं का निरपेक्ष अंतर निकालें और सबसे छोटा अंतर चुनें।" : "ਹਰ ਮਿਆਦ ਵਿੱਚ ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ ਅਤੇ ਸਭ ਤੋਂ ਛੋਟਾ ਅੰਤਰ ਚੁਣੋ।", steps: [h ? `छह अंतर = ${gaps.join(", ")}।` : `ਛੇ ਅੰਤਰ = ${gaps.join(", ")}।`, h ? `सबसे छोटा अंतर ${min} है, जो ${period(stimulus, locale, i)} में है।` : `ਸਭ ਤੋਂ ਛੋਟਾ ਅੰਤਰ ${min} ਹੈ, ਜੋ ${period(stimulus, locale, i)} ਵਿੱਚ ਹੈ।`], workingTable: { headers: h ? ["अवधि", "अंतर"] : ["ਮਿਆਦ", "ਅੰਤਰ"], rows: stimulus.points.map((_, idx) => [period(stimulus, locale, idx), String(gaps[idx]!)]) } };
    }
    case "THREE_PERIOD_AVERAGE": {
      const start = Number(e.startIndex), code = String(e.seriesCode), vals = (code === "A" ? A : B).slice(start, start + 3), sum = vals.reduce((x, y) => x + y, 0), name = series(stimulus, locale, code);
      return { keyIdea: h ? "एक ही श्रेणी के मांगे गए तीन मान जोड़ें और 3 से भाग दें।" : "ਇੱਕੋ ਲੜੀ ਦੇ ਪੁੱਛੇ ਗਏ ਤਿੰਨ ਮੁੱਲ ਜੋੜੋ ਅਤੇ 3 ਨਾਲ ਭਾਗ ਦਿਓ।", steps: [`${name}: ${vals.join(" + ")} = ${sum}।`, h ? `औसत = ${sum}/3 ≈ ${question.answer}।` : `ਔਸਤ = ${sum}/3 ≈ ${question.answer}।`] };
    }
    case "CONSECUTIVE_PERCENT_INCREASE": {
      const from = Number(e.fromIndex), to = Number(e.toIndex), code = String(e.seriesCode), vals = code === "A" ? A : B, oldV = vals[from]!, newV = vals[to]!, diff = newV - oldV;
      return { keyIdea: h ? "वृद्धि निकालकर उसे पहले वाले मान से भाग दें और 100 से गुणा करें।" : "ਵਾਧਾ ਕੱਢ ਕੇ ਉਸ ਨੂੰ ਪਹਿਲੇ ਮੁੱਲ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।", steps: [h ? `वृद्धि = ${newV} - ${oldV} = ${diff}।` : `ਵਾਧਾ = ${newV} - ${oldV} = ${diff}।`, h ? `प्रतिशत वृद्धि = ${diff}/${oldV} × 100 ≈ ${question.answer}।` : `ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ = ${diff}/${oldV} × 100 ≈ ${question.answer}।`] };
    }
    case "TWO_PERIOD_SERIES_RATIO": {
      const i = Number(e.firstIndex), j = Number(e.secondIndex), x = A[i]! + A[j]!, y = B[i]! + B[j]!;
      return { keyIdea: h ? "दोनों अवधियों में प्रत्येक श्रेणी का अलग योग निकालें, फिर दोनों योगों का अनुपात सरल करें।" : "ਦੋਵੇਂ ਮਿਆਦਾਂ ਵਿੱਚ ਹਰ ਲੜੀ ਦਾ ਵੱਖਰਾ ਜੋੜ ਕੱਢੋ, ਫਿਰ ਦੋਵੇਂ ਜੋੜਾਂ ਦਾ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।", steps: [`${a}: ${A[i]} + ${A[j]} = ${x}।`, `${b}: ${B[i]} + ${B[j]} = ${y}।`, `${x}:${y} = ${question.answer}।`] };
    }
    case "TWO_PERIOD_COMBINED_TOTAL": {
      const i = Number(e.firstIndex), j = Number(e.secondIndex), x = A[i]! + B[i]!, y = A[j]! + B[j]!;
      return { keyIdea: h ? "दोनों अवधियों में पहले दोनों श्रेणियों के मान जोड़ें, फिर दोनों अवधि-कुल जोड़ें।" : "ਦੋਵੇਂ ਮਿਆਦਾਂ ਵਿੱਚ ਪਹਿਲਾਂ ਦੋਵੇਂ ਲੜੀਆਂ ਦੇ ਮੁੱਲ ਜੋੜੋ, ਫਿਰ ਦੋਵੇਂ ਮਿਆਦ-ਕੁੱਲ ਜੋੜੋ।", steps: [`${period(stimulus, locale, i)}: ${A[i]} + ${B[i]} = ${x}।`, `${period(stimulus, locale, j)}: ${A[j]} + ${B[j]} = ${y}।`, h ? `आवश्यक कुल = ${x} + ${y} = ${x + y}।` : `ਲੋੜੀਂਦਾ ਕੁੱਲ = ${x} + ${y} = ${x + y}।`] };
    }
    case "TOTAL_SERIES_RATIO": {
      return { keyIdea: h ? "दोनों रेखाओं की छहों अवधियों के मान अलग-अलग जोड़ें और कुलों का अनुपात सरल करें।" : "ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਦੀਆਂ ਛੇ ਮਿਆਦਾਂ ਦੇ ਮੁੱਲ ਵੱਖ-ਵੱਖ ਜੋੜੋ ਅਤੇ ਕੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।", steps: [`${a}: ${A.join(" + ")} = ${totalA}।`, `${b}: ${B.join(" + ")} = ${totalB}।`, `${totalA}:${totalB} = ${question.answer}।`], workingTable: { headers: h ? ["श्रेणी", "छह-अवधि कुल"] : ["ਲੜੀ", "ਛੇ-ਮਿਆਦੀ ਕੁੱਲ"], rows: [[a, String(totalA)], [b, String(totalB)]] } };
    }
    case "COMBINED_PERIOD_PERCENT_EXCESS": {
      const large = Number(e.largerIndex), small = Number(e.smallerIndex), big = A[large]! + B[large]!, little = A[small]! + B[small]!, d = big - little;
      return { keyIdea: h ? "पहले दोनों अवधियों के संयुक्त कुल निकालें, फिर अंतर को छोटे कुल से भाग देकर 100 से गुणा करें।" : "ਪਹਿਲਾਂ ਦੋਵੇਂ ਮਿਆਦਾਂ ਦੇ ਮਿਲੇ ਕੁੱਲ ਕੱਢੋ, ਫਿਰ ਅੰਤਰ ਨੂੰ ਛੋਟੇ ਕੁੱਲ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।", steps: [`${period(stimulus, locale, large)} = ${big}; ${period(stimulus, locale, small)} = ${little}।`, h ? `अंतर = ${big} - ${little} = ${d}।` : `ਅੰਤਰ = ${big} - ${little} = ${d}।`, h ? `प्रतिशत अधिक = ${d}/${little} × 100 ≈ ${question.answer}।` : `ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ = ${d}/${little} × 100 ≈ ${question.answer}।`] };
    }
    case "TOTAL_SERIES_PERCENT_EXCESS": {
      const big = Math.max(totalA, totalB), small = Math.min(totalA, totalB), d = big - small;
      return { keyIdea: h ? "दोनों श्रेणियों के छह-अवधि कुल निकालें, अंतर ज्ञात करें और छोटे कुल को आधार बनाएं।" : "ਦੋਵੇਂ ਲੜੀਆਂ ਦੇ ਛੇ-ਮਿਆਦੀ ਕੁੱਲ ਕੱਢੋ, ਅੰਤਰ ਕੱਢੋ ਅਤੇ ਛੋਟੇ ਕੁੱਲ ਨੂੰ ਆਧਾਰ ਬਣਾਓ।", steps: [`${a} = ${totalA}; ${b} = ${totalB}।`, h ? `अंतर = ${big} - ${small} = ${d}।` : `ਅੰਤਰ = ${big} - ${small} = ${d}।`, h ? `प्रतिशत अधिक = ${d}/${small} × 100 ≈ ${question.answer}।` : `ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ = ${d}/${small} × 100 ≈ ${question.answer}।`] };
    }
    case "THREE_VS_THREE_RATIO": {
      const ai = [Number(e.a1), Number(e.a2), Number(e.a3)], bi = [Number(e.b1), Number(e.b2), Number(e.b3)];
      const x = ai.reduce((sum, i) => sum + A[i]!, 0), y = bi.reduce((sum, i) => sum + B[i]!, 0);
      return { keyIdea: h ? "पहली श्रेणी के दिए गए तीन मान और दूसरी श्रेणी के दिए गए तीन मान अलग-अलग जोड़ें, फिर अनुपात सरल करें।" : "ਪਹਿਲੀ ਲੜੀ ਦੇ ਦਿੱਤੇ ਤਿੰਨ ਮੁੱਲ ਅਤੇ ਦੂਜੀ ਲੜੀ ਦੇ ਦਿੱਤੇ ਤਿੰਨ ਮੁੱਲ ਵੱਖ-ਵੱਖ ਜੋੜੋ, ਫਿਰ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।", steps: [`${a}: ${ai.map((i) => A[i]!).join(" + ")} = ${x}।`, `${b}: ${bi.map((i) => B[i]!).join(" + ")} = ${y}।`, `${x}:${y} = ${question.answer}।`], workingTable: { headers: h ? ["समूह", "अवधियाँ", "कुल"] : ["ਸਮੂਹ", "ਮਿਆਦਾਂ", "ਕੁੱਲ"], rows: [[a, ai.map((i) => period(stimulus, locale, i)).join(", "), String(x)], [b, bi.map((i) => period(stimulus, locale, i)).join(", "), String(y)]] } };
    }
  }
}

export function localizeDi004Question(source: ReturnType<typeof generateDi004PermanentQuestion>, locale: Di004LocalizationLocale) {
  const localizedOptions = source.question.options.map((option) => localizeCategorical(option, locale));
  const localizedAnswer = localizeCategorical(source.question.answer, locale);
  return {
    packageId: "DI-004" as const,
    requestedSeed: source.requestedSeed,
    sourceSeed: source.sourceSeed,
    examProfile: source.examProfile,
    language: locale === "hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationReviewId: DI004_LOCALIZATION_REVIEW_ID,
    localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
    sourceEnglishStatus: "ENGLISH_REVIEW_APPROVED" as const,
    stimulus: localizeDi004Stimulus(source.stimulus, locale),
    question: {
      ...source.question,
      stem: stem(source.question, source.stimulus, locale),
      options: localizedOptions,
      answer: localizedAnswer,
      explanation: explanation(source.question, source.stimulus, locale),
    },
    validation: source.validation,
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

export function generateDi004LocalizedReviewQuestion(input: {
  seed: string;
  examProfile: Di004V2ExamProfile;
  taskKind: Di004V2TaskKind;
  locale: Di004LocalizationLocale;
}) {
  return localizeDi004Question(
    generateDi004PermanentQuestion({ seed: input.seed, examProfile: input.examProfile, taskKind: input.taskKind }),
    input.locale,
  );
}

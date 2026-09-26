import { generateDi005PermanentQuestion } from "./permanent-question-generator";
import type { Di005V2ExamProfile, Di005V2Question, Di005V2Stimulus, Di005V2TaskKind } from "./pie-v2-types";

export type Di005LocalizationLocale = "hi-IN" | "pa-IN";

export const DI005_LOCALIZATION_REVIEW_ID = "DI-005-HI-PA-REVIEW-V1" as const;

type LocalizedContext = Readonly<{
  hi: Readonly<{
    title: string;
    categories: readonly string[];
    totalLabel: string;
    unit: string;
    description: string;
  }>;
  pa: Readonly<{
    title: string;
    categories: readonly string[];
    totalLabel: string;
    unit: string;
    description: string;
  }>;
}>;

export const DI005_LOCALIZATION_CONTEXTS: Readonly<Record<string, LocalizedContext>> = Object.freeze({
  COURSE_ENROLMENT: {
    hi: {
      title: "पाँच पाठ्यक्रमों में छात्रों का वितरण",
      categories: ["पाठ्यक्रम 1", "पाठ्यक्रम 2", "पाठ्यक्रम 3", "पाठ्यक्रम 4", "पाठ्यक्रम 5"],
      totalLabel: "कुल छात्र",
      unit: "छात्र",
      description: "पाँच पाठ्यक्रमों में छात्रों का वितरण दिखाने वाला पाई चार्ट। एक भाग का प्रतिशत प्रश्न चिह्न से दिखाया गया है।",
    },
    pa: {
      title: "ਪੰਜ ਕੋਰਸਾਂ ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਵੰਡ",
      categories: ["ਕੋਰਸ 1", "ਕੋਰਸ 2", "ਕੋਰਸ 3", "ਕੋਰਸ 4", "ਕੋਰਸ 5"],
      totalLabel: "ਕੁੱਲ ਵਿਦਿਆਰਥੀ",
      unit: "ਵਿਦਿਆਰਥੀ",
      description: "ਪੰਜ ਕੋਰਸਾਂ ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਵੰਡ ਦਰਸਾਉਂਦਾ ਪਾਈ ਚਾਰਟ। ਇੱਕ ਹਿੱਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਨਾਲ ਦਰਸਾਇਆ ਗਿਆ ਹੈ।",
    },
  },
  BOOK_CATEGORIES: {
    hi: {
      title: "श्रेणी के अनुसार जारी पुस्तकों का वितरण",
      categories: ["कथा साहित्य", "विज्ञान", "इतिहास", "वाणिज्य", "सामान्य"],
      totalLabel: "कुल जारी पुस्तकें",
      unit: "पुस्तकें",
      description: "पाँच श्रेणियों में जारी पुस्तकों का वितरण दिखाने वाला पाई चार्ट। एक भाग का प्रतिशत प्रश्न चिह्न से दिखाया गया है।",
    },
    pa: {
      title: "ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਵੰਡ",
      categories: ["ਕਹਾਣੀ ਸਾਹਿਤ", "ਵਿਗਿਆਨ", "ਇਤਿਹਾਸ", "ਵਪਾਰ", "ਸਧਾਰਣ"],
      totalLabel: "ਕੁੱਲ ਜਾਰੀ ਕਿਤਾਬਾਂ",
      unit: "ਕਿਤਾਬਾਂ",
      description: "ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਵੰਡ ਦਰਸਾਉਂਦਾ ਪਾਈ ਚਾਰਟ। ਇੱਕ ਹਿੱਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਨਾਲ ਦਰਸਾਇਆ ਗਿਆ ਹੈ।",
    },
  },
  DEPARTMENT_STAFF: {
    hi: {
      title: "विभागों में कर्मचारियों का वितरण",
      categories: ["बिक्री", "लेखा", "परिचालन", "सहायता", "प्रशासन"],
      totalLabel: "कुल कर्मचारी",
      unit: "कर्मचारी",
      description: "पाँच विभागों में कर्मचारियों का वितरण दिखाने वाला पाई चार्ट। एक भाग का प्रतिशत प्रश्न चिह्न से दिखाया गया है।",
    },
    pa: {
      title: "ਵਿਭਾਗਾਂ ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਦੀ ਵੰਡ",
      categories: ["ਵਿਕਰੀ", "ਲੇਖਾ", "ਕਾਰਜ", "ਸਹਾਇਤਾ", "ਪ੍ਰਸ਼ਾਸਨ"],
      totalLabel: "ਕੁੱਲ ਕਰਮਚਾਰੀ",
      unit: "ਕਰਮਚਾਰੀ",
      description: "ਪੰਜ ਵਿਭਾਗਾਂ ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਦੀ ਵੰਡ ਦਰਸਾਉਂਦਾ ਪਾਈ ਚਾਰਟ। ਇੱਕ ਹਿੱਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਨਾਲ ਦਰਸਾਇਆ ਗਿਆ ਹੈ।",
    },
  },
  PRODUCT_OUTPUT: {
    hi: {
      title: "पाँच उत्पादों में कुल उत्पादन का वितरण",
      categories: ["उत्पाद 1", "उत्पाद 2", "उत्पाद 3", "उत्पाद 4", "उत्पाद 5"],
      totalLabel: "कुल उत्पादन",
      unit: "इकाइयाँ",
      description: "पाँच उत्पादों में कुल उत्पादन का वितरण दिखाने वाला पाई चार्ट। एक भाग का प्रतिशत प्रश्न चिह्न से दिखाया गया है।",
    },
    pa: {
      title: "ਪੰਜ ਉਤਪਾਦਾਂ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ਦੀ ਵੰਡ",
      categories: ["ਉਤਪਾਦ 1", "ਉਤਪਾਦ 2", "ਉਤਪਾਦ 3", "ਉਤਪਾਦ 4", "ਉਤਪਾਦ 5"],
      totalLabel: "ਕੁੱਲ ਉਤਪਾਦਨ",
      unit: "ਇਕਾਈਆਂ",
      description: "ਪੰਜ ਉਤਪਾਦਾਂ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ਦੀ ਵੰਡ ਦਰਸਾਉਂਦਾ ਪਾਈ ਚਾਰਟ। ਇੱਕ ਹਿੱਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਨਾਲ ਦਰਸਾਇਆ ਗਿਆ ਹੈ।",
    },
  },
  SPORTS_PARTICIPATION: {
    hi: {
      title: "पाँच खेलों में प्रतिभागियों का वितरण",
      categories: ["क्रिकेट", "फुटबॉल", "बैडमिंटन", "एथलेटिक्स", "वॉलीबॉल"],
      totalLabel: "कुल प्रतिभागी",
      unit: "प्रतिभागी",
      description: "पाँच खेलों में प्रतिभागियों का वितरण दिखाने वाला पाई चार्ट। एक भाग का प्रतिशत प्रश्न चिह्न से दिखाया गया है।",
    },
    pa: {
      title: "ਪੰਜ ਖੇਡਾਂ ਵਿੱਚ ਭਾਗੀਦਾਰਾਂ ਦੀ ਵੰਡ",
      categories: ["ਕ੍ਰਿਕਟ", "ਫੁੱਟਬਾਲ", "ਬੈਡਮਿੰਟਨ", "ਐਥਲੈਟਿਕਸ", "ਵਾਲੀਬਾਲ"],
      totalLabel: "ਕੁੱਲ ਭਾਗੀਦਾਰ",
      unit: "ਭਾਗੀਦਾਰ",
      description: "ਪੰਜ ਖੇਡਾਂ ਵਿੱਚ ਭਾਗੀਦਾਰਾਂ ਦੀ ਵੰਡ ਦਰਸਾਉਂਦਾ ਪਾਈ ਚਾਰਟ। ਇੱਕ ਹਿੱਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਨਾਲ ਦਰਸਾਇਆ ਗਿਆ ਹੈ।",
    },
  },
  ORDER_CATEGORIES: {
    hi: {
      title: "पाँच श्रेणियों में ऑर्डरों का वितरण",
      categories: ["श्रेणी 1", "श्रेणी 2", "श्रेणी 3", "श्रेणी 4", "श्रेणी 5"],
      totalLabel: "कुल ऑर्डर",
      unit: "ऑर्डर",
      description: "पाँच श्रेणियों में ऑर्डरों का वितरण दिखाने वाला पाई चार्ट। एक भाग का प्रतिशत प्रश्न चिह्न से दिखाया गया है।",
    },
    pa: {
      title: "ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਆਰਡਰਾਂ ਦੀ ਵੰਡ",
      categories: ["ਸ਼੍ਰੇਣੀ 1", "ਸ਼੍ਰੇਣੀ 2", "ਸ਼੍ਰੇਣੀ 3", "ਸ਼੍ਰੇਣੀ 4", "ਸ਼੍ਰੇਣੀ 5"],
      totalLabel: "ਕੁੱਲ ਆਰਡਰ",
      unit: "ਆਰਡਰ",
      description: "ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਆਰਡਰਾਂ ਦੀ ਵੰਡ ਦਰਸਾਉਂਦਾ ਪਾਈ ਚਾਰਟ। ਇੱਕ ਹਿੱਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਨਾਲ ਦਰਸਾਇਆ ਗਿਆ ਹੈ।",
    },
  },
});

function isHindi(locale: Di005LocalizationLocale) {
  return locale === "hi-IN";
}

function contextFor(stimulus: Di005V2Stimulus, locale: Di005LocalizationLocale) {
  const context = DI005_LOCALIZATION_CONTEXTS[stimulus.contextId];
  if (!context) throw new Error(`DI-005 localization is missing context '${stimulus.contextId}'.`);
  return isHindi(locale) ? context.hi : context.pa;
}

function surfaceIndex(question: Di005V2Question) {
  const value = Number(question.stemSurfaceId.replace(/^S/u, ""));
  return Number.isInteger(value) && value >= 1 && value <= 3 ? value - 1 : 0;
}

function categoryAt(stimulus: Di005V2Stimulus, locale: Di005LocalizationLocale, index: number) {
  return contextFor(stimulus, locale).categories[index]!;
}

function localizeCategoryValue(stimulus: Di005V2Stimulus, locale: Di005LocalizationLocale, value: string) {
  const index = stimulus.slices.findIndex((slice) => slice.category === value);
  return index >= 0 ? categoryAt(stimulus, locale, index) : value;
}

function localizedOptions(question: Di005V2Question, stimulus: Di005V2Stimulus, locale: Di005LocalizationLocale) {
  if (question.kind === "LARGEST_SECTOR_IDENTIFICATION" || question.kind === "SMALLEST_SECTOR_IDENTIFICATION") {
    return question.options.map((option) => localizeCategoryValue(stimulus, locale, option));
  }
  return [...question.options];
}

function localizedAnswer(question: Di005V2Question, stimulus: Di005V2Stimulus, locale: Di005LocalizationLocale) {
  if (question.kind === "LARGEST_SECTOR_IDENTIFICATION" || question.kind === "SMALLEST_SECTOR_IDENTIFICATION") {
    return localizeCategoryValue(stimulus, locale, question.answer);
  }
  return question.answer;
}

export function localizeDi005Stimulus(stimulus: Di005V2Stimulus, locale: Di005LocalizationLocale) {
  const context = contextFor(stimulus, locale);
  return {
    ...stimulus,
    title: context.title,
    instruction: isHindi(locale)
      ? "पाई चार्ट का अध्ययन कीजिए और दिए गए प्रश्नों के उत्तर दीजिए। एक भाग का प्रतिशत नहीं दिया गया है।"
      : "ਪਾਈ ਚਾਰਟ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਦਿੱਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ। ਇੱਕ ਹਿੱਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    totalLabel: context.totalLabel,
    unit: context.unit,
    description: context.description,
    slices: stimulus.slices.map((slice, index) => ({ ...slice, category: context.categories[index]! })),
  };
}

function localizedStem(question: Di005V2Question, stimulus: Di005V2Stimulus, locale: Di005LocalizationLocale) {
  const e = question.evidence;
  const hi = isHindi(locale);
  const s = surfaceIndex(question);

  switch (question.kind) {
    case "DIRECT_SECTOR_PERCENT": {
      const category = categoryAt(stimulus, locale, Number(e.categoryIndex));
      const h = [`${category} कुल का कितने प्रतिशत है?`, `पाई चार्ट के अनुसार ${category} की हिस्सेदारी कितने प्रतिशत है?`, `${category} वाले भाग में कितना प्रतिशत दर्शाया गया है?`];
      const p = [`${category} ਕੁੱਲ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `ਪਾਈ ਚਾਰਟ ਅਨੁਸਾਰ ${category} ਦਾ ਹਿੱਸਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `${category} ਵਾਲੇ ਹਿੱਸੇ ਵਿੱਚ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਦਰਸਾਇਆ ਗਿਆ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "LARGEST_SECTOR_IDENTIFICATION": {
      const h = ["पाई चार्ट में किस श्रेणी का हिस्सा सबसे बड़ा है?", "सबसे बड़ा भाग किस श्रेणी को दर्शाता है?", "कुल में सबसे अधिक प्रतिशत किस श्रेणी का है?"];
      const p = ["ਪਾਈ ਚਾਰਟ ਵਿੱਚ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਦਾ ਹਿੱਸਾ ਸਭ ਤੋਂ ਵੱਡਾ ਹੈ?", "ਸਭ ਤੋਂ ਵੱਡਾ ਹਿੱਸਾ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?", "ਕੁੱਲ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਪ੍ਰਤੀਸ਼ਤ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਦਾ ਹੈ?"];
      return (hi ? h : p)[s]!;
    }
    case "SMALLEST_SECTOR_IDENTIFICATION": {
      const h = ["पाई चार्ट में किस श्रेणी का हिस्सा सबसे छोटा है?", "सबसे छोटा भाग किस श्रेणी को दर्शाता है?", "कुल में सबसे कम प्रतिशत किस श्रेणी का है?"];
      const p = ["ਪਾਈ ਚਾਰਟ ਵਿੱਚ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਦਾ ਹਿੱਸਾ ਸਭ ਤੋਂ ਛੋਟਾ ਹੈ?", "ਸਭ ਤੋਂ ਛੋਟਾ ਹਿੱਸਾ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?", "ਕੁੱਲ ਵਿੱਚ ਸਭ ਤੋਂ ਘੱਟ ਪ੍ਰਤੀਸ਼ਤ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਦਾ ਹੈ?"];
      return (hi ? h : p)[s]!;
    }
    case "MISSING_SECTOR_PERCENT": {
      const category = categoryAt(stimulus, locale, stimulus.hiddenPercentIndex);
      const h = [`${category} का प्रतिशत नहीं दिया गया है। यह कितना होगा?`, `प्रश्न चिह्न वाले ${category} भाग का प्रतिशत ज्ञात कीजिए।`, `${category} के लिए छूटा हुआ प्रतिशत कितना है?`];
      const p = [`${category} ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ। ਇਹ ਕਿੰਨਾ ਹੋਵੇਗਾ?`, `ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਵਾਲੇ ${category} ਹਿੱਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ।`, `${category} ਲਈ ਰਹਿ ਗਿਆ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "SECTOR_ANGLE_DEGREES": {
      const category = categoryAt(stimulus, locale, Number(e.categoryIndex));
      const h = [`${category} के लिए केंद्र पर बना कोण कितना है?`, `${category} वाले भाग का केंद्रीय कोण ज्ञात कीजिए।`, `${category} का भाग केंद्र पर कितने डिग्री का कोण बनाता है?`];
      const p = [`${category} ਲਈ ਕੇਂਦਰ ਉੱਤੇ ਬਣਿਆ ਕੋਣ ਕਿੰਨਾ ਹੈ?`, `${category} ਵਾਲੇ ਹਿੱਸੇ ਦਾ ਕੇਂਦਰੀ ਕੋਣ ਕੱਢੋ।`, `${category} ਦਾ ਹਿੱਸਾ ਕੇਂਦਰ ਉੱਤੇ ਕਿੰਨੇ ਡਿਗਰੀ ਦਾ ਕੋਣ ਬਣਾਉਂਦਾ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "SECTOR_COUNT_FROM_TOTAL": {
      const category = categoryAt(stimulus, locale, Number(e.categoryIndex));
      const h = [`${category} के लिए कुल संख्या कितनी है?`, `पाई चार्ट में ${category} की संख्या ज्ञात कीजिए।`, `${category} द्वारा दर्शाई गई संख्या कितनी है?`];
      const p = [`${category} ਲਈ ਕੁੱਲ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`, `ਪਾਈ ਚਾਰਟ ਵਿੱਚ ${category} ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`, `${category} ਵੱਲੋਂ ਦਰਸਾਈ ਗਈ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "COMBINED_SECTOR_PERCENT": {
      const first = categoryAt(stimulus, locale, Number(e.firstIndex)), second = categoryAt(stimulus, locale, Number(e.secondIndex));
      const h = [`${first} और ${second} मिलकर कुल का कितने प्रतिशत हैं?`, `${first} तथा ${second} की संयुक्त प्रतिशत हिस्सेदारी ज्ञात कीजिए।`, `${first} और ${second} को मिलाकर कितने प्रतिशत हिस्सा बनता है?`];
      const p = [`${first} ਅਤੇ ${second} ਮਿਲ ਕੇ ਕੁੱਲ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹਨ?`, `${first} ਅਤੇ ${second} ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ ਕੱਢੋ।`, `${first} ਅਤੇ ${second} ਨੂੰ ਮਿਲਾ ਕੇ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ ਬਣਦਾ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "DIFFERENCE_IN_COUNTS": {
      const first = categoryAt(stimulus, locale, Number(e.firstIndex)), second = categoryAt(stimulus, locale, Number(e.secondIndex));
      const h = [`${first} और ${second} की संख्याओं में कितना अंतर है?`, `${first} तथा ${second} की संख्याओं का अंतर ज्ञात कीजिए।`, `${first} और ${second} द्वारा दर्शाई गई संख्याओं का निरपेक्ष अंतर कितना है?`];
      const p = [`${first} ਅਤੇ ${second} ਦੀਆਂ ਗਿਣਤੀਆਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`, `${first} ਅਤੇ ${second} ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`, `${first} ਅਤੇ ${second} ਵੱਲੋਂ ਦਰਸਾਈਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "RATIO_OF_TWO_SECTORS": {
      const first = categoryAt(stimulus, locale, Number(e.firstIndex)), second = categoryAt(stimulus, locale, Number(e.secondIndex));
      const h = [`${first} और ${second} की संख्याओं का अनुपात क्या है?`, `${first} : ${second} के क्रम में सरल अनुपात ज्ञात कीजिए।`, `${first} और ${second} द्वारा दर्शाई गई संख्याएँ किस अनुपात में हैं?`];
      const p = [`${first} ਅਤੇ ${second} ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${first} : ${second} ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਸਰਲ ਅਨੁਪਾਤ ਕੱਢੋ।`, `${first} ਅਤੇ ${second} ਵੱਲੋਂ ਦਰਸਾਈਆਂ ਗਿਣਤੀਆਂ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ?`];
      return (hi ? h : p)[s]!;
    }
    case "RELATIVE_SECTOR_PERCENT_EXCESS": {
      const larger = categoryAt(stimulus, locale, Number(e.largerIndex)), smaller = categoryAt(stimulus, locale, Number(e.smallerIndex));
      const h = [`${larger} की संख्या ${smaller} से कितने प्रतिशत अधिक है?`, `${larger} की संख्या, ${smaller} की तुलना में कितने प्रतिशत अधिक है?`, `${smaller} को आधार मानते हुए ${larger} कितने प्रतिशत अधिक है?`];
      const p = [`${larger} ਦੀ ਗਿਣਤੀ ${smaller} ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${larger} ਦੀ ਗਿਣਤੀ, ${smaller} ਦੇ ਮੁਕਾਬਲੇ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${smaller} ਨੂੰ ਅਧਾਰ ਮੰਨ ਕੇ ${larger} ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`];
      return (hi ? h : p)[s]!;
    }
    case "COMBINED_SECTOR_ANGLE": {
      const first = categoryAt(stimulus, locale, Number(e.firstIndex)), second = categoryAt(stimulus, locale, Number(e.secondIndex));
      const h = [`${first} और ${second} के भाग मिलकर केंद्र पर कितना कोण बनाते हैं?`, `${first} तथा ${second} का संयुक्त केंद्रीय कोण कितना है?`, `${first} और ${second} द्वारा घेरे गए कुल कोण को ज्ञात कीजिए।`];
      const p = [`${first} ਅਤੇ ${second} ਦੇ ਹਿੱਸੇ ਮਿਲ ਕੇ ਕੇਂਦਰ ਉੱਤੇ ਕਿੰਨਾ ਕੋਣ ਬਣਾਉਂਦੇ ਹਨ?`, `${first} ਅਤੇ ${second} ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਕੇਂਦਰੀ ਕੋਣ ਕਿੰਨਾ ਹੈ?`, `${first} ਅਤੇ ${second} ਵੱਲੋਂ ਬਣਾਏ ਕੁੱਲ ਕੋਣ ਨੂੰ ਕੱਢੋ।`];
      return (hi ? h : p)[s]!;
    }
    case "REMAINDER_AFTER_TWO_SECTORS_COUNT": {
      const first = categoryAt(stimulus, locale, Number(e.firstIndex)), second = categoryAt(stimulus, locale, Number(e.secondIndex));
      const h = [`${first} और ${second} को छोड़कर बाकी तीन श्रेणियों की कुल संख्या कितनी है?`, `${first} तथा ${second} को हटाने के बाद कितनी संख्या शेष रहती है?`, `${first} और ${second} के अलावा शेष तीन श्रेणियों की संयुक्त संख्या ज्ञात कीजिए।`];
      const p = [`${first} ਅਤੇ ${second} ਨੂੰ ਛੱਡ ਕੇ ਬਾਕੀ ਤਿੰਨ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`, `${first} ਅਤੇ ${second} ਨੂੰ ਹਟਾਉਣ ਤੋਂ ਬਾਅਦ ਕਿੰਨੀ ਗਿਣਤੀ ਬਚਦੀ ਹੈ?`, `${first} ਅਤੇ ${second} ਤੋਂ ਇਲਾਵਾ ਬਾਕੀ ਤਿੰਨ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਮਿਲੀ ਹੋਈ ਗਿਣਤੀ ਕੱਢੋ।`];
      return (hi ? h : p)[s]!;
    }
  }
}

function explanationFor(question: Di005V2Question, stimulus: Di005V2Stimulus, locale: Di005LocalizationLocale) {
  const hi = isHindi(locale);
  const e = question.evidence;
  const slices = stimulus.slices;
  const hiddenIndex = stimulus.hiddenPercentIndex;
  const visibleTotal = slices.reduce((sum, slice, index) => index === hiddenIndex ? sum : sum + slice.percent, 0);
  const hidden = slices[hiddenIndex]!;
  const hiddenCategory = categoryAt(stimulus, locale, hiddenIndex);
  const recovery = hi
    ? `दिए गए चार प्रतिशतों का योग = ${visibleTotal}%। इसलिए ${hiddenCategory} = 100% - ${visibleTotal}% = ${hidden.percent}%।`
    : `ਦਿੱਤੇ ਹੋਏ ਚਾਰ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦਾ ਜੋੜ = ${visibleTotal}%। ਇਸ ਲਈ ${hiddenCategory} = 100% - ${visibleTotal}% = ${hidden.percent}%।`;

  const pack = (hiIdea: string, paIdea: string, hiSteps: string[], paSteps: string[]) => ({
    keyIdea: hi ? hiIdea : paIdea,
    steps: hi ? hiSteps : paSteps,
  });

  switch (question.kind) {
    case "DIRECT_SECTOR_PERCENT": {
      const index = Number(e.categoryIndex), category = categoryAt(stimulus, locale, index), percent = slices[index]!.percent;
      return pack(
        "दिए गए भाग का प्रतिशत सीधे पाई चार्ट से पढ़ें।",
        "ਦਿੱਤੇ ਹਿੱਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਸਿੱਧਾ ਪਾਈ ਚਾਰਟ ਤੋਂ ਪੜ੍ਹੋ।",
        [`${category} के भाग पर ${percent}% दिया है।`, `इसलिए उत्तर = ${question.answer}।`],
        [`${category} ਦੇ ਹਿੱਸੇ ਉੱਤੇ ${percent}% ਦਿੱਤਾ ਹੈ।`, `ਇਸ ਲਈ ਉੱਤਰ = ${question.answer}।`],
      );
    }
    case "LARGEST_SECTOR_IDENTIFICATION":
    case "SMALLEST_SECTOR_IDENTIFICATION": {
      const isLargest = question.kind === "LARGEST_SECTOR_IDENTIFICATION";
      const answerIndex = isLargest
        ? slices.reduce((best, slice, index) => slice.percent > slices[best]!.percent ? index : best, 0)
        : slices.reduce((best, slice, index) => slice.percent < slices[best]!.percent ? index : best, 0);
      const answerCategory = categoryAt(stimulus, locale, answerIndex);
      const answerPercent = slices[answerIndex]!.percent;
      const comparison = slices.map((slice, index) => `${categoryAt(stimulus, locale, index)} = ${slice.percent}%`).join(", ");
      return pack(
        isLargest ? "सभी पाँच हिस्सों के प्रतिशत की तुलना करें और सबसे बड़ा प्रतिशत चुनें।" : "सभी पाँच हिस्सों के प्रतिशत की तुलना करें और सबसे छोटा प्रतिशत चुनें।",
        isLargest ? "ਸਾਰੇ ਪੰਜ ਹਿੱਸਿਆਂ ਦੇ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਸਭ ਤੋਂ ਵੱਡਾ ਪ੍ਰਤੀਸ਼ਤ ਚੁਣੋ।" : "ਸਾਰੇ ਪੰਜ ਹਿੱਸਿਆਂ ਦੇ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਸਭ ਤੋਂ ਛੋਟਾ ਪ੍ਰਤੀਸ਼ਤ ਚੁਣੋ।",
        [recovery, `प्रतिशत: ${comparison}।`, `${answerPercent}% ${isLargest ? "सबसे बड़ा" : "सबसे छोटा"} है, इसलिए उत्तर = ${answerCategory}।`],
        [recovery, `ਪ੍ਰਤੀਸ਼ਤ: ${comparison}।`, `${answerPercent}% ${isLargest ? "ਸਭ ਤੋਂ ਵੱਡਾ" : "ਸਭ ਤੋਂ ਛੋਟਾ"} ਹੈ, ਇਸ ਲਈ ਉੱਤਰ = ${answerCategory}।`],
      );
    }
    case "MISSING_SECTOR_PERCENT": {
      return pack(
        "पाई चार्ट के सभी हिस्सों का योग 100% होता है। दिए गए प्रतिशतों को 100% से घटाएँ।",
        "ਪਾਈ ਚਾਰਟ ਦੇ ਸਾਰੇ ਹਿੱਸਿਆਂ ਦਾ ਜੋੜ 100% ਹੁੰਦਾ ਹੈ। ਦਿੱਤੇ ਪ੍ਰਤੀਸ਼ਤਾਂ ਨੂੰ 100% ਵਿਚੋਂ ਘਟਾਓ।",
        [`दिए गए प्रतिशतों का योग = ${visibleTotal}%।`, `${hiddenCategory} = 100% - ${visibleTotal}% = ${hidden.percent}%।`],
        [`ਦਿੱਤੇ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦਾ ਜੋੜ = ${visibleTotal}%।`, `${hiddenCategory} = 100% - ${visibleTotal}% = ${hidden.percent}%।`],
      );
    }
    case "SECTOR_ANGLE_DEGREES": {
      const index = Number(e.categoryIndex), category = categoryAt(stimulus, locale, index), slice = slices[index]!;
      return pack(
        "किसी भाग का केंद्रीय कोण = उसका प्रतिशत × 360° ÷ 100।",
        "ਕਿਸੇ ਹਿੱਸੇ ਦਾ ਕੇਂਦਰੀ ਕੋਣ = ਉਸ ਦਾ ਪ੍ਰਤੀਸ਼ਤ × 360° ÷ 100।",
        [`${category} = ${slice.percent}%।`, `कोण = ${slice.percent} × 360° ÷ 100 = ${slice.angleDegrees}°।`],
        [`${category} = ${slice.percent}%।`, `ਕੋਣ = ${slice.percent} × 360° ÷ 100 = ${slice.angleDegrees}°।`],
      );
    }
    case "SECTOR_COUNT_FROM_TOTAL": {
      const index = Number(e.categoryIndex), category = categoryAt(stimulus, locale, index), slice = slices[index]!;
      const count = stimulus.totalValue * slice.percent / 100;
      return pack(
        "दिए गए प्रतिशत को कुल संख्या पर लागू करें।",
        "ਦਿੱਤੇ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਉੱਤੇ ਲਾਗੂ ਕਰੋ।",
        [`${category} = ${slice.percent}% of ${stimulus.totalValue}।`.replace("of", "का"), `संख्या = ${stimulus.totalValue} × ${slice.percent}/100 = ${count}।`],
        [`${category} = ${stimulus.totalValue} ਦਾ ${slice.percent}%।`, `ਗਿਣਤੀ = ${stimulus.totalValue} × ${slice.percent}/100 = ${count}।`],
      );
    }
    case "COMBINED_SECTOR_PERCENT": {
      const a = Number(e.firstIndex), b = Number(e.secondIndex), ca = categoryAt(stimulus, locale, a), cb = categoryAt(stimulus, locale, b);
      const total = slices[a]!.percent + slices[b]!.percent;
      return pack(
        "दो हिस्सों की संयुक्त प्रतिशत हिस्सेदारी के लिए उनके प्रतिशत जोड़ें।",
        "ਦੋ ਹਿੱਸਿਆਂ ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢਣ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਜੋੜੋ।",
        [`${ca} = ${slices[a]!.percent}% और ${cb} = ${slices[b]!.percent}%।`, `संयुक्त प्रतिशत = ${slices[a]!.percent}% + ${slices[b]!.percent}% = ${total}%।`],
        [`${ca} = ${slices[a]!.percent}% ਅਤੇ ${cb} = ${slices[b]!.percent}%।`, `ਮਿਲਿਆ ਹੋਇਆ ਪ੍ਰਤੀਸ਼ਤ = ${slices[a]!.percent}% + ${slices[b]!.percent}% = ${total}%।`],
      );
    }
    case "DIFFERENCE_IN_COUNTS": {
      const a = Number(e.firstIndex), b = Number(e.secondIndex), ca = categoryAt(stimulus, locale, a), cb = categoryAt(stimulus, locale, b);
      const countA = stimulus.totalValue * slices[a]!.percent / 100, countB = stimulus.totalValue * slices[b]!.percent / 100;
      return pack(
        "पहले दोनों हिस्सों की संख्या निकालें, फिर बड़ी संख्या में से छोटी संख्या घटाएँ।",
        "ਪਹਿਲਾਂ ਦੋਵੇਂ ਹਿੱਸਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਵੱਡੀ ਗਿਣਤੀ ਵਿਚੋਂ ਛੋਟੀ ਗਿਣਤੀ ਘਟਾਓ।",
        [`${ca} = ${stimulus.totalValue} × ${slices[a]!.percent}/100 = ${countA}; ${cb} = ${stimulus.totalValue} × ${slices[b]!.percent}/100 = ${countB}।`, `अंतर = |${countA} - ${countB}| = ${question.answer}।`],
        [`${ca} = ${stimulus.totalValue} × ${slices[a]!.percent}/100 = ${countA}; ${cb} = ${stimulus.totalValue} × ${slices[b]!.percent}/100 = ${countB}।`, `ਅੰਤਰ = |${countA} - ${countB}| = ${question.answer}।`],
      );
    }
    case "RATIO_OF_TWO_SECTORS": {
      const a = Number(e.firstIndex), b = Number(e.secondIndex), ca = categoryAt(stimulus, locale, a), cb = categoryAt(stimulus, locale, b);
      return pack(
        "पहले छूटे हुए भाग का प्रतिशत निकालें। फिर पूछे गए क्रम में दोनों प्रतिशतों का अनुपात सरल करें।",
        "ਪਹਿਲਾਂ ਰਹਿ ਗਏ ਹਿੱਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ। ਫਿਰ ਪੁੱਛੇ ਕ੍ਰਮ ਵਿੱਚ ਦੋਵੇਂ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦਾ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",
        [recovery, `${ca}:${cb} = ${slices[a]!.percent}:${slices[b]!.percent}।`, `सरल अनुपात = ${question.answer}।`],
        [recovery, `${ca}:${cb} = ${slices[a]!.percent}:${slices[b]!.percent}।`, `ਸਰਲ ਅਨੁਪਾਤ = ${question.answer}।`],
      );
    }
    case "RELATIVE_SECTOR_PERCENT_EXCESS": {
      const a = Number(e.largerIndex), b = Number(e.smallerIndex), ca = categoryAt(stimulus, locale, a), cb = categoryAt(stimulus, locale, b);
      const difference = slices[a]!.percent - slices[b]!.percent;
      return pack(
        "पहले छूटा हुआ प्रतिशत निकालें। फिर अंतर को छोटी श्रेणी के प्रतिशत से भाग देकर 100 से गुणा करें।",
        "ਪਹਿਲਾਂ ਰਹਿ ਗਿਆ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ। ਫਿਰ ਅੰਤਰ ਨੂੰ ਛੋਟੀ ਸ਼੍ਰੇਣੀ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।",
        [recovery, `अंतर = ${slices[a]!.percent}% - ${slices[b]!.percent}% = ${difference} प्रतिशत अंक।`, `प्रतिशत अधिक = ${difference}/${slices[b]!.percent} × 100 = ${question.answer}।`],
        [recovery, `ਅੰਤਰ = ${slices[a]!.percent}% - ${slices[b]!.percent}% = ${difference} ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ।`, `ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ = ${difference}/${slices[b]!.percent} × 100 = ${question.answer}।`],
      );
    }
    case "COMBINED_SECTOR_ANGLE": {
      const a = Number(e.firstIndex), b = Number(e.secondIndex), ca = categoryAt(stimulus, locale, a), cb = categoryAt(stimulus, locale, b);
      const angleA = slices[a]!.angleDegrees, angleB = slices[b]!.angleDegrees;
      return pack(
        "पहले छूटा हुआ प्रतिशत निकालें। फिर दोनों हिस्सों के कोण निकालकर जोड़ें।",
        "ਪਹਿਲਾਂ ਰਹਿ ਗਿਆ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ। ਫਿਰ ਦੋਵੇਂ ਹਿੱਸਿਆਂ ਦੇ ਕੋਣ ਕੱਢ ਕੇ ਜੋੜੋ।",
        [recovery, `${ca}: ${slices[a]!.percent}% × 360°/100 = ${angleA}°; ${cb}: ${slices[b]!.percent}% × 360°/100 = ${angleB}°।`, `कुल कोण = ${angleA}° + ${angleB}° = ${question.answer}।`],
        [recovery, `${ca}: ${slices[a]!.percent}% × 360°/100 = ${angleA}°; ${cb}: ${slices[b]!.percent}% × 360°/100 = ${angleB}°।`, `ਕੁੱਲ ਕੋਣ = ${angleA}° + ${angleB}° = ${question.answer}।`],
      );
    }
    case "REMAINDER_AFTER_TWO_SECTORS_COUNT": {
      const a = Number(e.firstIndex), b = Number(e.secondIndex), ca = categoryAt(stimulus, locale, a), cb = categoryAt(stimulus, locale, b);
      const excluded = slices[a]!.percent + slices[b]!.percent, remaining = 100 - excluded;
      const count = stimulus.totalValue * remaining / 100;
      return pack(
        "पहले छूटा हुआ प्रतिशत निकालें। फिर दोनों नामित हिस्सों को 100% में से घटाकर शेष प्रतिशत को कुल संख्या पर लागू करें।",
        "ਪਹਿਲਾਂ ਰਹਿ ਗਿਆ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ। ਫਿਰ ਦੋਵੇਂ ਦਿੱਤੇ ਹਿੱਸਿਆਂ ਨੂੰ 100% ਵਿਚੋਂ ਘਟਾ ਕੇ ਬਚੇ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਉੱਤੇ ਲਾਗੂ ਕਰੋ।",
        [recovery, `हटाए गए हिस्से = ${slices[a]!.percent}% + ${slices[b]!.percent}% = ${excluded}%; शेष = 100% - ${excluded}% = ${remaining}%।`, `शेष संख्या = ${stimulus.totalValue} × ${remaining}/100 = ${count}।`],
        [recovery, `ਹਟਾਏ ਗਏ ਹਿੱਸੇ = ${slices[a]!.percent}% + ${slices[b]!.percent}% = ${excluded}%; ਬਾਕੀ = 100% - ${excluded}% = ${remaining}%।`, `ਬਾਕੀ ਗਿਣਤੀ = ${stimulus.totalValue} × ${remaining}/100 = ${count}।`],
      );
    }
  }
}

export function localizeDi005Question(
  source: ReturnType<typeof generateDi005PermanentQuestion>,
  locale: Di005LocalizationLocale,
) {
  const question = source.question;
  const stimulus = localizeDi005Stimulus(source.stimulus, locale);
  const options = localizedOptions(question, source.stimulus, locale);
  const answer = localizedAnswer(question, source.stimulus, locale);

  return {
    packageId: "DI-005" as const,
    requestedSeed: source.requestedSeed,
    sourceSeed: source.sourceSeed,
    examProfile: source.examProfile,
    language: locale === "hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationReviewId: DI005_LOCALIZATION_REVIEW_ID,
    localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
    sourceEnglishStatus: "ENGLISH_REVIEW_APPROVED" as const,
    stimulus,
    question: {
      ...question,
      stem: localizedStem(question, source.stimulus, locale),
      options,
      answer,
      explanation: explanationFor(question, source.stimulus, locale),
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

export function generateDi005LocalizedReviewQuestion(input: {
  seed: string;
  examProfile: Di005V2ExamProfile;
  taskKind: Di005V2TaskKind;
  locale: Di005LocalizationLocale;
}) {
  return localizeDi005Question(
    generateDi005PermanentQuestion({
      seed: input.seed,
      examProfile: input.examProfile,
      taskKind: input.taskKind,
    }),
    input.locale,
  );
}

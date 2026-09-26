import { generateDi007PermanentQuestion } from "./permanent-question-generator";
import type {
  Di007V2ExamProfile,
  Di007V2Question,
  Di007V2Stimulus,
  Di007V2TaskKind,
} from "./missing-v2-types";

export type Di007LocalizationLocale = "hi-IN" | "pa-IN";

export const DI007_LOCALIZATION_REVIEW_ID = "DI-007-HI-PA-REVIEW-V1" as const;

type LocalizedContext = Readonly<{
  hi: Readonly<{
    title: string;
    rowLabel: string;
    rows: readonly string[];
    seriesALabel: string;
    seriesBLabel: string;
    seriesAMeasure: string;
    seriesBMeasure: string;
    unit: string;
  }>;
  pa: Readonly<{
    title: string;
    rowLabel: string;
    rows: readonly string[];
    seriesALabel: string;
    seriesBLabel: string;
    seriesAMeasure: string;
    seriesBMeasure: string;
    unit: string;
  }>;
}>;

export const DI007_LOCALIZATION_CONTEXTS: Readonly<Record<string, LocalizedContext>> = Object.freeze({
  BANK_BRANCH_APPLICATIONS: {
    hi: {
      title: "पाँच शाखाओं में प्राप्त और स्वीकृत ऋण आवेदन",
      rowLabel: "शाखा",
      rows: ["शाखा 1", "शाखा 2", "शाखा 3", "शाखा 4", "शाखा 5"],
      seriesALabel: "प्राप्त आवेदन",
      seriesBLabel: "स्वीकृत आवेदन",
      seriesAMeasure: "प्राप्त आवेदनों की संख्या",
      seriesBMeasure: "स्वीकृत आवेदनों की संख्या",
      unit: "आवेदन",
    },
    pa: {
      title: "ਪੰਜ ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਪ੍ਰਾਪਤ ਅਤੇ ਮਨਜ਼ੂਰ ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ",
      rowLabel: "ਸ਼ਾਖਾ",
      rows: ["ਸ਼ਾਖਾ 1", "ਸ਼ਾਖਾ 2", "ਸ਼ਾਖਾ 3", "ਸ਼ਾਖਾ 4", "ਸ਼ਾਖਾ 5"],
      seriesALabel: "ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ",
      seriesBLabel: "ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ",
      seriesAMeasure: "ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ",
      seriesBMeasure: "ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਅਰਜ਼ੀਆਂ",
    },
  },
  INSURANCE_POLICIES: {
    hi: {
      title: "पाँच तिमाहियों में नई और नवीनीकृत बीमा पॉलिसियाँ",
      rowLabel: "तिमाही",
      rows: ["तिमाही 1", "तिमाही 2", "तिमाही 3", "तिमाही 4", "तिमाही 5"],
      seriesALabel: "नई पॉलिसियाँ",
      seriesBLabel: "नवीनीकृत पॉलिसियाँ",
      seriesAMeasure: "नई पॉलिसियों की संख्या",
      seriesBMeasure: "नवीनीकृत पॉलिसियों की संख्या",
      unit: "पॉलिसियाँ",
    },
    pa: {
      title: "ਪੰਜ ਤਿਮਾਹੀਆਂ ਵਿੱਚ ਨਵੀਆਂ ਅਤੇ ਨਵੀਕਰਿਤ ਬੀਮਾ ਪਾਲਿਸੀਆਂ",
      rowLabel: "ਤਿਮਾਹੀ",
      rows: ["ਤਿਮਾਹੀ 1", "ਤਿਮਾਹੀ 2", "ਤਿਮਾਹੀ 3", "ਤਿਮਾਹੀ 4", "ਤਿਮਾਹੀ 5"],
      seriesALabel: "ਨਵੀਆਂ ਪਾਲਿਸੀਆਂ",
      seriesBLabel: "ਨਵੀਕਰਿਤ ਪਾਲਿਸੀਆਂ",
      seriesAMeasure: "ਨਵੀਆਂ ਪਾਲਿਸੀਆਂ ਦੀ ਗਿਣਤੀ",
      seriesBMeasure: "ਨਵੀਕਰਿਤ ਪਾਲਿਸੀਆਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਪਾਲਿਸੀਆਂ",
    },
  },
  FACTORY_OUTPUT: {
    hi: {
      title: "पाँच महीनों में दो उत्पादन लाइनों का उत्पादन",
      rowLabel: "महीना",
      rows: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई"],
      seriesALabel: "लाइन 1 उत्पादन",
      seriesBLabel: "लाइन 2 उत्पादन",
      seriesAMeasure: "लाइन 1 का उत्पादन",
      seriesBMeasure: "लाइन 2 का उत्पादन",
      unit: "इकाइयाँ",
    },
    pa: {
      title: "ਪੰਜ ਮਹੀਨਿਆਂ ਵਿੱਚ ਦੋ ਉਤਪਾਦਨ ਲਾਈਨਾਂ ਦਾ ਉਤਪਾਦਨ",
      rowLabel: "ਮਹੀਨਾ",
      rows: ["ਜਨਵਰੀ", "ਫ਼ਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ"],
      seriesALabel: "ਲਾਈਨ 1 ਉਤਪਾਦਨ",
      seriesBLabel: "ਲਾਈਨ 2 ਉਤਪਾਦਨ",
      seriesAMeasure: "ਲਾਈਨ 1 ਦਾ ਉਤਪਾਦਨ",
      seriesBMeasure: "ਲਾਈਨ 2 ਦਾ ਉਤਪਾਦਨ",
      unit: "ਇਕਾਈਆਂ",
    },
  },
  COURSE_ENROLMENT: {
    hi: {
      title: "पाँच केंद्रों में दो पाठ्यक्रम समूहों का नामांकन",
      rowLabel: "केंद्र",
      rows: ["केंद्र 1", "केंद्र 2", "केंद्र 3", "केंद्र 4", "केंद्र 5"],
      seriesALabel: "समूह 1 नामांकन",
      seriesBLabel: "समूह 2 नामांकन",
      seriesAMeasure: "समूह 1 में नामांकित छात्रों की संख्या",
      seriesBMeasure: "समूह 2 में नामांकित छात्रों की संख्या",
      unit: "छात्र",
    },
    pa: {
      title: "ਪੰਜ ਕੇਂਦਰਾਂ ਵਿੱਚ ਦੋ ਕੋਰਸ ਸਮੂਹਾਂ ਦਾ ਦਾਖ਼ਲਾ",
      rowLabel: "ਕੇਂਦਰ",
      rows: ["ਕੇਂਦਰ 1", "ਕੇਂਦਰ 2", "ਕੇਂਦਰ 3", "ਕੇਂਦਰ 4", "ਕੇਂਦਰ 5"],
      seriesALabel: "ਸਮੂਹ 1 ਦਾਖ਼ਲਾ",
      seriesBLabel: "ਸਮੂਹ 2 ਦਾਖ਼ਲਾ",
      seriesAMeasure: "ਸਮੂਹ 1 ਵਿੱਚ ਦਾਖ਼ਲ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ",
      seriesBMeasure: "ਸਮੂਹ 2 ਵਿੱਚ ਦਾਖ਼ਲ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਵਿਦਿਆਰਥੀ",
    },
  },
  ONLINE_ORDERS: {
    hi: {
      title: "पाँच दिनों में दो माध्यमों द्वारा संभाले गए ऑर्डर",
      rowLabel: "दिन",
      rows: ["सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार"],
      seriesALabel: "माध्यम 1 ऑर्डर",
      seriesBLabel: "माध्यम 2 ऑर्डर",
      seriesAMeasure: "माध्यम 1 के ऑर्डरों की संख्या",
      seriesBMeasure: "माध्यम 2 के ऑर्डरों की संख्या",
      unit: "ऑर्डर",
    },
    pa: {
      title: "ਪੰਜ ਦਿਨਾਂ ਵਿੱਚ ਦੋ ਮਾਧਿਅਮਾਂ ਵੱਲੋਂ ਸੰਭਾਲੇ ਆਰਡਰ",
      rowLabel: "ਦਿਨ",
      rows: ["ਸੋਮਵਾਰ", "ਮੰਗਲਵਾਰ", "ਬੁੱਧਵਾਰ", "ਵੀਰਵਾਰ", "ਸ਼ੁੱਕਰਵਾਰ"],
      seriesALabel: "ਮਾਧਿਅਮ 1 ਆਰਡਰ",
      seriesBLabel: "ਮਾਧਿਅਮ 2 ਆਰਡਰ",
      seriesAMeasure: "ਮਾਧਿਅਮ 1 ਦੇ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ",
      seriesBMeasure: "ਮਾਧਿਅਮ 2 ਦੇ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਆਰਡਰ",
    },
  },
  BOOK_ISSUES: {
    hi: {
      title: "पाँच सप्ताह में दो अनुभागों से जारी पुस्तकें",
      rowLabel: "सप्ताह",
      rows: ["सप्ताह 1", "सप्ताह 2", "सप्ताह 3", "सप्ताह 4", "सप्ताह 5"],
      seriesALabel: "अनुभाग 1 से जारी पुस्तकें",
      seriesBLabel: "अनुभाग 2 से जारी पुस्तकें",
      seriesAMeasure: "अनुभाग 1 से जारी पुस्तकों की संख्या",
      seriesBMeasure: "अनुभाग 2 से जारी पुस्तकों की संख्या",
      unit: "पुस्तकें",
    },
    pa: {
      title: "ਪੰਜ ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਦੋ ਭਾਗਾਂ ਤੋਂ ਜਾਰੀ ਕਿਤਾਬਾਂ",
      rowLabel: "ਹਫ਼ਤਾ",
      rows: ["ਹਫ਼ਤਾ 1", "ਹਫ਼ਤਾ 2", "ਹਫ਼ਤਾ 3", "ਹਫ਼ਤਾ 4", "ਹਫ਼ਤਾ 5"],
      seriesALabel: "ਭਾਗ 1 ਤੋਂ ਜਾਰੀ ਕਿਤਾਬਾਂ",
      seriesBLabel: "ਭਾਗ 2 ਤੋਂ ਜਾਰੀ ਕਿਤਾਬਾਂ",
      seriesAMeasure: "ਭਾਗ 1 ਤੋਂ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ",
      seriesBMeasure: "ਭਾਗ 2 ਤੋਂ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਕਿਤਾਬਾਂ",
    },
  },
});

function hi(locale: Di007LocalizationLocale) {
  return locale === "hi-IN";
}

function ctx(stimulus: Di007V2Stimulus, locale: Di007LocalizationLocale) {
  const value = DI007_LOCALIZATION_CONTEXTS[stimulus.contextId];
  if (!value) throw new Error(`DI-007 localization is missing context '${stimulus.contextId}'.`);
  return hi(locale) ? value.hi : value.pa;
}

function totalA(stimulus: Di007V2Stimulus) {
  return stimulus.points.reduce((sum, point) => sum + point.seriesA, 0);
}

function totalB(stimulus: Di007V2Stimulus) {
  const a = totalA(stimulus);
  const c = stimulus.aggregateCondition;
  switch (c.mode) {
    case "COLUMN_TOTAL": return c.value!;
    case "COLUMN_AVERAGE": return c.value! * stimulus.points.length;
    case "COMBINED_TOTAL": return c.value! - a;
    case "TOTAL_RATIO_TO_A": return a * c.numerator! / c.denominator!;
    case "DIFFERENCE_FROM_A_TOTAL": return c.direction === "ABOVE" ? a + c.value! : a - c.value!;
  }
}

function missingValue(stimulus: Di007V2Stimulus) {
  const b = totalB(stimulus);
  const visible = stimulus.points.reduce((sum, point, index) => index === stimulus.hiddenIndex ? sum : sum + point.seriesB, 0);
  return b - visible;
}

function row(stimulus: Di007V2Stimulus, locale: Di007LocalizationLocale, index: number) {
  return ctx(stimulus, locale).rows[index]!;
}

function fiveEntryPhrase(stimulus: Di007V2Stimulus, locale: Di007LocalizationLocale) {
  const isHi = hi(locale);
  switch (stimulus.contextId) {
    case "BANK_BRANCH_APPLICATIONS": return isHi ? "पाँचों शाखाओं में" : "ਪੰਜਾਂ ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ";
    case "INSURANCE_POLICIES": return isHi ? "पाँचों तिमाहियों में" : "ਪੰਜਾਂ ਤਿਮਾਹੀਆਂ ਵਿੱਚ";
    case "FACTORY_OUTPUT": return isHi ? "पाँचों महीनों में" : "ਪੰਜਾਂ ਮਹੀਨਿਆਂ ਵਿੱਚ";
    case "COURSE_ENROLMENT": return isHi ? "पाँचों केंद्रों में" : "ਪੰਜਾਂ ਕੇਂਦਰਾਂ ਵਿੱਚ";
    case "ONLINE_ORDERS": return isHi ? "पाँचों दिनों में" : "ਪੰਜਾਂ ਦਿਨਾਂ ਵਿੱਚ";
    case "BOOK_ISSUES": return isHi ? "पाँचों सप्ताहों में" : "ਪੰਜਾਂ ਹਫ਼ਤਿਆਂ ਵਿੱਚ";
  }
}

function totalMeasure(stimulus: Di007V2Stimulus, locale: Di007LocalizationLocale, series: "A" | "B") {
  const isHi = hi(locale);
  switch (stimulus.contextId) {
    case "BANK_BRANCH_APPLICATIONS":
      return isHi
        ? (series === "A" ? "कुल प्राप्त आवेदनों की संख्या" : "कुल स्वीकृत आवेदनों की संख्या")
        : (series === "A" ? "ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ" : "ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ");
    case "INSURANCE_POLICIES":
      return isHi
        ? (series === "A" ? "नई पॉलिसियों की कुल संख्या" : "नवीनीकृत पॉलिसियों की कुल संख्या")
        : (series === "A" ? "ਨਵੀਆਂ ਪਾਲਿਸੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ" : "ਨਵੀਕਰਿਤ ਪਾਲਿਸੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ");
    case "FACTORY_OUTPUT":
      return isHi
        ? (series === "A" ? "लाइन 1 का कुल उत्पादन" : "लाइन 2 का कुल उत्पादन")
        : (series === "A" ? "ਲਾਈਨ 1 ਦਾ ਕੁੱਲ ਉਤਪਾਦਨ" : "ਲਾਈਨ 2 ਦਾ ਕੁੱਲ ਉਤਪਾਦਨ");
    case "COURSE_ENROLMENT":
      return isHi
        ? (series === "A" ? "समूह 1 का कुल नामांकन" : "समूह 2 का कुल नामांकन")
        : (series === "A" ? "ਸਮੂਹ 1 ਦਾ ਕੁੱਲ ਦਾਖ਼ਲਾ" : "ਸਮੂਹ 2 ਦਾ ਕੁੱਲ ਦਾਖ਼ਲਾ");
    case "ONLINE_ORDERS":
      return isHi
        ? (series === "A" ? "माध्यम 1 के ऑर्डरों की कुल संख्या" : "माध्यम 2 के ऑर्डरों की कुल संख्या")
        : (series === "A" ? "ਮਾਧਿਅਮ 1 ਦੇ ਆਰਡਰਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ" : "ਮਾਧਿਅਮ 2 ਦੇ ਆਰਡਰਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ");
    case "BOOK_ISSUES":
      return isHi
        ? (series === "A" ? "अनुभाग 1 से जारी पुस्तकों की कुल संख्या" : "अनुभाग 2 से जारी पुस्तकों की कुल संख्या")
        : (series === "A" ? "ਭਾਗ 1 ਤੋਂ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ" : "ਭਾਗ 2 ਤੋਂ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ");
  }
}

function averageMeasure(stimulus: Di007V2Stimulus, locale: Di007LocalizationLocale) {
  const isHi = hi(locale);
  switch (stimulus.contextId) {
    case "BANK_BRANCH_APPLICATIONS": return isHi ? "स्वीकृत आवेदनों की औसत संख्या" : "ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਔਸਤ ਗਿਣਤੀ";
    case "INSURANCE_POLICIES": return isHi ? "नवीनीकृत पॉलिसियों की औसत संख्या" : "ਨਵੀਕਰਿਤ ਪਾਲਿਸੀਆਂ ਦੀ ਔਸਤ ਗਿਣਤੀ";
    case "FACTORY_OUTPUT": return isHi ? "लाइन 2 का औसत उत्पादन" : "ਲਾਈਨ 2 ਦਾ ਔਸਤ ਉਤਪਾਦਨ";
    case "COURSE_ENROLMENT": return isHi ? "समूह 2 का औसत नामांकन" : "ਸਮੂਹ 2 ਦਾ ਔਸਤ ਦਾਖ਼ਲਾ";
    case "ONLINE_ORDERS": return isHi ? "माध्यम 2 के ऑर्डरों की औसत संख्या" : "ਮਾਧਿਅਮ 2 ਦੇ ਆਰਡਰਾਂ ਦੀ ਔਸਤ ਗਿਣਤੀ";
    case "BOOK_ISSUES": return isHi ? "अनुभाग 2 से जारी पुस्तकों की औसत संख्या" : "ਭਾਗ 2 ਤੋਂ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਔਸਤ ਗਿਣਤੀ";
  }
}

function valuePhrase(stimulus: Di007V2Stimulus, locale: Di007LocalizationLocale, series: "A" | "B") {
  const isHi = hi(locale);
  switch (stimulus.contextId) {
    case "BANK_BRANCH_APPLICATIONS":
      return isHi
        ? (series === "A" ? "प्राप्त आवेदनों की संख्या" : "स्वीकृत आवेदनों की संख्या")
        : (series === "A" ? "ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ" : "ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ");
    case "INSURANCE_POLICIES":
      return isHi
        ? (series === "A" ? "नई पॉलिसियों की संख्या" : "नवीनीकृत पॉलिसियों की संख्या")
        : (series === "A" ? "ਨਵੀਆਂ ਪਾਲਿਸੀਆਂ ਦੀ ਗਿਣਤੀ" : "ਨਵੀਕਰਿਤ ਪਾਲਿਸੀਆਂ ਦੀ ਗਿਣਤੀ");
    case "FACTORY_OUTPUT":
      return isHi
        ? (series === "A" ? "लाइन 1 का उत्पादन" : "लाइन 2 का उत्पादन")
        : (series === "A" ? "ਲਾਈਨ 1 ਦਾ ਉਤਪਾਦਨ" : "ਲਾਈਨ 2 ਦਾ ਉਤਪਾਦਨ");
    case "COURSE_ENROLMENT":
      return isHi
        ? (series === "A" ? "समूह 1 का नामांकन" : "समूह 2 का नामांकन")
        : (series === "A" ? "ਸਮੂਹ 1 ਦਾ ਦਾਖ਼ਲਾ" : "ਸਮੂਹ 2 ਦਾ ਦਾਖ਼ਲਾ");
    case "ONLINE_ORDERS":
      return isHi
        ? (series === "A" ? "माध्यम 1 के ऑर्डरों की संख्या" : "माध्यम 2 के ऑर्डरों की संख्या")
        : (series === "A" ? "ਮਾਧਿਅਮ 1 ਦੇ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ" : "ਮਾਧਿਅਮ 2 ਦੇ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ");
    case "BOOK_ISSUES":
      return isHi
        ? (series === "A" ? "अनुभाग 1 से जारी पुस्तकों की संख्या" : "अनुभाग 2 से जारी पुस्तकों की संख्या")
        : (series === "A" ? "ਭਾਗ 1 ਤੋਂ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ" : "ਭਾਗ 2 ਤੋਂ ਜਾਰੀ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ");
  }
}

function aggregateText(stimulus: Di007V2Stimulus, locale: Di007LocalizationLocale) {
  const c = stimulus.aggregateCondition;
  const l = ctx(stimulus, locale);
  const isHi = hi(locale);
  const entries = fiveEntryPhrase(stimulus, locale);
  const totalAName = totalMeasure(stimulus, locale, "A");
  const totalBName = totalMeasure(stimulus, locale, "B");
  const averageBName = averageMeasure(stimulus, locale);
  switch (c.mode) {
    case "COLUMN_TOTAL":
      return isHi
        ? `${entries} ${totalBName} ${c.value} ${l.unit} है।`
        : `${entries} ${totalBName} ${c.value} ${l.unit} ਹੈ।`;
    case "COLUMN_AVERAGE":
      return isHi
        ? `${entries} ${averageBName} ${c.value} ${l.unit} है।`
        : `${entries} ${averageBName} ${c.value} ${l.unit} ਹੈ।`;
    case "COMBINED_TOTAL":
      return isHi
        ? `दोनों कॉलमों का संयुक्त कुल ${c.value} ${l.unit} है।`
        : `ਦੋਵੇਂ ਕਾਲਮਾਂ ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਕੁੱਲ ${c.value} ${l.unit} ਹੈ।`;
    case "TOTAL_RATIO_TO_A":
      return isHi
        ? `दूसरे कॉलम के कुल और पहले कॉलम के कुल का अनुपात ${c.numerator}:${c.denominator} है।`
        : `ਦੂਜੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਅਤੇ ਪਹਿਲੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਦਾ ਅਨੁਪਾਤ ${c.numerator}:${c.denominator} ਹੈ।`;
    case "DIFFERENCE_FROM_A_TOTAL":
      return isHi
        ? `दूसरे कॉलम का कुल, पहले कॉलम के कुल से ${c.value} ${l.unit} ${c.direction === "ABOVE" ? "अधिक" : "कम"} है।`
        : `ਦੂਜੇ ਕਾਲਮ ਦਾ ਕੁੱਲ, ਪਹਿਲੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਨਾਲੋਂ ${c.value} ${l.unit} ${c.direction === "ABOVE" ? "ਵੱਧ" : "ਘੱਟ"} ਹੈ।`;
  }
}

export function localizeDi007Stimulus(stimulus: Di007V2Stimulus, locale: Di007LocalizationLocale) {
  const l = ctx(stimulus, locale);
  const condition = aggregateText(stimulus, locale);
  return {
    ...stimulus,
    title: l.title,
    instruction: hi(locale)
      ? `तालिका का अध्ययन कीजिए और प्रश्नों के उत्तर दीजिए। दूसरे कॉलम में एक मान नहीं दिया गया है। ${condition}`
      : `ਸਾਰਣੀ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ। ਦੂਜੇ ਕਾਲਮ ਵਿੱਚ ਇੱਕ ਮੁੱਲ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ। ${condition}`,
    rowLabel: l.rowLabel,
    seriesALabel: l.seriesALabel,
    seriesBLabel: l.seriesBLabel,
    seriesAMeasure: l.seriesAMeasure,
    seriesBMeasure: l.seriesBMeasure,
    unit: l.unit,
    points: stimulus.points.map((point, index) => ({ ...point, label: l.rows[index]! })),
    aggregateCondition: { ...stimulus.aggregateCondition, learnerText: condition },
  };
}

function stem(question: Di007V2Question, stimulus: Di007V2Stimulus, locale: Di007LocalizationLocale) {
  const l = ctx(stimulus, locale);
  const isHi = hi(locale);
  const v = question.stemVariant;
  const r = (index: number) => row(stimulus, locale, index);
  const aValue = valuePhrase(stimulus, locale, "A");
  const bValue = valuePhrase(stimulus, locale, "B");
  const e = question.evidence;

  switch (question.kind) {
    case "VISIBLE_ROW_COMBINED_TOTAL": {
      const name = r(Number(e.visibleIndex));
      const H = [`${name} के लिए ${aValue} और ${bValue} का योग कितना है?`, `${name} की दोनों दिखाई गई तालिका प्रविष्टियों का योग ज्ञात कीजिए।`, `${name} के लिए ${aValue} और ${bValue} जोड़िए।`];
      const P = [`${name} ਲਈ ${aValue} ਅਤੇ ${bValue} ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`, `${name} ਦੀਆਂ ਦੋਵੇਂ ਦਿਖਾਈ ਗਈਆਂ ਸਾਰਣੀ ਦਰਜਾਂ ਦਾ ਜੋੜ ਕੱਢੋ।`, `${name} ਲਈ ${aValue} ਅਤੇ ${bValue} ਜੋੜੋ।`];
      return (isHi ? H : P)[v]!;
    }
    case "VISIBLE_ROW_DIFFERENCE": {
      const name = r(Number(e.visibleIndex));
      const H = [`${name} के लिए ${l.seriesAMeasure} और ${l.seriesBMeasure} में कितना अंतर है?`, `${name} की दोनों तालिका प्रविष्टियों के मानों में कितना अंतर है?`, `${name} के दोनों मानों का निरपेक्ष अंतर ज्ञात कीजिए।`];
      const P = [`${name} ਲਈ ${l.seriesAMeasure} ਅਤੇ ${l.seriesBMeasure} ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`, `${name} ਦੀਆਂ ਦੋਵੇਂ ਸਾਰਣੀ ਦਰਜਾਂ ਦੇ ਮੁੱਲਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`, `${name} ਦੇ ਦੋਵੇਂ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`];
      return (isHi ? H : P)[v]!;
    }
    case "RECOVER_MISSING_VALUE": {
      const name = r(stimulus.hiddenIndex);
      const H = [`${name} के लिए दूसरे कॉलम का लुप्त मान कितना है?`, `${name} में प्रश्न चिह्न के स्थान पर कौन-सा मान आएगा?`, `${name} की लुप्त प्रविष्टि का मान ज्ञात कीजिए।`];
      const P = [`${name} ਲਈ ਦੂਜੇ ਕਾਲਮ ਦਾ ਗੁੰਮ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`, `${name} ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕਿਹੜਾ ਮੁੱਲ ਆਵੇਗਾ?`, `${name} ਦੀ ਗੁੰਮ ਦਰਜ ਦਾ ਮੁੱਲ ਕੱਢੋ।`];
      return (isHi ? H : P)[v]!;
    }
    case "HIDDEN_ROW_COMBINED_TOTAL": {
      const name = r(stimulus.hiddenIndex);
      const H = [`${name} की दोनों तालिका प्रविष्टियों का योग कितना है?`, `लुप्त मान ज्ञात करने के बाद ${name} की दोनों प्रविष्टियों का कुल कितना है?`, `${name} की दोनों प्रविष्टियाँ जोड़कर कुल ज्ञात कीजिए।`];
      const P = [`${name} ਦੀਆਂ ਦੋਵੇਂ ਸਾਰਣੀ ਦਰਜਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`, `ਗੁੰਮ ਮੁੱਲ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ${name} ਦੀਆਂ ਦੋਵੇਂ ਦਰਜਾਂ ਦਾ ਕੁੱਲ ਕਿੰਨਾ ਹੈ?`, `${name} ਦੀਆਂ ਦੋਵੇਂ ਦਰਜਾਂ ਜੋੜ ਕੇ ਕੁੱਲ ਕੱਢੋ।`];
      return (isHi ? H : P)[v]!;
    }
    case "MISSING_TO_PAIRED_RATIO": {
      const name = r(stimulus.hiddenIndex);
      const H = [`${name} के लिए ${bValue} और ${aValue} का अनुपात क्या है?`, `${name} के लिए ${bValue} : ${aValue} का सरल अनुपात ज्ञात कीजिए।`, `लुप्त मान ज्ञात करने के बाद ${name} के लिए ${bValue} : ${aValue} का अनुपात ज्ञात कीजिए।`];
      const P = [`${name} ਲਈ ${bValue} ਅਤੇ ${aValue} ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${name} ਲਈ ${bValue} : ${aValue} ਦਾ ਸਰਲ ਅਨੁਪਾਤ ਕੱਢੋ।`, `ਗੁੰਮ ਮੁੱਲ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ${name} ਲਈ ${bValue} : ${aValue} ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`];
      return (isHi ? H : P)[v]!;
    }
    case "B_TOTAL_AS_PERCENT_OF_A_TOTAL": {
      const H = [`दूसरे कॉलम का कुल, पहले कॉलम के कुल का कितने प्रतिशत है?`, `दूसरे कॉलम के कुल को पहले कॉलम के कुल के प्रतिशत के रूप में व्यक्त कीजिए।`, `दोनों कॉलमों के कुल की तुलना कीजिए। दूसरे कॉलम का कुल, पहले कॉलम के कुल का कितने प्रतिशत है?`];
      const P = [`ਦੂਜੇ ਕਾਲਮ ਦਾ ਕੁੱਲ, ਪਹਿਲੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `ਦੂਜੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਨੂੰ ਪਹਿਲੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਜੋਂ ਦਰਸਾਓ।`, `ਦੋਵੇਂ ਕਾਲਮਾਂ ਦੇ ਕੁੱਲ ਦੀ ਤੁਲਨਾ ਕਰੋ। ਦੂਜੇ ਕਾਲਮ ਦਾ ਕੁੱਲ, ਪਹਿਲੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`];
      return (isHi ? H : P)[v]!;
    }
    case "MISSING_SHARE_OF_B_TOTAL": {
      const name = r(stimulus.hiddenIndex);
      const H = [`${name} का लुप्त मान, दूसरे कॉलम के कुल का कितने प्रतिशत है?`, `दूसरे कॉलम के कुल में ${name} की हिस्सेदारी कितने प्रतिशत है?`, `${name} का लुप्त मान ज्ञात करने के बाद बताइए कि वह दूसरे कॉलम के कुल का कितने प्रतिशत है।`];
      const P = [`${name} ਦਾ ਗੁੰਮ ਮੁੱਲ, ਦੂਜੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `ਦੂਜੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਵਿੱਚ ${name} ਦਾ ਹਿੱਸਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `${name} ਦਾ ਗੁੰਮ ਮੁੱਲ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਦੱਸੋ ਕਿ ਉਹ ਦੂਜੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ।`];
      return (isHi ? H : P)[v]!;
    }
    case "VISIBLE_TWO_ROW_B_TOTAL": {
      const a = r(Number(e.visibleI)), b = r(Number(e.visibleJ));
      const H = [`${a} और ${b} के दूसरे कॉलम के मानों का योग कितना है?`, `${a} और ${b} की दूसरे कॉलम की प्रविष्टियाँ जोड़िए।`, `${a} और ${b} के दूसरे कॉलम के मानों का संयुक्त कुल ज्ञात कीजिए।`];
      const P = [`${a} ਅਤੇ ${b} ਦੇ ਦੂਜੇ ਕਾਲਮ ਦੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`, `${a} ਅਤੇ ${b} ਦੀਆਂ ਦੂਜੇ ਕਾਲਮ ਵਾਲੀਆਂ ਦਰਜਾਂ ਜੋੜੋ।`, `${a} ਅਤੇ ${b} ਦੇ ਦੂਜੇ ਕਾਲਮ ਦੇ ਮੁੱਲਾਂ ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਕੁੱਲ ਕੱਢੋ।`];
      return (isHi ? H : P)[v]!;
    }
    case "MISSING_AS_PERCENT_OF_PAIRED_A": {
      const name = r(stimulus.hiddenIndex);
      const H = [`${name} के लिए ${bValue}, ${aValue} का कितने प्रतिशत है?`, `${name} का लुप्त मान ज्ञात करने के बाद उसे ${aValue} के प्रतिशत के रूप में व्यक्त कीजिए।`, `${name} के लिए ${bValue}, ${aValue} का कितने प्रतिशत है?`];
      const P = [`${name} ਲਈ ${bValue}, ${aValue} ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `${name} ਦਾ ਗੁੰਮ ਮੁੱਲ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਉਸ ਨੂੰ ${aValue} ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਜੋਂ ਦਰਸਾਓ।`, `${name} ਲਈ ${bValue}, ${aValue} ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`];
      return (isHi ? H : P)[v]!;
    }
    case "COMBINED_HIDDEN_VISIBLE_SHARE_OF_B_TOTAL": {
      const hrow = r(stimulus.hiddenIndex), other = r(Number(e.visibleIndex));
      const H = [`${hrow} और ${other} के दूसरे कॉलम के मानों का योग, दूसरे कॉलम के कुल का कितने प्रतिशत है?`, `दूसरे कॉलम के कुल में ${hrow} और ${other} की संयुक्त हिस्सेदारी कितने प्रतिशत है?`, `लुप्त मान ज्ञात करने के बाद ${hrow} और ${other} की संयुक्त हिस्सेदारी दूसरे कॉलम के कुल के प्रतिशत के रूप में ज्ञात कीजिए।`];
      const P = [`${hrow} ਅਤੇ ${other} ਦੇ ਦੂਜੇ ਕਾਲਮ ਦੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ, ਦੂਜੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `ਦੂਜੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਵਿੱਚ ${hrow} ਅਤੇ ${other} ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਹਿੱਸਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`, `ਗੁੰਮ ਮੁੱਲ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ${hrow} ਅਤੇ ${other} ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਹਿੱਸਾ ਦੂਜੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਜੋਂ ਕੱਢੋ।`];
      return (isHi ? H : P)[v]!;
    }
    case "HIDDEN_VS_VISIBLE_B_PERCENT_EXCESS": {
      const hrow = r(stimulus.hiddenIndex), other = r(Number(e.visibleIndex));
      const hidden = missingValue(stimulus), visible = stimulus.points[Number(e.visibleIndex)]!.seriesB;
      const larger = hidden >= visible ? hrow : other, smaller = hidden >= visible ? other : hrow;
      const H = [`${larger} का दूसरे कॉलम का मान, ${smaller} के दूसरे कॉलम के मान से कितने प्रतिशत अधिक है?`, `${hrow} और ${other} के दूसरे कॉलम के मानों में बड़ा मान छोटे मान से कितने प्रतिशत अधिक है?`, `${hrow} और ${other} के दूसरे कॉलम के मानों की तुलना कीजिए। बड़ा मान छोटे मान से कितने प्रतिशत अधिक है?`];
      const P = [`${larger} ਦਾ ਦੂਜੇ ਕਾਲਮ ਦਾ ਮੁੱਲ, ${smaller} ਦੇ ਦੂਜੇ ਕਾਲਮ ਦੇ ਮੁੱਲ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${hrow} ਅਤੇ ${other} ਦੇ ਦੂਜੇ ਕਾਲਮ ਦੇ ਮੁੱਲਾਂ ਵਿੱਚ ਵੱਡਾ ਮੁੱਲ ਛੋਟੇ ਮੁੱਲ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`, `${hrow} ਅਤੇ ${other} ਦੇ ਦੂਜੇ ਕਾਲਮ ਦੇ ਮੁੱਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ। ਵੱਡਾ ਮੁੱਲ ਛੋਟੇ ਮੁੱਲ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`];
      return (isHi ? H : P)[v]!;
    }
    case "HIDDEN_ROW_TO_VISIBLE_ROW_TOTAL_RATIO": {
      const hrow = r(stimulus.hiddenIndex), other = r(Number(e.visibleIndex));
      const H = [`${hrow} की दोनों प्रविष्टियों के योग और ${other} की दोनों प्रविष्टियों के योग का अनुपात क्या है?`, `${hrow} और ${other} की पंक्ति-राशियों का अनुपात ज्ञात कीजिए।`, `लुप्त मान ज्ञात करने के बाद ${hrow} और ${other} में दोनों कॉलमों के योग का अनुपात ज्ञात कीजिए।`];
      const P = [`${hrow} ਦੀਆਂ ਦੋਵੇਂ ਦਰਜਾਂ ਦੇ ਜੋੜ ਅਤੇ ${other} ਦੀਆਂ ਦੋਵੇਂ ਦਰਜਾਂ ਦੇ ਜੋੜ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${hrow} ਅਤੇ ${other} ਦੀਆਂ ਕਤਾਰ-ਰਕਮਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`, `ਗੁੰਮ ਮੁੱਲ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ${hrow} ਅਤੇ ${other} ਵਿੱਚ ਦੋਵੇਂ ਕਾਲਮਾਂ ਦੇ ਜੋੜ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`];
      return (isHi ? H : P)[v]!;
    }
  }
}

function explanation(question: Di007V2Question, stimulus: Di007V2Stimulus, locale: Di007LocalizationLocale) {
  const l = ctx(stimulus, locale);
  const isHi = hi(locale);
  const aTotal = totalA(stimulus), bTotal = totalB(stimulus), hidden = missingValue(stimulus);
  const visibleB = bTotal - hidden;
  const r = (index: number) => row(stimulus, locale, index);
  const e = question.evidence;
  const bTotalName = totalMeasure(stimulus, locale, "B");
  const recovery = isHi
    ? `${bTotalName} = ${bTotal}; चार दिखाई गई प्रविष्टियों का योग = ${visibleB}; इसलिए लुप्त मान = ${bTotal} - ${visibleB} = ${hidden}।`
    : `${bTotalName} = ${bTotal}; ਚਾਰ ਦਿਖਾਈ ਗਈਆਂ ਦਰਜਾਂ ਦਾ ਜੋੜ = ${visibleB}; ਇਸ ਲਈ ਗੁੰਮ ਮੁੱਲ = ${bTotal} - ${visibleB} = ${hidden}।`;

  switch (question.kind) {
    case "VISIBLE_ROW_COMBINED_TOTAL": {
      const i = Number(e.visibleIndex), p = stimulus.points[i]!, name = r(i), sum = p.seriesA + p.seriesB;
      return { keyIdea: isHi ? "दोनों मान दिखाई दे रहे हैं, इसलिए उन्हें जोड़ें।" : "ਦੋਵੇਂ ਮੁੱਲ ਦਿਖਾਈ ਦੇ ਰਹੇ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਨੂੰ ਜੋੜੋ।", steps: [`${name}: ${l.seriesALabel} = ${p.seriesA}, ${l.seriesBLabel} = ${p.seriesB}।`, isHi ? `संयुक्त मान = ${p.seriesA} + ${p.seriesB} = ${sum}।` : `ਮਿਲਿਆ ਹੋਇਆ ਮੁੱਲ = ${p.seriesA} + ${p.seriesB} = ${sum}।`] };
    }
    case "VISIBLE_ROW_DIFFERENCE": {
      const i = Number(e.visibleIndex), p = stimulus.points[i]!, name = r(i), d = Math.abs(p.seriesA - p.seriesB);
      return { keyIdea: isHi ? "दोनों मान दिखाई दे रहे हैं। बड़े मान में से छोटा मान घटाएँ।" : "ਦੋਵੇਂ ਮੁੱਲ ਦਿਖਾਈ ਦੇ ਰਹੇ ਹਨ। ਵੱਡੇ ਮੁੱਲ ਵਿਚੋਂ ਛੋਟਾ ਮੁੱਲ ਘਟਾਓ।", steps: [`${name}: ${l.seriesALabel} = ${p.seriesA}, ${l.seriesBLabel} = ${p.seriesB}।`, isHi ? `अंतर = ${Math.max(p.seriesA,p.seriesB)} - ${Math.min(p.seriesA,p.seriesB)} = ${d}।` : `ਅੰਤਰ = ${Math.max(p.seriesA,p.seriesB)} - ${Math.min(p.seriesA,p.seriesB)} = ${d}।`] };
    }
    case "RECOVER_MISSING_VALUE":
      return { keyIdea: isHi ? "अतिरिक्त शर्त से दूसरे कॉलम का कुल ज्ञात करें और चार दिखाई गई प्रविष्टियाँ घटाएँ।" : "ਵਾਧੂ ਸ਼ਰਤ ਤੋਂ ਦੂਜੇ ਕਾਲਮ ਦਾ ਕੁੱਲ ਕੱਢੋ ਅਤੇ ਚਾਰ ਦਿਖਾਈ ਗਈਆਂ ਦਰਜਾਂ ਘਟਾਓ।", steps: [recovery] };
    case "HIDDEN_ROW_COMBINED_TOTAL": {
      const p = stimulus.points[stimulus.hiddenIndex]!, name = r(stimulus.hiddenIndex), sum = p.seriesA + hidden;
      return { keyIdea: isHi ? "पहले लुप्त मान ज्ञात करें, फिर उसी पंक्ति के दोनों मान जोड़ें।" : "ਪਹਿਲਾਂ ਗੁੰਮ ਮੁੱਲ ਕੱਢੋ, ਫਿਰ ਉਸੇ ਕਤਾਰ ਦੇ ਦੋਵੇਂ ਮੁੱਲ ਜੋੜੋ।", steps: [recovery, `${name}: ${p.seriesA} + ${hidden} = ${sum}।`] };
    }
    case "MISSING_TO_PAIRED_RATIO": {
      const p = stimulus.points[stimulus.hiddenIndex]!, name = r(stimulus.hiddenIndex);
      return { keyIdea: isHi ? "लुप्त मान ज्ञात करके उसी पंक्ति के दोनों मानों का अनुपात सरल करें।" : "ਗੁੰਮ ਮੁੱਲ ਕੱਢ ਕੇ ਉਸੇ ਕਤਾਰ ਦੇ ਦੋਵੇਂ ਮੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।", steps: [recovery, `${name}: ${hidden}:${p.seriesA} = ${question.answer}।`] };
    }
    case "B_TOTAL_AS_PERCENT_OF_A_TOTAL":
      return { keyIdea: isHi ? "दोनों कॉलमों के कुल ज्ञात करके दूसरे कुल को पहले कुल के प्रतिशत के रूप में लिखें।" : "ਦੋਵੇਂ ਕਾਲਮਾਂ ਦੇ ਕੁੱਲ ਕੱਢ ਕੇ ਦੂਜੇ ਕੁੱਲ ਨੂੰ ਪਹਿਲੇ ਕੁੱਲ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਜੋਂ ਲਿਖੋ।", steps: [recovery, `${bTotal}/${aTotal} × 100 = ${question.answer}।`] };
    case "MISSING_SHARE_OF_B_TOTAL":
      return { keyIdea: isHi ? "लुप्त मान को दूसरे कॉलम के पूर्ण कुल से भाग देकर 100 से गुणा करें।" : "ਗੁੰਮ ਮੁੱਲ ਨੂੰ ਦੂਜੇ ਕਾਲਮ ਦੇ ਪੂਰੇ ਕੁੱਲ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।", steps: [recovery, `${hidden}/${bTotal} × 100 = ${question.answer}।`] };
    case "VISIBLE_TWO_ROW_B_TOTAL": {
      const i = Number(e.visibleI), j = Number(e.visibleJ), x = stimulus.points[i]!.seriesB, y = stimulus.points[j]!.seriesB;
      return { keyIdea: isHi ? "दोनों पूछी गई दिखाई देने वाली प्रविष्टियाँ जोड़ें।" : "ਦੋਵੇਂ ਪੁੱਛੀਆਂ ਗਈਆਂ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀਆਂ ਦਰਜਾਂ ਜੋੜੋ।", steps: [`${r(i)} = ${x}; ${r(j)} = ${y}।`, isHi ? `संयुक्त मान = ${x} + ${y} = ${x+y}।` : `ਮਿਲਿਆ ਹੋਇਆ ਮੁੱਲ = ${x} + ${y} = ${x+y}।`] };
    }
    case "MISSING_AS_PERCENT_OF_PAIRED_A": {
      const p = stimulus.points[stimulus.hiddenIndex]!;
      return { keyIdea: isHi ? "पहले लुप्त मान ज्ञात करें, फिर उसे उसी पंक्ति के पहले कॉलम मान के प्रतिशत के रूप में लिखें।" : "ਪਹਿਲਾਂ ਗੁੰਮ ਮੁੱਲ ਕੱਢੋ, ਫਿਰ ਉਸ ਨੂੰ ਉਸੇ ਕਤਾਰ ਦੇ ਪਹਿਲੇ-ਕਾਲਮ ਮੁੱਲ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਜੋਂ ਲਿਖੋ।", steps: [recovery, `${hidden}/${p.seriesA} × 100 = ${question.answer}।`] };
    }
    case "COMBINED_HIDDEN_VISIBLE_SHARE_OF_B_TOTAL": {
      const i = Number(e.visibleIndex), x = stimulus.points[i]!.seriesB, n = hidden + x;
      return { keyIdea: isHi ? "लुप्त मान और पूछी गई दिखाई देने वाली प्रविष्टि जोड़ें, फिर योग को दूसरे कॉलम के कुल के प्रतिशत के रूप में लिखें।" : "ਗੁੰਮ ਮੁੱਲ ਅਤੇ ਪੁੱਛੀ ਗਈ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀ ਦਰਜ ਜੋੜੋ, ਫਿਰ ਜੋੜ ਨੂੰ ਦੂਜੇ ਕਾਲਮ ਦੇ ਕੁੱਲ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਜੋਂ ਲਿਖੋ।", steps: [recovery, `${r(stimulus.hiddenIndex)} + ${r(i)} = ${hidden} + ${x} = ${n}।`, `${n}/${bTotal} × 100 = ${question.answer}।`] };
    }
    case "HIDDEN_VS_VISIBLE_B_PERCENT_EXCESS": {
      const i = Number(e.visibleIndex), x = stimulus.points[i]!.seriesB, larger = Math.max(hidden,x), smaller = Math.min(hidden,x), d = larger-smaller;
      return { keyIdea: isHi ? "लुप्त मान ज्ञात करें, अंतर निकालें और अंतर को छोटे मान से भाग देकर 100 से गुणा करें।" : "ਗੁੰਮ ਮੁੱਲ ਕੱਢੋ, ਅੰਤਰ ਕੱਢੋ ਅਤੇ ਅੰਤਰ ਨੂੰ ਛੋਟੇ ਮੁੱਲ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।", steps: [recovery, isHi ? `अंतर = ${larger} - ${smaller} = ${d}।` : `ਅੰਤਰ = ${larger} - ${smaller} = ${d}।`, `${d}/${smaller} × 100 = ${question.answer}।`] };
    }
    case "HIDDEN_ROW_TO_VISIBLE_ROW_TOTAL_RATIO": {
      const i = Number(e.visibleIndex), hp = stimulus.points[stimulus.hiddenIndex]!, vp = stimulus.points[i]!, hsum=hp.seriesA+hidden, vsum=vp.seriesA+vp.seriesB;
      return { keyIdea: isHi ? "लुप्त मान ज्ञात करें, दोनों पंक्तियों के दो-दो मान जोड़ें और पंक्ति-कुलों का अनुपात सरल करें।" : "ਗੁੰਮ ਮੁੱਲ ਕੱਢੋ, ਦੋਵੇਂ ਕਤਾਰਾਂ ਦੇ ਦੋ-ਦੋ ਮੁੱਲ ਜੋੜੋ ਅਤੇ ਕਤਾਰ-ਕੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।", steps: [recovery, `${r(stimulus.hiddenIndex)} = ${hp.seriesA} + ${hidden} = ${hsum}; ${r(i)} = ${vp.seriesA} + ${vp.seriesB} = ${vsum}।`, `${hsum}:${vsum} = ${question.answer}।`] };
    }
  }
}

export function localizeDi007Question(
  source: ReturnType<typeof generateDi007PermanentQuestion>,
  locale: Di007LocalizationLocale,
) {
  const localizedStimulus = localizeDi007Stimulus(source.stimulus, locale);
  return {
    packageId: "DI-007" as const,
    requestedSeed: source.requestedSeed,
    sourceSeed: source.sourceSeed,
    examProfile: source.examProfile,
    language: locale === "hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationReviewId: DI007_LOCALIZATION_REVIEW_ID,
    localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
    sourceEnglishStatus: "ENGLISH_REVIEW_APPROVED" as const,
    stimulus: localizedStimulus,
    question: {
      ...source.question,
      stem: stem(source.question, source.stimulus, locale),
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

export function generateDi007LocalizedReviewQuestion(input: {
  seed: string;
  examProfile: Di007V2ExamProfile;
  taskKind: Di007V2TaskKind;
  locale: Di007LocalizationLocale;
}) {
  return localizeDi007Question(
    generateDi007PermanentQuestion({
      seed: input.seed,
      examProfile: input.examProfile,
      taskKind: input.taskKind,
    }),
    input.locale,
  );
}

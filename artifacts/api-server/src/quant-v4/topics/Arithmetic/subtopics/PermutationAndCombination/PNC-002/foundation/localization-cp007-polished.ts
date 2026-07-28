import {
  buildPnc002Cp007LocalizedPresentation as buildReviewedPresentation,
  PNC_002_CP007_LOCALIZATION_PILOT,
} from "./localization-cp007-reviewed";
import type {
  PncStudentExplanationSection,
  PncStudentSourcePackage,
} from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export { PNC_002_CP007_LOCALIZATION_PILOT };

const numberFormatter = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

function optionNumber(value: string): number {
  const numeric = Number(value.replace(/,/g, "").trim());
  if (!Number.isSafeInteger(numeric) || numeric <= 0) {
    throw new Error(`PNC CP-007 polished option is invalid: ${value}`);
  }
  return numeric;
}

function bookOption(value: string, locale: PncStudentLocale): string {
  const numeric = optionNumber(value);
  const noun = locale === "hi-IN"
    ? (numeric === 1 ? "किताब" : "किताबें")
    : (numeric === 1 ? "ਕਿਤਾਬ" : "ਕਿਤਾਬਾਂ");
  return `${numberFormatter.format(numeric)} ${noun}`;
}

function replaceOptionLabels(
  line: string,
  oldOptions: string[],
  newOptions: string[],
): string {
  let result = line;
  for (let index = 0; index < oldOptions.length; index += 1) {
    result = result.replace(oldOptions[index]!, newOptions[index]!);
  }
  return result;
}

function polishStem(value: string, locale: PncStudentLocale): string {
  let result = value
    .replace(/(\d[\d,]*), (?=व्यवस्थाएँ|तरीके|है|ਹੈ)/g, "$1 ")
    .replace(/(\d[\d,]*), (?=ਤਰੀਕੇ)/g, "$1 ");

  if (locale === "hi-IN") {
    result = result
      .replace(/कितने रैखिक क्रम संभव हैं\?/g, "उन्हें सीधी पंक्ति में कितने तरीकों से सजाया जा सकता है?")
      .replace(/रैखिक व्यवस्थाओं की संख्या क्या होगी\?/g, "उन्हें सीधी पंक्ति में कितने तरीकों से बैठाया जा सकता है?")
      .replace(/कितने रैखिक क्रमों में/g, "सीधी पंक्ति की कितनी व्यवस्थाओं में")
      .replace(/रैखिक व्यवस्थाएँ बनती हैं/g, "सीधी पंक्ति की व्यवस्थाएँ बनती हैं");
  } else {
    result = result
      .replace(/ਕਿੰਨੇ ਸਿੱਧੇ ਕ੍ਰਮ ਸੰਭਵ ਹਨ\?/g, "ਉਹਨਾਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਕਿੰਨੇ ਤਰੀਕਿਆਂ ਨਾਲ ਲਗਾਇਆ ਜਾ ਸਕਦਾ ਹੈ?")
      .replace(/ਕਿੰਨੇ ਸਿੱਧੇ ਕ੍ਰਮਾਂ ਵਿੱਚ/g, "ਸਿੱਧੀ ਕਤਾਰ ਦੇ ਕਿੰਨੇ ਤਰੀਕਿਆਂ ਵਿੱਚ")
      .replace(/ਸਿੱਧੇ ਕ੍ਰਮ ਬਣਦੇ ਹਨ/g, "ਸਿੱਧੀ ਕਤਾਰ ਦੇ ਤਰੀਕੇ ਬਣਦੇ ਹਨ");
  }
  return result;
}

function polishStepLine(value: string, locale: PncStudentLocale): string {
  if (locale === "hi-IN") {
    return value
      .replace("**अगला चरण गिनें:**", "**अगली गणना करें:**")
      .replace("**व्यवस्था गुणक खोलें:**", "**फैक्टोरियल का मान निकालें:**")
      .replace("**गिने हुए चरण जोड़ें:**", "**सभी चरण मिलाएँ:**");
  }
  return value
    .replace("**ਅਗਲਾ ਕਦਮ ਗਿਣੋ:**", "**ਅਗਲੀ ਗਿਣਤੀ ਕਰੋ:**")
    .replace("**ਕ੍ਰਮ ਵਾਲਾ ਗੁਣਕ ਖੋਲ੍ਹੋ:**", "**ਫੈਕਟੋਰੀਅਲ ਦਾ ਮੁੱਲ ਕੱਢੋ:**")
    .replace("**ਗਿਣੇ ਹੋਏ ਕਦਮ ਜੋੜੋ:**", "**ਸਾਰੇ ਕਦਮ ਇਕੱਠੇ ਕਰੋ:**");
}

function naturalInverseLine(value: string, locale: PncStudentLocale): string {
  if (locale === "hi-IN") {
    return value
      .replace(/\$([nk])\$ के हर अनुमत मान पर/g, (_match, variable: string) => `दी गई सीमा में $${variable}$ के हर संभव मान पर`)
      .replace(/केवल दी गई सीमा के मान जाँचिए/g, "दी गई सीमा के मान एक-एक करके जाँचिए")
      .replace(/लक्ष्य संख्या/g, "दी गई संख्या")
      .replace(/स्वीकार्य उत्तर/g, "सही उत्तर");
  }
  return value
    .replace(/\$([nk])\$ ਦੇ ਹਰ ਮਨਜ਼ੂਰ ਮੁੱਲ ਉੱਤੇ/g, (_match, variable: string) => `ਦਿੱਤੀ ਹੱਦ ਵਿੱਚ $${variable}$ ਦੇ ਹਰ ਸੰਭਵ ਮੁੱਲ ਉੱਤੇ`)
    .replace(/ਸਿਰਫ਼ ਦਿੱਤੀ ਹੱਦ ਦੇ ਮੁੱਲ ਜਾਂਚੋ/g, "ਦਿੱਤੀ ਹੱਦ ਦੇ ਮੁੱਲ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਜਾਂਚੋ")
    .replace(/ਟੀਚਾ ਗਿਣਤੀ/g, "ਦਿੱਤੀ ਗਿਣਤੀ")
    .replace(/ਮਨਜ਼ੂਰ ਉੱਤਰ/g, "ਸਹੀ ਉੱਤਰ");
}

function coreOverride(
  qlId: string,
  locale: PncStudentLocale,
): { heading?: string; lines?: string[] } | undefined {
  const hi = locale === "hi-IN";
  switch (qlId) {
    case "PNC-QL-109":
      return { lines: hi
        ? ["पहले सभी बिना-शर्त व्यवस्थाएँ गिनिए।", "फिर जोड़ा साथ होने की व्यवस्थाएँ घटाइए; साथ होने पर दोनों व्यक्ति एक ब्लॉक बनते हैं।"]
        : ["ਪਹਿਲਾਂ ਸਾਰੇ ਬਿਨਾਂ-ਸ਼ਰਤ ਤਰੀਕੇ ਗਿਣੋ।", "ਫਿਰ ਜੋੜਾ ਇਕੱਠਾ ਹੋਣ ਵਾਲੇ ਤਰੀਕੇ ਘਟਾਓ; ਇਕੱਠੇ ਹੋਣ ਉੱਤੇ ਦੋਵੇਂ ਵਿਅਕਤੀ ਇੱਕ ਬਲਾਕ ਬਣਦੇ ਹਨ।"] };
    case "PNC-QL-110":
      return { lines: hi
        ? ["पहले फाइलों के सभी बिना-शर्त क्रम गिनिए।", "फिर वे क्रम घटाइए जिनमें सभी निश्चित फाइलें एक ही लगातार ब्लॉक बनाती हैं।"]
        : ["ਪਹਿਲਾਂ ਫਾਈਲਾਂ ਦੇ ਸਾਰੇ ਬਿਨਾਂ-ਸ਼ਰਤ ਕ੍ਰਮ ਗਿਣੋ।", "ਫਿਰ ਉਹ ਕ੍ਰਮ ਘਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਸਾਰੀਆਂ ਖਾਸ ਫਾਈਲਾਂ ਇੱਕੋ ਲਗਾਤਾਰ ਬਲਾਕ ਬਣਾਉਂਦੀਆਂ ਹਨ।"] };
    case "PNC-QL-115":
      return { lines: hi
        ? ["जरूरी समूह को एक ब्लॉक बनाइए और उसके भीतर के क्रम अलग से गिनिए।", "बची हुई इकाइयों में दूसरे निश्चित जोड़े के साथ आने वाले क्रम घटाइए।"]
        : ["ਲੋੜੀਂਦੇ ਸਮੂਹ ਨੂੰ ਇੱਕ ਬਲਾਕ ਬਣਾਓ ਅਤੇ ਉਸਦੇ ਅੰਦਰਲੇ ਕ੍ਰਮ ਵੱਖਰੇ ਗਿਣੋ।", "ਬਚੀਆਂ ਇਕਾਈਆਂ ਵਿੱਚ ਦੂਜੇ ਖਾਸ ਜੋੜੇ ਦੇ ਇਕੱਠੇ ਆਉਣ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ।"] };
    case "PNC-QL-119":
      return { lines: hi
        ? ["दोनों निश्चित जोड़ों को दो अलग ब्लॉक बनाइए।", "सभी बाहरी क्रमों में से दोनों ब्लॉकों के पास-पास वाले क्रम घटाइए, फिर दोनों जोड़ों के भीतर के क्रम गिनिए।"]
        : ["ਦੋਵੇਂ ਖਾਸ ਜੋੜਿਆਂ ਨੂੰ ਦੋ ਵੱਖਰੇ ਬਲਾਕ ਬਣਾਓ।", "ਸਾਰੇ ਬਾਹਰਲੇ ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ਦੋਵੇਂ ਬਲਾਕਾਂ ਦੇ ਨਾਲ-ਨਾਲ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ, ਫਿਰ ਦੋਵੇਂ ਜੋੜਿਆਂ ਦੇ ਅੰਦਰਲੇ ਕ੍ਰਮ ਗਿਣੋ।"] };
    case "PNC-QL-120":
      return { lines: hi
        ? ["निश्चित जोड़े और तिकड़ी को दो अलग ब्लॉक बनाइए।", "सभी बाहरी क्रमों में से दोनों ब्लॉकों के पास-पास वाले क्रम घटाइए, फिर जोड़े और तिकड़ी के भीतर के क्रम गिनिए।"]
        : ["ਖਾਸ ਜੋੜੇ ਅਤੇ ਤਿੱਕੜੀ ਨੂੰ ਦੋ ਵੱਖਰੇ ਬਲਾਕ ਬਣਾਓ।", "ਸਾਰੇ ਬਾਹਰਲੇ ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ਦੋਵੇਂ ਬਲਾਕਾਂ ਦੇ ਨਾਲ-ਨਾਲ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ, ਫਿਰ ਜੋੜੇ ਅਤੇ ਤਿੱਕੜੀ ਦੇ ਅੰਦਰਲੇ ਕ੍ਰਮ ਗਿਣੋ।"] };
    case "PNC-QL-121":
      return {
        heading: hi
          ? "📌 मूल अवधारणा — समूह का ब्लॉक और बाहरी व्यक्ति"
          : "📌 ਮੁੱਖ ਵਿਚਾਰ — ਸਮੂਹ ਦਾ ਬਲਾਕ ਅਤੇ ਬਾਹਰਲਾ ਵਿਅਕਤੀ",
        lines: hi
          ? ["निश्चित समूह को एक ब्लॉक मानिए और बताए गए बाहरी व्यक्ति को अलग इकाई रखिए।", "सभी इकाई-क्रमों में से वे क्रम घटाइए जिनमें बाहरी व्यक्ति ब्लॉक के ठीक पहले या बाद में है।"]
          : ["ਖਾਸ ਸਮੂਹ ਨੂੰ ਇੱਕ ਬਲਾਕ ਮੰਨੋ ਅਤੇ ਦੱਸੇ ਹੋਏ ਬਾਹਰਲੇ ਵਿਅਕਤੀ ਨੂੰ ਵੱਖਰੀ ਇਕਾਈ ਰੱਖੋ।", "ਸਾਰੇ ਇਕਾਈ-ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ਉਹ ਕ੍ਰਮ ਘਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਬਾਹਰਲਾ ਵਿਅਕਤੀ ਬਲਾਕ ਦੇ ਬਿਲਕੁਲ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਹੈ।"],
      };
    case "PNC-QL-122":
      return { lines: hi
        ? ["पहले निश्चित जोड़े को एक ब्लॉक बनाकर उसकी सभी व्यवस्थाएँ गिनिए।", "फिर वे मामले घटाइए जिनमें अलग तिकड़ी भी एक लगातार ब्लॉक बनाती है।"]
        : ["ਪਹਿਲਾਂ ਖਾਸ ਜੋੜੇ ਨੂੰ ਇੱਕ ਬਲਾਕ ਬਣਾਕੇ ਉਸਦੇ ਸਾਰੇ ਤਰੀਕੇ ਗਿਣੋ।", "ਫਿਰ ਉਹ ਮਾਮਲੇ ਘਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਵੱਖਰੀ ਤਿੱਕੜੀ ਵੀ ਇੱਕ ਲਗਾਤਾਰ ਬਲਾਕ ਬਣਾਉਂਦੀ ਹੈ।"] };
    case "PNC-QL-123":
      return { lines: hi
        ? ["पहले सभी बिना-शर्त व्यवस्थाएँ गिनिए।", "‘कम-से-कम एक जोड़ा साथ नहीं’ के लिए केवल वे क्रम घटाइए जिनमें दोनों निश्चित जोड़े एक साथ ब्लॉक बनाते हैं।"]
        : ["ਪਹਿਲਾਂ ਸਾਰੇ ਬਿਨਾਂ-ਸ਼ਰਤ ਤਰੀਕੇ ਗਿਣੋ।", "‘ਘੱਟੋ-ਘੱਟ ਇੱਕ ਜੋੜਾ ਇਕੱਠਾ ਨਹੀਂ’ ਲਈ ਸਿਰਫ਼ ਉਹ ਕ੍ਰਮ ਘਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਦੋਵੇਂ ਖਾਸ ਜੋੜੇ ਇੱਕੋ ਵੇਲੇ ਬਲਾਕ ਬਣਾਉਂਦੇ ਹਨ।"] };
    default:
      return undefined;
  }
}

function polishTrapLine(value: string, locale: PncStudentLocale): string {
  if (locale === "hi-IN") {
    return naturalInverseLine(value, locale)
      .replace(/यह मान तब आता है जब/g, "यह संख्या आम तौर पर तब मिलती है जब")
      .replace(/यह तब होता है जब/g, "ऐसा तब होता है जब");
  }
  return naturalInverseLine(value, locale)
    .replace(/ਇਹ ਮੁੱਲ ਉਸ ਵੇਲੇ ਆਉਂਦਾ ਹੈ ਜਦੋਂ/g, "ਇਹ ਗਿਣਤੀ ਆਮ ਤੌਰ ਉੱਤੇ ਉਦੋਂ ਮਿਲਦੀ ਹੈ ਜਦੋਂ")
    .replace(/ਇਹ ਉਸ ਵੇਲੇ ਹੁੰਦਾ ਹੈ ਜਦੋਂ/g, "ਇਹ ਉਦੋਂ ਹੁੰਦਾ ਹੈ ਜਦੋਂ");
}

function polishSection(
  section: PncStudentExplanationSection,
  qlId: string,
  locale: PncStudentLocale,
  oldOptions: string[],
  newOptions: string[],
  oldAnswer: string,
  newAnswer: string,
): PncStudentExplanationSection {
  const override = section.kind === "coreConcept" ? coreOverride(qlId, locale) : undefined;
  if (section.kind === "coreConcept") {
    return {
      ...section,
      heading: override?.heading ?? section.heading,
      lines: (override?.lines ?? section.lines).map((line) => naturalInverseLine(line, locale)),
    };
  }
  if (section.kind === "stepByStep") {
    return {
      ...section,
      lines: section.lines.map((line) => naturalInverseLine(
        polishStepLine(replaceOptionLabels(line, [oldAnswer], [newAnswer]), locale),
        locale,
      )),
    };
  }
  if (section.kind === "examSpeedShortcut") {
    return { ...section, lines: section.lines.map((line) => naturalInverseLine(line, locale)) };
  }
  return {
    ...section,
    lines: section.lines.map((line) => polishTrapLine(replaceOptionLabels(line, oldOptions, newOptions), locale)),
  };
}

export function buildPnc002Cp007LocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  const reviewed = buildReviewedPresentation(source, locale);
  const useBookUnit = source.questionLanguageId === "PNC-QL-118";
  const displayOptions = useBookUnit
    ? source.options.map((option) => bookOption(option, locale))
    : [...reviewed.displayOptions];
  const answerLabel = displayOptions[source.correctIndex];
  if (!answerLabel) throw new Error(`${source.questionLanguageId}: polished answer label is missing`);
  const answerNumber = optionNumber(source.answer);
  const optionUnit = useBookUnit
    ? (locale === "hi-IN"
      ? (answerNumber === 1 ? "किताब" : "किताबें")
      : (answerNumber === 1 ? "ਕਿਤਾਬ" : "ਕਿਤਾਬਾਂ"))
    : reviewed.optionUnit;

  return {
    ...reviewed,
    stem: polishStem(reviewed.stem, locale),
    optionUnit,
    displayOptions,
    answerLabel,
    explanationSections: reviewed.explanationSections.map((section) => polishSection(
      section,
      source.questionLanguageId,
      locale,
      reviewed.displayOptions,
      displayOptions,
      reviewed.answerLabel,
      answerLabel,
    )),
  };
}

import {
  buildPnc002Cp007LocalizedPresentation as buildPolishedPresentation,
  PNC_002_CP007_LOCALIZATION_PILOT,
} from "./localization-cp007-polished";
import type {
  PncStudentExplanationSection,
  PncStudentSourcePackage,
} from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export { PNC_002_CP007_LOCALIZATION_PILOT };

function releaseText(value: string, locale: PncStudentLocale): string {
  if (locale === "hi-IN") {
    return value
      .replace(/दी गई दी गई संख्या/g, "दी गई संख्या")
      .replace(/उन्हें सीधी पंक्ति में कितने तरीकों से सजाया जा सकता है\?/g, "उन्हें सीधी पंक्ति में कितने तरीकों से खड़ा किया जा सकता है?")
      .replace(/यह मान ब्लॉक के लिए/g, "यह संख्या ब्लॉक के लिए")
      .replace(/यह संख्या ([^.]+) से आता है/g, "यह संख्या $1 से आती है");
  }
  return value
    .replace(/ਦਿੱਤੀ ਦਿੱਤੀ ਗਿਣਤੀ/g, "ਦਿੱਤੀ ਗਿਣਤੀ")
    .replace(/ਉਹਨਾਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਕਿੰਨੇ ਤਰੀਕਿਆਂ ਨਾਲ ਲਗਾਇਆ ਜਾ ਸਕਦਾ ਹੈ\?/g, "ਉਹਨਾਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਕਿੰਨੇ ਤਰੀਕਿਆਂ ਨਾਲ ਖੜ੍ਹਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?")
    .replace(/ਇਹ ਮੁੱਲ ਬਲਾਕ ਲਈ/g, "ਇਹ ਗਿਣਤੀ ਬਲਾਕ ਲਈ")
    .replace(/ਇਹ ਗਿਣਤੀ ([^.]+) ਨਾਲ ਆਉਂਦਾ ਹੈ/g, "ਇਹ ਗਿਣਤੀ $1 ਨਾਲ ਆਉਂਦੀ ਹੈ");
}

function releaseStem(
  value: string,
  qlId: string,
  locale: PncStudentLocale,
): string {
  let stem = releaseText(value, locale);
  if (locale === "hi-IN") {
    if (qlId === "PNC-QL-114") {
      stem = stem.replace(
        "अपने-अपने सदस्यों के साथ रहे",
        "अपने-अपने समूह में साथ रहें",
      );
    }
    if (qlId === "PNC-QL-115") {
      stem = stem.replace(
        "दो अन्य निश्चित व्यक्ति एक-दूसरे के पास नहीं बैठ सकते",
        "दो अन्य निश्चित व्यक्ति एक-दूसरे के पास खड़े नहीं हो सकते",
      );
    }
    if (qlId === "PNC-QL-122") {
      stem = stem.replace(
        "उन्हें सीधी पंक्ति में कितने तरीकों से खड़ा किया जा सकता है?",
        "फाइलों को सीधी पंक्ति में कितने तरीकों से लगाया जा सकता है?",
      );
    }
    return stem;
  }

  if (qlId === "PNC-QL-114") {
    stem = stem.replace(
      "ਆਪਣੇ-ਆਪਣੇ ਮੈਂਬਰਾਂ ਸਮੇਤ ਇਕੱਠਾ ਰਹੇ",
      "ਆਪਣੇ-ਆਪਣੇ ਸਮੂਹ ਵਿੱਚ ਇਕੱਠੀਆਂ ਰਹਿਣ",
    );
  }
  if (qlId === "PNC-QL-115") {
    stem = stem.replace(
      "ਦੋ ਹੋਰ ਖਾਸ ਵਿਅਕਤੀ ਨਾਲ-ਨਾਲ ਨਾ ਬੈਠਣ",
      "ਦੋ ਹੋਰ ਖਾਸ ਵਿਅਕਤੀ ਨਾਲ-ਨਾਲ ਨਾ ਖੜ੍ਹਨ",
    );
  }
  if (qlId === "PNC-QL-122") {
    stem = stem.replace(
      "ਉਹਨਾਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਕਿੰਨੇ ਤਰੀਕਿਆਂ ਨਾਲ ਖੜ੍ਹਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?",
      "ਫਾਈਲਾਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਕਿੰਨੇ ਤਰੀਕਿਆਂ ਨਾਲ ਲਗਾਇਆ ਜਾ ਸਕਦਾ ਹੈ?",
    );
  }
  return stem;
}

function releaseSection(
  section: PncStudentExplanationSection,
  locale: PncStudentLocale,
): PncStudentExplanationSection {
  return {
    ...section,
    heading: releaseText(section.heading, locale),
    lines: section.lines.map((line) => releaseText(line, locale)),
  };
}

export function buildPnc002Cp007LocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  const polished = buildPolishedPresentation(source, locale);
  return {
    ...polished,
    stem: releaseStem(polished.stem, source.questionLanguageId, locale),
    displayOptions: polished.displayOptions.map((option) => releaseText(option, locale)),
    answerLabel: releaseText(polished.answerLabel, locale),
    explanationSections: polished.explanationSections.map((section) => releaseSection(section, locale)),
  };
}

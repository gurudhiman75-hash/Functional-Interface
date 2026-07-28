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
      .replace(/यह मान ब्लॉक के लिए/g, "यह संख्या ब्लॉक के लिए");
  }
  return value
    .replace(/ਦਿੱਤੀ ਦਿੱਤੀ ਗਿਣਤੀ/g, "ਦਿੱਤੀ ਗਿਣਤੀ")
    .replace(/ਉਹਨਾਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਕਿੰਨੇ ਤਰੀਕਿਆਂ ਨਾਲ ਲਗਾਇਆ ਜਾ ਸਕਦਾ ਹੈ\?/g, "ਉਹਨਾਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਕਿੰਨੇ ਤਰੀਕਿਆਂ ਨਾਲ ਖੜ੍ਹਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?")
    .replace(/ਇਹ ਮੁੱਲ ਬਲਾਕ ਲਈ/g, "ਇਹ ਗਿਣਤੀ ਬਲਾਕ ਲਈ");
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
    stem: releaseText(polished.stem, locale),
    displayOptions: polished.displayOptions.map((option) => releaseText(option, locale)),
    answerLabel: releaseText(polished.answerLabel, locale),
    explanationSections: polished.explanationSections.map((section) => releaseSection(section, locale)),
  };
}

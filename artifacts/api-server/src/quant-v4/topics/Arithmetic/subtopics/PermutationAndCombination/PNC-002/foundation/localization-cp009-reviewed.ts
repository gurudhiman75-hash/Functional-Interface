import {
  buildPnc002Cp009LocalizedPresentation as buildCandidatePresentation,
  PNC_002_CP009_LOCALIZATION_CANDIDATE,
} from "./localization-cp009";
import type { PncStudentSourcePackage } from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export { PNC_002_CP009_LOCALIZATION_CANDIDATE };

function reviewedText(value: string, locale: PncStudentLocale): string {
  if (locale === "hi-IN") {
    return value
      .replace(/अधिक-से-अधिक/g, "अधिकतम")
      .replace(/कम-से-कम/g, "कम-से-कम");
  }
  return value
    .replace(/ਕੈਟੇਗਰੀ/g, "ਵਰਗ")
    .replace(/ਸ਼੍ਰੇਣੀ/g, "ਵਰਗ")
    .replace(/ਖੁੱਲ੍ਹੇ ਤੌਰ ਉੱਤੇ/g, "ਆਪਣੀ ਮਰਜ਼ੀ ਨਾਲ");
}

export function buildPnc002Cp009LocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  const candidate = buildCandidatePresentation(source, locale);
  return {
    ...candidate,
    stem: reviewedText(candidate.stem, locale),
    optionUnit: reviewedText(candidate.optionUnit, locale),
    displayOptions: candidate.displayOptions.map((option) => reviewedText(option, locale)),
    answerLabel: reviewedText(candidate.answerLabel, locale),
    explanationSections: candidate.explanationSections.map((section) => ({
      ...section,
      heading: reviewedText(section.heading, locale),
      lines: section.lines.map((line) => reviewedText(line, locale)),
    })),
  };
}

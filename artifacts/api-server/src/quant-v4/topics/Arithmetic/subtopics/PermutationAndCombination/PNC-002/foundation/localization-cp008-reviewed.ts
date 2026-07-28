import {
  buildPnc002Cp008LocalizedPresentation as buildCandidatePresentation,
  PNC_002_CP008_LOCALIZATION_CANDIDATE,
} from "./localization-cp008";
import type {
  PncStudentExplanationSection,
  PncStudentSourcePackage,
} from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export { PNC_002_CP008_LOCALIZATION_CANDIDATE };

function reviewedText(value: string, locale: PncStudentLocale): string {
  if (locale === "hi-IN") {
    return value
      .replace(/स्थान क्रमांकों/g, "स्थान संख्याओं")
      .replace(/स्थान-क्रमांकों/g, "स्थान संख्याओं");
  }
  return value
    .replace(/ਟਾਂਕ/g, "ਬੇ-ਜੋੜ")
    .replace(/ਥਾਵਾਂ ਦੇ ਨੰਬਰਾਂ/g, "ਥਾਂ ਨੰਬਰਾਂ")
    .replace(/ਥਾਵਾਂ ਦਾ ਨੰਬਰਾਂ/g, "ਥਾਂ ਨੰਬਰਾਂ")
    .replace(/ਖੁੱਲ੍ਹੇ ਤੌਰ ਉੱਤੇ/g, "ਆਪਣੀ ਮਰਜ਼ੀ ਦੇ ਕ੍ਰਮ ਵਿੱਚ");
}

function reviewedSection(
  section: PncStudentExplanationSection,
  locale: PncStudentLocale,
): PncStudentExplanationSection {
  return {
    ...section,
    heading: reviewedText(section.heading, locale),
    lines: section.lines.map((line) => reviewedText(line, locale)),
  };
}

export function buildPnc002Cp008LocalizedPresentation(
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
    explanationSections: candidate.explanationSections.map((section) => reviewedSection(section, locale)),
  };
}

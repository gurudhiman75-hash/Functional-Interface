import {
  buildPnc002Cp007LocalizedPresentation as buildBasePresentation,
  PNC_002_CP007_LOCALIZATION_PILOT,
} from "./localization-cp007";
import type { PncStudentSourcePackage } from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export { PNC_002_CP007_LOCALIZATION_PILOT };

function ql118Source(source: PncStudentSourcePackage): PncStudentSourcePackage {
  if (source.questionLanguageId !== "PNC-QL-118") return source;
  const stem = source.stem.replace(/^Eight distinct books\b/, "8 distinct books");
  if (stem === source.stem) {
    throw new Error("PNC-QL-118: expected the English word-number stem contract");
  }
  return { ...source, stem };
}

function restoreLocalizedWordNumber(
  presentation: PncLocalizedStudentPresentation,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  if (presentation.questionLanguageId !== "PNC-QL-118") return presentation;
  const stem = locale === "hi-IN"
    ? presentation.stem.replace(/^8\s+/, "आठ ")
    : presentation.stem.replace(/^8\s+/, "ਅੱਠ ");
  if (stem === presentation.stem) {
    throw new Error("PNC-QL-118: localized word-number restoration failed");
  }
  return { ...presentation, stem };
}

export function buildPnc002Cp007LocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  return restoreLocalizedWordNumber(buildBasePresentation(ql118Source(source), locale), locale);
}

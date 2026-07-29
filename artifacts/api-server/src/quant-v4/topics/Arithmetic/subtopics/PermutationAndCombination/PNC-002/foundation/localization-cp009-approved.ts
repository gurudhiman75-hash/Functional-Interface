import {
  buildPnc002Cp009LocalizedPresentation as buildReviewedPresentation,
  PNC_002_CP009_LOCALIZATION_CANDIDATE,
} from "./localization-cp009-reviewed";
import type { PncStudentSourcePackage } from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export const PNC_002_CP009_LOCALIZATION_APPROVED = Object.freeze({
  ...PNC_002_CP009_LOCALIZATION_CANDIDATE,
  releaseId: "PNC-002-CP009-HI-PA-v1-APPROVED",
  status: "APPROVED",
  editorialStatus: "APPROVED",
  publiclyPublishable: false,
  approvedAt: "2026-07-29",
});

export function buildPnc002Cp009ApprovedLocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  const reviewed = buildReviewedPresentation(source, locale);
  return {
    ...reviewed,
    editorialStatus: "APPROVED",
    publiclyPublishable: false,
  };
}

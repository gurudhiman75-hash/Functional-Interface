import {
  buildPnc002Cp008LocalizedPresentation as buildReviewedPresentation,
  PNC_002_CP008_LOCALIZATION_CANDIDATE,
} from "./localization-cp008-reviewed";
import type { PncStudentSourcePackage } from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export const PNC_002_CP008_LOCALIZATION_APPROVED = Object.freeze({
  ...PNC_002_CP008_LOCALIZATION_CANDIDATE,
  releaseId: "PNC-002-CP008-HI-PA-v1-APPROVED",
  status: "APPROVED",
  editorialStatus: "APPROVED",
  publiclyPublishable: false,
  approvedAt: "2026-07-28",
});

export function buildPnc002Cp008ApprovedLocalizedPresentation(
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

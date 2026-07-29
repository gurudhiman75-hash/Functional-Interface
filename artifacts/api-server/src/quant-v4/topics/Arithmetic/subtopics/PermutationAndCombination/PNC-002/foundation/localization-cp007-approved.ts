import {
  buildPnc002Cp007LocalizedPresentation as buildReleasePresentation,
  PNC_002_CP007_LOCALIZATION_PILOT,
} from "./localization-cp007-release";
import type { PncStudentSourcePackage } from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export const PNC_002_CP007_LOCALIZATION_APPROVED = Object.freeze({
  ...PNC_002_CP007_LOCALIZATION_PILOT,
  releaseId: "PNC-002-CP007-HI-PA-v1-APPROVED",
  status: "APPROVED",
  editorialStatus: "APPROVED",
  publiclyPublishable: false,
  approvedAt: "2026-07-29",
});

export function buildPnc002Cp007ApprovedLocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  const release = buildReleasePresentation(source, locale);
  return {
    ...release,
    editorialStatus: "APPROVED",
    publiclyPublishable: false,
  };
}

import {
  buildPnc002Cp012LocalizedPresentation as buildCandidatePresentation,
  PNC_002_CP012_LOCALIZATION_CANDIDATE,
} from "./localization-cp012";
import type { PncStudentSourcePackage } from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export const PNC_002_CP012_LOCALIZATION_APPROVED = Object.freeze({
  ...PNC_002_CP012_LOCALIZATION_CANDIDATE,
  releaseId: "PNC-002-CP012-HI-PA-v1-APPROVED",
  status: "APPROVED",
  editorialStatus: "APPROVED",
  publiclyPublishable: false,
  approvedAt: "2026-07-29",
});

export function buildPnc002Cp012ApprovedLocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  const candidate = buildCandidatePresentation(source, locale);
  return {
    ...candidate,
    editorialStatus: "APPROVED",
    publiclyPublishable: false,
  };
}

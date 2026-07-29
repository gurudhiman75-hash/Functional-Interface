import {
  buildPnc002Cp007ApprovedLocalizedPresentation,
  PNC_002_CP007_LOCALIZATION_APPROVED,
} from "./localization-cp007-approved";
import {
  buildPnc002Cp008ApprovedLocalizedPresentation,
  PNC_002_CP008_LOCALIZATION_APPROVED,
} from "./localization-cp008-approved";
import {
  buildPnc002Cp009ApprovedLocalizedPresentation,
  PNC_002_CP009_LOCALIZATION_APPROVED,
} from "./localization-cp009-approved";
import {
  buildPnc002Cp010ApprovedLocalizedPresentation,
  PNC_002_CP010_LOCALIZATION_APPROVED,
} from "./localization-cp010-approved";
import {
  buildPnc002Cp011ApprovedLocalizedPresentation,
  PNC_002_CP011_LOCALIZATION_APPROVED,
} from "./localization-cp011-approved";
import {
  buildPnc002Cp012ApprovedLocalizedPresentation,
  PNC_002_CP012_LOCALIZATION_APPROVED,
} from "./localization-cp012-approved";
import type { PncStudentSourcePackage } from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export const PNC_002_COMPLETE_LOCALIZATION_APPROVED = Object.freeze({
  releaseId: "PNC-002-HI-PA-v1-APPROVED-COMPLETE",
  packageId: "PNC-002",
  canonicalProblemIds: [
    "PNC-CP-007",
    "PNC-CP-008",
    "PNC-CP-009",
    "PNC-CP-010",
    "PNC-CP-011",
    "PNC-CP-012",
  ] as const,
  checkpointReleases: [
    PNC_002_CP007_LOCALIZATION_APPROVED,
    PNC_002_CP008_LOCALIZATION_APPROVED,
    PNC_002_CP009_LOCALIZATION_APPROVED,
    PNC_002_CP010_LOCALIZATION_APPROVED,
    PNC_002_CP011_LOCALIZATION_APPROVED,
    PNC_002_CP012_LOCALIZATION_APPROVED,
  ] as const,
  languages: ["hi-IN", "pa-IN"] as const,
  qlRange: ["PNC-QL-107", "PNC-QL-269"] as const,
  qlCount: 163,
  checkpointCount: 6,
  status: "APPROVED",
  editorialStatus: "APPROVED",
  publiclyPublishable: false,
  approvedAt: "2026-07-29",
});

export function buildPnc002ApprovedLocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  switch (source.canonicalProblemId) {
    case "PNC-CP-007":
      return buildPnc002Cp007ApprovedLocalizedPresentation(source, locale);
    case "PNC-CP-008":
      return buildPnc002Cp008ApprovedLocalizedPresentation(source, locale);
    case "PNC-CP-009":
      return buildPnc002Cp009ApprovedLocalizedPresentation(source, locale);
    case "PNC-CP-010":
      return buildPnc002Cp010ApprovedLocalizedPresentation(source, locale);
    case "PNC-CP-011":
      return buildPnc002Cp011ApprovedLocalizedPresentation(source, locale);
    case "PNC-CP-012":
      return buildPnc002Cp012ApprovedLocalizedPresentation(source, locale);
    default:
      throw new Error(`${source.questionLanguageId}: no approved PNC-002 localisation checkpoint`);
  }
}

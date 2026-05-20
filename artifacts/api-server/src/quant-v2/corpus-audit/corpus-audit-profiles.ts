import type {
  CorpusAuditExportOptions,
  CorpusAuditExportProfile,
  CorpusAuditExportProfileId,
} from "./corpus-audit-types";

export const CORPUS_AUDIT_EXPORT_PROFILES: readonly CorpusAuditExportProfile[] = [
  {
    id: "audit_light",
    label: "Audit Light",
    description:
      "Multilingual stems, English explanations, and lightweight audit metadata.",
    includeMultilingualExplanations: false,
    includeLocalizationMetadata: false,
    includeCompactnessMetadata: true,
    includeReasoningGraph: false,
    includeValidatorReports: false,
    includeRealismMetadata: false,
    includeSvgByDefault: false,
  },
  {
    id: "multilingual_review",
    label: "Multilingual Review",
    description:
      "Adds Hindi/Punjabi explanations, localization metadata, and compactness signals.",
    includeMultilingualExplanations: true,
    includeLocalizationMetadata: true,
    includeCompactnessMetadata: true,
    includeReasoningGraph: false,
    includeValidatorReports: false,
    includeRealismMetadata: false,
    includeSvgByDefault: false,
  },
  {
    id: "realism_review",
    label: "Realism Review",
    description:
      "Stem-focused export with realism, compactness, and domain metadata.",
    includeMultilingualExplanations: false,
    includeLocalizationMetadata: false,
    includeCompactnessMetadata: true,
    includeReasoningGraph: false,
    includeValidatorReports: false,
    includeRealismMetadata: true,
    includeSvgByDefault: false,
  },
  {
    id: "topology_audit",
    label: "Topology Audit",
    description:
      "Graph-heavy, validator-heavy export for reasoning and topology debugging.",
    includeMultilingualExplanations: false,
    includeLocalizationMetadata: false,
    includeCompactnessMetadata: true,
    includeReasoningGraph: true,
    includeValidatorReports: true,
    includeRealismMetadata: true,
    includeSvgByDefault: false,
  },
  {
    id: "editorial_pdf",
    label: "Editorial PDF",
    description:
      "Human-readable multilingual export profile for editorial sharing.",
    includeMultilingualExplanations: true,
    includeLocalizationMetadata: true,
    includeCompactnessMetadata: true,
    includeReasoningGraph: false,
    includeValidatorReports: false,
    includeRealismMetadata: true,
    includeSvgByDefault: true,
  },
];

export function getCorpusAuditExportProfile(id?: string) {
  return (
    CORPUS_AUDIT_EXPORT_PROFILES.find((profile) => profile.id === id) ??
    CORPUS_AUDIT_EXPORT_PROFILES[0]!
  );
}

export function isCorpusAuditExportProfileId(
  value: string,
): value is CorpusAuditExportProfileId {
  return CORPUS_AUDIT_EXPORT_PROFILES.some((profile) => profile.id === value);
}

export function shouldIncludeMultilingualExplanations(
  options: CorpusAuditExportOptions,
) {
  if (typeof options.includeMultilingualExplanations === "boolean") {
    return options.includeMultilingualExplanations;
  }

  return getCorpusAuditExportProfile(options.exportProfile)
    .includeMultilingualExplanations;
}

export function estimateCorpusAuditExportSizeMb(input: {
  count: number;
  exportProfile?: CorpusAuditExportProfileId;
  includeSvg?: boolean;
  includeMultilingualExplanations?: boolean;
}) {
  const profile = getCorpusAuditExportProfile(input.exportProfile);
  const includeMultilingualExplanations =
    typeof input.includeMultilingualExplanations === "boolean"
      ? input.includeMultilingualExplanations
      : profile.includeMultilingualExplanations;
  const includeSvg = input.includeSvg ?? profile.includeSvgByDefault;
  const perQuestionKb =
    6 +
    (includeMultilingualExplanations ? 8 : 0) +
    (profile.includeReasoningGraph ? 12 : 0) +
    (profile.includeValidatorReports ? 8 : 0) +
    (profile.includeRealismMetadata ? 3 : 0) +
    (includeSvg ? 10 : 0);

  return Number(((input.count * perQuestionKb) / 1024).toFixed(1));
}

import type { CorpusAuditPreset, CorpusAuditPresetId } from "./corpus-audit-types";

export const CORPUS_AUDIT_PRESETS: readonly CorpusAuditPreset[] = [
  {
    id: "ssc_percentage_audit",
    label: "SSC Percentage Audit",
    description:
      "Balanced English/Hindi/Punjabi percentage corpus for SSC-style realism review.",
    defaultCount: 1000,
    examProfile: "ssc",
    seedPrefix: "ssc-percentage-audit",
    languages: ["en", "hi", "pa"],
  },
  {
    id: "banking_relational_audit",
    label: "Banking Relational Audit",
    description:
      "Relational percentage stress set with chained comparison and inversion traps.",
    defaultCount: 1000,
    examProfile: "ibps",
    seedPrefix: "banking-relational-audit",
    forcedMotifIds: [
      "perc_relational_chain",
      "perc_reverse_relation",
      "perc_ratio_percentage_hybrid",
    ],
    languages: ["en", "hi", "pa"],
  },
  {
    id: "punjabi_realism_audit",
    label: "Punjabi Realism Audit",
    description:
      "Punjabi-first realism audit while preserving aligned English and Hindi renderings.",
    defaultCount: 1000,
    examProfile: "punjab_state",
    seedPrefix: "punjabi-realism-audit",
    languages: ["en", "hi", "pa"],
  },
  {
    id: "compactness_stress_test",
    label: "Compactness Stress Test",
    description:
      "Compact cadence stress export for repetition, abruptness, and explanation continuity checks.",
    defaultCount: 5000,
    examProfile: "rrb",
    seedPrefix: "compactness-stress-test",
    languages: ["en", "hi", "pa"],
  },
  {
    id: "difficulty_distribution_audit",
    label: "Difficulty Distribution Audit",
    description:
      "Large mixed-difficulty percentage corpus for operational distribution analysis.",
    defaultCount: 5000,
    examProfile: "ssc",
    seedPrefix: "difficulty-distribution-audit",
    languages: ["en", "hi", "pa"],
  },
];

export function getCorpusAuditPreset(id?: string) {
  return (
    CORPUS_AUDIT_PRESETS.find((preset) => preset.id === id) ??
    CORPUS_AUDIT_PRESETS[0]!
  );
}

export function isCorpusAuditPresetId(value: string): value is CorpusAuditPresetId {
  return CORPUS_AUDIT_PRESETS.some((preset) => preset.id === value);
}

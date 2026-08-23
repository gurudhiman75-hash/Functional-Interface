import { STA_EXAM_FORMAT_PROVENANCE, type StaExamFormatProvenance } from "./exam-format-provenance.ts";
import type { StaExamProfileIdV2 } from "./exam-format-extension-v2.ts";

export type StaExamEvidenceClassV2 = StaExamFormatProvenance["evidenceClass"] | "DIRECT_MEMORY_BASED_PYQ";

export interface StaExamFormatProvenanceV2 {
  readonly evidenceClass: StaExamEvidenceClassV2;
  readonly rationale: string;
  readonly freezeEligible: true;
  readonly directPunjabPyqBacked: boolean;
  readonly officialVerbatim: boolean;
}

function promoteLegacy(value: StaExamFormatProvenance): StaExamFormatProvenanceV2 {
  return {
    ...value,
    officialVerbatim: false,
  };
}

/**
 * V2 makes the evidence boundary explicit. Memory-based/reconstructed banking
 * papers are useful format evidence, but are not represented as official RBI
 * verbatim papers. This provenance concerns presentation shape only and cannot
 * create or modify a semantic QL authority.
 */
export const STA_EXAM_FORMAT_PROVENANCE_V2: Readonly<Record<StaExamProfileIdV2, StaExamFormatProvenanceV2>> = {
  SSC_2X4: promoteLegacy(STA_EXAM_FORMAT_PROVENANCE.SSC_2X4),
  SSC_3X4: promoteLegacy(STA_EXAM_FORMAT_PROVENANCE.SSC_3X4),
  BANK_2X5: promoteLegacy(STA_EXAM_FORMAT_PROVENANCE.BANK_2X5),
  BANK_3X5: {
    ...promoteLegacy(STA_EXAM_FORMAT_PROVENANCE.BANK_3X5),
    evidenceClass: "DIRECT_MEMORY_BASED_PYQ",
    rationale: "Memory-based/reconstructed RBI and banking previous-paper evidence directly supports three assumptions with five coded answer choices. This is format evidence, not an official verbatim-paper claim.",
  },
  BANK_4X5: {
    ...promoteLegacy(STA_EXAM_FORMAT_PROVENANCE.BANK_4X5),
    evidenceClass: "DIRECT_MEMORY_BASED_PYQ",
    rationale: "Memory-based/reconstructed banking previous-paper evidence supports four assumptions with five coded choices. The fourth assumption remains a presentation-only overlay and does not mutate frozen semantic authority.",
  },
  BANK_5X5: {
    evidenceClass: "DIRECT_MEMORY_BASED_PYQ",
    rationale: "A reconstructed RBI Grade B 2024 Phase-1 Shift-2 memory-based item exhibits assumptions I-V with five coded combination choices and a correct combination containing V. BANK_5X5 therefore models a directly observed memory-PYQ presentation shape, while explicitly making no official-verbatim RBI claim.",
    freezeEligible: true,
    directPunjabPyqBacked: false,
    officialVerbatim: false,
  },
  BANK_3X5_NEGATIVE: promoteLegacy(STA_EXAM_FORMAT_PROVENANCE.BANK_3X5_NEGATIVE),
  PUNJAB_2X4: promoteLegacy(STA_EXAM_FORMAT_PROVENANCE.PUNJAB_2X4),
  PUNJAB_3X4: promoteLegacy(STA_EXAM_FORMAT_PROVENANCE.PUNJAB_3X4),
} as const;

import type { StaExamProfileId } from "./exam-format-extension.ts";

export type StaExamEvidenceClass =
  | "DIRECT_PYQ_FORMAT"
  | "LEGACY_OR_FAMILY_COMPATIBLE"
  | "CROSS_EXAM_SYNTHESIS";

export interface StaExamFormatProvenance {
  readonly evidenceClass: StaExamEvidenceClass;
  readonly rationale: string;
  readonly freezeEligible: true;
  readonly directPunjabPyqBacked: boolean;
}

/**
 * Presentation provenance is intentionally separate from semantic QL authority.
 * A profile may be useful and freeze-eligible as a deterministic presentation
 * synthesis without being falsely labelled as a directly observed exam format.
 */
export const STA_EXAM_FORMAT_PROVENANCE: Readonly<Record<StaExamProfileId, StaExamFormatProvenance>> = {
  SSC_2X4: {
    evidenceClass: "DIRECT_PYQ_FORMAT",
    rationale: "Direct SSC-family PYQ evidence supports statement + two assumptions with four answer choices.",
    freezeEligible: true,
    directPunjabPyqBacked: false,
  },
  SSC_3X4: {
    evidenceClass: "DIRECT_PYQ_FORMAT",
    rationale: "Direct SSC-family PYQ evidence supports three assumptions with four answer choices, including multi-assumption and all-three verdicts.",
    freezeEligible: true,
    directPunjabPyqBacked: false,
  },
  BANK_2X5: {
    evidenceClass: "LEGACY_OR_FAMILY_COMPATIBLE",
    rationale: "Banking sources support two-assumption five-choice/coded surfaces; the exact answer-set renderer remains a presentation compatibility layer rather than a new semantic authority.",
    freezeEligible: true,
    directPunjabPyqBacked: false,
  },
  BANK_3X5: {
    evidenceClass: "DIRECT_PYQ_FORMAT",
    rationale: "RBI/other banking memory-PYQ evidence directly supports three assumptions with five answer choices.",
    freezeEligible: true,
    directPunjabPyqBacked: false,
  },
  BANK_4X5: {
    evidenceClass: "DIRECT_PYQ_FORMAT",
    rationale: "RBI Grade B 2024 and SBI-family banking evidence directly support four assumptions with five answer choices; the fourth candidate remains presentation-only unless independently supported by the semantic oracle.",
    freezeEligible: true,
    directPunjabPyqBacked: false,
  },
  BANK_3X5_NEGATIVE: {
    evidenceClass: "LEGACY_OR_FAMILY_COMPATIBLE",
    rationale: "Negative assumption-query polarity is source-family compatible, but is treated conservatively as presentation synthesis instead of being overclaimed as a distinct direct-PYQ format authority.",
    freezeEligible: true,
    directPunjabPyqBacked: false,
  },
  PUNJAB_2X4: {
    evidenceClass: "DIRECT_PYQ_FORMAT",
    rationale: "PSSSB/PSPCL previous-paper evidence directly supports the classic statement + two assumptions + four choices Punjab-state surface.",
    freezeEligible: true,
    directPunjabPyqBacked: true,
  },
  PUNJAB_3X4: {
    evidenceClass: "CROSS_EXAM_SYNTHESIS",
    rationale: "Three-assumption/four-choice rendering is exam-real and semantically compatible with Punjab-state content, but no direct Punjab PYQ authority has been verified for this exact presentation shape. It must not be described as direct Punjab-PYQ-backed.",
    freezeEligible: true,
    directPunjabPyqBacked: false,
  },
} as const;

import type { SufficiencyClass } from "../foundation/index.ts";

export type DsSourceEvidenceLevel =
  | "CURATED_MEMORY_BASED_EXAM"
  | "CURATED_PREPARATION_SIGNAL"
  | "PAPER_INDEX_ONLY"
  | "PENDING_DIRECT_DS_EVIDENCE";

export type DsSourceExamFamily = "BANKING" | "SSC" | "RAILWAY" | "PUNJAB_STATE";

export interface DsTwoStatementSourcePattern {
  readonly patternId: string;
  readonly examFamily: DsSourceExamFamily;
  readonly examLabel: string;
  readonly examDate?: string;
  readonly statementCount: 2;
  readonly optionSemanticOrder: readonly SufficiencyClass[];
  readonly evidenceLevel: DsSourceEvidenceLevel;
  readonly sourceLabel: string;
  readonly sourceUrl: string;
  readonly architecturalFinding: string;
}

export interface DsThreeStatementSourcePattern {
  readonly patternId: string;
  readonly examFamily: DsSourceExamFamily;
  readonly examLabel: string;
  readonly examDate?: string;
  readonly statementCount: 3;
  readonly optionContractKind: "NAMED_STATEMENT_SUBSETS" | "MIXED_MINIMAL_SUBSET_EXPRESSIONS";
  readonly evidenceLevel: DsSourceEvidenceLevel;
  readonly sourceLabel: string;
  readonly sourceUrl: string;
  readonly architecturalFinding: string;
}

export interface DsExamFamilyEvidenceStatus {
  readonly examFamily: DsSourceExamFamily;
  readonly status: "SUPPORTED_FOR_DISCOVERY" | "PARTIAL_SIGNAL_ONLY" | "PENDING_DIRECT_DS_EVIDENCE";
  readonly notes: string;
}

export const DSF_BANK_STANDARD_ORDER = [
  "STATEMENT_I_ONLY",
  "STATEMENT_II_ONLY",
  "EACH_STATEMENT_ALONE",
  "INSUFFICIENT_EVEN_TOGETHER",
  "BOTH_TOGETHER_ONLY",
] as const satisfies readonly SufficiencyClass[];

export const DSF_BANK_BOB_2015_ORDER = [
  "EACH_STATEMENT_ALONE",
  "INSUFFICIENT_EVEN_TOGETHER",
  "BOTH_TOGETHER_ONLY",
  "STATEMENT_I_ONLY",
  "STATEMENT_II_ONLY",
] as const satisfies readonly SufficiencyClass[];

/**
 * Evidence is intentionally stored as source metadata, not copied question text.
 * SATHEE pages identify these as memory-based banking questions. They are strong
 * enough for discovery of answer-contract shape, but are not represented here
 * as official question-paper scans.
 */
export const DSF_TWO_STATEMENT_SOURCE_PATTERNS: readonly DsTwoStatementSourcePattern[] = [
  {
    patternId: "DSF-SRC-BANK-INDIAN-BANK-PO-2011-TWO-STMT",
    examFamily: "BANKING",
    examLabel: "Indian Bank PO",
    examDate: "2011-01-02",
    statementCount: 2,
    optionSemanticOrder: DSF_BANK_STANDARD_ORDER,
    evidenceLevel: "CURATED_MEMORY_BASED_EXAM",
    sourceLabel: "SATHEE Data Sufficiency Question 10",
    sourceUrl: "https://sathee.iitk.ac.in/sathee-bank-exam/bank-exams/ibps-po/study-materials/memory-based-questions/data-sufficiency/data-sufficiency-question-10/",
    architecturalFinding: "Five canonical two-statement meanings appear in a fixed displayed order for this exam set.",
  },
  {
    patternId: "DSF-SRC-BANK-BOB-JMG-2015-TWO-STMT",
    examFamily: "BANKING",
    examLabel: "BOB Junior Management Grade/Scale-I",
    examDate: "2015-04-18",
    statementCount: 2,
    optionSemanticOrder: DSF_BANK_BOB_2015_ORDER,
    evidenceLevel: "CURATED_MEMORY_BASED_EXAM",
    sourceLabel: "SATHEE Data Sufficiency Question 43",
    sourceUrl: "https://sathee.iitk.ac.in/sathee-bank-exam/bank-exams/ibps-po/study-materials/memory-based-questions/data-sufficiency/data-sufficiency-question-43/",
    architecturalFinding: "The same five semantics are presented in a different option order, proving semantic truth must be separated from display position.",
  },
];

export const DSF_THREE_STATEMENT_SOURCE_PATTERNS: readonly DsThreeStatementSourcePattern[] = [
  {
    patternId: "DSF-SRC-BANK-IBPS-CWE3-2013-THREE-STMT-TRAIN",
    examFamily: "BANKING",
    examLabel: "IBPS Bank PO/MT CWE-III",
    examDate: "2013-10-26",
    statementCount: 3,
    optionContractKind: "NAMED_STATEMENT_SUBSETS",
    evidenceLevel: "CURATED_MEMORY_BASED_EXAM",
    sourceLabel: "SATHEE Data Sufficiency Question 17",
    sourceUrl: "https://sathee.iitk.ac.in/sathee-bank-exam/bank-exams/ibps-po/study-materials/memory-based-questions/data-sufficiency/data-sufficiency-question-17/",
    architecturalFinding: "Three-statement DS uses named statement combinations such as I+II, I+III, II+III and any two; it cannot be represented by the five two-statement classes.",
  },
  {
    patternId: "DSF-SRC-BANK-IBPS-CWE3-2013-THREE-STMT-BOAT",
    examFamily: "BANKING",
    examLabel: "IBPS Bank PO/MT CWE-III",
    examDate: "2013-10-26",
    statementCount: 3,
    optionContractKind: "MIXED_MINIMAL_SUBSET_EXPRESSIONS",
    evidenceLevel: "CURATED_MEMORY_BASED_EXAM",
    sourceLabel: "SATHEE Data Sufficiency Question 16",
    sourceUrl: "https://sathee.iitk.ac.in/sathee-bank-exam/bank-exams/ibps-po/study-materials/memory-based-questions/data-sufficiency/data-sufficiency-question-16/",
    architecturalFinding: "An answer may express I plus either II or III, so the engine must compute sufficient/minimal subsets before rendering an exam-specific contract.",
  },
];

export const DSF_EXAM_FAMILY_EVIDENCE_STATUS: readonly DsExamFamilyEvidenceStatus[] = [
  {
    examFamily: "BANKING",
    status: "SUPPORTED_FOR_DISCOVERY",
    notes: "SATHEE memory-based material directly demonstrates two-statement five-class patterns, reordered option profiles, three-statement subset contracts, and Quant domains including geometry, algebra, ages, interest, boats and trains.",
  },
  {
    examFamily: "RAILWAY",
    status: "PARTIAL_SIGNAL_ONLY",
    notes: "SATHEE exposes a Railway Data Sufficiency practice section, which supports product relevance but is not treated as direct PYQ proof in this registry.",
  },
  {
    examFamily: "SSC",
    status: "PENDING_DIRECT_DS_EVIDENCE",
    notes: "No direct SSC DS question was verified in the current CP-000 source pass. Do not allocate SSC-specific DS QLs from preparation-site assumptions.",
  },
  {
    examFamily: "PUNJAB_STATE",
    status: "PENDING_DIRECT_DS_EVIDENCE",
    notes: "PSSSB previous-paper indexes were located, but no direct Data Sufficiency question was verified in the current pass. Punjab-specific DS scope remains evidence-pending.",
  },
];

export function semanticOrderFingerprint(order: readonly SufficiencyClass[]): string {
  return order.join("|");
}

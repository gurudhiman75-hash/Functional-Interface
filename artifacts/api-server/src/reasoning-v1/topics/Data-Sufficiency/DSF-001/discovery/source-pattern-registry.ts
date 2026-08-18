import type { SufficiencyClass } from "../foundation/index.ts";

export type DsSourceEvidenceLevel =
  | "CURATED_MEMORY_BASED_EXAM"
  | "CURATED_PYQ_PLATFORM"
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

export const DSF_SSC_CGL_2023_FOUR_ORDER = [
  "INSUFFICIENT_EVEN_TOGETHER",
  "STATEMENT_II_ONLY",
  "BOTH_TOGETHER_ONLY",
  "STATEMENT_I_ONLY",
] as const satisfies readonly SufficiencyClass[];

export const DSF_SSC_CGL_2024_FOUR_ORDER = [
  "STATEMENT_II_ONLY",
  "STATEMENT_I_ONLY",
  "BOTH_TOGETHER_ONLY",
  "INSUFFICIENT_EVEN_TOGETHER",
] as const satisfies readonly SufficiencyClass[];

export const DSF_PSSSB_PREP_FOUR_ORDER = [
  "STATEMENT_I_ONLY",
  "STATEMENT_II_ONLY",
  "EACH_STATEMENT_ALONE",
  "INSUFFICIENT_EVEN_TOGETHER",
] as const satisfies readonly SufficiencyClass[];

/**
 * Evidence is intentionally stored as source metadata, not copied question text.
 * Memory-based and PYQ-platform sources are useful for discovery of answer
 * contract shape but are not represented here as official-paper scans.
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
  {
    patternId: "DSF-SRC-SSC-CGL-TIER2-2023-REASONING-FOUR",
    examFamily: "SSC",
    examLabel: "SSC CGL Tier II Reasoning and General Intelligence",
    examDate: "2023-10-26",
    statementCount: 2,
    optionSemanticOrder: DSF_SSC_CGL_2023_FOUR_ORDER,
    evidenceLevel: "CURATED_PYQ_PLATFORM",
    sourceLabel: "Oliveboard SSC CGL Tier II PYP Data Sufficiency",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-a-question-is-given-followed-by-two-statements-labelled-i-and-ii",
    architecturalFinding: "A four-option SSC reasoning DS contract omits EACH_STATEMENT_ALONE from this displayed profile; the underlying five-class truth model must therefore be independent from exam rendering.",
  },
  {
    patternId: "DSF-SRC-SSC-CGL-TIER2-2024-QUANT-FOUR",
    examFamily: "SSC",
    examLabel: "SSC CGL 2024 Tier-II Official Paper-I",
    examDate: "2025-01-18",
    statementCount: 2,
    optionSemanticOrder: DSF_SSC_CGL_2024_FOUR_ORDER,
    evidenceLevel: "CURATED_PYQ_PLATFORM",
    sourceLabel: "Testbook SSC CGL 2024 Tier-II Data Sufficiency",
    sourceUrl: "https://testbook.com/question-answer/a-question-is-given-followed-by-two-statements-la--67942e6b645b49b7779624f3/amp",
    architecturalFinding: "A four-option SSC quantitative DS example uses the same four represented semantics in another order, reinforcing exam-profile rendering rather than hard-coded option letters.",
  },
  {
    patternId: "DSF-SRC-PSSSB-CLERK-PREP-DIRECTION-FOUR",
    examFamily: "PUNJAB_STATE",
    examLabel: "PSSSB Clerk Logical Reasoning question set",
    statementCount: 2,
    optionSemanticOrder: DSF_PSSSB_PREP_FOUR_ORDER,
    evidenceLevel: "CURATED_PREPARATION_SIGNAL",
    sourceLabel: "Testbook PSSSB Clerk LR Questions — Data Sufficiency",
    sourceUrl: "https://testbook.com/questions/psssb-clerk-lr-questions--65e6d6ad0ef488717be8e15f",
    architecturalFinding: "PSSSB-specific preparation material contains a four-option direction-sense DS surface including EACH_STATEMENT_ALONE, but this is not treated as verified official-paper provenance for freezing a Punjab answer profile.",
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
    notes: "SATHEE memory-based material directly demonstrates two-statement five-class patterns, reordered option profiles, three-statement subset contracts, and multiple Quant domains.",
  },
  {
    examFamily: "SSC",
    status: "SUPPORTED_FOR_DISCOVERY",
    notes: "SSC CGL Tier-II PYQ platforms show both reasoning and quantitative two-statement DS with four-option exam profiles. Profile provenance remains external-platform rather than an official scan in this audit.",
  },
  {
    examFamily: "RAILWAY",
    status: "PARTIAL_SIGNAL_ONLY",
    notes: "SATHEE exposes a Railway Data Sufficiency practice section, which supports product relevance but is not treated as direct PYQ proof in this registry.",
  },
  {
    examFamily: "PUNJAB_STATE",
    status: "PARTIAL_SIGNAL_ONLY",
    notes: "PSSSB Clerk-specific preparation material contains Data Sufficiency, including Direction Sense, but the exact Punjab official-paper answer contract is not yet verified. Do not freeze a Punjab-specific rendering profile from this signal alone.",
  },
];

export function semanticOrderFingerprint(order: readonly SufficiencyClass[]): string {
  return order.join("|");
}

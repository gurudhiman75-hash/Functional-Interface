import { PFC_001_DISCOVERY_AUDIT_V1 } from "./paper-folding-discovery-audit-v1";

export const PFC_001_SOURCE_AUDIT_V1 = Object.freeze({
  authorityId: "PFC-001-EXAM-SOURCE-AUDIT-V1" as const,
  chapterCode: "PFC-001" as const,
  discoveryAuditAuthorityId: PFC_001_DISCOVERY_AUDIT_V1.authorityId,
  auditDate: "2026-08-18" as const,
  evidencePolicy:
    "DISTINGUISH_DIRECT_INDEXED_PYQ_EVIDENCE_FROM_SYLLABUS_OR_PREPARATION_RELEVANCE" as const,
  ssc: {
    status: "DIRECT_INDEXED_PYQ_EVIDENCE_ESTABLISHED_MULTIPLE_YEARS" as const,
    evidenceClass: "THIRD_PARTY_INDEXED_PREVIOUS_YEAR_PAPERS" as const,
    examples: [
      {
        exam: "SSC CHSL",
        examDate: "2019-07-09",
        evidence: "Previous-year paper contains a paper-folding-and-cutting unfolding question.",
        source: "AglaSem Career",
        url: "https://career.aglasem.com/ssc-chsl-question-paper-answer-key-9-july-2019/",
      },
      {
        exam: "SSC CHSL",
        examDate: "2020-03-18",
        evidence: "Shift 1 question asks how folded and cut paper appears when unfolded.",
        source: "Cracku",
        url: "https://cracku.in/47-a-paper-is-folded-and-cut-as-shown-in-the-followin-x-ssc-chsl-18th-march-2020-shift-1",
      },
      {
        exam: "SSC CHSL",
        examDate: "2024-07-05",
        evidence: "Tier-I official-paper index includes a paper folding and cutting unfolding question.",
        source: "Testbook",
        url: "https://testbook.com/question-answer/a-paper-is-folded-and-cut-as-shown-below-how-will--66a33fe6b943a64e3023f4ba",
      },
      {
        exam: "SSC CGL",
        examDate: "2024-09-18",
        evidence: "Tier-I previous-year paper starts with a paper folded-and-cut unfolding question.",
        source: "EduRev",
        url: "https://edurev.in/p/376613/ssc-cgl-tier-1-18th-september-shift-2-past-year-paper-2024",
      },
    ],
    conclusion:
      "PFC_001_IS_DIRECTLY_RELEVANT_TO_SSC_AND_SUPPORTED_BY_RECURRENT_INDEXED_PYQ_EVIDENCE" as const,
  },
  banking: {
    status: "DIRECT_PFC_PYQ_EVIDENCE_NOT_ESTABLISHED" as const,
    evidenceClass: "PREPARATION_RELEVANCE_ONLY" as const,
    note:
      "Banking reasoning preparation sources include broad reasoning coverage, but this audit did not establish a reliable named SBI/IBPS previous-year PFC item. Do not claim Banking PYQ saturation." as const,
  },
  punjabState: {
    status: "NON_VERBAL_REASONING_RELEVANCE_PRESENT_DIRECT_PFC_PYQ_NOT_ESTABLISHED" as const,
    evidenceClass: "SYLLABUS_AND_PREPARATION_RELEVANCE" as const,
    note:
      "Punjab recruitment syllabi include non-verbal/visual reasoning scope and some preparation sources name paper folding/cutting, but this audit does not treat that as direct Punjab previous-year PFC evidence." as const,
  },
  controlledTaxonomyStatus: PFC_001_DISCOVERY_AUDIT_V1.controlledTaxonomyStatus,
  sourceSaturationClaim: "SSC_CHAPTER_RELEVANCE_ESTABLISHED_FULL_EXAM_SOURCE_SATURATION_NOT_CLAIMED" as const,
  permanentQlAllocationAllowed: true,
  allocationRationale:
    "SSC direct recurrence plus saturated controlled PFC reasoning taxonomy is sufficient to allocate internal skill authorities; Banking and Punjab claims remain explicitly unproven." as const,
  nextGate: "PERMANENT_SKILL_ALLOCATION_AND_ENGLISH_RUNTIME_REVIEW" as const,
} as const);

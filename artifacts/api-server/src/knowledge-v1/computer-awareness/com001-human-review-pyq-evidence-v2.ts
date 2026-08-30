export type Com001HumanReviewPyqEvidenceV2 = {
  evidenceId: string;
  exam: string;
  heldOn: string;
  learnerTask: string;
  observedQuestionForm: string;
  canonicalAnswer: string;
  evidenceUrl: string;
  evidenceRole: "PATTERN_AND_EXAM_CONVENTION";
  promotionStatus: "REVIEW_EVIDENCE_ONLY";
};

/**
 * Human-review evidence used to judge exam authenticity of V2 candidates.
 *
 * These records are not canonical technical facts by themselves. They show
 * how actual competitive exams frame the learner task and, for capacity
 * units, which convention the exam expects. Technical standards remain in
 * their separate authority layer.
 */
export const COM001_HUMAN_REVIEW_PYQ_EVIDENCE_V2: Com001HumanReviewPyqEvidenceV2[] = [
  {
    evidenceId: "SSC-CGL-2023-MAGNETIC-TAPE-SEQUENTIAL",
    exam: "SSC CGL (2022) Tier-II Official Paper",
    heldOn: "2023-03-07",
    learnerTask: "magnetic-tape access/backup characteristics",
    observedQuestionForm: "Identify the incorrect statement about magnetic tape, including whether it is suitable for randomly accessed data.",
    canonicalAnswer: "Magnetic tape is sequential-access storage and is not suitable for random-access workloads.",
    evidenceUrl: "https://testbook.com/question-answer/which-among-the-following-statements-is-incorrect--6410c0665eb3e6ad6aa0faee",
    evidenceRole: "PATTERN_AND_EXAM_CONVENTION",
    promotionStatus: "REVIEW_EVIDENCE_ONLY",
  },
  {
    evidenceId: "SSC-CHSL-2023-MB-1024KB",
    exam: "SSC CHSL Tier-I Exam 2022 Official Paper",
    heldOn: "2023-03-21",
    learnerTask: "traditional competitive-exam capacity-unit relation",
    observedQuestionForm: "A megabyte (MB) consists of 1024 ______.",
    canonicalAnswer: "Kilobytes",
    evidenceUrl: "https://testbook.com/question-answer/a-megabyte-mb-consists-of-1024-______--642d2de208352397c5142f7d",
    evidenceRole: "PATTERN_AND_EXAM_CONVENTION",
    promotionStatus: "REVIEW_EVIDENCE_ONLY",
  },
  {
    evidenceId: "UPSSSC-JA-2025-STORAGE-UNITS",
    exam: "UPSSSC Junior Assistant Official Paper",
    heldOn: "2025-06-29",
    learnerTask: "traditional competitive-exam storage-capacity hierarchy",
    observedQuestionForm: "Match KB, MB, GB and TB with 1024-based adjacent-unit sizes.",
    canonicalAnswer: "1 KB = 1024 bytes; 1 MB = 1024 KB; 1 GB = 1024 MB; 1 TB = 1024 GB",
    evidenceUrl: "https://testbook.com/question-answer/match-storage-capacity-units-list-i-with-their-c--69522ce23caecfbf7ed76b24",
    evidenceRole: "PATTERN_AND_EXAM_CONVENTION",
    promotionStatus: "REVIEW_EVIDENCE_ONLY",
  },
];

export function auditCom001HumanReviewPyqEvidenceV2() {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const evidence of COM001_HUMAN_REVIEW_PYQ_EVIDENCE_V2) {
    if (ids.has(evidence.evidenceId)) issues.push(`DUPLICATE_EVIDENCE_ID:${evidence.evidenceId}`);
    ids.add(evidence.evidenceId);
    if (!/^https:\/\//u.test(evidence.evidenceUrl)) issues.push(`NON_HTTPS_EVIDENCE:${evidence.evidenceId}`);
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(evidence.heldOn)) issues.push(`INVALID_HELD_DATE:${evidence.evidenceId}`);
    if (evidence.promotionStatus !== "REVIEW_EVIDENCE_ONLY") issues.push(`EVIDENCE_PREMATURELY_PROMOTED:${evidence.evidenceId}`);
  }
  return {
    valid: issues.length === 0,
    evidenceCount: COM001_HUMAN_REVIEW_PYQ_EVIDENCE_V2.length,
    issues,
  };
}

export type Com002CrossExamEvidence = {
  evidenceId: string;
  examFamily: "BANKING" | "SSC" | "PUNJAB_STATE";
  exam: string;
  learnerTask: string;
  supportsCandidateIds: string[];
  sourceUrl: string;
  answerSignal: string;
  evidenceUse: "TASK_RELEVANCE_ONLY";
};

/**
 * Cross-exam task evidence kept separate from canonical truth authority.
 * These records prove that a learner task occurs in target exam families.
 */
export const COM002_CROSS_EXAM_PYQ_EVIDENCE: Com002CrossExamEvidence[] = [
  {
    evidenceId: "COM002-PYQ-SBI-2012-BOOTING",
    examFamily: "BANKING",
    exam: "SBI Clerk 14 Oct 2012",
    learnerTask: "Identify loading the operating system at startup as booting",
    supportsCandidateIds: ["OS-DISC-011"],
    sourceUrl: "https://cracku.in/107-what-is-loading-the-operating-system-into-a-person-x-sbi-clerk-2012-2",
    answerSignal: "Booting",
    evidenceUse: "TASK_RELEVANCE_ONLY",
  },
  {
    evidenceId: "COM002-PYQ-SBI-2014-LINUX",
    examFamily: "BANKING",
    exam: "SBI Clerk 27 Jul 2014",
    learnerTask: "Classify Linux as an operating system",
    supportsCandidateIds: ["OS-DISC-003", "OS-DISC-006"],
    sourceUrl: "https://cracku.in/61-what-is-linux-x-sbi-clerk-2014-2",
    answerSignal: "Operating system",
    evidenceUse: "TASK_RELEVANCE_ONLY",
  },
  {
    evidenceId: "COM002-PYQ-SBI-2008-OS-FUNCTION",
    examFamily: "BANKING",
    exam: "SBI Clerk 13 Jul 2008 Shift 1",
    learnerTask: "Identify the operating system from its interface/resource-management role",
    supportsCandidateIds: ["OS-DISC-001", "OS-DISC-002"],
    sourceUrl: "https://cracku.in/106-which-type-of-software-manages-the-computers-proce-x-sbi-clerk-2008-1",
    answerSignal: "Operating system",
    evidenceUse: "TASK_RELEVANCE_ONLY",
  },
  {
    evidenceId: "COM002-PYQ-SBI-2014-FILE-EXTENSION",
    examFamily: "BANKING",
    exam: "SBI Clerk 27 Jul 2014",
    learnerTask: "Identify the suffix at the end of a filename that determines file type",
    supportsCandidateIds: ["OS-DISC-016", "OS-DISC-017"],
    sourceUrl: "https://cracku.in/58-which-of-the-following-is-contained-at-the-end-of--x-sbi-clerk-2014-2",
    answerSignal: "File extension",
    evidenceUse: "TASK_RELEVANCE_ONLY",
  },
  {
    evidenceId: "COM002-PYQ-SBI-2012-TEXT-EXTENSION",
    examFamily: "BANKING",
    exam: "SBI Clerk 27 May 2012 Shift 2",
    learnerTask: "Map a common text-file format to the .txt extension",
    supportsCandidateIds: ["OS-DISC-017"],
    sourceUrl: "https://cracku.in/sbi-clerk-2012-3-question-paper-solved?page=11",
    answerSignal: "Text (.txt)",
    evidenceUse: "TASK_RELEVANCE_ONLY",
  },
];

export function auditCom002CrossExamPyqEvidence() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const supportedCandidates = new Set<string>();
  for (const evidence of COM002_CROSS_EXAM_PYQ_EVIDENCE) {
    if (ids.has(evidence.evidenceId)) issues.push(`DUPLICATE_EVIDENCE_ID:${evidence.evidenceId}`);
    ids.add(evidence.evidenceId);
    if (!evidence.sourceUrl.startsWith("https://")) issues.push(`NON_HTTPS_EVIDENCE:${evidence.evidenceId}`);
    if (evidence.supportsCandidateIds.length === 0) issues.push(`NO_CANDIDATE_LINK:${evidence.evidenceId}`);
    evidence.supportsCandidateIds.forEach((id) => supportedCandidates.add(id));
  }
  const bankingCount = COM002_CROSS_EXAM_PYQ_EVIDENCE.filter(
    (entry) => entry.examFamily === "BANKING",
  ).length;
  if (bankingCount < 5) issues.push(`THIN_BANKING_EVIDENCE:${bankingCount}`);
  return {
    valid: issues.length === 0,
    evidenceCount: COM002_CROSS_EXAM_PYQ_EVIDENCE.length,
    bankingCount,
    supportedCandidateIds: [...supportedCandidates].sort(),
    issues,
  };
}

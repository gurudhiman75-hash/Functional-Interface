export type Com002SscTier2Evidence = {
  evidenceId: string;
  exam: string;
  learnerTask: string;
  supportsCandidateIds: string[];
  sourceUrl: string;
  answerSignal: string;
  evidenceUse: "TASK_RELEVANCE_ONLY";
};

/**
 * Recent SSC Tier-II task evidence for COM-002.
 *
 * These records establish learner-task and surface relevance. They are not the
 * canonical truth authority when Microsoft/NIELIT/other first-party sources
 * are available for the underlying fact.
 */
export const COM002_SSC_TIER2_PYQ_EVIDENCE: Com002SscTier2Evidence[] = [
  {
    evidenceId: "COM002-PYQ-SSC-CGL-2023-WIN-E",
    exam: "SSC CGL (2022) Tier-II Official Paper — held 6 Mar 2023",
    learnerTask: "Map the Windows+E shortcut to Windows/File Explorer",
    supportsCandidateIds: ["OS-DISC-014", "OS-DISC-020", "OS-DISC-021"],
    sourceUrl: "https://testbook.com/question-answer/which-among-the-following-keyboard-shortcut-can-be--64108acb63d84b0f41c699eb",
    answerSignal: "Windows Key + E opens Windows Explorer/File Explorer",
    evidenceUse: "TASK_RELEVANCE_ONLY",
  },
  {
    evidenceId: "COM002-PYQ-SSC-CHSL-2024-F2-RENAME",
    exam: "SSC CHSL Tier-II Exam 2024 Official Paper — held 18 Nov 2024",
    learnerTask: "Map F2 to renaming a selected Windows file/folder",
    supportsCandidateIds: ["OS-DISC-018", "OS-DISC-020", "OS-DISC-021"],
    sourceUrl: "https://testbook.com/question-answer/which-of-the-following-keyboard-shortcuts-is-commo--6749d59c818734ac1067b299",
    answerSignal: "F2 renames the selected file or folder",
    evidenceUse: "TASK_RELEVANCE_ONLY",
  },
  {
    evidenceId: "COM002-PYQ-SSC-CGL-2023-ALT-ENTER-PROPERTIES",
    exam: "SSC CGL (2022) Tier-II Official Paper — held 6 Mar 2023",
    learnerTask: "Map Alt+Enter to properties of a selected Windows item",
    supportsCandidateIds: ["OS-DISC-020", "OS-DISC-021", "OS-DISC-022"],
    sourceUrl: "https://testbook.com/question-answer/which-among-the-following-keyboard-shortcuts-open--64108b3ae7f116c414789e44/amp",
    answerSignal: "Alt + Enter opens properties for the selected item",
    evidenceUse: "TASK_RELEVANCE_ONLY",
  },
  {
    evidenceId: "COM002-PYQ-SSC-CGL-2025-FILE-EXPLORER-OPERATIONS",
    exam: "SSC CGL Tier-II Paper 2024 — held 18 Jan 2025",
    learnerTask: "Identify operations directly performed through Windows File Explorer",
    supportsCandidateIds: ["OS-DISC-014", "OS-DISC-018"],
    sourceUrl: "https://sscportal.in/sites/default/files/ssc-cgl-tier-2-paper-2024-held-on-18-january-2025.pdf",
    answerSignal: "Move, copy, or delete files",
    evidenceUse: "TASK_RELEVANCE_ONLY",
  },
  {
    evidenceId: "COM002-PYQ-SSC-CGL-2025-MULTI-STATEMENT-FORMAT",
    exam: "SSC CGL Tier-II Paper 2024 — held 18 Jan 2025",
    learnerTask: "Use multi-statement truth evaluation in Computer Knowledge",
    supportsCandidateIds: ["OS-DISC-023"],
    sourceUrl: "https://sscportal.in/sites/default/files/ssc-cgl-tier-2-paper-2024-held-on-18-january-2025.pdf",
    answerSignal: "Computer module includes statement-combination questions with independently checkable facts",
    evidenceUse: "TASK_RELEVANCE_ONLY",
  },
];

export function auditCom002SscTier2PyqEvidence() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const supportedCandidateIds = new Set<string>();

  for (const evidence of COM002_SSC_TIER2_PYQ_EVIDENCE) {
    if (ids.has(evidence.evidenceId)) issues.push(`DUPLICATE_EVIDENCE_ID:${evidence.evidenceId}`);
    ids.add(evidence.evidenceId);
    if (!evidence.sourceUrl.startsWith("https://")) issues.push(`NON_HTTPS_EVIDENCE:${evidence.evidenceId}`);
    if (evidence.supportsCandidateIds.length === 0) issues.push(`NO_CANDIDATE_LINK:${evidence.evidenceId}`);
    evidence.supportsCandidateIds.forEach((id) => supportedCandidateIds.add(id));
  }

  const multiStatementEvidence = COM002_SSC_TIER2_PYQ_EVIDENCE.some(
    (entry) => entry.supportsCandidateIds.includes("OS-DISC-023"),
  );
  const shortcutEvidenceCount = COM002_SSC_TIER2_PYQ_EVIDENCE.filter((entry) =>
    entry.supportsCandidateIds.some((id) => id === "OS-DISC-020" || id === "OS-DISC-021"),
  ).length;

  if (!multiStatementEvidence) issues.push("NO_MULTI_STATEMENT_FORMAT_EVIDENCE");
  if (shortcutEvidenceCount < 3) issues.push(`THIN_SHORTCUT_PYQ_EVIDENCE:${shortcutEvidenceCount}`);

  return {
    valid: issues.length === 0,
    evidenceCount: COM002_SSC_TIER2_PYQ_EVIDENCE.length,
    shortcutEvidenceCount,
    multiStatementEvidence,
    supportedCandidateIds: [...supportedCandidateIds].sort(),
    issues,
  };
}

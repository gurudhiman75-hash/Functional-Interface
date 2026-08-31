import { auditCom002SourceManifest } from "./com002-source-manifest";
import {
  COM002_OPERATING_SYSTEM_DISCOVERY,
  auditCom002OperatingSystemDiscovery,
} from "./com002-operating-system-discovery";
import { auditCom002CrossExamPyqEvidence } from "./com002-cross-exam-pyq-evidence";
import { auditCom002SscTier2PyqEvidence } from "./com002-ssc-tier2-pyq-evidence";
import {
  COM002_PROVISIONAL_LEARNER_TASKS,
  auditCom002MergeSplitOwnership,
} from "./com002-operating-system-merge-split-audit";

export const COM002_CP_ALLOCATION_PROPOSAL = [
  {
    proposedCpKey: "OS_CONCEPTS_WINDOWS_INTERFACE",
    title: "Operating System Concepts & Windows Interface",
    provisionalTaskIds: [
      "COM002-PT-001",
      "COM002-PT-002",
      "COM002-PT-003",
      "COM002-PT-004",
      "COM002-PT-005",
      "COM002-PT-006",
      "COM002-PT-007",
    ] as const,
    rationale: [
      "Groups OS identity/function/type/kernel/interface/startup and durable Windows desktop/settings awareness.",
      "Keeps the conceptual OS/Windows-interface object graph separate from file-management operations.",
    ],
  },
  {
    proposedCpKey: "FILES_FOLDERS_WINDOWS_OPERATIONS",
    title: "Files, Folders & Windows Operations",
    provisionalTaskIds: [
      "COM002-PT-008",
      "COM002-PT-009",
      "COM002-PT-010",
      "COM002-PT-011",
      "COM002-PT-012",
      "COM002-PT-013",
    ] as const,
    rationale: [
      "Groups File Explorer/navigation, file concepts/extensions, operations, deletion/recovery, shortcuts and composed statement evaluation.",
      "Recent SSC Tier-II evidence independently supports File Explorer operations, Windows shortcuts and multi-statement Computer Knowledge surfaces.",
    ],
  },
] as const;

function candidate(candidateId: string) {
  return COM002_OPERATING_SYSTEM_DISCOVERY.find((entry) => entry.candidateId === candidateId);
}

export type Com002AllocationReadiness = {
  status: "READY_FOR_PERMANENT_ALLOCATION" | "BLOCKED";
  discoveryCandidateCount: number;
  provisionalTaskCount: number;
  heldTaskCount: number;
  proposedCpCount: number;
  sourceSaturationProven: boolean;
  crossExamEvidenceProven: boolean;
  recentSscEvidenceProven: boolean;
  mergeSplitOwnershipProven: boolean;
  inverseSurfaceOwnershipProven: boolean;
  crossChapterOwnershipProven: boolean;
  versionSensitivityProtected: boolean;
  multiStatementFormatEvidenceProven: boolean;
  allProvisionalTasksAssignedToExactlyOneCp: boolean;
  heldCandidatesExcludedFromCpProposal: boolean;
  permanentQlCountBeforeAllocation: 0;
  issues: string[];
};

export function auditCom002AllocationReadiness(): Com002AllocationReadiness {
  const issues: string[] = [];
  const source = auditCom002SourceManifest();
  const discovery = auditCom002OperatingSystemDiscovery();
  const banking = auditCom002CrossExamPyqEvidence();
  const ssc = auditCom002SscTier2PyqEvidence();
  const mergeSplit = auditCom002MergeSplitOwnership();

  const sourceSaturationProven = source.valid && source.pyqCount >= 5 && source.firstPartyCount >= 7;
  const crossExamEvidenceProven = banking.valid && banking.bankingCount >= 5;
  const recentSscEvidenceProven = ssc.valid && ssc.evidenceCount >= 5;
  const mergeSplitOwnershipProven = mergeSplit.valid && mergeSplit.discoveryCandidateCount === 25;

  const inversePairs = [
    ["OS-DISC-001", "OS-DISC-002"],
    ["OS-DISC-020", "OS-DISC-021"],
  ] as const;
  const inverseSurfaceOwnershipProven = inversePairs.every(([left, right]) => {
    const owner = COM002_PROVISIONAL_LEARNER_TASKS.find((task) => task.candidateIds.includes(left));
    return Boolean(owner && owner.candidateIds.includes(right));
  });

  const extensionOwnership = candidate("OS-DISC-017")?.ownershipNotes ?? [];
  const shortcutOwnership = candidate("OS-DISC-020")?.ownershipNotes ?? [];
  const deepOsOwnership = candidate("OS-DISC-009")?.ambiguityRisks ?? [];
  const crossChapterOwnershipProven =
    extensionOwnership.some((note) => note.includes("COM-003")) &&
    shortcutOwnership.some((note) => note.includes("COM-003")) &&
    deepOsOwnership.some((note) => /scheduling|awareness level/i.test(note));

  const versionSensitiveCandidateIds = ["OS-DISC-007", "OS-DISC-013", "OS-DISC-019", "OS-DISC-022"];
  const versionSensitivityProtected = versionSensitiveCandidateIds.every((candidateId) => {
    const entry = candidate(candidateId);
    return Boolean(entry && ((entry.ambiguityRisks?.length ?? 0) > 0 || (entry.ownershipNotes?.length ?? 0) > 0));
  });

  const multiStatementFormatEvidenceProven = ssc.multiStatementEvidence;

  const provisionalTaskIds = COM002_PROVISIONAL_LEARNER_TASKS
    .filter((task) => task.disposition === "PROVISIONAL_TASK")
    .map((task) => task.provisionalTaskId);
  const cpTaskIds = COM002_CP_ALLOCATION_PROPOSAL.flatMap((cp) => [...cp.provisionalTaskIds]);
  const taskCounts = new Map<string, number>();
  cpTaskIds.forEach((id) => taskCounts.set(id, (taskCounts.get(id) ?? 0) + 1));
  const allProvisionalTasksAssignedToExactlyOneCp =
    provisionalTaskIds.length === cpTaskIds.length &&
    provisionalTaskIds.every((id) => taskCounts.get(id) === 1);

  const heldCandidates = new Set(
    COM002_PROVISIONAL_LEARNER_TASKS
      .filter((task) => task.disposition === "HOLD")
      .flatMap((task) => task.candidateIds),
  );
  const proposedCandidateIds = COM002_PROVISIONAL_LEARNER_TASKS
    .filter((task) => cpTaskIds.includes(task.provisionalTaskId as never))
    .flatMap((task) => task.candidateIds);
  const heldCandidatesExcludedFromCpProposal = proposedCandidateIds.every((id) => !heldCandidates.has(id));

  const checks: Array<[string, boolean]> = [
    ["SOURCE_SATURATION", sourceSaturationProven],
    ["CROSS_EXAM_EVIDENCE", crossExamEvidenceProven],
    ["RECENT_SSC_EVIDENCE", recentSscEvidenceProven],
    ["MERGE_SPLIT_OWNERSHIP", mergeSplitOwnershipProven],
    ["INVERSE_SURFACE_OWNERSHIP", inverseSurfaceOwnershipProven],
    ["CROSS_CHAPTER_OWNERSHIP", crossChapterOwnershipProven],
    ["VERSION_SENSITIVITY", versionSensitivityProtected],
    ["MULTI_STATEMENT_FORMAT_EVIDENCE", multiStatementFormatEvidenceProven],
    ["EXACT_CP_TASK_ASSIGNMENT", allProvisionalTasksAssignedToExactlyOneCp],
    ["HELD_CANDIDATES_EXCLUDED", heldCandidatesExcludedFromCpProposal],
  ];
  for (const [label, ok] of checks) if (!ok) issues.push(`BLOCKED:${label}`);

  if (discovery.permanentQlCount !== 0 || mergeSplit.permanentQlCount !== 0) {
    issues.push("PREMATURE_PERMANENT_QL_ALLOCATION");
  }

  return {
    status: issues.length === 0 ? "READY_FOR_PERMANENT_ALLOCATION" : "BLOCKED",
    discoveryCandidateCount: discovery.candidateCount,
    provisionalTaskCount: mergeSplit.provisionalTaskCount,
    heldTaskCount: mergeSplit.heldTaskCount,
    proposedCpCount: COM002_CP_ALLOCATION_PROPOSAL.length,
    sourceSaturationProven,
    crossExamEvidenceProven,
    recentSscEvidenceProven,
    mergeSplitOwnershipProven,
    inverseSurfaceOwnershipProven,
    crossChapterOwnershipProven,
    versionSensitivityProtected,
    multiStatementFormatEvidenceProven,
    allProvisionalTasksAssignedToExactlyOneCp,
    heldCandidatesExcludedFromCpProposal,
    permanentQlCountBeforeAllocation: 0,
    issues,
  };
}

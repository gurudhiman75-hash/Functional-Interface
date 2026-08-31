import { auditCom002AllocationReadiness } from "./com002-allocation-readiness";
import { COM002_PROVISIONAL_LEARNER_TASKS } from "./com002-operating-system-merge-split-audit";

export type Com002PermanentQl = {
  qlId: string;
  cpId: string;
  title: string;
  learnerTask: string;
  sourceProvisionalTaskId: string;
  supportedSolveModes: readonly string[];
  ownershipBoundaries: readonly string[];
  status: "ALLOCATED_NOT_CONTENT_FROZEN";
};

export type Com002PermanentCp = {
  cpId: string;
  title: string;
  qlIds: readonly string[];
  status: "ALLOCATED_NOT_CONTENT_FROZEN";
};

export const COM002_PERMANENT_QLS: readonly Com002PermanentQl[] = [
  {
    qlId: "COM-002-QL-001",
    cpId: "COM-002-CP-001",
    title: "Operating System Role & Function",
    learnerTask: "Identify an operating system from its principal role/function and map the OS to its core system-management functions.",
    sourceProvisionalTaskId: "COM002-PT-001",
    supportedSolveModes: ["FUNCTION_TO_ENTITY", "ENTITY_TO_FUNCTION", "CORRECT_INCORRECT_FUNCTION"],
    ownershipBoundaries: ["Application-specific functions stay in their owning Computer chapter."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-002",
    cpId: "COM-002-CP-001",
    title: "Operating System Identity & Classification",
    learnerTask: "Recognize named operating systems and classify eligible OS entities by open-source/proprietary or unambiguous platform attributes.",
    sourceProvisionalTaskId: "COM002-PT-002",
    supportedSolveModes: ["OS_VS_NON_OS", "ATTRIBUTE_TO_OS", "OS_TO_ATTRIBUTE", "ODD_ONE_OUT"],
    ownershipBoundaries: [
      "Do not classify a whole OS family as exclusively desktop/mobile when the product family spans device classes.",
      "Software-license theory beyond awareness-level classification is out of scope.",
    ],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-003",
    cpId: "COM-002-CP-001",
    title: "Operating System Type & Real-Time Behavior",
    learnerTask: "Classify awareness-level operating-system types and identify real-time OS from time-constrained response properties.",
    sourceProvisionalTaskId: "COM002-PT-003",
    supportedSolveModes: ["TYPE_FROM_PROPERTY", "PROPERTY_FROM_TYPE", "TYPE_CLASSIFICATION"],
    ownershipBoundaries: ["Scheduling algorithms, hard/soft RTOS theory and academic OS internals require separate future evidence."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-004",
    cpId: "COM-002-CP-001",
    title: "Kernel Identity & Function",
    learnerTask: "Identify the kernel as the core OS component and map it to awareness-level resource/hardware management functions.",
    sourceProvisionalTaskId: "COM002-PT-004",
    supportedSolveModes: ["COMPONENT_FROM_ROLE", "ROLE_FROM_COMPONENT", "CORE_COMPONENT_IDENTIFICATION"],
    ownershipBoundaries: ["Kernel architectures, scheduling algorithms and IPC are outside basic Computer Awareness unless separately evidenced."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-005",
    cpId: "COM-002-CP-001",
    title: "GUI vs CLI Interaction",
    learnerTask: "Distinguish graphical and command-line interface concepts from their interaction properties.",
    sourceProvisionalTaskId: "COM002-PT-005",
    supportedSolveModes: ["INTERFACE_FROM_PROPERTY", "PROPERTY_FROM_INTERFACE", "GUI_CLI_COMPARISON"],
    ownershipBoundaries: ["An operating system may expose both GUI and CLI; questions classify interface modes, not entire OS families as exclusive."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-006",
    cpId: "COM-002-CP-001",
    title: "Booting & Basic System Start/Stop",
    learnerTask: "Recognize booting as loading/starting the operating system and distinguish basic restart/shutdown actions at awareness depth.",
    sourceProvisionalTaskId: "COM002-PT-006",
    supportedSolveModes: ["TERM_FROM_PROCESS", "PROCESS_FROM_TERM", "START_STOP_ACTION"],
    ownershipBoundaries: ["BIOS/UEFI internals and boot-loader architecture are not included without new target-exam evidence."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-007",
    cpId: "COM-002-CP-001",
    title: "Windows Desktop Components & Basic Settings",
    learnerTask: "Map durable Windows desktop components/settings areas to their awareness-level purposes without relying on version-specific menu paths.",
    sourceProvisionalTaskId: "COM002-PT-007",
    supportedSolveModes: ["COMPONENT_FROM_FUNCTION", "FUNCTION_FROM_COMPONENT", "SETTINGS_AREA_FROM_TASK"],
    ownershipBoundaries: ["Prefer durable function-to-component knowledge; exact Windows-version menu coordinates are not canonical unless version is stated."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-008",
    cpId: "COM-002-CP-002",
    title: "File Explorer, Files, Folders & Paths",
    learnerTask: "Identify File Explorer and distinguish files, folders/directories, paths and basic visibility/property concepts in file-management context.",
    sourceProvisionalTaskId: "COM002-PT-008",
    supportedSolveModes: ["TOOL_FROM_PURPOSE", "PURPOSE_FROM_TOOL", "FILE_FOLDER_PATH_CLASSIFICATION", "VIEW_PROPERTY_IDENTIFICATION"],
    ownershipBoundaries: ["Folder and directory are treated as equivalent at awareness depth; do not manufacture a false distinction."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-009",
    cpId: "COM-002-CP-002",
    title: "File Extensions & File-Type Recognition",
    learnerTask: "Recognize file-extension semantics and map common general-purpose extensions to file types in both directions.",
    sourceProvisionalTaskId: "COM002-PT-009",
    supportedSolveModes: ["EXTENSION_CONCEPT", "EXTENSION_TO_TYPE", "TYPE_TO_EXTENSION", "MATCHED_EXTENSION_PAIR"],
    ownershipBoundaries: ["DOCX/XLSX/PPTX and application-format knowledge are owned by COM-003 Office unless the task is purely generic extension mechanics."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-010",
    cpId: "COM-002-CP-002",
    title: "File & Folder Operations",
    learnerTask: "Map create/copy/move/rename/search/delete and related file/folder operations to their intended effects.",
    sourceProvisionalTaskId: "COM002-PT-010",
    supportedSolveModes: ["ACTION_FROM_EFFECT", "EFFECT_FROM_ACTION", "FILE_EXPLORER_OPERATION_SELECTION"],
    ownershipBoundaries: ["Shortcut-key recall is owned by QL-012; deletion/recovery edge behavior is owned by QL-011."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-011",
    cpId: "COM-002-CP-002",
    title: "Windows Delete, Recycle Bin & Recovery Behavior",
    learnerTask: "Reason about ordinary local Windows deletion, Recycle Bin restoration and permanent-delete behavior.",
    sourceProvisionalTaskId: "COM002-PT-011",
    supportedSolveModes: ["DELETE_DESTINATION", "RECOVERY_ACTION", "PERMANENT_DELETE_BEHAVIOR"],
    ownershipBoundaries: ["Cloud, network and removable-drive deletion behavior is excluded unless the question explicitly defines that environment."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-012",
    cpId: "COM-002-CP-002",
    title: "Windows & File Explorer Keyboard Shortcuts",
    learnerTask: "Map durable Windows/File Explorer shortcuts and actions in both directions.",
    sourceProvisionalTaskId: "COM002-PT-012",
    supportedSolveModes: ["SHORTCUT_TO_ACTION", "ACTION_TO_SHORTCUT", "CORRECT_SHORTCUT_PAIR"],
    ownershipBoundaries: ["Office application shortcuts stay in COM-003; only durable Windows/system/File Explorer shortcuts are eligible."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    qlId: "COM-002-QL-013",
    cpId: "COM-002-CP-002",
    title: "Operating System & File Management Multi-Statement Evaluation",
    learnerTask: "Evaluate independently verifiable statement combinations across approved COM-002 facts.",
    sourceProvisionalTaskId: "COM002-PT-013",
    supportedSolveModes: ["MULTI_STATEMENT_TRUTH_VECTOR", "CORRECT_COMBINATION"],
    ownershipBoundaries: ["Every statement truth value must be independently recomputed from canonical facts; authored truth labels are never trusted."],
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
] as const;

export const COM002_PERMANENT_CPS: readonly Com002PermanentCp[] = [
  {
    cpId: "COM-002-CP-001",
    title: "Operating System Concepts & Windows Interface",
    qlIds: COM002_PERMANENT_QLS.filter((ql) => ql.cpId === "COM-002-CP-001").map((ql) => ql.qlId),
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    cpId: "COM-002-CP-002",
    title: "Files, Folders & Windows Operations",
    qlIds: COM002_PERMANENT_QLS.filter((ql) => ql.cpId === "COM-002-CP-002").map((ql) => ql.qlId),
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
] as const;

export const COM002_HELD_DISCOVERY_CANDIDATES = [
  {
    candidateId: "OS-DISC-024",
    reason: "Multi-pair matching remains held until recurring target-exam matching evidence is established.",
  },
  {
    candidateId: "OS-DISC-025",
    reason: "Legacy DOS/command-line basics remain held pending sufficient current target-exam evidence.",
  },
] as const;

export function auditCom002PermanentAllocation() {
  const issues: string[] = [];
  const readiness = auditCom002AllocationReadiness();
  if (readiness.status !== "READY_FOR_PERMANENT_ALLOCATION") {
    issues.push("ALLOCATION_READINESS_NOT_GREEN");
  }

  const qlIds = new Set<string>();
  const provisionalOwners = new Set<string>();
  const cpIds = new Set(COM002_PERMANENT_CPS.map((cp) => cp.cpId));
  for (const ql of COM002_PERMANENT_QLS) {
    if (qlIds.has(ql.qlId)) issues.push(`DUPLICATE_QL_ID:${ql.qlId}`);
    qlIds.add(ql.qlId);
    if (!cpIds.has(ql.cpId)) issues.push(`UNKNOWN_CP:${ql.qlId}:${ql.cpId}`);
    if (provisionalOwners.has(ql.sourceProvisionalTaskId)) {
      issues.push(`DUPLICATE_PROVISIONAL_OWNER:${ql.sourceProvisionalTaskId}`);
    }
    provisionalOwners.add(ql.sourceProvisionalTaskId);
    if (ql.supportedSolveModes.length < 2) issues.push(`THIN_SOLVE_MODE_SET:${ql.qlId}`);
    if (ql.ownershipBoundaries.length === 0) issues.push(`NO_OWNERSHIP_BOUNDARY:${ql.qlId}`);
  }

  const expectedProvisionalTaskIds = COM002_PROVISIONAL_LEARNER_TASKS
    .filter((task) => task.disposition === "PROVISIONAL_TASK")
    .map((task) => task.provisionalTaskId)
    .sort();
  if (JSON.stringify([...provisionalOwners].sort()) !== JSON.stringify(expectedProvisionalTaskIds)) {
    issues.push("PERMANENT_QLS_DO_NOT_COVER_PROVISIONAL_TASKS_EXACTLY_ONCE");
  }

  const heldIds = new Set(COM002_HELD_DISCOVERY_CANDIDATES.map((entry) => entry.candidateId));
  const heldOwners = COM002_PROVISIONAL_LEARNER_TASKS
    .filter((task) => task.disposition === "HOLD")
    .flatMap((task) => task.candidateIds)
    .sort();
  if (JSON.stringify([...heldIds].sort()) !== JSON.stringify(heldOwners)) {
    issues.push("HELD_DISCOVERY_SET_DRIFT");
  }

  if (COM002_PERMANENT_CPS.length !== 2) issues.push(`UNEXPECTED_CP_COUNT:${COM002_PERMANENT_CPS.length}`);
  if (COM002_PERMANENT_QLS.length !== 13) issues.push(`UNEXPECTED_QL_COUNT:${COM002_PERMANENT_QLS.length}`);
  if (COM002_PERMANENT_CPS[0]?.qlIds.length !== 7) issues.push("CP001_QL_COUNT_DRIFT");
  if (COM002_PERMANENT_CPS[1]?.qlIds.length !== 6) issues.push("CP002_QL_COUNT_DRIFT");

  return {
    valid: issues.length === 0,
    chapterId: "COM-002" as const,
    cpCount: COM002_PERMANENT_CPS.length,
    qlCount: COM002_PERMANENT_QLS.length,
    heldCandidateCount: COM002_HELD_DISCOVERY_CANDIDATES.length,
    status: issues.length === 0 ? "PERMANENT_TAXONOMY_ALLOCATED" as const : "BLOCKED" as const,
    contentFrozen: false,
    runtimeRegistered: false,
    issues,
  };
}

import { COM002_OPERATING_SYSTEM_DISCOVERY } from "./com002-operating-system-discovery";
import { COM002_CROSS_EXAM_PYQ_EVIDENCE } from "./com002-cross-exam-pyq-evidence";

export type Com002ProvisionalLearnerTask = {
  provisionalTaskId: string;
  title: string;
  candidateIds: string[];
  relationFamilies: string[];
  disposition: "PROVISIONAL_TASK" | "HOLD";
  rationale: string[];
  splitConditions?: string[];
};

/**
 * Merge/split ownership pass for COM-002.
 *
 * These are still NOT permanent QLs. The audit only establishes provisional
 * learner-task boundaries and ensures every discovery candidate is accounted
 * for exactly once before corpus/QL allocation work begins.
 */
export const COM002_PROVISIONAL_LEARNER_TASKS: Com002ProvisionalLearnerTask[] = [
  {
    provisionalTaskId: "COM002-PT-001",
    title: "Operating System Role & Function",
    candidateIds: ["OS-DISC-001", "OS-DISC-002"],
    relationFamilies: ["os-function"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Forward and inverse OS-function questions test the same canonical relation.",
      "Banking PYQ evidence independently confirms the operating-system interface/resource-management learner task.",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-002",
    title: "Operating System Identity & Classification",
    candidateIds: ["OS-DISC-003", "OS-DISC-006", "OS-DISC-007"],
    relationFamilies: ["os-example-classification", "os-license-classification", "os-platform-classification"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "All three surfaces classify named OS entities by a canonical attribute rather than requiring a different solver.",
      "SSC and SBI evidence confirms named-OS recognition; Ubuntu first-party evidence supports open-source classification.",
    ],
    splitConditions: [
      "split license classification if open-source/proprietary questions develop a distinct misconception/difficulty profile",
      "split mobile/desktop platform classification if ambiguous cross-device families cannot be kept out by eligibility rules",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-003",
    title: "Operating System Type & Real-Time Behavior",
    candidateIds: ["OS-DISC-004", "OS-DISC-005"],
    relationFamilies: ["os-type-classification", "real-time-os-property"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "SSC directly tests real-time response constraints and broader OS-type recognition.",
      "RTOS remains awareness-level; academic scheduling theory is out of scope.",
    ],
    splitConditions: [
      "split RTOS if hard/soft deadline reasoning receives repeated target-exam evidence",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-004",
    title: "Kernel Identity & Function",
    candidateIds: ["OS-DISC-008", "OS-DISC-009"],
    relationFamilies: ["kernel-core", "kernel-function"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Kernel identity and awareness-level function are two directions over the same component-role model.",
      "SSC PYQ explicitly asks the core-of-OS relation.",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-005",
    title: "GUI vs CLI Interaction",
    candidateIds: ["OS-DISC-010"],
    relationFamilies: ["user-interface-type"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "GUI/CLI is a distinct interface classification learner task and cannot be reduced to named-OS classification without creating false exclusivity claims.",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-006",
    title: "Booting & Basic System Start/Stop",
    candidateIds: ["OS-DISC-011"],
    relationFamilies: ["system-start-stop"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "SBI Clerk PYQ directly confirms loading the OS into a PC as booting.",
      "Keep BIOS/UEFI internals outside this task unless later evidence requires them.",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-007",
    title: "Windows Desktop Components & Basic Settings",
    candidateIds: ["OS-DISC-012", "OS-DISC-013"],
    relationFamilies: ["windows-ui-component", "windows-settings"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "NIELIT owns taskbar/icons/settings in one GUI-OS chapter and both are Windows interface-function mapping tasks.",
      "Version-specific menu paths are excluded; durable component/function knowledge is retained.",
    ],
    splitConditions: [
      "split settings if target-exam PYQs show substantial independent volume or a materially different action solver",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-008",
    title: "File Explorer, Files, Folders & Paths",
    candidateIds: ["OS-DISC-014", "OS-DISC-015", "OS-DISC-022"],
    relationFamilies: ["file-explorer-purpose", "file-folder-path-concept", "file-visibility-properties"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "These surfaces share the file-system navigation object model and File Explorer context.",
      "Hidden-item/properties viewing is kept as a realizer/object extension rather than a standalone learner task for now.",
    ],
    splitConditions: [
      "split generic file/folder/path concepts from File Explorer operations if cross-platform questions prove independent",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-009",
    title: "File Extensions & File-Type Recognition",
    candidateIds: ["OS-DISC-016", "OS-DISC-017"],
    relationFamilies: ["file-extension-concept", "file-type-extension-mapping"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "SSC and SBI independently confirm extension concept and extension-to-type mapping.",
      "Generic extension mechanics stay here; Office-specific format knowledge remains owned by COM-003.",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-010",
    title: "File & Folder Operations",
    candidateIds: ["OS-DISC-018"],
    relationFamilies: ["file-operation"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Create/copy/move/rename/search operations form one procedural-effect model distinct from shortcut recall.",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-011",
    title: "Windows Delete, Recycle Bin & Recovery Behavior",
    candidateIds: ["OS-DISC-019"],
    relationFamilies: ["delete-recovery-behavior"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "SSC CHSL Tier-II directly confirms the Recycle Bin learner task.",
      "Ordinary delete, restore and Shift+Delete require explicit local-Windows context to avoid cloud/network ambiguity.",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-012",
    title: "Windows & File Explorer Keyboard Shortcuts",
    candidateIds: ["OS-DISC-020", "OS-DISC-021"],
    relationFamilies: ["windows-shortcut-action"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Forward and inverse shortcut questions use the same action-shortcut relation and first-party Microsoft authority.",
      "Only durable OS/File Explorer shortcuts are eligible; application-specific Office shortcuts stay in COM-003.",
    ],
  },
  {
    provisionalTaskId: "COM002-PT-013",
    title: "Operating System & File Management Multi-Statement Evaluation",
    candidateIds: ["OS-DISC-023"],
    relationFamilies: ["os-multi-statement"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Retained provisionally because COM-001 proved the reusable independent composition verifier.",
      "Permanent allocation still requires target-exam evidence for multi-statement Computer Knowledge questions.",
    ],
    splitConditions: ["hold if PYQ/source saturation does not confirm statement-combination demand"],
  },
  {
    provisionalTaskId: "COM002-HOLD-001",
    title: "Multi-Pair Matching",
    candidateIds: ["OS-DISC-024"],
    relationFamilies: ["os-multi-pair-matching"],
    disposition: "HOLD",
    rationale: [
      "No target-exam matching evidence has been established yet; matching is not promoted merely as another surface format.",
    ],
  },
  {
    provisionalTaskId: "COM002-HOLD-002",
    title: "Legacy DOS / Command-Line Basics",
    candidateIds: ["OS-DISC-025"],
    relationFamilies: ["legacy-command-line-basics"],
    disposition: "HOLD",
    rationale: [
      "Older curricula include DOS, but current NIELIT Revision 4 emphasizes GUI OS and no sufficient current target-exam PYQ set has been established.",
    ],
  },
];

export function auditCom002MergeSplitOwnership() {
  const issues: string[] = [];
  const discoveryIds = new Set(COM002_OPERATING_SYSTEM_DISCOVERY.map((entry) => entry.candidateId));
  const ownedCounts = new Map<string, number>();

  for (const task of COM002_PROVISIONAL_LEARNER_TASKS) {
    if (task.candidateIds.length === 0) issues.push(`EMPTY_TASK:${task.provisionalTaskId}`);
    for (const candidateId of task.candidateIds) {
      if (!discoveryIds.has(candidateId)) issues.push(`UNKNOWN_CANDIDATE:${task.provisionalTaskId}:${candidateId}`);
      ownedCounts.set(candidateId, (ownedCounts.get(candidateId) ?? 0) + 1);
    }
  }

  for (const candidateId of discoveryIds) {
    const count = ownedCounts.get(candidateId) ?? 0;
    if (count === 0) issues.push(`UNOWNED_DISCOVERY_CANDIDATE:${candidateId}`);
    if (count > 1) issues.push(`MULTI_OWNED_DISCOVERY_CANDIDATE:${candidateId}:${count}`);
  }

  const bankingEvidenceCandidates = new Set(
    COM002_CROSS_EXAM_PYQ_EVIDENCE.flatMap((entry) => entry.supportsCandidateIds),
  );
  if (!bankingEvidenceCandidates.has("OS-DISC-011")) {
    issues.push("BOOTING_MISSING_BANKING_PYQ_EVIDENCE");
  }

  const provisionalTasks = COM002_PROVISIONAL_LEARNER_TASKS.filter(
    (entry) => entry.disposition === "PROVISIONAL_TASK",
  );
  const heldTasks = COM002_PROVISIONAL_LEARNER_TASKS.filter(
    (entry) => entry.disposition === "HOLD",
  );

  return {
    valid: issues.length === 0,
    discoveryCandidateCount: discoveryIds.size,
    provisionalTaskCount: provisionalTasks.length,
    heldTaskCount: heldTasks.length,
    provisionalTaskIds: provisionalTasks.map((entry) => entry.provisionalTaskId),
    heldCandidateIds: heldTasks.flatMap((entry) => entry.candidateIds),
    permanentQlCount: 0,
    allocationReady: false,
    issues,
  };
}

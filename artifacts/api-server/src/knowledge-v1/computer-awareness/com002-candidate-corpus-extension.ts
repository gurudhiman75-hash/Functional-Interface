import type {
  KnowledgeFact,
  KnowledgeFactSource,
  KnowledgeFreshnessClass,
  KnowledgeV1Difficulty,
} from "../types";
import { COM002_SOURCE_AUTHORITIES } from "./com002-source-manifest";
import { COM002_SOURCE_AUTHORITY_EXTENSION } from "./com002-source-authority-extension";

const ALL_AUTHORITIES = [
  ...COM002_SOURCE_AUTHORITIES,
  ...COM002_SOURCE_AUTHORITY_EXTENSION,
];

function source(sourceId: string, locator: string): KnowledgeFactSource {
  const authority = ALL_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!authority) throw new Error(`Unknown COM-002 source authority ${sourceId}`);
  const sourceType: KnowledgeFactSource["sourceType"] =
    authority.authorityClass === "OFFICIAL_EXAM"
      ? "official"
      : authority.authorityClass === "OFFICIAL_CURRICULUM" || authority.authorityClass === "GOVERNMENT_REFERENCE"
        ? "textbook"
        : "reference";
  return {
    sourceId: authority.sourceId,
    sourceType,
    title: authority.title,
    url: authority.url,
    locator,
  };
}

function textFact(input: {
  factId: string;
  entityId: string;
  cpId: "COM-002-CP-001" | "COM-002-CP-002";
  relation: string;
  entity: string;
  value: string;
  contextGroupId: string;
  sourceId: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
  tags: string[];
  freshnessClass?: KnowledgeFreshnessClass;
}): KnowledgeFact {
  const freshnessClass = input.freshnessClass ?? "IMMUTABLE";
  return {
    factId: input.factId,
    entityId: input.entityId,
    subject: "Computer Awareness",
    chapterId: "COM-002",
    cpId: input.cpId,
    relation: input.relation,
    entity: { canonicalName: input.entity, label: { en: input.entity } },
    value: { kind: "text", text: { en: input.value } },
    contextGroupId: input.contextGroupId,
    distractorGroupIds: [input.contextGroupId],
    difficulty: input.difficulty ?? "Easy",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: input.tags,
    source: source(input.sourceId, input.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.82 },
    freshness: freshnessClass === "IMMUTABLE"
      ? { class: "IMMUTABLE" }
      : { class: freshnessClass, lastVerifiedAt: "2026-08-26" },
  };
}

const osTypeBreadthFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-embedded-os-property",
    entityId: "computer:os-type:embedded",
    cpId: "COM-002-CP-001",
    relation: "os_type_property",
    entity: "Embedded operating system",
    value: "manages specialized devices and is optimized for constrained hardware and dedicated applications",
    contextGroupId: "os-type-properties",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "Types of operating systems: embedded operating systems",
    difficulty: "Medium",
    tags: ["operating-system", "embedded-os", "os-type"],
  }),
  textFact({
    factId: "com002-distributed-os-property",
    entityId: "computer:os-type:distributed",
    cpId: "COM-002-CP-001",
    relation: "os_type_property",
    entity: "Distributed operating system",
    value: "coordinates multiple independent computers so they can work together as a unified system",
    contextGroupId: "os-type-properties",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "Types of operating systems: distributed operating systems",
    difficulty: "Medium",
    tags: ["operating-system", "distributed-os", "os-type"],
  }),
  textFact({
    factId: "com002-network-os-property",
    entityId: "computer:os-type:network",
    cpId: "COM-002-CP-001",
    relation: "os_type_property",
    entity: "Network operating system",
    value: "manages and coordinates resources of multiple computers connected through a network",
    contextGroupId: "os-type-properties",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "Types of operating systems: network operating systems",
    difficulty: "Medium",
    tags: ["operating-system", "network-os", "os-type"],
  }),
  textFact({
    factId: "com002-cluster-os-property",
    entityId: "computer:os-type:cluster",
    cpId: "COM-002-CP-001",
    relation: "os_type_property",
    entity: "Cluster operating system",
    value: "manages interconnected computers that cooperate on tasks as a cluster",
    contextGroupId: "os-type-properties",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "Types of operating systems: cluster operating systems",
    difficulty: "Medium",
    tags: ["operating-system", "cluster-os", "os-type"],
  }),
];

const osComponentBreadthFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-shell-interface-role",
    entityId: "computer:os-component:shell",
    cpId: "COM-002-CP-001",
    relation: "component_role",
    entity: "Shell",
    value: "provides a user-facing command/interface layer for interacting with operating-system services",
    contextGroupId: "os-component-role",
    sourceId: "PSSCIVE-OS-STRUCTURE-2021",
    locator: "Operating-system structure: shell and kernel interface",
    difficulty: "Medium",
    tags: ["operating-system", "shell", "interface"],
  }),
];

const startStopBreadthFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-shutdown-turn-off",
    entityId: "computer:system-action:shutdown",
    cpId: "COM-002-CP-001",
    relation: "system_start_stop_meaning",
    entity: "Shut down",
    value: "turns the Windows PC off completely",
    contextGroupId: "system-start-stop",
    sourceId: "MICROSOFT-WINDOWS-SHUTDOWN-2026",
    locator: "Turn your PC off completely",
    tags: ["Windows", "shutdown", "power"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-restart-reboot",
    entityId: "computer:system-action:restart",
    cpId: "COM-002-CP-001",
    relation: "system_start_stop_meaning",
    entity: "Restart",
    value: "reboots the Windows PC and starts it again",
    contextGroupId: "system-start-stop",
    sourceId: "MICROSOFT-WINDOWS-RESTART-2026",
    locator: "Restart (reboot) your PC",
    tags: ["Windows", "restart", "reboot"],
    freshnessClass: "SLOW_MUTABLE",
  }),
];

const windowsUiBreadthFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-desktop-workspace",
    entityId: "computer:windows:desktop",
    cpId: "COM-002-CP-001",
    relation: "ui_component_function",
    entity: "Windows desktop",
    value: "provides the main graphical workspace where windows and desktop icons can appear",
    contextGroupId: "windows-ui-components",
    sourceId: "NIELIT-CCC-REV4-2023",
    locator: "Introduction to operating system: taskbar, icons and shortcuts on the desktop",
    tags: ["Windows", "desktop", "UI"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-notification-area-function",
    entityId: "computer:windows:notification-area",
    cpId: "COM-002-CP-001",
    relation: "ui_component_function",
    entity: "Taskbar notification area",
    value: "shows system-status icons and provides access to notification-related system features",
    contextGroupId: "windows-ui-components",
    sourceId: "MICROSOFT-WINDOWS-TASKBAR-2026",
    locator: "Taskbar system tray/notification area features",
    tags: ["Windows", "taskbar", "notification-area"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-settings-printer",
    entityId: "computer:windows:settings-printer",
    cpId: "COM-002-CP-001",
    relation: "settings_task",
    entity: "Windows printer settings",
    value: "add, remove or manage printers",
    contextGroupId: "windows-settings-tasks",
    sourceId: "NIELIT-CCC-REV4-2023",
    locator: "System settings: adding and removing printers",
    tags: ["Windows", "settings", "printer"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-settings-programs-features",
    entityId: "computer:windows:settings-programs-features",
    cpId: "COM-002-CP-001",
    relation: "settings_task",
    entity: "Windows installed-app/program settings",
    value: "manage installed programs, applications or optional features",
    contextGroupId: "windows-settings-tasks",
    sourceId: "NIELIT-CCC-REV4-2023",
    locator: "System settings: add/remove programs and features",
    tags: ["Windows", "settings", "programs", "features"],
    freshnessClass: "SLOW_MUTABLE",
  }),
];

const fileConceptBreadthFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-file-concept",
    entityId: "computer:file-system:file",
    cpId: "COM-002-CP-002",
    relation: "file_concept_definition",
    entity: "File",
    value: "named unit of stored data that can be organized inside folders or directories",
    contextGroupId: "file-folder-path-concepts",
    sourceId: "NIELIT-CCC-PLUS-OS",
    locator: "File and directory concepts",
    tags: ["file", "file-system", "file-management"],
  }),
];

const recoveryBreadthFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-recycle-bin-restore",
    entityId: "computer:windows:recycle-bin-restore",
    cpId: "COM-002-CP-002",
    relation: "delete_recovery_action",
    entity: "Restore from Recycle Bin",
    value: "recovers a deleted item that is still available in the Recycle Bin",
    contextGroupId: "windows-delete-recovery",
    sourceId: "NIELIT-CCC-PLUS-OS",
    locator: "File/directory operations: deleting and recovering files/folders",
    tags: ["Windows", "Recycle-Bin", "restore", "recovery"],
    freshnessClass: "SLOW_MUTABLE",
  }),
];

export const COM002_CANDIDATE_FACT_EXTENSION: KnowledgeFact[] = [
  ...osTypeBreadthFacts,
  ...osComponentBreadthFacts,
  ...startStopBreadthFacts,
  ...windowsUiBreadthFacts,
  ...fileConceptBreadthFacts,
  ...recoveryBreadthFacts,
];

export function auditCom002CandidateCorpusExtension() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const authorityIds = new Set(ALL_AUTHORITIES.map((entry) => entry.sourceId));
  for (const fact of COM002_CANDIDATE_FACT_EXTENSION) {
    if (ids.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    ids.add(fact.factId);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`PREMATURE_APPROVAL:${fact.factId}`);
    if (!authorityIds.has(fact.source.sourceId)) issues.push(`UNKNOWN_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    if (fact.chapterId !== "COM-002" || fact.subject !== "Computer Awareness") {
      issues.push(`OWNERSHIP_MISMATCH:${fact.factId}`);
    }
    if (fact.freshness.class !== "IMMUTABLE" && !fact.freshness.lastVerifiedAt) {
      issues.push(`MUTABLE_FACT_MISSING_VERIFICATION:${fact.factId}`);
    }
  }
  return {
    valid: issues.length === 0,
    factCount: COM002_CANDIDATE_FACT_EXTENSION.length,
    relationCounts: Object.fromEntries(
      [...new Set(COM002_CANDIDATE_FACT_EXTENSION.map((fact) => fact.relation))]
        .sort()
        .map((relation) => [relation, COM002_CANDIDATE_FACT_EXTENSION.filter((fact) => fact.relation === relation).length]),
    ),
    productionEligible: false,
    issues,
  };
}

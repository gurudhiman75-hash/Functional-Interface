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
  examTags?: string[];
  tags?: string[];
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
    examTags: input.examTags ?? ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: input.tags ?? [],
    source: source(input.sourceId, input.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.82 },
    freshness: freshnessClass === "IMMUTABLE"
      ? { class: "IMMUTABLE" }
      : { class: freshnessClass, lastVerifiedAt: "2026-08-25" },
  };
}

const osFunctionFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-os-primary-role",
    entityId: "computer:operating-system",
    cpId: "COM-002-CP-001",
    relation: "has_primary_role",
    entity: "Operating system",
    value: "manages computer hardware and applications by allocating system resources",
    contextGroupId: "os-role-function",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "OS definition and resource allocation",
    tags: ["operating-system", "function", "system-software"],
  }),
  textFact({
    factId: "com002-os-manages-cpu",
    entityId: "computer:operating-system",
    cpId: "COM-002-CP-001",
    relation: "manages_resource",
    entity: "Operating system",
    value: "CPU resources",
    contextGroupId: "os-managed-resources",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "OS allocates CPU resources",
    tags: ["operating-system", "CPU", "resource-management"],
  }),
  textFact({
    factId: "com002-os-manages-memory",
    entityId: "computer:operating-system",
    cpId: "COM-002-CP-001",
    relation: "manages_resource",
    entity: "Operating system",
    value: "memory resources",
    contextGroupId: "os-managed-resources",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "OS allocates memory resources",
    tags: ["operating-system", "memory", "resource-management"],
  }),
  textFact({
    factId: "com002-os-manages-io",
    entityId: "computer:operating-system",
    cpId: "COM-002-CP-001",
    relation: "manages_resource",
    entity: "Operating system",
    value: "input/output devices",
    contextGroupId: "os-managed-resources",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "OS allocates I/O device resources",
    tags: ["operating-system", "input-output", "resource-management"],
  }),
  textFact({
    factId: "com002-os-manages-file-storage",
    entityId: "computer:operating-system",
    cpId: "COM-002-CP-001",
    relation: "manages_resource",
    entity: "Operating system",
    value: "file-storage resources",
    contextGroupId: "os-managed-resources",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "OS allocates file-storage resources",
    tags: ["operating-system", "file-storage", "resource-management"],
  }),
];

const osIdentityFacts: KnowledgeFact[] = [
  ["windows", "Windows", "operating system", "NIELIT-CCC-REV4-2023"],
  ["ubuntu", "Ubuntu", "operating system", "UBUNTU-DESKTOP-2026"],
  ["android", "Android", "mobile operating system", "NIELIT-CCC-REV4-2023"],
  ["ios", "iOS", "mobile operating system", "NIELIT-CCC-REV4-2023"],
].map(([id, entity, classification, sourceId]) => textFact({
  factId: `com002-${id}-classification`,
  entityId: `computer:os:${id}`,
  cpId: "COM-002-CP-001",
  relation: "software_classification",
  entity,
  value: classification,
  contextGroupId: "os-example-classification",
  sourceId,
  locator: `${entity} operating-system classification`,
  tags: ["operating-system", "classification", id],
  freshnessClass: "SLOW_MUTABLE",
}));

const osAttributeFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-ubuntu-open-source",
    entityId: "computer:os:ubuntu",
    cpId: "COM-002-CP-001",
    relation: "license_class",
    entity: "Ubuntu Desktop",
    value: "open-source operating system",
    contextGroupId: "os-license-classification",
    sourceId: "UBUNTU-DESKTOP-2026",
    locator: "Ubuntu Desktop described as an open-source operating system",
    tags: ["Ubuntu", "open-source", "operating-system"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-ubuntu-platform",
    entityId: "computer:os:ubuntu-desktop",
    cpId: "COM-002-CP-001",
    relation: "platform_class",
    entity: "Ubuntu Desktop",
    value: "desktop and laptop computers",
    contextGroupId: "os-platform-classification",
    sourceId: "UBUNTU-DESKTOP-2026",
    locator: "Ubuntu Desktop for PCs and laptops",
    tags: ["Ubuntu", "desktop", "laptop"],
    freshnessClass: "SLOW_MUTABLE",
  }),
];

const osTypeFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-rtos-timely-deterministic-response",
    entityId: "computer:os-type:real-time",
    cpId: "COM-002-CP-001",
    relation: "os_type_property",
    entity: "Real-time operating system",
    value: "provides timely and deterministic response to events",
    contextGroupId: "os-type-properties",
    sourceId: "FREERTOS-RTOS-FAQ-2026",
    locator: "RTOS primary objective: timely and deterministic response to events",
    difficulty: "Medium",
    tags: ["RTOS", "real-time", "deterministic"],
  }),
  textFact({
    factId: "com002-rtos-time-constraints",
    entityId: "computer:os-type:real-time",
    cpId: "COM-002-CP-001",
    relation: "os_type_property",
    entity: "Real-time operating system",
    value: "reacts to external events within strict time constraints",
    contextGroupId: "os-type-properties",
    sourceId: "FREERTOS-RTOS-FUNDAMENTALS-2026",
    locator: "RTOS use in systems reacting within strict time constraints",
    difficulty: "Medium",
    tags: ["RTOS", "time-constraint"],
  }),
];

const kernelFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-kernel-core",
    entityId: "computer:os-component:kernel",
    cpId: "COM-002-CP-001",
    relation: "component_role",
    entity: "Kernel",
    value: "core component of an operating system",
    contextGroupId: "os-component-role",
    sourceId: "FREERTOS-RTOS-FUNDAMENTALS-2026",
    locator: "Kernel is the core component within an operating system",
    tags: ["kernel", "core", "operating-system"],
  }),
  textFact({
    factId: "com002-kernel-hardware-interface",
    entityId: "computer:os-component:kernel",
    cpId: "COM-002-CP-001",
    relation: "component_role",
    entity: "Kernel",
    value: "provides the core interface between operating-system software and hardware resources",
    contextGroupId: "os-component-role",
    sourceId: "PSSCIVE-OS-STRUCTURE-2021",
    locator: "Operating-system structure: kernel and hardware relationship",
    difficulty: "Medium",
    tags: ["kernel", "hardware", "resource-management"],
  }),
];

const interfaceFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-gui-interaction",
    entityId: "computer:interface:gui",
    cpId: "COM-002-CP-001",
    relation: "interface_property",
    entity: "Graphical user interface (GUI)",
    value: "uses graphical controls for user interaction",
    contextGroupId: "gui-cli-properties",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "OS user interface may be graphical",
    tags: ["GUI", "user-interface", "graphical"],
  }),
  textFact({
    factId: "com002-cli-interaction",
    entityId: "computer:interface:cli",
    cpId: "COM-002-CP-001",
    relation: "interface_property",
    entity: "Command-line interface (CLI)",
    value: "accepts text commands typed by the user",
    contextGroupId: "gui-cli-properties",
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    locator: "OS user interface may be command-line based",
    tags: ["CLI", "user-interface", "commands"],
  }),
];

const bootFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-boot-load-os",
    entityId: "computer:system-action:boot",
    cpId: "COM-002-CP-001",
    relation: "system_start_stop_meaning",
    entity: "Booting",
    value: "starts the computer and loads the operating system",
    contextGroupId: "system-start-stop",
    sourceId: "MICROSOFT-WINDOWS-BOOT-OPTIONS-2026",
    locator: "Boot Manager starts the system and the OS loader loads the selected operating system",
    tags: ["boot", "startup", "operating-system"],
  }),
];

const windowsUiFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-taskbar-function",
    entityId: "computer:windows:taskbar",
    cpId: "COM-002-CP-001",
    relation: "ui_component_function",
    entity: "Windows taskbar",
    value: "helps launch apps, switch open windows and access system features",
    contextGroupId: "windows-ui-components",
    sourceId: "MICROSOFT-WINDOWS-TASKBAR-2026",
    locator: "Taskbar overview",
    tags: ["Windows", "taskbar", "UI"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-start-menu-function",
    entityId: "computer:windows:start-menu",
    cpId: "COM-002-CP-001",
    relation: "ui_component_function",
    entity: "Windows Start menu",
    value: "provides access to apps, settings, files and search",
    contextGroupId: "windows-ui-components",
    sourceId: "MICROSOFT-WINDOWS-START-2026",
    locator: "Start menu overview",
    tags: ["Windows", "Start-menu", "UI"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-settings-display",
    entityId: "computer:windows:settings-display",
    cpId: "COM-002-CP-001",
    relation: "settings_task",
    entity: "Windows display settings",
    value: "change display-related system settings",
    contextGroupId: "windows-settings-tasks",
    sourceId: "NIELIT-CCC-REV4-2023",
    locator: "Chapter 2 system settings: display",
    tags: ["Windows", "settings", "display"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-settings-date-time",
    entityId: "computer:windows:settings-date-time",
    cpId: "COM-002-CP-001",
    relation: "settings_task",
    entity: "Windows date and time settings",
    value: "change system date and time settings",
    contextGroupId: "windows-settings-tasks",
    sourceId: "NIELIT-CCC-REV4-2023",
    locator: "Chapter 2 system settings: date and time",
    tags: ["Windows", "settings", "date-time"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-settings-mouse",
    entityId: "computer:windows:settings-mouse",
    cpId: "COM-002-CP-001",
    relation: "settings_task",
    entity: "Windows mouse settings",
    value: "change mouse-related settings",
    contextGroupId: "windows-settings-tasks",
    sourceId: "NIELIT-CCC-REV4-2023",
    locator: "Chapter 2 system settings: mouse properties",
    tags: ["Windows", "settings", "mouse"],
    freshnessClass: "SLOW_MUTABLE",
  }),
];

const fileExplorerFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-file-explorer-purpose",
    entityId: "computer:windows:file-explorer",
    cpId: "COM-002-CP-002",
    relation: "tool_purpose",
    entity: "File Explorer",
    value: "browse and manage files, folders and drives in Windows",
    contextGroupId: "file-explorer-purpose",
    sourceId: "MICROSOFT-FILE-EXPLORER-2026",
    locator: "File Explorer overview and navigation",
    tags: ["Windows", "File-Explorer", "files", "folders"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-file-explorer-show-extensions",
    entityId: "computer:windows:file-explorer-file-extensions",
    cpId: "COM-002-CP-002",
    relation: "view_property",
    entity: "File Explorer",
    value: "can display file-name extensions",
    contextGroupId: "file-explorer-view-properties",
    sourceId: "MICROSOFT-FILE-EXPLORER-2026",
    locator: "Show file name extensions",
    tags: ["File-Explorer", "extensions", "view"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-file-explorer-show-hidden",
    entityId: "computer:windows:file-explorer-hidden-items",
    cpId: "COM-002-CP-002",
    relation: "view_property",
    entity: "File Explorer",
    value: "can display hidden items when the relevant view option is enabled",
    contextGroupId: "file-explorer-view-properties",
    sourceId: "MICROSOFT-FILE-EXPLORER-2026",
    locator: "Show hidden files/items",
    tags: ["File-Explorer", "hidden-items", "view"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-folder-purpose",
    entityId: "computer:file-system:folder",
    cpId: "COM-002-CP-002",
    relation: "file_concept_definition",
    entity: "Folder (directory)",
    value: "container used to organize files and other folders",
    contextGroupId: "file-folder-path-concepts",
    sourceId: "NIELIT-CCC-PLUS-OS",
    locator: "File and directory concepts",
    tags: ["folder", "directory", "file-management"],
  }),
  textFact({
    factId: "com002-file-path-purpose",
    entityId: "computer:file-system:path",
    cpId: "COM-002-CP-002",
    relation: "file_concept_definition",
    entity: "File path",
    value: "describes the location of a file or folder in a file-system hierarchy",
    contextGroupId: "file-folder-path-concepts",
    sourceId: "NIELIT-CCC-PLUS-OS",
    locator: "File naming and path concepts",
    difficulty: "Medium",
    tags: ["file-path", "location", "file-system"],
  }),
];

const extensionFacts: KnowledgeFact[] = [
  ["tmp", ".tmp", "temporary file"],
  ["txt", ".txt", "plain text file"],
  ["pdf", ".pdf", "Portable Document Format file"],
  ["png", ".png", "PNG image file"],
  ["jpg", ".jpg", "JPEG image file"],
  ["jpeg", ".jpeg", "JPEG image file"],
  ["zip", ".zip", "compressed ZIP archive"],
  ["exe", ".exe", "executable program file"],
  ["bat", ".bat", "Windows batch file"],
].map(([id, extension, fileType]) => textFact({
  factId: `com002-extension-${id}`,
  entityId: `computer:file-extension:${id}`,
  cpId: "COM-002-CP-002",
  relation: "extension_file_type",
  entity: extension,
  value: fileType,
  contextGroupId: "general-file-extensions",
  sourceId: "MICROSOFT-WINDOWS-FILE-EXTENSIONS-2026",
  locator: `${extension} common file-name extension mapping`,
  tags: ["file-extension", extension, "file-type"],
}));

const extensionConceptFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-extension-filename-suffix",
    entityId: "computer:file-extension:concept",
    cpId: "COM-002-CP-002",
    relation: "file_concept_definition",
    entity: "File extension",
    value: "suffix after a period in a file name that indicates or associates the file type",
    contextGroupId: "file-extension-concept",
    sourceId: "MICROSOFT-WINDOWS-FILE-EXTENSIONS-2026",
    locator: "File name and extension explanation",
    tags: ["file-extension", "filename", "file-type"],
  }),
  textFact({
    factId: "com002-extension-change-does-not-convert",
    entityId: "computer:file-extension:rename",
    cpId: "COM-002-CP-002",
    relation: "extension_behavior",
    entity: "Changing a file extension",
    value: "does not by itself convert the underlying file format",
    contextGroupId: "file-extension-concept",
    sourceId: "MICROSOFT-WINDOWS-FILE-EXTENSIONS-2026",
    locator: "Changing a file name extension does not convert the file format",
    difficulty: "Medium",
    tags: ["file-extension", "format", "misconception"],
  }),
];

const fileOperationFacts: KnowledgeFact[] = [
  ["copy", "Copy", "creates a duplicate while leaving the original item in its original location"],
  ["move", "Move", "changes the item's location rather than leaving the original in place"],
  ["rename", "Rename", "changes the selected item's name"],
  ["search", "Search", "finds files or folders that match the requested search"],
  ["delete", "Delete", "removes the selected item from its current location"],
].map(([id, entity, effect]) => textFact({
  factId: `com002-file-operation-${id}`,
  entityId: `computer:file-operation:${id}`,
  cpId: "COM-002-CP-002",
  relation: "file_operation_effect",
  entity,
  value: effect,
  contextGroupId: "file-operation-effects",
  sourceId: id === "delete" ? "MICROSOFT-DELETE-FILE-RECYCLE-BIN-2026" : "NIELIT-CCC-PLUS-OS",
  locator: `${entity} file/folder operation`,
  tags: ["file-operation", id],
}));

const deleteRecoveryFacts: KnowledgeFact[] = [
  textFact({
    factId: "com002-local-delete-recycle-bin",
    entityId: "computer:windows:ordinary-local-delete",
    cpId: "COM-002-CP-002",
    relation: "delete_behavior",
    entity: "Ordinary deletion of a file from a local hard-disk location in Windows",
    value: "moves the file to the Recycle Bin",
    contextGroupId: "windows-delete-recovery",
    sourceId: "MICROSOFT-DELETE-FILE-RECYCLE-BIN-2026",
    locator: "Hard-disk deletion moves file to Recycle Bin",
    tags: ["Windows", "delete", "Recycle-Bin", "local-storage"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-nonlocal-delete-caveat",
    entityId: "computer:windows:nonlocal-delete",
    cpId: "COM-002-CP-002",
    relation: "delete_behavior_caveat",
    entity: "Deletion from some disk/CD/network locations",
    value: "may bypass the local Windows Recycle Bin",
    contextGroupId: "windows-delete-recovery",
    sourceId: "MICROSOFT-DELETE-FILE-RECYCLE-BIN-2026",
    locator: "Delete-file storage-location caveat",
    difficulty: "Medium",
    tags: ["Windows", "delete", "Recycle-Bin", "caveat"],
    freshnessClass: "SLOW_MUTABLE",
  }),
  textFact({
    factId: "com002-shift-delete-permanent",
    entityId: "computer:windows:shortcut:shift-delete",
    cpId: "COM-002-CP-002",
    relation: "delete_behavior",
    entity: "Shift+Delete",
    value: "deletes the selected item without first moving it to the Recycle Bin",
    contextGroupId: "windows-delete-recovery",
    sourceId: "MICROSOFT-WINDOWS-SHORTCUTS-2026",
    locator: "Shift+Delete Windows shortcut",
    difficulty: "Medium",
    tags: ["Windows", "shortcut", "permanent-delete"],
    freshnessClass: "SLOW_MUTABLE",
  }),
];

const shortcutFacts: KnowledgeFact[] = [
  ["win-e", "Windows key + E", "open File Explorer"],
  ["alt-f4", "Alt+F4", "close the active window"],
  ["f2", "F2", "rename the selected item"],
  ["f3", "F3", "search for a file or folder in File Explorer"],
  ["f5", "F5", "refresh the active File Explorer window"],
  ["shift-delete", "Shift+Delete", "delete the selected item without first moving it to Recycle Bin"],
  ["win-d", "Windows key + D", "show or hide the desktop"],
  ["alt-tab", "Alt+Tab", "switch between open applications"],
  ["alt-enter", "Alt+Enter", "open properties for the selected item"],
].map(([id, shortcut, action]) => textFact({
  factId: `com002-shortcut-${id}`,
  entityId: `computer:windows:shortcut:${id}`,
  cpId: "COM-002-CP-002",
  relation: "shortcut_action",
  entity: shortcut,
  value: action,
  contextGroupId: "windows-file-explorer-shortcuts",
  sourceId: "MICROSOFT-WINDOWS-SHORTCUTS-2026",
  locator: `${shortcut} Windows/File Explorer shortcut`,
  difficulty: ["f3", "f5", "alt-enter"].includes(id) ? "Medium" : "Easy",
  tags: ["Windows", "shortcut", id],
  freshnessClass: "SLOW_MUTABLE",
}));

export const COM002_CANDIDATE_FACTS: KnowledgeFact[] = [
  ...osFunctionFacts,
  ...osIdentityFacts,
  ...osAttributeFacts,
  ...osTypeFacts,
  ...kernelFacts,
  ...interfaceFacts,
  ...bootFacts,
  ...windowsUiFacts,
  ...fileExplorerFacts,
  ...extensionFacts,
  ...extensionConceptFacts,
  ...fileOperationFacts,
  ...deleteRecoveryFacts,
  ...shortcutFacts,
];

export function auditCom002CandidateCorpus() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const authorityIds = new Set(ALL_AUTHORITIES.map((entry) => entry.sourceId));
  const cpIds = new Set(["COM-002-CP-001", "COM-002-CP-002"]);

  for (const fact of COM002_CANDIDATE_FACTS) {
    if (ids.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    ids.add(fact.factId);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`PREMATURE_APPROVAL:${fact.factId}`);
    if (fact.review.reviewedAt || fact.review.reviewedBy) issues.push(`CANDIDATE_HAS_REVIEWER:${fact.factId}`);
    if (!authorityIds.has(fact.source.sourceId)) issues.push(`UNKNOWN_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    if (!cpIds.has(fact.cpId)) issues.push(`UNKNOWN_CP:${fact.factId}:${fact.cpId}`);
    if (fact.subject !== "Computer Awareness" || fact.chapterId !== "COM-002") issues.push(`OWNERSHIP_MISMATCH:${fact.factId}`);
    if (fact.freshness.class !== "IMMUTABLE" && !fact.freshness.lastVerifiedAt) {
      issues.push(`MUTABLE_FACT_MISSING_VERIFICATION:${fact.factId}`);
    }
  }

  const relationCounts = Object.fromEntries(
    [...new Set(COM002_CANDIDATE_FACTS.map((fact) => fact.relation))]
      .sort()
      .map((relation) => [relation, COM002_CANDIDATE_FACTS.filter((fact) => fact.relation === relation).length]),
  );
  const cpCounts = Object.fromEntries(
    [...cpIds].map((cpId) => [cpId, COM002_CANDIDATE_FACTS.filter((fact) => fact.cpId === cpId).length]),
  );

  const requiredRelations = [
    "has_primary_role",
    "software_classification",
    "license_class",
    "os_type_property",
    "component_role",
    "interface_property",
    "system_start_stop_meaning",
    "ui_component_function",
    "tool_purpose",
    "file_concept_definition",
    "extension_file_type",
    "file_operation_effect",
    "delete_behavior",
    "shortcut_action",
  ];
  for (const relation of requiredRelations) {
    if (!relationCounts[relation]) issues.push(`MISSING_REQUIRED_RELATION:${relation}`);
  }

  if (COM002_CANDIDATE_FACTS.length < 50) issues.push(`THIN_FACT_CORPUS:${COM002_CANDIDATE_FACTS.length}`);
  if ((cpCounts["COM-002-CP-001"] ?? 0) < 20) issues.push(`THIN_CP001_CORPUS:${cpCounts["COM-002-CP-001"] ?? 0}`);
  if ((cpCounts["COM-002-CP-002"] ?? 0) < 25) issues.push(`THIN_CP002_CORPUS:${cpCounts["COM-002-CP-002"] ?? 0}`);

  return {
    valid: issues.length === 0,
    factCount: COM002_CANDIDATE_FACTS.length,
    relationCounts,
    cpCounts,
    reviewStatus: "REVIEW_REQUIRED" as const,
    productionEligible: false,
    issues,
  };
}

export type Com002DiscoveryEvidence =
  | "OFFICIAL_SCOPE"
  | "OFFICIAL_CURRICULUM"
  | "PYQ_CONFIRMED"
  | "VENDOR_AUTHORITY"
  | "DOMAIN_HYPOTHESIS"
  | "PYQ_REQUIRED";

export type Com002DiscoveryCandidate = {
  candidateId: string;
  learnerTask: string;
  relationFamily: string;
  candidateMode:
    | "FORWARD_RECALL"
    | "REVERSE_RECALL"
    | "CLASSIFICATION"
    | "COMPARISON"
    | "PROCEDURAL_MAPPING"
    | "STATEMENT_SET"
    | "MATCHING";
  objectFamilies: string[];
  surfaceVariants: string[];
  evidence: Com002DiscoveryEvidence[];
  likelyMergeWith?: string[];
  splitIf?: string[];
  ownershipNotes?: string[];
  ambiguityRisks?: string[];
  productionState: "DISCOVERY_ONLY";
};

/**
 * Exhaustive provisional learner-task inventory for COM-002 / Operating
 * Systems, Files & Windows.
 *
 * These are discovery candidates only. No CP/QL is permanent until source/PYQ
 * saturation, merge/split, inverse-surface and ownership audits are complete.
 */
export const COM002_OPERATING_SYSTEM_DISCOVERY: Com002DiscoveryCandidate[] = [
  {
    candidateId: "OS-DISC-001",
    learnerTask: "Identify the principal role or function of an operating system",
    relationFamily: "os-function",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["operating system", "hardware resources", "applications", "files", "devices"],
    surfaceVariants: [
      "What is the primary role of an operating system?",
      "Which function is performed by an operating system?",
      "Which task is NOT normally an operating-system function?",
    ],
    evidence: ["OFFICIAL_SCOPE", "OFFICIAL_CURRICULUM"],
    likelyMergeWith: ["OS-DISC-002"],
    ownershipNotes: ["Keep word processing, spreadsheets and browser tasks in their own Computer chapters."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-002",
    learnerTask: "Identify an operating system from a defining system-management function",
    relationFamily: "os-function",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["operating system", "application software", "utility software", "device driver"],
    surfaceVariants: [
      "Which software manages hardware resources and provides services to applications?",
      "Which software category manages files, memory and devices for the computer?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "DOMAIN_HYPOTHESIS"],
    likelyMergeWith: ["OS-DISC-001"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-003",
    learnerTask: "Distinguish operating systems from non-operating-system software",
    relationFamily: "os-example-classification",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["Windows", "Linux", "Ubuntu", "Android", "iOS", "macOS", "browsers", "office applications"],
    surfaceVariants: [
      "Which of the following is an operating system?",
      "Which of the following is NOT an operating system?",
      "Select the odd one out among hardware/software/OS examples.",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_CONFIRMED"],
    ambiguityRisks: ["Version/product names must be normalized so an application is not confused with an OS family."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-004",
    learnerTask: "Classify an operating system by usage/type such as real-time, single-tasking, multitasking or multi-user",
    relationFamily: "os-type-classification",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["real-time OS", "single-tasking OS", "multitasking OS", "multi-user OS", "time-sharing OS"],
    surfaceVariants: [
      "Which OS type is designed for time-critical response?",
      "Which type allows a user to run more than one task?",
      "Classify the described operating-system behavior.",
    ],
    evidence: ["PYQ_CONFIRMED", "DOMAIN_HYPOTHESIS"],
    splitIf: ["RTOS deadline reasoning proves materially distinct from broad OS-type recognition."],
    ambiguityRisks: ["Avoid exhaustive academic taxonomy unless supported by target-exam PYQs."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-005",
    learnerTask: "Recognize real-time operating systems from guaranteed or time-constrained response requirements",
    relationFamily: "real-time-os-property",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["real-time OS", "distributed OS", "time-sharing OS", "interactive OS"],
    surfaceVariants: [
      "Which OS guarantees response within specified time constraints?",
      "Response time is critical in which OS type?",
    ],
    evidence: ["PYQ_CONFIRMED"],
    likelyMergeWith: ["OS-DISC-004"],
    splitIf: ["hard-vs-soft real-time distinctions recur in SSC/Banking/Punjab PYQs."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-006",
    learnerTask: "Classify an operating system as open-source or proprietary at awareness-exam depth",
    relationFamily: "os-license-classification",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["Ubuntu", "Linux distributions", "Windows", "macOS"],
    surfaceVariants: [
      "Which of the following is an open-source operating system?",
      "Which option is NOT open source?",
      "Ubuntu is best classified as what?",
    ],
    evidence: ["PYQ_CONFIRMED", "VENDOR_AUTHORITY"],
    ownershipNotes: ["Do not turn software-license theory into a separate chapter here."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-007",
    learnerTask: "Classify common operating systems by desktop/laptop versus mobile/tablet use",
    relationFamily: "os-platform-classification",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["Windows", "Ubuntu Desktop", "macOS", "Android", "iOS"],
    surfaceVariants: [
      "Which operating system is commonly used on smartphones/tablets?",
      "Which option is a desktop/laptop operating system?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    ambiguityRisks: ["Some OS families span multiple device classes; only encode unambiguous product/family claims."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-008",
    learnerTask: "Identify the kernel as the core component of an operating system",
    relationFamily: "kernel-core",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["kernel", "shell", "device driver", "application"],
    surfaceVariants: [
      "Which component is the core of an operating system?",
      "The central part of an OS is called what?",
    ],
    evidence: ["PYQ_CONFIRMED", "OFFICIAL_CURRICULUM"],
    likelyMergeWith: ["OS-DISC-009"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-009",
    learnerTask: "Map the kernel to awareness-level hardware/resource-management functions",
    relationFamily: "kernel-function",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["kernel", "hardware", "memory", "processes", "devices", "file system"],
    surfaceVariants: [
      "Which OS component manages core hardware resources?",
      "What is a principal function of the kernel?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "DOMAIN_HYPOTHESIS"],
    likelyMergeWith: ["OS-DISC-008"],
    ambiguityRisks: ["Keep this at awareness level; scheduling algorithms and kernel architectures are not automatically in scope."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-010",
    learnerTask: "Distinguish graphical and command-line user-interface concepts",
    relationFamily: "user-interface-type",
    candidateMode: "COMPARISON",
    objectFamilies: ["GUI", "CLI", "icons", "menus", "typed commands"],
    surfaceVariants: [
      "Which interface uses icons and menus?",
      "Which statement correctly distinguishes GUI and CLI?",
      "Identify the interface from its interaction style.",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "DOMAIN_HYPOTHESIS"],
    ambiguityRisks: ["An OS can provide both GUI and CLI; classify interface mode, not the whole OS as exclusively one or the other."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-011",
    learnerTask: "Recognize booting/startup and shutdown/restart actions at basic-computer-awareness depth",
    relationFamily: "system-start-stop",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["booting", "restart", "shutdown", "operating-system loading"],
    surfaceVariants: [
      "What is meant by booting a computer?",
      "Which action restarts the operating system without powering off for an extended period?",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    ownershipNotes: ["Do not add BIOS/UEFI internals unless target-exam evidence supports a separate learner task."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-012",
    learnerTask: "Identify major Windows desktop/user-interface components and their purposes",
    relationFamily: "windows-ui-component",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["taskbar", "Start menu", "desktop", "icons", "notification area"],
    surfaceVariants: [
      "Which Windows component provides access to running/pinned applications?",
      "Which menu is used to launch applications and access system options?",
      "Identify the desktop component from its function.",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    splitIf: ["specific component families show independent recurring PYQ volume."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-013",
    learnerTask: "Map basic Windows settings/control surfaces to the property being changed",
    relationFamily: "windows-settings",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["date/time", "display", "mouse", "printers", "installed programs/features", "Control Panel/Settings"],
    surfaceVariants: [
      "Where would a user change display settings?",
      "Which system area is used to add/remove programs or printers?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    ambiguityRisks: ["Control Panel versus Settings differs across Windows versions; prefer stable function-to-settings-area questions."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-014",
    learnerTask: "Identify File Explorer as the Windows tool for browsing and managing files/folders",
    relationFamily: "file-explorer-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["File Explorer", "files", "folders", "navigation", "search"],
    surfaceVariants: [
      "Which Windows utility is used to manage files and folders?",
      "Which tool lets a user browse drives, files and directories?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-015",
    learnerTask: "Distinguish file, folder/directory and path concepts",
    relationFamily: "file-folder-path-concept",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["file", "folder", "directory", "path", "drive"],
    surfaceVariants: [
      "Which term identifies a container used to organize files?",
      "What does a file path describe?",
      "Distinguish a file from a folder/directory.",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    ambiguityRisks: ["Folder and directory are effectively equivalent at this exam depth; do not create false distinctions."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-016",
    learnerTask: "Recognize a file extension as the suffix that identifies/associates a file type",
    relationFamily: "file-extension-concept",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["file name", "extension", "file type"],
    surfaceVariants: [
      "Which part of a filename signifies the file type?",
      "What is the suffix after the period in a Windows filename called?",
    ],
    evidence: ["PYQ_CONFIRMED", "VENDOR_AUTHORITY"],
    likelyMergeWith: ["OS-DISC-017"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-017",
    learnerTask: "Map common general-purpose file extensions to file types and vice versa",
    relationFamily: "file-type-extension-mapping",
    candidateMode: "CLASSIFICATION",
    objectFamilies: [".tmp", ".txt", ".pdf", ".png", ".jpg/.jpeg", ".zip", ".exe", ".bat"],
    surfaceVariants: [
      "Which extension is associated with a temporary file?",
      "What kind of file commonly uses the .png extension?",
      "Which extension matches the described file type?",
    ],
    evidence: ["PYQ_CONFIRMED", "VENDOR_AUTHORITY"],
    likelyMergeWith: ["OS-DISC-016"],
    ownershipNotes: [
      "Office-specific format knowledge such as DOCX/XLSX/PPTX belongs to COM-003 unless the question is purely about generic extension mechanics.",
    ],
    ambiguityRisks: ["An extension often has application associations, not a guarantee of file contents; use standard well-known mappings."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-018",
    learnerTask: "Map common file/folder operations to the intended action",
    relationFamily: "file-operation",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["create", "rename", "copy", "move", "delete", "search", "properties"],
    surfaceVariants: [
      "Which operation changes a file's name without changing its contents?",
      "Which operation places a duplicate at another location?",
      "Which action searches for a file or folder?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    splitIf: ["shortcut execution becomes a separate learner task from conceptual file operations."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-019",
    learnerTask: "Reason about ordinary deletion, Recycle Bin restoration and permanent deletion in Windows",
    relationFamily: "delete-recovery-behavior",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["Delete", "Recycle Bin", "Restore", "Shift+Delete", "permanent deletion"],
    surfaceVariants: [
      "Where does a normally deleted Windows item move?",
      "Which action restores a deleted item from the Recycle Bin?",
      "Which shortcut permanently deletes an item without moving it to Recycle Bin?",
    ],
    evidence: ["PYQ_CONFIRMED", "VENDOR_AUTHORITY"],
    splitIf: ["permanent-delete shortcut questions prove a separate shortcut learner task rather than deletion behavior."],
    ambiguityRisks: [
      "Deletion behavior can differ for network/cloud/removable locations; exam questions must state ordinary local Windows context when needed.",
    ],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-020",
    learnerTask: "Map durable Windows/File Explorer keyboard shortcuts to actions",
    relationFamily: "windows-shortcut-action",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["Win+E", "Alt+F4", "F2", "F3", "F5", "Shift+Delete", "Win+D", "Alt+Tab"],
    surfaceVariants: [
      "Which shortcut opens File Explorer?",
      "What does F2 do to a selected File Explorer item?",
      "Which shortcut closes the active window?",
    ],
    evidence: ["VENDOR_AUTHORITY", "PYQ_REQUIRED"],
    likelyMergeWith: ["OS-DISC-021"],
    ownershipNotes: ["Include only durable Windows/system shortcuts; Office application shortcuts belong to COM-003."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-021",
    learnerTask: "Identify a durable Windows/File Explorer shortcut from the requested action",
    relationFamily: "windows-shortcut-action",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["open File Explorer", "rename", "search", "refresh", "permanent delete", "switch apps", "show desktop"],
    surfaceVariants: [
      "Which shortcut opens File Explorer?",
      "Which key renames the selected item?",
      "Which shortcut switches between open apps?",
    ],
    evidence: ["VENDOR_AUTHORITY", "PYQ_REQUIRED"],
    likelyMergeWith: ["OS-DISC-020"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-022",
    learnerTask: "Recognize hidden-file/file-property viewing concepts in File Explorer",
    relationFamily: "file-visibility-properties",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["hidden items", "file name extensions", "properties", "File Explorer view"],
    surfaceVariants: [
      "Which File Explorer option reveals hidden items?",
      "Which setting displays file-name extensions?",
      "Where can a user inspect properties of a selected item?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    likelyMergeWith: ["OS-DISC-014", "OS-DISC-018"],
    ownershipNotes: ["Likely a realizer/object extension rather than a permanent QL unless PYQs justify separation."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-023",
    learnerTask: "Evaluate a multi-statement set combining operating-system, Windows and file-management facts",
    relationFamily: "os-multi-statement",
    candidateMode: "STATEMENT_SET",
    objectFamilies: ["OS function", "kernel", "OS type", "Windows UI", "files/folders", "extensions", "Recycle Bin"],
    surfaceVariants: [
      "Which of statements I, II and III are correct?",
      "Select the correct combination of OS/file-management statements.",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    splitIf: ["target-exam evidence establishes recurring multi-statement composition in Computer Knowledge."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-024",
    learnerTask: "Match OS/Windows/file-management concepts with functions, properties or shortcuts",
    relationFamily: "os-multi-pair-matching",
    candidateMode: "MATCHING",
    objectFamilies: ["kernel", "taskbar", "File Explorer", "Recycle Bin", "extensions", "shortcuts"],
    surfaceVariants: ["Match List I with List II.", "Match each Windows/OS concept to its function."],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OS-DISC-025",
    learnerTask: "Recognize selected legacy DOS/command-line file and directory commands",
    relationFamily: "legacy-command-line-basics",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["DIR", "CD", "MD/MKDIR", "RD/RMDIR", "COPY", "DEL", "REN"],
    surfaceVariants: [
      "Which command lists directory contents?",
      "Which command changes the current directory?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    ownershipNotes: [
      "Current NIELIT Revision 4 emphasizes GUI OS; legacy command-line material must not become permanent solely because older curricula taught DOS.",
    ],
    ambiguityRisks: ["Command syntax/platform differences can create trivia and version drift."],
    productionState: "DISCOVERY_ONLY",
  },
];

export function auditCom002OperatingSystemDiscovery() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const relationFamilies = new Set<string>();

  for (const candidate of COM002_OPERATING_SYSTEM_DISCOVERY) {
    if (ids.has(candidate.candidateId)) issues.push(`DUPLICATE_ID:${candidate.candidateId}`);
    ids.add(candidate.candidateId);
    relationFamilies.add(candidate.relationFamily);
    if (candidate.productionState !== "DISCOVERY_ONLY") {
      issues.push(`PREMATURE_PRODUCTION_STATE:${candidate.candidateId}`);
    }
    if (!candidate.learnerTask.trim()) issues.push(`EMPTY_LEARNER_TASK:${candidate.candidateId}`);
    if (!candidate.relationFamily.trim()) issues.push(`EMPTY_RELATION_FAMILY:${candidate.candidateId}`);
    if (candidate.objectFamilies.length === 0) issues.push(`NO_OBJECT_FAMILY:${candidate.candidateId}`);
    if (candidate.surfaceVariants.length < 2) issues.push(`THIN_SURFACE_SET:${candidate.candidateId}`);
    if (candidate.evidence.length === 0) issues.push(`NO_EVIDENCE_PLAN:${candidate.candidateId}`);
  }

  const pyqConfirmed = COM002_OPERATING_SYSTEM_DISCOVERY.filter((candidate) =>
    candidate.evidence.includes("PYQ_CONFIRMED"),
  ).map((candidate) => candidate.candidateId);

  const requiredRelationFamilies = [
    "os-function",
    "os-example-classification",
    "os-type-classification",
    "real-time-os-property",
    "os-license-classification",
    "kernel-core",
    "user-interface-type",
    "windows-ui-component",
    "file-explorer-purpose",
    "file-extension-concept",
    "file-type-extension-mapping",
    "file-operation",
    "delete-recovery-behavior",
    "windows-shortcut-action",
  ];
  for (const family of requiredRelationFamilies) {
    if (!relationFamilies.has(family)) issues.push(`MISSING_REQUIRED_RELATION_FAMILY:${family}`);
  }

  if (COM002_OPERATING_SYSTEM_DISCOVERY.length < 24) {
    issues.push(`THIN_DISCOVERY_INVENTORY:${COM002_OPERATING_SYSTEM_DISCOVERY.length}`);
  }
  if (pyqConfirmed.length < 7) issues.push(`THIN_PYQ_CONFIRMED_TASKS:${pyqConfirmed.length}`);

  return {
    valid: issues.length === 0,
    candidateCount: COM002_OPERATING_SYSTEM_DISCOVERY.length,
    relationFamilyCount: relationFamilies.size,
    pyqConfirmedCandidateIds: pyqConfirmed,
    permanentQlCount: 0,
    productionReady: false,
    issues,
  };
}

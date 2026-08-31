import { COM003_OFFICE_PRODUCTIVITY_DISCOVERY } from "./com003-office-productivity-discovery";
import { auditCom003SourceManifest } from "./com003-source-manifest";

export type Com003ProvisionalLearnerTask = {
  provisionalTaskId: string;
  title: string;
  candidateIds: string[];
  relationFamilies: string[];
  disposition: "PROVISIONAL_TASK" | "HOLD";
  rationale: string[];
  splitConditions?: string[];
};

/**
 * Merge/split ownership pass for COM-003.
 *
 * This is deliberately NOT permanent QL allocation. It compresses forty broad
 * discovery candidates into provisional solver/fact boundaries and proves that
 * every candidate has exactly one owner before corpus construction begins.
 */
export const COM003_PROVISIONAL_LEARNER_TASKS: Com003ProvisionalLearnerTask[] = [
  {
    provisionalTaskId: "COM003-PT-001",
    title: "Office Application Identity, Purpose & Classification",
    candidateIds: ["OFF-DISC-001", "OFF-DISC-002", "OFF-DISC-003"],
    relationFamilies: ["office-application-purpose", "office-software-classification"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Forward/inverse application-purpose surfaces share one Word/Excel/PowerPoint role model.",
      "SSC CHSL directly confirms Excel-from-purpose recognition; SSC CGL explicitly owns all three Office applications.",
    ],
  },
  {
    provisionalTaskId: "COM003-PT-002",
    title: "Office File Formats & Extension Recognition",
    candidateIds: ["OFF-DISC-004", "OFF-DISC-005", "OFF-DISC-038"],
    relationFamilies: ["office-file-format-mapping", "office-file-format-era", "powerpoint-file-format-specialization"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "DOCX/XLSX/PPTX and legacy-format recognition use one application-format relation graph.",
      "PowerPoint show-format knowledge is retained as an object extension rather than an independent solver for now.",
    ],
    splitConditions: ["split PowerPoint show formats if target-exam PYQs repeatedly test PPSX/open-in-slide-show behavior"],
  },
  {
    provisionalTaskId: "COM003-PT-003",
    title: "Common Office Commands & Durable Shortcuts",
    candidateIds: ["OFF-DISC-006", "OFF-DISC-007"],
    relationFamilies: ["office-common-command", "office-common-shortcut"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Command meaning and command-shortcut mapping are two realizations of the same stable edit/save/print action graph.",
      "Platform-specific behavior is gated by explicit Windows desktop context.",
    ],
  },
  {
    provisionalTaskId: "COM003-PT-004",
    title: "Word Document Editing & Formatting",
    candidateIds: ["OFF-DISC-008", "OFF-DISC-009", "OFF-DISC-010", "OFF-DISC-011", "OFF-DISC-012"],
    relationFamilies: [
      "word-document-concept",
      "word-editing-operation",
      "word-character-formatting",
      "word-formatting-shortcut",
      "word-paragraph-alignment",
    ],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "These learner tasks operate on the same document/text-selection object model.",
      "Shortcut surfaces stay subordinate to the underlying editing/formatting facts rather than becoming shortcut trivia by default.",
    ],
    splitConditions: ["split paragraph alignment if target-exam volume/difficulty proves materially independent from character formatting"],
  },
  {
    provisionalTaskId: "COM003-PT-005",
    title: "Word Find, Replace & Proofing",
    candidateIds: ["OFF-DISC-013", "OFF-DISC-014"],
    relationFamilies: ["word-find-replace", "word-proofing-feature"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Find/Replace and spelling/grammar/AutoCorrect are document-correction utilities with a shared feature-to-purpose solver.",
      "Version-specific editor branding is excluded from the canonical fact model.",
    ],
  },
  {
    provisionalTaskId: "COM003-PT-006",
    title: "Word Page Layout, Headers & Footers",
    candidateIds: ["OFF-DISC-015", "OFF-DISC-016"],
    relationFamilies: ["word-header-footer", "word-page-layout"],
    disposition: "PROVISIONAL_TASK",
    rationale: ["Both operate on page-level document layout rather than text/content semantics."],
  },
  {
    provisionalTaskId: "COM003-PT-007",
    title: "Word Mail Merge",
    candidateIds: ["OFF-DISC-017", "OFF-DISC-018"],
    relationFamilies: ["word-mail-merge-purpose", "word-mail-merge-component"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "SSC CHSL 2024 directly confirms mail-merge identification.",
      "Purpose and components are one canonical main-document/data-source/merge-field relation model.",
    ],
    splitConditions: ["split component matching only if repeated target-exam evidence proves deeper mail-merge structure demand"],
  },
  {
    provisionalTaskId: "COM003-PT-008",
    title: "Excel Workbook, Worksheet, Cell Address & Range",
    candidateIds: ["OFF-DISC-019", "OFF-DISC-020", "OFF-DISC-021"],
    relationFamilies: ["excel-structure-concept", "excel-cell-address", "excel-cell-range"],
    disposition: "PROVISIONAL_TASK",
    rationale: ["Workbook/worksheet/cell/address/range facts share one spreadsheet coordinate/object model."],
    splitConditions: ["split ranges if range notation gains independent PYQ depth beyond basic address recognition"],
  },
  {
    provisionalTaskId: "COM003-PT-009",
    title: "Excel Formula Syntax & Arithmetic Operators",
    candidateIds: ["OFF-DISC-022", "OFF-DISC-023"],
    relationFamilies: ["excel-formula-concept", "excel-formula-operator"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Formula-prefix and arithmetic-operator surfaces are one expression-syntax learner task.",
      "Microsoft first-party documentation anchors the equals-sign formula rule.",
    ],
  },
  {
    provisionalTaskId: "COM003-PT-010",
    title: "Excel Basic Functions & AutoSum",
    candidateIds: ["OFF-DISC-024", "OFF-DISC-025"],
    relationFamilies: ["excel-basic-function", "excel-autosum"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "NIELIT explicitly owns SUM, COUNT, MAX, MIN, AVERAGE and AutoSum at this awareness depth.",
      "AutoSum is treated as a convenience realization over SUM, not as an unrelated concept.",
    ],
    splitConditions: ["split function families only when target-exam evidence establishes distinct misconception/difficulty profiles"],
  },
  {
    provisionalTaskId: "COM003-PT-011",
    title: "Excel Relative & Absolute References",
    candidateIds: ["OFF-DISC-026"],
    relationFamilies: ["excel-reference-type"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Reference behavior changes how copied formulas resolve and therefore requires a distinct conceptual solver from cell-address naming.",
      "Mixed references remain outside the initial permanent candidate unless PYQs require them.",
    ],
  },
  {
    provisionalTaskId: "COM003-PT-012",
    title: "Excel Sort, Filter & AutoFill",
    candidateIds: ["OFF-DISC-027", "OFF-DISC-028"],
    relationFamilies: ["excel-sort-filter", "excel-autofill"],
    disposition: "PROVISIONAL_TASK",
    rationale: ["These are table/worksheet data-manipulation features rather than formula semantics."],
    splitConditions: ["split AutoFill if pattern-extension questions show a distinct procedural solver in PYQs"],
  },
  {
    provisionalTaskId: "COM003-PT-013",
    title: "Excel Row & Column Operations",
    candidateIds: ["OFF-DISC-029"],
    relationFamilies: ["excel-row-column-operation"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "NIELIT explicitly owns inserting/deleting rows/columns and changing dimensions.",
      "SSC CGL Tier-II directly confirms column-width operation/shortcut relevance.",
    ],
  },
  {
    provisionalTaskId: "COM003-PT-014",
    title: "Excel Basic Charts",
    candidateIds: ["OFF-DISC-030"],
    relationFamilies: ["excel-chart-type"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "NIELIT explicitly includes bar, pie and line charts.",
      "Eligibility must avoid absolute chart-choice claims where more than one visualization could be reasonable.",
    ],
  },
  {
    provisionalTaskId: "COM003-PT-015",
    title: "Excel Application-Specific Shortcuts",
    candidateIds: ["OFF-DISC-031"],
    relationFamilies: ["excel-shortcut-action"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "SSC CGL Tier-II proves application-specific shortcut demand separate from generic Ctrl+C/V/S knowledge.",
      "Version-sensitive Ribbon access sequences require explicit version/context facts and cannot generalize across all Excel versions.",
    ],
  },
  {
    provisionalTaskId: "COM003-PT-016",
    title: "PowerPoint Presentation Structure & Creation",
    candidateIds: ["OFF-DISC-032", "OFF-DISC-033"],
    relationFamilies: ["powerpoint-presentation-concept", "powerpoint-creation-structure"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Slides/presentations plus template/theme/layout concepts form the basic presentation-structure model.",
      "Theme/template/layout distinctions remain fact-gated until Microsoft authority is attached at relation level.",
    ],
  },
  {
    provisionalTaskId: "COM003-PT-017",
    title: "PowerPoint Insertable Objects & Stable Ribbon Ownership",
    candidateIds: ["OFF-DISC-034"],
    relationFamilies: ["powerpoint-insert-object"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Punjab Police SI evidence confirms Insert-tab/object-family questioning.",
      "Only stable version-scoped mappings survive; arbitrary Ribbon-group trivia does not.",
    ],
    splitConditions: ["hold or narrow if Microsoft-version review cannot establish durable tab ownership for a proposed fact"],
  },
  {
    provisionalTaskId: "COM003-PT-018",
    title: "PowerPoint Transitions & Slide Timing",
    candidateIds: ["OFF-DISC-035", "OFF-DISC-037"],
    relationFamilies: ["powerpoint-transition-animation", "powerpoint-slideshow-timing"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Transition identity and timing both operate on slide-to-slide progression.",
      "Transition-vs-animation discrimination has first-party Microsoft truth authority and cross-exam PYQ evidence.",
    ],
  },
  {
    provisionalTaskId: "COM003-PT-019",
    title: "PowerPoint Slide-Show Shortcuts",
    candidateIds: ["OFF-DISC-036"],
    relationFamilies: ["powerpoint-slideshow-shortcut"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "F5/Shift+F5 use one action-shortcut graph but require explicit Windows desktop PowerPoint context.",
    ],
  },
  {
    provisionalTaskId: "COM003-HOLD-001",
    title: "Office Multi-Statement Composition",
    candidateIds: ["OFF-DISC-039"],
    relationFamilies: ["office-multi-statement"],
    disposition: "HOLD",
    rationale: [
      "Composition is technically reusable but no sufficient target-exam evidence has yet established a permanent Office multi-statement QL.",
      "It may only consume independently approved atomic facts if later activated.",
    ],
  },
  {
    provisionalTaskId: "COM003-HOLD-002",
    title: "Office Multi-Pair Matching",
    candidateIds: ["OFF-DISC-040"],
    relationFamilies: ["office-multi-pair-matching"],
    disposition: "HOLD",
    rationale: [
      "Matching is a surface format, not automatically a distinct learner task; hold until target-exam evidence proves demand.",
      "It may only consume source-approved relation pairs if later activated.",
    ],
  },
];

export function auditCom003MergeSplitOwnership() {
  const issues: string[] = [];
  const discoveryIds = new Set(COM003_OFFICE_PRODUCTIVITY_DISCOVERY.map((entry) => entry.candidateId));
  const ownedCounts = new Map<string, number>();

  for (const task of COM003_PROVISIONAL_LEARNER_TASKS) {
    if (!task.candidateIds.length) issues.push(`EMPTY_TASK:${task.provisionalTaskId}`);
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

  const sourceAudit = auditCom003SourceManifest();
  if (!sourceAudit.valid) issues.push(...sourceAudit.issues.map((issue) => `SOURCE_MANIFEST:${issue}`));

  const provisionalTasks = COM003_PROVISIONAL_LEARNER_TASKS.filter((entry) => entry.disposition === "PROVISIONAL_TASK");
  const heldTasks = COM003_PROVISIONAL_LEARNER_TASKS.filter((entry) => entry.disposition === "HOLD");

  if (provisionalTasks.length < 18) issues.push(`THIN_PROVISIONAL_TASK_SET:${provisionalTasks.length}`);
  if (heldTasks.length < 2) issues.push(`MISSING_DISCOVERY_HOLDS:${heldTasks.length}`);

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

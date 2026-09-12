import { auditCom003AllocationReadiness } from "./com003-allocation-readiness";
import { COM003_DISTRACTOR_READINESS, type Com003DistractorStrategy } from "./com003-distractor-readiness";
import { COM003_PROVISIONAL_LEARNER_TASKS } from "./com003-office-productivity-merge-split-audit";

export type Com003PermanentQl = {
  qlId: string;
  cpId: string;
  title: string;
  learnerTask: string;
  sourceProvisionalTaskId: string;
  supportedSolveModes: readonly string[];
  distractorStrategy: Com003DistractorStrategy;
  versionScoped: boolean;
  ownershipBoundaries: readonly string[];
  status: "ALLOCATED_NOT_CONTENT_FROZEN";
};

export type Com003PermanentCp = {
  cpId: string;
  title: string;
  qlIds: readonly string[];
  status: "ALLOCATED_NOT_CONTENT_FROZEN";
};

function strategy(taskId: string) {
  const entry = COM003_DISTRACTOR_READINESS.find((item) => item.taskId === taskId);
  if (!entry) throw new Error(`Missing COM-003 distractor strategy for ${taskId}`);
  return entry;
}

function ql(input: Omit<Com003PermanentQl, "distractorStrategy" | "versionScoped" | "status">): Com003PermanentQl {
  const distractor = strategy(input.sourceProvisionalTaskId);
  return {
    ...input,
    distractorStrategy: distractor.strategy,
    versionScoped: distractor.versionScoped,
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  };
}

export const COM003_PERMANENT_QLS: readonly Com003PermanentQl[] = [
  ql({
    qlId: "COM-003-QL-001",
    cpId: "COM-003-CP-001",
    title: "Office Application Identity, Purpose & Classification",
    learnerTask: "Identify Microsoft Word, Excel and PowerPoint from their principal productivity purposes and classify them as application/productivity software.",
    sourceProvisionalTaskId: "COM003-PT-001",
    supportedSolveModes: ["APPLICATION_FROM_PURPOSE", "PURPOSE_FROM_APPLICATION", "SOFTWARE_CLASSIFICATION", "ODD_ONE_OUT"],
    ownershipBoundaries: ["Outlook/e-mail belongs to COM-004; database application concepts belong to COM-007; operating-system taxonomy belongs to COM-002."],
  }),
  ql({
    qlId: "COM-003-QL-002",
    cpId: "COM-003-CP-001",
    title: "Office File Formats & Extension Recognition",
    learnerTask: "Map modern and legacy Word, Excel and PowerPoint file extensions to their applications and distinguish PowerPoint show format at awareness depth.",
    sourceProvisionalTaskId: "COM003-PT-002",
    supportedSolveModes: ["EXTENSION_TO_APPLICATION", "APPLICATION_TO_EXTENSION", "MODERN_VS_LEGACY_FORMAT", "POWERPOINT_SHOW_FORMAT"],
    ownershipBoundaries: ["Generic file-extension mechanics remain COM-002; do not imply an Office application supports only one format."],
  }),
  ql({
    qlId: "COM-003-QL-003",
    cpId: "COM-003-CP-001",
    title: "Common Office Commands & Durable Shortcuts",
    learnerTask: "Map common editing/document commands and durable Office shortcuts to their actions in explicitly supported application/platform context.",
    sourceProvisionalTaskId: "COM003-PT-003",
    supportedSolveModes: ["COMMAND_TO_EFFECT", "EFFECT_TO_COMMAND", "SHORTCUT_TO_ACTION", "ACTION_TO_SHORTCUT"],
    ownershipBoundaries: ["Application-specific Word/Excel/PowerPoint shortcuts remain in their application QLs when semantics are not genuinely cross-Office."],
  }),
  ql({
    qlId: "COM-003-QL-004",
    cpId: "COM-003-CP-002",
    title: "Word Document Editing & Formatting",
    learnerTask: "Recognize Word document/editing concepts and map character formatting, paragraph alignment and durable formatting shortcuts to their effects.",
    sourceProvisionalTaskId: "COM003-PT-004",
    supportedSolveModes: ["DOCUMENT_CONCEPT", "EDIT_ACTION_FROM_EFFECT", "FORMAT_CONTROL_FROM_EFFECT", "ALIGNMENT_FROM_PROPERTY", "FORMATTING_SHORTCUT"],
    ownershipBoundaries: ["Page-level layout belongs to QL-006; find/replace/proofing belongs to QL-005; shortcut stems must state supported context."],
  }),
  ql({
    qlId: "COM-003-QL-005",
    cpId: "COM-003-CP-002",
    title: "Word Find, Replace & Proofing",
    learnerTask: "Distinguish Find and Replace and map spelling, grammar and AutoCorrect features to their document-correction purposes.",
    sourceProvisionalTaskId: "COM003-PT-005",
    supportedSolveModes: ["FEATURE_FROM_PURPOSE", "PURPOSE_FROM_FEATURE", "FIND_VS_REPLACE", "PROOFING_FEATURE_IDENTIFICATION"],
    ownershipBoundaries: ["Avoid version-specific Editor branding when the stable proofing function is the learner task."],
  }),
  ql({
    qlId: "COM-003-QL-006",
    cpId: "COM-003-CP-002",
    title: "Word Page Layout, Headers & Footers",
    learnerTask: "Identify headers, footers and page-number placement and distinguish portrait from landscape page orientation.",
    sourceProvisionalTaskId: "COM003-PT-006",
    supportedSolveModes: ["PAGE_ELEMENT_FROM_ROLE", "ROLE_FROM_PAGE_ELEMENT", "ORIENTATION_FROM_DIMENSIONS", "ORIENTATION_CLASSIFICATION"],
    ownershipBoundaries: ["Do not turn current Ribbon paths into canonical facts; target durable page-layout semantics."],
  }),
  ql({
    qlId: "COM-003-QL-007",
    cpId: "COM-003-CP-002",
    title: "Word Mail Merge",
    learnerTask: "Identify mail merge from its purpose and map the main document, data source, merge fields and recipient records to their roles.",
    sourceProvisionalTaskId: "COM003-PT-007",
    supportedSolveModes: ["FEATURE_FROM_PURPOSE", "PURPOSE_FROM_FEATURE", "COMPONENT_FROM_ROLE", "ROLE_FROM_COMPONENT"],
    ownershipBoundaries: ["E-mail transport/protocol knowledge belongs to COM-004; mail merge here is a Word document-generation feature."],
  }),
  ql({
    qlId: "COM-003-QL-008",
    cpId: "COM-003-CP-003",
    title: "Excel Workbook, Worksheet, Cell Address & Range",
    learnerTask: "Distinguish workbook/worksheet/row/column/cell concepts and interpret basic A1-style cell and range notation.",
    sourceProvisionalTaskId: "COM003-PT-008",
    supportedSolveModes: ["STRUCTURE_TERM_FROM_DEFINITION", "DEFINITION_FROM_TERM", "CELL_ADDRESS_INTERPRETATION", "RANGE_RECOGNITION"],
    ownershipBoundaries: ["Reference-copy behavior belongs to QL-011; formula semantics belong to QL-009."],
  }),
  ql({
    qlId: "COM-003-QL-009",
    cpId: "COM-003-CP-003",
    title: "Excel Formula Syntax & Arithmetic Operators",
    learnerTask: "Recognize the equals-sign formula convention and map basic arithmetic operators to their calculations in Excel formulas.",
    sourceProvisionalTaskId: "COM003-PT-009",
    supportedSolveModes: ["FORMULA_PREFIX", "OPERATOR_TO_OPERATION", "OPERATION_TO_OPERATOR", "FORMULA_RECOGNITION"],
    ownershipBoundaries: ["Function-purpose knowledge belongs to QL-010; avoid advanced operator precedence unless separately evidenced."],
  }),
  ql({
    qlId: "COM-003-QL-010",
    cpId: "COM-003-CP-003",
    title: "Excel Basic Functions & AutoSum",
    learnerTask: "Map SUM, AVERAGE, COUNT, MAX and MIN to their basic purposes and identify AutoSum as a quick SUM-formula mechanism.",
    sourceProvisionalTaskId: "COM003-PT-010",
    supportedSolveModes: ["FUNCTION_FROM_PURPOSE", "PURPOSE_FROM_FUNCTION", "AUTOSUM_IDENTIFICATION", "FUNCTION_DISCRIMINATION"],
    ownershipBoundaries: ["COUNT means numeric counting in the stated basic context; do not blur COUNT with COUNTA/COUNTIF families."],
  }),
  ql({
    qlId: "COM-003-QL-011",
    cpId: "COM-003-CP-003",
    title: "Excel Relative & Absolute References",
    learnerTask: "Distinguish relative and fully absolute Excel references by notation and behavior when formulas are copied or filled.",
    sourceProvisionalTaskId: "COM003-PT-011",
    supportedSolveModes: ["REFERENCE_TYPE_FROM_BEHAVIOR", "BEHAVIOR_FROM_REFERENCE_TYPE", "REFERENCE_NOTATION_CLASSIFICATION"],
    ownershipBoundaries: ["Mixed references may appear as source-grounded distractors but are not learner-facing targets in this allocation without stronger target-exam evidence."],
  }),
  ql({
    qlId: "COM-003-QL-012",
    cpId: "COM-003-CP-003",
    title: "Excel Sort, Filter & AutoFill",
    learnerTask: "Distinguish sorting, filtering and AutoFill from their effects on worksheet data and patterns.",
    sourceProvisionalTaskId: "COM003-PT-012",
    supportedSolveModes: ["FEATURE_FROM_EFFECT", "EFFECT_FROM_FEATURE", "SORT_VS_FILTER", "AUTOFILL_IDENTIFICATION"],
    ownershipBoundaries: ["Do not imply every fill-handle drag produces a number series; source-selection context governs AutoFill behavior."],
  }),
  ql({
    qlId: "COM-003-QL-013",
    cpId: "COM-003-CP-003",
    title: "Excel Row & Column Operations",
    learnerTask: "Map insertion/deletion and row-height/column-width concepts to the worksheet structure being changed.",
    sourceProvisionalTaskId: "COM003-PT-013",
    supportedSolveModes: ["OPERATION_FROM_EFFECT", "EFFECT_FROM_OPERATION", "ROW_COLUMN_PROPERTY_IDENTIFICATION"],
    ownershipBoundaries: ["Application-specific shortcut execution belongs to QL-015; this QL owns the worksheet operation itself."],
  }),
  ql({
    qlId: "COM-003-QL-014",
    cpId: "COM-003-CP-003",
    title: "Excel Basic Charts",
    learnerTask: "Map line, pie and bar charts to elementary canonical visualization purposes without asserting universal best-chart rules.",
    sourceProvisionalTaskId: "COM003-PT-014",
    supportedSolveModes: ["CHART_FROM_PURPOSE", "PURPOSE_FROM_CHART", "CHART_TYPE_DISCRIMINATION"],
    ownershipBoundaries: ["Question context must make the intended elementary chart purpose unambiguous; advanced chart design is out of scope."],
  }),
  ql({
    qlId: "COM-003-QL-015",
    cpId: "COM-003-CP-003",
    title: "Excel Application-Specific Shortcuts",
    learnerTask: "Map selected source-backed Excel shortcuts/access keys to actions in explicit Windows desktop Excel context.",
    sourceProvisionalTaskId: "COM003-PT-015",
    supportedSolveModes: ["SHORTCUT_TO_ACTION", "ACTION_TO_SHORTCUT", "CORRECT_SHORTCUT_PAIR"],
    ownershipBoundaries: ["Ribbon access-key sequences are version/platform sensitive and require explicit context plus current freshness verification."],
  }),
  ql({
    qlId: "COM-003-QL-016",
    cpId: "COM-003-CP-004",
    title: "PowerPoint Presentation Structure & Creation",
    learnerTask: "Recognize presentations/slides and distinguish layout, placeholder, theme and template roles in basic presentation creation.",
    sourceProvisionalTaskId: "COM003-PT-016",
    supportedSolveModes: ["PRESENTATION_CONCEPT", "CREATION_CONCEPT_FROM_ROLE", "ROLE_FROM_CREATION_CONCEPT", "ARTIFACT_CLASSIFICATION"],
    ownershipBoundaries: ["Theme, template, layout and placeholder are related but not interchangeable; stems must target the exact canonical role."],
  }),
  ql({
    qlId: "COM-003-QL-017",
    cpId: "COM-003-CP-004",
    title: "PowerPoint Insertable Objects & Version-Scoped Ribbon Ownership",
    learnerTask: "Recognize common insertable slide objects and, only in explicit supported-version context, map stable Insert-tab behavior.",
    sourceProvisionalTaskId: "COM003-PT-017",
    supportedSolveModes: ["INSERTABLE_OBJECT_CLASSIFICATION", "OBJECT_FROM_PURPOSE", "VERSION_SCOPED_TAB_FROM_ACTION"],
    ownershipBoundaries: ["The PowerPoint-for-web Insert-tab fact is validator-only in V1 and must not be generalized to all desktop versions."],
  }),
  ql({
    qlId: "COM-003-QL-018",
    cpId: "COM-003-CP-004",
    title: "PowerPoint Transitions, Animations & Slide Timing",
    learnerTask: "Distinguish slide transitions from object animations and distinguish transition duration from automatic slide-advance timing.",
    sourceProvisionalTaskId: "COM003-PT-018",
    supportedSolveModes: ["TRANSITION_VS_ANIMATION", "EFFECT_FROM_SCOPE", "TIMING_CONCEPT_FROM_EFFECT", "EFFECT_FROM_TIMING_CONCEPT"],
    ownershipBoundaries: ["Transition duration is effect speed/time; automatic advance is time before moving to the next slide. Do not conflate them."],
  }),
  ql({
    qlId: "COM-003-QL-019",
    cpId: "COM-003-CP-004",
    title: "PowerPoint Slide-Show Shortcuts",
    learnerTask: "Map F5 and Shift+F5 to starting a slide show from the beginning or current slide in explicit Windows desktop PowerPoint context.",
    sourceProvisionalTaskId: "COM003-PT-019",
    supportedSolveModes: ["SHORTCUT_TO_SLIDESHOW_ACTION", "SLIDESHOW_ACTION_TO_SHORTCUT", "CORRECT_SHORTCUT_PAIR"],
    ownershipBoundaries: ["Do not add low-yield shortcut targets merely to enlarge the fact pool; controlled known-shortcut distractors are the approved V1 strategy."],
  }),
] as const;

export const COM003_PERMANENT_CPS: readonly Com003PermanentCp[] = [
  {
    cpId: "COM-003-CP-001",
    title: "Office Applications, Formats & Common Commands",
    qlIds: COM003_PERMANENT_QLS.filter((item) => item.cpId === "COM-003-CP-001").map((item) => item.qlId),
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    cpId: "COM-003-CP-002",
    title: "Microsoft Word",
    qlIds: COM003_PERMANENT_QLS.filter((item) => item.cpId === "COM-003-CP-002").map((item) => item.qlId),
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    cpId: "COM-003-CP-003",
    title: "Microsoft Excel",
    qlIds: COM003_PERMANENT_QLS.filter((item) => item.cpId === "COM-003-CP-003").map((item) => item.qlId),
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
  {
    cpId: "COM-003-CP-004",
    title: "Microsoft PowerPoint",
    qlIds: COM003_PERMANENT_QLS.filter((item) => item.cpId === "COM-003-CP-004").map((item) => item.qlId),
    status: "ALLOCATED_NOT_CONTENT_FROZEN",
  },
] as const;

export const COM003_HELD_DISCOVERY_CANDIDATES = [
  {
    candidateId: "OFF-DISC-039",
    reason: "Office multi-statement composition remains held until recurring target-exam evidence justifies a dedicated learner-facing QL.",
  },
  {
    candidateId: "OFF-DISC-040",
    reason: "Office multi-pair matching remains held because matching is a surface format, not automatically a distinct learner task.",
  },
] as const;

export function auditCom003PermanentAllocation() {
  const issues: string[] = [];
  const readiness = auditCom003AllocationReadiness();
  if (readiness.status !== "READY_FOR_PERMANENT_ALLOCATION") issues.push("ALLOCATION_READINESS_NOT_GREEN");

  const qlIds = new Set<string>();
  const provisionalOwners = new Set<string>();
  const cpIds = new Set(COM003_PERMANENT_CPS.map((cp) => cp.cpId));
  for (const item of COM003_PERMANENT_QLS) {
    if (qlIds.has(item.qlId)) issues.push(`DUPLICATE_QL_ID:${item.qlId}`);
    qlIds.add(item.qlId);
    if (!cpIds.has(item.cpId)) issues.push(`UNKNOWN_CP:${item.qlId}:${item.cpId}`);
    if (provisionalOwners.has(item.sourceProvisionalTaskId)) issues.push(`DUPLICATE_PROVISIONAL_OWNER:${item.sourceProvisionalTaskId}`);
    provisionalOwners.add(item.sourceProvisionalTaskId);
    if (item.supportedSolveModes.length < 3) issues.push(`THIN_SOLVE_MODE_SET:${item.qlId}`);
    if (!item.ownershipBoundaries.length) issues.push(`NO_OWNERSHIP_BOUNDARY:${item.qlId}`);

    const expectedStrategy = strategy(item.sourceProvisionalTaskId);
    if (item.distractorStrategy !== expectedStrategy.strategy) issues.push(`DISTRACTOR_STRATEGY_DRIFT:${item.qlId}`);
    if (item.versionScoped !== expectedStrategy.versionScoped) issues.push(`VERSION_SCOPE_DRIFT:${item.qlId}`);
  }

  const expectedProvisionalTaskIds = COM003_PROVISIONAL_LEARNER_TASKS
    .filter((task) => task.disposition === "PROVISIONAL_TASK")
    .map((task) => task.provisionalTaskId)
    .sort();
  if (JSON.stringify([...provisionalOwners].sort()) !== JSON.stringify(expectedProvisionalTaskIds)) {
    issues.push("PERMANENT_QLS_DO_NOT_COVER_PROVISIONAL_TASKS_EXACTLY_ONCE");
  }

  const heldIds = COM003_PROVISIONAL_LEARNER_TASKS
    .filter((task) => task.disposition === "HOLD")
    .flatMap((task) => task.candidateIds)
    .sort();
  if (JSON.stringify(COM003_HELD_DISCOVERY_CANDIDATES.map((entry) => entry.candidateId).sort()) !== JSON.stringify(heldIds)) {
    issues.push("HELD_DISCOVERY_SET_DRIFT");
  }

  if (COM003_PERMANENT_CPS.length !== 4) issues.push(`UNEXPECTED_CP_COUNT:${COM003_PERMANENT_CPS.length}`);
  if (COM003_PERMANENT_QLS.length !== 19) issues.push(`UNEXPECTED_QL_COUNT:${COM003_PERMANENT_QLS.length}`);
  const expectedCpQlCounts: Record<string, number> = {
    "COM-003-CP-001": 3,
    "COM-003-CP-002": 4,
    "COM-003-CP-003": 8,
    "COM-003-CP-004": 4,
  };
  for (const cp of COM003_PERMANENT_CPS) {
    if (cp.qlIds.length !== expectedCpQlCounts[cp.cpId]) issues.push(`CP_QL_COUNT_DRIFT:${cp.cpId}:${cp.qlIds.length}`);
  }

  return {
    valid: issues.length === 0,
    chapterId: "COM-003" as const,
    cpCount: COM003_PERMANENT_CPS.length,
    qlCount: COM003_PERMANENT_QLS.length,
    heldCandidateCount: COM003_HELD_DISCOVERY_CANDIDATES.length,
    semanticDistractorQlCount: COM003_PERMANENT_QLS.filter((item) => item.distractorStrategy === "SEMANTIC_FACT_POOL").length,
    controlledDistractorQlCount: COM003_PERMANENT_QLS.filter((item) => item.distractorStrategy !== "SEMANTIC_FACT_POOL").length,
    versionScopedQlCount: COM003_PERMANENT_QLS.filter((item) => item.versionScoped).length,
    status: issues.length === 0 ? "PERMANENT_TAXONOMY_ALLOCATED" as const : "BLOCKED" as const,
    contentFrozen: false,
    runtimeRegistered: false,
    productionReleased: false,
    issues,
  };
}

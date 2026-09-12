import { COM003_CANDIDATE_FACTS } from "./com003-candidate-fact-corpus";
import { COM003_DISTRACTOR_READINESS } from "./com003-distractor-readiness";
import { COM003_SOURCE_AUTHORITIES } from "./com003-source-manifest";
import { COM003_SOURCE_AUTHORITY_EXTENSION } from "./com003-source-authority-extension";

export type Com003ControlledOption = {
  value: string;
  basisFactIds?: string[];
  authoritySourceIds?: string[];
  notes?: string[];
};

export type Com003ControlledPool = {
  poolId: string;
  taskIds: string[];
  options: Com003ControlledOption[];
  versionScoped: boolean;
  purpose: string;
};

const factOption = (value: string, ...basisFactIds: string[]): Com003ControlledOption => ({ value, basisFactIds });
const sourceOption = (value: string, ...authoritySourceIds: string[]): Com003ControlledOption => ({ value, authoritySourceIds });

/**
 * Controlled pools are used only by chapter-specific review synthesis for
 * relations too small for the generic exact-relation semantic distractor path.
 * Every option is grounded either in a COM-003 canonical candidate fact or a
 * named first-party authority. A pool is not permission to make that option a
 * target fact or permanent QL on its own.
 */
export const COM003_CONTROLLED_DISTRACTOR_POOLS: readonly Com003ControlledPool[] = [
  {
    poolId: "office-application-identities",
    taskIds: ["COM003-PT-001"],
    versionScoped: false,
    purpose: "Application-from-purpose and identity/classification options.",
    options: [
      factOption("Microsoft Word", "com003-word-purpose"),
      factOption("Microsoft Excel", "com003-excel-purpose"),
      factOption("Microsoft PowerPoint", "com003-powerpoint-purpose"),
      sourceOption("Windows", "NIELIT-CCC-REV3-2019"),
      sourceOption("File Explorer", "NIELIT-CCC-REV3-2019"),
    ],
  },
  {
    poolId: "office-software-categories",
    taskIds: ["COM003-PT-001"],
    versionScoped: false,
    purpose: "Office software-classification options.",
    options: [
      factOption("Application/productivity software", "com003-word-application-software"),
      sourceOption("System software", "NIELIT-CCC-REV3-2019"),
      sourceOption("Utility software", "NIELIT-CCC-REV3-2019"),
      sourceOption("Device driver", "NIELIT-CCC-REV3-2019"),
    ],
  },
  {
    poolId: "office-artifact-types",
    taskIds: ["COM003-PT-004", "COM003-PT-016"],
    versionScoped: false,
    purpose: "Document/workbook/worksheet/presentation/slide artifact contrasts.",
    options: [
      factOption("Word document", "com003-word-document-artifact"),
      factOption("Excel workbook", "com003-excel-structure-workbook"),
      factOption("Excel worksheet", "com003-excel-structure-worksheet"),
      factOption("PowerPoint presentation", "com003-powerpoint-presentation-slides"),
      factOption("PowerPoint slide", "com003-powerpoint-slide-unit"),
    ],
  },
  {
    poolId: "word-editing-actions",
    taskIds: ["COM003-PT-004"],
    versionScoped: false,
    purpose: "Word editing-action choices.",
    options: [
      factOption("Copy", "com003-word-edit-copy"),
      factOption("Cut", "com003-word-edit-cut"),
      factOption("Paste", "com003-word-edit-paste"),
      factOption("Find", "com003-word-find-purpose"),
      factOption("Replace", "com003-word-replace-purpose"),
    ],
  },
  {
    poolId: "word-formatting-controls",
    taskIds: ["COM003-PT-004"],
    versionScoped: false,
    purpose: "Character-formatting control choices.",
    options: [
      factOption("Bold", "com003-word-format-bold"),
      factOption("Italic", "com003-word-format-italic"),
      factOption("Underline", "com003-word-format-underline"),
      factOption("Font", "com003-word-format-font"),
      factOption("Font size", "com003-word-format-font-size"),
      factOption("Font color", "com003-word-format-font-color"),
    ],
  },
  {
    poolId: "word-formatting-shortcuts",
    taskIds: ["COM003-PT-004"],
    versionScoped: true,
    purpose: "Windows desktop Word formatting-shortcut choices.",
    options: [
      factOption("Ctrl+B", "com003-word-shortcut-ctrl-b"),
      factOption("Ctrl+I", "com003-word-shortcut-ctrl-i"),
      factOption("Ctrl+U", "com003-word-shortcut-ctrl-u"),
      factOption("Ctrl+S", "com003-shortcut-ctrl-s"),
      factOption("Ctrl+P", "com003-shortcut-ctrl-p"),
      factOption("Ctrl+F", "com003-shortcut-ctrl-f"),
    ],
  },
  {
    poolId: "word-alignments",
    taskIds: ["COM003-PT-004"],
    versionScoped: false,
    purpose: "Paragraph-alignment options.",
    options: [
      factOption("Left alignment", "com003-word-alignment-left"),
      factOption("Center alignment", "com003-word-alignment-center"),
      factOption("Right alignment", "com003-word-alignment-right"),
      factOption("Justify", "com003-word-alignment-justify"),
    ],
  },
  {
    poolId: "word-page-elements",
    taskIds: ["COM003-PT-006"],
    versionScoped: false,
    purpose: "Header/footer/page-number and page-layout contrast options.",
    options: [
      factOption("Header", "com003-word-header-role"),
      factOption("Footer", "com003-word-footer-role"),
      factOption("Page number", "com003-word-page-number-header-footer"),
      factOption("Portrait orientation", "com003-word-portrait-orientation"),
      factOption("Landscape orientation", "com003-word-landscape-orientation"),
    ],
  },
  {
    poolId: "word-page-orientations",
    taskIds: ["COM003-PT-006"],
    versionScoped: false,
    purpose: "Page-orientation recognition with page-layout distractors.",
    options: [
      factOption("Portrait", "com003-word-portrait-orientation"),
      factOption("Landscape", "com003-word-landscape-orientation"),
      factOption("Header", "com003-word-header-role"),
      factOption("Footer", "com003-word-footer-role"),
    ],
  },
  {
    poolId: "excel-structure-terms",
    taskIds: ["COM003-PT-008"],
    versionScoped: false,
    purpose: "Workbook/worksheet/row/column/cell terminology.",
    options: [
      factOption("Workbook", "com003-excel-structure-workbook"),
      factOption("Worksheet", "com003-excel-structure-worksheet"),
      factOption("Row", "com003-excel-structure-row"),
      factOption("Column", "com003-excel-structure-column"),
      factOption("Cell", "com003-excel-structure-cell"),
    ],
  },
  {
    poolId: "excel-reference-notation",
    taskIds: ["COM003-PT-008", "COM003-PT-011"],
    versionScoped: false,
    purpose: "Cell/range/reference notation options.",
    options: [
      factOption("A1", "com003-excel-address-composition"),
      factOption("B7", "com003-excel-address-column-part", "com003-excel-address-row-part"),
      factOption("A1:A5", "com003-excel-range-notation"),
      factOption("$A$1", "com003-excel-absolute-reference-notation"),
      sourceOption("$A1", "MICROSOFT-EXCEL-REFERENCES-2026"),
      sourceOption("A$1", "MICROSOFT-EXCEL-REFERENCES-2026"),
    ],
  },
  {
    poolId: "excel-formula-prefix-symbols",
    taskIds: ["COM003-PT-009"],
    versionScoped: false,
    purpose: "Formula-prefix symbol recognition.",
    options: [
      factOption("=", "com003-excel-formula-equals"),
      factOption("+", "com003-excel-operator-addition"),
      factOption("-", "com003-excel-operator-subtraction"),
      factOption("*", "com003-excel-operator-multiplication"),
      factOption("/", "com003-excel-operator-division"),
    ],
  },
  {
    poolId: "excel-arithmetic-operators",
    taskIds: ["COM003-PT-009"],
    versionScoped: false,
    purpose: "Excel arithmetic-operator choices.",
    options: [
      factOption("+", "com003-excel-operator-addition"),
      factOption("-", "com003-excel-operator-subtraction"),
      factOption("*", "com003-excel-operator-multiplication"),
      factOption("/", "com003-excel-operator-division"),
    ],
  },
  {
    poolId: "excel-basic-functions",
    taskIds: ["COM003-PT-010"],
    versionScoped: false,
    purpose: "Core awareness-level Excel function names.",
    options: [
      factOption("SUM", "com003-excel-function-sum"),
      factOption("AVERAGE", "com003-excel-function-average"),
      factOption("COUNT", "com003-excel-function-count"),
      factOption("MAX", "com003-excel-function-max"),
      factOption("MIN", "com003-excel-function-min"),
    ],
  },
  {
    poolId: "excel-autosum-actions",
    taskIds: ["COM003-PT-010"],
    versionScoped: false,
    purpose: "AutoSum function/action choices grounded in Microsoft's AutoSum menu.",
    options: [
      factOption("SUM", "com003-excel-function-sum", "com003-excel-autosum-sum"),
      factOption("AVERAGE", "com003-excel-function-average"),
      factOption("COUNT", "com003-excel-function-count"),
      factOption("MAX", "com003-excel-function-max"),
      factOption("MIN", "com003-excel-function-min"),
    ],
  },
  {
    poolId: "excel-reference-types",
    taskIds: ["COM003-PT-011"],
    versionScoped: false,
    purpose: "Relative/absolute reference-type recognition.",
    options: [
      factOption("Relative cell reference", "com003-excel-relative-reference"),
      factOption("Absolute cell reference", "com003-excel-absolute-reference"),
      sourceOption("Mixed cell reference", "MICROSOFT-EXCEL-REFERENCES-2026"),
      sourceOption("Cell range", "MICROSOFT-EXCEL-FORMULAS-2026"),
    ],
  },
  {
    poolId: "excel-basic-chart-types",
    taskIds: ["COM003-PT-014"],
    versionScoped: false,
    purpose: "Basic chart-type choices without promoting extra chart types as targets.",
    options: [
      factOption("Line chart", "com003-excel-line-chart"),
      factOption("Pie chart", "com003-excel-pie-chart"),
      factOption("Bar chart", "com003-excel-bar-chart"),
      sourceOption("Column chart", "MICROSOFT-OFFICE-CHART-TYPES-2026"),
    ],
  },
  {
    poolId: "powerpoint-creation-concepts",
    taskIds: ["COM003-PT-016"],
    versionScoped: false,
    purpose: "Presentation creation/layout concept choices.",
    options: [
      factOption("Slide layout", "com003-powerpoint-layout-role"),
      factOption("Placeholder", "com003-powerpoint-placeholder-role"),
      factOption("Theme", "com003-powerpoint-theme-role"),
      factOption("Presentation template", "com003-powerpoint-template-role"),
    ],
  },
  {
    poolId: "powerpoint-insertable-objects",
    taskIds: ["COM003-PT-017"],
    versionScoped: false,
    purpose: "Slide-object insertion choices.",
    options: [
      factOption("Picture", "com003-powerpoint-insert-picture"),
      factOption("Table", "com003-powerpoint-insert-table"),
      factOption("Chart", "com003-powerpoint-insert-chart"),
      sourceOption("Shape", "NIELIT-CCC-PLUS-OFFICE", "MICROSOFT-POWERPOINT-BASIC-TASKS-WEB-2026"),
    ],
  },
  {
    poolId: "powerpoint-version-scoped-tabs",
    taskIds: ["COM003-PT-017"],
    versionScoped: true,
    purpose: "Explicit version/platform Ribbon-tab recognition only.",
    options: [
      factOption("Insert", "com003-powerpoint-web-insert-picture-tab"),
      sourceOption("Home", "MICROSOFT-POWERPOINT-BASIC-TASKS-WEB-2026"),
      sourceOption("Design", "MICROSOFT-POWERPOINT-BASIC-TASKS-WEB-2026"),
      sourceOption("Transitions", "MICROSOFT-POWERPOINT-BASIC-TASKS-WEB-2026"),
    ],
  },
  {
    poolId: "powerpoint-motion-effects",
    taskIds: ["COM003-PT-018"],
    versionScoped: false,
    purpose: "Transition-versus-animation choices with nearby PowerPoint concepts as distractors.",
    options: [
      factOption("Transition", "com003-powerpoint-transition-definition"),
      factOption("Animation", "com003-powerpoint-animation-definition"),
      factOption("Slide layout", "com003-powerpoint-layout-role"),
      factOption("Theme", "com003-powerpoint-theme-role"),
    ],
  },
  {
    poolId: "powerpoint-timing-concepts",
    taskIds: ["COM003-PT-018"],
    versionScoped: false,
    purpose: "Transition-duration and automatic-advance concept choices.",
    options: [
      factOption("Transition duration", "com003-powerpoint-transition-duration"),
      factOption("Automatic slide advance timing", "com003-powerpoint-auto-advance-time"),
      factOption("Animation", "com003-powerpoint-animation-definition"),
      factOption("Slide layout", "com003-powerpoint-layout-role"),
    ],
  },
  {
    poolId: "powerpoint-slideshow-shortcuts",
    taskIds: ["COM003-PT-019"],
    versionScoped: true,
    purpose: "Windows desktop PowerPoint slide-show shortcut choices.",
    options: [
      factOption("F5", "com003-powerpoint-shortcut-f5"),
      factOption("Shift+F5", "com003-powerpoint-shortcut-shift-f5"),
      factOption("Ctrl+S", "com003-shortcut-ctrl-s"),
      factOption("Ctrl+P", "com003-shortcut-ctrl-p"),
      factOption("Ctrl+F", "com003-shortcut-ctrl-f"),
    ],
  },
] as const;

export function auditCom003ControlledDistractorPools() {
  const issues: string[] = [];
  const factIds = new Set(COM003_CANDIDATE_FACTS.map((fact) => fact.factId));
  const authorityIds = new Set(
    [...COM003_SOURCE_AUTHORITIES, ...COM003_SOURCE_AUTHORITY_EXTENSION].map((source) => source.sourceId),
  );
  const requiredPoolIds = new Set(
    COM003_DISTRACTOR_READINESS.flatMap((entry) => entry.controlledPoolIds ?? []),
  );
  const seenPoolIds = new Set<string>();

  for (const pool of COM003_CONTROLLED_DISTRACTOR_POOLS) {
    if (seenPoolIds.has(pool.poolId)) issues.push(`DUPLICATE_POOL_ID:${pool.poolId}`);
    seenPoolIds.add(pool.poolId);
    if (pool.options.length < 4) issues.push(`THIN_CONTROLLED_POOL:${pool.poolId}:${pool.options.length}`);
    const normalizedOptions = pool.options.map((option) => option.value.trim().toLowerCase());
    if (new Set(normalizedOptions).size !== normalizedOptions.length) issues.push(`DUPLICATE_OPTION_VALUE:${pool.poolId}`);

    for (const option of pool.options) {
      if (!option.value.trim()) issues.push(`EMPTY_OPTION:${pool.poolId}`);
      if (!option.basisFactIds?.length && !option.authoritySourceIds?.length) {
        issues.push(`UNGROUNDED_OPTION:${pool.poolId}:${option.value}`);
      }
      for (const factId of option.basisFactIds ?? []) {
        if (!factIds.has(factId)) issues.push(`UNKNOWN_BASIS_FACT:${pool.poolId}:${factId}`);
      }
      for (const sourceId of option.authoritySourceIds ?? []) {
        if (!authorityIds.has(sourceId)) issues.push(`UNKNOWN_AUTHORITY_SOURCE:${pool.poolId}:${sourceId}`);
        if (sourceId.startsWith("PYQ-")) issues.push(`PYQ_GROUNDS_CONTROLLED_OPTION:${pool.poolId}:${sourceId}`);
      }
      if (/all of the above|none of the above/i.test(option.value)) {
        issues.push(`BANNED_META_OPTION:${pool.poolId}:${option.value}`);
      }
    }

    const taskVersionFlags = pool.taskIds.map((taskId) =>
      COM003_DISTRACTOR_READINESS.find((entry) => entry.taskId === taskId)?.versionScoped ?? false,
    );
    if (pool.versionScoped && !taskVersionFlags.some(Boolean)) {
      issues.push(`VERSION_POOL_WITHOUT_VERSION_TASK:${pool.poolId}`);
    }
  }

  for (const poolId of requiredPoolIds) {
    if (!seenPoolIds.has(poolId)) issues.push(`MISSING_REQUIRED_CONTROLLED_POOL:${poolId}`);
  }
  for (const poolId of seenPoolIds) {
    if (!requiredPoolIds.has(poolId)) issues.push(`UNREFERENCED_CONTROLLED_POOL:${poolId}`);
  }

  const optionCount = COM003_CONTROLLED_DISTRACTOR_POOLS.reduce((sum, pool) => sum + pool.options.length, 0);
  const sourceGroundedOptionCount = COM003_CONTROLLED_DISTRACTOR_POOLS.reduce(
    (sum, pool) => sum + pool.options.filter((option) => option.authoritySourceIds?.length).length,
    0,
  );

  return {
    valid: issues.length === 0,
    poolCount: COM003_CONTROLLED_DISTRACTOR_POOLS.length,
    optionCount,
    sourceGroundedOptionCount,
    allRequiredPoolsImplemented: [...requiredPoolIds].every((poolId) => seenPoolIds.has(poolId)),
    sharedEngineChangeRequired: false,
    controlledPoolImplementationComplete: issues.length === 0,
    permanentQlCount: 0,
    allocationReady: false,
    productionEligible: false,
    issues,
  };
}

import type {
  KnowledgeFact,
  KnowledgeFactSource,
  KnowledgeFreshnessClass,
  KnowledgeV1Difficulty,
} from "../types";
import { COM003_SOURCE_AUTHORITIES } from "./com003-source-manifest";
import { COM003_SOURCE_AUTHORITY_EXTENSION } from "./com003-source-authority-extension";

export type Com003CandidateCpId =
  | "COM-003-CP-001"
  | "COM-003-CP-002"
  | "COM-003-CP-003"
  | "COM-003-CP-004";

const ALL_AUTHORITIES = [
  ...COM003_SOURCE_AUTHORITIES,
  ...COM003_SOURCE_AUTHORITY_EXTENSION,
];

function source(sourceId: string, locator: string): KnowledgeFactSource {
  const authority = ALL_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!authority) throw new Error(`Unknown COM-003 source authority ${sourceId}`);
  const sourceType: KnowledgeFactSource["sourceType"] =
    authority.authorityClass === "OFFICIAL_EXAM"
      ? "official"
      : authority.authorityClass === "OFFICIAL_CURRICULUM"
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
  cpId: Com003CandidateCpId;
  taskId: string;
  relation: string;
  entity: string;
  value: string;
  contextGroupId: string;
  sourceId: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
  tags?: string[];
  freshnessClass?: KnowledgeFreshnessClass;
  versionScoped?: boolean;
}): KnowledgeFact {
  const freshnessClass = input.freshnessClass ?? (input.versionScoped ? "SLOW_MUTABLE" : "IMMUTABLE");
  return {
    factId: input.factId,
    entityId: input.entityId,
    subject: "Computer Awareness",
    chapterId: "COM-003",
    cpId: input.cpId,
    relation: input.relation,
    entity: { canonicalName: input.entity, label: { en: input.entity } },
    value: { kind: "text", text: { en: input.value } },
    contextGroupId: input.contextGroupId,
    distractorGroupIds: [input.contextGroupId],
    difficulty: input.difficulty ?? "Easy",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: [
      `provisional-task:${input.taskId}`,
      ...(input.versionScoped ? ["version-scoped"] : []),
      ...(input.tags ?? []),
    ],
    source: source(input.sourceId, input.locator),
    review: { status: "REVIEW_REQUIRED", confidence: input.versionScoped ? 0.78 : 0.86 },
    freshness: freshnessClass === "IMMUTABLE"
      ? { class: "IMMUTABLE" }
      : { class: freshnessClass, lastVerifiedAt: "2026-08-31" },
  };
}

const officeIdentityFacts: KnowledgeFact[] = [
  ["word-purpose", "Microsoft Word", "word processing: creating, editing and formatting documents"],
  ["excel-purpose", "Microsoft Excel", "spreadsheet work such as organizing data and performing calculations"],
  ["powerpoint-purpose", "Microsoft PowerPoint", "creating slide-based presentations"],
].map(([id, entity, value]) => textFact({
  factId: `com003-${id}`,
  entityId: `computer:office:${id.replace("-purpose", "")}`,
  cpId: "COM-003-CP-001",
  taskId: "COM003-PT-001",
  relation: "application_primary_purpose",
  entity,
  value,
  contextGroupId: "office-application-purpose",
  sourceId: "NIELIT-CCC-REV3-2019",
  locator: `${entity} module scope and application purpose`,
  tags: ["office", "application", "purpose"],
}));

officeIdentityFacts.push(
  ...[
    ["word", "Microsoft Word"],
    ["excel", "Microsoft Excel"],
    ["powerpoint", "Microsoft PowerPoint"],
  ].map(([id, entity]) => textFact({
    factId: `com003-${id}-application-software`,
    entityId: `computer:office:${id}`,
    cpId: "COM-003-CP-001",
    taskId: "COM003-PT-001",
    relation: "software_classification",
    entity,
    value: "application/productivity software",
    contextGroupId: "office-software-classification",
    sourceId: "NIELIT-CCC-REV3-2019",
    locator: `${entity} productivity application module`,
    tags: ["office", "application-software", id],
  })),
);

const officeFormatFacts: KnowledgeFact[] = [
  ["docx", ".docx", "modern Word document", "MICROSOFT-WORD-FILE-FORMATS-2026"],
  ["doc", ".doc", "Word 97-2003 document", "MICROSOFT-WORD-FILE-FORMATS-2026"],
  ["xlsx", ".xlsx", "modern Excel workbook", "MICROSOFT-EXCEL-FILE-FORMATS-2026"],
  ["xls", ".xls", "Excel 97-2003 workbook", "MICROSOFT-EXCEL-FILE-FORMATS-2026"],
  ["pptx", ".pptx", "modern PowerPoint presentation", "MICROSOFT-POWERPOINT-FILE-FORMATS-2026"],
  ["ppt", ".ppt", "PowerPoint 97-2003 presentation", "MICROSOFT-POWERPOINT-FILE-FORMATS-2026"],
  ["ppsx", ".ppsx", "PowerPoint show file that opens as a slide show", "MICROSOFT-POWERPOINT-FILE-FORMATS-2026"],
].map(([id, entity, value, sourceId]) => textFact({
  factId: `com003-format-${id}`,
  entityId: `computer:office-format:${id}`,
  cpId: "COM-003-CP-001",
  taskId: "COM003-PT-002",
  relation: "office_extension_type",
  entity,
  value,
  contextGroupId: "office-file-formats",
  sourceId,
  locator: `${entity} file-format mapping`,
  tags: ["office", "file-format", id],
}));

const commonCommandFacts: KnowledgeFact[] = [
  ["copy", "Copy", "duplicates selected content while leaving the original content in place"],
  ["cut", "Cut", "removes selected content to the clipboard so it can be moved elsewhere"],
  ["paste", "Paste", "inserts clipboard content at the current location"],
  ["undo", "Undo", "reverses the most recent supported editing action"],
  ["redo", "Redo", "reapplies an action that was undone when redo is available"],
  ["save", "Save", "stores current changes in the file"],
  ["print", "Print", "opens or performs the document printing workflow"],
  ["find", "Find", "searches for specified content in the current file"],
].map(([id, entity, value]) => textFact({
  factId: `com003-command-${id}`,
  entityId: `computer:office-command:${id}`,
  cpId: "COM-003-CP-001",
  taskId: "COM003-PT-003",
  relation: "common_command_effect",
  entity,
  value,
  contextGroupId: "office-common-command-effects",
  sourceId: id === "find" ? "MICROSOFT-WORD-FIND-REPLACE-2026" : "MICROSOFT-WORD-SHORTCUTS-2026",
  locator: `${entity} editing/document command`,
  tags: ["office", "command", id],
}));

const commonShortcutFacts: KnowledgeFact[] = [
  ["ctrl-c", "Ctrl+C", "copy selected content"],
  ["ctrl-x", "Ctrl+X", "cut selected content"],
  ["ctrl-v", "Ctrl+V", "paste clipboard content"],
  ["ctrl-z", "Ctrl+Z", "undo the previous action"],
  ["ctrl-y", "Ctrl+Y", "redo or repeat the previous action when supported"],
  ["ctrl-s", "Ctrl+S", "save the current document"],
  ["ctrl-p", "Ctrl+P", "open the print workflow"],
  ["ctrl-f", "Ctrl+F", "find text or content in the current document"],
].map(([id, entity, value]) => textFact({
  factId: `com003-shortcut-${id}`,
  entityId: `computer:office-shortcut:${id}`,
  cpId: "COM-003-CP-001",
  taskId: "COM003-PT-003",
  relation: "common_shortcut_action",
  entity,
  value,
  contextGroupId: "office-common-shortcuts",
  sourceId: id === "ctrl-f" ? "MICROSOFT-WORD-FIND-REPLACE-2026" : "MICROSOFT-WORD-SHORTCUTS-2026",
  locator: `${entity} Word/Office editing shortcut`,
  tags: ["office", "shortcut", "windows-desktop", id],
  versionScoped: true,
}));

const wordEditingFormattingFacts: KnowledgeFact[] = [
  textFact({
    factId: "com003-word-document-artifact",
    entityId: "computer:word:document",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-004",
    relation: "word_document_concept",
    entity: "Word document",
    value: "a word-processing document rather than a worksheet or slide presentation",
    contextGroupId: "word-document-concepts",
    sourceId: "NIELIT-CCC-REV3-2019",
    locator: "Word Processing module",
    tags: ["Word", "document", "word-processing"],
  }),
  textFact({
    factId: "com003-word-word-processor",
    entityId: "computer:word:application",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-004",
    relation: "word_document_concept",
    entity: "Microsoft Word",
    value: "word-processing application",
    contextGroupId: "word-document-concepts",
    sourceId: "NIELIT-CCC-REV3-2019",
    locator: "Word Processing module",
    tags: ["Word", "word-processor"],
  }),
  ...[
    ["copy", "Copy", "duplicates selected text without removing the original"],
    ["cut", "Cut", "removes selected text to the clipboard for moving or pasting elsewhere"],
    ["paste", "Paste", "inserts clipboard content at the insertion point"],
  ].map(([id, entity, value]) => textFact({
    factId: `com003-word-edit-${id}`,
    entityId: `computer:word:edit:${id}`,
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-004",
    relation: "word_editing_operation",
    entity,
    value,
    contextGroupId: "word-editing-operations",
    sourceId: "MICROSOFT-WORD-BASIC-TASKS-2026",
    locator: `${entity} editing operation`,
    tags: ["Word", "editing", id],
  })),
  ...[
    ["bold", "Bold", "makes selected text bold"],
    ["italic", "Italic", "makes selected text italic"],
    ["underline", "Underline", "adds an underline to selected text"],
    ["font-size", "Font size", "changes the displayed size of selected text"],
    ["font-color", "Font color", "changes the color of selected text"],
    ["font", "Font", "changes the typeface used for selected text"],
  ].map(([id, entity, value]) => textFact({
    factId: `com003-word-format-${id}`,
    entityId: `computer:word:format:${id}`,
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-004",
    relation: "word_character_formatting",
    entity,
    value,
    contextGroupId: "word-character-formatting",
    sourceId: "NIELIT-CCC-REV3-2019",
    locator: `${entity} text-formatting function`,
    tags: ["Word", "formatting", id],
  })),
  ...[
    ["ctrl-b", "Ctrl+B", "apply or remove bold formatting"],
    ["ctrl-i", "Ctrl+I", "apply or remove italic formatting"],
    ["ctrl-u", "Ctrl+U", "apply or remove underline formatting"],
  ].map(([id, entity, value]) => textFact({
    factId: `com003-word-shortcut-${id}`,
    entityId: `computer:word:shortcut:${id}`,
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-004",
    relation: "word_formatting_shortcut",
    entity,
    value,
    contextGroupId: "word-formatting-shortcuts",
    sourceId: "MICROSOFT-WORD-SHORTCUTS-2026",
    locator: `${entity} Word formatting shortcut`,
    tags: ["Word", "shortcut", "formatting", id],
    versionScoped: true,
  })),
  ...[
    ["left", "Left alignment", "aligns paragraph text with the left margin"],
    ["center", "Center alignment", "centers paragraph text between the side margins"],
    ["right", "Right alignment", "aligns paragraph text with the right margin"],
    ["justify", "Justify", "aligns paragraph text evenly with both left and right margins"],
  ].map(([id, entity, value]) => textFact({
    factId: `com003-word-alignment-${id}`,
    entityId: `computer:word:alignment:${id}`,
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-004",
    relation: "word_paragraph_alignment",
    entity,
    value,
    contextGroupId: "word-paragraph-alignment",
    sourceId: "MICROSOFT-WORD-ALIGNMENT-2026",
    locator: `${entity} paragraph alignment`,
    tags: ["Word", "paragraph", "alignment", id],
  })),
];

const wordProofingFacts: KnowledgeFact[] = [
  textFact({
    factId: "com003-word-find-purpose",
    entityId: "computer:word:find",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-005",
    relation: "word_correction_feature",
    entity: "Find",
    value: "locates specified text without requiring it to be changed",
    contextGroupId: "word-find-replace-proofing",
    sourceId: "MICROSOFT-WORD-FIND-REPLACE-2026",
    locator: "Find text behavior",
    tags: ["Word", "find"],
  }),
  textFact({
    factId: "com003-word-replace-purpose",
    entityId: "computer:word:replace",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-005",
    relation: "word_correction_feature",
    entity: "Replace",
    value: "locates specified text and substitutes replacement text",
    contextGroupId: "word-find-replace-proofing",
    sourceId: "MICROSOFT-WORD-FIND-REPLACE-2026",
    locator: "Find and replace behavior",
    tags: ["Word", "replace"],
  }),
  textFact({
    factId: "com003-word-spelling-check",
    entityId: "computer:word:proofing:spelling",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-005",
    relation: "word_correction_feature",
    entity: "Spelling check",
    value: "identifies potential spelling errors for review",
    contextGroupId: "word-find-replace-proofing",
    sourceId: "MICROSOFT-WORD-PROOFING-2026",
    locator: "Office spelling checker",
    tags: ["Word", "proofing", "spelling"],
  }),
  textFact({
    factId: "com003-word-grammar-check",
    entityId: "computer:word:proofing:grammar",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-005",
    relation: "word_correction_feature",
    entity: "Grammar check",
    value: "identifies potential grammatical issues for review",
    contextGroupId: "word-find-replace-proofing",
    sourceId: "MICROSOFT-WORD-PROOFING-2026",
    locator: "Office grammar checker",
    tags: ["Word", "proofing", "grammar"],
  }),
  textFact({
    factId: "com003-word-autocorrect-purpose",
    entityId: "computer:word:proofing:autocorrect",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-005",
    relation: "word_correction_feature",
    entity: "AutoCorrect",
    value: "automatically corrects configured/common typing and capitalization patterns",
    contextGroupId: "word-find-replace-proofing",
    sourceId: "NIELIT-CCC-REV3-2019",
    locator: "Word Processing proofing and AutoCorrect topic",
    tags: ["Word", "proofing", "autocorrect"],
  }),
];

const wordPageFacts: KnowledgeFact[] = [
  textFact({
    factId: "com003-word-header-role",
    entityId: "computer:word:header",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-006",
    relation: "word_page_element_role",
    entity: "Header",
    value: "page-margin content associated with the top area of a document page",
    contextGroupId: "word-page-elements-layout",
    sourceId: "MICROSOFT-WORD-HEADERS-FOOTERS-2026",
    locator: "Header editing area",
    tags: ["Word", "header", "page-layout"],
  }),
  textFact({
    factId: "com003-word-footer-role",
    entityId: "computer:word:footer",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-006",
    relation: "word_page_element_role",
    entity: "Footer",
    value: "page-margin content associated with the bottom area of a document page",
    contextGroupId: "word-page-elements-layout",
    sourceId: "MICROSOFT-WORD-HEADERS-FOOTERS-2026",
    locator: "Footer editing area",
    tags: ["Word", "footer", "page-layout"],
  }),
  textFact({
    factId: "com003-word-page-number-header-footer",
    entityId: "computer:word:page-number",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-006",
    relation: "word_page_element_role",
    entity: "Page number",
    value: "can be inserted as part of a header or footer",
    contextGroupId: "word-page-elements-layout",
    sourceId: "MICROSOFT-WORD-HEADERS-FOOTERS-2026",
    locator: "Add page number in header or footer",
    tags: ["Word", "page-number", "header", "footer"],
  }),
  textFact({
    factId: "com003-word-portrait-orientation",
    entityId: "computer:word:orientation:portrait",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-006",
    relation: "word_page_orientation",
    entity: "Portrait orientation",
    value: "page orientation in which the page is taller than it is wide",
    contextGroupId: "word-page-elements-layout",
    sourceId: "MICROSOFT-WORD-ORIENTATION-2026",
    locator: "Portrait page orientation",
    tags: ["Word", "orientation", "portrait"],
  }),
  textFact({
    factId: "com003-word-landscape-orientation",
    entityId: "computer:word:orientation:landscape",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-006",
    relation: "word_page_orientation",
    entity: "Landscape orientation",
    value: "page orientation in which the page is wider than it is tall",
    contextGroupId: "word-page-elements-layout",
    sourceId: "MICROSOFT-WORD-ORIENTATION-2026",
    locator: "Landscape page orientation",
    tags: ["Word", "orientation", "landscape"],
  }),
];

const wordMailMergeFacts: KnowledgeFact[] = [
  textFact({
    factId: "com003-word-mail-merge-purpose",
    entityId: "computer:word:mail-merge",
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-007",
    relation: "mail_merge_relation",
    entity: "Mail merge",
    value: "combines a main document with recipient/data-source information to create personalized output",
    contextGroupId: "word-mail-merge",
    sourceId: "MICROSOFT-WORD-MAIL-MERGE-2026",
    locator: "Mail merge purpose for letters, labels and envelopes",
    tags: ["Word", "mail-merge", "purpose"],
  }),
  ...[
    ["main-document", "Main document", "contains the common text and layout shared by merged outputs"],
    ["data-source", "Data source", "supplies recipient-specific records or values used during the merge"],
    ["merge-field", "Merge field", "marks where data-source values are inserted into the main document"],
    ["recipient-record", "Recipient record", "contains the field values for one recipient or merged item"],
  ].map(([id, entity, value]) => textFact({
    factId: `com003-word-mail-merge-${id}`,
    entityId: `computer:word:mail-merge:${id}`,
    cpId: "COM-003-CP-002",
    taskId: "COM003-PT-007",
    relation: "mail_merge_relation",
    entity,
    value,
    contextGroupId: "word-mail-merge",
    sourceId: "MICROSOFT-WORD-MAIL-MERGE-2026",
    locator: `${entity} role in mail merge`,
    tags: ["Word", "mail-merge", id],
  })),
];

const excelStructureFacts: KnowledgeFact[] = [
  ["workbook", "Workbook", "an Excel file that can contain one or more worksheets"],
  ["worksheet", "Worksheet", "a spreadsheet sheet made of rows and columns within a workbook"],
  ["row", "Row", "a horizontal line of cells in a worksheet"],
  ["column", "Column", "a vertical line of cells in a worksheet"],
  ["cell", "Cell", "the intersection of a row and a column"],
].map(([id, entity, value]) => textFact({
  factId: `com003-excel-structure-${id}`,
  entityId: `computer:excel:structure:${id}`,
  cpId: "COM-003-CP-003",
  taskId: "COM003-PT-008",
  relation: "excel_structure_concept",
  entity,
  value,
  contextGroupId: "excel-structure-address-range",
  sourceId: "NIELIT-CCC-REV3-2019",
  locator: `${entity} spreadsheet concept`,
  tags: ["Excel", "structure", id],
}));

excelStructureFacts.push(
  textFact({
    factId: "com003-excel-address-composition",
    entityId: "computer:excel:cell-address",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-008",
    relation: "excel_cell_address",
    entity: "Excel cell address",
    value: "combines a column label with a row number, for example B7",
    contextGroupId: "excel-structure-address-range",
    sourceId: "MICROSOFT-EXCEL-FORMULAS-2026",
    locator: "Cell references in formulas",
    tags: ["Excel", "cell-address"],
  }),
  textFact({
    factId: "com003-excel-address-column-part",
    entityId: "computer:excel:address-part:column",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-008",
    relation: "excel_cell_address",
    entity: "The B in cell reference B7",
    value: "column label",
    contextGroupId: "excel-structure-address-range",
    sourceId: "MICROSOFT-EXCEL-FORMULAS-2026",
    locator: "A1-style cell reference convention",
    tags: ["Excel", "cell-address", "column"],
  }),
  textFact({
    factId: "com003-excel-address-row-part",
    entityId: "computer:excel:address-part:row",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-008",
    relation: "excel_cell_address",
    entity: "The 7 in cell reference B7",
    value: "row number",
    contextGroupId: "excel-structure-address-range",
    sourceId: "MICROSOFT-EXCEL-FORMULAS-2026",
    locator: "A1-style cell reference convention",
    tags: ["Excel", "cell-address", "row"],
  }),
  textFact({
    factId: "com003-excel-range-notation",
    entityId: "computer:excel:cell-range",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-008",
    relation: "excel_cell_range",
    entity: "A1:A5",
    value: "continuous cell range from A1 through A5",
    contextGroupId: "excel-structure-address-range",
    sourceId: "MICROSOFT-EXCEL-FORMULAS-2026",
    locator: "Range references in formulas",
    tags: ["Excel", "range", "cell-reference"],
  }),
);

const excelFormulaFacts: KnowledgeFact[] = [
  textFact({
    factId: "com003-excel-formula-equals",
    entityId: "computer:excel:formula:prefix",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-009",
    relation: "excel_formula_syntax",
    entity: "Excel formula",
    value: "normally begins with an equal sign (=)",
    contextGroupId: "excel-formula-syntax",
    sourceId: "MICROSOFT-EXCEL-FORMULAS-2026",
    locator: "Formula syntax begins with equal sign",
    tags: ["Excel", "formula", "equals-sign"],
  }),
  ...[
    ["addition", "+", "addition"],
    ["subtraction", "-", "subtraction"],
    ["multiplication", "*", "multiplication"],
    ["division", "/", "division"],
  ].map(([id, entity, value]) => textFact({
    factId: `com003-excel-operator-${id}`,
    entityId: `computer:excel:operator:${id}`,
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-009",
    relation: "excel_formula_operator",
    entity,
    value,
    contextGroupId: "excel-formula-operators",
    sourceId: "MICROSOFT-EXCEL-FORMULAS-2026",
    locator: `${entity} arithmetic operator in formulas`,
    tags: ["Excel", "formula", "operator", id],
  })),
];

const excelFunctionFacts: KnowledgeFact[] = [
  ["sum", "SUM", "adds values supplied as numbers, cell references or ranges"],
  ["average", "AVERAGE", "returns the arithmetic mean of its numeric arguments"],
  ["count", "COUNT", "counts cells or arguments containing numbers in the basic numeric-count context"],
  ["max", "MAX", "returns the largest numeric value in the supplied set or range"],
  ["min", "MIN", "returns the smallest numeric value in the supplied set or range"],
].map(([id, entity, value]) => textFact({
  factId: `com003-excel-function-${id}`,
  entityId: `computer:excel:function:${id}`,
  cpId: "COM-003-CP-003",
  taskId: "COM003-PT-010",
  relation: "excel_basic_function",
  entity,
  value,
  contextGroupId: "excel-basic-functions",
  sourceId: id === "sum" ? "MICROSOFT-EXCEL-SUM-AUTOSUM-2026" : "NIELIT-CCC-REV3-2019",
  locator: `${entity} basic function purpose`,
  tags: ["Excel", "function", id],
}));

excelFunctionFacts.push(
  textFact({
    factId: "com003-excel-autosum-sum",
    entityId: "computer:excel:autosum",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-010",
    relation: "excel_autosum_behavior",
    entity: "AutoSum",
    value: "quickly inserts a SUM formula for a detected or selected range",
    contextGroupId: "excel-basic-functions",
    sourceId: "MICROSOFT-EXCEL-SUM-AUTOSUM-2026",
    locator: "AutoSum Wizard inserts a SUM formula",
    tags: ["Excel", "AutoSum", "SUM"],
  }),
  textFact({
    factId: "com003-excel-autosum-detect-range",
    entityId: "computer:excel:autosum:range",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-010",
    relation: "excel_autosum_behavior",
    entity: "AutoSum Wizard",
    value: "can automatically detect an adjacent range to sum",
    contextGroupId: "excel-basic-functions",
    sourceId: "MICROSOFT-EXCEL-SUM-AUTOSUM-2026",
    locator: "AutoSum automatically detects the range to sum",
    tags: ["Excel", "AutoSum", "range"],
  }),
);

const excelReferenceFacts: KnowledgeFact[] = [
  textFact({
    factId: "com003-excel-relative-reference",
    entityId: "computer:excel:reference:relative",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-011",
    relation: "excel_reference_behavior",
    entity: "Relative cell reference",
    value: "adjusts relative to the new location when a formula is copied or filled",
    contextGroupId: "excel-reference-types",
    sourceId: "MICROSOFT-EXCEL-REFERENCES-2026",
    locator: "Relative reference behavior",
    difficulty: "Medium",
    tags: ["Excel", "reference", "relative"],
  }),
  textFact({
    factId: "com003-excel-absolute-reference",
    entityId: "computer:excel:reference:absolute",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-011",
    relation: "excel_reference_behavior",
    entity: "Absolute cell reference",
    value: "remains fixed when a formula is copied or filled",
    contextGroupId: "excel-reference-types",
    sourceId: "MICROSOFT-EXCEL-REFERENCES-2026",
    locator: "Absolute reference behavior",
    difficulty: "Medium",
    tags: ["Excel", "reference", "absolute"],
  }),
  textFact({
    factId: "com003-excel-absolute-reference-notation",
    entityId: "computer:excel:reference:absolute-a1",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-011",
    relation: "excel_reference_notation",
    entity: "$A$1",
    value: "absolute column and absolute row reference",
    contextGroupId: "excel-reference-types",
    sourceId: "MICROSOFT-EXCEL-REFERENCES-2026",
    locator: "Absolute reference notation",
    difficulty: "Medium",
    tags: ["Excel", "reference", "absolute", "notation"],
  }),
];

const excelDataManipulationFacts: KnowledgeFact[] = [
  textFact({
    factId: "com003-excel-sort-ascending",
    entityId: "computer:excel:sort:ascending",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-012",
    relation: "excel_data_feature",
    entity: "Ascending sort",
    value: "orders values from lower to higher or A to Z depending on data type",
    contextGroupId: "excel-sort-filter-autofill",
    sourceId: "MICROSOFT-EXCEL-SORT-2026",
    locator: "Sort A to Z / smallest to largest",
    tags: ["Excel", "sort", "ascending"],
  }),
  textFact({
    factId: "com003-excel-sort-descending",
    entityId: "computer:excel:sort:descending",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-012",
    relation: "excel_data_feature",
    entity: "Descending sort",
    value: "orders values from higher to lower or Z to A depending on data type",
    contextGroupId: "excel-sort-filter-autofill",
    sourceId: "MICROSOFT-EXCEL-SORT-2026",
    locator: "Sort Z to A / largest to smallest",
    tags: ["Excel", "sort", "descending"],
  }),
  textFact({
    factId: "com003-excel-filter-purpose",
    entityId: "computer:excel:filter",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-012",
    relation: "excel_data_feature",
    entity: "Filter",
    value: "shows rows that meet chosen criteria while hiding rows that do not meet them",
    contextGroupId: "excel-sort-filter-autofill",
    sourceId: "MICROSOFT-EXCEL-FILTER-2026",
    locator: "AutoFilter behavior",
    tags: ["Excel", "filter", "criteria"],
  }),
  textFact({
    factId: "com003-excel-filter-not-sort",
    entityId: "computer:excel:filter:visibility",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-012",
    relation: "excel_data_feature",
    entity: "Filtering data",
    value: "controls which rows are visible rather than primarily reordering the data",
    contextGroupId: "excel-sort-filter-autofill",
    sourceId: "MICROSOFT-EXCEL-FILTER-2026",
    locator: "Rows are hidden when values do not meet criteria",
    tags: ["Excel", "filter", "misconception"],
  }),
  textFact({
    factId: "com003-excel-autofill-pattern",
    entityId: "computer:excel:autofill",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-012",
    relation: "excel_data_feature",
    entity: "AutoFill",
    value: "fills adjacent cells using a pattern or values based on selected source cells",
    contextGroupId: "excel-sort-filter-autofill",
    sourceId: "MICROSOFT-EXCEL-AUTOFILL-2026",
    locator: "Auto Fill feature behavior",
    tags: ["Excel", "AutoFill", "pattern"],
  }),
  textFact({
    factId: "com003-excel-fill-handle",
    entityId: "computer:excel:fill-handle",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-012",
    relation: "excel_data_feature",
    entity: "Fill handle",
    value: "is dragged to extend AutoFill into adjacent worksheet cells",
    contextGroupId: "excel-sort-filter-autofill",
    sourceId: "MICROSOFT-EXCEL-AUTOFILL-2026",
    locator: "Drag the fill handle to fill additional cells",
    tags: ["Excel", "AutoFill", "fill-handle"],
  }),
];

const excelRowColumnFacts: KnowledgeFact[] = [
  ["insert-row", "Insert row", "adds a worksheet row while shifting existing worksheet structure as applicable"],
  ["delete-row", "Delete row", "removes the selected worksheet row"],
  ["column-width", "Column width", "controls the horizontal width of a worksheet column"],
  ["row-height", "Row height", "controls the vertical height of a worksheet row"],
].map(([id, entity, value]) => textFact({
  factId: `com003-excel-row-column-${id}`,
  entityId: `computer:excel:row-column:${id}`,
  cpId: "COM-003-CP-003",
  taskId: "COM003-PT-013",
  relation: "excel_row_column_operation",
  entity,
  value,
  contextGroupId: "excel-row-column-operations",
  sourceId: "NIELIT-CCC-REV3-2019",
  locator: `${entity} worksheet operation`,
  tags: ["Excel", "row-column", id],
}));

const excelChartFacts: KnowledgeFact[] = [
  textFact({
    factId: "com003-excel-line-chart",
    entityId: "computer:excel:chart:line",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-014",
    relation: "excel_chart_purpose",
    entity: "Line chart",
    value: "commonly shows trends over time or other evenly ordered intervals",
    contextGroupId: "excel-basic-chart-types",
    sourceId: "MICROSOFT-OFFICE-CHART-TYPES-2026",
    locator: "Line chart purpose",
    tags: ["Excel", "chart", "line", "trend"],
  }),
  textFact({
    factId: "com003-excel-pie-chart",
    entityId: "computer:excel:chart:pie",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-014",
    relation: "excel_chart_purpose",
    entity: "Pie chart",
    value: "shows how values in one data series contribute as parts of a whole",
    contextGroupId: "excel-basic-chart-types",
    sourceId: "MICROSOFT-OFFICE-CHART-TYPES-2026",
    locator: "Pie chart purpose",
    tags: ["Excel", "chart", "pie", "parts-of-whole"],
  }),
  textFact({
    factId: "com003-excel-bar-chart",
    entityId: "computer:excel:chart:bar",
    cpId: "COM-003-CP-003",
    taskId: "COM003-PT-014",
    relation: "excel_chart_purpose",
    entity: "Bar chart",
    value: "illustrates comparisons among individual items or categories",
    contextGroupId: "excel-basic-chart-types",
    sourceId: "MICROSOFT-OFFICE-CHART-TYPES-2026",
    locator: "Bar chart purpose",
    tags: ["Excel", "chart", "bar", "comparison"],
  }),
];

const excelShortcutFacts: KnowledgeFact[] = [
  ["f2", "F2", "edit the active cell"],
  ["ctrl-g", "Ctrl+G", "open the Go To dialog"],
  ["ctrl-1", "Ctrl+1", "open the Format Cells dialog"],
  ["alt-h-o-w", "Alt+H, O, W", "open the column-width command through Windows desktop Excel Ribbon access keys"],
].map(([id, entity, value]) => textFact({
  factId: `com003-excel-shortcut-${id}`,
  entityId: `computer:excel:shortcut:${id}`,
  cpId: "COM-003-CP-003",
  taskId: "COM003-PT-015",
  relation: "excel_shortcut_action",
  entity,
  value,
  contextGroupId: "excel-application-shortcuts",
  sourceId: "MICROSOFT-EXCEL-SHORTCUTS-2026",
  locator: `${entity} Windows desktop Excel shortcut/access-key behavior`,
  difficulty: id === "alt-h-o-w" ? "Hard" : "Medium",
  tags: ["Excel", "shortcut", "windows-desktop", id],
  versionScoped: true,
}));

const powerpointStructureFacts: KnowledgeFact[] = [
  textFact({
    factId: "com003-powerpoint-presentation-slides",
    entityId: "computer:powerpoint:presentation",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-016",
    relation: "powerpoint_structure_concept",
    entity: "PowerPoint presentation",
    value: "is organized as a sequence or collection of slides used to present information",
    contextGroupId: "powerpoint-structure-creation",
    sourceId: "NIELIT-CCC-REV3-2019",
    locator: "Presentation module: creating and handling slides",
    tags: ["PowerPoint", "presentation", "slides"],
  }),
  textFact({
    factId: "com003-powerpoint-slide-unit",
    entityId: "computer:powerpoint:slide",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-016",
    relation: "powerpoint_structure_concept",
    entity: "Slide",
    value: "an individual presentation page/screen within a PowerPoint presentation",
    contextGroupId: "powerpoint-structure-creation",
    sourceId: "NIELIT-CCC-REV3-2019",
    locator: "Presentation module: slide creation and manipulation",
    tags: ["PowerPoint", "slide"],
  }),
  textFact({
    factId: "com003-powerpoint-layout-role",
    entityId: "computer:powerpoint:slide-layout",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-016",
    relation: "powerpoint_creation_structure",
    entity: "Slide layout",
    value: "controls the arrangement and positioning of placeholders and slide content areas",
    contextGroupId: "powerpoint-structure-creation",
    sourceId: "MICROSOFT-POWERPOINT-LAYOUT-2026",
    locator: "Slide layout definition",
    tags: ["PowerPoint", "layout", "placeholder"],
  }),
  textFact({
    factId: "com003-powerpoint-placeholder-role",
    entityId: "computer:powerpoint:placeholder",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-016",
    relation: "powerpoint_creation_structure",
    entity: "Placeholder",
    value: "a container on a slide layout that can hold content such as text, tables, charts, pictures or media",
    contextGroupId: "powerpoint-structure-creation",
    sourceId: "MICROSOFT-POWERPOINT-LAYOUT-2026",
    locator: "Placeholder definition and content examples",
    tags: ["PowerPoint", "placeholder", "layout"],
  }),
  textFact({
    factId: "com003-powerpoint-theme-role",
    entityId: "computer:powerpoint:theme",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-016",
    relation: "powerpoint_creation_structure",
    entity: "Theme",
    value: "provides coordinated design elements such as colors, fonts, effects and background styling",
    contextGroupId: "powerpoint-structure-creation",
    sourceId: "MICROSOFT-POWERPOINT-LAYOUT-2026",
    locator: "Theme elements described within slide-layout documentation",
    tags: ["PowerPoint", "theme", "design"],
  }),
  textFact({
    factId: "com003-powerpoint-template-role",
    entityId: "computer:powerpoint:template",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-016",
    relation: "powerpoint_creation_structure",
    entity: "Presentation template",
    value: "provides a predefined starting design/structure for creating a presentation",
    contextGroupId: "powerpoint-structure-creation",
    sourceId: "NIELIT-CCC-PLUS-OFFICE",
    locator: "Presentation creation from templates and design structure",
    tags: ["PowerPoint", "template", "creation"],
  }),
];

const powerpointInsertFacts: KnowledgeFact[] = [
  ...[
    ["picture", "Picture", "can be inserted as visual content on a slide"],
    ["table", "Table", "can be inserted on a slide to organize data in rows and columns"],
    ["chart", "Chart", "can be inserted on a slide to visualize data"],
  ].map(([id, entity, value]) => textFact({
    factId: `com003-powerpoint-insert-${id}`,
    entityId: `computer:powerpoint:insert:${id}`,
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-017",
    relation: "powerpoint_insertable_object",
    entity,
    value,
    contextGroupId: "powerpoint-insertable-objects",
    sourceId: "NIELIT-CCC-PLUS-OFFICE",
    locator: `${entity} slide object insertion`,
    tags: ["PowerPoint", "insert", id],
  })),
  textFact({
    factId: "com003-powerpoint-web-insert-picture-tab",
    entityId: "computer:powerpoint:web:insert-picture",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-017",
    relation: "powerpoint_version_scoped_ui_mapping",
    entity: "PowerPoint for the web — Insert tab",
    value: "contains the Picture command used to insert a picture on a slide",
    contextGroupId: "powerpoint-version-scoped-insert-ui",
    sourceId: "MICROSOFT-POWERPOINT-BASIC-TASKS-WEB-2026",
    locator: "PowerPoint for the web: Insert tab > Picture",
    difficulty: "Medium",
    tags: ["PowerPoint", "web", "Insert-tab", "picture"],
    versionScoped: true,
  }),
];

const powerpointTransitionFacts: KnowledgeFact[] = [
  textFact({
    factId: "com003-powerpoint-transition-definition",
    entityId: "computer:powerpoint:transition",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-018",
    relation: "powerpoint_motion_effect",
    entity: "Slide transition",
    value: "an effect associated with moving from one slide to the next",
    contextGroupId: "powerpoint-transition-animation-timing",
    sourceId: "MICROSOFT-POWERPOINT-TRANSITION-ANIMATION-2026",
    locator: "Transition versus animation distinction",
    tags: ["PowerPoint", "transition", "slide-to-slide"],
  }),
  textFact({
    factId: "com003-powerpoint-animation-definition",
    entityId: "computer:powerpoint:animation",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-018",
    relation: "powerpoint_motion_effect",
    entity: "Animation",
    value: "an effect applied to an object or text on a slide",
    contextGroupId: "powerpoint-transition-animation-timing",
    sourceId: "MICROSOFT-POWERPOINT-TRANSITION-ANIMATION-2026",
    locator: "Transition versus animation distinction",
    tags: ["PowerPoint", "animation", "object"],
  }),
  textFact({
    factId: "com003-powerpoint-transition-duration",
    entityId: "computer:powerpoint:transition-duration",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-018",
    relation: "powerpoint_transition_timing",
    entity: "Transition duration",
    value: "controls how long the transition effect takes; a shorter duration makes it complete faster",
    contextGroupId: "powerpoint-transition-animation-timing",
    sourceId: "MICROSOFT-POWERPOINT-TRANSITION-TIMING-2026",
    locator: "Set transition speed using Duration",
    tags: ["PowerPoint", "transition", "duration"],
  }),
  textFact({
    factId: "com003-powerpoint-auto-advance-time",
    entityId: "computer:powerpoint:slide-advance-time",
    cpId: "COM-003-CP-004",
    taskId: "COM003-PT-018",
    relation: "powerpoint_transition_timing",
    entity: "Automatic slide advance timing",
    value: "specifies time spent on a slide before advancing automatically to the next slide",
    contextGroupId: "powerpoint-transition-animation-timing",
    sourceId: "MICROSOFT-POWERPOINT-TRANSITION-TIMING-2026",
    locator: "Specify time before advancing to the next slide",
    tags: ["PowerPoint", "slide-show", "timing", "advance"],
  }),
];

const powerpointShortcutFacts: KnowledgeFact[] = [
  ["f5", "F5", "start the slide show from the beginning"],
  ["shift-f5", "Shift+F5", "start the slide show from the current slide"],
].map(([id, entity, value]) => textFact({
  factId: `com003-powerpoint-shortcut-${id}`,
  entityId: `computer:powerpoint:shortcut:${id}`,
  cpId: "COM-003-CP-004",
  taskId: "COM003-PT-019",
  relation: "powerpoint_slideshow_shortcut",
  entity,
  value,
  contextGroupId: "powerpoint-slideshow-shortcuts",
  sourceId: "MICROSOFT-POWERPOINT-SLIDESHOW-SHORTCUTS-2026",
  locator: `${entity} Windows desktop PowerPoint slide-show shortcut`,
  difficulty: "Medium",
  tags: ["PowerPoint", "shortcut", "slide-show", "windows-desktop", id],
  versionScoped: true,
}));

export const COM003_CANDIDATE_FACTS: KnowledgeFact[] = [
  ...officeIdentityFacts,
  ...officeFormatFacts,
  ...commonCommandFacts,
  ...commonShortcutFacts,
  ...wordEditingFormattingFacts,
  ...wordProofingFacts,
  ...wordPageFacts,
  ...wordMailMergeFacts,
  ...excelStructureFacts,
  ...excelFormulaFacts,
  ...excelFunctionFacts,
  ...excelReferenceFacts,
  ...excelDataManipulationFacts,
  ...excelRowColumnFacts,
  ...excelChartFacts,
  ...excelShortcutFacts,
  ...powerpointStructureFacts,
  ...powerpointInsertFacts,
  ...powerpointTransitionFacts,
  ...powerpointShortcutFacts,
];

export function auditCom003CandidateFactCorpus() {
  const issues: string[] = [];
  const factIds = new Set<string>();
  const entityRelationPairs = new Set<string>();
  const authorityById = new Map(ALL_AUTHORITIES.map((entry) => [entry.sourceId, entry]));
  const allowedCpIds = new Set<Com003CandidateCpId>([
    "COM-003-CP-001",
    "COM-003-CP-002",
    "COM-003-CP-003",
    "COM-003-CP-004",
  ]);

  for (const fact of COM003_CANDIDATE_FACTS) {
    if (factIds.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    factIds.add(fact.factId);

    const pair = `${fact.entityId}|${fact.relation}|${fact.value.kind === "text" ? fact.value.text.en : fact.value.kind}`;
    if (entityRelationPairs.has(pair)) issues.push(`DUPLICATE_ENTITY_RELATION_VALUE:${fact.factId}`);
    entityRelationPairs.add(pair);

    if (fact.subject !== "Computer Awareness" || fact.chapterId !== "COM-003") issues.push(`OWNERSHIP_MISMATCH:${fact.factId}`);
    if (!allowedCpIds.has(fact.cpId as Com003CandidateCpId)) issues.push(`UNKNOWN_CP:${fact.factId}:${fact.cpId}`);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`PREMATURE_APPROVAL:${fact.factId}`);
    if (fact.review.reviewedAt || fact.review.reviewedBy) issues.push(`CANDIDATE_HAS_REVIEWER:${fact.factId}`);

    const authority = authorityById.get(fact.source.sourceId);
    if (!authority) issues.push(`UNKNOWN_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    if (authority?.authorityClass === "PYQ_EVIDENCE") issues.push(`PYQ_USED_AS_TRUTH_SOURCE:${fact.factId}:${fact.source.sourceId}`);

    const taskTags = fact.tags.filter((tag) => tag.startsWith("provisional-task:"));
    if (taskTags.length !== 1) issues.push(`TASK_OWNERSHIP_TAG_COUNT:${fact.factId}:${taskTags.length}`);
    if (taskTags.some((tag) => tag.includes("HOLD"))) issues.push(`HELD_TASK_FACT:${fact.factId}`);

    const versionScoped = fact.tags.includes("version-scoped");
    if (versionScoped && fact.freshness.class === "IMMUTABLE") issues.push(`VERSION_SCOPED_IMMUTABLE:${fact.factId}`);
    if (versionScoped && authority?.authorityClass !== "VENDOR_TECHNICAL") issues.push(`VERSION_SCOPED_NON_VENDOR_SOURCE:${fact.factId}`);
    if (fact.freshness.class !== "IMMUTABLE" && !fact.freshness.lastVerifiedAt) {
      issues.push(`MUTABLE_FACT_MISSING_VERIFICATION:${fact.factId}`);
    }
  }

  const cpCounts = Object.fromEntries(
    [...allowedCpIds].map((cpId) => [cpId, COM003_CANDIDATE_FACTS.filter((fact) => fact.cpId === cpId).length]),
  );
  const taskIds = [...new Set(COM003_CANDIDATE_FACTS.flatMap((fact) =>
    fact.tags.filter((tag) => tag.startsWith("provisional-task:")).map((tag) => tag.replace("provisional-task:", "")),
  ))].sort();
  const relationCounts = Object.fromEntries(
    [...new Set(COM003_CANDIDATE_FACTS.map((fact) => fact.relation))]
      .sort()
      .map((relation) => [relation, COM003_CANDIDATE_FACTS.filter((fact) => fact.relation === relation).length]),
  );
  const versionScopedFactIds = COM003_CANDIDATE_FACTS
    .filter((fact) => fact.tags.includes("version-scoped"))
    .map((fact) => fact.factId);

  if (COM003_CANDIDATE_FACTS.length < 110) issues.push(`THIN_FACT_CORPUS:${COM003_CANDIDATE_FACTS.length}`);
  if (taskIds.length !== 19) issues.push(`TASK_COVERAGE_COUNT:${taskIds.length}`);
  if ((cpCounts["COM-003-CP-001"] ?? 0) < 25) issues.push(`THIN_OFFICE_COMMON_CP:${cpCounts["COM-003-CP-001"] ?? 0}`);
  if ((cpCounts["COM-003-CP-002"] ?? 0) < 30) issues.push(`THIN_WORD_CP:${cpCounts["COM-003-CP-002"] ?? 0}`);
  if ((cpCounts["COM-003-CP-003"] ?? 0) < 40) issues.push(`THIN_EXCEL_CP:${cpCounts["COM-003-CP-003"] ?? 0}`);
  if ((cpCounts["COM-003-CP-004"] ?? 0) < 15) issues.push(`THIN_POWERPOINT_CP:${cpCounts["COM-003-CP-004"] ?? 0}`);

  return {
    valid: issues.length === 0,
    factCount: COM003_CANDIDATE_FACTS.length,
    cpCounts,
    taskCount: taskIds.length,
    taskIds,
    relationCounts,
    versionScopedFactIds,
    reviewStatus: "REVIEW_REQUIRED" as const,
    permanentQlCount: 0,
    productionEligible: false,
    issues,
  };
}

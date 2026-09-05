export type Com003DiscoveryEvidence =
  | "OFFICIAL_EXAM"
  | "OFFICIAL_CURRICULUM"
  | "VENDOR_AUTHORITY"
  | "PYQ_CONFIRMED"
  | "DOMAIN_HYPOTHESIS"
  | "PYQ_REQUIRED";

export type Com003DiscoveryCandidate = {
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
  evidence: Com003DiscoveryEvidence[];
  likelyMergeWith?: string[];
  splitIf?: string[];
  ownershipNotes?: string[];
  ambiguityRisks?: string[];
  productionState: "DISCOVERY_ONLY";
};

/**
 * Exhaustive provisional learner-task inventory for COM-003 / Office &
 * Productivity Software.
 *
 * Discovery is intentionally wider than the eventual QL set. No CP/QL is
 * permanent at this stage. Source authority, PYQ saturation, merge/split,
 * inverse-surface, version-stability and ownership audits must run first.
 */
export const COM003_OFFICE_PRODUCTIVITY_DISCOVERY: Com003DiscoveryCandidate[] = [
  {
    candidateId: "OFF-DISC-001",
    learnerTask: "Identify Word, Excel or PowerPoint from the principal productivity task it performs",
    relationFamily: "office-application-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "word processing", "spreadsheet", "presentation"],
    surfaceVariants: [
      "Which application is primarily used to create and edit word-processing documents?",
      "Which Office application is used to organize and calculate tabular data?",
      "Which application is designed to create slide presentations?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM", "PYQ_CONFIRMED"],
    likelyMergeWith: ["OFF-DISC-002"],
    ownershipNotes: ["Outlook/e-mail belongs to COM-004; Access/database concepts belong to COM-007."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-002",
    learnerTask: "Map Word, Excel and PowerPoint to their principal productivity uses",
    relationFamily: "office-application-purpose",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint"],
    surfaceVariants: [
      "What is Microsoft Excel primarily used for?",
      "Which task is most appropriately performed in PowerPoint?",
      "Which task is NOT primarily associated with Word?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM", "PYQ_CONFIRMED"],
    likelyMergeWith: ["OFF-DISC-001"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-003",
    learnerTask: "Classify Word, Excel and PowerPoint as application/productivity software rather than system software",
    relationFamily: "office-software-classification",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["application software", "productivity software", "system software", "operating system", "Word", "Excel", "PowerPoint"],
    surfaceVariants: [
      "MS Word is an example of which software category?",
      "Which option is application software rather than an operating system?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    ownershipNotes: ["General software taxonomy remains COM-001/COM-007; this candidate only tests Office ownership."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-004",
    learnerTask: "Map modern Word, Excel and PowerPoint file extensions to their applications",
    relationFamily: "office-file-format-mapping",
    candidateMode: "CLASSIFICATION",
    objectFamilies: [".docx", ".xlsx", ".pptx", "Word", "Excel", "PowerPoint"],
    surfaceVariants: [
      "Which extension is associated with a modern Excel workbook?",
      "A .pptx file is normally opened as what kind of Office file?",
      "Which set correctly matches DOCX, XLSX and PPTX?",
    ],
    evidence: ["VENDOR_AUTHORITY", "PYQ_CONFIRMED"],
    likelyMergeWith: ["OFF-DISC-005"],
    ownershipNotes: ["Generic extension mechanics remain COM-002; Office-specific extension identity belongs here."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-005",
    learnerTask: "Distinguish modern Office Open XML file extensions from legacy Word, Excel and PowerPoint extensions",
    relationFamily: "office-file-format-era",
    candidateMode: "COMPARISON",
    objectFamilies: [".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt"],
    surfaceVariants: [
      "Which pair correctly matches a modern and legacy Word format?",
      "Which extension represents an Excel 97-2003 workbook?",
      "Which of these is the modern PowerPoint presentation extension?",
    ],
    evidence: ["VENDOR_AUTHORITY", "PYQ_CONFIRMED"],
    likelyMergeWith: ["OFF-DISC-004"],
    ambiguityRisks: ["Do not imply that an application supports only one extension."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-006",
    learnerTask: "Recognize common cross-Office editing commands such as cut, copy, paste, undo, redo, save, open and print",
    relationFamily: "office-common-command",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["cut", "copy", "paste", "undo", "redo", "save", "open", "print"],
    surfaceVariants: [
      "Which command reverses the most recent editing action?",
      "Which command places copied content into the current location?",
      "Which command stores current changes to a file?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    likelyMergeWith: ["OFF-DISC-007"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-007",
    learnerTask: "Map durable common Office keyboard shortcuts to editing/document commands and vice versa",
    relationFamily: "office-common-shortcut",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["Ctrl+C", "Ctrl+X", "Ctrl+V", "Ctrl+Z", "Ctrl+Y", "Ctrl+S", "Ctrl+P", "Ctrl+F"],
    surfaceVariants: [
      "Which shortcut copies the selected content?",
      "What does Ctrl+Z do in a typical Office editing context?",
      "Which shortcut opens Find in the stated Office application?",
    ],
    evidence: ["VENDOR_AUTHORITY", "PYQ_CONFIRMED"],
    likelyMergeWith: ["OFF-DISC-006"],
    ambiguityRisks: ["Shortcut semantics can vary by platform/web app; require Windows desktop context where needed."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-008",
    learnerTask: "Identify Word as a word-processing application and distinguish a document from spreadsheet/presentation artifacts",
    relationFamily: "word-document-concept",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["word processor", "document", "workbook", "worksheet", "presentation", "slide"],
    surfaceVariants: [
      "Which artifact is normally created in a word processor?",
      "A Word file is best described as which type of productivity artifact?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-009",
    learnerTask: "Map text-selection and clipboard operations in Word to the intended editing result",
    relationFamily: "word-editing-operation",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["select", "cut", "copy", "paste", "move text", "duplicate text"],
    surfaceVariants: [
      "Which operation duplicates selected text without removing the original?",
      "Which pair of operations is used to move selected text to another location?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    likelyMergeWith: ["OFF-DISC-006"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-010",
    learnerTask: "Identify common character-formatting functions in Word such as bold, italic and underline",
    relationFamily: "word-character-formatting",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["bold", "italic", "underline", "font", "font size", "font color"],
    surfaceVariants: [
      "Which formatting makes selected text heavier/darker?",
      "Which command underlines selected text?",
      "Which property changes the size of displayed document text?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    likelyMergeWith: ["OFF-DISC-011"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-011",
    learnerTask: "Map durable Word formatting shortcuts such as Ctrl+B, Ctrl+I and Ctrl+U to their effects",
    relationFamily: "word-formatting-shortcut",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["Ctrl+B", "Ctrl+I", "Ctrl+U", "bold", "italic", "underline"],
    surfaceVariants: [
      "Which shortcut applies bold formatting in Word for Windows?",
      "What is the effect of Ctrl+I on selected Word text?",
    ],
    evidence: ["VENDOR_AUTHORITY", "PYQ_REQUIRED"],
    likelyMergeWith: ["OFF-DISC-010", "OFF-DISC-007"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-012",
    learnerTask: "Distinguish paragraph alignment options in Word",
    relationFamily: "word-paragraph-alignment",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["left align", "center", "right align", "justify"],
    surfaceVariants: [
      "Which alignment makes text flush with both left and right margins?",
      "Which paragraph alignment places text centrally between margins?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-013",
    learnerTask: "Distinguish Find from Replace in word processing",
    relationFamily: "word-find-replace",
    candidateMode: "COMPARISON",
    objectFamilies: ["Find", "Replace", "search text", "substitute text"],
    surfaceVariants: [
      "Which feature searches for text without necessarily changing it?",
      "Which Word feature can locate specified text and substitute another value?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-014",
    learnerTask: "Map spelling, grammar and AutoCorrect features to basic document-proofing tasks",
    relationFamily: "word-proofing-feature",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["spelling", "grammar", "AutoCorrect", "proofing"],
    surfaceVariants: [
      "Which feature helps identify spelling errors in a document?",
      "Which feature automatically corrects specified common typing errors?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    ambiguityRisks: ["Avoid version-specific editor/proofing UI names when the underlying learner task is stable."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-015",
    learnerTask: "Identify headers and footers as repeated page-margin content in a document",
    relationFamily: "word-header-footer",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["header", "footer", "page number", "top margin", "bottom margin"],
    surfaceVariants: [
      "Which Word element appears in the top margin area of pages?",
      "Where are page numbers commonly inserted when using header/footer features?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-016",
    learnerTask: "Map page orientation and basic page-layout concepts in Word",
    relationFamily: "word-page-layout",
    candidateMode: "COMPARISON",
    objectFamilies: ["portrait", "landscape", "margins", "page size", "orientation"],
    surfaceVariants: [
      "Which orientation has the page wider than it is tall?",
      "Which page-layout property changes portrait to landscape?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "DOMAIN_HYPOTHESIS"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-017",
    learnerTask: "Identify mail merge from its purpose of producing personalized copies from a main document and data source",
    relationFamily: "word-mail-merge-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["mail merge", "main document", "data source", "merge fields", "personalized letters", "labels", "envelopes"],
    surfaceVariants: [
      "Which Word feature combines a main document with recipient data?",
      "Which process creates personalized copies of the same basic letter for many recipients?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY", "PYQ_CONFIRMED"],
    likelyMergeWith: ["OFF-DISC-018"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-018",
    learnerTask: "Map mail-merge components such as main document, data source and merge fields to their roles",
    relationFamily: "word-mail-merge-component",
    candidateMode: "MATCHING",
    objectFamilies: ["main document", "data source", "merge field", "recipient record"],
    surfaceVariants: [
      "Match each mail-merge component with its role.",
      "Which component supplies recipient-specific values during a mail merge?",
    ],
    evidence: ["VENDOR_AUTHORITY", "PYQ_CONFIRMED"],
    likelyMergeWith: ["OFF-DISC-017"],
    splitIf: ["SSC/Punjab evidence repeatedly tests component-level mail-merge relationships beyond feature identification."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-019",
    learnerTask: "Identify workbook, worksheet, row, column and cell as core spreadsheet concepts",
    relationFamily: "excel-structure-concept",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["workbook", "worksheet", "row", "column", "cell"],
    surfaceVariants: [
      "What is the intersection of a row and a column called?",
      "What is an Excel file containing one or more worksheets called?",
      "Distinguish a worksheet from a workbook.",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    likelyMergeWith: ["OFF-DISC-020"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-020",
    learnerTask: "Interpret an Excel cell address as a column label plus row number",
    relationFamily: "excel-cell-address",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["A1", "B7", "column", "row", "cell address"],
    surfaceVariants: [
      "In cell B7, what does B represent?",
      "Which notation correctly represents the cell at column C and row 5?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    likelyMergeWith: ["OFF-DISC-019", "OFF-DISC-021"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-021",
    learnerTask: "Recognize a cell range and distinguish a single cell reference from a multi-cell range",
    relationFamily: "excel-cell-range",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["A1", "A1:A5", "B2:D6", "cell", "range"],
    surfaceVariants: [
      "Which notation identifies a continuous range of cells?",
      "A1:A10 refers to what in a worksheet?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "DOMAIN_HYPOTHESIS"],
    likelyMergeWith: ["OFF-DISC-020"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-022",
    learnerTask: "Recognize that an Excel formula begins with an equal sign and may use cell references/operators/functions",
    relationFamily: "excel-formula-concept",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["formula", "=", "cell reference", "operator", "function"],
    surfaceVariants: [
      "Which symbol normally begins an Excel formula?",
      "Which entry is an Excel formula rather than plain text?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY", "PYQ_REQUIRED"],
    likelyMergeWith: ["OFF-DISC-023"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-023",
    learnerTask: "Map basic arithmetic operators in Excel formulas to addition, subtraction, multiplication and division",
    relationFamily: "excel-formula-operator",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["+", "-", "*", "/", "addition", "subtraction", "multiplication", "division"],
    surfaceVariants: [
      "Which operator performs multiplication in an Excel formula?",
      "What calculation does =A1/B1 perform?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    likelyMergeWith: ["OFF-DISC-022"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-024",
    learnerTask: "Map core awareness-level Excel functions SUM, AVERAGE, COUNT, MAX and MIN to their purposes",
    relationFamily: "excel-basic-function",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["SUM", "AVERAGE", "COUNT", "MAX", "MIN"],
    surfaceVariants: [
      "Which function returns the largest value in a range?",
      "Which Excel function calculates the arithmetic mean?",
      "Which function counts numeric entries in the stated basic context?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY", "PYQ_REQUIRED"],
    splitIf: ["Function families accumulate enough direct target-exam PYQs to justify independent QLs."],
    ambiguityRisks: ["COUNT family variants have different semantics; do not blur COUNT with COUNTA/COUNTIF."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-025",
    learnerTask: "Identify AutoSum as a quick mechanism for inserting a SUM formula",
    relationFamily: "excel-autosum",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["AutoSum", "SUM", "range", "formula"],
    surfaceVariants: [
      "Which Excel feature quickly inserts a SUM formula for adjacent values?",
      "AutoSum is primarily associated with which function?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    likelyMergeWith: ["OFF-DISC-024"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-026",
    learnerTask: "Distinguish relative and absolute Excel cell references at awareness-exam depth",
    relationFamily: "excel-reference-type",
    candidateMode: "COMPARISON",
    objectFamilies: ["A1", "$A$1", "relative reference", "absolute reference", "copy formula"],
    surfaceVariants: [
      "Which reference is absolute in Excel?",
      "Which type of reference remains fixed when a formula is copied?",
      "Distinguish A1 from $A$1.",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY"],
    ambiguityRisks: ["Mixed references such as $A1/A$1 should remain provisional until exam evidence supports them."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-027",
    learnerTask: "Distinguish sorting from filtering data in a spreadsheet",
    relationFamily: "excel-sort-filter",
    candidateMode: "COMPARISON",
    objectFamilies: ["sort", "filter", "order", "hide non-matching rows", "criteria"],
    surfaceVariants: [
      "Which operation arranges records in ascending or descending order?",
      "Which feature displays only records meeting specified criteria?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-028",
    learnerTask: "Recognize AutoFill/series filling as a spreadsheet mechanism for extending patterns or copying formulas/data",
    relationFamily: "excel-autofill",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["AutoFill", "fill handle", "series", "copy pattern"],
    surfaceVariants: [
      "Which Excel feature can extend a number/date series?",
      "Which feature is used to continue a detected pattern into adjacent cells?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    ambiguityRisks: ["Do not assume every drag action creates a numerical series; behavior depends on source selection."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-029",
    learnerTask: "Map row/column insertion, deletion, width and height operations to the worksheet structure being changed",
    relationFamily: "excel-row-column-operation",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["row", "column", "insert", "delete", "row height", "column width"],
    surfaceVariants: [
      "Which property changes the width of a spreadsheet column?",
      "Which operation adds a new row without replacing existing cell values?",
      "Identify the Excel action from the stated row/column change.",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_CONFIRMED"],
    splitIf: ["Shortcut execution for column width remains a recurring SSC Tier-II surface distinct from the concept."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-030",
    learnerTask: "Map common spreadsheet chart types to basic visual-comparison purposes",
    relationFamily: "excel-chart-type",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["bar/column chart", "line chart", "pie chart", "categories", "trend", "parts of whole"],
    surfaceVariants: [
      "Which chart is commonly used to show parts of a whole?",
      "Which chart type is commonly used to display a trend across ordered values/time?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    ambiguityRisks: ["Chart choice is context-dependent; use canonical elementary purposes rather than absolute 'best chart' claims."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-031",
    learnerTask: "Map durable Excel keyboard shortcuts to actions in explicit Windows desktop context",
    relationFamily: "excel-shortcut-action",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["F2", "Ctrl+G", "Ctrl+1", "Ctrl+Z", "Ctrl+Y", "Alt+H+O+W"],
    surfaceVariants: [
      "Which key edits the active Excel cell in Windows desktop Excel?",
      "Which shortcut opens Go To in Excel?",
      "Which shortcut sequence adjusts column width in the specified Excel version/context?",
    ],
    evidence: ["VENDOR_AUTHORITY", "PYQ_CONFIRMED"],
    ambiguityRisks: ["Ribbon access-key sequences may be version-sensitive; require explicit context and separate stability review."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-032",
    learnerTask: "Identify a PowerPoint presentation as a collection/sequence of slides used to present information",
    relationFamily: "powerpoint-presentation-concept",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["presentation", "slide", "slide show", "PowerPoint"],
    surfaceVariants: [
      "A PowerPoint presentation consists primarily of what units?",
      "Which Microsoft application creates slide-based presentations?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM", "PYQ_CONFIRMED"],
    likelyMergeWith: ["OFF-DISC-001"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-033",
    learnerTask: "Map basic PowerPoint creation concepts such as blank presentation, template/theme and slide layout to their roles",
    relationFamily: "powerpoint-creation-structure",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["blank presentation", "template", "theme", "slide layout", "placeholder"],
    surfaceVariants: [
      "Which feature provides a predefined starting design for a presentation?",
      "Which concept controls the arrangement of placeholders on a slide?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "DOMAIN_HYPOTHESIS"],
    ambiguityRisks: ["Template, theme and layout are related but not interchangeable; facts require vendor-source review before generation."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-034",
    learnerTask: "Identify common insertable objects in a PowerPoint slide and the Insert-tab ownership of stable object families",
    relationFamily: "powerpoint-insert-object",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["table", "picture", "shape", "chart", "WordArt", "media", "Insert tab"],
    surfaceVariants: [
      "Which tab is used to insert a picture or table in the stated PowerPoint version?",
      "Which of the following is an object that can be inserted on a slide?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "VENDOR_AUTHORITY", "PYQ_CONFIRMED"],
    ambiguityRisks: ["Ribbon groups/tabs can change; only durable mappings with explicit version/context should survive allocation."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-035",
    learnerTask: "Distinguish slide transitions from object animations in PowerPoint",
    relationFamily: "powerpoint-transition-animation",
    candidateMode: "COMPARISON",
    objectFamilies: ["transition", "animation", "slide", "text", "shape", "image"],
    surfaceVariants: [
      "Which effect occurs when moving from one slide to the next?",
      "Which effect is applied to an individual object on a slide?",
      "Which statement correctly distinguishes transitions and animations?",
    ],
    evidence: ["VENDOR_AUTHORITY", "OFFICIAL_CURRICULUM", "PYQ_CONFIRMED"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-036",
    learnerTask: "Map PowerPoint slide-show start commands and durable Windows shortcuts to presentation scope",
    relationFamily: "powerpoint-slideshow-shortcut",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["F5", "Shift+F5", "start from beginning", "start from current slide", "slide show"],
    surfaceVariants: [
      "Which key starts a PowerPoint slide show from the beginning in Windows desktop PowerPoint?",
      "Which shortcut starts the show from the current slide?",
    ],
    evidence: ["VENDOR_AUTHORITY", "PYQ_REQUIRED"],
    ambiguityRisks: ["PowerPoint shortcut behavior differs by platform/web app; generation must use the explicitly verified Windows desktop context."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-037",
    learnerTask: "Recognize slide timing and automated slide-show progression concepts at awareness-exam depth",
    relationFamily: "powerpoint-slideshow-timing",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["slide timing", "advance slide", "automated slide show", "transition timing"],
    surfaceVariants: [
      "Which setting controls automatic progression between presentation slides?",
      "Which feature is associated with timing slide transitions?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    likelyMergeWith: ["OFF-DISC-035", "OFF-DISC-036"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-038",
    learnerTask: "Distinguish PowerPoint presentation and show file formats at basic-awareness depth",
    relationFamily: "powerpoint-file-format-specialization",
    candidateMode: "CLASSIFICATION",
    objectFamilies: [".pptx", ".ppt", ".ppsx", "presentation", "slide show"],
    surfaceVariants: [
      "Which extension is a standard modern PowerPoint presentation?",
      "Which PowerPoint format is designed to open directly in Slide Show view?",
    ],
    evidence: ["VENDOR_AUTHORITY", "PYQ_CONFIRMED"],
    likelyMergeWith: ["OFF-DISC-004", "OFF-DISC-005"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-039",
    learnerTask: "Evaluate multi-statement sets combining Word, Excel and PowerPoint facts",
    relationFamily: "office-multi-statement",
    candidateMode: "STATEMENT_SET",
    objectFamilies: ["Word", "Excel", "PowerPoint", "file formats", "mail merge", "formulas", "transitions", "shortcuts"],
    surfaceVariants: [
      "Which of statements I, II and III about Office applications are correct?",
      "Select the correct combination of Word/Excel/PowerPoint statements.",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    ownershipNotes: ["Composition family only; it must consume independently approved atomic facts rather than author new facts."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "OFF-DISC-040",
    learnerTask: "Match Office applications/features with purposes, file formats, functions or shortcuts",
    relationFamily: "office-multi-pair-matching",
    candidateMode: "MATCHING",
    objectFamilies: ["Word", "Excel", "PowerPoint", "mail merge", "SUM", "transition", ".docx", ".xlsx", ".pptx"],
    surfaceVariants: [
      "Match List I with List II for Office applications and functions.",
      "Match each Office file extension or feature to the correct application/purpose.",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    ownershipNotes: ["Composition family only; pair facts must already be source-approved."],
    productionState: "DISCOVERY_ONLY",
  },
];

export function auditCom003OfficeProductivityDiscovery() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const relationFamilies = new Set<string>();

  for (const candidate of COM003_OFFICE_PRODUCTIVITY_DISCOVERY) {
    if (ids.has(candidate.candidateId)) issues.push(`DUPLICATE_ID:${candidate.candidateId}`);
    ids.add(candidate.candidateId);
    relationFamilies.add(candidate.relationFamily);
    if (candidate.productionState !== "DISCOVERY_ONLY") issues.push(`PREMATURE_PRODUCTION_STATE:${candidate.candidateId}`);
    if (!candidate.learnerTask.trim()) issues.push(`EMPTY_LEARNER_TASK:${candidate.candidateId}`);
    if (!candidate.relationFamily.trim()) issues.push(`EMPTY_RELATION_FAMILY:${candidate.candidateId}`);
    if (!candidate.objectFamilies.length) issues.push(`NO_OBJECT_FAMILY:${candidate.candidateId}`);
    if (candidate.surfaceVariants.length < 2) issues.push(`THIN_SURFACE_SET:${candidate.candidateId}`);
    if (!candidate.evidence.length) issues.push(`NO_EVIDENCE_PLAN:${candidate.candidateId}`);
  }

  const pyqConfirmed = COM003_OFFICE_PRODUCTIVITY_DISCOVERY.filter((candidate) =>
    candidate.evidence.includes("PYQ_CONFIRMED"),
  ).map((candidate) => candidate.candidateId);

  const requiredRelationFamilies = [
    "office-application-purpose",
    "office-file-format-mapping",
    "office-common-shortcut",
    "word-find-replace",
    "word-mail-merge-purpose",
    "excel-structure-concept",
    "excel-cell-address",
    "excel-formula-concept",
    "excel-basic-function",
    "excel-reference-type",
    "excel-sort-filter",
    "excel-row-column-operation",
    "excel-shortcut-action",
    "powerpoint-presentation-concept",
    "powerpoint-transition-animation",
    "powerpoint-slideshow-shortcut",
  ];
  for (const family of requiredRelationFamilies) {
    if (!relationFamilies.has(family)) issues.push(`MISSING_REQUIRED_RELATION_FAMILY:${family}`);
  }

  if (COM003_OFFICE_PRODUCTIVITY_DISCOVERY.length < 40) {
    issues.push(`THIN_DISCOVERY_INVENTORY:${COM003_OFFICE_PRODUCTIVITY_DISCOVERY.length}`);
  }
  if (relationFamilies.size < 32) issues.push(`THIN_RELATION_FAMILY_COVERAGE:${relationFamilies.size}`);
  if (pyqConfirmed.length < 12) issues.push(`THIN_PYQ_CONFIRMED_TASKS:${pyqConfirmed.length}`);

  const versionSensitive = COM003_OFFICE_PRODUCTIVITY_DISCOVERY.filter((candidate) =>
    candidate.ambiguityRisks?.some((risk) => /version|platform|web app|Ribbon/i.test(risk)),
  ).map((candidate) => candidate.candidateId);
  if (versionSensitive.length < 5) issues.push(`MISSING_VERSION_SENSITIVITY_GUARDS:${versionSensitive.length}`);

  return {
    valid: issues.length === 0,
    candidateCount: COM003_OFFICE_PRODUCTIVITY_DISCOVERY.length,
    relationFamilyCount: relationFamilies.size,
    pyqConfirmedCandidateIds: pyqConfirmed,
    versionSensitiveCandidateIds: versionSensitive,
    permanentQlCount: 0,
    productionReady: false,
    issues,
  };
}

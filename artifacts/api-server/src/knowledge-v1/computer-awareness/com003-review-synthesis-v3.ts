import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { generateCom003ReviewQuestionV2 } from "./com003-review-synthesis-v2";
import type { Com003ReviewQuestion } from "./com003-review-types";

const QL_CONTEXT: Record<string, readonly string[]> = {
  "COM-003-QL-001": ["In Microsoft Office", "For Office productivity software", "Within a desktop Office suite"],
  "COM-003-QL-002": ["For Office file formats", "In Microsoft Office", "When identifying Office documents"],
  "COM-003-QL-003": ["For common Office commands", "In a desktop Office application", "When editing an Office file"],
  "COM-003-QL-004": ["In Microsoft Word", "When editing a Word document", "For Word text formatting"],
  "COM-003-QL-005": ["In Microsoft Word", "When checking a Word document", "For Word correction tools"],
  "COM-003-QL-006": ["In Microsoft Word", "For Word page layout", "When formatting document pages"],
  "COM-003-QL-007": ["In Microsoft Word", "For personalized document creation", "When preparing documents for many recipients"],
  "COM-003-QL-008": ["In Microsoft Excel", "Within an Excel worksheet", "For spreadsheet structure and references"],
  "COM-003-QL-009": ["In Microsoft Excel", "Within an Excel formula", "For spreadsheet calculations"],
  "COM-003-QL-010": ["In Microsoft Excel", "For basic Excel functions", "When calculating worksheet values"],
  "COM-003-QL-011": ["In Microsoft Excel", "When copying an Excel formula", "For Excel cell references"],
  "COM-003-QL-012": ["In Microsoft Excel", "When handling worksheet data", "For Excel data operations"],
  "COM-003-QL-013": ["In Microsoft Excel", "When changing worksheet structure", "For Excel rows and columns"],
  "COM-003-QL-014": ["In Microsoft Excel", "For a basic Excel chart", "When visualizing worksheet data"],
  "COM-003-QL-015": ["In Windows desktop Excel", "For Windows desktop Excel", "When using Windows desktop Excel"],
  "COM-003-QL-016": ["In Microsoft PowerPoint", "When creating a presentation", "For presentation structure"],
  "COM-003-QL-017": ["In Microsoft PowerPoint", "When adding content to a slide", "For PowerPoint insertable objects"],
  "COM-003-QL-018": ["In Microsoft PowerPoint", "For PowerPoint transitions and timing", "When controlling slide effects"],
  "COM-003-QL-019": ["In Windows desktop PowerPoint", "For Windows desktop PowerPoint", "When presenting with Windows desktop PowerPoint"],
};

const VERSION_CONTEXT_BY_QL: Record<string, readonly string[]> = {
  "COM-003-QL-003": ["In Windows desktop Office", "For a Windows desktop Office application", "When using Office on Windows desktop"],
  "COM-003-QL-004": ["In Windows desktop Word", "For Windows desktop Word", "When formatting text in Windows desktop Word"],
  "COM-003-QL-015": ["In Windows desktop Excel", "For Windows desktop Excel", "When using Windows desktop Excel"],
  "COM-003-QL-019": ["In Windows desktop PowerPoint", "For Windows desktop PowerPoint", "When presenting with Windows desktop PowerPoint"],
};

const QL008_DEFINITIONS: Record<string, string> = {
  Workbook: "an Excel file that can contain one or more worksheets",
  Worksheet: "one spreadsheet sheet contained within an Excel file",
  Row: "a horizontal series of cells in a worksheet",
  Column: "a vertical series of cells in a worksheet",
  Cell: "the box formed at the intersection of a row and a column",
};

function lowerFirst(value: string) {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;
}

function stripExistingWindowsLead(stem: string) {
  return stem
    .replace(/^In Windows desktop (?:Excel|Word|PowerPoint|Office|context),\s*/i, "")
    .replace(/^For (?:a )?Windows desktop (?:Excel|Word|PowerPoint|Office application),\s*/i, "")
    .replace(/^When (?:using|presenting with|formatting text in) Windows desktop (?:Excel|Word|PowerPoint|Office),\s*/i, "");
}

function contextualize(question: Com003ReviewQuestion, index: number) {
  const versionScopedSurface = question.versionScoped && /SHORTCUT|ACCESS|SLIDESHOW/i.test(question.surfaceMode);
  const contexts = versionScopedSurface
    ? VERSION_CONTEXT_BY_QL[question.qlId] ?? ["In Windows desktop context", "For a Windows desktop application", "When using the application on Windows desktop"]
    : QL_CONTEXT[question.qlId] ?? ["In this computer-awareness context"];
  const cycle = Math.floor(index / 6);
  const context = contexts[(index + cycle) % contexts.length]!;
  const bareStem = stripExistingWindowsLead(question.stem.trim());
  return `${context}, ${lowerFirst(bareStem)}`;
}

function curateQl004(question: Com003ReviewQuestion, index: number) {
  if (question.qlId !== "COM-003-QL-004" || question.surfaceMode !== "DOCUMENT_CONCEPT") return question;
  if (question.targetFactId !== "com003-word-word-processor") return question;
  const stems = [
    "Which Microsoft application is primarily used for word processing?",
    "Which Office application is designed mainly for creating and editing text documents?",
    "A word-processing application for creating and editing documents is which of the following?",
    "Which Microsoft Office program is associated with word-processing tasks?",
    "Which application would you use primarily to create and edit a text document?",
    "Which Office program belongs to the word-processing category?",
  ];
  return {
    ...question,
    stem: stems[index % stems.length]!,
    explanation: "Microsoft Word is a word-processing application used to create and edit text documents.",
  };
}

function curateQl007(question: Com003ReviewQuestion, index: number) {
  if (question.qlId !== "COM-003-QL-007" || question.surfaceMode !== "FEATURE_FROM_PURPOSE") return question;
  const stems = [
    "Which Word feature combines a main document with recipient data to create personalized output?",
    "Which feature is used to produce personalized copies from one main document and a recipient list?",
    "What is the Word process of combining a standard document with recipient-specific data called?",
    "Which Word feature can create personalized letters, labels, or similar documents from a data source?",
    "A main document is combined with recipient information by using which Word feature?",
    "Which feature generates individualized output by merging a document with a recipient data source?",
  ];
  return {
    ...question,
    stem: stems[index % stems.length]!,
    explanation: "Mail merge combines a main document with recipient or data-source information to create personalized output.",
  };
}

function curateQl008(question: Com003ReviewQuestion, index: number) {
  if (question.qlId !== "COM-003-QL-008") return question;
  if (question.surfaceMode === "STRUCTURE_TERM_FROM_DEFINITION") {
    const definition = QL008_DEFINITIONS[question.canonicalAnswer];
    if (!definition) return question;
    const stems = [
      `Which Excel structure term means ${definition}?`,
      `What Excel term describes ${definition}?`,
      `Which spreadsheet structure is ${definition}?`,
      `Identify the Excel structure defined as ${definition}.`,
      `Which Excel item is best described as ${definition}?`,
      `Select the spreadsheet term that refers to ${definition}.`,
    ];
    return { ...question, stem: stems[index % stems.length]! };
  }
  if (question.surfaceMode === "CELL_ADDRESS_INTERPRETATION") {
    const isRow = question.targetFactId === "com003-excel-address-row-part";
    const stems = isRow
      ? [
          "In the Excel cell reference B7, what does the number 7 represent?",
          "What does 7 identify in the Excel reference B7?",
          "In B7, which part of the cell address is indicated by 7?",
          "The number 7 in Excel reference B7 identifies which coordinate?",
          "Which cell-address component does 7 represent in B7?",
          "In an A1-style reference such as B7, what is indicated by 7?",
        ]
      : [
          "In the Excel cell reference B7, what does the letter B represent?",
          "What does B identify in the Excel reference B7?",
          "In B7, which part of the cell address is indicated by B?",
          "The letter B in Excel reference B7 identifies which coordinate?",
          "Which cell-address component does B represent in B7?",
          "In an A1-style reference such as B7, what is indicated by B?",
        ];
    return {
      ...question,
      stem: stems[index % stems.length]!,
      explanation: isRow
        ? "In B7, 7 identifies the row number, while B identifies the column label."
        : "In B7, B identifies the column label, while 7 identifies the row number.",
    };
  }
  return question;
}

function curateQl016(question: Com003ReviewQuestion, index: number) {
  if (question.qlId !== "COM-003-QL-016" || question.surfaceMode !== "PRESENTATION_CONCEPT") return question;
  const isSlide = question.canonicalAnswer === "Slide";
  const stems = isSlide
    ? [
        "What is an individual page or screen within a PowerPoint presentation called?",
        "Which term names one page-like unit of a PowerPoint presentation?",
        "A single page or screen in a presentation is called what?",
        "Which presentation term refers to one individual page or screen?",
        "What is the basic page-like unit used to build a PowerPoint presentation?",
        "Which term identifies one screen within a slide-based presentation?",
      ]
    : [
        "Which term refers to a sequence or collection of slides used to present information?",
        "What is a collection of slides arranged to present information called?",
        "Which PowerPoint artifact consists of multiple slides organized for presenting information?",
        "A sequence of slides prepared to communicate information is called what?",
        "Which term describes the complete slide-based file used to present information?",
        "What do we call the overall collection of slides prepared for a presentation?",
      ];
  return {
    ...question,
    stem: stems[index % stems.length]!,
    explanation: isSlide
      ? "A slide is an individual page or screen within a PowerPoint presentation."
      : "A PowerPoint presentation is the overall sequence or collection of slides used to present information.",
  };
}

function curateEditorialSurface(question: Com003ReviewQuestion, index: number) {
  return curateQl016(curateQl008(curateQl007(curateQl004(question, index), index), index), index);
}

function isCuratedWithoutContext(question: Com003ReviewQuestion) {
  return (
    (question.qlId === "COM-003-QL-004" && question.surfaceMode === "DOCUMENT_CONCEPT" && question.targetFactId === "com003-word-word-processor") ||
    (question.qlId === "COM-003-QL-007" && question.surfaceMode === "FEATURE_FROM_PURPOSE") ||
    (question.qlId === "COM-003-QL-008" && ["STRUCTURE_TERM_FROM_DEFINITION", "CELL_ADDRESS_INTERPRETATION"].includes(question.surfaceMode)) ||
    (question.qlId === "COM-003-QL-016" && question.surfaceMode === "PRESENTATION_CONCEPT")
  );
}

export function generateCom003ReviewQuestionV3(qlId: string, seed: string, index = 0) {
  const base = generateCom003ReviewQuestionV2(qlId, seed, index);
  const curated = curateEditorialSurface(base, index);
  const stem = isCuratedWithoutContext(curated) ? curated.stem : contextualize(curated, index);
  return {
    ...curated,
    questionId: curated.questionId.replace("COM003-REVIEW-V2-", "COM003-REVIEW-V3-").replace("COM003-REVIEW-", "COM003-REVIEW-V3-"),
    stem,
  };
}

export function buildCom003EnglishReviewCorpusV3(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v3";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 50) throw new Error("perQl must be between 1 and 50");
  return COM003_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: perQl }, (_, index) =>
      generateCom003ReviewQuestionV3(ql.qlId, `${seedPrefix}:${ql.qlId}:${index}`, index),
    ),
  );
}

export const COM003_ENGLISH_REVIEW_CORPUS_V3 = buildCom003EnglishReviewCorpusV3();

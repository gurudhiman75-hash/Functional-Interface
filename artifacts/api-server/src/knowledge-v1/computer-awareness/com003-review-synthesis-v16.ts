import { COM003_EDITORIALLY_APPROVED_FACTS } from "./com003-editorial-fact-review";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { expectedCom003V15Answer, type Com003ReviewQuestionV15 } from "./com003-review-synthesis-v15";
import {
  COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL,
  auditCom003V15Final,
} from "./com003-review-synthesis-v15-finalize";

export type Com003ReviewQuestionV16 = Omit<Com003ReviewQuestionV15, "stemAuthority"> & {
  stemAuthority: "COM003_V16_EDITORIAL_EXAM_REALNESS_AUTHORITY";
  editorialAuthority: "COM003_V16_HUMAN_ARTIFACT_REMEDIATION";
};

const factById = new Map(COM003_EDITORIALLY_APPROVED_FACTS.map((fact) => [fact.factId, fact]));

function compact(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/[.]+$/, "");
}

function lowerFirst(value: string) {
  const normalized = compact(value);
  return normalized ? `${normalized.charAt(0).toLowerCase()}${normalized.slice(1)}` : normalized;
}

function factParts(question: Com003ReviewQuestionV15) {
  const fact = factById.get(question.targetFactId);
  if (!fact || fact.value.kind !== "text") throw new Error(`COM003 V16 missing governed text fact ${question.targetFactId}`);
  return {
    entity: compact(fact.entity.label.en),
    text: compact(fact.value.text.en),
  };
}

function familyPick(
  question: Com003ReviewQuestionV15,
  ordinal: number,
  values: Record<Com003ReviewQuestionV15["examSurfaceFamily"], readonly string[]>,
) {
  const options = values[question.examSurfaceFamily];
  return options[ordinal % options.length]!;
}

function specialStem(question: Com003ReviewQuestionV15, ordinal: number): string | null {
  switch (question.targetFactId) {
    case "com003-word-footer-role":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which Word page element is associated with the bottom margin area of a document page?"],
        FUNCTIONAL_APPLICATION: ["A document needs content placed in the bottom margin area of each page. Which Word page element should be used?"],
        EXAMPLE_RECOGNITION: ["Content placed in the bottom margin area of a Word page is an example of which page element?"],
        CONTRAST_DISCRIMINATION: ["Which page element belongs at the bottom of a Word page rather than at the top?"],
      });
    case "com003-word-header-role":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which Word page element is associated with the top margin area of a document page?"],
        FUNCTIONAL_APPLICATION: ["A document needs content placed in the top margin area of each page. Which Word page element should be used?"],
        EXAMPLE_RECOGNITION: ["Content placed in the top margin area of a Word page is an example of which page element?"],
        CONTRAST_DISCRIMINATION: ["Which page element belongs at the top of a Word page rather than at the bottom?"],
      });
    case "com003-excel-address-row-part":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["In the Excel cell reference B7, what does the number 7 represent?"],
        FUNCTIONAL_APPLICATION: ["While reading the Excel reference B7, which coordinate is identified by the number 7?"],
        EXAMPLE_RECOGNITION: ["In B7, the number 7 is an example of which part of a cell address?"],
        CONTRAST_DISCRIMINATION: ["In the reference B7, which part identifies the row: B or 7?"],
      });
    case "com003-excel-address-column-part":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["In the Excel cell reference B7, what does the letter B represent?"],
        FUNCTIONAL_APPLICATION: ["While reading the Excel reference B7, which coordinate is identified by the letter B?"],
        EXAMPLE_RECOGNITION: ["In B7, the letter B is an example of which part of a cell address?"],
        CONTRAST_DISCRIMINATION: ["In the reference B7, which part identifies the column: B or 7?"],
      });
    case "com003-excel-relative-reference":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which type of Excel cell reference changes according to the new location when a formula is copied?"],
        FUNCTIONAL_APPLICATION: ["A copied Excel formula should adjust its cell reference to the new location. Which reference type should be used?"],
        EXAMPLE_RECOGNITION: ["A cell reference that changes when a formula is copied is an example of which reference type?"],
        CONTRAST_DISCRIMINATION: ["Which Excel reference type changes when copied, unlike an absolute reference?"],
      });
    case "com003-excel-absolute-reference":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which type of Excel cell reference remains fixed when a formula is copied?"],
        FUNCTIONAL_APPLICATION: ["A copied Excel formula must keep a cell reference fixed. Which reference type should be used?"],
        EXAMPLE_RECOGNITION: ["A cell reference that remains unchanged when a formula is copied is an example of which reference type?"],
        CONTRAST_DISCRIMINATION: ["Which Excel reference type stays fixed when copied, unlike a relative reference?"],
      });
    case "com003-excel-absolute-reference-notation":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which Excel notation represents a fully absolute cell reference?"],
        FUNCTIONAL_APPLICATION: ["A formula must lock both the column and row of cell A1. Which notation should be used?"],
        EXAMPLE_RECOGNITION: ["Which of the following is an example of a fully absolute cell reference in Excel?"],
        CONTRAST_DISCRIMINATION: ["Which notation locks both the column and row rather than only one or neither?"],
      });
    case "com003-excel-line-chart":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which Excel chart is commonly used to show trends over time or other ordered intervals?"],
        FUNCTIONAL_APPLICATION: ["Monthly values need to be plotted to show how they change over time. Which Excel chart is commonly used?"],
        EXAMPLE_RECOGNITION: ["A chart showing a trend across successive time periods is typically an example of which chart type?"],
        CONTRAST_DISCRIMINATION: ["Which chart type is commonly chosen for a trend over time rather than for parts of a whole?"],
      });
    case "com003-excel-bar-chart":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which Excel chart is commonly used to compare values across categories or individual items?"],
        FUNCTIONAL_APPLICATION: ["A worksheet needs to compare values for several product categories. Which Excel chart is commonly used?"],
        EXAMPLE_RECOGNITION: ["A chart comparing values across separate categories is typically an example of which chart type?"],
        CONTRAST_DISCRIMINATION: ["Which chart type is commonly used for category comparison rather than for showing parts of a whole?"],
      });
    case "com003-excel-pie-chart":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which Excel chart is commonly used to show how a single data series is divided into parts of a whole?"],
        FUNCTIONAL_APPLICATION: ["A worksheet needs to show each category's share of one total. Which Excel chart is commonly used?"],
        EXAMPLE_RECOGNITION: ["A chart showing the percentage share of categories in one total is typically an example of which chart type?"],
        CONTRAST_DISCRIMINATION: ["Which chart type is commonly used for parts of a whole rather than for showing a trend over time?"],
      });
    case "com003-powerpoint-animation-definition":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which PowerPoint effect is applied to text or other objects on a slide?"],
        FUNCTIONAL_APPLICATION: ["A presenter wants an effect to apply to an object on a slide. Which PowerPoint feature should be used?"],
        EXAMPLE_RECOGNITION: ["An effect applied to text or an object within a slide is an example of which PowerPoint feature?"],
        CONTRAST_DISCRIMINATION: ["Which PowerPoint effect applies to objects on a slide rather than to the change between slides?"],
      });
    case "com003-powerpoint-transition-definition":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which PowerPoint effect is used when moving from one slide to the next?"],
        FUNCTIONAL_APPLICATION: ["A presenter wants an effect to occur as one slide changes to the next. Which PowerPoint feature should be used?"],
        EXAMPLE_RECOGNITION: ["An effect seen during the change from one slide to another is an example of which PowerPoint feature?"],
        CONTRAST_DISCRIMINATION: ["Which PowerPoint effect applies between slides rather than to objects within a slide?"],
      });
    case "com003-powerpoint-transition-duration":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which PowerPoint timing setting controls how long a slide transition effect takes to complete?"],
        FUNCTIONAL_APPLICATION: ["A presenter wants a slide transition to complete more quickly. Which timing setting should be reduced?"],
        EXAMPLE_RECOGNITION: ["The time taken by a transition effect to complete is controlled by which PowerPoint setting?"],
        CONTRAST_DISCRIMINATION: ["Which setting controls the speed of the transition effect itself, not how long the slide remains on screen?"],
      });
    case "com003-powerpoint-auto-advance-time":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which PowerPoint timing setting specifies when a slide advances automatically to the next slide?"],
        FUNCTIONAL_APPLICATION: ["A slide should move to the next slide automatically after a set time. Which PowerPoint timing setting is used?"],
        EXAMPLE_RECOGNITION: ["Setting a slide to advance automatically after a specified interval is an example of which timing control?"],
        CONTRAST_DISCRIMINATION: ["Which timing control determines when the next slide appears automatically, rather than how long the transition effect lasts?"],
      });
    case "com003-powerpoint-shortcut-f5":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: [
          "In Windows desktop PowerPoint, which key starts the slide show from the beginning?",
          "Which Windows desktop PowerPoint shortcut starts a slide show from the first slide?",
          "What key is used to begin a PowerPoint slide show from the first slide on Windows desktop?",
        ],
        FUNCTIONAL_APPLICATION: [
          "A presenter wants to start the slide show from the first slide in Windows desktop PowerPoint. Which key should be pressed?",
          "Which key should be used to run the presentation from the beginning in Windows desktop PowerPoint?",
          "To start a PowerPoint slide show from slide 1 on Windows desktop, which key is used?",
        ],
        EXAMPLE_RECOGNITION: [
          "Which shortcut-action pair is correct for starting a Windows desktop PowerPoint slide show from the beginning?",
          "Starting a PowerPoint slide show from the first slide is an example of the action performed by which key?",
          "Which key correctly matches the action 'start the slide show from the beginning' in Windows desktop PowerPoint?",
        ],
        CONTRAST_DISCRIMINATION: [
          "Which key starts the slide show from the beginning rather than from the current slide in Windows desktop PowerPoint?",
          "To start from the first slide, which should be used in Windows desktop PowerPoint: F5 or Shift+F5?",
          "Which PowerPoint shortcut is used for the beginning of the slide show, not the current slide?",
        ],
      });
    case "com003-powerpoint-shortcut-shift-f5":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: [
          "In Windows desktop PowerPoint, which shortcut starts the slide show from the current slide?",
          "Which Windows desktop PowerPoint shortcut begins the slide show at the currently selected slide?",
          "What shortcut is used to start a PowerPoint slide show from the current slide on Windows desktop?",
        ],
        FUNCTIONAL_APPLICATION: [
          "A presenter wants to start the slide show from the current slide in Windows desktop PowerPoint. Which shortcut should be used?",
          "Which shortcut should be used to present from the currently selected slide in Windows desktop PowerPoint?",
          "To begin a PowerPoint slide show at the current slide on Windows desktop, which shortcut is used?",
        ],
        EXAMPLE_RECOGNITION: [
          "Which shortcut-action pair is correct for starting a Windows desktop PowerPoint slide show from the current slide?",
          "Starting a PowerPoint slide show at the current slide is an example of the action performed by which shortcut?",
          "Which shortcut correctly matches the action 'start the slide show from the current slide' in Windows desktop PowerPoint?",
        ],
        CONTRAST_DISCRIMINATION: [
          "Which shortcut starts the slide show from the current slide rather than from the beginning in Windows desktop PowerPoint?",
          "To start from the current slide, which should be used in Windows desktop PowerPoint: F5 or Shift+F5?",
          "Which PowerPoint shortcut is used for the current slide, not the beginning of the presentation?",
        ],
      });
    case "com003-powerpoint-picture-object":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which PowerPoint object can be inserted to add an image to a slide?"],
        FUNCTIONAL_APPLICATION: ["A slide needs a photograph or other image. Which PowerPoint object should be inserted?"],
        EXAMPLE_RECOGNITION: ["A photograph inserted on a PowerPoint slide is an example of which object type?"],
        CONTRAST_DISCRIMINATION: ["Which PowerPoint object is used for an image rather than for tabular or charted data?"],
      });
    case "com003-powerpoint-chart-object":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which PowerPoint object can be inserted on a slide to display data graphically?"],
        FUNCTIONAL_APPLICATION: ["A slide needs a graphical display of numerical data. Which PowerPoint object should be inserted?"],
        EXAMPLE_RECOGNITION: ["A graphical display of data inserted on a slide is an example of which PowerPoint object?"],
        CONTRAST_DISCRIMINATION: ["Which PowerPoint object is used to visualize data graphically rather than arrange it in rows and columns?"],
      });
    case "com003-powerpoint-table-object":
      return familyPick(question, ordinal, {
        DIRECT_RECALL: ["Which PowerPoint object can be inserted to organize data in rows and columns?"],
        FUNCTIONAL_APPLICATION: ["A slide needs information arranged in rows and columns. Which PowerPoint object should be inserted?"],
        EXAMPLE_RECOGNITION: ["Information arranged in rows and columns on a slide is an example of which PowerPoint object?"],
        CONTRAST_DISCRIMINATION: ["Which PowerPoint object organizes data in rows and columns rather than displaying it as a chart?"],
      });
    default:
      return null;
  }
}

function normalizeStem(question: Com003ReviewQuestionV15, input: string) {
  let stem = compact(input).replace(/\?+$/, "");
  stem = stem
    .replace(/^In Microsoft (Word|Excel|PowerPoint),\s+in Microsoft \1 \(Windows desktop\),\s*/i, (_match, app: string) => `In Microsoft ${app} (Windows desktop), `)
    .replace(/^In Microsoft (Word|Excel|PowerPoint),\s+in Microsoft \1,\s*/i, (_match, app: string) => `In Microsoft ${app}, `)
    .replace(/^In Microsoft Excel,\s+in Excel,\s*/i, "In Microsoft Excel, ")
    .replace(/\bpowerPoint\b/g, "PowerPoint")
    .replace(/\bmicrosoft (word|excel|powerpoint)\b/gi, (_match, app: string) => `Microsoft ${app.charAt(0).toUpperCase()}${app.slice(1).toLowerCase()}`)
    .replace(/\bword 97-2003\b/g, "Word 97-2003")
    .replace(/\bmodern Word document\b/g, "a modern Word document")
    .replace(/\bfor a a modern Word document\b/g, "for a modern Word document")
    .replace(/\bfor PowerPoint 97-2003 presentation\b/g, "for a PowerPoint 97-2003 presentation")
    .replace(/\bWhat Microsoft Office application\b/g, "Which Microsoft Office application")
    .replace(/\bWhat Excel chart\b/g, "Which Excel chart")
    .replace(/\bWhat PowerPoint object\b/g, "Which PowerPoint object")
    .replace(/\bwhat PowerPoint object\b/g, "what object")
    .replace(/\bwhat Excel function\b/g, "which Excel function")
    .replace(/\bWhat is the shortcut for paste clipboard content\b/i, "Which shortcut is used to paste clipboard content")
    .replace(/\bHow is continuous cell range\b/i, "How is the continuous cell range")
    .replace(/\bwhat does The 7 in cell reference B7 represent\b/i, "what does the number 7 in cell reference B7 represent")
    .replace(/\bWhat does the 7 in cell reference B7 represent\b/i, "What does the number 7 in cell reference B7 represent")
    .replace(/\bWhich Word page element page-margin content associated with the bottom area of a document page\b/i, "Which Word page element is associated with the bottom margin area of a document page")
    .replace(/\bWhich object can be inserted in PowerPoint for this purpose: can be inserted as visual content on a slide\b/i, "Which PowerPoint object can be inserted to add an image to a slide")
    .replace(/\bWhat is the Windows desktop PowerPoint shortcut for start the slide show\b/i, "What is the Windows desktop PowerPoint shortcut to start the slide show")
    .replace(/\bIn Microsoft PowerPoint, what PowerPoint object\b/i, "In Microsoft PowerPoint, what object")
    .replace(/\bIn Microsoft Excel, what Excel chart\b/i, "In Microsoft Excel, which chart");

  if (question.qlId === "COM-003-QL-011" && question.targetFactId === "com003-excel-relative-reference") {
    stem = stem.replace(/^In Excel, adjusts relative to the new location when a formula is copied or filled describes which reference type$/i, "Which type of Excel reference adjusts to the new location when a formula is copied or filled");
  }

  return `${stem.replace(/[.]+$/, "")}?`;
}

const BASE_VERB: Record<string, string> = {
  reverses: "reverse",
  searches: "search",
  performs: "perform",
  illustrates: "illustrate",
  shows: "show",
  inserts: "insert",
  copies: "copy",
  cuts: "cut",
  saves: "save",
  opens: "open",
  finds: "find",
  locates: "locate",
  replaces: "replace",
  starts: "start",
};

function normalizeExplanation(input: string) {
  let explanation = compact(input);
  explanation = explanation
    .replace(/\s+(?:Therefore|Hence|Accordingly),.*$/i, "")
    .replace(/\s+So [^.]+\.$/i, "")
    .replace(/\s+This makes [^.]+\.$/i, "")
    .replace(/\s+For this question, [^.]+\.$/i, "")
    .replace(/\bis used to (reverses|searches|performs|illustrates|shows|inserts|copies|cuts|saves|opens|finds|locates|replaces|starts)\b/gi, (_match, verb: string) => `is used to ${BASE_VERB[verb.toLowerCase()] ?? verb}`)
    .replace(/^Print is used to open or perform the document printing workflow$/i, "Print opens the document printing workflow")
    .replace(/^Ctrl\+P open the print workflow$/i, "In Windows desktop Office applications, Ctrl+P opens the print workflow")
    .replace(/^Ctrl\+S save the current document$/i, "In Windows desktop Office applications, Ctrl+S saves the current document")
    .replace(/^Word document a word-processing document/i, "A Word document is a word-processing document")
    .replace(/^Placeholder a container/i, "A placeholder is a container")
    .replace(/^Transition duration is controls/i, "Transition duration controls")
    .replace(/^Automatic slide advance timing is specifies/i, "Automatic slide advance timing specifies");
  return `${explanation.replace(/[.]+$/, "")}.`;
}

function specialExplanation(question: Com003ReviewQuestionV15): string | null {
  switch (question.targetFactId) {
    case "com003-word-purpose":
      return "Microsoft Word is a word-processing application used to create, edit and format text documents.";
    case "com003-excel-purpose":
      return "Microsoft Excel is a spreadsheet application used to organize data and perform calculations.";
    case "com003-powerpoint-purpose":
      return "Microsoft PowerPoint is used to create slide-based presentations.";
    case "com003-command-undo":
      return "Undo reverses the most recent supported editing action.";
    case "com003-command-find":
      return "Find searches the current file for specified content without changing it.";
    case "com003-command-print":
      return "Print opens the document printing workflow.";
    case "com003-shortcut-ctrl-p":
      return "In Windows desktop Office applications, Ctrl+P opens the print workflow.";
    case "com003-shortcut-ctrl-s":
      return "In Windows desktop Office applications, Ctrl+S saves the current document.";
    case "com003-word-find-purpose":
      return "Find locates matching text without changing it. Replace is the feature used when the located text also needs to be substituted.";
    case "com003-word-replace-purpose":
      return "Replace locates specified text and substitutes replacement text; Find alone only locates the text.";
    case "com003-word-header-role":
      return "A header contains content associated with the top margin area of a document page.";
    case "com003-word-footer-role":
      return "A footer contains content associated with the bottom margin area of a document page.";
    case "com003-excel-address-row-part":
      return "In the reference B7, the number 7 identifies the row, while B identifies the column.";
    case "com003-excel-address-column-part":
      return "In the reference B7, the letter B identifies the column, while 7 identifies the row.";
    case "com003-excel-relative-reference":
      return "A relative cell reference changes according to the new location when a formula is copied or filled.";
    case "com003-excel-absolute-reference":
      return "An absolute cell reference remains fixed when a formula is copied or filled.";
    case "com003-excel-absolute-reference-notation":
      return "$A$1 is fully absolute because the dollar signs lock both the column and the row.";
    case "com003-excel-line-chart":
      return "A line chart is commonly used to show trends over time or other ordered intervals.";
    case "com003-excel-bar-chart":
      return "A bar chart is commonly used to compare values across categories or individual items.";
    case "com003-excel-pie-chart":
      return "A pie chart is commonly used to show how one data series is divided into parts of a whole.";
    case "com003-powerpoint-picture-object":
      return "A Picture object adds image content to a PowerPoint slide.";
    case "com003-powerpoint-chart-object":
      return "A Chart object displays data graphically on a PowerPoint slide.";
    case "com003-powerpoint-table-object":
      return "A Table object arranges information in rows and columns on a PowerPoint slide.";
    case "com003-powerpoint-animation-definition":
      return "Animation applies an effect to text or other objects on a slide. It is different from a transition, which occurs between slides.";
    case "com003-powerpoint-transition-definition":
      return "A slide transition is the effect used when moving from one slide to the next. Animation, by contrast, applies to objects within a slide.";
    case "com003-powerpoint-transition-duration":
      return "Transition duration controls how long the transition effect itself takes to complete; it does not set how long the slide remains on screen.";
    case "com003-powerpoint-auto-advance-time":
      return "Automatic slide advance timing determines when PowerPoint moves to the next slide automatically; it is separate from transition duration.";
    case "com003-powerpoint-shortcut-f5":
      return "In Windows desktop PowerPoint, F5 starts the slide show from the beginning. Shift+F5 starts it from the current slide.";
    case "com003-powerpoint-shortcut-shift-f5":
      return "In Windows desktop PowerPoint, Shift+F5 starts the slide show from the current slide. F5 starts it from the beginning.";
    default:
      return null;
  }
}

function buildV16(corpus: readonly Com003ReviewQuestionV15[]) {
  const ordinalByKey = new Map<string, number>();
  const seenByQl = new Map<string, Set<string>>();

  return corpus.map((question, index): Com003ReviewQuestionV16 => {
    const key = `${question.targetFactId}:${question.examSurfaceFamily}`;
    const ordinal = ordinalByKey.get(key) ?? 0;
    ordinalByKey.set(key, ordinal + 1);

    let stem = specialStem(question, ordinal) ?? normalizeStem(question, question.stem);
    const seen = seenByQl.get(question.qlId) ?? new Set<string>();
    if (seen.has(stem.toLowerCase())) {
      const { entity, text } = factParts(question);
      const expected = compact(expectedCom003V15Answer(question));
      if (expected.toLowerCase() === entity.toLowerCase()) {
        stem = `Which ${question.qlId.startsWith("COM-003") ? "option" : "term"} correctly matches this description: ${lowerFirst(text)}?`;
      } else {
        stem = `Which description correctly matches ${entity}?`;
      }
    }
    if (seen.has(stem.toLowerCase())) stem = `In this ${question.examSurfaceFamily.toLowerCase().replaceAll("_", " ")} question, ${lowerFirst(stem)}`;
    if (seen.has(stem.toLowerCase())) throw new Error(`COM003 V16 duplicate stem could not be resolved ${question.questionId}`);
    seen.add(stem.toLowerCase());
    seenByQl.set(question.qlId, seen);

    const explanation = specialExplanation(question) ?? normalizeExplanation(question.explanation);

    return {
      ...question,
      questionId: `${question.questionId.replace("COM003-REVIEW-V15-", "COM003-REVIEW-V16-")}-E${index + 1}`,
      stem,
      explanation,
      stemAuthority: "COM003_V16_EDITORIAL_EXAM_REALNESS_AUTHORITY",
      editorialAuthority: "COM003_V16_HUMAN_ARTIFACT_REMEDIATION",
    };
  });
}

export const COM003_ENGLISH_REVIEW_CORPUS_V16 = buildV16(COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL);

export function auditCom003V16() {
  const issues: string[] = [];
  const v15Audit = auditCom003V15Final();
  if (!v15Audit.valid) issues.push(...v15Audit.issues.map((issue) => `V15_BASE:${issue}`));
  if (COM003_ENGLISH_REVIEW_CORPUS_V16.length !== COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.length) issues.push("CORPUS_COUNT_DRIFT");

  for (let index = 0; index < COM003_ENGLISH_REVIEW_CORPUS_V16.length; index += 1) {
    const before = COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL[index]!;
    const after = COM003_ENGLISH_REVIEW_CORPUS_V16[index]!;
    for (const field of ["qlId", "cpId", "surfaceMode", "targetFactId", "correctIndex", "canonicalAnswer", "examSurfaceFamily"] as const) {
      if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) issues.push(`STRUCTURAL_DRIFT:${field}:${before.questionId}`);
    }
    for (const field of ["options", "sourceIds", "sourceFactIds"] as const) {
      if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) issues.push(`PROVENANCE_OR_OPTION_DRIFT:${field}:${before.questionId}`);
    }
    if (compact(expectedCom003V15Answer(after)).toLowerCase() !== compact(after.canonicalAnswer).toLowerCase()) issues.push(`SEMANTIC_ANSWER:${after.questionId}`);
    if (after.options[after.correctIndex] !== after.canonicalAnswer) issues.push(`ANSWER_POSITION:${after.questionId}`);
    if (!after.explanation.trim()) issues.push(`EMPTY_EXPLANATION:${after.questionId}`);
  }

  for (const ql of COM003_PERMANENT_QLS) {
    const questions = COM003_ENGLISH_REVIEW_CORPUS_V16.filter((question) => question.qlId === ql.qlId);
    if (questions.length !== 12) issues.push(`QL_COUNT:${ql.qlId}:${questions.length}`);
    if (new Set(questions.map((question) => question.stem.toLowerCase())).size !== 12) issues.push(`DUPLICATE_STEM:${ql.qlId}`);
    for (const family of ["DIRECT_RECALL", "FUNCTIONAL_APPLICATION", "EXAMPLE_RECOGNITION", "CONTRAST_DISCRIMINATION"] as const) {
      if (questions.filter((question) => question.examSurfaceFamily === family).length !== 3) issues.push(`FAMILY_BALANCE:${ql.qlId}:${family}`);
    }
  }

  const stemCorpus = COM003_ENGLISH_REVIEW_CORPUS_V16.map((question) => question.stem).join("\n");
  const explanationCorpus = COM003_ENGLISH_REVIEW_CORPUS_V16.map((question) => question.explanation).join("\n");
  const bannedStemPatterns: readonly [string, RegExp][] = [
    ["DOUBLE_APP_CONTEXT", /In Microsoft (Word|Excel|PowerPoint),\s+in (?:Microsoft )?\1/i],
    ["LOWERCASE_MICROSOFT_APP", /\bmicrosoft (word|excel|powerpoint)\b/],
    ["BROKEN_FOR_3SG", /\bFor (?:illustrates|shows|starts|returns|counts|calculates)\b/i],
    ["BROKEN_TO_3SG", /\bto (?:shows|illustrates|starts|returns|counts|calculates|searches|reverses)\b/i],
    ["BROKEN_SHORTCUT_FOR_START", /shortcut for start the slide show/i],
    ["ARTICLE_CAPITALIZATION", /what does The \d/i],
    ["GENERIC_EXAMPLE_FILLER", /option is the correct example for this description|choice correctly illustrates the Microsoft/i],
  ];
  for (const [code, pattern] of bannedStemPatterns) if (pattern.test(stemCorpus)) issues.push(code);

  const bannedExplanationPatterns: readonly [string, RegExp][] = [
    ["EXPLANATION_TO_3SG", /\bis used to (?:reverses|searches|illustrates|shows|starts)\b/i],
    ["EXPLANATION_IS_3SG", /\bis (?:controls|specifies)\b/i],
    ["GENERIC_CORRECT_TAIL", /Therefore, .* is correct|Hence, select|Accordingly, .* identified by the stated condition/i],
  ];
  for (const [code, pattern] of bannedExplanationPatterns) if (pattern.test(explanationCorpus)) issues.push(code);

  return {
    valid: issues.length === 0,
    questions: COM003_ENGLISH_REVIEW_CORPUS_V16.length,
    qls: COM003_PERMANENT_QLS.length,
    structureAuthority: "V15_SEMANTIC_BASE_UNCHANGED",
    editorialAuthority: "COM003_V16_HUMAN_ARTIFACT_REMEDIATION",
    governance: "REVIEW_ONLY" as const,
    issues,
  };
}

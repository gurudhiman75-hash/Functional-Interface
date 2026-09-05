import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import {
  COM003_ENGLISH_REVIEW_CORPUS_V16,
  auditCom003V16,
  type Com003ReviewQuestionV16,
} from "./com003-review-synthesis-v16";
import { expectedCom003V15Answer } from "./com003-review-synthesis-v15";

export type Com003ReviewQuestionV161 = Omit<Com003ReviewQuestionV16, "stemAuthority" | "editorialAuthority"> & {
  stemAuthority: "COM003_V16_1_HUMAN_ARTIFACT_POLISH_AUTHORITY";
  editorialAuthority: "COM003_V16_1_EXAM_REALNESS_POLISH";
};

function clean(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function familyVariant(
  q: Com003ReviewQuestionV16,
  ordinal: number,
  variants: Record<Com003ReviewQuestionV16["examSurfaceFamily"], readonly string[]>,
) {
  const values = variants[q.examSurfaceFamily];
  return values[ordinal % values.length]!;
}

function curatedStem(q: Com003ReviewQuestionV16, ordinal: number): string | null {
  switch (q.targetFactId) {
    case "com003-powerpoint-purpose":
      return /which term|description/i.test(q.stem) ? "Which Microsoft Office application is used to create slide-based presentations?" : null;
    case "com003-word-document-artifact":
      return /which Microsoft Word term/i.test(q.stem) ? "Which term refers to a word-processing document created in Microsoft Word?" : null;
    case "com003-word-edit-cut":
      return /matches this function:/i.test(q.stem) ? "Which Word command removes selected text and places it on the Clipboard so it can be moved or pasted elsewhere?" : null;
    case "com003-word-edit-paste":
      return /used for this purpose:/i.test(q.stem) ? "Which Word command inserts the current Clipboard contents at the insertion point?" : null;
    case "com003-word-spelling-check":
      return /used for this purpose:/i.test(q.stem) ? "Which Word feature identifies possible spelling errors for review?" : null;
    case "com003-word-mail-merge-main-document":
      return /matches this role:/i.test(q.stem) ? "In Mail Merge, which component contains the common text and layout shared by the merged documents?" : null;
    case "com003-word-mail-merge-merge-field":
      return /has this function:/i.test(q.stem) ? "In Mail Merge, which component marks where values from the data source are inserted into the main document?" : null;
    case "com003-word-mail-merge-recipient-record":
      return /which term|description/i.test(q.stem) ? "In Mail Merge, what is one complete set of field values for a single recipient called?" : null;
    case "com003-excel-structure-cell":
      return /matches this definition:/i.test(q.stem) ? "In Excel, what is the intersection of a row and a column called?" : null;
    case "com003-excel-function-average":
      return /matches this purpose:/i.test(q.stem) ? "Which Excel function returns the arithmetic mean of numeric values?" : null;
    case "com003-excel-absolute-reference-notation":
      return /which term|description/i.test(q.stem) ? "Which Excel reference has both its column and row fixed?" : null;
    case "com003-excel-sort-ascending":
      return /matches this effect:/i.test(q.stem) ? "Which Excel sort order arranges values from lower to higher or A to Z, depending on the data type?" : null;
    case "com003-excel-sort-descending":
      return /has this function:/i.test(q.stem) ? "Which Excel sort order arranges values from higher to lower or Z to A, depending on the data type?" : null;
    case "com003-excel-row-column-insert-row":
      return /matches this effect:/i.test(q.stem) ? "Which worksheet operation adds a new row and shifts the existing worksheet structure as required?" : null;
    case "com003-excel-row-column-row-height":
      return /has this function:/i.test(q.stem) ? "Which Excel setting controls the vertical size of a worksheet row?" : null;
    case "com003-excel-pie-chart":
      return familyVariant(q, ordinal, {
        DIRECT_RECALL: [
          "Which Excel chart is commonly used to show how one data series is divided into parts of a whole?",
          "Which Excel chart is commonly used to show each category as a share of one total?",
          "Which chart type is generally used to display parts of a single whole in Excel?",
        ],
        FUNCTIONAL_APPLICATION: [
          "A worksheet needs to show each category's share of one total. Which Excel chart is commonly used?",
          "A report must show how several categories make up a single total. Which Excel chart should be used?",
          "Which Excel chart is suitable when values need to be shown as shares of one whole?",
        ],
        EXAMPLE_RECOGNITION: [
          "A chart shows each category as a share of one total. Which chart type does this describe?",
          "If a chart presents values as parts of one whole, which Excel chart type is being used?",
          "A chart is used to display how one data series is divided among categories. Which chart type is it?",
        ],
        CONTRAST_DISCRIMINATION: [
          "Which chart type is used for parts of a whole rather than for showing a trend over time?",
          "Which Excel chart emphasizes each category's share of a total rather than comparison across separate items?",
          "For showing parts of one total, which chart is preferred over a line chart in this basic context?",
        ],
      });
    case "com003-excel-bar-chart":
      return familyVariant(q, ordinal, {
        DIRECT_RECALL: [
          "Which Excel chart is commonly used to compare values across categories or individual items?",
          "Which Excel chart is commonly used for comparing separate categories?",
          "Which chart type is typically used to compare individual items in Excel?",
        ],
        FUNCTIONAL_APPLICATION: [
          "A worksheet needs to compare values for several product categories. Which Excel chart is commonly used?",
          "Several categories need to be compared against one another. Which Excel chart should be used?",
          "Which Excel chart is suitable for comparing values across separate items?",
        ],
        EXAMPLE_RECOGNITION: [
          "A chart compares values across several separate categories. Which chart type does this describe?",
          "If a chart is used to compare individual items, which Excel chart type is being used?",
          "A chart displays category-to-category differences in values. Which chart type is it?",
        ],
        CONTRAST_DISCRIMINATION: [
          "Which chart type is commonly used for category comparison rather than for showing parts of a whole?",
          "Which Excel chart is used to compare separate items rather than show each item's share of one total?",
          "For comparing individual categories, which chart is more appropriate than a pie chart in this basic context?",
        ],
      });
    case "com003-powerpoint-placeholder-role":
      return /matches this role:/i.test(q.stem) ? "Which PowerPoint feature acts as a container on a slide layout for text, tables, charts, pictures or other media?" : null;
    case "com003-powerpoint-presentation-slides":
      return /which PowerPoint term/i.test(q.stem) ? "What is a collection of slides used to present information called in PowerPoint?" : null;
    case "com003-powerpoint-insert-table":
      return /matches this description:/i.test(q.stem) ? "Which PowerPoint object is used to organize information in rows and columns on a slide?" : null;
    case "com003-powerpoint-insert-picture":
      return familyVariant(q, ordinal, {
        DIRECT_RECALL: [
          "Which PowerPoint object is used to add an image to a slide?",
          "Which object should be inserted in PowerPoint to place a picture on a slide?",
          "Which PowerPoint object represents image content on a slide?",
        ],
        FUNCTIONAL_APPLICATION: [
          "A slide needs a photograph or other image. Which PowerPoint object should be inserted?",
          "A presenter wants to add an image to a slide. Which PowerPoint object should be used?",
          "Which PowerPoint object should be inserted when a slide requires picture content?",
        ],
        EXAMPLE_RECOGNITION: [
          "A photograph inserted on a PowerPoint slide is an example of which object type?",
          "An image placed on a slide is an example of which PowerPoint object?",
          "Which PowerPoint object is represented by a photograph added to a slide?",
        ],
        CONTRAST_DISCRIMINATION: [
          "Which PowerPoint object is used for an image rather than for tabular or charted data?",
          "Which object should be chosen for picture content rather than a chart or table?",
          "Which PowerPoint object adds visual image content rather than rows, columns or plotted data?",
        ],
      });
    default:
      return null;
  }
}

function polishStem(q: Com003ReviewQuestionV16, ordinal: number) {
  const curated = curatedStem(q, ordinal);
  let stem = clean(curated ?? q.stem)
    .replace(/\bPowerpoint\b/g, "PowerPoint")
    .replace(/\bclipboard\b/g, "Clipboard");
  if (!stem.endsWith("?")) stem = `${stem.replace(/[.]+$/, "")}?`;
  return stem;
}

function polishExplanation(q: Com003ReviewQuestionV16) {
  return clean(q.explanation)
    .replace(/\bPowerpoint\b/g, "PowerPoint")
    .replace(/\bclipboard\b/g, "Clipboard");
}

function buildV161() {
  const ordinalByKey = new Map<string, number>();
  const seenByQl = new Map<string, Set<string>>();
  return COM003_ENGLISH_REVIEW_CORPUS_V16.map((q, index): Com003ReviewQuestionV161 => {
    const key = `${q.targetFactId}:${q.examSurfaceFamily}`;
    const ordinal = ordinalByKey.get(key) ?? 0;
    ordinalByKey.set(key, ordinal + 1);
    const stem = polishStem(q, ordinal);
    const seen = seenByQl.get(q.qlId) ?? new Set<string>();
    if (seen.has(stem.toLowerCase())) throw new Error(`COM003 V16.1 duplicate stem ${q.questionId}:${stem}`);
    seen.add(stem.toLowerCase());
    seenByQl.set(q.qlId, seen);
    return {
      ...q,
      questionId: `${q.questionId}-P${index + 1}`,
      stem,
      explanation: polishExplanation(q),
      stemAuthority: "COM003_V16_1_HUMAN_ARTIFACT_POLISH_AUTHORITY",
      editorialAuthority: "COM003_V16_1_EXAM_REALNESS_POLISH",
    };
  });
}

export const COM003_ENGLISH_REVIEW_CORPUS_V16_1 = buildV161();

export function auditCom003V161() {
  const issues: string[] = [];
  const base = auditCom003V16();
  if (!base.valid) issues.push(...base.issues.map((issue) => `V16_BASE:${issue}`));
  if (COM003_ENGLISH_REVIEW_CORPUS_V16_1.length !== 228) issues.push(`COUNT:${COM003_ENGLISH_REVIEW_CORPUS_V16_1.length}`);

  for (let i = 0; i < COM003_ENGLISH_REVIEW_CORPUS_V16_1.length; i += 1) {
    const before = COM003_ENGLISH_REVIEW_CORPUS_V16[i]!;
    const after = COM003_ENGLISH_REVIEW_CORPUS_V16_1[i]!;
    for (const field of ["qlId", "cpId", "surfaceMode", "targetFactId", "correctIndex", "canonicalAnswer", "examSurfaceFamily"] as const) {
      if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) issues.push(`STRUCTURAL_DRIFT:${field}:${before.questionId}`);
    }
    for (const field of ["options", "sourceIds", "sourceFactIds"] as const) {
      if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) issues.push(`PROVENANCE_OR_OPTION_DRIFT:${field}:${before.questionId}`);
    }
    if (after.options[after.correctIndex] !== after.canonicalAnswer) issues.push(`ANSWER_POSITION:${after.questionId}`);
    if (expectedCom003V15Answer(after).trim().toLowerCase() !== after.canonicalAnswer.trim().toLowerCase()) issues.push(`SEMANTIC_ANSWER:${after.questionId}`);
  }

  for (const ql of COM003_PERMANENT_QLS) {
    const questions = COM003_ENGLISH_REVIEW_CORPUS_V16_1.filter((q) => q.qlId === ql.qlId);
    if (questions.length !== 12) issues.push(`QL_COUNT:${ql.qlId}:${questions.length}`);
    if (new Set(questions.map((q) => q.stem.toLowerCase())).size !== 12) issues.push(`DUPLICATE_STEM:${ql.qlId}`);
  }

  const stems = COM003_ENGLISH_REVIEW_CORPUS_V16_1.map((q) => q.stem).join("\n");
  const banned: readonly [string, RegExp][] = [
    ["POWERPOINT_CAPITALIZATION", /\bPowerpoint\b/],
    ["GENERIC_TERM_DESCRIPTION", /Which term is described by the following statement|refers to which term|Which term best matches this description/i],
    ["COLON_TEMPLATE_PURPOSE", /used for this purpose:|matches this purpose:|matches this role:|matches this effect:|matches this definition:|matches this description:|has this function:/i],
    ["DOUBLE_APP_CONTEXT", /In Microsoft (Word|Excel|PowerPoint),\s+in (?:Microsoft )?\1/i],
    ["INTERNAL_FAMILY_LANGUAGE", /In this (?:direct recall|functional application|example recognition|contrast discrimination) question/i],
  ];
  for (const [code, pattern] of banned) if (pattern.test(stems)) issues.push(code);

  return {
    valid: issues.length === 0,
    questions: COM003_ENGLISH_REVIEW_CORPUS_V16_1.length,
    qls: COM003_PERMANENT_QLS.length,
    semanticAuthority: "V15_UNCHANGED",
    editorialBase: "V16_GREEN",
    artifactPolishAuthority: "COM003_V16_1_EXAM_REALNESS_POLISH",
    governance: "REVIEW_ONLY" as const,
    issues,
  };
}

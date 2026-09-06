import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { expectedCom003V15Answer } from "./com003-review-synthesis-v15";
import {
  COM003_ENGLISH_REVIEW_CORPUS_V16_1,
  auditCom003V161,
  type Com003ReviewQuestionV161,
} from "./com003-review-synthesis-v16-1";

export type Com003ReviewQuestionV162 = Com003ReviewQuestionV161 & {
  explanationAuthority: "COM003_V16_2_QUESTION_AWARE_EXPLANATION_AUTHORITY";
};

const TARGET_QLS = new Set([
  "COM-003-QL-011",
  "COM-003-QL-014",
  "COM-003-QL-017",
  "COM-003-QL-019",
]);

function familyPick(
  q: Com003ReviewQuestionV161,
  ordinal: number,
  values: Partial<Record<Com003ReviewQuestionV161["examSurfaceFamily"], readonly string[]>>,
) {
  const options = values[q.examSurfaceFamily];
  if (!options?.length) return null;
  return options[ordinal % options.length]!;
}

function questionAwareExplanation(q: Com003ReviewQuestionV161, ordinal: number): string | null {
  switch (q.targetFactId) {
    case "com003-excel-absolute-reference":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "An absolute reference remains fixed when a formula is copied or filled, so it is used when the referenced cell must not shift with the formula.",
        ],
        FUNCTIONAL_APPLICATION: [
          "The requirement is to keep the cell reference unchanged after copying the formula. That is exactly the behavior of an absolute reference.",
        ],
        EXAMPLE_RECOGNITION: [
          "A reference that stays unchanged after a formula is copied shows absolute-reference behavior; a relative reference would adjust to the new location.",
        ],
        CONTRAST_DISCRIMINATION: [
          "Absolute and relative references differ in copy behavior: an absolute reference stays fixed, whereas a relative reference normally shifts with the formula.",
        ],
      });
    case "com003-excel-relative-reference":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "A relative reference changes according to the formula's new location when the formula is copied or filled.",
        ],
        FUNCTIONAL_APPLICATION: [
          "Here the reference is supposed to adjust when the formula moves. Relative references are designed for that copy-and-fill behavior.",
        ],
        EXAMPLE_RECOGNITION: [
          "Changing to reflect the new formula location is the defining behavior of a relative reference; an absolute reference would remain fixed.",
        ],
        CONTRAST_DISCRIMINATION: [
          "A relative reference shifts with the copied formula, unlike an absolute reference whose locked coordinates remain unchanged.",
        ],
      });
    case "com003-excel-absolute-reference-notation":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "$A$1 is fully absolute because a dollar sign appears before both the column letter A and the row number 1.",
        ],
        FUNCTIONAL_APPLICATION: [
          "To lock both coordinates of A1, Excel places a dollar sign before the column and another before the row, giving $A$1.",
        ],
        EXAMPLE_RECOGNITION: [
          "In $A$1, both coordinates are marked with dollar signs, so neither the column nor the row changes when the formula is copied.",
        ],
        CONTRAST_DISCRIMINATION: [
          "$A$1 locks both A and 1. A reference with only one dollar sign would be mixed rather than fully absolute.",
          "A fully absolute reference fixes both coordinates; the notation $A$1 shows this by locking both the column and the row.",
        ],
      });

    case "com003-excel-line-chart":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "A line chart connects values in sequence, making it a common basic choice for showing a trend across time or another ordered interval.",
        ],
        FUNCTIONAL_APPLICATION: [
          "Because the values must be followed across successive periods, a line chart makes the direction of change easy to see.",
        ],
        EXAMPLE_RECOGNITION: [
          "A display focused on change across ordered periods matches the basic use of a line chart.",
        ],
        CONTRAST_DISCRIMINATION: [
          "A line chart emphasizes change across an ordered sequence; a pie chart instead emphasizes how one total is divided into parts.",
        ],
      });
    case "com003-excel-bar-chart":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "A bar chart is commonly used to compare the magnitudes of separate categories or individual items.",
        ],
        FUNCTIONAL_APPLICATION: [
          "The task is category-to-category comparison, which is a standard basic use of a bar chart because each category is shown separately.",
        ],
        EXAMPLE_RECOGNITION: [
          "When a chart's main purpose is comparing separate category values, that pattern corresponds to a bar chart.",
        ],
        CONTRAST_DISCRIMINATION: [
          "A bar chart compares separate categories, whereas a pie chart is aimed at showing each category as part of one total.",
          "Here the emphasis is on differences between individual items, so a bar chart fits better than a part-to-whole pie chart.",
          "For basic category comparison, bars make the values directly comparable; a pie chart instead emphasizes proportions of a single whole.",
        ],
      });
    case "com003-excel-pie-chart":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "A pie chart represents one total as proportional slices, so its basic purpose is to show parts of a whole.",
        ],
        FUNCTIONAL_APPLICATION: [
          "The requirement is to show each category's share of one total. A pie chart directly represents that part-to-whole relationship.",
          "Because all categories together form a single total, a pie chart is suitable for showing how that total is divided among them.",
        ],
        EXAMPLE_RECOGNITION: [
          "Showing each category as a share of one total is the characteristic part-to-whole use of a pie chart.",
          "When values are presented as portions of a single whole, the chart is functioning as a pie chart.",
          "Dividing one data series into category shares describes the basic visual role of a pie chart.",
        ],
        CONTRAST_DISCRIMINATION: [
          "A pie chart emphasizes proportions of one whole, unlike a bar chart that is commonly used to compare separate category magnitudes.",
        ],
      });

    case "com003-powerpoint-insert-chart":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "A Chart object is used when numerical data needs to be represented graphically on a PowerPoint slide.",
        ],
        FUNCTIONAL_APPLICATION: [
          "The slide needs a graphical presentation of data rather than rows and columns, so a Chart object is the appropriate insertable object.",
        ],
        EXAMPLE_RECOGNITION: [
          "Displaying data graphically on a slide is the role of a Chart object in PowerPoint.",
          "A slide object that turns data into a graphical display is a Chart, not a Picture or Table.",
        ],
        CONTRAST_DISCRIMINATION: [
          "A Chart visualizes data graphically; a Table organizes data in rows and columns, while a Picture supplies image content.",
        ],
      });
    case "com003-powerpoint-insert-picture":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "A Picture object adds image content such as a photograph or illustration to a PowerPoint slide.",
        ],
        FUNCTIONAL_APPLICATION: [
          "Because the slide needs a photograph or other image, a Picture object should be inserted rather than a Chart or Table.",
        ],
        EXAMPLE_RECOGNITION: [
          "A photograph placed on a slide is image content, so it is a Picture object in this classification.",
        ],
        CONTRAST_DISCRIMINATION: [
          "Picture is the image-content object; a Chart visualizes data and a Table arranges data in rows and columns.",
          "The requirement is visual image content rather than plotted or tabular data, which distinguishes Picture from Chart and Table.",
          "A Picture supplies an image on the slide. It does not organize data into rows and columns or plot data graphically.",
        ],
      });
    case "com003-powerpoint-insert-table":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "A Table object organizes information in a row-and-column structure on a PowerPoint slide.",
        ],
        FUNCTIONAL_APPLICATION: [
          "The information needs a row-and-column arrangement, so a Table object is appropriate rather than a Chart or Picture.",
        ],
        EXAMPLE_RECOGNITION: [
          "Rows and columns on a slide indicate a Table object, whose purpose is structured tabular organization.",
        ],
        CONTRAST_DISCRIMINATION: [
          "A Table arranges data in rows and columns; a Chart instead visualizes data graphically.",
        ],
      });

    case "com003-powerpoint-shortcut-f5":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "In Windows desktop PowerPoint, F5 starts the slide show from the first slide; Shift+F5 starts from the current slide.",
          "F5 is the beginning-of-show shortcut in Windows desktop PowerPoint, so the presentation starts at slide 1.",
        ],
        FUNCTIONAL_APPLICATION: [
          "The presenter needs to run the show from the first slide, so F5 is used. Shift+F5 would begin at the currently selected slide instead.",
        ],
        EXAMPLE_RECOGNITION: [
          "The action 'start the slide show from the beginning' matches F5 in Windows desktop PowerPoint.",
          "Starting at slide 1 is the behavior associated with F5, which distinguishes it from Shift+F5.",
        ],
        CONTRAST_DISCRIMINATION: [
          "F5 and Shift+F5 differ by starting point: F5 begins at the first slide, while Shift+F5 begins at the current slide.",
        ],
      });
    case "com003-powerpoint-shortcut-shift-f5":
      return familyPick(q, ordinal, {
        DIRECT_RECALL: [
          "In Windows desktop PowerPoint, Shift+F5 starts the slide show from the current slide; F5 starts from the beginning.",
        ],
        FUNCTIONAL_APPLICATION: [
          "Because the presenter wants to begin at the currently selected slide, Shift+F5 is the required shortcut rather than F5.",
          "Shift+F5 preserves the current starting point for the slide show; F5 would restart the presentation from slide 1.",
        ],
        EXAMPLE_RECOGNITION: [
          "The action 'start the slide show from the current slide' corresponds to Shift+F5 in Windows desktop PowerPoint.",
        ],
        CONTRAST_DISCRIMINATION: [
          "Shift+F5 begins at the current slide, which is the opposite starting-point behavior of F5 from the beginning.",
          "When the current slide must be the starting point, Shift+F5 is chosen; F5 is reserved for starting from slide 1.",
          "The distinction is the starting slide: Shift+F5 uses the current slide, whereas F5 uses the first slide.",
        ],
      });
    default:
      return null;
  }
}

function buildV162() {
  const ordinalByKey = new Map<string, number>();
  return COM003_ENGLISH_REVIEW_CORPUS_V16_1.map((q): Com003ReviewQuestionV162 => {
    const key = `${q.targetFactId}:${q.examSurfaceFamily}`;
    const ordinal = ordinalByKey.get(key) ?? 0;
    ordinalByKey.set(key, ordinal + 1);
    const explanation = questionAwareExplanation(q, ordinal) ?? q.explanation;
    return {
      ...q,
      explanation,
      explanationAuthority: "COM003_V16_2_QUESTION_AWARE_EXPLANATION_AUTHORITY",
    };
  });
}

export const COM003_ENGLISH_REVIEW_CORPUS_V16_2 = buildV162();

export function auditCom003V162() {
  const issues: string[] = [];
  const base = auditCom003V161();
  if (!base.valid) issues.push(...base.issues.map((issue) => `V16_1_BASE:${issue}`));
  if (COM003_ENGLISH_REVIEW_CORPUS_V16_2.length !== 228) issues.push(`COUNT:${COM003_ENGLISH_REVIEW_CORPUS_V16_2.length}`);

  for (let i = 0; i < COM003_ENGLISH_REVIEW_CORPUS_V16_2.length; i += 1) {
    const before = COM003_ENGLISH_REVIEW_CORPUS_V16_1[i]!;
    const after = COM003_ENGLISH_REVIEW_CORPUS_V16_2[i]!;
    for (const field of ["questionId", "qlId", "cpId", "surfaceMode", "targetFactId", "correctIndex", "canonicalAnswer", "examSurfaceFamily", "stem"] as const) {
      if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) issues.push(`NON_EXPLANATION_DRIFT:${field}:${before.questionId}`);
    }
    for (const field of ["options", "sourceIds", "sourceFactIds"] as const) {
      if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) issues.push(`PROVENANCE_OR_OPTION_DRIFT:${field}:${before.questionId}`);
    }
    if (after.options[after.correctIndex] !== after.canonicalAnswer) issues.push(`ANSWER_POSITION:${after.questionId}`);
    if (expectedCom003V15Answer(after).trim().toLowerCase() !== after.canonicalAnswer.trim().toLowerCase()) issues.push(`SEMANTIC_ANSWER:${after.questionId}`);
    if (!after.explanation.trim()) issues.push(`EMPTY_EXPLANATION:${after.questionId}`);
    if (/\b(?:therefore|hence|accordingly),?\s+.*\b(?:correct|answer)\b/i.test(after.explanation)) issues.push(`GENERIC_ANSWER_TAIL:${after.questionId}`);
  }

  for (const ql of COM003_PERMANENT_QLS) {
    const questions = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => q.qlId === ql.qlId);
    const uniqueExplanations = new Set(questions.map((q) => q.explanation.toLowerCase())).size;
    if (uniqueExplanations < 4) issues.push(`THIN_EXPLANATION_DIVERSITY:${ql.qlId}:${uniqueExplanations}`);
    if (TARGET_QLS.has(ql.qlId) && uniqueExplanations !== 12) issues.push(`TARGET_EXPLANATION_DIVERSITY:${ql.qlId}:${uniqueExplanations}`);
  }

  return {
    valid: issues.length === 0,
    questions: COM003_ENGLISH_REVIEW_CORPUS_V16_2.length,
    qls: COM003_PERMANENT_QLS.length,
    explanationUpgradedQls: [...TARGET_QLS],
    semanticAuthority: "V15_UNCHANGED",
    stemAuthority: "V16_1_UNCHANGED",
    explanationAuthority: "COM003_V16_2_QUESTION_AWARE_EXPLANATION_AUTHORITY",
    governance: "REVIEW_ONLY" as const,
    issues,
  };
}

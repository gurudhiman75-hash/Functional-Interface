import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V13, buildCom003EnglishReviewCorpusV13, type Com003ReviewQuestionV13 } from "./com003-review-synthesis-v13";

export type Com003ReviewQuestionV14 = Omit<Com003ReviewQuestionV13, "stemAuthority"> & {
  stemAuthority: "COM003_V14_SIMPLE_DIRECT_EXAM_AUTHORITY";
};

function upperFirst(value: string) {
  const v = value.trim();
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : v;
}

function lowerFirst(value: string) {
  const v = value.trim();
  return v ? v.charAt(0).toLowerCase() + v.slice(1) : v;
}

function appForQl(qlId: string) {
  const n = Number(qlId.match(/QL-(\d{3})$/)?.[1] ?? 0);
  if (n <= 3) return "Microsoft Office";
  if (n <= 7) return "Microsoft Word";
  if (n <= 15) return "Microsoft Excel";
  return "Microsoft PowerPoint";
}

function cleanDirectStem(input: string) {
  let stem = input.trim().replace(/\s+/g, " ");

  stem = stem
    .replace(/^In the Windows desktop version of Microsoft ([^,]+),\s*/i, "In Microsoft $1 (Windows desktop), ")
    .replace(/^(Controls|Removes|Adds|Compares|Shows|Can be inserted|Remains|Adjusts|Specifies)([^.]+)\. Which ([^?]+) is this\?$/i,
      (_m, verb, rest, subject) => `Which ${String(subject)} ${lowerFirst(`${String(verb)}${String(rest)}`)}?`,
    )
    .replace(/^Can be inserted ([^.]+)\. Which PowerPoint object is this\?$/i, (_m, rest) =>
      `Which PowerPoint object can be inserted ${String(rest)}?`,
    )
    .replace(/^Which PowerPoint feature is a container on a slide layout that can hold content such as text, tables, charts, pictures or media\?$/i,
      "Which PowerPoint feature is a container that can hold text, tables, charts, pictures or media on a slide layout?")
    .replace(/^Which PowerPoint term refers to an individual presentation page\/screen within a PowerPoint presentation\?$/i,
      "What is an individual page of a PowerPoint presentation called?")
    .replace(/^In PowerPoint, what is an individual presentation page\/screen within a PowerPoint presentation called\?$/i,
      "In PowerPoint, what is an individual presentation page called?")
    .replace(/^Which Microsoft Word term refers to a word-processing document rather than a worksheet or slide presentation\?$/i,
      "What is a file created in Microsoft Word called?")
    .replace(/^Which Excel range represents the continuous range from A1 to A5\?$/i,
      "Which notation represents the range from A1 to A5 in Excel?")
    .replace(/^In Excel, what is an Excel file that can contain one or more worksheets called\?$/i,
      "In Excel, what is a file that can contain one or more worksheets called?")
    .replace(/^In Excel, what is a worksheet made of rows and columns within a workbook called\?$/i,
      "In Excel, what is a sheet made of rows and columns within a workbook called?")
    .replace(/provides a predefined starting design\/structure for creating a presentation/gi,
      "provides a predefined design for creating a presentation")
    .replace(/provides coordinated design elements such as colors, fonts, effects and background styling/gi,
      "provides coordinated colors, fonts, effects and background styles")
    .replace(/marks where data-source values are inserted into the main document/gi,
      "marks where data-source values are inserted in the main document")
    .replace(/contains the field values for one recipient or merged item/gi,
      "contains the values for one recipient")
    .replace(/provides recipient-specific records or values used during the merge/gi,
      "provides recipient records used in the merge")
    .replace(/contains the common text and layout shared by merged documents/gi,
      "contains the common text and layout used in all merged documents")
    .replace(/combines a main document with recipient or data-source information to create personalized output/gi,
      "combines a main document with recipient data to create personalized documents")
    .replace(/controls the arrangement and positioning of placeholders and slide content areas/gi,
      "controls the arrangement of placeholders and content on a slide")
    .replace(/specifies time spent on a slide before advancing automatically to the next slide/gi,
      "sets how long a slide is shown before moving automatically to the next slide")
    .replace(/controls how long the transition effect takes; a shorter duration makes it complete faster/gi,
      "controls how long a slide transition takes")
    .replace(/can be inserted as visual content on a slide/gi,
      "can be inserted to add an image to a slide")
    .replace(/can be inserted on a slide to visualize data/gi,
      "can be inserted on a slide to show data graphically")
    .replace(/can be inserted on a slide to organize data in rows and columns/gi,
      "can be inserted on a slide to show data in rows and columns")
    .replace(/counts cells or arguments containing numbers in the\?/gi,
      "counts cells containing numbers?")
    .replace(/returns the arithmetic mean of its numeric arguments/gi,
      "returns the average of numbers")
    .replace(/locates specified text without requiring it to be changed/gi,
      "finds specified text without changing it")
    .replace(/identifies potential spelling errors for review/gi,
      "identifies possible spelling errors")
    .replace(/open the print workflow/gi,
      "print a document")
    .replace(/Excel row or column operation/gi,
      "Excel command or option")
    .replace(/horizontal width of a worksheet column/gi,
      "width of a column")
    .replace(/vertical height of a worksheet row/gi,
      "height of a row")
    .replace(/removes the selected worksheet row/gi,
      "removes a selected row")
    .replace(/adds a worksheet row and shifts existing rows as needed/gi,
      "inserts a new row")
    .replace(/column-width command using Excel Ribbon access keys/gi,
      "Column Width command using Ribbon access keys")
    .replace(/powerPoint show file that opens as a slide show/gi,
      "a PowerPoint Show file")
    .replace(/excel 97-2003 workbook/gi,
      "an Excel 97-2003 workbook")
    .replace(/modern Word document/gi,
      "a modern Word document")
    .replace(/modern Excel workbook/gi,
      "a modern Excel workbook")
    .replace(/\s+\?/g, "?")
    .replace(/\?{2,}$/g, "?");

  if (!stem.endsWith("?")) stem = stem.replace(/[.]$/, "") + "?";
  return upperFirst(stem);
}

function alternateDuplicate(stem: string, qlId: string) {
  if (/^Which\b/.test(stem)) return stem.replace(/^Which\b/, "What");
  if (/^In ([^,]+), which\b/i.test(stem)) return stem.replace(/^In ([^,]+), which\b/i, "In $1, what");
  if (/^In Excel, what does\b/i.test(stem)) return upperFirst(stem.replace(/^In Excel,\s*/i, ""));
  if (/^How is an Excel cell address written\?$/i.test(stem)) return "What makes up an Excel cell address?";
  if (/^In Microsoft ([^)]+) \(Windows desktop\), which\b/i.test(stem)) {
    return stem.replace(/^(In Microsoft [^)]+ \(Windows desktop\), )which\b/i, "$1what");
  }
  const app = appForQl(qlId);
  if (/^What\b/.test(stem)) return `In ${app}, ${lowerFirst(stem)}`;
  return `In ${app}, ${lowerFirst(stem)}`;
}

function rewriteCorpus(corpus: readonly Com003ReviewQuestionV13[]) {
  const result: Com003ReviewQuestionV14[] = [];
  const seenByQl = new Map<string, Set<string>>();

  for (const [index, question] of corpus.entries()) {
    let stem = cleanDirectStem(question.stem);
    const seen = seenByQl.get(question.qlId) ?? new Set<string>();
    if (seen.has(stem.toLowerCase())) stem = cleanDirectStem(alternateDuplicate(stem, question.qlId));
    if (seen.has(stem.toLowerCase())) stem = cleanDirectStem(`In ${appForQl(question.qlId)}, ${lowerFirst(stem)}`);
    if (seen.has(stem.toLowerCase())) throw new Error(`COM003 V14 could not create a natural unique stem for ${question.questionId}: ${stem}`);
    seen.add(stem.toLowerCase());
    seenByQl.set(question.qlId, seen);

    result.push({
      ...question,
      questionId: `${question.questionId.replace("COM003-REVIEW-V13-", "COM003-REVIEW-V14-")}-${index + 1}`,
      stem,
      stemAuthority: "COM003_V14_SIMPLE_DIRECT_EXAM_AUTHORITY",
    });
  }

  return result;
}

export function buildCom003EnglishReviewCorpusV14(options: { perQl?: number; seedPrefix?: string } = {}) {
  return rewriteCorpus(buildCom003EnglishReviewCorpusV13(options));
}

export const COM003_ENGLISH_REVIEW_CORPUS_V14 = rewriteCorpus(COM003_ENGLISH_REVIEW_CORPUS_V13);

export function auditCom003V14StemUniqueness() {
  return COM003_PERMANENT_QLS.map((ql) => {
    const stems = COM003_ENGLISH_REVIEW_CORPUS_V14.filter((q) => q.qlId === ql.qlId).map((q) => q.stem.toLowerCase());
    return { qlId: ql.qlId, total: stems.length, unique: new Set(stems).size };
  });
}

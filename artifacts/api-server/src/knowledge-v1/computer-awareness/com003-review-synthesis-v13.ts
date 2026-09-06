import { COM003_ENGLISH_REVIEW_CORPUS_V12, buildCom003EnglishReviewCorpusV12, type Com003ReviewQuestionV12 } from "./com003-review-synthesis-v12";

export type Com003ReviewQuestionV13 = Omit<Com003ReviewQuestionV12, "stemAuthority"> & {
  stemAuthority: "COM003_V13_PLAIN_EXAM_GRAMMAR_AUTHORITY";
};

function upperFirst(value: string) {
  const v = value.trim();
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : v;
}

function normalizePredicate(input: string) {
  return input
    .trim()
    .replace(/[.]$/, "")
    .replace(/^supplies\b/i, "provides")
    .replace(/^an effect applied to\b/i, "is applied to")
    .replace(/^an effect used for moving from one slide to the next\b/i, "is used when moving from one slide to the next")
    .replace(/^content shown in the bottom margin of a document page\b/i, "appears in the bottom margin of a document page")
    .replace(/^content shown in the top margin of a document page\b/i, "appears in the top margin of a document page")
    .replace(/^is organized as a sequence or collection of slides used to present information\b/i, "is a collection of slides used to present information")
    .replace(/recipient\/data-source/gi, "recipient or data-source")
    .replace(/merged outputs/gi, "merged documents")
    .replace(/configured\/common/gi, "common")
    .replace(/while shifting existing worksheet structure as applicable/gi, "and shifts existing rows as needed")
    .replace(/illustrates comparisons among individual items or categories/gi, "compares values across categories")
    .replace(/commonly shows trends over time or other evenly ordered intervals/gi, "shows trends over time")
    .replace(/shows how values in one data series contribute as parts of a whole/gi, "shows parts of a whole")
    .replace(/counts cells or arguments containing numbers in the basic numeric-count context/gi, "counts cells containing numbers")
    .replace(/returns the largest numeric value in the supplied set or range/gi, "returns the largest value in a range")
    .replace(/returns the smallest numeric value in the supplied set or range/gi, "returns the smallest value in a range")
    .replace(/adds values supplied as numbers, cell references or ranges/gi, "adds numbers or values in cells and ranges")
    .replace(/spreadsheet sheet made of rows and columns within a workbook/gi, "worksheet made of rows and columns within a workbook")
    .replace(/continuous cell range from A1 through A5/gi, "the continuous range from A1 to A5")
    .replace(/document printing workflow/gi, "printing options")
    .replace(/stores current changes in the file/gi, "saves changes to the current file")
    .replace(/opens or performs the printing options/gi, "opens the printing options")
    .replace(/word processing: creating, editing and formatting documents/gi, "creating, editing and formatting documents")
    .replace(/through Windows desktop Excel Ribbon access keys/gi, "using Excel Ribbon access keys")
    .replace(/\s+/g, " ");
}

function predicateQuestion(subject: string, predicate: string, prefix = "") {
  const p = normalizePredicate(predicate);
  const lead = prefix ? `${prefix}, ` : "";
  if (/^(?:a|an|the)\b/i.test(p)) return `${lead}which ${subject} is ${p}?`;
  return `${lead}which ${subject} ${p}?`;
}

function simplifyStem(input: string) {
  let stem = input.trim().replace(/\s+/g, " ");

  stem = stem
    .replace(/^In Windows desktop Microsoft ([^,]+),\s*/i, "In the Windows desktop version of Microsoft $1, ")
    .replace(/\bwhich keyboard shortcut\b/gi, "which shortcut")
    .replace(/\bwhat is the shortcut for start\b/gi, "what is the shortcut to start")
    .replace(/\bconfigured\/common\b/gi, "common")
    .replace(/\brecipient\/data-source\b/gi, "recipient or data-source")
    .replace(/\bmerged outputs\b/gi, "merged documents")
    .replace(/\bbasic numeric-count context\b/gi, "")
    .replace(/\bthrough Windows desktop Excel Ribbon access keys\b/gi, "using Excel Ribbon access keys")
    .replace(/\bwhile shifting existing worksheet structure as applicable\b/gi, "and shifts existing rows as needed")
    .replace(/\billustrates comparisons among individual items or categories\b/gi, "compares values across categories")
    .replace(/\bcommonly shows trends over time or other evenly ordered intervals\b/gi, "shows trends over time")
    .replace(/\bshows how values in one data series contribute as parts of a whole\b/gi, "shows parts of a whole")
    .replace(/\bcounts cells or arguments containing numbers in the\s*\?/gi, "counts cells containing numbers?")
    .replace(/\breturns the largest numeric value in the supplied set or range\b/gi, "returns the largest value in a range")
    .replace(/\breturns the smallest numeric value in the supplied set or range\b/gi, "returns the smallest value in a range")
    .replace(/\badds values supplied as numbers, cell references or ranges\b/gi, "adds numbers or values in cells and ranges")
    .replace(/\bcontinuous cell range from A1 through A5\b/gi, "the continuous range from A1 to A5")
    .replace(/\bspreadsheet sheet made of rows and columns within a workbook\b/gi, "worksheet made of rows and columns within a workbook")
    .replace(/\bopens or performs the document printing workflow\b/gi, "opens the printing options")
    .replace(/\bstores current changes in the file\b/gi, "saves changes to the current file")
    .replace(/\bword processing: creating, editing and formatting documents\b/gi, "creating, editing and formatting documents");

  stem = stem.replace(/^Which (.+?) is described as (.+)\?$/i, (_m, subject, predicate) =>
    predicateQuestion(String(subject), String(predicate)),
  );

  stem = stem.replace(/^In (.+?), (.+) refers to which (.+)\?$/i, (_m, app, predicate, subject) =>
    predicateQuestion(String(subject), String(predicate), `In ${String(app)}`),
  );

  stem = stem.replace(/^What is the (.+?) for (.+)\?$/i, (_m, subject, predicate) =>
    predicateQuestion(String(subject), String(predicate)),
  );

  stem = stem.replace(/^Which (.+?) term refers to is a collection of slides used to present information\?$/i,
    (_m, subject) => `Which ${String(subject)} term means a collection of slides used to present information?`,
  );
  stem = stem.replace(/^Which (.+?) term refers to is organized as a sequence or collection of slides used to present information\?$/i,
    (_m, subject) => `Which ${String(subject)} term means a collection of slides used to present information?`,
  );
  stem = stem.replace(/^In PowerPoint, what is is organized as a sequence or collection of slides used to present information called\?$/i,
    "In PowerPoint, what is a collection of slides used to present information called?");

  stem = stem.replace(/^In Excel, what does The ([^?]+)\?$/i, (_m, rest) => `In Excel, what does the ${String(rest)}?`);
  stem = stem.replace(/^What does The ([^?]+) in Excel\?$/i, (_m, rest) => `In Excel, what does the ${String(rest)}?`);
  stem = stem.replace(/^In Excel, what does Excel cell address represent\?$/i, "How is an Excel cell address written?");
  stem = stem.replace(/^What does Excel cell address represent in Excel\?$/i, "How is an Excel cell address written?");

  stem = stem
    .replace(/^Which Word page element can be inserted as part of a header or footer\?$/i, "Which item can be inserted in a Word header or footer?")
    .replace(/^In Microsoft Word, can be inserted as part of a header or footer refers to which Word page element\?$/i, "Which item can be inserted in a Word header or footer?")
    .replace(/^Which PowerPoint effect is an effect applied to an object or text on a slide\?$/i, "Which PowerPoint effect is applied to text or an object on a slide?")
    .replace(/^Which PowerPoint effect is an effect used for moving from one slide to the next\?$/i, "Which PowerPoint effect is used when moving from one slide to the next?")
    .replace(/^What is the PowerPoint effect for an effect applied to an object or text on a slide\?$/i, "Which PowerPoint effect is applied to text or an object on a slide?")
    .replace(/^What is the PowerPoint effect for an effect used for moving from one slide to the next\?$/i, "Which PowerPoint effect is used when moving from one slide to the next?")
    .replace(/^Which PowerPoint object is can be inserted /i, "Which PowerPoint object can be inserted ")
    .replace(/^Which Word page element is can be inserted /i, "Which Word page element can be inserted ");

  stem = normalizePredicate(stem)
    .replace(/^which\b/, "Which")
    .replace(/^in\b/, "In")
    .replace(/\s+\?/g, "?")
    .replace(/\?{2,}$/g, "?");

  if (!stem.endsWith("?")) stem = stem.replace(/[.]$/, "") + "?";
  return upperFirst(stem);
}

function rewriteCorpus(corpus: readonly Com003ReviewQuestionV12[]) {
  return corpus.map((question, index): Com003ReviewQuestionV13 => ({
    ...question,
    questionId: `${question.questionId.replace("COM003-REVIEW-V12-", "COM003-REVIEW-V13-")}-${index + 1}`,
    stem: simplifyStem(question.stem),
    stemAuthority: "COM003_V13_PLAIN_EXAM_GRAMMAR_AUTHORITY",
  }));
}

export function buildCom003EnglishReviewCorpusV13(options: { perQl?: number; seedPrefix?: string } = {}) {
  return rewriteCorpus(buildCom003EnglishReviewCorpusV12(options));
}

export const COM003_ENGLISH_REVIEW_CORPUS_V13 = rewriteCorpus(COM003_ENGLISH_REVIEW_CORPUS_V12);

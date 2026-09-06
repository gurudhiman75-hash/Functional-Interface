import { buildCom003EnglishReviewCorpusV11, type Com003ReviewQuestionV11 } from "./com003-review-synthesis-v11";

export type Com003ReviewQuestionV12 = Omit<Com003ReviewQuestionV11, "stemAuthority"> & {
  stemAuthority: "COM003_V12_STANDARD_EXAM_WORDING_AUTHORITY";
};

function normalizeExamStem(stem: string) {
  let value = stem.trim().replace(/\s+/g, " ");

  value = value
    .replace(/page-margin content associated with the bottom area of a document page/gi, "content shown in the bottom margin of a document page")
    .replace(/page-margin content associated with the top area of a document page/gi, "content shown in the top margin of a document page")
    .replace(/\bassociated with\b/gi, "used for")
    .replace(/\bpractical effect\b/gi, "result")
    .replace(/\bcorrect choice\b/gi, "answer")
    .replace(/\bcorrectly represents\b/gi, "represents")
    .replace(/\bquickest keyboard method\b/gi, "shortcut")
    .replace(/\bkey combination\b/gi, "shortcut")
    .replace(/\brequirement\b/gi, "need")
    .replace(/\bappropriate\b/gi, "used")
    .replace(/\baction\b/gi, "operation")
    .replace(/\btask\b/gi, "work")
    .replace(/\binvokes\b/gi, "performs")
    .replace(/\binvoke\b/gi, "perform")
    .replace(/\bdistinguishes\b/gi, "identifies")
    .replace(/\bdistinguishing\b/gi, "identifying")
    .replace(/\bdistinguished\b/gi, "identified")
    .replace(/\bdistinguish\b/gi, "identify")
    .replace(/\bexample or description\b/gi, "description")
    .replace(/\?{2,}$/g, "?")
    .replace(/\.\?$/g, "?");

  if (!value.endsWith("?")) value = value.replace(/[.]$/, "") + "?";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function rewriteCorpus(corpus: readonly Com003ReviewQuestionV11[]) {
  return corpus.map((question, index): Com003ReviewQuestionV12 => ({
    ...question,
    questionId: `${question.questionId.replace("COM003-REVIEW-V11-", "COM003-REVIEW-V12-")}-${index + 1}`,
    stem: normalizeExamStem(question.stem),
    stemAuthority: "COM003_V12_STANDARD_EXAM_WORDING_AUTHORITY",
  }));
}

export function buildCom003EnglishReviewCorpusV12(options: { perQl?: number; seedPrefix?: string } = {}) {
  return rewriteCorpus(buildCom003EnglishReviewCorpusV11(options));
}

export const COM003_ENGLISH_REVIEW_CORPUS_V12 = buildCom003EnglishReviewCorpusV12();

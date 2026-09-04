import {
  COM003_ENGLISH_REVIEW_CORPUS_V15,
  auditCom003V15,
  buildCom003EnglishReviewCorpusV15,
  expectedCom003V15Answer,
  type Com003ReviewQuestionV15,
} from "./com003-review-synthesis-v15";

const VERB_AFTER_TO = /\bto (returns|counts|calculates|adds|compares|shows|illustrates|visualizes|sorts|filters|continues|changes|keeps|starts|sets|controls|applies|determines|specifies|displays|removes|fills|orders|creates|contains|stores|holds|identifies|locates|replaces|combines|inserts|duplicates|opens|saves|copies|cuts|finds|reverses|reapplies)\b/gi;
const BASE_VERB: Record<string, string> = {
  returns: "return", counts: "count", calculates: "calculate", adds: "add", compares: "compare",
  shows: "show", illustrates: "illustrate", visualizes: "visualize", sorts: "sort", filters: "filter",
  continues: "continue", changes: "change", keeps: "keep", starts: "start", sets: "set",
  controls: "control", applies: "apply", determines: "determine", specifies: "specify", displays: "display",
  removes: "remove", fills: "fill", orders: "order", creates: "create", contains: "contain", stores: "store",
  holds: "hold", identifies: "identify", locates: "locate", replaces: "replace", combines: "combine",
  inserts: "insert", duplicates: "duplicate", opens: "open", saves: "save", copies: "copy", cuts: "cut",
  finds: "find", reverses: "reverse", reapplies: "reapply",
};

function finalizeStem(input: string) {
  let stem = input.trim().replace(/\s+/g, " ");
  stem = stem.replace(VERB_AFTER_TO, (_match, verb: string) => `to ${BASE_VERB[verb.toLowerCase()] ?? verb}`);
  stem = stem.replace(/\?+$/g, "").replace(/[.]+$/g, "").trim();
  return `${stem}?`;
}

function finalizeCorpus(corpus: readonly Com003ReviewQuestionV15[]) {
  return corpus.map((question) => ({ ...question, stem: finalizeStem(question.stem) }));
}

export function buildCom003EnglishReviewCorpusV15Final(options: { perQl?: number; seedPrefix?: string } = {}) {
  return finalizeCorpus(buildCom003EnglishReviewCorpusV15(options));
}

export const COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL = finalizeCorpus(COM003_ENGLISH_REVIEW_CORPUS_V15);

export function auditCom003V15Final() {
  const base = auditCom003V15();
  const issues = [...base.issues];
  for (const question of COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL) {
    if (!question.stem.endsWith("?") || question.stem.endsWith("??")) issues.push(`TERMINAL_PUNCTUATION:${question.questionId}`);
    if (/\bto (returns|counts|calculates|adds|compares|shows|sorts|filters|starts|sets|controls|applies|displays|removes|creates|stores|inserts|opens|saves|copies|cuts|finds)\b/i.test(question.stem)) {
      issues.push(`BROKEN_INFINITIVE:${question.questionId}`);
    }
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_POSITION:${question.questionId}`);
    if (expectedCom003V15Answer(question).trim().toLowerCase() !== question.canonicalAnswer.trim().toLowerCase()) {
      issues.push(`SEMANTIC_ANSWER:${question.questionId}:${question.targetFactId}`);
    }
  }
  return { valid: issues.length === 0, questions: COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.length, qls: 19, issues };
}

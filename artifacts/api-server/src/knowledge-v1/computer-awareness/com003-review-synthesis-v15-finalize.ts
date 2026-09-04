import {
  COM003_ENGLISH_REVIEW_CORPUS_V15,
  auditCom003V15,
  buildCom003EnglishReviewCorpusV15,
  expectedCom003V15Answer,
  type Com003ReviewQuestionV15,
} from "./com003-review-synthesis-v15";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";

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

function lowerFirst(value: string) {
  const v = value.trim();
  return v ? `${v.charAt(0).toLowerCase()}${v.slice(1)}` : v;
}

function applicationForQl(qlId: string) {
  const n = Number(qlId.match(/QL-(\d{3})$/)?.[1] ?? 0);
  if (n <= 3) return "Microsoft Office";
  if (n <= 7) return "Microsoft Word";
  if (n <= 15) return "Microsoft Excel";
  return "Microsoft PowerPoint";
}

function finalizeStem(input: string) {
  let stem = input.trim().replace(/\s+/g, " ");
  stem = stem.replace(VERB_AFTER_TO, (_match, verb: string) => `to ${BASE_VERB[verb.toLowerCase()] ?? verb}`);
  stem = stem.replace(/\?+$/g, "").replace(/[.]+$/g, "").trim();
  return `${stem}?`;
}

function alternateDuplicateStem(question: Com003ReviewQuestionV15, stem: string, seen: Set<string>) {
  const candidates: string[] = [];
  if (/^Which\b/i.test(stem) && !/^Which of the following\b/i.test(stem)) {
    candidates.push(stem.replace(/^Which\b/i, "What"));
  }
  if (/,\s*which\b/i.test(stem)) {
    candidates.push(stem.replace(/,\s*which\b/i, ", what"));
  }

  const app = applicationForQl(question.qlId);
  const core = stem
    .replace(/\?+$/g, "")
    .replace(new RegExp(`^(?:In|Within|For) ${app.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")},\\s*`, "i"), "");
  candidates.push(`In ${app}, ${lowerFirst(core)}?`);
  candidates.push(`Within ${app}, ${lowerFirst(core)}?`);

  for (const candidate of candidates.map(finalizeStem)) {
    if (!seen.has(candidate.toLowerCase())) return candidate;
  }
  throw new Error(`COM003 V15 finalizer could not resolve duplicate stem ${question.questionId}:${stem}`);
}

function finalizeCorpus(corpus: readonly Com003ReviewQuestionV15[]) {
  const seenByQl = new Map<string, Set<string>>();
  return corpus.map((question) => {
    const seen = seenByQl.get(question.qlId) ?? new Set<string>();
    let stem = finalizeStem(question.stem);
    if (seen.has(stem.toLowerCase())) stem = alternateDuplicateStem(question, stem, seen);
    seen.add(stem.toLowerCase());
    seenByQl.set(question.qlId, seen);
    return { ...question, stem };
  });
}

export function buildCom003EnglishReviewCorpusV15Final(options: { perQl?: number; seedPrefix?: string } = {}) {
  return finalizeCorpus(buildCom003EnglishReviewCorpusV15(options));
}

export const COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL = finalizeCorpus(COM003_ENGLISH_REVIEW_CORPUS_V15);

export function auditCom003V15Final() {
  const base = auditCom003V15();
  const issues = base.issues.filter((issue) => !issue.startsWith("DUPLICATE_STEM:"));

  for (const ql of COM003_PERMANENT_QLS) {
    const questions = COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.filter((question) => question.qlId === ql.qlId);
    if (questions.length !== 12) issues.push(`FINAL_COUNT:${ql.qlId}:${questions.length}`);
    if (new Set(questions.map((question) => question.stem.toLowerCase())).size !== questions.length) {
      issues.push(`FINAL_DUPLICATE_STEM:${ql.qlId}`);
    }
  }

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

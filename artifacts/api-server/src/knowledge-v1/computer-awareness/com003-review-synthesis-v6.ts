import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { generateCom003ReviewQuestionV5 } from "./com003-review-synthesis-v5";
import type { Com003ReviewQuestion } from "./com003-review-types";

function sentenceCase(value: string) {
  const trimmed = value.trim();
  return trimmed ? `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}` : trimmed;
}

function lowerFirst(value: string) {
  const trimmed = value.trim();
  return trimmed ? `${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}` : trimmed;
}

function applicationForQl(qlId: string) {
  const qlNumber = Number(qlId.match(/QL-(\d{3})$/)?.[1] ?? 0);
  if (qlNumber <= 3) return "Microsoft Office" as const;
  if (qlNumber <= 7) return "Microsoft Word" as const;
  if (qlNumber <= 14) return "Microsoft Excel" as const;
  return "Microsoft PowerPoint" as const;
}

function stripLeadingApplicationContext(stem: string) {
  return stem
    .trim()
    .replace(/^In Windows desktop Microsoft (?:Office|Word|Excel|PowerPoint),\s*/i, "")
    .replace(/^In Microsoft (?:Office|Word|Excel|PowerPoint),\s*/i, "")
    .replace(/^In (?:Word|Excel|PowerPoint),\s*/i, "");
}

function nonVersionContext(application: ReturnType<typeof applicationForQl>, bucket: number) {
  if (bucket === 1) return `In ${application}, `;
  if (bucket === 2) {
    if (application === "Microsoft Office") return "While using a Microsoft Office application, ";
    if (application === "Microsoft Word") return "While working in Microsoft Word, ";
    if (application === "Microsoft Excel") return "While working in Microsoft Excel, ";
    return "While working in Microsoft PowerPoint, ";
  }
  if (application === "Microsoft Office") return "In the Microsoft Office suite, ";
  if (application === "Microsoft Word") return "In the Microsoft Word application, ";
  if (application === "Microsoft Excel") return "In the Microsoft Excel application, ";
  return "In the Microsoft PowerPoint application, ";
}

function versionContext(application: ReturnType<typeof applicationForQl>, bucket: number) {
  if (bucket === 1) return `While using ${application} on Windows desktop, `;
  if (bucket === 2) return `On Windows desktop in ${application}, `;
  return `For ${application} on Windows desktop, `;
}

function diversifyStem(question: Com003ReviewQuestion, index: number) {
  const base = sentenceCase(question.stem);
  const bucket = Math.floor(index / 3);
  if (bucket === 0) return base;

  const application = applicationForQl(question.qlId);
  const bare = lowerFirst(stripLeadingApplicationContext(base));
  const prefix = question.versionScoped
    ? versionContext(application, bucket)
    : nonVersionContext(application, bucket);
  return sentenceCase(`${prefix}${bare}`);
}

export function generateCom003ReviewQuestionV6(qlId: string, seed: string, index = 0): Com003ReviewQuestion {
  const base = generateCom003ReviewQuestionV5(qlId, seed, index);
  return {
    ...base,
    questionId: base.questionId.replace("COM003-REVIEW-V5-", "COM003-REVIEW-V6-"),
    stem: diversifyStem(base, index),
  };
}

export function buildCom003EnglishReviewCorpusV6(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v6";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 50) throw new Error("perQl must be between 1 and 50");
  return COM003_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: perQl }, (_, index) =>
      generateCom003ReviewQuestionV6(ql.qlId, `${seedPrefix}:${ql.qlId}:${index}`, index),
    ),
  );
}

export const COM003_ENGLISH_REVIEW_CORPUS_V6 = buildCom003EnglishReviewCorpusV6();

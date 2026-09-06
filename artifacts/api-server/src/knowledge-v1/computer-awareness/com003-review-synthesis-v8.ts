import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { generateCom003ReviewQuestionV7, type Com003ReviewQuestionV7 } from "./com003-review-synthesis-v7";

export type Com003ReviewQuestionV8 = Omit<Com003ReviewQuestionV7, "stemAuthority"> & {
  stemAuthority: "COM003_V8_DEEP_EXAM_SURFACE_AUTHORITY";
};

function appForQl(qlId: string) {
  const n = Number(qlId.match(/QL-(\d{3})$/)?.[1] ?? 0);
  if (n <= 3) return "Microsoft Office";
  if (n <= 7) return "Microsoft Word";
  if (n <= 15) return "Microsoft Excel";
  return "Microsoft PowerPoint";
}

function lowerFirst(value: string) {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;
}

function hardenStem(question: Com003ReviewQuestionV7) {
  let stem = question.stem.trim().replace(/\s+/g, " ");
  const isShortcutSurface = /SHORTCUT|SLIDESHOW/i.test(question.surfaceMode);
  if (question.versionScoped && isShortcutSurface && !/Windows desktop/i.test(stem)) {
    stem = `In Windows desktop ${appForQl(question.qlId)}, ${lowerFirst(stem)}`;
  }
  stem = stem.replace(/\.\?$/, "?").replace(/\?{2,}$/, "?");
  if (!stem.endsWith("?")) stem = stem.replace(/[.]$/, "") + "?";
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

export function generateCom003ReviewQuestionV8(qlId: string, seed: string, index = 0): Com003ReviewQuestionV8 {
  const base = generateCom003ReviewQuestionV7(qlId, seed, index);
  return {
    ...base,
    questionId: base.questionId.replace("COM003-REVIEW-V7-", "COM003-REVIEW-V8-"),
    stem: hardenStem(base),
    stemAuthority: "COM003_V8_DEEP_EXAM_SURFACE_AUTHORITY",
  };
}

export function buildCom003EnglishReviewCorpusV8(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v8";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 48) throw new Error("perQl must be between 1 and 48");
  return COM003_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: perQl }, (_, index) => generateCom003ReviewQuestionV8(ql.qlId, `${seedPrefix}:${ql.qlId}:${index}`, index)),
  );
}

export const COM003_ENGLISH_REVIEW_CORPUS_V8 = buildCom003EnglishReviewCorpusV8();

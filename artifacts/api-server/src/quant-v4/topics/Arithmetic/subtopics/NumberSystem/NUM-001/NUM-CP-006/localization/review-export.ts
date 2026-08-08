import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP006_PERMANENT_ALLOCATION } from "../permanent/allocation";
import { generateNumCp006LocalizedQuestion } from "./runtime";
import type { NumCp006TranslatedLocale } from "./types";

const locales = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp006TranslatedLocale[];
const questionsPerQl = 3;
const rows = locales.flatMap((locale) => NUM_CP006_PERMANENT_ALLOCATION.flatMap((allocation) =>
  Array.from({ length: questionsPerQl }, (_, index) => generateNumCp006LocalizedQuestion({
    questionLanguageId: allocation.qlId,
    seed: index + 1,
    locale,
  })),
));
const outDir = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outDir, { recursive: true });
const jsonPath = join(outDir, "num-001-cp006-hi-pa-review.json");
const csvPath = join(outDir, "num-001-cp006-hi-pa-review.csv");
const mdPath = join(outDir, "num-001-cp006-hi-pa-review.md");
writeFileSync(jsonPath, JSON.stringify(rows, null, 2));
const csvCell = (value: unknown) => `"${String(value).replace(/"/g, '""')}"`;
writeFileSync(csvPath, [
  ["locale", "questionLanguageId", "seed", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctIndex", "canonicalAnswer"].map(csvCell).join(","),
  ...rows.map((question) => [question.locale, question.questionLanguageId, question.seed, question.difficulty, question.stem, ...question.options.map((option) => option.value), question.correctIndex, question.canonicalAnswer].map(csvCell).join(",")),
].join("\n"));
writeFileSync(mdPath, [
  "# NUM-CP-006 Hindi/Punjabi Review Pack",
  "",
  `Questions: ${rows.length}`,
  "",
  ...rows.flatMap((question) => [
    `## ${question.locale} · ${question.questionLanguageId} · Seed ${question.seed}`,
    "",
    question.stem,
    "",
    ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`),
    "",
    `**${question.explanation.finalAnswer}**`,
    "",
  ]),
].join("\n"));
console.log(JSON.stringify({ status: "PASS_NUM_CP006_HI_PA_REVIEW_EXPORT", translatedLocaleCount: locales.length, permanentQlCount: NUM_CP006_PERMANENT_ALLOCATION.length, questionsPerQl, exportedQuestions: rows.length, jsonPath, csvPath, mdPath }, null, 2));

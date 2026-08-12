import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP007_PERMANENT_ALLOCATION } from "../permanent/allocation.ts";
import { generateNumCp007LocalizedQuestion } from "./runtime.ts";
import type { NumCp007TranslatedLocale } from "./types.ts";

const locales = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp007TranslatedLocale[];
const questionsPerQl = 4;
const rows = locales.flatMap((locale) => NUM_CP007_PERMANENT_ALLOCATION.flatMap((allocation) =>
  Array.from({ length: questionsPerQl }, (_, index) => generateNumCp007LocalizedQuestion({
    questionLanguageId: allocation.qlId,
    seed: index + 1,
    locale,
  })),
));

const outDir = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outDir, { recursive: true });
const jsonPath = join(outDir, "num-002-cp007-hi-pa-review.json");
const csvPath = join(outDir, "num-002-cp007-hi-pa-review.csv");
const mdPath = join(outDir, "num-002-cp007-hi-pa-review.md");
writeFileSync(jsonPath, JSON.stringify(rows, null, 2));

const csvCell = (value: unknown) => `"${String(value).replace(/"/g, '""')}"`;
writeFileSync(csvPath, [
  ["locale", "questionLanguageId", "prototype", "seed", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctIndex", "canonicalAnswer", "coreConcept", "strategy", "steps", "finalAnswer"].map(csvCell).join(","),
  ...rows.map((question) => [
    question.locale,
    question.questionLanguageId,
    question.temporaryPrototypeId,
    question.seed,
    question.difficulty,
    question.stem,
    ...question.options.map((option) => option.value),
    question.correctIndex,
    question.canonicalAnswer,
    question.explanation.coreConcept,
    question.explanation.strategy,
    question.explanation.steps.join(" | "),
    question.explanation.finalAnswer,
  ].map(csvCell).join(",")),
].join("\n"));

writeFileSync(mdPath, [
  "# NUM-CP-007 Hindi/Punjabi Review Pack",
  "",
  `Questions: ${rows.length}`,
  "",
  ...rows.flatMap((question) => [
    `## ${question.locale} · ${question.questionLanguageId} · ${question.temporaryPrototypeId} · Seed ${question.seed}`,
    "",
    question.stem,
    "",
    ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`),
    "",
    `**Core concept:** ${question.explanation.coreConcept}`,
    "",
    `**Strategy:** ${question.explanation.strategy}`,
    "",
    ...question.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    `**${question.explanation.finalAnswer}**`,
    "",
  ]),
].join("\n"));

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_HI_PA_REVIEW_EXPORT",
  translatedLocaleCount: locales.length,
  permanentQlCount: NUM_CP007_PERMANENT_ALLOCATION.length,
  sourcePrototypeCount: new Set(rows.map((question) => question.temporaryPrototypeId)).size,
  questionsPerQl,
  exportedQuestions: rows.length,
  jsonPath,
  csvPath,
  mdPath,
}, null, 2));

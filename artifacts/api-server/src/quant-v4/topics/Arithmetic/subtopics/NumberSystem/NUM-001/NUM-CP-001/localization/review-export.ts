import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP001_PERMANENT_ALLOCATION } from "../permanent/allocation";
import { runNumCp001LocalizedPipeline } from "./runtime";
import type { NumCp001TranslatedLocale } from "./types";

const locales = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp001TranslatedLocale[];
const questionsPerQl = 4;
const rows = locales.flatMap((locale) => NUM_CP001_PERMANENT_ALLOCATION.flatMap((allocation) =>
  Array.from({ length: questionsPerQl }, (_, index) => runNumCp001LocalizedPipeline({
    questionLanguageId: allocation.qlId,
    seed: index + 1,
    locale,
  })),
));

const outDir = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outDir, { recursive: true });
const jsonPath = join(outDir, "num-001-cp001-hi-pa-review.json");
const csvPath = join(outDir, "num-001-cp001-hi-pa-review.csv");
const mdPath = join(outDir, "num-001-cp001-hi-pa-review.md");
writeFileSync(jsonPath, JSON.stringify(rows, null, 2));

const csvCell = (value: unknown) => `"${String(value).replace(/"/g, '""')}"`;
writeFileSync(csvPath, [
  ["locale", "questionLanguageId", "prototype", "seed", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctIndex", "canonicalAnswer", "coreConcept", "strategy", "steps", "speedMethod", "commonTraps", "finalAnswer"].map(csvCell).join(","),
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
    question.explanation.coreConcept.join(" | "),
    question.explanation.givenDataAndStrategy.join(" | "),
    question.explanation.stepByStep.join(" | "),
    question.explanation.examSpeedMethod.join(" | "),
    question.explanation.commonTraps.join(" | "),
    question.explanation.finalAnswer,
  ].map(csvCell).join(",")),
].join("\n"));

writeFileSync(mdPath, [
  "# NUM-CP-001 Hindi/Punjabi Review Pack",
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
    `**Core concept:** ${question.explanation.coreConcept.join(" ")}`,
    "",
    `**Strategy:** ${question.explanation.givenDataAndStrategy.join(" ")}`,
    "",
    ...question.explanation.stepByStep.map((step, index) => `${index + 1}. ${step}`),
    "",
    `**Speed method:** ${question.explanation.examSpeedMethod.join(" ")}`,
    "",
    `**Common traps:** ${question.explanation.commonTraps.join(" ")}`,
    "",
    `**${question.explanation.finalAnswer}**`,
    "",
  ]),
].join("\n"));

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_HI_PA_REVIEW_EXPORT",
  translatedLocaleCount: locales.length,
  permanentQlCount: NUM_CP001_PERMANENT_ALLOCATION.length,
  sourcePrototypeCount: new Set(rows.map((question) => question.temporaryPrototypeId)).size,
  questionsPerQl,
  exportedQuestions: rows.length,
  jsonPath,
  csvPath,
  mdPath,
}, null, 2));

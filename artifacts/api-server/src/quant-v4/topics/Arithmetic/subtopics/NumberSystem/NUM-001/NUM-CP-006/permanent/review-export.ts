import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP006_PERMANENT_ALLOCATION } from "./allocation";
import { runNumCp006PermanentPipeline } from "./runtime";

const questionsPerQl = 5;
const rows = NUM_CP006_PERMANENT_ALLOCATION.flatMap((allocation) =>
  Array.from({ length: questionsPerQl }, (_, index) => runNumCp006PermanentPipeline({
    questionLanguageId: allocation.qlId,
    seed: index + 1,
  })),
);

const outDir = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outDir, { recursive: true });
const jsonPath = join(outDir, "num-001-cp006-permanent-english-review.json");
const csvPath = join(outDir, "num-001-cp006-permanent-english-review.csv");
const mdPath = join(outDir, "num-001-cp006-permanent-english-review.md");
writeFileSync(jsonPath, JSON.stringify(rows, null, 2));
const csvCell = (value: unknown) => `"${String(value).replace(/"/g, '""')}"`;
writeFileSync(csvPath, [
  ["questionLanguageId", "seed", "difficulty", "prototype", "stem", "optionA", "optionB", "optionC", "optionD", "correctIndex", "canonicalAnswer", "explanation"].map(csvCell).join(","),
  ...rows.map((question) => [
    question.questionLanguageId, question.seed, question.difficulty, question.temporaryPrototypeId,
    question.stem, ...question.options.map((option) => option.value), question.correctIndex,
    question.canonicalAnswer, JSON.stringify(question.explanation),
  ].map(csvCell).join(",")),
].join("\n"));
writeFileSync(mdPath, [
  "# NUM-CP-006 Permanent English Review Pack",
  "",
  `Questions: ${rows.length}`,
  `Permanent QLs: ${NUM_CP006_PERMANENT_ALLOCATION.length}`,
  "",
  ...rows.flatMap((question) => [
    `## ${question.questionLanguageId} · Seed ${question.seed} · ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`),
    "",
    `**Answer:** ${question.canonicalAnswer}`,
    "",
    `**Concept:** ${question.explanation.coreConcept}`,
    "",
    ...question.explanation.stepByStep.map((step, index) => `${index + 1}. ${step}`),
    "",
  ]),
].join("\n"));
console.log(JSON.stringify({ status: "PASS_NUM_CP006_ENGLISH_REVIEW_EXPORT", permanentQlCount: NUM_CP006_PERMANENT_ALLOCATION.length, questionsPerQl, exportedQuestions: rows.length, jsonPath, csvPath, mdPath }, null, 2));

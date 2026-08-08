import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateNumCp007Wave01Package } from "./runtime.ts";
import { NUM_CP007_WAVE01_PROTOTYPE_IDS } from "./types.ts";

const questions = NUM_CP007_WAVE01_PROTOTYPE_IDS.flatMap((prototypeId, prototypeIndex) =>
  [1, 2, 3].map((offset) => generateNumCp007Wave01Package(prototypeId, prototypeIndex * 37 + offset)),
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = resolve(outputDirectory, "num-002-cp007-wave01-review.json");
const csvPath = resolve(outputDirectory, "num-002-cp007-wave01-review.csv");
const mdPath = resolve(outputDirectory, "num-002-cp007-wave01-review.md");

writeFileSync(jsonPath, JSON.stringify(questions, null, 2), "utf8");

const csvHeaders = ["prototypeId", "seed", "difficulty", "answerSemantic", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "coreConcept", "strategy", "steps"];
const escapeCsv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvRows = questions.map((question) => [
  question.temporaryPrototypeId,
  question.seed,
  question.difficulty,
  question.answerSemantic,
  question.stem,
  ...question.options.map((option) => option.value),
  question.canonicalAnswer,
  question.explanation.coreConcept,
  question.explanation.strategy,
  question.explanation.steps.join(" | "),
].map(escapeCsv).join(","));
writeFileSync(csvPath, [csvHeaders.join(","), ...csvRows].join("\n"), "utf8");

const markdown = [
  "# NUM-CP-007 Wave 01 English Review Pack",
  "",
  "**Status:** executable discovery only; no permanent QL allocation  ",
  "**Questions:** 24  ",
  "**Prototype families:** 8  ",
  "**Next available permanent identity:** `NUM-QL-098` (not allocated)",
  "",
  ...questions.flatMap((question, index) => [
    `## ${index + 1}. ${question.temporaryPrototypeId} — ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option.value}`),
    "",
    `**Answer:** ${question.canonicalAnswer}`,
    "",
    `**Concept:** ${question.explanation.coreConcept}`,
    "",
    `**Strategy:** ${question.explanation.strategy}`,
    "",
    "**Working:**",
    ...question.explanation.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
  ]),
].join("\n");
writeFileSync(mdPath, markdown, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_WAVE01_REVIEW_EXPORT",
  temporaryPrototypeCount: NUM_CP007_WAVE01_PROTOTYPE_IDS.length,
  questionsPerPrototype: 3,
  exportedQuestions: questions.length,
  permanentQlCount: 0,
  jsonPath,
  csvPath,
  mdPath,
}, null, 2));

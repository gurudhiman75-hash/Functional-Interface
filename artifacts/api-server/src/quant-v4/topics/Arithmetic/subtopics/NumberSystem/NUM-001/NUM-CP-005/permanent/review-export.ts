import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP005_PERMANENT_ALLOCATION } from "./allocation";
import { runNumCp005PermanentPipeline } from "./runtime";

const questions = NUM_CP005_PERMANENT_ALLOCATION.flatMap((allocation) =>
  [1, 2, 3].map((seed) => runNumCp005PermanentPipeline({
    questionLanguageId: allocation.qlId,
    seed,
  })),
);

const outputDirectory = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = join(outputDirectory, "num-001-cp005-permanent-english-review.json");
const markdownPath = join(outputDirectory, "num-001-cp005-permanent-english-review.md");
const csvPath = join(outputDirectory, "num-001-cp005-permanent-english-review.csv");

writeFileSync(jsonPath, JSON.stringify(questions, null, 2));

const markdown = questions.map((question) => [
  `## ${question.questionLanguageId} — seed ${question.seed}`,
  "",
  `- Authority: ${question.authorityId}`,
  `- Solve mode: ${question.solveModeId}`,
  `- Runtime prototype: ${question.temporaryPrototypeId}`,
  `- Difficulty: ${question.difficulty}`,
  `- Semantic: ${question.answerSemantic}`,
  `- Representation: ${question.representation}`,
  "",
  question.stem,
  "",
  ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`),
  "",
  `**Answer:** ${question.canonicalAnswer}`,
  "",
  `**Core concept:** ${question.explanation.coreConcept}`,
  "",
  `**Strategy:** ${question.explanation.givenDataAndStrategy}`,
  "",
  ...question.explanation.stepByStep.map((step, index) => `${index + 1}. ${step}`),
  "",
  `**Exam-speed method:** ${question.explanation.examSpeedMethod}`,
  "",
  ...question.explanation.commonTraps.map((trap) => `- ${trap}`),
  "",
  `**Final answer:** ${question.explanation.finalAnswer}`,
].join("\n")).join("\n\n---\n\n");
writeFileSync(markdownPath, markdown);

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}
const csvRows = [
  ["qlId", "seed", "authorityId", "solveModeId", "prototypeId", "difficulty", "semantic", "representation", "stem", "answer"],
  ...questions.map((question) => [
    question.questionLanguageId,
    question.seed,
    question.authorityId,
    question.solveModeId,
    question.temporaryPrototypeId,
    question.difficulty,
    question.answerSemantic,
    question.representation,
    question.stem,
    question.canonicalAnswer,
  ]),
].map((row) => row.map(csvCell).join(",")).join("\n");
writeFileSync(csvPath, csvRows);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_PERMANENT_ENGLISH_REVIEW_EXPORT",
  permanentQlCount: NUM_CP005_PERMANENT_ALLOCATION.length,
  reviewQuestionCount: questions.length,
  jsonPath,
  markdownPath,
  csvPath,
}, null, 2));

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP001_PERMANENT_ALLOCATION } from "./allocation";
import { runNumCp001PermanentPipeline } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const questionsPerQl = 4;
const questions = NUM_CP001_PERMANENT_ALLOCATION.flatMap((allocation) =>
  Array.from({ length: questionsPerQl }, (_unused, index) => runNumCp001PermanentPipeline({
    questionLanguageId: allocation.qlId,
    seed: index + 1,
  })),
);

const questionFingerprints = questions.map((question) => JSON.stringify({
  qlId: question.questionLanguageId,
  stem: question.stem,
  options: question.options.map((option) => option.value),
  answer: question.canonicalAnswer,
}));
assert(new Set(questionFingerprints).size === questions.length, "review export contains duplicate question records");
assert(questions.every((question) => question.verifierAnswer === question.canonicalAnswer), "review export verifier mismatch");
assert(questions.every((question) => question.options.length === 4), "review export option-count mismatch");
assert(new Set(questions.map((question) => question.questionLanguageId)).size === 21, "review export QL coverage mismatch");
assert(new Set(questions.map((question) => question.temporaryPrototypeId)).size === 26, "review export prototype coverage mismatch");

const outputDirectory = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = join(outputDirectory, "num-001-cp001-permanent-english-review.json");
const markdownPath = join(outputDirectory, "num-001-cp001-permanent-english-review.md");
const csvPath = join(outputDirectory, "num-001-cp001-permanent-english-review.csv");

writeFileSync(jsonPath, JSON.stringify(questions, null, 2));

const markdownHeader = [
  "# NUM-CP-001 — Permanent English Freeze Review Pack",
  "",
  `- Permanent QLs: ${NUM_CP001_PERMANENT_ALLOCATION.length}`,
  `- Questions per QL: ${questionsPerQl}`,
  `- Total review questions: ${questions.length}`,
  "- Status: permanent English implementation frozen; all delivery gates remain closed",
  "",
  "---",
  "",
].join("\n");

const markdownBody = questions.map((question) => [
  `## ${question.questionLanguageId} — seed ${question.seed}`,
  "",
  `- Authority: ${question.proposalId}`,
  `- Solve mode: ${question.solveModeId}`,
  `- Runtime prototype: ${question.temporaryPrototypeId}`,
  `- Difficulty: ${question.difficulty}`,
  `- Semantic: ${question.answerSemantic}`,
  "",
  question.stem,
  "",
  ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`),
  "",
  `**Answer:** ${question.canonicalAnswer}`,
  "",
  `**Core concept:** ${question.explanation.coreConcept.join(" ")}`,
  "",
  `**Strategy:** ${question.explanation.givenDataAndStrategy.join(" ")}`,
  "",
  ...question.explanation.stepByStep.map((step, index) => `${index + 1}. ${step}`),
  "",
  `**Exam-speed method:** ${question.explanation.examSpeedMethod.join(" ")}`,
  "",
  `**Common traps:** ${question.explanation.commonTraps.join(" | ")}`,
  "",
  `**Final answer:** ${question.explanation.finalAnswer}`,
].join("\n")).join("\n\n---\n\n");
writeFileSync(markdownPath, `${markdownHeader}${markdownBody}`);

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}
const csvRows = [
  ["qlId", "seed", "authorityId", "solveModeId", "prototypeId", "difficulty", "semantic", "stem", "answer"],
  ...questions.map((question) => [
    question.questionLanguageId,
    question.seed,
    question.proposalId,
    question.solveModeId,
    question.temporaryPrototypeId,
    question.difficulty,
    question.answerSemantic,
    question.stem,
    question.canonicalAnswer,
  ]),
].map((row) => row.map(csvCell).join(",")).join("\n");
writeFileSync(csvPath, csvRows);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_PERMANENT_ENGLISH_REVIEW_EXPORT",
  permanentQlCount: NUM_CP001_PERMANENT_ALLOCATION.length,
  questionsPerQl,
  reviewQuestionCount: questions.length,
  representedAuthorities: new Set(questions.map((question) => question.proposalId)).size,
  representedRuntimePrototypes: new Set(questions.map((question) => question.temporaryPrototypeId)).size,
  jsonPath,
  markdownPath,
  csvPath,
}, null, 2));

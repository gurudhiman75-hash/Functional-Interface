import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP007_PERMANENT_ALLOCATION } from "./allocation.ts";
import { runNumCp007PermanentPipeline } from "./runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const questionsPerQl = 6;
const questions = NUM_CP007_PERMANENT_ALLOCATION.flatMap((allocation) =>
  Array.from({ length: questionsPerQl }, (_unused, index) => runNumCp007PermanentPipeline({
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

const outputDirectory = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = join(outputDirectory, "num-002-cp007-permanent-english-review.json");
const markdownPath = join(outputDirectory, "num-002-cp007-permanent-english-review.md");
const csvPath = join(outputDirectory, "num-002-cp007-permanent-english-review.csv");

writeFileSync(jsonPath, JSON.stringify(questions, null, 2));

const markdownHeader = [
  "# NUM-CP-007 — Permanent English Freeze Review Pack",
  "",
  `- Permanent QLs: ${NUM_CP007_PERMANENT_ALLOCATION.length}`,
  `- Questions per QL: ${questionsPerQl}`,
  `- Total review questions: ${questions.length}`,
  "- Status: product-owner approved permanent identities; all delivery gates remain closed",
  "",
  "---",
  "",
].join("\n");

const markdownBody = questions.map((question) => [
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
  `**Strategy:** ${question.explanation.strategy}`,
  "",
  ...question.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
  "",
  `**Final answer:** ${question.explanation.finalAnswer}`,
].join("\n")).join("\n\n---\n\n");
writeFileSync(markdownPath, `${markdownHeader}${markdownBody}`);

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
  status: "PASS_NUM_CP007_PERMANENT_ENGLISH_REVIEW_EXPORT",
  permanentQlCount: NUM_CP007_PERMANENT_ALLOCATION.length,
  questionsPerQl,
  reviewQuestionCount: questions.length,
  representedAuthorities: new Set(questions.map((question) => question.authorityId)).size,
  representedRuntimePrototypes: new Set(questions.map((question) => question.temporaryPrototypeId)).size,
  jsonPath,
  markdownPath,
  csvPath,
}, null, 2));

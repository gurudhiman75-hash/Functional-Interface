// @ts-nocheck
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP004_PERMANENT_QL_IDS, getNumCp004PermanentAllocation } from "./allocation";
import { runNumCp004PermanentPipeline } from "./runtime";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const rows = NUM_CP004_PERMANENT_QL_IDS.flatMap((qlId) =>
  [1, 2, 3].map((seed) => ({
    allocation: getNumCp004PermanentAllocation(qlId),
    question: runNumCp004PermanentPipeline({ questionLanguageId: qlId, seed }),
  })),
);
const jsonPath = resolve(outputDirectory, "num-001-cp004-permanent-english-review.json");
const csvPath = resolve(outputDirectory, "num-001-cp004-permanent-english-review.csv");
const markdownPath = resolve(outputDirectory, "num-001-cp004-permanent-english-review.md");

writeFileSync(jsonPath, `${JSON.stringify({
  status: "NUM_CP004_PERMANENT_ENGLISH_REVIEW_CORPUS",
  permanentQlRange: "NUM-QL-018..NUM-QL-045",
  permanentQlCount: NUM_CP004_PERMANENT_QL_IDS.length,
  reviewQuestionCount: rows.length,
  lifecycle: "INACTIVE_ENGLISH_IMPLEMENTATION_FREEZE",
  rows,
}, null, 2)}\n`, "utf8");

const csvEscape = (value) => `"${String(value).replaceAll('"', '""')}"`;
const csv = [
  ["qlId", "qlTemplateId", "title", "solveModeId", "seed", "difficulty", "answerSemantic", "representation", "stem", "options", "answer", "fingerprint"].join(","),
  ...rows.map(({ allocation, question }) => [
    allocation.qlId,
    allocation.qlTemplateId,
    allocation.title,
    allocation.solveModeId,
    question.seed,
    question.difficulty,
    question.answerSemantic,
    allocation.representation,
    question.stem,
    question.options.map((option, index) => `${String.fromCharCode(65 + index)}:${option.value}${option.isCorrect ? "*" : ""}`).join(" | "),
    question.canonicalAnswer,
    question.mathematicalFingerprint,
  ].map(csvEscape).join(",")),
].join("\n");
writeFileSync(csvPath, `${csv}\n`, "utf8");

const normaliseMath = (value) => String(value)
  .replace(/n−1/g, "$n - 1$")
  .replace(/n\+1/g, "$n + 1$")
  .replace(/\u2212/g, "-");

const markdown = [
  "# NUM-CP-004 — Permanent English Review Corpus",
  "",
  "**Range:** `NUM-QL-018..NUM-QL-045`",
  "",
  "**Lifecycle:** permanently identified English implementation; inactive and absent from Question Studio, Question Bank, tests and public delivery.",
  "",
  ...rows.flatMap(({ allocation, question }, index) => [
    `## ${index + 1}. ${allocation.qlId} — ${allocation.title}`,
    "",
    `**Solve mode:** \`${allocation.solveModeId}\``,
    "",
    `**Seed / difficulty / representation:** ${question.seed} / ${question.difficulty} / ${allocation.representation}`,
    "",
    "### Question",
    "",
    normaliseMath(question.stem).replace(/\n/g, "  \n"),
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${normaliseMath(option.value)}${option.isCorrect ? " **✓**" : ""}`),
    "",
    `**Correct answer:** ${normaliseMath(question.canonicalAnswer)}`,
    "",
    "### 📌 Core Concept",
    "",
    ...question.explanation.coreConcept.map((line) => normaliseMath(line)),
    "",
    ...question.explanation.givenDataAndStrategy.map((line) => `**Approach:** ${normaliseMath(line)}`),
    "",
    "### 📝 Step-by-Step Solution",
    "",
    ...question.explanation.stepByStep.map((line, stepIndex) => `${stepIndex + 1}. ${normaliseMath(line)}`),
    "",
    "### ⚡ Exam Speed Shortcut",
    "",
    ...question.explanation.examSpeedMethod.map((line) => normaliseMath(line)),
    "",
    "### ⚠️ Common Traps & Student Warnings",
    "",
    ...question.explanation.commonTraps.map((line) => `- ${normaliseMath(line)}`),
    "",
    `**Final answer:** ${normaliseMath(question.explanation.finalAnswer)}`,
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_PERMANENT_ENGLISH_REVIEW_EXPORT",
  jsonPath,
  csvPath,
  markdownPath,
  permanentQlCount: NUM_CP004_PERMANENT_QL_IDS.length,
  reviewQuestionCount: rows.length,
}, null, 2));

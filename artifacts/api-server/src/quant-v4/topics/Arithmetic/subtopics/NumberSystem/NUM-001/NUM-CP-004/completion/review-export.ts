// @ts-nocheck
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP004_RETAINED_TEMPLATE_IDS } from "./types";
import { getNumCp004RetainedTemplate } from "./template-registry";
import { generateNumCp004RetainedQuestion } from "./runtime";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const rows = NUM_CP004_RETAINED_TEMPLATE_IDS.flatMap((templateId) =>
  [1, 2, 3].map((seed) => {
    const question = generateNumCp004RetainedQuestion(templateId, seed);
    const template = getNumCp004RetainedTemplate(templateId);
    return {
      ...question,
      retainedTitle: template.title,
      solveModeId: template.solveModeId,
      taskDirection: template.taskDirection,
      representation: template.representation,
      targetProjection: template.targetProjection,
    };
  }),
);

const jsonPath = resolve(outputDirectory, "num-001-cp004-completion-review.json");
const csvPath = resolve(outputDirectory, "num-001-cp004-completion-review.csv");
const markdownPath = resolve(outputDirectory, "num-001-cp004-completion-review.md");

writeFileSync(jsonPath, `${JSON.stringify({
  status: "NUM_CP004_COMPLETION_ENGLISH_REVIEW_CORPUS",
  retainedTemplateCount: NUM_CP004_RETAINED_TEMPLATE_IDS.length,
  reviewQuestionCount: rows.length,
  proposedPermanentRange: "NUM-QL-018..NUM-QL-045",
  permanentQlCountAtRetainedStage: 0,
  rows,
}, null, 2)}\n`, "utf8");

const csvEscape = (value) => `"${String(value).replaceAll('"', '""')}"`;
const csv = [
  [
    "temporaryTemplateId",
    "retainedTitle",
    "solveModeId",
    "seed",
    "difficulty",
    "answerSemantic",
    "taskDirection",
    "representation",
    "stem",
    "options",
    "canonicalAnswer",
    "verifierAnswer",
    "mathematicalFingerprint",
  ].join(","),
  ...rows.map((row) => [
    row.temporaryTemplateId,
    row.retainedTitle,
    row.solveModeId,
    row.seed,
    row.difficulty,
    row.answerSemantic,
    row.taskDirection,
    row.representation,
    row.stem,
    row.options.map((option, index) =>
      `${String.fromCharCode(65 + index)}:${option.value}${option.isCorrect ? "*" : ""}`,
    ).join(" | "),
    row.canonicalAnswer,
    row.verifierAnswer,
    row.mathematicalFingerprint,
  ].map(csvEscape).join(",")),
].join("\n");
writeFileSync(csvPath, `${csv}\n`, "utf8");

const markdown = [
  "# NUM-CP-004 — Completion English Review Corpus",
  "",
  "**Lifecycle:** retained English freeze evidence; no Question Studio, Question Bank, test or public route.",
  "",
  `**Retained templates:** ${NUM_CP004_RETAINED_TEMPLATE_IDS.length}`,
  "",
  `**Review questions:** ${rows.length}`,
  "",
  "**Proposed permanent range:** `NUM-QL-018..NUM-QL-045`",
  "",
  ...rows.flatMap((row, index) => [
    `## ${index + 1}. ${row.temporaryTemplateId} — ${row.retainedTitle}`,
    "",
    `**Solve mode:** \`${row.solveModeId}\``,
    "",
    `**Seed / difficulty:** ${row.seed} / ${row.difficulty}`,
    "",
    `**Direction / representation:** ${row.taskDirection} / ${row.representation}`,
    "",
    row.stem,
    "",
    ...row.options.map((option, optionIndex) =>
      `${String.fromCharCode(65 + optionIndex)}. ${option.value}${option.isCorrect ? " **✓**" : ""}`,
    ),
    "",
    `**Correct answer:** ${row.canonicalAnswer}`,
    "",
    "### Core concept",
    "",
    ...row.explanation.coreConcept.map((line) => `- ${line}`),
    "",
    "### Given data and strategy",
    "",
    ...row.explanation.givenDataAndStrategy.map((line) => `- ${line}`),
    "",
    "### Step-by-step solution",
    "",
    ...row.explanation.stepByStep.map((line, stepIndex) => `${stepIndex + 1}. ${line}`),
    "",
    "### Exam speed method",
    "",
    ...row.explanation.examSpeedMethod.map((line) => `- ${line}`),
    "",
    "### Option-specific traps",
    "",
    ...row.explanation.commonTraps.map((line) => `- ${line}`),
    "",
    `**Final answer:** ${row.explanation.finalAnswer}`,
    "",
    "<details><summary>Reviewer-only trace</summary>",
    "",
    "```json",
    JSON.stringify({
      hiddenState: row.hiddenState,
      sourceAncestry: row.sourceAncestry,
      prototypeAncestry: row.prototypeAncestry,
      mathematicalFingerprint: row.mathematicalFingerprint,
      lifecycle: row.lifecycle,
    }, null, 2),
    "```",
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

writeFileSync(markdownPath, `${markdown}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_COMPLETION_REVIEW_EXPORT",
  jsonPath,
  csvPath,
  markdownPath,
  retainedTemplateCount: NUM_CP004_RETAINED_TEMPLATE_IDS.length,
  reviewQuestionCount: rows.length,
  permanentQlCountAtRetainedStage: 0,
}, null, 2));

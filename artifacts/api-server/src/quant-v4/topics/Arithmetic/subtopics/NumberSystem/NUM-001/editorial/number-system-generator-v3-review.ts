// @ts-nocheck
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS,
  NUM_CP003_CP004_STAGING_LIFECYCLE,
} from "./combined-review-export";
import {
  buildNumberSystemTeacherExplanation,
  correctAnswerDisplay,
  renderNumberSystemV3Option,
  renderTeacherExplanationMarkdown,
} from "./simple-teacher-voice";
import {
  NUMBER_SYSTEM_GENERATOR_MODEL,
  buildExamReadyStem,
  titleCaseDifficulty,
} from "./number-system-generator-contract";
import { patchNumberSystemV3Text } from "./number-system-v3-editorial-patch";

function rawOptions(row): string[] {
  return row.checkpoint === "NUM-CP-003"
    ? row.question.options.map(String)
    : row.question.options.map((option) => String(option.value));
}

export const NUMBER_SYSTEM_GENERATOR_V3_CARDS = Object.freeze(
  NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.map((row, index) => {
    const teacher = buildNumberSystemTeacherExplanation(row);
    const stem = buildExamReadyStem(row, index);
    const answer = correctAnswerDisplay(row);
    return Object.freeze({
      reviewNumber: index + 1,
      checkpoint: row.checkpoint,
      qlId: row.allocation.qlId,
      title: row.title,
      difficulty: titleCaseDifficulty(row.question.difficulty),
      stemFamily: stem.family,
      stem: patchNumberSystemV3Text(stem.stem),
      options: rawOptions(row).map(renderNumberSystemV3Option),
      correctAnswer: Object.freeze({
        label: answer.label,
        value: renderNumberSystemV3Option(answer.value),
      }),
      explanation: teacher,
      lifecycle: Object.freeze({
        environment: "STAGING",
        status: "ACTIVE_STAGING",
        questionStudioStagingDiscoverable: true,
        productionQuestionStudioDiscoverable: false,
        productionQuestionBankWritable: false,
        productionTestEligible: false,
        publiclyPublishable: false,
      }),
    });
  }),
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/number-system-generator-v3");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = resolve(outputDirectory, "number-system-generator-v3-review.json");
const markdownPath = resolve(outputDirectory, "number-system-generator-v3-review.md");
const csvPath = resolve(outputDirectory, "number-system-generator-v3-review.csv");

writeFileSync(jsonPath, `${JSON.stringify({
  status: "ACTIVE_STAGING_NUMBER_SYSTEM_GENERATOR_V3",
  explanationModel: NUMBER_SYSTEM_GENERATOR_MODEL,
  questionCount: NUMBER_SYSTEM_GENERATOR_V3_CARDS.length,
  permanentQlRange: "NUM-QL-001..NUM-QL-045",
  checkpointCounts: {
    "NUM-CP-003": NUMBER_SYSTEM_GENERATOR_V3_CARDS.filter((card) => card.checkpoint === "NUM-CP-003").length,
    "NUM-CP-004": NUMBER_SYSTEM_GENERATOR_V3_CARDS.filter((card) => card.checkpoint === "NUM-CP-004").length,
  },
  lifecycle: NUM_CP003_CP004_STAGING_LIFECYCLE,
  cards: NUMBER_SYSTEM_GENERATOR_V3_CARDS,
}, null, 2)}\n`, "utf8");

const markdown = [
  "# ExamTree Number System — Generator Contract V3 Review",
  "",
  `**Explanation model:** \`${NUMBER_SYSTEM_GENERATOR_MODEL}\``,
  "",
  `**Questions:** ${NUMBER_SYSTEM_GENERATOR_V3_CARDS.length}`,
  "",
  "**Permanent QLs:** `NUM-QL-001..NUM-QL-045`",
  "",
  "**Lifecycle:** Active Staging. Production Question Studio, Question Bank, tests and publication remain disabled.",
  "",
  "---",
  "",
  ...NUMBER_SYSTEM_GENERATOR_V3_CARDS.flatMap((card) => [
    `## Q${card.reviewNumber}. ${card.qlId} — ${card.title}`,
    "",
    `**Difficulty:** ${card.difficulty}  `,
    `**Checkpoint:** \`${card.checkpoint}\`  `,
    `**Stem family:** \`${card.stemFamily}\``,
    "",
    "### Question",
    "",
    card.stem.replace(/\n/g, "  \n"),
    "",
    ...card.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
    "",
    `**Correct Answer:** ${card.correctAnswer.label}. ${card.correctAnswer.value}`,
    "",
    ...renderTeacherExplanationMarkdown(card.explanation),
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvRows = [
  ["reviewNumber", "checkpoint", "qlId", "difficulty", "stemFamily", "stem", "options", "correctAnswer", "mainRule", "stepByStepSolution", "examSpeedTrick", "commonTraps"].join(","),
  ...NUMBER_SYSTEM_GENERATOR_V3_CARDS.map((card) => [
    card.reviewNumber,
    card.checkpoint,
    card.qlId,
    card.difficulty,
    card.stemFamily,
    card.stem,
    card.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join(" | "),
    `${card.correctAnswer.label}. ${card.correctAnswer.value}`,
    card.explanation.mainRule.join("\n"),
    card.explanation.stepByStepSolution.map((step, index) => `${index + 1}. ${step}`).join("\n"),
    card.explanation.examSpeedTrick.join("\n"),
    card.explanation.commonTraps.map((trap) => `Option ${trap.optionLabel} (${trap.optionValue}): ${trap.message} [${trap.misconceptionTag}]`).join("\n"),
  ].map(csvEscape).join(",")),
].join("\n");
writeFileSync(csvPath, `${csvRows}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUMBER_SYSTEM_GENERATOR_V3_REVIEW_EXPORT",
  explanationModel: NUMBER_SYSTEM_GENERATOR_MODEL,
  questionCount: NUMBER_SYSTEM_GENERATOR_V3_CARDS.length,
  jsonPath,
  markdownPath,
  csvPath,
}, null, 2));

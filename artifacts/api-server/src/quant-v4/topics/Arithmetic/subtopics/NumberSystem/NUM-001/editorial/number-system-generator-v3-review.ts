// @ts-nocheck
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS,
} from "./combined-review-export";
import {
  buildNumberSystemTeacherExplanation,
  renderTeacherExplanationMarkdown,
} from "./simple-teacher-voice";
import {
  NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH,
  NUMBER_SYSTEM_GENERATOR_MODEL,
  buildExamReadyStem,
  formatStudentOptionValue,
  stripStudentOptionLeaks,
  titleCaseDifficulty,
} from "./number-system-generator-contract";
import {
  NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE,
} from "./number-system-question-studio-release";

function rawOptions(row): string[] {
  return row.checkpoint === "NUM-CP-003"
    ? row.question.options.map(String)
    : row.question.options.map((option) => String(option.value));
}

function safeOptions(row): string[] {
  return rawOptions(row).map((value) =>
    formatStudentOptionValue(stripStudentOptionLeaks(value)));
}

export const NUMBER_SYSTEM_GENERATOR_V3_CARDS = Object.freeze(
  NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.map((row, index) => {
    const teacher = buildNumberSystemTeacherExplanation(row);
    const stem = buildExamReadyStem(row, index);
    const options = safeOptions(row);
    const correctIndex = Number(row.question.correctIndex);
    return Object.freeze({
      reviewNumber: index + 1,
      checkpoint: row.checkpoint,
      qlId: row.allocation.qlId,
      title: row.title,
      difficulty: titleCaseDifficulty(row.question.difficulty),
      stemFamily: stem.family,
      stem: stem.stem,
      options: Object.freeze(options),
      correctAnswer: Object.freeze({
        label: String.fromCharCode(65 + correctIndex),
        value: options[correctIndex],
      }),
      explanation: teacher,
      lifecycle: Object.freeze({
        environment: "QUESTION_STUDIO",
        status: "ACTIVE_QUESTION_STUDIO",
        questionStudioStagingDiscoverable: true,
        productionQuestionStudioDiscoverable: true,
        productionQuestionBankWritable: false,
        productionTestEligible: false,
        publiclyPublishable: false,
      }),
    });
  }),
);

const outputDirectory = resolve(
  process.cwd(),
  "dist/quant-v4/number-system-generator-v3",
);
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = resolve(outputDirectory, "number-system-generator-v3-review.json");
const markdownPath = resolve(outputDirectory, "number-system-generator-v3-review.md");
const csvPath = resolve(outputDirectory, "number-system-generator-v3-review.csv");

writeFileSync(
  jsonPath,
  `${JSON.stringify({
    status: "ACTIVE_QUESTION_STUDIO_NUMBER_SYSTEM_GENERATOR_V3_1",
    explanationModel: NUMBER_SYSTEM_GENERATOR_MODEL,
    editorialPatch: NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH,
    questionCount: NUMBER_SYSTEM_GENERATOR_V3_CARDS.length,
    permanentQlRange: "NUM-QL-001..NUM-QL-045",
    checkpointCounts: {
      "NUM-CP-003": NUMBER_SYSTEM_GENERATOR_V3_CARDS.filter((card) => card.checkpoint === "NUM-CP-003").length,
      "NUM-CP-004": NUMBER_SYSTEM_GENERATOR_V3_CARDS.filter((card) => card.checkpoint === "NUM-CP-004").length,
    },
    lifecycle: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE,
    cards: NUMBER_SYSTEM_GENERATOR_V3_CARDS,
  }, null, 2)}\n`,
  "utf8",
);

const markdown = [
  "# ExamTree Number System — Generator Contract V3.1 Review",
  "",
  `**Explanation model:** \`${NUMBER_SYSTEM_GENERATOR_MODEL}\``,
  "",
  `**Editorial patch:** \`${NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH}\``,
  "",
  `**Questions:** ${NUMBER_SYSTEM_GENERATOR_V3_CARDS.length}`,
  "",
  "**Permanent QLs:** `NUM-QL-001..NUM-QL-045`",
  "",
  "**Lifecycle:** Active in English Question Studio. Question Bank writes, test eligibility and public publication remain disabled.",
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
  [
    "reviewNumber",
    "checkpoint",
    "qlId",
    "difficulty",
    "stemFamily",
    "stem",
    "options",
    "correctAnswer",
    "mainRule",
    "stepByStepSolution",
    "examSpeedTrick",
    "commonTraps",
    "lifecycleStatus",
  ].join(","),
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
    card.explanation.commonTraps.map((trap) =>
      `Option ${trap.optionLabel} (${trap.optionValue}): ${trap.message} [${trap.misconceptionTag}]`).join("\n"),
    card.lifecycle.status,
  ].map(csvEscape).join(",")),
].join("\n");
writeFileSync(csvPath, `${csvRows}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUMBER_SYSTEM_GENERATOR_V3_1_REVIEW_EXPORT",
  explanationModel: NUMBER_SYSTEM_GENERATOR_MODEL,
  editorialPatch: NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH,
  questionCount: NUMBER_SYSTEM_GENERATOR_V3_CARDS.length,
  questionStudioActive: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  jsonPath,
  markdownPath,
  csvPath,
}, null, 2));

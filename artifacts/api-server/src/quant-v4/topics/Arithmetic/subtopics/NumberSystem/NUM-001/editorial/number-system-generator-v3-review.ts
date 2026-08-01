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
  renderTeacherExplanationMarkdown,
  studentOptionDisplay,
} from "./simple-teacher-voice";
import {
  NUMBER_SYSTEM_GENERATOR_MODEL,
  buildExamReadyStem,
  stripStudentOptionLeaks,
  titleCaseDifficulty,
} from "./number-system-generator-contract";

function rawOptions(row): string[] {
  return row.checkpoint === "NUM-CP-003"
    ? row.question.options.map(String)
    : row.question.options.map((option) => String(option.value));
}

function splitMathSegments(value: string): string[] {
  return value.split(/(\$[^$]*\$)/gu);
}

function wrapMathInProse(value: string): string {
  return splitMathSegments(value).map((segment) => {
    if (/^\$[^$]*\$$/u.test(segment)) return segment;
    return segment
      .replace(/\b(\d[\d,]*)\s*([+\-×÷])\s*(\d[\d,]*)\b/gu, (_match, left, operator, right) =>
        `$${left} ${operator === "×" ? "\\times" : operator === "÷" ? "\\div" : operator} ${right}$`)
      .replace(/\b(\d[\d,]*\^\d+)\b/gu, (_match, expression) => `$${expression}$`)
      .replace(/\b(\d[\d,]*)\b/gu, (_match, number) => `$${number}$`);
  }).join("");
}

function unwrapProseFromMath(value: string): string {
  const trimmed = value.trim();
  if (/^\$[^$]*[A-Za-z][^$]*\$$/u.test(trimmed) && /\s/u.test(trimmed)) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function formatStudentValue(value: unknown): string {
  const clean = stripStudentOptionLeaks(value);
  const proseSafe = unwrapProseFromMath(clean);
  if (/[A-Za-z]{2,}/u.test(proseSafe)) return wrapMathInProse(proseSafe);
  return studentOptionDisplay(proseSafe);
}

function safeOptions(row): string[] {
  return rawOptions(row).map(formatStudentValue);
}

function fixStemGrammar(value: string): string {
  return wrapMathInProse(value)
    .replace(/Choose the option that co-prime statements about/giu,
      "Which of the following co-prime statements about")
    .replace(/Choose the option that prime numbers divides/giu,
      "Which of the following prime numbers divides")
    .replace(/Choose the option that prime number divides/giu,
      "Which of the following prime numbers divides");
}

function normaliseInlineMath(value: unknown): string {
  return String(value ?? "")
    .replace(/\$\$([^$]+)\$\$/gu, (_match, expression) => `$${expression.trim()}$`)
    .replace(/\$(\d[\d,]*)\$\s*×\s*\$(\d[\d,]*)\$\s*=\s*\$(\d[\d,]*)\$/gu,
      (_match, left, right, result) => `$${left} \\times ${right} = ${result}$`)
    .replace(/\$(\d[\d,]*)\$\s*÷\s*\$(\d[\d,]*)\$/gu,
      (_match, left, right) => `$${left} \\div ${right}$`);
}

function normaliseTeacherExplanation(teacher) {
  return Object.freeze({
    ...teacher,
    mainRule: teacher.mainRule.map(normaliseInlineMath),
    stepByStepSolution: teacher.stepByStepSolution.map(normaliseInlineMath),
    examSpeedTrick: teacher.examSpeedTrick.map(normaliseInlineMath),
    commonTraps: teacher.commonTraps.map((trap) => Object.freeze({
      ...trap,
      optionValue: formatStudentValue(trap.optionValue),
      message: normaliseInlineMath(trap.message),
    })),
  });
}

export const NUMBER_SYSTEM_GENERATOR_V3_CARDS = Object.freeze(
  NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.map((row, index) => {
    const teacher = normaliseTeacherExplanation(buildNumberSystemTeacherExplanation(row));
    const stem = buildExamReadyStem(row, index);
    const answer = correctAnswerDisplay(row);
    return Object.freeze({
      reviewNumber: index + 1,
      checkpoint: row.checkpoint,
      qlId: row.allocation.qlId,
      title: row.title,
      difficulty: titleCaseDifficulty(row.question.difficulty),
      stemFamily: stem.family,
      stem: fixStemGrammar(stem.stem),
      options: safeOptions(row),
      correctAnswer: Object.freeze({
        label: answer.label,
        value: formatStudentValue(answer.value),
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
  }, null, 2)}\n`,
  "utf8",
);

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

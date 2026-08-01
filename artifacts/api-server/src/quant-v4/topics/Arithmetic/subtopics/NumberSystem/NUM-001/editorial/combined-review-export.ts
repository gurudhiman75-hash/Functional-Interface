// @ts-nocheck
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  NUM_CP003_PERMANENT_QL_IDS,
  getNumCp003PermanentAllocation,
} from "../NUM-CP-003/permanent/allocation";
import { runNumCp003PermanentPipeline } from "../NUM-CP-003/permanent/runtime";
import {
  NUM_CP004_PERMANENT_QL_IDS,
  getNumCp004PermanentAllocation,
} from "../NUM-CP-004/permanent/allocation";
import { runNumCp004PermanentPipeline } from "../NUM-CP-004/permanent/runtime";
import { normaliseNumberSystemReviewMath } from "./explanation-rendering";
import {
  SIMPLE_NUMBER_SYSTEM_QL_TITLES,
  buildNumberSystemTeacherExplanation,
  correctAnswerDisplay,
  renderTeacherExplanationMarkdown,
  studentOptionDisplay,
} from "./simple-teacher-voice";

const CP003_SIX_SAMPLE_QLS = new Set([
  "NUM-QL-002",
  "NUM-QL-003",
  "NUM-QL-007",
  "NUM-QL-008",
  "NUM-QL-012",
  "NUM-QL-016",
]);

export const NUM_CP003_CP004_STAGING_LIFECYCLE = Object.freeze({
  environment: "STAGING",
  status: "ACTIVE_STAGING",
  active: true,
  stagingReviewEligible: true,
  questionStudioStagingDiscoverable: true,
  answerVisibleInEditorialReview: true,
  explanationModel: "FOUR_TIER_SIMPLE_TEACHER_VOICE_V2",
  production: Object.freeze({
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  }),
  language: "en",
});

export function stripAnswerMarkers(value: unknown): string {
  return String(value ?? "")
    .replace(/\s*\*\*[✓✔]\*\*\s*/gu, " ")
    .replace(/\s*[✓✔]\s*/gu, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function stableStateKey(question): string {
  if (question.mathematicalFingerprint) return String(question.mathematicalFingerprint);
  if (question.fingerprint) return String(question.fingerprint);
  return JSON.stringify(
    question.hiddenState,
    (_key, value) => typeof value === "bigint" ? value.toString() : value,
  );
}

function selectUniqueCp003Rows(qlId, sampleCount) {
  const allocation = getNumCp003PermanentAllocation(qlId);
  const rows = [];
  const seen = new Set();
  for (let attempt = 1; attempt <= 240 && rows.length < sampleCount; attempt += 1) {
    const question = runNumCp003PermanentPipeline({
      questionLanguageId: qlId,
      seed: `editorial-review-${attempt}`,
    });
    const key = stableStateKey(question);
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      checkpoint: "NUM-CP-003",
      allocation,
      title: SIMPLE_NUMBER_SYSTEM_QL_TITLES[qlId],
      question,
    });
  }
  if (rows.length !== sampleCount) {
    throw new Error(`${qlId}: unable to produce ${sampleCount} unique CP-003 review states`);
  }
  return rows;
}

function selectUniqueCp004Rows(qlId, sampleCount) {
  const allocation = getNumCp004PermanentAllocation(qlId);
  const rows = [];
  const seen = new Set();
  for (let seed = 1; seed <= 240 && rows.length < sampleCount; seed += 1) {
    const question = runNumCp004PermanentPipeline({ questionLanguageId: qlId, seed });
    const key = stableStateKey(question);
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      checkpoint: "NUM-CP-004",
      allocation,
      title: SIMPLE_NUMBER_SYSTEM_QL_TITLES[qlId],
      question,
    });
  }
  if (rows.length !== sampleCount) {
    throw new Error(`${qlId}: unable to produce ${sampleCount} unique CP-004 review states`);
  }
  return rows;
}

const cp003Rows = NUM_CP003_PERMANENT_QL_IDS.flatMap((qlId) =>
  selectUniqueCp003Rows(qlId, CP003_SIX_SAMPLE_QLS.has(qlId) ? 6 : 3),
);

const cp004Rows = NUM_CP004_PERMANENT_QL_IDS.flatMap((qlId) =>
  selectUniqueCp004Rows(qlId, 3),
);

export const NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS = [...cp003Rows, ...cp004Rows];

function normaliseMath(text: unknown): string {
  return normaliseNumberSystemReviewMath(text);
}

function optionValues(row): string[] {
  if (row.checkpoint === "NUM-CP-003") {
    return row.question.options.map((value) => stripAnswerMarkers(value));
  }
  return row.question.options.map((option) => stripAnswerMarkers(option.value));
}

function correctIndex(row): number {
  return Number(row.question.correctIndex);
}

function canonicalAnswer(row): string {
  return row.checkpoint === "NUM-CP-003"
    ? String(row.question.answer)
    : String(row.question.canonicalAnswer);
}

function studentSafeQuestion(row, teacherExplanation) {
  if (row.checkpoint === "NUM-CP-003") {
    return {
      ...row.question,
      options: row.question.options.map((value) => stripAnswerMarkers(value)),
      explanation: teacherExplanation,
    };
  }
  return {
    ...row.question,
    options: row.question.options.map((option) => ({
      ...option,
      value: stripAnswerMarkers(option.value),
    })),
    explanation: teacherExplanation,
  };
}

const reviewRows = NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.map((row, index) => {
  const teacherExplanation = buildNumberSystemTeacherExplanation(row);
  return {
    ...row,
    reviewNumber: index + 1,
    teacherExplanation,
  };
});

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "num-001-cp003-cp004-editorial-review.json");
const csvPath = resolve(outputDirectory, "num-001-cp003-cp004-editorial-review.csv");
const markdownPath = resolve(outputDirectory, "num-001-cp003-cp004-editorial-review.md");

const serialisableRows = reviewRows.map((row) => ({
  reviewNumber: row.reviewNumber,
  checkpoint: row.checkpoint,
  qlId: row.allocation.qlId,
  qlTemplateId: row.allocation.qlTemplateId,
  title: row.title,
  solveModeId: row.allocation.solveModeId,
  stagingStatus: "ACTIVE_STAGING",
  explanationModel: row.teacherExplanation.model,
  question: studentSafeQuestion(row, row.teacherExplanation),
}));

writeFileSync(
  jsonPath,
  `${JSON.stringify({
    status: "NUM_CP003_CP004_ACTIVE_STAGING_SIMPLE_TEACHER_VOICE_CORPUS",
    questionCount: serialisableRows.length,
    permanentQlRange: "NUM-QL-001..NUM-QL-045",
    permanentQlCount: 45,
    checkpointCounts: {
      "NUM-CP-003": cp003Rows.length,
      "NUM-CP-004": cp004Rows.length,
    },
    explanationModel: "FOUR_TIER_SIMPLE_TEACHER_VOICE_V2",
    lifecycle: NUM_CP003_CP004_STAGING_LIFECYCLE,
    studentSafeOptions: true,
    rows: serialisableRows,
  }, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2)}\n`,
  "utf8",
);

const csvEscape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = [
  [
    "reviewNumber",
    "checkpoint",
    "qlId",
    "title",
    "difficulty",
    "stagingStatus",
    "stem",
    "options",
    "correctOption",
    "canonicalAnswer",
    "mainRule",
    "stepByStepSolution",
    "examSpeedTrick",
    "commonTraps",
    "questionId",
  ].join(","),
  ...reviewRows.map((row) => {
    const options = optionValues(row);
    const teacher = row.teacherExplanation;
    return [
      row.reviewNumber,
      row.checkpoint,
      row.allocation.qlId,
      row.title,
      row.question.difficulty,
      "ACTIVE_STAGING",
      row.question.stem,
      options.map((value, optionIndex) => `${String.fromCharCode(65 + optionIndex)}:${value}`).join(" | "),
      String.fromCharCode(65 + correctIndex(row)),
      canonicalAnswer(row),
      teacher.mainRule.join("\n"),
      teacher.stepByStepSolution.map((step, index) => `${index + 1}. ${step}`).join("\n"),
      teacher.examSpeedTrick.join("\n"),
      teacher.commonTraps.map((trap) =>
        `Option ${trap.optionLabel} (${trap.optionValue}): ${trap.message} [${trap.misconceptionTag}]`).join("\n"),
      row.question.questionId,
    ].map(csvEscape).join(",");
  }),
].join("\n");
writeFileSync(csvPath, `${csv}\n`, "utf8");

const markdown = [
  "# ExamTree Number System — Simple Teacher-Voice Review Corpus",
  "",
  `**Questions:** ${reviewRows.length}`,
  "",
  "**Permanent QLs:** `NUM-QL-001..NUM-QL-045`",
  "",
  `**Checkpoint distribution:** NUM-CP-003 = ${cp003Rows.length}; NUM-CP-004 = ${cp004Rows.length}`,
  "",
  "**Explanation model:** Every question uses exactly four student-facing parts: 📌 Main Rule, 📝 Step-by-Step Solution, ⚡ Exam Speed Trick and ⚠️ Common Traps.",
  "",
  "**Lifecycle:** Active Staging. Production Question Bank, live tests and public delivery remain off.",
  "",
  "**Option safety:** Correct-answer marks are never written inside option text.",
  "",
  "---",
  "",
  ...reviewRows.flatMap((row) => {
    const options = optionValues(row);
    const answer = correctAnswerDisplay(row);
    return [
      `## Q${row.reviewNumber}. ${row.allocation.qlId} — ${row.title}`,
      "",
      `**Difficulty:** ${row.question.difficulty}`,
      "",
      "### Question",
      "",
      normaliseMath(row.question.stem).replace(/\n/g, "  \n"),
      "",
      ...options.map((value, optionIndex) =>
        `${String.fromCharCode(65 + optionIndex)}. ${studentOptionDisplay(value)}`),
      "",
      `**Correct Answer:** ${answer.label}. ${answer.value}`,
      "",
      ...renderTeacherExplanationMarkdown(row.teacherExplanation),
      "",
      "---",
      "",
    ];
  }),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP003_CP004_ACTIVE_STAGING_SIMPLE_TEACHER_VOICE_EXPORT",
  questionCount: reviewRows.length,
  cp003QuestionCount: cp003Rows.length,
  cp004QuestionCount: cp004Rows.length,
  permanentQlCount: 45,
  explanationModel: "FOUR_TIER_SIMPLE_TEACHER_VOICE_V2",
  stagingActive: true,
  productionActivated: false,
  studentSafeOptions: true,
  jsonPath,
  csvPath,
  markdownPath,
}, null, 2));

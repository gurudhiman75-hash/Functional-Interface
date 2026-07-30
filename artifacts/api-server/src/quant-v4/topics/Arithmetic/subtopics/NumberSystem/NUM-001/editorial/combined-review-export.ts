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

const CP003_TITLES = {
  "NUM-QL-001": "Divisor polarity selection",
  "NUM-QL-002": "Unique missing digit",
  "NUM-QL-003": "Extremum valid digit",
  "NUM-QL-004": "Valid digit count",
  "NUM-QL-005": "Sum of valid digits",
  "NUM-QL-006": "Complete valid digit set",
  "NUM-QL-007": "Extremum completed number",
  "NUM-QL-008": "Unique ordered digit pair",
  "NUM-QL-009": "Ordered digit-pair count",
  "NUM-QL-010": "Complete ordered digit-pair set",
  "NUM-QL-011": "Ordered-pair solution classification",
  "NUM-QL-012": "Least or greatest n-digit multiple",
  "NUM-QL-013": "Inclusive range multiple count",
  "NUM-QL-014": "Repeated-block divisibility",
  "NUM-QL-015": "Linked arithmetic-divisibility extremum",
  "NUM-QL-016": "Missing-digit data sufficiency",
  "NUM-QL-017": "Divisibility claim verification",
} as const;

const CP003_SIX_SAMPLE_QLS = new Set([
  "NUM-QL-002",
  "NUM-QL-003",
  "NUM-QL-007",
  "NUM-QL-008",
  "NUM-QL-012",
  "NUM-QL-016",
]);

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
      title: CP003_TITLES[qlId],
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
      title: allocation.title,
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
  return String(text ?? "")
    .replace(/\\\((.+?)\\\)/g, "$$$1$")
    .replace(/n−1/g, "$n - 1$")
    .replace(/n\+1/g, "$n + 1$")
    .replace(/\u2212/g, "-");
}

function optionValues(row): string[] {
  if (row.checkpoint === "NUM-CP-003") return row.question.options.map(String);
  return row.question.options.map((option) => String(option.value));
}

function correctIndex(row): number {
  return Number(row.question.correctIndex);
}

function canonicalAnswer(row): string {
  return row.checkpoint === "NUM-CP-003"
    ? String(row.question.answer)
    : String(row.question.canonicalAnswer);
}

function renderCp003Explanation(question): string[] {
  const explanation = question.explanation;
  const diagnostics = question.optionAudit
    .filter((row) => row.misconceptionId !== "CORRECT")
    .map((row) => `- **${normaliseMath(row.text)}:** ${row.diagnostic} (\`${row.misconceptionId}\`)`);
  return [
    "### 📌 Core Concept",
    "",
    normaliseMath(explanation.coreConcept),
    "",
    `**Approach:** ${normaliseMath(explanation.strategy)}`,
    "",
    "### 📝 Step-by-Step Solution",
    "",
    ...explanation.steps.map((line, index) => `${index + 1}. ${normaliseMath(line)}`),
    "",
    "### ⚡ Exam Speed Shortcut",
    "",
    normaliseMath(explanation.shortcut),
    "",
    `**Verification:** ${normaliseMath(explanation.verification)}`,
    "",
    `**Conclusion:** ${normaliseMath(explanation.conclusion)}`,
    "",
    "### ⚠️ Common Traps & Student Warnings",
    "",
    ...explanation.traps.map((line) => `- ${normaliseMath(line)}`),
    ...diagnostics,
  ];
}

function renderCp004Explanation(question): string[] {
  const explanation = question.explanation;
  return [
    "### 📌 Core Concept",
    "",
    ...explanation.coreConcept.map((line) => normaliseMath(line)),
    "",
    ...explanation.givenDataAndStrategy.map((line) => `**Approach:** ${normaliseMath(line)}`),
    "",
    "### 📝 Step-by-Step Solution",
    "",
    ...explanation.stepByStep.map((line, index) => `${index + 1}. ${normaliseMath(line)}`),
    "",
    "### ⚡ Exam Speed Shortcut",
    "",
    ...explanation.examSpeedMethod.map((line) => normaliseMath(line)),
    "",
    "### ⚠️ Common Traps & Student Warnings",
    "",
    ...explanation.commonTraps.map((line) => `- ${normaliseMath(line)}`),
    "",
    `**Final answer:** ${normaliseMath(explanation.finalAnswer)}`,
  ];
}

function renderExplanation(row): string[] {
  return row.checkpoint === "NUM-CP-003"
    ? renderCp003Explanation(row.question)
    : renderCp004Explanation(row.question);
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "num-001-cp003-cp004-editorial-review.json");
const csvPath = resolve(outputDirectory, "num-001-cp003-cp004-editorial-review.csv");
const markdownPath = resolve(outputDirectory, "num-001-cp003-cp004-editorial-review.md");

const serialisableRows = NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.map((row, index) => ({
  reviewNumber: index + 1,
  checkpoint: row.checkpoint,
  qlId: row.allocation.qlId,
  qlTemplateId: row.allocation.qlTemplateId,
  title: row.title,
  solveModeId: row.allocation.solveModeId,
  question: row.question,
}));

writeFileSync(
  jsonPath,
  `${JSON.stringify({
    status: "NUM_CP003_CP004_EDITORIAL_REVIEW_CORPUS",
    questionCount: serialisableRows.length,
    permanentQlRange: "NUM-QL-001..NUM-QL-045",
    permanentQlCount: 45,
    checkpointCounts: {
      "NUM-CP-003": cp003Rows.length,
      "NUM-CP-004": cp004Rows.length,
    },
    lifecycle: {
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      language: "en",
    },
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
    "qlTemplateId",
    "title",
    "difficulty",
    "stem",
    "options",
    "correctOption",
    "canonicalAnswer",
    "questionId",
  ].join(","),
  ...NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.map((row, index) => {
    const options = optionValues(row);
    return [
      index + 1,
      row.checkpoint,
      row.allocation.qlId,
      row.allocation.qlTemplateId,
      row.title,
      row.question.difficulty,
      row.question.stem,
      options.map((value, optionIndex) => `${String.fromCharCode(65 + optionIndex)}:${value}`).join(" | "),
      String.fromCharCode(65 + correctIndex(row)),
      canonicalAnswer(row),
      row.question.questionId,
    ].map(csvEscape).join(",");
  }),
].join("\n");
writeFileSync(csvPath, `${csv}\n`, "utf8");

const markdown = [
  "# ExamTree Number System — CP-003 and CP-004 Editorial Review Corpus",
  "",
  `**Questions:** ${NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.length}`,
  "",
  "**Permanent QLs:** `NUM-QL-001..NUM-QL-045`",
  "",
  `**Checkpoint distribution:** NUM-CP-003 = ${cp003Rows.length}; NUM-CP-004 = ${cp004Rows.length}`,
  "",
  "**Lifecycle:** inactive English review corpus. It is not exposed to Question Studio, Question Bank, tests or public delivery.",
  "",
  "---",
  "",
  ...NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.flatMap((row, index) => {
    const options = optionValues(row);
    const answerIndex = correctIndex(row);
    return [
      `## Q${index + 1}. ${row.allocation.qlId} — ${row.title}`,
      "",
      `**Checkpoint:** \`${row.checkpoint}\`  `,
      `**Difficulty:** ${row.question.difficulty}  `,
      `**Solve mode:** \`${row.allocation.solveModeId}\``,
      "",
      "### Question",
      "",
      normaliseMath(row.question.stem).replace(/\n/g, "  \n"),
      "",
      ...options.map((value, optionIndex) =>
        `${String.fromCharCode(65 + optionIndex)}. ${normaliseMath(value)}${optionIndex === answerIndex ? " **✓**" : ""}`),
      "",
      `**Correct answer:** ${normaliseMath(canonicalAnswer(row))}`,
      "",
      ...renderExplanation(row),
      "",
      "---",
      "",
    ];
  }),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP003_CP004_EDITORIAL_REVIEW_EXPORT",
  questionCount: NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.length,
  cp003QuestionCount: cp003Rows.length,
  cp004QuestionCount: cp004Rows.length,
  permanentQlCount: 45,
  jsonPath,
  csvPath,
  markdownPath,
}, null, 2));

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateArgCp015QuestionStudioBatch } from "./cp015-perceived-diversity-expansion.ts";
import { ARG_QL_IDS } from "./types.ts";

type Question = Readonly<Record<string, any>>;

type ReviewCell = Readonly<{
  label: string;
  profileMode: "core" | "real-paper";
  examProfile?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
}>;

const REVIEW_CELLS: readonly ReviewCell[] = Object.freeze([
  { label: "Core / Easy", profileMode: "core", difficulty: "Easy", count: 1 },
  { label: "Core / Medium", profileMode: "core", difficulty: "Medium", count: 1 },
  { label: "Core / Hard", profileMode: "core", difficulty: "Hard", count: 1 },
  { label: "SSC / Easy", profileMode: "real-paper", examProfile: "SSC_RECENT_2X4", difficulty: "Easy", count: 1 },
  { label: "SSC / Medium", profileMode: "real-paper", examProfile: "SSC_RECENT_2X4", difficulty: "Medium", count: 1 },
  { label: "Banking 2x5 / Medium", profileMode: "real-paper", examProfile: "BANKING_CLASSIC_2X5", difficulty: "Medium", count: 1 },
  { label: "Banking 2x5 / Hard", profileMode: "real-paper", examProfile: "BANKING_CLASSIC_2X5", difficulty: "Hard", count: 1 },
  { label: "Banking 3x5 / Medium", profileMode: "real-paper", examProfile: "BANKING_COMBO_3X5", difficulty: "Medium", count: 1 },
  { label: "Banking 3x5 / Hard", profileMode: "real-paper", examProfile: "BANKING_COMBO_3X5", difficulty: "Hard", count: 1 },
  { label: "Banking 4x5 / Hard", profileMode: "real-paper", examProfile: "BANKING_COMBO_4X5", difficulty: "Hard", count: 3 },
]);

function inline(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return JSON.stringify(value);
}

function block(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return JSON.stringify(value, null, 2);
}

function renderQuestion(question: Question, ordinal: number, label: string): string {
  const args = Array.isArray(question.arguments) ? question.arguments : [];
  const options = Array.isArray(question.options) ? question.options : [];
  const answer = question.answer ?? question.canonicalAnswer ?? options[Number(question.correctIndex)] ?? "";

  const lines = [
    `### ${ordinal}. ${label}`,
    "",
    `- QL: ${inline(question.qlId)}`,
    `- Difficulty: ${inline(question.difficulty)}`,
    `- Profile: ${inline(question.examProfile ?? question.profileMode ?? "CORE")}`,
    `- Template: ${inline(question.templateId ?? "")}`,
    `- Scenario: ${inline(question.scenarioId ?? "")}`,
    `- Question ID: ${inline(question.questionId ?? "")}`,
    "",
    `**Statement:** ${inline(question.statement)}`,
    "",
    "**Arguments:**",
    ...args.map((argument: unknown, index: number) => `${index + 1}. ${inline(argument)}`),
    "",
    "**Options:**",
    ...options.map((option: unknown, index: number) => `${String.fromCharCode(65 + index)}. ${inline(option)}`),
    "",
    `**Correct answer:** ${inline(answer)} (index ${inline(question.correctIndex)})`,
    "",
    "**Explanation:**",
    block(question.explanation),
    "",
    "---",
    "",
  ];
  return lines.join("\n");
}

const reviewItems: Array<Readonly<{ qlId: string; cell: ReviewCell; question: Question }>> = [];

for (const qlId of ARG_QL_IDS) {
  for (let cellIndex = 0; cellIndex < REVIEW_CELLS.length; cellIndex += 1) {
    const cell = REVIEW_CELLS[cellIndex]!;
    const seed = `ARG-CP015-HUMAN-REVIEW:${qlId}:${cell.examProfile ?? "CORE"}:${cell.difficulty}:${cellIndex}`;
    const batch = generateArgCp015QuestionStudioBatch({
      profileMode: cell.profileMode,
      examProfile: cell.examProfile,
      qlId,
      language: "en",
      difficulty: cell.difficulty,
      seed,
      count: cell.count,
    });
    for (const question of batch.questions as readonly Question[]) {
      reviewItems.push(Object.freeze({ qlId, cell, question }));
    }
  }
}

if (reviewItems.length !== ARG_QL_IDS.length * 12) {
  throw new Error(`ARG-001 CP015 review export expected ${ARG_QL_IDS.length * 12} questions, got ${reviewItems.length}.`);
}

for (const qlId of ARG_QL_IDS) {
  const qlItems = reviewItems.filter((entry) => entry.qlId === qlId);
  assert.equal(qlItems.length, 12, `${qlId}: human-review corpus must contain exactly 12 questions.`);
  const statements = qlItems.map((entry) => String(entry.question.statement ?? "").trim());
  const uniqueStatements = new Set(statements);
  const duplicateStatements = [...new Set(statements.filter((statement, index) => statements.indexOf(statement) !== index))];
  assert.equal(
    uniqueStatements.size,
    statements.length,
    `${qlId}: fresh human-review corpus contains repeated statements:\n${duplicateStatements.join("\n")}`,
  );
}

const outDir = resolve(process.cwd(), "dist", "arg-001-cp015-human-review");
mkdirSync(outDir, { recursive: true });

const jsonPayload = Object.freeze({
  packageId: "ARG-001",
  checkpointId: "ARG-CP-015",
  purpose: "FRESH_HUMAN_EDITORIAL_REVIEW",
  questionsPerQl: 12,
  totalQuestions: reviewItems.length,
  qlIds: ARG_QL_IDS,
  cells: REVIEW_CELLS,
  items: reviewItems.map(({ qlId, cell, question }, index) => ({
    ordinal: index + 1,
    qlId,
    reviewCell: cell.label,
    question,
  })),
});

writeFileSync(resolve(outDir, "arg-cp015-human-review.json"), `${JSON.stringify(jsonPayload, null, 2)}\n`, "utf8");

const markdown: string[] = [
  "# ARG-001 CP015 Fresh Human Review Corpus",
  "",
  "Purpose: editorial review after the 1000/1000 deterministic diversity gate. This file is not a release approval.",
  "",
  `Total questions: ${reviewItems.length}`,
  `Questions per QL: 12`,
  "Coverage per QL: Core Easy/Medium/Hard; SSC Easy/Medium; Banking 2x5 Medium/Hard; Banking 3x5 Medium/Hard; Banking 4x5 Hard x3.",
  "",
];

let ordinal = 0;
for (const qlId of ARG_QL_IDS) {
  markdown.push(`## ${qlId}`, "");
  for (const item of reviewItems.filter((entry) => entry.qlId === qlId)) {
    ordinal += 1;
    markdown.push(renderQuestion(item.question, ordinal, item.cell.label));
  }
}

writeFileSync(resolve(outDir, "arg-cp015-human-review.md"), `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_HUMAN_REVIEW_EXPORT",
  totalQuestions: reviewItems.length,
  questionsPerQl: 12,
  exactStatementDuplicatesPerQl: 0,
  outputDirectory: outDir,
}, null, 2));
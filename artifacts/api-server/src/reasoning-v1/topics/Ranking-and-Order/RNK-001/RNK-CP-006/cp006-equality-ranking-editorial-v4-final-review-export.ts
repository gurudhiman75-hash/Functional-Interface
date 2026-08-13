import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildRnkCp006EqualityEditorialV4Final,
  type RnkCp006EditorialV4FinalQuestion,
} from "./cp006-equality-ranking-editorial-v4-final";
import { RNK_CP006_EDITORIAL_SOURCE_FORMS } from "./cp006-equality-ranking-editorial-v2";

function selectReviewQuestions(): readonly RnkCp006EditorialV4FinalQuestion[] {
  const all = buildRnkCp006EqualityEditorialV4Final();
  return RNK_CP006_EDITORIAL_SOURCE_FORMS.flatMap((form) =>
    all.filter((question) => question.sourceForm === form).slice(0, 8),
  );
}

function renderQuestion(question: RnkCp006EditorialV4FinalQuestion, number: number): string {
  return [
    `## Question ${number} — ${question.sourceForm}`,
    "",
    `**Context:** ${question.context}  `,
    `**Difficulty:** ${question.difficulty}  `,
    `**Correct option:** ${String.fromCharCode(65 + question.correctIndex)}`,
    "",
    "### Statements",
    "",
    ...question.clues.map((clue) => `- ${clue}`),
    "",
    `### ${question.stem}`,
    "",
    ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
    "",
    "### Answer and explanation",
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    ...question.explanation.map((line, index) => `${index + 1}. ${line}`),
    "",
    "---",
  ].join("\n");
}

export function buildRnkCp006EditorialV4FinalReviewMarkdown(): string {
  const selected = selectReviewQuestions();
  const answerPositions = [0, 0, 0, 0];
  const counts = new Map<string, number>();
  const contexts = new Map<string, Set<string>>();

  for (const question of selected) {
    answerPositions[question.correctIndex] += 1;
    counts.set(question.sourceForm, (counts.get(question.sourceForm) ?? 0) + 1);
    const set = contexts.get(question.sourceForm) ?? new Set<string>();
    set.add(question.context);
    contexts.set(question.sourceForm, set);
  }

  if (selected.length !== 24) throw new Error(`expected 24 questions, found ${selected.length}`);
  if (answerPositions.some((count) => count !== 6)) {
    throw new Error(`expected 6/6/6/6 answer balance, found ${answerPositions.join("/")}`);
  }
  for (const form of RNK_CP006_EDITORIAL_SOURCE_FORMS) {
    if (counts.get(form) !== 8) throw new Error(`${form}: expected 8 review questions`);
    if ((contexts.get(form)?.size ?? 0) !== 5) throw new Error(`${form}: expected five contexts`);
  }

  return [
    "# RNK-CP-006 — Equality-Aware Ranking V4 Final — 24-Question Review",
    "",
    "Status: **FINAL EDITORIAL REVIEW CANDIDATE — no permanent QL allocated**",
    "",
    "This pack preserves the validated V4 mathematics and removes the final redundant conclusion from local equality-bridge pair explanations.",
    "",
    "```text",
    "questions:                 24",
    "questions/source form:      8",
    "answer positions:       6 / 6 / 6 / 6",
    "contexts/source form:        5",
    "permanent QLs:               0",
    "next available identity: RNK-QL-039",
    "```",
    "",
    "Review criteria: answer correctness, equality necessity, exam-natural wording, distractor quality, explanation sufficiency, ownership boundaries, and absence of unstated post-tie numerical ranking rules.",
    "",
    ...selected.map((question, index) => renderQuestion(question, index + 1)),
    "",
  ].join("\n");
}

if (process.argv[1]?.endsWith("cp006-equality-ranking-editorial-v4-final-review-export.ts")) {
  const outputPath = resolve(process.cwd(), "RNK-CP-006-EQUALITY-EDITORIAL-V4-FINAL-REVIEW-24Q.md");
  writeFileSync(outputPath, buildRnkCp006EditorialV4FinalReviewMarkdown(), "utf8");
  console.log(outputPath);
}

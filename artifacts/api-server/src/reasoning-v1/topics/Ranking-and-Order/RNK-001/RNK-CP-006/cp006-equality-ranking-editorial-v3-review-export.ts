import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildRnkCp006EqualityEditorialV3Release,
  type RnkCp006EditorialV3Question,
} from "./cp006-equality-ranking-editorial-v3-release";
import { RNK_CP006_EDITORIAL_SOURCE_FORMS } from "./cp006-equality-ranking-editorial-v2";

function selectReviewQuestions(): readonly RnkCp006EditorialV3Question[] {
  const all = buildRnkCp006EqualityEditorialV3Release();
  const selected: RnkCp006EditorialV3Question[] = [];
  for (const form of RNK_CP006_EDITORIAL_SOURCE_FORMS) {
    const family = all.filter((question) => question.sourceForm === form);
    selected.push(...family.slice(0, 8));
  }
  return selected;
}

function renderQuestion(question: RnkCp006EditorialV3Question, number: number): string {
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
    "<details>",
    "<summary>Internal review evidence</summary>",
    "",
    `- Hidden weak order: \`${question.state.orderedGroups.map((group) => group.join(" = ")).join(" > ")}\``,
    `- Equality bridge: \`${question.state.equalityBridge.aboveEntity} > ${question.state.equalityBridge.entryTieMember} = ${question.state.equalityBridge.exitTieMember} > ${question.state.equalityBridge.belowEntity}\``,
    `- Pair span: \`${question.reasoningProfile.pairSpan ?? "N/A"}\``,
    `- Permanent QL allocated: \`false\``,
    "",
    "</details>",
    "",
    "---",
  ].join("\n");
}

export function buildRnkCp006EditorialV3ReviewMarkdown(): string {
  const selected = selectReviewQuestions();
  const answerPositions = [0, 0, 0, 0];
  const countsByForm = new Map<string, number>();
  const contextsByForm = new Map<string, Set<string>>();

  for (const question of selected) {
    answerPositions[question.correctIndex] += 1;
    countsByForm.set(question.sourceForm, (countsByForm.get(question.sourceForm) ?? 0) + 1);
    const contexts = contextsByForm.get(question.sourceForm) ?? new Set<string>();
    contexts.add(question.context);
    contextsByForm.set(question.sourceForm, contexts);
  }

  if (selected.length !== 24) throw new Error(`expected 24 review questions, found ${selected.length}`);
  if (answerPositions.some((count) => count !== 6)) {
    throw new Error(`expected 6/6/6/6 answer balance, found ${answerPositions.join("/")}`);
  }
  for (const form of RNK_CP006_EDITORIAL_SOURCE_FORMS) {
    if (countsByForm.get(form) !== 8) throw new Error(`${form}: expected 8 review questions`);
    if ((contextsByForm.get(form)?.size ?? 0) !== 5) throw new Error(`${form}: all five contexts required`);
  }

  return [
    "# RNK-CP-006 — Equality-Aware Ranking Editorial V3 — 24-Question Review",
    "",
    "Status: **HUMAN/SELF-REVIEW CANDIDATE — no permanent QL allocated**",
    "",
    "V3 keeps the validated equality-bridge solver and remodels the learner surface into context-native exam language: height questions use taller/shorter, score questions use marks, speed questions use faster/slower, seniority questions use senior/junior, and performance questions use ranked above/below.",
    "",
    "## Pack composition",
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
    "Surviving source forms:",
    "",
    ...RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => `- \`${form}\``),
    "",
    "Raw `EQUAL_PAIR_IDENTIFICATION` remains rejected as direct clue lookup.",
    "",
    "## Review focus",
    "",
    "1. Does every item genuinely require the equality clue?",
    "2. Are stems/options natural for SSC and banking reasoning material?",
    "3. Are distractors plausible without hidden structural hints?",
    "4. Are explanations short, sufficient and student-friendly?",
    "5. Is the three-authority provisional split justified against strict CP-004 analogues?",
    "6. Does any item accidentally assume a numerical post-tie ranking convention? It must not.",
    "",
    ...selected.map((question, index) => renderQuestion(question, index + 1)),
    "",
  ].join("\n");
}

if (process.argv[1]?.endsWith("cp006-equality-ranking-editorial-v3-review-export.ts")) {
  const outputPath = resolve(process.cwd(), "RNK-CP-006-EQUALITY-EDITORIAL-V3-REVIEW-24Q.md");
  writeFileSync(outputPath, buildRnkCp006EditorialV3ReviewMarkdown(), "utf8");
  console.log(outputPath);
}

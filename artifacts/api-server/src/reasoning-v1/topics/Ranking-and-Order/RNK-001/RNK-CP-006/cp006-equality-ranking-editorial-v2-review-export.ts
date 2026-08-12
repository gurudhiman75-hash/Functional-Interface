import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildRnkCp006EqualityEditorialV2,
  RNK_CP006_EDITORIAL_SOURCE_FORMS,
  type RnkCp006EditorialQuestion,
} from "./cp006-equality-ranking-editorial-v2";

function selectReviewQuestions(): readonly RnkCp006EditorialQuestion[] {
  const all = buildRnkCp006EqualityEditorialV2();
  const selected: RnkCp006EditorialQuestion[] = [];
  for (const form of RNK_CP006_EDITORIAL_SOURCE_FORMS) {
    const family = all.filter((question) => question.sourceForm === form);
    selected.push(...family.slice(0, 8));
  }
  return selected;
}

function renderQuestion(question: RnkCp006EditorialQuestion, number: number): string {
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
    `- Equality bridge required: \`${question.reasoningProfile.equalityBridgeRequired}\``,
    `- Pair span: \`${question.reasoningProfile.pairSpan ?? "N/A"}\``,
    `- Permanent QL allocated: \`false\``,
    "",
    "</details>",
    "",
    "---",
  ].join("\n");
}

export function buildRnkCp006EditorialV2ReviewMarkdown(): string {
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
    "# RNK-CP-006 — Equality-Aware Ranking Editorial V2 — 24-Question Review",
    "",
    "Status: **EDITORIAL REVIEW CANDIDATE — no permanent QL allocated**",
    "",
    "This pack is the remediated equality-aware ranking checkpoint. Every question is built so that the strict chain enters a tied level through one person and exits through the other; the equality statement is therefore a necessary reasoning bridge rather than decorative information.",
    "",
    "## What changed after raw self-review",
    "",
    "- `EQUAL_PAIR_IDENTIFICATION` was rejected because it copied the explicit equality clue into the answer.",
    "- Direct equality lookup was removed from the pair-relation family.",
    "- Pair-relation questions now ask a strict relation whose proof crosses the equality class.",
    "- Endpoint questions are retained as an ownership probe because they are source-real but may overlap frozen endpoint ownership.",
    "- Complete weak-order reconstruction remains the strongest distinct equality-aware form.",
    "- Numeric post-tie rank conventions remain prohibited.",
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
    "Source forms under review:",
    "",
    ...RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => `- \`${form}\``),
    "",
    "## Human review questions",
    "",
    "1. Does the equality statement genuinely matter to the solve path?",
    "2. Do the questions feel like Ranking rather than symbolic Inequalities or Seating Arrangement?",
    "3. Are the options plausible and non-mechanical?",
    "4. Should endpoint-through-equality become a new authority, or should it be treated as a state extension of `RNK-QL-027`?",
    "5. Should pair-relation-through-equality and complete-weak-order remain separate permanent authorities?",
    "6. Is any unstated numerical tie-ranking convention implied? It must not be.",
    "",
    ...selected.map((question, index) => renderQuestion(question, index + 1)),
    "",
  ].join("\n");
}

if (process.argv[1]?.endsWith("cp006-equality-ranking-editorial-v2-review-export.ts")) {
  const outputPath = resolve(process.cwd(), "RNK-CP-006-EQUALITY-EDITORIAL-V2-REVIEW-24Q.md");
  writeFileSync(outputPath, buildRnkCp006EditorialV2ReviewMarkdown(), "utf8");
  console.log(outputPath);
}

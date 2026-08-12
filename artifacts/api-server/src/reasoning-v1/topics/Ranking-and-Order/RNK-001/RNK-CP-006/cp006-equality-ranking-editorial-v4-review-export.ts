import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildRnkCp006EqualityEditorialV4Release,
  type RnkCp006EditorialV4Question,
} from "./cp006-equality-ranking-editorial-v4-release";
import { RNK_CP006_EDITORIAL_SOURCE_FORMS } from "./cp006-equality-ranking-editorial-v2";

function selectReviewQuestions(): readonly RnkCp006EditorialV4Question[] {
  const all = buildRnkCp006EqualityEditorialV4Release();
  const selected: RnkCp006EditorialV4Question[] = [];
  for (const form of RNK_CP006_EDITORIAL_SOURCE_FORMS) {
    const family = all.filter((question) => question.sourceForm === form);
    selected.push(...family.slice(0, 8));
  }
  return selected;
}

function renderQuestion(question: RnkCp006EditorialV4Question, number: number): string {
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

export function buildRnkCp006EditorialV4ReviewMarkdown(): string {
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
    "# RNK-CP-006 — Equality-Aware Ranking Editorial V4 — 24-Question Review",
    "",
    "Status: **HUMAN/SELF-REVIEW CANDIDATE — no permanent QL allocated**",
    "",
    "V4 keeps the validated equality-bridge mathematics and improves the learner surface after the V3 self-review.",
    "",
    "## V4 remediation",
    "",
    "- Full-chain pair explanations now show the complete derived order instead of saying only to continue the remaining comparisons.",
    "- Performance-review wording is more natural and avoids the artificial phrase ‘performance positions’.",
    "- Learner stems contain no Markdown backticks around the equality symbol.",
    "- Every complete-order question now has three distinct misconception distractors: split the real tie, create a false tie, or reverse a strict part of the order.",
    "- Context-native explanation language is retained for height, scores, speed, seniority and performance.",
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
    "1. Answer correctness and uniqueness.",
    "2. Whether the equality statement is genuinely required.",
    "3. SSC/banking-style wording and option plausibility.",
    "4. Student-friendly explanation sufficiency.",
    "5. Whether misconception distractors are balanced rather than mechanically generated.",
    "6. Whether the three provisional authority boundaries remain justified.",
    "7. Whether any numerical post-tie ranking convention is implied; it must not be.",
    "",
    ...selected.map((question, index) => renderQuestion(question, index + 1)),
    "",
  ].join("\n");
}

if (process.argv[1]?.endsWith("cp006-equality-ranking-editorial-v4-review-export.ts")) {
  const outputPath = resolve(process.cwd(), "RNK-CP-006-EQUALITY-EDITORIAL-V4-REVIEW-24Q.md");
  writeFileSync(outputPath, buildRnkCp006EditorialV4ReviewMarkdown(), "utf8");
  console.log(outputPath);
}

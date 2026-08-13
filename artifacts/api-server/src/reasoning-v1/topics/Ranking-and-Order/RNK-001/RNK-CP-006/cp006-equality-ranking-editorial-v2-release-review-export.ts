import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildRnkCp006EqualityEditorialV2Release,
  type RnkCp006EditorialReleaseQuestion,
} from "./cp006-equality-ranking-editorial-v2-release";
import { RNK_CP006_EDITORIAL_SOURCE_FORMS } from "./cp006-equality-ranking-editorial-v2";

function selectReviewQuestions(): readonly RnkCp006EditorialReleaseQuestion[] {
  const all = buildRnkCp006EqualityEditorialV2Release();
  const selected: RnkCp006EditorialReleaseQuestion[] = [];
  for (const form of RNK_CP006_EDITORIAL_SOURCE_FORMS) {
    const family = all.filter((question) => question.sourceForm === form);
    selected.push(...family.slice(0, 8));
  }
  return selected;
}

function renderQuestion(question: RnkCp006EditorialReleaseQuestion, number: number): string {
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

export function buildRnkCp006EditorialV2ReleaseReviewMarkdown(): string {
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
    "# RNK-CP-006 — Equality-Aware Ranking Editorial V2 Release — 24-Question Review",
    "",
    "Status: **EDITORIAL REVIEW CANDIDATE — no permanent QL allocated**",
    "",
    "Every question in this pack requires the explicit equality statement to connect two otherwise disconnected strict-comparison segments. Equality is therefore part of the solve, not decorative wording.",
    "",
    "## Remediation already applied",
    "",
    "- Direct equal-pair lookup was rejected.",
    "- Pair questions no longer ask the relation of the pair already stated equal.",
    "- The strict chain enters the tied level through one tied person and exits through the other.",
    "- Learner wording avoids confusing equality with unresolved comparison.",
    "- Numeric post-tie ranking conventions remain out of scope.",
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
    "## Ownership questions still open",
    "",
    "1. Is pair-relation-through-equality sufficiently distinct from frozen `RNK-QL-031`?",
    "2. Is endpoint-through-equality merely an equality-capable state extension of `RNK-QL-027`?",
    "3. Is complete weak-order reconstruction sufficiently distinct from strict `RNK-QL-030`?",
    "4. Should the surviving equality forms consolidate into one equality-aware authority rather than three QLs?",
    "",
    ...selected.map((question, index) => renderQuestion(question, index + 1)),
    "",
  ].join("\n");
}

if (process.argv[1]?.endsWith("cp006-equality-ranking-editorial-v2-release-review-export.ts")) {
  const outputPath = resolve(process.cwd(), "RNK-CP-006-EQUALITY-EDITORIAL-V2-RELEASE-REVIEW-24Q.md");
  writeFileSync(outputPath, buildRnkCp006EditorialV2ReleaseReviewMarkdown(), "utf8");
  console.log(outputPath);
}

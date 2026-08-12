import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildRnkCp006EqualityDiscovery,
  RNK_CP006_DISCOVERY_PROTOTYPES,
  type RnkCp006Prototype,
  type RnkCp006Question,
} from "./cp006-equality-ranking-discovery";

const ORDINALS: Readonly<Record<RnkCp006Prototype, readonly number[]>> = {
  EQUAL_PAIR_IDENTIFICATION: [0, 1, 2, 3, 4, 5],
  PAIR_RELATION_WITH_EQUALITY: [0, 1, 2, 3, 6, 19],
  ENDPOINT_ENTITY_WITH_INTERNAL_TIE: [0, 1, 2, 3, 4, 6],
  COMPLETE_WEAK_ORDER: [0, 1, 2, 3, 5, 19],
};

function selectReviewQuestions(): readonly RnkCp006Question[] {
  const all = buildRnkCp006EqualityDiscovery();
  const selected: RnkCp006Question[] = [];
  for (const prototype of RNK_CP006_DISCOVERY_PROTOTYPES) {
    const family = all.filter((question) => question.prototype === prototype);
    for (const ordinal of ORDINALS[prototype]) {
      const question = family[ordinal];
      if (!question) throw new Error(`${prototype}: missing review ordinal ${ordinal}`);
      selected.push(question);
    }
  }
  return selected;
}

function renderQuestion(question: RnkCp006Question, number: number): string {
  const options = question.options
    .map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)
    .join("\n");
  return [
    `## Question ${number} — ${question.prototype}`,
    "",
    `**Context:** ${question.context}`,
    `**Seed:** ${question.seed}`,
    `**Correct option:** ${String.fromCharCode(65 + question.correctIndex)}`,
    "",
    ...question.clues.map((clue) => `- ${clue}`),
    "",
    `**${question.stem}**`,
    "",
    options,
    "",
    `### Answer`,
    "",
    `**${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}**`,
    "",
    `### Explanation`,
    "",
    ...question.explanation.map((line, index) => `${index + 1}. ${line}`),
    "",
    "### Internal review evidence",
    "",
    `- Hidden weak order: \`${question.state.orderedGroups.map((group) => group.join(" = ")).join(" > ")}\``,
    `- Equality group: \`${question.state.orderedGroups[question.state.tieGroupIndex]!.join(" = ")}\``,
    `- Permanent QL allocated: \`false\``,
    "",
    "---",
  ].join("\n");
}

export function buildRnkCp006EqualityReviewMarkdown(): string {
  const selected = selectReviewQuestions();
  const answerPositions = [0, 0, 0, 0];
  const prototypeCounts = new Map<string, number>();
  const contextsByPrototype = new Map<string, Set<string>>();
  for (const question of selected) {
    answerPositions[question.correctIndex] += 1;
    prototypeCounts.set(question.prototype, (prototypeCounts.get(question.prototype) ?? 0) + 1);
    const contexts = contextsByPrototype.get(question.prototype) ?? new Set<string>();
    contexts.add(question.context);
    contextsByPrototype.set(question.prototype, contexts);
  }
  if (selected.length !== 24) throw new Error(`review pack contains ${selected.length}/24 questions`);
  if (answerPositions.some((count) => count !== 6)) {
    throw new Error(`review answer positions are ${answerPositions.join("/")}, expected 6/6/6/6`);
  }
  for (const prototype of RNK_CP006_DISCOVERY_PROTOTYPES) {
    if (prototypeCounts.get(prototype) !== 6) throw new Error(`${prototype}: expected 6 review questions`);
    if ((contextsByPrototype.get(prototype)?.size ?? 0) !== 5) {
      throw new Error(`${prototype}: review pack must cover all five contexts`);
    }
  }

  return [
    "# RNK-CP-006 — Equality-Aware Ranking Discovery Review — 24 Questions",
    "",
    "Status: **RAW DISCOVERY HUMAN REVIEW — no permanent QL allocated**",
    "",
    "This pack reviews equality-aware ranking where the displayed evidence determines one unique ordered sequence of equality classes. A tie is explicit equality, not missing comparison or CP-005-style incomparability.",
    "",
    "## Review scope",
    "",
    "```text",
    "questions:                 24",
    "questions/source form:      6",
    "answer positions:       6 / 6 / 6 / 6",
    "contexts/source form:        5",
    "permanent QLs:               0",
    "next available identity: RNK-QL-039",
    "```",
    "",
    "Source forms under review:",
    "",
    ...RNK_CP006_DISCOVERY_PROTOTYPES.map((prototype) => `- \`${prototype}\``),
    "",
    "Editorial questions for this review:",
    "",
    "1. Does explicit equality materially change the learner solve contract?",
    "2. Are equality and incomparability unmistakably separated?",
    "3. Are pair/endpoint/full-order options exam-natural and non-mechanical?",
    "4. Should endpoint-with-internal-tie merge into an existing endpoint authority rather than receive a new QL?",
    "5. Should equal-pair identification, pair relation and complete weak order consolidate into fewer permanent authorities?",
    "6. Is any numeric post-tie rank convention implied accidentally? It must not be.",
    "",
    ...selected.map((question, index) => renderQuestion(question, index + 1)),
    "",
  ].join("\n");
}

if (process.argv[1]?.endsWith("cp006-equality-ranking-review-export.ts")) {
  const outputPath = resolve(process.cwd(), "RNK-CP-006-EQUALITY-RANKING-REVIEW-24Q.md");
  writeFileSync(outputPath, buildRnkCp006EqualityReviewMarkdown(), "utf8");
  console.log(outputPath);
}

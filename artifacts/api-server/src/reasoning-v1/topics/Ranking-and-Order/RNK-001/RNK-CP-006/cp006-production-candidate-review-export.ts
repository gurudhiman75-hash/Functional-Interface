import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildRnkCp006ProductionCandidate,
  RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS,
  rnkCp006ProductionCandidateProjectionSha256,
  type RnkCp006ProductionCandidateQuestion,
} from "./cp006-production-candidate-v1";

function selectReviewQuestions(): readonly RnkCp006ProductionCandidateQuestion[] {
  const all = buildRnkCp006ProductionCandidate();
  return RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS.flatMap((assignment) =>
    all
      .filter((question) => question.authorityId === assignment.authorityId)
      .slice(0, 12),
  );
}

function renderQuestion(
  question: RnkCp006ProductionCandidateQuestion,
  number: number,
): string {
  return [
    `## Question ${number} — ${question.authorityId}`,
    "",
    `**Mode:** ${question.mode}  `,
    `**Context:** ${question.context}  `,
    `**Difficulty:** ${question.difficulty}  `,
    `**Entities:** ${question.state.entities.length}  `,
    `**Correct option:** ${String.fromCharCode(65 + question.correctIndex)}`,
    "",
    "### Statements",
    "",
    ...question.clues.map((clue) => `- ${clue}`),
    "",
    `### ${question.stem}`,
    "",
    ...question.options.map(
      (option, index) => `${String.fromCharCode(65 + index)}. ${option}`,
    ),
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
    `- Authority ordinal: \`${question.authorityOrdinal}\``,
    `- Hidden weak order: \`${question.state.orderedGroups.map((group) => group.join(" = ")).join(" > ")}\``,
    `- Equality bridge: \`${question.state.equalityBridge.aboveEntity} > ${question.state.equalityBridge.entryTieMember} = ${question.state.equalityBridge.exitTieMember} > ${question.state.equalityBridge.belowEntity}\``,
    `- State key: \`${question.state.mathematicalStateKey}\``,
    `- Permanent QL allocated: \`${question.lifecycle.permanentQlAllocated}\``,
    "",
    "</details>",
    "",
    "---",
  ].join("\n");
}

export function buildRnkCp006ProductionCandidateReviewMarkdown(): string {
  const all = buildRnkCp006ProductionCandidate();
  const selected = selectReviewQuestions();
  const answerPositions = [0, 0, 0, 0];
  const authorityCounts = new Map<string, number>();
  const answerPositionsByAuthority = new Map<string, number[]>();
  const modes = new Map<string, number>();
  const contextsByAuthority = new Map<string, Set<string>>();
  const entityCountsByAuthority = new Map<string, Set<number>>();

  for (const question of selected) {
    answerPositions[question.correctIndex] += 1;
    authorityCounts.set(
      question.authorityId,
      (authorityCounts.get(question.authorityId) ?? 0) + 1,
    );
    const positions = answerPositionsByAuthority.get(question.authorityId) ?? [0, 0, 0, 0];
    positions[question.correctIndex] += 1;
    answerPositionsByAuthority.set(question.authorityId, positions);
    modes.set(question.mode, (modes.get(question.mode) ?? 0) + 1);
    const contexts = contextsByAuthority.get(question.authorityId) ?? new Set<string>();
    contexts.add(question.context);
    contextsByAuthority.set(question.authorityId, contexts);
    const entityCounts = entityCountsByAuthority.get(question.authorityId) ?? new Set<number>();
    entityCounts.add(question.state.entities.length);
    entityCountsByAuthority.set(question.authorityId, entityCounts);
  }

  if (selected.length !== 36) throw new Error(`expected 36 questions, found ${selected.length}`);
  if (answerPositions.some((count) => count !== 9)) {
    throw new Error(`expected 9/9/9/9 overall answer balance, found ${answerPositions.join("/")}`);
  }
  for (const assignment of RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS) {
    if (authorityCounts.get(assignment.authorityId) !== 12) {
      throw new Error(`${assignment.authorityId}: expected 12 review questions`);
    }
    const positions = answerPositionsByAuthority.get(assignment.authorityId);
    if (!positions || positions.some((count) => count !== 3)) {
      throw new Error(`${assignment.authorityId}: expected 3/3/3/3 answer balance`);
    }
    if ((contextsByAuthority.get(assignment.authorityId)?.size ?? 0) !== 5) {
      throw new Error(`${assignment.authorityId}: expected all five contexts`);
    }
    if ((entityCountsByAuthority.get(assignment.authorityId)?.size ?? 0) !== 3) {
      throw new Error(`${assignment.authorityId}: expected 5/6/7-entity coverage`);
    }
  }

  if (modes.get("PAIR_LOCAL_BRIDGE") !== 6 || modes.get("PAIR_FULL_CHAIN") !== 6) {
    throw new Error("pair review pack must contain 6 local and 6 full-chain questions");
  }
  if (modes.get("ENDPOINT_HIGHEST") !== 6 || modes.get("ENDPOINT_LOWEST") !== 6) {
    throw new Error("endpoint review pack must contain 6 highest and 6 lowest questions");
  }
  if (modes.get("COMPLETE_WEAK_ORDER") !== 12) {
    throw new Error("complete weak-order review pack must contain 12 questions");
  }

  return [
    "# RNK-CP-006 — Equality-Aware Ranking Production Candidate — 36-Question Review",
    "",
    "Status: **PRODUCTION-CANDIDATE FREEZE REVIEW — no permanent QL allocated**",
    "",
    "This pack samples the 576-question equality-aware ranking candidate before any English freeze or permanent identity allocation.",
    "",
    "## Candidate scale",
    "",
    "```text",
    `candidate questions:       ${all.length}`,
    "provisional authorities:    3",
    "questions/authority:       192",
    `candidate projection:      sha256:${rnkCp006ProductionCandidateProjectionSha256(all)}`,
    "permanent QLs:               0",
    "next available identity: RNK-QL-039",
    "```",
    "",
    "## Review-pack composition",
    "",
    "```text",
    "questions:                  36",
    "questions/authority:        12",
    "answer positions:        9 / 9 / 9 / 9",
    "answer positions/authority: 3 / 3 / 3 / 3",
    "pair local/full:          6 / 6",
    "endpoint high/low:        6 / 6",
    "complete weak order:         12",
    "contexts/authority:           5",
    "entity counts/authority:  5, 6, 7",
    "```",
    "",
    "## Final review questions",
    "",
    "1. Are all answer keys and explanations mathematically correct?",
    "2. Is the equality statement necessary rather than decorative?",
    "3. Are stems and options natural for SSC/banking reasoning?",
    "4. Do pair options avoid hidden frequency clues and direct equality lookup?",
    "5. Do endpoint distractors reflect realistic mistakes?",
    "6. Do complete-order distractors cover split-tie, false-equality and strict-order misconceptions?",
    "7. Is difficulty appropriate to proof length and entity count?",
    "8. Is any numerical post-tie ranking rule implied without being stated? It must not be.",
    "9. Do the three provisional authorities remain distinct enough for final freeze consideration?",
    "",
    ...selected.map((question, index) => renderQuestion(question, index + 1)),
    "",
  ].join("\n");
}

if (process.argv[1]?.endsWith("cp006-production-candidate-review-export.ts")) {
  const outputPath = resolve(
    process.cwd(),
    "RNK-CP-006-PRODUCTION-CANDIDATE-REVIEW-36Q.md",
  );
  writeFileSync(outputPath, buildRnkCp006ProductionCandidateReviewMarkdown(), "utf8");
  console.log(outputPath);
}

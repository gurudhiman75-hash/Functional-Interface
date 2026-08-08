import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  generateRnkCp005EditorialCandidate,
  RNK_CP005_EDITORIAL_CANDIDATE_IDS,
  RNK_CP005_REJECTED_DISCOVERY_IDS,
  type RnkCp005EditorialCandidateId,
} from "./cp005-partial-order-editorial";
import type { RnkCp005DiscoveryQuestion } from "./cp005-partial-order-runtime";

function letter(index: number): string {
  return String.fromCharCode(65 + index);
}

function renderQuestion(question: RnkCp005DiscoveryQuestion, number: number): string[] {
  return [
    `## Question ${number}`,
    "",
    `**Candidate family:** ${question.prototypeId}  `,
    `**Context:** ${question.context}  `,
    `**Difficulty:** ${question.difficulty}`,
    "",
    question.instruction,
    "",
    "**Statements:**",
    ...question.clues.map((clue, index) => `${index + 1}. ${clue}`),
    "",
    `**${question.stem}**`,
    "",
    ...question.options.map((option, index) => `${letter(index)}. ${option.label}`),
    "",
  ];
}

function renderAnswer(question: RnkCp005DiscoveryQuestion, number: number): string[] {
  return [
    `## Question ${number} — ${question.prototypeId}`,
    "",
    `**Correct option:** ${letter(question.correctIndex)}`,
    "",
    `**Answer:** ${question.answer}`,
    "",
    "**Solution:**",
    ...question.explanation.map((line, index) => `${index + 1}. ${line}`),
    "",
    "**Option check:**",
    ...question.options.map(
      (option, index) => `- **${letter(index)}. ${option.label}** — ${option.explanation}`,
    ),
    "",
  ];
}

function selectReviewQuestions(
  prototypeId: RnkCp005EditorialCandidateId,
): readonly RnkCp005DiscoveryQuestion[] {
  const pool = Array.from({ length: 80 }, (_, ordinal) =>
    generateRnkCp005EditorialCandidate(prototypeId, ordinal),
  );
  const selected: RnkCp005DiscoveryQuestion[] = [];
  const usedContexts = new Set<string>();

  for (let desiredIndex = 0; desiredIndex < 4; desiredIndex += 1) {
    const positionCandidates = pool.filter(
      (question) =>
        question.correctIndex === desiredIndex &&
        !selected.some((selectedQuestion) => selectedQuestion.seed === question.seed),
    );
    const candidate =
      positionCandidates.find((question) => !usedContexts.has(question.context)) ??
      positionCandidates[0];
    if (!candidate) {
      throw new Error(`${prototypeId}: no review candidate for option ${desiredIndex}`);
    }
    selected.push(candidate);
    usedContexts.add(candidate.context);
  }

  return selected;
}

const questions = RNK_CP005_EDITORIAL_CANDIDATE_IDS.flatMap(
  (prototypeId: RnkCp005EditorialCandidateId) => selectReviewQuestions(prototypeId),
);

const output: string[] = [
  "# RNK-CP-005 Partial Order and Ranking Uncertainty",
  "",
  "## Editorial Candidate Review — 28 Questions",
  "",
  "This pack contains four questions from each of seven surviving discovery families. No permanent QL has been allocated.",
  "",
  `Rejected during self-review: ${RNK_CP005_REJECTED_DISCOVERY_IDS.join(", ")}. It always produced the same multiple-order conclusion and overlapped existing order-reconstruction ownership.`,
  "",
  "### What has already been filtered out",
  "",
  "- must-be-true answers that merely repeat a displayed statement;",
  "- cannot-be-true answers that merely reverse one displayed statement;",
  "- definite-rank answers copied from a fixed-rank clue;",
  "- Seating Arrangement vocabulary or geometry;",
  "- long permutation counts in learner explanations;",
  "- verbose repeated prefixes inside relation options;",
  "- review samples concentrated in only one ranking context.",
  "",
  "### Human review focus",
  "",
  "- Does each family feel like genuine Ranking and Order?",
  "- Does it occur often enough in SSC, banking or state exams to deserve a permanent QL?",
  "- Are the clues economical rather than puzzle-like?",
  "- Are the options realistic and mutually exclusive?",
  "- Is the explanation quick enough for exam preparation?",
  "",
  "---",
  "",
  "# Part A — Questions",
  "",
];

questions.forEach((question, index) => {
  output.push(...renderQuestion(question, index + 1), "---", "");
});

output.push("# Part B — Answers and explanations", "");
questions.forEach((question, index) => {
  output.push(...renderAnswer(question, index + 1), "---", "");
});

output.push(
  "# Review response template",
  "",
  "```text",
  "Question number:",
  "Keep / merge / reject:",
  "Issue type: ownership / clues / stem / options / answer / explanation / difficulty",
  "What feels wrong:",
  "Suggested correction:",
  "```",
  "",
);

const destination = resolve(
  process.cwd(),
  "artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/RNK-CP-005/generated/RNK-CP-005-PARTIAL-ORDER-EDITORIAL-REVIEW-28Q.md",
);
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, `${output.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS",
      destination,
      questions: questions.length,
      candidateFamilies: Object.fromEntries(
        RNK_CP005_EDITORIAL_CANDIDATE_IDS.map((prototypeId) => [
          prototypeId,
          questions.filter((question) => question.prototypeId === prototypeId).length,
        ]),
      ),
      contexts: Object.fromEntries(
        [...new Set(questions.map((question) => question.context))].map((context) => [
          context,
          questions.filter((question) => question.context === context).length,
        ]),
      ),
      distinctContextsPerFamily: Object.fromEntries(
        RNK_CP005_EDITORIAL_CANDIDATE_IDS.map((prototypeId) => [
          prototypeId,
          new Set(
            questions
              .filter((question) => question.prototypeId === prototypeId)
              .map((question) => question.context),
          ).size,
        ]),
      ),
      rejectedFamilies: RNK_CP005_REJECTED_DISCOVERY_IDS,
      answerPositions: [0, 1, 2, 3].map(
        (position) => questions.filter((question) => question.correctIndex === position).length,
      ),
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);

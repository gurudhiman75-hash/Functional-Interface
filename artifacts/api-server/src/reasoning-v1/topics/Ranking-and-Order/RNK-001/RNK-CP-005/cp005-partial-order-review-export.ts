import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  generateRnkCp005DiscoveryQuestion,
  RNK_CP005_PROTOTYPE_IDS,
  type RnkCp005DiscoveryQuestion,
} from "./cp005-partial-order-runtime";

function letter(index: number): string {
  return String.fromCharCode(65 + index);
}

function renderQuestion(question: RnkCp005DiscoveryQuestion, number: number): string[] {
  return [
    `## Question ${number}`,
    "",
    `**Prototype:** ${question.prototypeId}  `,
    `**Context:** ${question.context}  `,
    `**Difficulty:** ${question.difficulty}  `,
    `**Valid complete rankings:** ${question.validOrderCount}`,
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
    "**Option analysis:**",
    ...question.options.map(
      (option, index) => `- **${letter(index)}. ${option.label}** — ${option.explanation}`,
    ),
    "",
  ];
}

const questions = RNK_CP005_PROTOTYPE_IDS.flatMap((prototypeId, prototypeIndex) =>
  Array.from({ length: 4 }, (_, localSeed) =>
    generateRnkCp005DiscoveryQuestion(prototypeId, prototypeIndex * 10_000 + localSeed),
  ),
);

const output: string[] = [
  "# RNK-CP-005 Partial Order and Ranking Uncertainty",
  "",
  "## Human Review Pack — 32 Discovery Questions",
  "",
  "These questions are discovery prototypes. They do not have permanent QL identities and are not enabled in Question Studio.",
  "",
  "The central review question is whether each item tests genuine ranking uncertainty without becoming a seating-arrangement puzzle.",
  "",
  "### Review checks",
  "",
  "- Does the information deliberately allow multiple complete rankings?",
  "- Is the requested conclusion definite, possible, impossible or indeterminate for a clear reason?",
  "- Does the question resemble SSC, banking or state-exam ranking material?",
  "- Are all four options meaningful and mutually exclusive?",
  "- Is the explanation understandable without listing unnecessary permutations?",
  "- Is any item merely a logic puzzle or disguised seating arrangement?",
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
  "Issue type: ownership / clue set / stem / options / answer / explanation / difficulty",
  "What feels wrong:",
  "Suggested correction:",
  "```",
  "",
);

const destination = resolve(
  process.cwd(),
  "artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/RNK-CP-005/generated/RNK-CP-005-PARTIAL-ORDER-DISCOVERY-REVIEW-32Q.md",
);
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, `${output.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS",
      destination,
      questions: questions.length,
      prototypes: Object.fromEntries(
        RNK_CP005_PROTOTYPE_IDS.map((prototypeId) => [
          prototypeId,
          questions.filter((question) => question.prototypeId === prototypeId).length,
        ]),
      ),
      answerPositions: [0, 1, 2, 3].map(
        (index) => questions.filter((question) => question.correctIndex === index).length,
      ),
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);

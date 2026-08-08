import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { type RnkCp005AuthorityId } from "./cp005-foundation";
import { generateRnkCp005ExamReadyQuestion } from "./cp005-exam-language-v2";
import {
  rnkCp005ReasoningClueText,
  type RnkCp005ReasoningQuestion,
  type RnkCp005ReasoningSharedPassage,
} from "./cp005-reasoning-remodel-v2";

const QL_BY_AUTHORITY: Readonly<Record<RnkCp005AuthorityId, string>> = {
  SHARED_ENDPOINT_ENTITY: "RNK-QL-036",
  SHARED_ENTITY_AT_POSITION: "RNK-QL-037",
  SHARED_RANK_OF_ENTITY: "RNK-QL-038",
  SHARED_PAIR_RELATION: "RNK-QL-039",
  SHARED_RANK_GAP: "RNK-QL-040",
  SHARED_IMMEDIATE_NEIGHBOUR: "RNK-QL-041",
  SHARED_COMPLETE_ORDER: "RNK-QL-042",
  SHARED_TRUE_STATEMENT: "RNK-QL-043",
};

const REVIEW_SETS: readonly {
  readonly seed: number;
  readonly authorities: readonly RnkCp005AuthorityId[];
}[] = [
  {
    seed: 0,
    authorities: [
      "SHARED_ENDPOINT_ENTITY",
      "SHARED_ENTITY_AT_POSITION",
      "SHARED_RANK_OF_ENTITY",
      "SHARED_PAIR_RELATION",
    ],
  },
  {
    seed: 7,
    authorities: [
      "SHARED_RANK_GAP",
      "SHARED_IMMEDIATE_NEIGHBOUR",
      "SHARED_COMPLETE_ORDER",
      "SHARED_TRUE_STATEMENT",
    ],
  },
  {
    seed: 14,
    authorities: [
      "SHARED_ENDPOINT_ENTITY",
      "SHARED_RANK_OF_ENTITY",
      "SHARED_RANK_GAP",
      "SHARED_COMPLETE_ORDER",
    ],
  },
  {
    seed: 3,
    authorities: [
      "SHARED_ENTITY_AT_POSITION",
      "SHARED_PAIR_RELATION",
      "SHARED_IMMEDIATE_NEIGHBOUR",
      "SHARED_TRUE_STATEMENT",
    ],
  },
  {
    seed: 10,
    authorities: [
      "SHARED_ENDPOINT_ENTITY",
      "SHARED_PAIR_RELATION",
      "SHARED_RANK_GAP",
      "SHARED_TRUE_STATEMENT",
    ],
  },
  {
    seed: 17,
    authorities: [
      "SHARED_ENTITY_AT_POSITION",
      "SHARED_RANK_OF_ENTITY",
      "SHARED_IMMEDIATE_NEIGHBOUR",
      "SHARED_COMPLETE_ORDER",
    ],
  },
] as const;

function renderPassage(passage: RnkCp005ReasoningSharedPassage): string[] {
  const lines = [
    `### ${passage.title}`,
    "",
    passage.instruction,
    "",
    `**Evidence mode:** ${passage.evidenceMode}`,
    "",
  ];

  if (passage.rankRows.length > 0) {
    lines.push("**Partial rank anchor**", "", "| Name | Stated position |", "|---|---:|");
    for (const row of passage.rankRows) {
      lines.push(`| ${row.entity} | ${row.positionLabel} |`);
    }
    lines.push("");
  }

  lines.push("**Clues**", "");
  passage.reasoningClues.forEach((clue, index) => {
    lines.push(`${index + 1}. ${rnkCp005ReasoningClueText(clue, passage.contextFamily)}`);
  });
  lines.push("");
  return lines;
}

function renderQuestion(question: RnkCp005ReasoningQuestion, number: number): string[] {
  const lines = [
    `#### Question ${number}`,
    "",
    `**Review metadata:** ${QL_BY_AUTHORITY[question.authorityId]} · ${question.difficulty} · ${question.authorityId}`,
    "",
    question.stem,
    "",
  ];
  question.options.forEach((option, index) => {
    lines.push(`${String.fromCharCode(65 + index)}. ${option.label}`);
  });
  lines.push("");
  return lines;
}

function renderAnswer(question: RnkCp005ReasoningQuestion, number: number): string[] {
  const explanation = question.visibleExplanation;
  return [
    `### Question ${number} — ${QL_BY_AUTHORITY[question.authorityId]}`,
    "",
    `**Correct option:** ${String.fromCharCode(65 + question.correctIndex)}`,
    "",
    `**Answer:** ${question.answer}`,
    "",
    `**Mental picture:** ${explanation.mentalPicture}`,
    "",
    `**Key rule:** ${explanation.keyRule}`,
    "",
    "**Step-by-step solution:**",
    ...explanation.stepByStepSolution.map((step, index) => `${index + 1}. ${step}`),
    "",
    `**Exam-speed shortcut:** ${explanation.examSpeedShortcut}`,
    "",
    "**Option analysis:**",
    ...explanation.optionAnalysis.map((item) => `- ${item}`),
    "",
    `**Conclusion:** ${explanation.conclusion}`,
    "",
  ];
}

const generatedSets = REVIEW_SETS.map((reviewSet, setIndex) => ({
  seed: reviewSet.seed,
  questions: reviewSet.authorities.map((authorityId, questionIndex) =>
    generateRnkCp005ExamReadyQuestion(
      authorityId,
      reviewSet.seed,
      (setIndex * 4 + questionIndex) % 4,
    ),
  ),
}));

const output: string[] = [
  "# RNK-CP-005 V2 Human Review Pack",
  "",
  "This pack contains six incomplete shared evidence sets and 24 linked questions generated from the reasoning-remodel runtime. No set displays the complete final ranking.",
  "",
  "## Suggested review checks",
  "",
  "Check whether each set requires real reconstruction, determines one order, uses natural exam language, provides realistic distractors and teaches the solution clearly.",
  "",
  "---",
  "",
  "# Part A — Questions only",
  "",
];

let questionNumber = 1;
generatedSets.forEach((set, setIndex) => {
  const passage = set.questions[0]!.sharedPassage;
  output.push(
    `## Shared Set ${setIndex + 1}`,
    "",
    `**Context:** ${passage.contextFamily}  `,
    `**Questions in this set:** 4`,
    "",
    ...renderPassage(passage),
  );
  for (const question of set.questions) {
    output.push(...renderQuestion(question, questionNumber));
    questionNumber += 1;
  }
  output.push("---", "");
});

output.push("# Part B — Answers and explanations", "");
questionNumber = 1;
generatedSets.forEach((set, setIndex) => {
  output.push(`## Shared Set ${setIndex + 1}`, "");
  for (const question of set.questions) {
    output.push(...renderAnswer(question, questionNumber));
    questionNumber += 1;
  }
  output.push("---", "");
});

output.push(
  "# Review response template",
  "",
  "```text",
  "Question number:",
  "Issue type: clue / stem / option / answer / explanation / difficulty",
  "What feels wrong:",
  "Suggested correction:",
  "```",
  "",
);

const destination = resolve(
  process.cwd(),
  "artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/RNK-CP-005/generated/RNK-CP-005-V2-HUMAN-REVIEW-PACK-24Q.md",
);
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, `${output.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  destination,
  sharedSets: generatedSets.length,
  questions: generatedSets.reduce((sum, set) => sum + set.questions.length, 0),
  directRankExposureCount: generatedSets.flatMap((set) => set.questions)
    .filter((question) => question.sharedPassage.rankRows.length >= question.sharedPassage.entityCount)
    .length,
  contexts: [...new Set(generatedSets.map((set) => set.questions[0]!.sharedPassage.contextFamily))],
  evidenceModes: [...new Set(generatedSets.map((set) => set.questions[0]!.sharedPassage.evidenceMode))],
}, null, 2));

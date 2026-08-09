import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  generateRnkCp005EditorialV2Question,
  RNK_CP005_AUTHORITY_CANDIDATE_IDS,
  RNK_CP005_EDITORIAL_V2_REJECTED_SOURCE_FORMS,
  RNK_CP005_EDITORIAL_V2_SOURCE_FORMS,
  type RnkCp005EditorialV2Question,
} from "./cp005-partial-order-editorial-v2";
import {
  buildRnkCp005PartialOrderState,
  type RnkCp005Context,
} from "./cp005-partial-order-runtime";

const CONTEXTS: readonly RnkCp005Context[] = [
  "MERIT_LIST",
  "INTERVIEW_SHORTLIST",
  "PERFORMANCE_REVIEW",
  "RACE_RESULT",
  "EXAM_SCORE_ORDER",
];

function letter(index: number): string {
  return String.fromCharCode(65 + index);
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function instruction(context: RnkCp005Context, count: number): string {
  switch (context) {
    case "MERIT_LIST": return `${count} candidates are ranked in a merit list from highest to lowest.`;
    case "INTERVIEW_SHORTLIST": return `${count} applicants are ranked in an interview shortlist from highest to lowest.`;
    case "PERFORMANCE_REVIEW": return `${count} employees are ranked from best performance to lowest performance.`;
    case "RACE_RESULT": return `${count} runners are ranked from first finisher to last finisher.`;
    case "EXAM_SCORE_ORDER": return `${count} students are ranked from highest score to lowest score.`;
  }
}

function relationSurface(
  first: string,
  second: string,
  context: RnkCp005Context,
): string {
  switch (context) {
    case "MERIT_LIST": return `${first} is ranked above ${second}`;
    case "INTERVIEW_SHORTLIST": return `${first} has a better interview rank than ${second}`;
    case "PERFORMANCE_REVIEW": return `${first} performed better than ${second}`;
    case "RACE_RESULT": return `${first} finished before ${second}`;
    case "EXAM_SCORE_ORDER": return `${first} scored higher than ${second}`;
  }
}

function clueSurface(
  higher: string,
  lower: string,
  context: RnkCp005Context,
  variant: number,
): string {
  const reverse = variant % 2 === 1;
  if (!reverse) return `${relationSurface(higher, lower, context)}.`;
  switch (context) {
    case "MERIT_LIST": return `${lower} is ranked below ${higher}.`;
    case "INTERVIEW_SHORTLIST": return `${lower} has a worse interview rank than ${higher}.`;
    case "PERFORMANCE_REVIEW": return `${lower} performed worse than ${higher}.`;
    case "RACE_RESULT": return `${lower} finished after ${higher}.`;
    case "EXAM_SCORE_ORDER": return `${lower} scored lower than ${higher}.`;
  }
}

function fixedRankSurface(
  entity: string,
  rank: number,
  context: RnkCp005Context,
): string {
  return context === "RACE_RESULT"
    ? `${entity} finished ${ordinal(rank)}.`
    : `${entity} is ranked ${ordinal(rank)}.`;
}

function optionSurface(label: string, context: RnkCp005Context): string {
  const general = label.match(/^(.+?) ranks above (.+?)\.$/i);
  if (general) {
    return `${relationSurface(general[1]!.trim(), general[2]!.trim(), context)}.`;
  }
  const must = label.match(/^(.+?) must rank above (.+?)\.$/i);
  if (must) {
    return `It must be true that ${relationSurface(
      must[1]!.trim(),
      must[2]!.trim(),
      context,
    )}.`;
  }
  return label;
}

function answerSurface(answer: string, context: RnkCp005Context): string {
  const relation = answer.match(/^(.+?) ranks above (.+)$/i);
  return relation
    ? relationSurface(relation[1]!.trim(), relation[2]!.trim(), context)
    : answer;
}

function renderContext(
  question: RnkCp005EditorialV2Question,
  context: RnkCp005Context,
): RnkCp005EditorialV2Question {
  const state = buildRnkCp005PartialOrderState(question.seed);
  return {
    ...question,
    context,
    instruction: instruction(context, state.entities.length),
    clues: [
      ...state.edges.map((edge, index) =>
        clueSurface(edge.higher, edge.lower, context, question.seed + index),
      ),
      ...state.fixedRanks.map((item) =>
        fixedRankSurface(item.entity, item.rank, context),
      ),
    ],
    options: question.options.map((option) => ({
      ...option,
      label: optionSurface(option.label, context),
    })),
    answer: answerSurface(question.answer, context),
  };
}

const questions = RNK_CP005_EDITORIAL_V2_SOURCE_FORMS.flatMap(
  (sourceForm, sourceIndex) =>
    Array.from({ length: 4 }, (_, localIndex) =>
      renderContext(
        generateRnkCp005EditorialV2Question(sourceForm, localIndex),
        CONTEXTS[(sourceIndex + localIndex) % CONTEXTS.length]!,
      ),
    ),
);

for (const sourceForm of RNK_CP005_EDITORIAL_V2_SOURCE_FORMS) {
  const sample = questions.filter(
    (question) => question.prototypeId === sourceForm,
  );
  if (sample.length !== 4) throw new Error(`${sourceForm}: expected four questions`);
  if (new Set(sample.map((question) => question.context)).size !== 4) {
    throw new Error(`${sourceForm}: expected four contexts`);
  }
  if (new Set(sample.map((question) => question.correctIndex)).size !== 4) {
    throw new Error(`${sourceForm}: expected four answer positions`);
  }
}

function questionBlock(
  question: RnkCp005EditorialV2Question,
  number: number,
): readonly string[] {
  return [
    `## Question ${number}`,
    "",
    `**Provisional authority:** ${question.authorityCandidateId}  `,
    `**Source form:** ${question.prototypeId}  `,
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
    ...question.options.map(
      (option, index) => `${letter(index)}. ${option.label}`,
    ),
    "",
  ];
}

function answerBlock(
  question: RnkCp005EditorialV2Question,
  number: number,
): readonly string[] {
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
      (option, index) =>
        `- **${letter(index)}. ${option.label}** — ${option.explanation}`,
    ),
    "",
  ];
}

const output: string[] = [
  "# RNK-CP-005 Partial Order and Ranking Uncertainty",
  "",
  "## Editorial V2 Human Review — 28 Questions",
  "",
  "Seven source forms are represented, but they are consolidated into four provisional authorities. No permanent QL has been allocated.",
  "",
  "| Provisional authority | Source forms |",
  "|---|---|",
  "| `RELATION_TRUTH_STATUS` | must be true, could be true, cannot be true |",
  "| `RELATIVE_RANK_DETERMINACY` | named-pair relation cannot be determined |",
  "| `POSSIBLE_RANK_BOUND` | highest and lowest possible rank |",
  "| `EXACT_RANK_DETERMINACY` | exact rank or cannot be determined |",
  "",
  `Rejected source form: ${RNK_CP005_EDITORIAL_V2_REJECTED_SOURCE_FORMS.join(", ")}.`,
  "",
  "### V2 gates",
  "",
  "- four distinct comparison pairs in every generic relation question;",
  "- no person occurs in more than two of four generic relation options;",
  "- no anchor-only, direct-clue or direct-reversal answer;",
  "- at least two compulsory predecessors or successors for rank bounds;",
  "- both limit proof and witness proof in every rank-bound solution;",
  "- structural proof for a definite exact rank;",
  "- no permutation-count leakage or ambiguous lower-rank wording;",
  "- Easy, Medium and Hard labels based on the actual proof burden.",
  "",
  "---",
  "",
  "# Part A — Questions",
  "",
];

questions.forEach((question, index) => {
  output.push(...questionBlock(question, index + 1), "---", "");
});

output.push("# Part B — Answers and explanations", "");
questions.forEach((question, index) => {
  output.push(...answerBlock(question, index + 1), "---", "");
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
  "artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/RNK-CP-005/generated/RNK-CP-005-PARTIAL-ORDER-EDITORIAL-V2-REVIEW-28Q.md",
);
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, `${output.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS",
      destination,
      questions: questions.length,
      authorityCandidates: Object.fromEntries(
        RNK_CP005_AUTHORITY_CANDIDATE_IDS.map((authorityId) => [
          authorityId,
          questions.filter(
            (question) => question.authorityCandidateId === authorityId,
          ).length,
        ]),
      ),
      sourceForms: Object.fromEntries(
        RNK_CP005_EDITORIAL_V2_SOURCE_FORMS.map((sourceForm) => [
          sourceForm,
          questions.filter(
            (question) => question.prototypeId === sourceForm,
          ).length,
        ]),
      ),
      answerPositions: [0, 1, 2, 3].map(
        (position) =>
          questions.filter((question) => question.correctIndex === position).length,
      ),
      difficulty: {
        EASY: questions.filter((question) => question.difficulty === "EASY").length,
        MEDIUM: questions.filter((question) => question.difficulty === "MEDIUM").length,
        HARD: questions.filter((question) => question.difficulty === "HARD").length,
      },
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);

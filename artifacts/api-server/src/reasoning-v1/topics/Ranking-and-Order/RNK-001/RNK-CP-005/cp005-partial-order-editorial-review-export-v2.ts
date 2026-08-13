import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  generateRnkCp005EditorialCandidate,
  RNK_CP005_EDITORIAL_CANDIDATE_IDS,
  RNK_CP005_REJECTED_DISCOVERY_IDS,
  type RnkCp005EditorialCandidateId,
} from "./cp005-partial-order-editorial";
import {
  buildRnkCp005PartialOrderState,
  type RnkCp005Context,
  type RnkCp005DiscoveryQuestion,
} from "./cp005-partial-order-runtime";

const REVIEW_CONTEXTS: readonly RnkCp005Context[] = [
  "MERIT_LIST",
  "INTERVIEW_SHORTLIST",
  "PERFORMANCE_REVIEW",
  "RACE_RESULT",
  "EXAM_SCORE_ORDER",
];

function letter(index: number): string {
  return String.fromCharCode(65 + index);
}

function instruction(context: RnkCp005Context, count: number): string {
  switch (context) {
    case "MERIT_LIST":
      return `${count} candidates are ranked in a merit list from highest rank to lowest rank.`;
    case "INTERVIEW_SHORTLIST":
      return `${count} applicants are ranked in an interview shortlist from highest rank to lowest rank.`;
    case "PERFORMANCE_REVIEW":
      return `${count} employees are ranked from best performance to lowest performance.`;
    case "RACE_RESULT":
      return `${count} runners are ranked from first finisher to last finisher.`;
    case "EXAM_SCORE_ORDER":
      return `${count} students are ranked from highest score to lowest score.`;
  }
}

function comparisonText(
  higher: string,
  lower: string,
  context: RnkCp005Context,
  variant: number,
): string {
  const even = variant % 2 === 0;
  switch (context) {
    case "MERIT_LIST":
      return even
        ? `${higher} is ranked above ${lower}.`
        : `${lower} has a lower merit rank than ${higher}.`;
    case "INTERVIEW_SHORTLIST":
      return even
        ? `${higher} is placed above ${lower} in the shortlist.`
        : `${higher} has a better interview rank than ${lower}.`;
    case "PERFORMANCE_REVIEW":
      return even
        ? `${higher} is ranked above ${lower} for performance.`
        : `${higher} performed better than ${lower}.`;
    case "RACE_RESULT":
      return even
        ? `${higher} finished before ${lower}.`
        : `${lower} finished after ${higher}.`;
    case "EXAM_SCORE_ORDER":
      return even
        ? `${higher} scored higher than ${lower}.`
        : `${lower} obtained a lower score rank than ${higher}.`;
  }
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function fixedRankText(
  entity: string,
  rank: number,
  context: RnkCp005Context,
): string {
  if (context === "RACE_RESULT") return `${entity} finished ${ordinal(rank)}.`;
  return `${entity} is ranked ${ordinal(rank)}.`;
}

function relationSurface(label: string, context: RnkCp005Context): string {
  const match = label.match(/^(.+?) ranks above (.+?)\.?$/i);
  if (!match) return label;
  const higher = match[1]!.trim();
  const lower = match[2]!.replace(/\.$/, "").trim();
  switch (context) {
    case "RACE_RESULT": return `${higher} finished before ${lower}.`;
    case "EXAM_SCORE_ORDER": return `${higher} scored higher than ${lower}.`;
    case "PERFORMANCE_REVIEW": return `${higher} performed better than ${lower}.`;
    case "INTERVIEW_SHORTLIST": return `${higher} has a better interview rank than ${lower}.`;
    case "MERIT_LIST": return `${higher} is ranked above ${lower}.`;
  }
}

function answerSurface(answer: string, context: RnkCp005Context): string {
  const above = answer.match(/^(.+?) (?:is ranked above|can rank above) (.+)$/i);
  if (above) {
    return relationSurface(`${above[1]} ranks above ${above[2]}.`, context).replace(/\.$/, "");
  }
  const impossible = answer.match(/^(.+?) cannot rank above (.+)$/i);
  if (!impossible) return answer;
  const first = impossible[1]!.trim();
  const second = impossible[2]!.trim();
  switch (context) {
    case "RACE_RESULT": return `${first} cannot finish before ${second}`;
    case "EXAM_SCORE_ORDER": return `${first} cannot score higher than ${second}`;
    case "PERFORMANCE_REVIEW": return `${first} cannot perform better than ${second}`;
    case "INTERVIEW_SHORTLIST": return `${first} cannot have a better interview rank than ${second}`;
    case "MERIT_LIST": return `${first} cannot rank above ${second}`;
  }
}

function renderInContext(
  question: RnkCp005DiscoveryQuestion,
  context: RnkCp005Context,
): RnkCp005DiscoveryQuestion {
  const state = buildRnkCp005PartialOrderState(question.seed);
  const clues = [
    ...state.edges.map((edge, index) =>
      comparisonText(edge.higher, edge.lower, context, question.seed + index),
    ),
    ...state.fixedRanks.map((item) => fixedRankText(item.entity, item.rank, context)),
  ];
  const options = question.options.map((option) => ({
    ...option,
    label: relationSurface(option.label, context),
  }));
  return {
    ...question,
    context,
    instruction: instruction(context, state.entities.length),
    clues,
    options,
    answer: answerSurface(question.answer, context),
  };
}

function selectReviewQuestions(
  prototypeId: RnkCp005EditorialCandidateId,
  prototypeIndex: number,
): readonly RnkCp005DiscoveryQuestion[] {
  return Array.from({ length: 4 }, (_, localIndex) => {
    const base = generateRnkCp005EditorialCandidate(prototypeId, localIndex);
    const context = REVIEW_CONTEXTS[(prototypeIndex + localIndex) % REVIEW_CONTEXTS.length]!;
    return renderInContext(base, context);
  });
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

const questions = RNK_CP005_EDITORIAL_CANDIDATE_IDS.flatMap(
  (prototypeId, prototypeIndex) =>
    selectReviewQuestions(prototypeId, prototypeIndex),
);

for (const prototypeId of RNK_CP005_EDITORIAL_CANDIDATE_IDS) {
  const familyQuestions = questions.filter(
    (question) => question.prototypeId === prototypeId,
  );
  if (familyQuestions.length !== 4) {
    throw new Error(`${prototypeId}: expected four review questions`);
  }
  if (new Set(familyQuestions.map((question) => question.context)).size !== 4) {
    throw new Error(`${prototypeId}: expected four distinct review contexts`);
  }
  if (new Set(familyQuestions.map((question) => question.correctIndex)).size !== 4) {
    throw new Error(`${prototypeId}: expected all four answer positions`);
  }
}

const output: string[] = [
  "# RNK-CP-005 Partial Order and Ranking Uncertainty",
  "",
  "## Editorial Candidate Review — 28 Questions",
  "",
  "This pack contains four questions from each of seven surviving discovery families. No permanent QL has been allocated.",
  "",
  `Rejected during self-review: ${RNK_CP005_REJECTED_DISCOVERY_IDS.join(", ")}. It repeatedly produced the same multiple-order conclusion and overlapped existing order-reconstruction ownership.`,
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
        REVIEW_CONTEXTS.map((context) => [
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

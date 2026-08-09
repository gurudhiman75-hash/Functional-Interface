import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  generateRnkCp005EditorialV2Question,
  RNK_CP005_AUTHORITY_CANDIDATE_IDS,
  RNK_CP005_EDITORIAL_V2_REJECTED_SOURCE_FORMS,
  RNK_CP005_EDITORIAL_V2_SOURCE_FORMS,
  type RnkCp005EditorialV2Question,
  type RnkCp005EditorialV2SourceForm,
} from "./cp005-partial-order-editorial-v2";
import {
  buildRnkCp005PartialOrderState,
  type RnkCp005Context,
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
      return `${count} candidates are ranked in a merit list from highest to lowest.`;
    case "INTERVIEW_SHORTLIST":
      return `${count} applicants are ranked in an interview shortlist from highest to lowest.`;
    case "PERFORMANCE_REVIEW":
      return `${count} employees are ranked from best performance to lowest performance.`;
    case "RACE_RESULT":
      return `${count} runners are ranked from first finisher to last finisher.`;
    case "EXAM_SCORE_ORDER":
      return `${count} students are ranked from highest score to lowest score.`;
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

function comparisonText(
  higher: string,
  lower: string,
  context: RnkCp005Context,
  variant: number,
): string {
  const direct = variant % 2 === 0;
  switch (context) {
    case "MERIT_LIST":
      return direct
        ? `${higher} is ranked above ${lower}.`
        : `${lower} is ranked below ${higher}.`;
    case "INTERVIEW_SHORTLIST":
      return direct
        ? `${higher} has a better interview rank than ${lower}.`
        : `${lower} has a worse interview rank than ${higher}.`;
    case "PERFORMANCE_REVIEW":
      return direct
        ? `${higher} performed better than ${lower}.`
        : `${lower} performed worse than ${higher}.`;
    case "RACE_RESULT":
      return direct
        ? `${higher} finished before ${lower}.`
        : `${lower} finished after ${higher}.`;
    case "EXAM_SCORE_ORDER":
      return direct
        ? `${higher} scored higher than ${lower}.`
        : `${lower} scored lower than ${higher}.`;
  }
}

function fixedRankText(
  entity: string,
  rank: number,
  context: RnkCp005Context,
): string {
  if (context === "RACE_RESULT") return `${entity} finished ${ordinal(rank)}.`;
  return `${entity} is ranked ${ordinal(rank)}.`;
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

function renderRelationLabel(
  label: string,
  context: RnkCp005Context,
): string {
  const general = label.match(/^(.+?) ranks above (.+?)\.$/i);
  if (general) {
    return `${relationSurface(general[1]!.trim(), general[2]!.trim(), context)}.`;
  }
  const must = label.match(/^(.+?) must rank above (.+?)\.$/i);
  if (must) {
    return `${relationSurface(must[1]!.trim(), must[2]!.trim(), context)} in every valid ranking.`;
  }
  return label;
}

function renderAnswer(answer: string, context: RnkCp005Context): string {
  const relation = answer.match(/^(.+?) ranks above (.+)$/i);
  if (!relation) return answer;
  return relationSurface(
    relation[1]!.trim(),
    relation[2]!.trim(),
    context,
  );
}

function renderInContext(
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
        comparisonText(
          edge.higher,
          edge.lower,
          context,
          question.seed + index,
        ),
      ),
      ...state.fixedRanks.map((item) =>
        fixedRankText(item.entity, item.rank, context),
      ),
    ],
    options: question.options.map((option) => ({
      ...option,
      label: renderRelationLabel(option.label, context),
    })),
    answer: renderAnswer(question.answer, context),
  };
}

function selectReviewQuestions(
  sourceForm: RnkCp005EditorialV2SourceForm,
  sourceIndex: number,
): readonly RnkCp005EditorialV2Question[] {
  return Array.from({ length: 4 }, (_, localIndex) => {
    const question = generateRnkCp005EditorialV2Question(
      sourceForm,
      localIndex,
    );
    const context = REVIEW_CONTEXTS[
      (sourceIndex + localIndex) % REVIEW_CONTEXTS.length
    ]!;
    return renderInContext(question, context);
  });
}

function renderQuestion(
  question: RnkCp005EditorialV2Question,
  number: number,
): string[] {
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

function renderAnswer(
  question: RnkCp005EditorialV2Question,
  number: number,
): string[] {
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

const questions = RNK_CP005_EDITORIAL_V2_SOURCE_FORMS.flatMap(
  (sourceForm, sourceIndex) =>
    selectReviewQuestions(sourceForm, sourceIndex),
);

for (const sourceForm of RNK_CP005_EDITORIAL_V2_SOURCE_FORMS) {
  const familyQuestions = questions.filter(
    (question) => question.prototypeId === sourceForm,
  );
  if (familyQuestions.length !== 4) {
    throw new Error(`${sourceForm}: expected four review questions`);
  }
  if (new Set(familyQuestions.map((question) => question.context)).size !== 4) {
    throw new Error(`${sourceForm}: expected four distinct contexts`);
  }
  if (new Set(familyQuestions.map((question) => question.correctIndex)).size !== 4) {
    throw new Error(`${sourceForm}: expected all four answer positions`);
  }
}

const output: string[] = [
  "# RNK-CP-005 Partial Order and Ranking Uncertainty",
  "",
  "## Editorial V2 Human Review — 28 Questions",
  "",
  "This pack contains four questions from each of seven source forms, grouped into four provisional authorities. No permanent QL has been allocated.",
  "",
  "### Provisional authority consolidation",
  "",
  "| Authority candidate | Included source forms |",
  "|---|---|",
  "| `RELATION_TRUTH_STATUS` | must be true, could be true, cannot be true |",
  "| `RELATIVE_RANK_DETERMINACY` | named-pair relation cannot be determined |",
  "| `POSSIBLE_RANK_BOUND` | highest and lowest possible rank |",
  "| `EXACT_RANK_DETERMINACY` | exact rank or cannot be determined |",
  "",
  `Rejected source form: ${RNK_CP005_EDITORIAL_V2_REJECTED_SOURCE_FORMS.join(", ")}.`,
  "",
  "### V2 corrections already enforced",
  "",
  "- generic relation questions use four distinct comparison pairs;",
  "- no person appears in more than two of four generic relation options;",
  "- must-be-true and cannot-be-true answers cannot come only from an endpoint anchor;",
  "- direct clue repetition and direct clue reversal are rejected;",
  "- possible-rank questions require at least two compulsory predecessors or successors;",
  "- rank-bound solutions prove both the limit and its attainability;",
  "- definite-rank solutions use structural proof rather than two examples;",
  "- learner explanations do not expose permutation counts;",
  "- ambiguous phrases such as ‘lower merit rank’ and ‘lower score rank’ are excluded;",
  "- difficulty is based on proof burden rather than merely the number of names.",
  "",
  "### Human review focus",
  "",
  "- Do the four option pairs feel naturally balanced rather than mechanically generated?",
  "- Does each question require genuine partial-order reasoning?",
  "- Are the difficulty labels realistic for SSC, banking and state exams?",
  "- Are all explanations quick, complete and student-friendly?",
  "- Should the four authority candidates remain separate after source validation?",
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
      sourceForms: Object.fromEntries(
        RNK_CP005_EDITORIAL_V2_SOURCE_FORMS.map((sourceForm) => [
          sourceForm,
          questions.filter((question) => question.prototypeId === sourceForm).length,
        ]),
      ),
      authorityCandidates: Object.fromEntries(
        RNK_CP005_AUTHORITY_CANDIDATE_IDS.map((authorityId) => [
          authorityId,
          questions.filter(
            (question) => question.authorityCandidateId === authorityId,
          ).length,
        ]),
      ),
      contexts: Object.fromEntries(
        REVIEW_CONTEXTS.map((context) => [
          context,
          questions.filter((question) => question.context === context).length,
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

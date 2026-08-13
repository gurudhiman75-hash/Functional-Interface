import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  buildRnkCp005EditorialV3State,
  generateRnkCp005EditorialV3ReleaseQuestion,
  RNK_CP005_EDITORIAL_V3_REJECTED_SOURCE_FORMS,
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS,
  type RnkCp005EditorialV3Question,
  type RnkCp005EditorialV3SourceForm,
} from "./cp005-partial-order-editorial-v3-release";
import type { RnkCp005Context } from "./cp005-partial-order-runtime";

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
    case "MERIT_LIST": return `${count} candidates are ranked in a merit list from highest to lowest.`;
    case "INTERVIEW_SHORTLIST": return `${count} applicants are ranked in an interview shortlist from highest to lowest.`;
    case "PERFORMANCE_REVIEW": return `${count} employees are ranked from best performance to lowest performance.`;
    case "RACE_RESULT": return `${count} runners are ranked from first finisher to last finisher.`;
    case "EXAM_SCORE_ORDER": return `${count} students are ranked from highest score to lowest score.`;
  }
}

function comparisonText(
  higher: string,
  lower: string,
  context: RnkCp005Context,
  variant: number,
): string {
  const direct = variant % 2 === 0;
  switch (context) {
    case "MERIT_LIST": return direct ? `${higher} is ranked above ${lower}.` : `${lower} is ranked below ${higher}.`;
    case "INTERVIEW_SHORTLIST": return direct ? `${higher} has a better interview rank than ${lower}.` : `${lower} has a worse interview rank than ${higher}.`;
    case "PERFORMANCE_REVIEW": return direct ? `${higher} performed better than ${lower}.` : `${lower} performed worse than ${higher}.`;
    case "RACE_RESULT": return direct ? `${higher} finished before ${lower}.` : `${lower} finished after ${higher}.`;
    case "EXAM_SCORE_ORDER": return direct ? `${higher} scored higher than ${lower}.` : `${lower} scored lower than ${higher}.`;
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

function mustSurface(
  first: string,
  second: string,
  context: RnkCp005Context,
): string {
  switch (context) {
    case "MERIT_LIST": return `${first} must rank above ${second}`;
    case "INTERVIEW_SHORTLIST": return `${first} must have a better interview rank than ${second}`;
    case "PERFORMANCE_REVIEW": return `${first} must perform better than ${second}`;
    case "RACE_RESULT": return `${first} must finish before ${second}`;
    case "EXAM_SCORE_ORDER": return `${first} must score higher than ${second}`;
  }
}

function renderLabel(label: string, context: RnkCp005Context): string {
  const relation = label.match(/^(.+?) ranks above (.+?)\.$/i);
  if (relation) {
    return `${relationSurface(relation[1]!.trim(), relation[2]!.trim(), context)}.`;
  }
  const must = label.match(/^(.+?) must rank above (.+?)\.$/i);
  if (must) {
    return `${mustSurface(must[1]!.trim(), must[2]!.trim(), context)}.`;
  }
  return label;
}

function renderAnswer(answer: string, context: RnkCp005Context): string {
  const relation = answer.match(/^(.+?) ranks above (.+)$/i);
  if (relation) {
    return relationSurface(relation[1]!.trim(), relation[2]!.trim(), context);
  }
  const must = answer.match(/^(.+?) must rank above (.+)$/i);
  if (must) {
    return mustSurface(must[1]!.trim(), must[2]!.trim(), context);
  }
  return answer;
}

function contextualize(line: string, context: RnkCp005Context): string {
  if (context === "RACE_RESULT") {
    return line
      .replace(/must both rank above/g, "must both finish before")
      .replace(/must rank above/g, "must finish before")
      .replace(/must both rank below/g, "must both finish after")
      .replace(/must rank below/g, "must finish after")
      .replace(/can never rank above/g, "can never finish before");
  }
  if (context === "PERFORMANCE_REVIEW") {
    return line
      .replace(/must both rank above/g, "must both perform better than")
      .replace(/must rank above/g, "must perform better than")
      .replace(/must both rank below/g, "must both perform worse than")
      .replace(/must rank below/g, "must perform worse than")
      .replace(/can never rank above/g, "can never perform better than");
  }
  if (context === "EXAM_SCORE_ORDER") {
    return line
      .replace(/must both rank above/g, "must both score higher than")
      .replace(/must rank above/g, "must score higher than")
      .replace(/must both rank below/g, "must both score lower than")
      .replace(/must rank below/g, "must score lower than")
      .replace(/can never rank above/g, "can never score higher than");
  }
  if (context === "INTERVIEW_SHORTLIST") {
    return line
      .replace(/must both rank above/g, "must both have a better interview rank than")
      .replace(/must rank above/g, "must have a better interview rank than")
      .replace(/must both rank below/g, "must both have a worse interview rank than")
      .replace(/must rank below/g, "must have a worse interview rank than");
  }
  return line;
}

function renderInContext(
  question: RnkCp005EditorialV3Question,
  context: RnkCp005Context,
): RnkCp005EditorialV3Question {
  const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
  if (!state) throw new Error(`${question.discoveryId}: missing V3 state`);
  return {
    ...question,
    context,
    instruction: instruction(context, state.entities.length),
    clues: state.edges.map((edge, index) =>
      comparisonText(edge.higher, edge.lower, context, question.seed + index),
    ),
    options: question.options.map((option) => ({
      ...option,
      label: renderLabel(option.label, context),
      explanation: contextualize(option.explanation, context),
    })),
    answer: renderAnswer(question.answer, context),
    explanation: question.explanation.map((line) => contextualize(line, context)),
  };
}

function chooseReviewSet(
  sourceForm: RnkCp005EditorialV3SourceForm,
): readonly RnkCp005EditorialV3Question[] {
  const candidates = Array.from({ length: 24 }, (_, ordinal) =>
    generateRnkCp005EditorialV3ReleaseQuestion(sourceForm, ordinal),
  );
  const selected: RnkCp005EditorialV3Question[] = [];

  const visit = (position: number): boolean => {
    if (position === 4) {
      if (new Set(selected.map((question) => question.v3Topology)).size !== 4) return false;
      if (sourceForm === "PAIR_RELATION_CANNOT_BE_DETERMINED") {
        return new Set(selected.map((question) => question.pairStatusMode)).size === 3;
      }
      return true;
    }
    for (const candidate of candidates.filter((question) => question.correctIndex === position)) {
      if (selected.some((question) => question.v3Topology === candidate.v3Topology)) continue;
      selected.push(candidate);
      if (visit(position + 1)) return true;
      selected.pop();
    }
    return false;
  };

  if (!visit(0)) {
    throw new Error(`${sourceForm}: unable to select a four-question topology-diverse release set`);
  }
  return [...selected];
}

function sourceDisplay(question: RnkCp005EditorialV3Question): string[] {
  if (question.prototypeId !== "PAIR_RELATION_CANNOT_BE_DETERMINED") {
    return [`**Source form:** ${question.prototypeId}  `];
  }
  return [
    "**Source form:** PAIR_RELATION_STATUS  ",
    "**Legacy discovery ID:** PAIR_RELATION_CANNOT_BE_DETERMINED  ",
  ];
}

function renderQuestion(
  question: RnkCp005EditorialV3Question,
  number: number,
): string[] {
  const metadata = [
    `**Provisional authority:** ${question.authorityCandidateId}  `,
    ...sourceDisplay(question),
    `**Topology:** ${question.v3Topology}  `,
    `**Context:** ${question.context}  `,
    `**Difficulty:** ${question.difficulty}`,
  ];
  if (question.pairStatusMode) {
    metadata.push(`**Pair-status mode:** ${question.pairStatusMode}`);
  }
  return [
    `## Question ${number}`,
    "",
    ...metadata,
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

function renderAnswerBlock(
  question: RnkCp005EditorialV3Question,
  number: number,
): string[] {
  return [
    `## Question ${number} — ${question.prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED" ? "PAIR_RELATION_STATUS" : question.prototypeId}`,
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

const questions = RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.flatMap(
  (sourceForm, sourceIndex) =>
    chooseReviewSet(sourceForm).map((question, localIndex) =>
      renderInContext(
        question,
        REVIEW_CONTEXTS[(sourceIndex + localIndex) % REVIEW_CONTEXTS.length]!,
      ),
    ),
);

for (const source of RNK_CP005_EDITORIAL_V3_SOURCE_FORMS) {
  const family = questions.filter((question) => question.prototypeId === source);
  if (family.length !== 4) throw new Error(`${source}: expected four review questions`);
  if (new Set(family.map((question) => question.correctIndex)).size !== 4) {
    throw new Error(`${source}: expected all four answer positions`);
  }
  if (new Set(family.map((question) => question.v3Topology)).size !== 4) {
    throw new Error(`${source}: expected four distinct topologies`);
  }
  if (new Set(family.map((question) => question.context)).size !== 4) {
    throw new Error(`${source}: expected four distinct contexts`);
  }
}

const pairQuestions = questions.filter(
  (question) => question.prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED",
);
if (new Set(pairQuestions.map((question) => question.pairStatusMode)).size !== 3) {
  throw new Error("Release review must contain all three pair-status outcomes");
}

const output: string[] = [
  "# RNK-CP-005 Partial Order and Ranking Uncertainty",
  "",
  "## Editorial V3 Release Human Review — 28 Questions",
  "",
  "This pack contains four questions from each of seven discovery source forms, consolidated into three provisional authorities. No permanent QL has been allocated.",
  "",
  "### Provisional authority consolidation",
  "",
  "| Authority candidate | Included query modes |",
  "|---|---|",
  "| `RELATION_TRUTH_STATUS` | must/could/cannot relation queries plus named-pair relation status |",
  "| `POSSIBLE_RANK_BOUND` | highest/lowest possible rank |",
  "| `EXACT_RANK_DETERMINACY` | exact rank or cannot be determined |",
  "",
  `Rejected source form: ${RNK_CP005_EDITORIAL_V3_REJECTED_SOURCE_FORMS.join(", ")}.`,
  "",
  "### Release gates",
  "",
  "- generic relation options use four distinct pairs and no person appears more than twice;",
  "- must-be-true uses at least two possible-but-not-compulsory distractors;",
  "- could-be-true wrong options require multi-step contradiction and never directly reverse a displayed clue;",
  "- cannot-be-true wrong options are all possible-but-not-compulsory;",
  "- named-pair status questions include first-above, second-above and indeterminate outcomes with varied rank-gap distractors;",
  "- rank bounds require at least three compulsory people, branch integration and a transitive compulsory relation;",
  "- boundary solutions prove both the limit and attainability;",
  "- definite exact ranks require transitive structural evidence; indeterminate exact ranks use two valid witnesses;",
  "- every source-form sample spans four different graph topologies;",
  "- difficulty follows proof depth rather than entity count.",
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
  output.push(...renderAnswerBlock(question, index + 1), "---", "");
});

const destination = resolve(
  process.cwd(),
  "artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/RNK-CP-005/generated/RNK-CP-005-PARTIAL-ORDER-EDITORIAL-V3-RELEASE-REVIEW-28Q.md",
);
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, `${output.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS",
      destination,
      questions: questions.length,
      answerPositions: [0, 1, 2, 3].map(
        (position) => questions.filter((question) => question.correctIndex === position).length,
      ),
      distinctTopologiesPerFamily: Object.fromEntries(
        RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.map((source) => [
          source,
          new Set(
            questions
              .filter((question) => question.prototypeId === source)
              .map((question) => question.v3Topology),
          ).size,
        ]),
      ),
      pairStatusModes: Object.fromEntries(
        ["FIRST_ABOVE", "SECOND_ABOVE", "INDETERMINATE"].map((mode) => [
          mode,
          pairQuestions.filter((question) => question.pairStatusMode === mode).length,
        ]),
      ),
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);

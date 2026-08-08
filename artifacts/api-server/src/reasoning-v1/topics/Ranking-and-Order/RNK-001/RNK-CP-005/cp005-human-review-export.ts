import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  type RnkCp005AuthorityId,
  type RnkCp005ContextFamily,
  type RnkCp005Question,
  type RnkCp005SharedPassage,
} from "./cp005-foundation";
import { generateRnkCp005ExamReadyQuestion } from "./cp005-exam-language-v1";

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

function comparisonText(
  context: RnkCp005ContextFamily,
  earlier: string,
  later: string,
): string {
  switch (context) {
    case "ROW":
      return `${earlier} is to the left of ${later}.`;
    case "QUEUE":
      return `${earlier} is ahead of ${later} in the queue.`;
    case "RACE_FINISH":
      return `${earlier} finished before ${later}.`;
    case "MERIT_LIST":
      return `${earlier} is ranked above ${later} in the merit list.`;
    case "INTERVIEW_SHORTLIST":
      return `${earlier} is ranked above ${later} in the shortlist.`;
    case "PERFORMANCE_ORDER":
      return `${earlier} is ranked above ${later} in performance.`;
  }
}

function renderPassage(passage: RnkCp005SharedPassage): string[] {
  const lines = [
    `### ${passage.title}`,
    "",
    passage.instruction,
    "",
  ];

  if (passage.presentationMode === "RANK_TABLE") {
    lines.push("| Name | Displayed position |", "|---|---:|");
    for (const row of passage.rankRows) {
      lines.push(`| ${row.entity} | ${row.positionLabel} |`);
    }
  } else if (passage.presentationMode === "ORDER_LEDGER") {
    for (const row of passage.rankRows) {
      lines.push(`${row.rankFromStart}. ${row.entity}`);
    }
  } else {
    passage.comparisons.forEach((comparison, index) => {
      lines.push(
        `${index + 1}. ${comparisonText(
          passage.contextFamily,
          comparison.earlier,
          comparison.later,
        )}`,
      );
    });
  }

  lines.push("");
  return lines;
}

function renderQuestion(
  question: RnkCp005Question,
  globalNumber: number,
): string[] {
  const lines = [
    `#### Question ${globalNumber}`,
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

function renderAnswer(
  question: RnkCp005Question,
  globalNumber: number,
): string[] {
  const explanation = question.visibleExplanation;
  return [
    `### Question ${globalNumber} — ${QL_BY_AUTHORITY[question.authorityId]}`,
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
  "# RNK-CP-005 Human Review Pack",
  "",
  "Exact source head: `d3092c904acefdbc6b7ad6bc36228bc9301bc06d`",
  "",
  "This pack contains six shared ranking sets and 24 linked questions. It covers all six CP-005 contexts, all three presentation modes, and each permanent authority exactly three times.",
  "",
  "## Suggested review checks",
  "",
  "For every question, check: natural exam wording; one unambiguous answer; realistic distractors; correct option; student-friendly explanation; useful option analysis; and whether the shared passage is reused naturally.",
  "",
  "---",
  "",
  "# Part A — Questions only",
  "",
];

let globalQuestionNumber = 1;
generatedSets.forEach((set, setIndex) => {
  const passage = set.questions[0]!.sharedPassage;
  output.push(
    `## Shared Set ${setIndex + 1}`,
    "",
    `**Context:** ${passage.contextFamily}  `,
    `**Presentation:** ${passage.presentationMode}  `,
    `**Questions in this set:** 4`,
    "",
    ...renderPassage(passage),
  );
  set.questions.forEach((question) => {
    output.push(...renderQuestion(question, globalQuestionNumber));
    globalQuestionNumber += 1;
  });
  output.push("---", "");
});

output.push("# Part B — Answers and explanations", "");
globalQuestionNumber = 1;
generatedSets.forEach((set, setIndex) => {
  output.push(`## Shared Set ${setIndex + 1}`, "");
  set.questions.forEach((question) => {
    output.push(...renderAnswer(question, globalQuestionNumber));
    globalQuestionNumber += 1;
  });
  output.push("---", "");
});

output.push(
  "# Review response template",
  "",
  "Use this compact format for each issue you find:",
  "",
  "```text",
  "Question number:",
  "Issue type: stem / passage / option / answer / explanation / difficulty",
  "What feels wrong:",
  "Suggested correction:",
  "```",
  "",
);

const destination = resolve(
  process.cwd(),
  "artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/RNK-CP-005/generated/RNK-CP-005-HUMAN-REVIEW-PACK-24Q.md",
);
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, `${output.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS",
      destination,
      sharedSets: generatedSets.length,
      questions: generatedSets.reduce((sum, set) => sum + set.questions.length, 0),
      contexts: [...new Set(generatedSets.map((set) => set.questions[0]!.sharedPassage.contextFamily))],
      presentationModes: [...new Set(generatedSets.map((set) => set.questions[0]!.sharedPassage.presentationMode))],
      authorityCounts: Object.fromEntries(
        Object.keys(QL_BY_AUTHORITY).map((authorityId) => [
          authorityId,
          generatedSets.flatMap((set) => set.questions).filter((question) => question.authorityId === authorityId).length,
        ]),
      ),
    },
    null,
    2,
  ),
);

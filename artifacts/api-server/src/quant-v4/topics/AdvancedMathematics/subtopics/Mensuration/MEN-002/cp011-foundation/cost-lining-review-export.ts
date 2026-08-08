import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_COST_LINING_AUTHORITY,
  auditMenCp011CostBatch,
  generateMenCp011CostReviewBatch,
} from "./cost-lining";

const review = generateMenCp011CostReviewBatch();
const audit = auditMenCp011CostBatch(review.records);
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp011-cost-lining-wave01-review",
);
mkdirSync(dirname(outputBase), { recursive: true });

const replacer = (_key: string, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

writeFileSync(
  `${outputBase}.json`,
  JSON.stringify(
    {
      authority: MEN_CP011_COST_LINING_AUTHORITY,
      generatedAt: new Date().toISOString(),
      audit,
      records: review.records,
    },
    replacer,
    2,
  ),
  "utf8",
);

const lines: string[] = [
  "# MEN-CP-011 Cost and Lining — Wave 01 Review",
  "",
  "## Audit",
  "",
  "```text",
  `Authority:                      ${MEN_CP011_COST_LINING_AUTHORITY}`,
  `Runtime prototypes:             ${audit.prototypeCount}`,
  `Review records:                 ${audit.recordCount}`,
  `Unique exact stems:             ${audit.exactStemCount}`,
  `Unique stem-option packages:    ${audit.exactQuestionOptionCount}`,
  `Maximum normalized repetition: ${audit.maximumNormalizedStemRepetition}`,
  `Unique physical states:         ${audit.uniquePhysicalStateCount}`,
  `Pi policies:                    22/7 ${audit.piPolicyCounts.PI_22_OVER_7}, 3.14 ${audit.piPolicyCounts.PI_3_14}`,
  `Correct positions:              A${audit.answerPositionCounts.A} B${audit.answerPositionCounts.B} C${audit.answerPositionCounts.C} D${audit.answerPositionCounts.D}`,
  "Permanent QLs:                  0",
  "Question Studio:                disabled",
  "Question Bank:                  NOT_STORED",
  "Test eligibility:               INELIGIBLE",
  "Public publication:             false",
  "```",
  "",
  "## Review records",
  "",
];

for (const [index, question] of review.records.entries()) {
  lines.push(
    `### ${index + 1}. ${question.prototypeId}`,
    "",
    `- Seed: \`${question.seed}\``,
    `- Context: \`${question.state.context}\``,
    `- Pi policy: \`${question.piPolicy}\``,
    `- Fixture: \`${question.state.fixtureId}\``,
    `- Correct option: \`${question.options[question.correctIndex]?.label}\``,
    "",
    question.stem,
    "",
  );
  for (const option of question.options) {
    lines.push(
      `${option.label}. ${option.display}${option.isCorrect ? " **(correct)**" : ""}`,
    );
  }
  lines.push(
    "",
    `**Answer:** ${question.answer}`,
    "",
    `**Key rule:** ${question.explanation.keyRule}`,
    "",
  );
  for (const step of question.explanation.steps) {
    lines.push(
      `- **${step.title}:** ${step.body}${step.equation ? ` ${step.equation}` : ""}`,
    );
  }
  lines.push(
    "",
    `**Exam speed shortcut:** ${question.explanation.shortcut}`,
    "",
    "**Wrong-option analysis:**",
    "",
    ...question.learnerSolution.wrongOptionAnalysis.map((line) => `- ${line}`),
    "",
    `**Verification:** ${question.verification.reconstructed}`,
    "",
    "---",
    "",
  );
}

writeFileSync(`${outputBase}.md`, lines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      authority: MEN_CP011_COST_LINING_AUTHORITY,
      records: review.records.length,
      prototypes: audit.prototypeCount,
      exactStems: audit.exactStemCount,
      uniquePhysicalStates: audit.uniquePhysicalStateCount,
      answerPositionCounts: audit.answerPositionCounts,
      piPolicyCounts: audit.piPolicyCounts,
      publicationEligible: audit.publicationEligible,
      outputJson: `${outputBase}.json`,
      outputMarkdown: `${outputBase}.md`,
    },
    null,
    2,
  ),
);
